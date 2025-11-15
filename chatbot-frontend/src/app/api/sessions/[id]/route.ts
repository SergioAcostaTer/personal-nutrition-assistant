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

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const session = sessions.get(id);
    if (!session) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(session);
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const { title } = await request.json();

    const session = sessions.get(id);
    if (!session) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    session.title = title;
    session.lastMessageAt = new Date().toISOString();
    sessions.set(id, session);

    return NextResponse.json({ ok: true });
}

export async function DELETE(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    sessions.delete(id);
    return NextResponse.json({ ok: true });
}

function generateReply(text: string): string {
    const lower = text.toLowerCase();

    // Programming & Tech
    if (/code|program|script|function|python|javascript|react/i.test(lower))
        return "I'd be happy to help with that! Could you provide more details about what you're trying to accomplish? I can help write code, debug issues, or explain concepts.";

    // Explanation requests
    if (/explain|what is|how does|why/i.test(lower))
        return "Great question! Let me break this down for you in a clear and understandable way. This is a complex topic, but I'll do my best to explain it step by step.";

    // Creative writing
    if (/write|create|draft|compose|story/i.test(lower))
        return "I'd love to help you with that! Let me craft something creative and engaging for you. What tone or style would you prefer?";

    // Planning & organization
    if (/plan|organize|schedule|itinerary|trip/i.test(lower))
        return "I can help you create a detailed plan for that! Let's break it down into manageable steps and consider all the important factors.";

    // Learning & education
    if (/learn|study|understand|teach/i.test(lower))
        return "Learning is a journey! I can help guide you through this topic with explanations, examples, and practice. What aspect would you like to focus on first?";

    // Greetings
    if (/^(hello|hi|hey|greetings)/i.test(lower))
        return "Hello! I'm here to help you with any questions, tasks, or creative projects. What would you like to work on today?";

    // Thanks
    if (/thank|thanks|appreciate/i.test(lower))
        return "You're welcome! Feel free to ask if you need anything else. I'm here to help!";

    // Default
    return `That's an interesting question about "${text}". I can help you explore this topic in depth. Would you like me to provide more details, examples, or a different perspective?`;
}