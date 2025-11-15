// ============================================
// FILE: src/app/page.tsx
// ============================================
import ChatPage from "@/ui/chat/ChatPage";

/**
 * Home page - always shows empty state with suggestions
 * No chat is created until user sends a message
 */
export default function HomePage() {
    return <ChatPage />;
}