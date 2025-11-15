"use client";

import { useDynamicViewport } from "@/hooks/useDynamicViewport";

export default function ViewportWrapper({ children }: { children: React.ReactNode }) {
    useDynamicViewport();
    return <>{children}</>;
}
