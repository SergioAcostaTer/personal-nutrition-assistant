import { ChatServicePort } from "@/domain/ports/ChatServicePort";

export class MockChatServiceAdapter implements ChatServicePort {
    async *sendMessageStream(
        _sessionId: string,
        userText: string
    ): AsyncGenerator<string> {
        const fakeReply = this.generateReply(userText);
        const tokens = fakeReply.split(/(\s+)/).filter(Boolean);

        for (const token of tokens) {
            yield token + " ";
            await new Promise((r) => setTimeout(r, 50));
        }


        yield "[DONE]";
    }

    async generateTitle(_sessionId: string, userText: string): Promise<string> {
        const words = userText.split(" ");
        const short =
            words.slice(0, 4).join(" ") +
            (words.length > 4 ? "…" : "");
        await new Promise((r) => setTimeout(r, 150));
        return short.charAt(0).toUpperCase() + short.slice(1);
    }

    private generateReply(userText: string): string {
        if (/calorie|macro/i.test(userText))
            return "A balanced diet often depends on your goals. I recommend starting with 1.2g of protein per kg of body weight and tracking your daily intake.";
        if (/meal|recipe/i.test(userText))
            return "Try a grilled chicken salad with quinoa and olive oil — a simple, balanced meal rich in protein and fiber.";
        if (/hello|hi/i.test(userText))
            return "Hello! How can I help you with your nutrition goals today?";
        return `Interesting! "${userText}" sounds like a great topic. Let's explore it!`;
    }
}
