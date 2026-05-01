import { NextResponse } from "next/server";

/**
 * OxaPay White-Label API Integration
 * Endpoint: https://api.oxapay.com/merchants/request/whitelabel
 * Documentation: https://oxapay.com/docs/merchant/white-label
 */

export async function POST(req: Request) {
  try {
    const { amount, currency = "USD", network, asset } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const apiKey = process.env.OXAPAY_MERCHANT_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OxaPay API key not configured" }, { status: 500 });
    }

    // Creating a unique order ID
    const orderId = `DEP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Prepare parameters for OxaPay
    // payCurrency: The crypto asset (USDT, BTC, etc.)
    // network: The blockchain network (TRC20, ERC20, etc.)
    let payCurrency = asset; 
    let oxaNetwork = network.toUpperCase(); // Standardize to uppercase (TRC20, ERC20, etc.)

    // Special case for BTC/ETH/SOL where network is often the same as the currency or simplified
    if (asset === "BTC") oxaNetwork = "BTC";
    if (asset === "ETH") oxaNetwork = "ERC20";
    if (asset === "SOL") oxaNetwork = "SOL";

    try {
      const response = await fetch("https://api.oxapay.com/merchants/request/whitelabel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          merchant: apiKey,
          amount: amount,
          currency: currency,       // Base currency (e.g. USD)
          payCurrency: payCurrency, // Crypto symbol (e.g. USDT)
          network: oxaNetwork,      // Blockchain network (e.g. TRC20)
          orderId: orderId,
          callbackUrl: "https://your-domain.com/api/webhooks/oxapay", // Replace with your actual webhook if needed
        })
      });

      const data = await response.json();

      if (data.status === 1 || data.message === "success") {
        // OxaPay returns 'address' and 'payAmount' in the response
        return NextResponse.json({ 
          status: "success",
          address: data.address,
          expectedAmount: data.payAmount,
          orderId: data.orderId || orderId
        });
      } else {
        console.error("OxaPay API Error:", data);
        return NextResponse.json({ 
          error: data.message || "Failed to generate payment from OxaPay" 
        }, { status: 400 });
      }

    } catch (apiError) {
      console.error("OxaPay API Connection Error:", apiError);
      return NextResponse.json({ error: "Failed to connect to OxaPay gateway" }, { status: 502 });
    }

  } catch (error) {
    console.error("Deposit API internal error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
