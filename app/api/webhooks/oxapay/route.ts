import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
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

    // Status 1 or 2 usually means success/paid
    if (data.status === 1 || data.status === 2) {
      console.log(`Payment successful for Order ID: ${data.orderId}, Amount: ${data.amount} ${data.currency}`);
      
      // TODO: Update your database here (e.g., credit user balance)
      // Example: await db.transactions.update({ where: { orderId: data.orderId }, data: { status: 'PAID' } })
    } else if (data.status === 3) {
      console.log(`Payment expired for Order ID: ${data.orderId}`);
    } else if (data.status === 6) {
      console.log(`Payment partially paid for Order ID: ${data.orderId}`);
    }

    // OxaPay expects "ok" as the response body with status 200
    return new Response("ok", { status: 200 });

  } catch (error) {
    console.error("OxaPay Webhook error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
