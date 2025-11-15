// ============================================
// FILE: src/infrastructure/sse/SseReader.ts
// FIXED: Preserves whitespace 100%
// ============================================

export async function* readSSE(stream: ReadableStream<Uint8Array>): AsyncGenerator<string> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buf += decoder.decode(value, { stream: true });
            const frames = buf.split("\n\n");

            // Process all complete frames
            for (let i = 0; i < frames.length - 1; i++) {
                const frame = frames[i];           // ❗ NO TRIM
                if (!frame.startsWith("data:")) continue;

                // preserve exact payload after "data:"
                const data = frame.slice(5);       // ❗ NO TRIM, NO SKIP

                if (data === "[DONE]") {
                    await reader.cancel().catch(() => { });
                    return;
                }

                // yield even whitespace-only strings
                yield data;
            }

            // Remaining partial frame
            buf = frames[frames.length - 1];
        }
    } catch (err) {
        console.warn("SSE stream error:", err);

        // If buffer contains valid data, yield it WITHOUT trimming
        if (buf.startsWith("data:")) {
            const data = buf.slice(5);
            if (data && data !== "[DONE]") {
                yield data;
            }
        }
    } finally {
        try { await reader.cancel(); } catch { }
    }
}
