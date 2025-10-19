import { ThemeProvider } from "@/components/providers/ThemeProvider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "NutriAI - Your Personal Nutrition Assistant",
    description:
        "Get personalized nutrition advice, meal planning, and dietary guidance powered by AI",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="antialiased">
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}