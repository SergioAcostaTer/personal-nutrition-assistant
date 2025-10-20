"use client";

/**
 * A lightweight hook for seamless client-side chat URL management.
 * - Updates /c/:id without triggering a Next.js route transition.
 * - Compatible with SSR hydration (on refresh or direct URL access).
 */
export function useChatNavigation() {
  const goToChat = (id: string) => {
    if (typeof window === "undefined") return;
    const newPath = `/c/${id}`;
    if (window.location.pathname !== newPath) {
      window.history.replaceState(null, "", newPath);
    }
  };

  const currentId = (): string | undefined => {
    if (typeof window === "undefined") return undefined;
    const path = window.location.pathname;
    return path.startsWith("/c/") ? path.slice(3) : undefined;
  };

  return { goToChat, currentId };
}
