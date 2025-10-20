"use client";

export default function ChatLoader() {
    return (
        <div className="flex-1 flex items-center justify-center bg-[var(--color-background)]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[var(--color-foreground)] opacity-60">
                    Loading chat…
                </p>
            </div>
        </div>
    );
}
