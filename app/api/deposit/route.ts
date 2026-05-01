import { NextResponse } from "next/server";

/**
 * OxaPay White-Label API Integration
 * Endpoint: https://api.oxapay.com/merchants/request/whitelabel
 * Documentation: https://oxapay.com/docs/merchant/white-label
 */

export async function POST(req: Request) {
  try {
    const { amount, currency = "USD", network, assetId } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const merchantKey = process.env.OXAPAY_MERCHANT_KEY;
    if (!merchantKey) {
      return NextResponse.json({ error: "OxaPay Merchant Key not configured" }, { status: 500 });
    }

    // Mapping frontend IDs to OxaPay Currency and Network
    // assetId: "usdt", "btc", "eth", "sol"
    // network: "trc20", "erc20", "bep20", "btc", "sol"
    
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

    const orderId = `DEP-${Date.now()}`;

    // OxaPay White-Label API Request
    const response = await fetch("https://api.oxapay.com/merchants/request/whitelabel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchant: merchantKey,
        amount: Number(amount),
        currency: currency, // Typically USD
        payCurrency: payCurrency,
        network: oxaNetwork,
        orderId: orderId,
        callbackUrl: "https://aura-ai-wallet.vercel.app/api/webhooks/oxapay",
      }),

    });

    const data = await response.json();

    if (data.result === 100 || data.status === 1 || data.message === "success") {
      return NextResponse.json({ 
        status: "success",
        address: data.address,
        expectedAmount: data.payAmount,
        orderId: data.trackId || data.orderId || orderId,
        currency: data.payCurrency || payCurrency
      });
    } else {
      console.error("OxaPay API Error:", data);
      return NextResponse.json({ 
        error: data.message || "Failed to generate OxaPay payment" 
      }, { status: 400 });
    }

  } catch (error) {
    console.error("OxaPay Deposit API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
