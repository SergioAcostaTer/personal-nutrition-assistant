// ============================================
// FILE: src/infrastructure/sse/SseReader.ts
// OPTIMIZED: Robust error handling, never blocks
// ============================================

/**
 * Robust SSE parser with automatic error recovery
 * - Handles connection drops gracefully
 * - Never throws errors - yields what it can
 * - Cleans up resources properly
 */
export async function* readSSE(stream: ReadableStream<Uint8Array>): AsyncGenerator<string> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    try {
        while (true) {
            let result;

            try {
                result = await reader.read();
            } catch (readErr) {
                console.warn("SSE read error:", readErr);
                break; // Exit gracefully on read error
            }

            const { done, value } = result;
            if (done) break;

            buf += decoder.decode(value, { stream: true });
            const frames = buf.split("\n\n");

            // Process all complete frames
            for (let i = 0; i < frames.length - 1; i++) {
                const line = frames[i].trim();
                if (!line.startsWith("data:")) continue;

                const data = line.slice(5).trim();
                if (!data) continue;
                if (data === "[DONE]") {
                    await reader.cancel().catch(() => { });
                    return;
                }

                yield data;
            }

            // Keep incomplete frame in buffer
            buf = frames[frames.length - 1];
        }
    } catch (err) {
        console.warn("SSE stream error:", err);
        // Yield partial data if available
        if (buf.trim()) {
            const line = buf.trim();
            if (line.startsWith("data:")) {
                const data = line.slice(5).trim();
                if (data && data !== "[DONE]") {
                    yield data;
                }
            }
        }
    } finally {
        // Always clean up
        try {
            await reader.cancel();
        } catch (cancelErr) {
            // Ignore cancel errors
        }
    }
}