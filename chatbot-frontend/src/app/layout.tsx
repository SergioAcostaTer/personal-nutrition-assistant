// ============================================
// FILE: src/app/layout.tsx
// OPTIMIZED: Safe async data loading
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
    let initialSidebar: Pick<ChatSession, "id" | "title" | "lastMessageAt">[] | undefined;
    try {
        initialSidebar = await container.listSessions.execute();
    } catch (err) {
        console.warn("Failed to load initial sidebar data:", err);
        initialSidebar = [];
    }

    return (
        <html lang="en">
            <body className="flex h-screen bg-background text-foreground">
                <ThemeProvider>
                    <UseCasesProvider>
                        <Sidebar initialList={initialSidebar} />
                        <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
                            {children}
                        </main>
                    </UseCasesProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}