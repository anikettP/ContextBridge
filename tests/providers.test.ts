import { describe, expect, it } from "vitest";
import { ChatGPTProvider } from "../src/providers/chatgpt/ChatGPTProvider";
import { ClaudeProvider } from "../src/providers/claude/ClaudeProvider";
import { GeminiProvider } from "../src/providers/gemini/GeminiProvider";
import { PerplexityProvider } from "../src/providers/perplexity/PerplexityProvider";
import { GrokProvider } from "../src/providers/grok/GrokProvider";
import { CopilotProvider } from "../src/providers/copilot/CopilotProvider";
import { DeepSeekProvider } from "../src/providers/deepseek/DeepSeekProvider";
import { getAllProviders, getProviderById } from "../src/providers";

describe("Provider Adapters Test Suite", () => {
  it("should instantiate all 7 supported AI provider adapters", () => {
    const providers = getAllProviders();
    expect(providers).toHaveLength(7);
    expect(providers.map((p) => p.id)).toEqual([
      "chatgpt",
      "claude",
      "gemini",
      "perplexity",
      "grok",
      "copilot",
      "deepseek"
    ]);
  });

  it("should retrieve provider adapter by ID for all 7 providers", () => {
    expect(getProviderById("chatgpt")).toBeInstanceOf(ChatGPTProvider);
    expect(getProviderById("claude")).toBeInstanceOf(ClaudeProvider);
    expect(getProviderById("gemini")).toBeInstanceOf(GeminiProvider);
    expect(getProviderById("perplexity")).toBeInstanceOf(PerplexityProvider);
    expect(getProviderById("grok")).toBeInstanceOf(GrokProvider);
    expect(getProviderById("copilot")).toBeInstanceOf(CopilotProvider);
    expect(getProviderById("deepseek")).toBeInstanceOf(DeepSeekProvider);
  });

  it("should handle mock DOM extraction for ChatGPT turns", async () => {
    const chatgpt = new ChatGPTProvider();
    document.body.innerHTML = `
      <h1>Build My SaaS Application</h1>
      <article data-message-author-role="user">
        <div class="markdown">I want to build a Chrome extension in React and TypeScript.</div>
      </article>
      <article data-message-author-role="assistant">
        <div class="markdown">We decided to use Manifest V3, Vite, and Vitest for testing.</div>
      </article>
    `;

    const conversation = await chatgpt.extractConversation();
    expect(conversation.provider).toBe("chatgpt");
    expect(conversation.title).toBe("Build My SaaS Application");
    expect(conversation.messages).toHaveLength(2);
    expect(conversation.messages[0].role).toBe("user");
    expect(conversation.messages[0].content).toContain("Chrome extension");
    expect(conversation.messages[1].role).toBe("assistant");
    expect(conversation.messages[1].content).toContain("Manifest V3");
  });

  it("should handle composer text injection into mock textarea", async () => {
    const chatgpt = new ChatGPTProvider();
    document.body.innerHTML = `<textarea id="prompt-textarea"></textarea>`;

    const injected = await chatgpt.injectContext("Test Markdown Context");
    expect(injected).toBe(true);

    const textarea = document.querySelector("#prompt-textarea") as HTMLTextAreaElement;
    expect(textarea.value).toBe("Test Markdown Context");
  });
});
