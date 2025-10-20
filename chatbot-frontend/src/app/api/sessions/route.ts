/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

type Message = { id: string; role: "user" | "assistant"; content: string; createdAt: string };
type Session = { id: string; title: string; messages: Message[]; lastMessageAt?: string };

// Shared global store between all API routes
const sessions = (globalThis as any).__sessions ?? new Map<string, Session>();
(globalThis as any).__sessions = sessions;

export async function GET() {
    const list = Array.from(sessions.values()) as Session[];
    const mapped = list.map((s) => ({
        id: s.id,
        title: s.title,
        lastMessageAt: s.lastMessageAt,
    }));
    return NextResponse.json(mapped);
}

export async function POST(req: Request) {
    const { id, title } = await req.json();
    const session: Session = {
        id,
        title,
        messages: [],
        lastMessageAt: new Date().toISOString()
    };
    sessions.set(id, session);
    return NextResponse.json(session);
}