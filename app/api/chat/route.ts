import { NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: Request) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "OpenRouter API Key not found" }, { status: 500 });
  }

  try {
    const { messages, language } = await req.json();

    // 1. Fetch Real-time Market Data from Binance
    let marketContext = "";
    try {
      const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "ADAUSDT", "XRPUSDT", "LINKUSDT"];
      const symbolsParam = JSON.stringify(symbols);
      const priceRes = await fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${symbolsParam}`);
      
      if (priceRes.ok) {
        const prices = await priceRes.json();
        marketContext = "\nCURRENT MARKET PRICES (Binance Live):\n" + 
          prices.map((p: any) => `- ${p.symbol.replace("USDT", "")}: $${Number(p.price).toLocaleString()}`).join("\n");
      }
    } catch (e) {
      console.error("Failed to fetch Binance prices for AI context:", e);
    }

    const systemInstructionLanguage = 
      language === "tr" ? "You MUST respond in Turkish. All explanations, table headers, numbers, labels, advice, and analysis MUST be written entirely in Turkish." :
      language === "es" ? "You MUST respond in Spanish. All explanations, table headers, numbers, labels, advice, and analysis MUST be written entirely in Spanish." :
      language === "el" ? "You MUST respond in Greek. All explanations, table headers, numbers, labels, advice, and analysis MUST be written entirely in Greek." :
      language === "de" ? "You MUST respond in German. All explanations, table headers, numbers, labels, advice, and analysis MUST be written entirely in German." :
      language === "sv" ? "You MUST respond in Swedish. All explanations, table headers, numbers, labels, advice, and analysis MUST be written entirely in Swedish." :
      "You MUST respond in English. All explanations, table headers, numbers, labels, advice, and analysis MUST be written entirely in English.";

    // Context about the user's portfolio to give the AI some "knowledge"
    const systemMessage = {
      role: "system",
      content: `You are Aura AI, a professional financial advisor and autonomous trading assistant exclusively for the Aura AI Wallet platform.
      
      CRITICAL RULE 1: You MUST ONLY answer questions related to cryptocurrency, investing, trading, finance, markets, and the Aura AI platform. If the user asks about ANY other topic, you MUST politely refuse.
      
      CRITICAL RULE 2: If the user asks questions like "how do I make money?", "I have no money", "how can I earn?", you MUST ALWAYS redirect them to the Aura AI platform. Teach them step-by-step how to start:
      1. Go to the "My Wallet" section.
      2. Click on "Deposit" and choose a cryptocurrency asset.
      3. Send funds to the generated wallet address.
      4. Once deposited, explain that they can go to the "Investments" tab, choose a Risk Profile, and let the Aura AI Neural Engine automatically manage and grow their portfolio 24/7.
      
      MARKET DATA:${marketContext}
      
      Your personality: Professional, data-driven, concise, and helpful. 
      IMPORTANT: ${systemInstructionLanguage}
      Use Markdown formatting:
      - Use TABLES for portfolio data or price comparisons.
      - Use BOLD text for important numbers.
      - Use BULLET POINTS for insights.
      
      You provide AI-driven analysis, not guaranteed profit advice.`
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
