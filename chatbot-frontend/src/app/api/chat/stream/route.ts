/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

type Message = { id: string; role: "user" | "assistant"; content: string; createdAt: string };
type Session = { id: string; title: string; messages: Message[]; lastMessageAt?: string };

const sessions = (globalThis as any).__sessions ?? new Map<string, Session>();
(globalThis as any).__sessions = sessions;

const encoder = new TextEncoder();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: NextRequest) {
    const { sessionId, message } = await req.json();

    const session = sessions.get(sessionId);
    if (!session) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Add user message
    const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: message,
        createdAt: new Date().toISOString(),
    };
    session.messages.push(userMsg);

    const reply = generateReply(message);
    const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply,
        createdAt: new Date().toISOString(),
    };


    const stream = new ReadableStream({
        async start(controller) {
            const tokens = reply.split(" ");
            for (const token of tokens) {
                controller.enqueue(encoder.encode(`data: ${token} \n\n`));
                await sleep(40);
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();

            session!.messages.push(assistantMsg);
            session!.lastMessageAt = new Date().toISOString();
            sessions.set(sessionId, session!);
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