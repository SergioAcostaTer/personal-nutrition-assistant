/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

type Message = { id: string; role: "user" | "assistant"; content: string; createdAt: string };
type Session = { id: string; title: string; messages: Message[]; lastMessageAt?: string };

const sessions = (globalThis as any).__sessions ?? new Map<string, Session>();
(globalThis as any).__sessions = sessions;

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = sessions.get(id);
    if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(session);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { title } = await req.json();
    const sess = sessions.get(id);
    if (!sess) return NextResponse.json({ error: "Not found" }, { status: 404 });
    sess.title = title;
    sess.lastMessageAt = new Date().toISOString();
    return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    sessions.delete(id);
    return NextResponse.json({ ok: true });
}
