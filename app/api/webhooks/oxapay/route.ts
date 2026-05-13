import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const rawBody = await req.text();
    const hmacHeader = req.headers.get("HMAC");
    const merchantKey = process.env.OXAPAY_MERCHANT_KEY;

    if (!merchantKey) {
      console.error("OXAPAY_MERCHANT_KEY is not set");
      return new Response("Internal Server Error", { status: 500 });
    }

    if (!hmacHeader) {
      console.error("Missing HMAC header");
      return new Response("Unauthorized", { status: 401 });
    }

    // Verify HMAC signature
    const computedHmac = crypto
      .createHmac("sha512", merchantKey)
      .update(rawBody)
      .digest("hex");

    if (computedHmac !== hmacHeader) {
      console.error("HMAC verification failed");
      return new Response("Unauthorized", { status: 401 });
    }

    const data = JSON.parse(rawBody);
    console.log("OxaPay Webhook received:", data);

    const transactionId = data.orderId;

    // Status 1 or 2 means success/paid
    if (data.status === 1 || data.status === 2) {
      console.log(`Payment successful for Order ID: ${transactionId}, Amount: ${data.amount} ${data.currency}`);
      
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
        return new Response("Already Processed", { status: 200 });
      }

      // 2. Update Transaction Status
      const { error: txUpdateError } = await supabaseAdmin
        .from('transactions')
        .update({ 
          status: 'Completed',
          tx_id: data.txId || tx.tx_id,
          amount: data.amount || tx.amount // Use actual paid amount if different
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

      if (balance) {
        // Increment existing balance
        const newAmount = Number(balance.amount) + Number(data.amount || tx.amount);
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
            amount: Number(data.amount || tx.amount)
          });
      }

      console.log(`Successfully credited ${data.amount || tx.amount} ${tx.asset} to user ${tx.user_id}`);

    } else if (data.status === 3 || data.status === 7 || data.status === 8) {
      // Payment expired or canceled
      await supabaseAdmin
        .from('transactions')
        .update({ status: 'Failed' })
        .eq('id', transactionId);
      console.log(`Payment failed/expired for Order ID: ${transactionId}`);
    }

    return new Response("ok", { status: 200 });

  } catch (error) {
    console.error("OxaPay Webhook error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
