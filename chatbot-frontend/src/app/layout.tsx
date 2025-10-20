import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { container } from "@/composition/container";
import { UseCasesProvider } from "@/composition/UseCasesProvider";
import Sidebar from "@/ui/sidebar/Sidebar";
import { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "NutriAI - Your Personal Nutrition Assistant",
    description:
        "Get personalized nutrition advice, meal planning, and dietary guidance powered by AI",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const sidebar = await container.listSessions.execute();

    return (
        <html lang="en">
            <body className="flex h-screen bg-background text-foreground">
                <ThemeProvider>
                    <UseCasesProvider>
                        <Sidebar initialList={sidebar} />
                        <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
                            {children}
                        </main>
                    </UseCasesProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}