import { NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: Request) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "OpenRouter API Key not found" }, { status: 500 });
  }

  try {
    const { messages } = await req.json();

    // Context about the user's portfolio to give the AI some "knowledge"
    const systemMessage = {
      role: "system",
      content: `You are Aura AI, a professional financial advisor and autonomous trading assistant exclusively for the Aura AI Wallet platform.
      
      CRITICAL RULE: You MUST ONLY answer questions related to cryptocurrency, investing, trading, finance, markets, and the Aura AI platform. If the user asks about ANY other topic (e.g., coding, general knowledge, recipes, jokes, personal questions), you MUST politely refuse to answer and briefly redirect them back to financial or crypto-related topics. Do NOT break this rule under any circumstances.
      
      User Portfolio Context:
      - Available Balance: 4,120 USDT
      - Total Portfolio Value: $67,820
      - Main Holdings: Bitcoin (BTC), Ethereum (ETH), Solana (SOL), Tether (USDT).
      - Recent Strategy: AI is currently optimized for high-volatility growth with a focus on Layer 1 assets.
      - Performance: +148% total return since inception.
      
      Your personality: Professional, data-driven, concise, and helpful. 
      IMPORTANT: Respond in the SAME LANGUAGE as the user (e.g., if they ask in Turkish, respond in Turkish).
      Use Markdown formatting for your responses:
      - Use TABLES for portfolio data, asset lists, or comparisons.
      - Use BOLD text for important numbers or terms.
      - Use BULLET POINTS for lists of actions or insights.
      - Keep your tone professional but accessible.
      
      You do not give direct financial advice that guarantees profit, but you provide AI-driven analysis.`
    };


    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://aura-ai-wallet.vercel.app",
        "X-Title": "Aura AI Wallet",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b:free", 
        messages: [systemMessage, ...messages],
        temperature: 0.7,
      }),

    });

    const data = await response.json();
    
    if (data.error) {
      console.error("OpenRouter Error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json(data.choices[0].message);
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
