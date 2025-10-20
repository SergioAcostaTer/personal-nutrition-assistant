import { NextResponse } from "next/server";

type Message = { id: string; role: "user" | "assistant"; content: string; createdAt: string };
type Session = { id: string; title: string; messages: Message[]; lastMessageAt?: string };

const sessions = new Map<string, Session>();

export async function GET() {
    const list = Array.from(sessions.values()).map((s) => ({
        id: s.id,
        title: s.title,
        lastMessageAt: s.lastMessageAt,
    }));
    return NextResponse.json(list);
}

export async function POST(req: Request) {
    const { id, title } = await req.json();
    const session: Session = { id, title, messages: [], lastMessageAt: new Date().toISOString() };
    sessions.set(id, session);
    return NextResponse.json(session);
}
