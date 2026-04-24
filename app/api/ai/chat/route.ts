import { auth } from "@/lib/auth";
import { getGeminiErrorMessage, streamCoachChat } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return new Response("GEMINI_API_KEY is missing", { status: 500 });
    }

    const { messages } = (await req.json()) as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
    };

    const stream = await streamCoachChat(messages);
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("[AI_CHAT_ERROR]", error);
    return new Response(getGeminiErrorMessage(error), { status: 500 });
  }
}
