// ============================================
// FILE: src/app/layout.tsx (FINAL PATCHED)
// ============================================
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { container } from "@/composition/container";
import { UseCasesProvider } from "@/composition/UseCasesProvider";
import { ChatSession } from "@/domain/model/ChatSession";
import Sidebar from "@/ui/sidebar/Sidebar";
import { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "ChatBot - AI Assistant",
    description: "Your intelligent AI assistant for questions, tasks, and creative work",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    let initialSidebar: Pick<ChatSession, "id" | "title" | "lastMessageAt">[] = [];

    try {
        initialSidebar = await container.listSessions.execute();
    } catch (err) {
        console.warn("Failed to load initial sidebar data:", err);
    }

    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content" />
            </head>
            <body className="flex bg-background text-foreground">
                <ThemeProvider>
                    <UseCasesProvider>
                        <Sidebar initialList={initialSidebar} />
                        <main className="flex flex-col flex-1 h-[100svh] max-h-[100svh] overflow-hidden">
                            {children}
                        </main>
                    </UseCasesProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
