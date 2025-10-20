import ChatPage from "@/ui/ChatPage";

/**
 * "/" behaves the same as any chat — it will client-side create one if missing.
 * No redirect, no route transition.
 */
export default function HomePage() {
    return <ChatPage />;
}
