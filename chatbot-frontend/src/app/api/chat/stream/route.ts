import { NextRequest } from "next/server";

const encoder = new TextEncoder();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: NextRequest) {
    const { sessionId, message } = await req.json();

    const stream = new ReadableStream({
        async start(controller) {
            const reply = generateReply(message);
            const tokens = reply.split(" ");
            for (const t of tokens) {
                controller.enqueue(encoder.encode(`data: ${t} \n\n`));
                await sleep(40);
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        },
    });
}

function generateReply(text: string): string {
    if (/calorie|macro/i.test(text))
        return "A balanced diet often depends on your goals. Start with 1.2g of protein per kg of body weight.";
    if (/meal|recipe/i.test(text))
        return "Try grilled salmon with quinoa and spinach — a high-protein, omega-3 rich meal.";
    if (/hello|hi/i.test(text))
        return "Hello! How can I help you with your nutrition today?";
    return `Interesting thought about "${text}". Let's dive deeper into it.`;
}
