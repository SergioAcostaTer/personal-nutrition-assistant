import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userText } = await req.json();
    const short = userText.split(" ").slice(0, 5).join(" ");
    const title = short.charAt(0).toUpperCase() + short.slice(1) + (userText.split(" ").length > 5 ? "…" : "");
    await new Promise((r) => setTimeout(r, 150)); // simulate latency
    return NextResponse.json({ title });
}
