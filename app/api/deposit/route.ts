import { NextResponse } from "next/server";

const MOCK_ADDRESSES: Record<string, string> = {
  trc20: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  erc20: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  bep20: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  btc: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  sol: "4j3W6k6r6r6r6r6r6r6r6r6r6r6r6r6r6r6r6r6r",
};

export async function POST(req: Request) {
  try {
    const { amount, currency = "USD", network = "trc20" } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const apiKey = process.env.MAXELPAY_API_KEY;

    // Creating a unique order ID
    const orderId = `DEP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // NOTE: Maxelpay API Integration
    // If you want to use Maxelpay's Checkout URL (which redirects the user), 
    // you would uncomment and use the following block:
    /*
    const response = await fetch("https://api.maxelpay.com/api/v1/merchant/order/checkout", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey || "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        orderID: orderId,
        amount: amount.toString(),
        currency: currency,
        userName: "Aura User",
        siteName: "Aura Wallet",
        timestamp: Math.floor(Date.now() / 1000)
      })
    });
    const data = await response.json();
    // Then you would return { url: data.payment_url } and handle redirect in frontend.
    */

    // Since you requested to NOT redirect the user and use your own deposit page directly,
    // you need Maxelpay's "Direct Wallet/White-label API" if they offer one.
    // Assuming they provide an endpoint to generate a wallet address directly:
    // const directResponse = await fetch("https://api.maxelpay.com/api/v1/merchant/order/create_address", ...);
    // const directData = await directResponse.json();
    // const address = directData.address;

    // For now, to keep the user directly on your UI, we are returning a mapped address based on the selected network.
    const address = MOCK_ADDRESSES[network] || MOCK_ADDRESSES["trc20"];
    
    // Calculate crypto amount based on USD (mocked conversion for demo, ideally fetched from API)
    let cryptoAmount = amount;
    if (network === "btc") cryptoAmount = (amount / 65000).toFixed(6);
    else if (network === "erc20" && currency !== "USDT") cryptoAmount = (amount / 3500).toFixed(4);
    else if (network === "sol") cryptoAmount = (amount / 140).toFixed(2);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({ 
      status: "success",
      address,
      expectedAmount: cryptoAmount,
      orderId 
    });

  } catch (error) {
    console.error("Deposit API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
