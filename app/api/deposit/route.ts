import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * NOWPayments API Integration
 * Endpoint: https://api.nowpayments.io/v1/payment
 */

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Authenticate user using the provided Bearer token
    const { data: { user }, error: authError } = await (token 
      ? supabase.auth.getUser(token) 
      : supabase.auth.getUser());

    if (authError || !user) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, currency = "usd", network, assetId } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "NOWPayments API Key not configured" }, { status: 500 });
    }

    // Mapping frontend IDs to NOWPayments Currency codes
    let payCurrency = "usdttrc20"; // Default

    if (assetId === "usdt") {
      if (network === "trc20") payCurrency = "usdttrc20";
      else if (network === "erc20") payCurrency = "usdterc20";
      else if (network === "bep20") payCurrency = "usdtbsc";
    } else if (assetId === "btc") {
      payCurrency = "btc";
    } else if (assetId === "eth") {
      payCurrency = "eth";
    } else if (assetId === "sol") {
      payCurrency = "sol";
    }

    // 1. Create a PENDING transaction in our database first
    const { data: tx, error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'Deposit',
        asset: assetId.toUpperCase(), // Store "USDT", "BTC" etc for internal use
        amount: Number(amount),
        status: 'Pending',
        network: network.toUpperCase()
      })
      .select()
      .single();

    if (txError || !tx) {
      console.error("Database error:", txError);
      return NextResponse.json({ error: "Failed to create transaction record" }, { status: 500 });
    }

    // 2. Call NOWPayments API
    // Doc: https://documenter.getpostman.com/view/11994236/TVe9S78T#67f94d97-8c43-4ccb-88a2-a9b039434771
    const response = await fetch("https://api.nowpayments.io/v1/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        price_amount: Number(amount),
        price_currency: currency.toLowerCase(), // USD
        pay_currency: payCurrency.toLowerCase(),
        ipn_callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://aura-ai-wallet.vercel.app'}/api/webhooks/nowpayments`,
        order_id: tx.id, // Internal transaction UUID
        order_description: `Deposit ${amount} ${currency.toUpperCase()} via ${payCurrency.toUpperCase()}`,
      }),
    });

    const data = await response.json();

    if (response.ok && data.pay_address) {
      // Update transaction with the address and track ID (payment_id) from NOWPayments
      await supabase
        .from('transactions')
        .update({ 
          address: data.pay_address,
          tx_id: data.payment_id?.toString() // Use NOWPayments payment_id as tx_id initially
        })
        .eq('id', tx.id);

      return NextResponse.json({ 
        status: "success",
        address: data.pay_address,
        expectedAmount: data.pay_amount,
        orderId: tx.id,
        currency: data.pay_currency.toUpperCase()
      });
    } else {
      // Rollback: Mark transaction as failed if NOWPayments fails
      await supabase
        .from('transactions')
        .update({ status: 'Failed' })
        .eq('id', tx.id);

      console.error("NOWPayments API Error:", data);
      return NextResponse.json({ 
        error: data.message || "Failed to generate NOWPayments payment" 
      }, { status: 400 });
    }

  } catch (error) {
    console.error("NOWPayments Deposit API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
