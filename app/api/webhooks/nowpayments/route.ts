import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    // Initialize Supabase Admin inside the handler to avoid build-time errors
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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

    if (signature !== expectedSignature) {
      console.error("NOWPayments signature verification failed");
      return new Response("Unauthorized", { status: 401 });
    }

    const data = JSON.parse(rawBody);
    console.log("NOWPayments IPN received:", data);

    const transactionId = data.order_id;
    const paymentStatus = data.payment_status;

    if (paymentStatus === "finished" || paymentStatus === "confirmed") {
      console.log(`Payment successful for Order ID: ${transactionId}, Status: ${paymentStatus}`);
      
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
        return new Response("Already Processed", { status: 200 });
      }

      // Update transaction status and store the FINAL crypto amount received
      const finalAmount = data.actually_paid || tx.amount;

      const { error: txUpdateError } = await supabaseAdmin
        .from('transactions')
        .update({ 
          status: 'Completed',
          tx_id: data.payin_hash || tx.tx_id,
          amount: finalAmount 
        })
        .eq('id', transactionId);

      if (txUpdateError) {
        console.error("Failed to update transaction status:", txUpdateError);
        return new Response("Database Error", { status: 500 });
      }

      // Check balance and credit user
      const { data: balance, error: balanceFetchError } = await supabaseAdmin
        .from('balances')
        .select('*')
        .eq('user_id', tx.user_id)
        .eq('asset_code', tx.asset)
        .single();

      const creditAmount = Number(finalAmount);

      if (balance) {
        const newAmount = Number(balance.amount) + creditAmount;
        await supabaseAdmin
          .from('balances')
          .update({ amount: newAmount, updated_at: new Date().toISOString() })
          .eq('id', balance.id);
      } else {
        await supabaseAdmin
          .from('balances')
          .insert({
            user_id: tx.user_id,
            asset_code: tx.asset,
            amount: creditAmount
          });
      }

    } else if (paymentStatus === "failed" || paymentStatus === "expired" || paymentStatus === "rejected") {
      await supabaseAdmin
        .from('transactions')
        .update({ status: 'Failed' })
        .eq('id', transactionId);
    }

    return new Response("ok", { status: 200 });

  } catch (error) {
    console.error("NOWPayments Webhook error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
