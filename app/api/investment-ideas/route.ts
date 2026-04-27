import { OpenRouter } from "@openrouter/sdk";

export async function POST(request: Request) {
  try {
    const { prompt } = (await request.json()) as { prompt?: string };

    if (!prompt?.trim()) {
      return new Response("Prompt is required.", { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return new Response("OPENROUTER_API_KEY is not configured.", { status: 500 });
    }

    const openrouter = new OpenRouter({ apiKey });

    const stream = await openrouter.chat.send({
      chatRequest: {
        model: "openai/gpt-oss-120b:free",
        stream: true,
        messages: [
          {
            role: "system",
            content:
              "You are a crypto investment assistant. Give practical, concise investment guidance and risk-aware suggestions.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        let reasoningTokens: number | undefined;

        try {
          for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }

            if (chunk.usage?.reasoningTokens) {
              reasoningTokens = chunk.usage.reasoningTokens;
            }
          }

          if (typeof reasoningTokens === "number") {
            controller.enqueue(
              encoder.encode(`\n\n[Reasoning tokens: ${reasoningTokens}]`)
            );
          }
        } catch {
          controller.enqueue(
            encoder.encode("\n\n[Streaming error: failed to complete response.]")
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    console.error("investment-ideas route error:", error);
    return new Response(`OpenRouter request failed: ${message}`, { status: 500 });
  }
}
