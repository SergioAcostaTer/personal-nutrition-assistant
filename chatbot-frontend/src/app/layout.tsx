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
import ViewportWrapper from "./viewport-wrapper";

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
            <body className="flex h-full bg-background text-foreground overflow-hidden">
                <ViewportWrapper>
                    <ThemeProvider>
                        <UseCasesProvider>
                            <Sidebar initialList={initialSidebar} />
                            <main className="flex-1 flex flex-col h-full overflow-hidden">
                                {children}
                            </main>
                        </UseCasesProvider>
                    </ThemeProvider>
                </ViewportWrapper>
            </body>
        </html>
    );
}
