import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * OxaPay White-Label API Integration
 */

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const cookieStore = await cookies();
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, currency = "USD", network, assetId } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const merchantKey = process.env.OXAPAY_MERCHANT_KEY;
    if (!merchantKey) {
      return NextResponse.json({ error: "OxaPay Merchant Key not configured" }, { status: 500 });
    }

    let payCurrency = "USDT";
    let oxaNetwork = "TRC20";

    if (assetId === "usdt") {
      payCurrency = "USDT";
      oxaNetwork = network === "trc20" ? "TRC20" : network === "erc20" ? "ERC20" : "BEP20";
    } else if (assetId === "btc") {
      payCurrency = "BTC";
      oxaNetwork = "BTC";
    } else if (assetId === "eth") {
      payCurrency = "ETH";
      oxaNetwork = "ERC20";
    } else if (assetId === "sol") {
      payCurrency = "SOL";
      oxaNetwork = "SOLANA";
    }

    // 1. Create a PENDING transaction in our database first
    const { data: tx, error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'Deposit',
        asset: payCurrency,
        amount: Number(amount),
        status: 'Pending',
        network: oxaNetwork
      })
      .select()
      .single();

    if (txError || !tx) {
      console.error("Database error:", txError);
      return NextResponse.json({ error: "Failed to create transaction record" }, { status: 500 });
    }

    // 2. Call OxaPay White-Label API
    const response = await fetch("https://api.oxapay.com/merchants/request/whitelabel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant: merchantKey,
        amount: Number(amount),
        currency: currency,
        payCurrency: payCurrency,
        network: oxaNetwork,
        orderId: tx.id, // Use our DB transaction ID as orderId
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://aura-ai-wallet.vercel.app'}/api/webhooks/oxapay`,
      }),
    });

    const data = await response.json();

    if (data.result === 100 || data.status === 1 || data.message === "success") {
      // Update transaction with the address provided by OxaPay
      await supabase
        .from('transactions')
        .update({ address: data.address })
        .eq('id', tx.id);

      return NextResponse.json({ 
        status: "success",
        address: data.address,
        expectedAmount: data.payAmount,
        orderId: tx.id,
        currency: data.payCurrency || payCurrency
      });
    } else {
      // Rollback: Mark transaction as failed if OxaPay fails
      await supabase
        .from('transactions')
        .update({ status: 'Failed' })
        .eq('id', tx.id);

      console.error("OxaPay API Error:", data);
      return NextResponse.json({ 
        error: data.message || "Failed to generate OxaPay payment" 
      }, { status: 400 });
    }

  } catch (error) {
    console.error("OxaPay Deposit API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
