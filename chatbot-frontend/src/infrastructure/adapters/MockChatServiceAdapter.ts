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
        const lower = userText.toLowerCase();

        // Programming & Tech
        if (/code|program|script|function|python|javascript|react/i.test(lower))
            return "I'd be happy to help with that! Could you provide more details about what you're trying to accomplish? I can help write code, debug issues, or explain concepts.";

        // Explanation requests
        if (/explain|what is|how does|why/i.test(lower))
            return "Great question! Let me break this down for you in a clear and understandable way. This is a complex topic, but I'll do my best to explain it step by step.";

        // Creative writing
        if (/write|create|draft|compose|story/i.test(lower))
            return "I'd love to help you with that! Let me craft something creative and engaging for you. What tone or style would you prefer?";

        // Planning & organization
        if (/plan|organize|schedule|itinerary|trip/i.test(lower))
            return "I can help you create a detailed plan for that! Let's break it down into manageable steps and consider all the important factors.";

        // Learning & education
        if (/learn|study|understand|teach/i.test(lower))
            return "Learning is a journey! I can help guide you through this topic with explanations, examples, and practice. What aspect would you like to focus on first?";

        // Greetings
        if (/^(hello|hi|hey|greetings)/i.test(lower))
            return "Hello! I'm here to help you with any questions, tasks, or creative projects. What would you like to work on today?";

        // Thanks
        if (/thank|thanks|appreciate/i.test(lower))
            return "You're welcome! Feel free to ask if you need anything else. I'm here to help!";

        // Default response
        return `That's an interesting question about "${userText}". I can help you explore this topic in depth. Would you like me to provide more details, examples, or a different perspective?`;
    }
}