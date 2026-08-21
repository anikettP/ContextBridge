import { Conversation, ExtensionSettings } from "../shared/types";

export class ExternalLLMProcessor {
  /**
   * Optional helper to request AI summarization via OpenAI / Anthropic / Gemini API.
   * Only called if user explicitly enables external LLM in settings and provides API Key.
   */
  public async summarizeWithExternalLLM(
    conversation: Conversation,
    settings: ExtensionSettings
  ): Promise<string | null> {
    if (!settings.useExternalLLM || !settings.apiKey) {
      return null;
    }

    const provider = settings.externalLLMProvider || "openai";
    const transcript = conversation.messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const prompt = `Please summarize the key project requirements, architecture decisions, tech stack, open tasks, and code specs from this AI conversation transcript:\n\n${transcript}`;

    try {
      if (provider === "openai") {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${settings.apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }]
          })
        });
        const data = await res.json();
        return data?.choices?.[0]?.message?.content || null;
      }
      
      // Anthropic / Gemini fallback handlers can be connected similarly
      return null;
    } catch (err) {
      console.error("External LLM summarization failed:", err);
      return null;
    }
  }
}
