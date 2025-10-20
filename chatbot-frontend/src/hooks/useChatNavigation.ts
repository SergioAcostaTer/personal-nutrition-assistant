"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * Handles chat navigation using Next.js router for hydration-safe updates.
 */
export function useChatNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const goToChat = useCallback(
    (id: string) => {
      const newPath = `/c/${id}`;
      if (pathname !== newPath) {
        router.replace(newPath);
      }
    },
    [router, pathname]
  );

  const currentId = useCallback(() => {
    if (!pathname) return undefined;
    return pathname.startsWith("/c/") ? pathname.slice(3) : undefined;
  }, [pathname]);

  return { goToChat, currentId };
}
