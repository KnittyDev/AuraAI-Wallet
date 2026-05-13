import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Use Service Role Key for administrative tasks in the webhook
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-nowpayments-sig");
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;

    if (!ipnSecret) {
      console.error("NOWPAYMENTS_IPN_SECRET is not set");
      return new Response("Internal Server Error", { status: 500 });
    }

    if (!signature) {
      console.error("Missing x-nowpayments-sig header");
      return new Response("Unauthorized", { status: 401 });
    }

    // Verify HMAC-SHA512 signature
    const hmac = crypto.createHmac("sha512", ipnSecret);
    hmac.update(rawBody);
    const expectedSignature = hmac.digest("hex");

    // Important: NOWPayments IPN signature verification
    // Some versions of NOWPayments might send the signature based on a sorted JSON string.
    // However, the standard way is signing the raw body.
    if (signature !== expectedSignature) {
      console.error("NOWPayments signature verification failed");
      // For debugging: console.log("Expected:", expectedSignature, "Received:", signature);
      return new Response("Unauthorized", { status: 401 });
    }

    const data = JSON.parse(rawBody);
    console.log("NOWPayments IPN received:", data);

    const transactionId = data.order_id;
    const paymentStatus = data.payment_status;

    // Statuses that represent a successful payment in NOWPayments:
    // "finished" - funds are sent to your wallet
    // "confirmed" - funds are received but not yet sent to your personal wallet (safe to credit user)
    if (paymentStatus === "finished" || paymentStatus === "confirmed") {
      console.log(`Payment successful for Order ID: ${transactionId}, Status: ${paymentStatus}`);
      
      // 1. Fetch the transaction from our database
      const { data: tx, error: txFetchError } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (txFetchError || !tx) {
        console.error("Transaction not found in database:", transactionId);
        return new Response("Transaction Not Found", { status: 404 });
      }

      if (tx.status === 'Completed') {
        console.log("Transaction already processed.");
        return new Response("Already Processed", { status: 200 });
      }

      // 2. Update Transaction Status
      const { error: txUpdateError } = await supabaseAdmin
        .from('transactions')
        .update({ 
          status: 'Completed',
          tx_id: data.actually_paid?.toString() ? data.payin_hash : tx.tx_id,
          amount: data.actually_paid || tx.amount // Use actual paid amount if provided
        })
        .eq('id', transactionId);

      if (txUpdateError) {
        console.error("Failed to update transaction status:", txUpdateError);
        return new Response("Database Error", { status: 500 });
      }

      // 3. Update User Balance
      const { data: balance, error: balanceFetchError } = await supabaseAdmin
        .from('balances')
        .select('*')
        .eq('user_id', tx.user_id)
        .eq('asset_code', tx.asset)
        .single();

      const creditAmount = Number(data.actually_paid || tx.amount);

      if (balance) {
        // Increment existing balance
        const newAmount = Number(balance.amount) + creditAmount;
        await supabaseAdmin
          .from('balances')
          .update({ amount: newAmount, updated_at: new Date().toISOString() })
          .eq('id', balance.id);
      } else {
        // Create new balance record
        await supabaseAdmin
          .from('balances')
          .insert({
            user_id: tx.user_id,
            asset_code: tx.asset,
            amount: creditAmount
          });
      }

      console.log(`Successfully credited ${creditAmount} ${tx.asset} to user ${tx.user_id}`);

    } else if (paymentStatus === "failed" || paymentStatus === "expired" || paymentStatus === "rejected") {
      // Payment failed or canceled
      await supabaseAdmin
        .from('transactions')
        .update({ status: 'Failed' })
        .eq('id', transactionId);
      console.log(`Payment failed for Order ID: ${transactionId}, Status: ${paymentStatus}`);
    } else {
      console.log(`Payment status for Order ID ${transactionId} is ${paymentStatus}. No action taken.`);
    }

    return new Response("ok", { status: 200 });

  } catch (error) {
    console.error("NOWPayments Webhook error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
