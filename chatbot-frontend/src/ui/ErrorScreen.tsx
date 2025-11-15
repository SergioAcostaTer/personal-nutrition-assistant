// ============================================
// FILE: src/ui/ErrorScreen.tsx
// ============================================
"use client";


interface Props {
    message: string;
}

export default function ErrorScreen({ message }: Props) {
    return (
        <div className="flex flex-col flex-1 items-center justify-center p-4">
            <h2 className="text-2xl font-semibold mb-4 text-red-600">Error</h2>
            <p className="text-center text-gray-700">{message}</p>
        </div>
    );
}