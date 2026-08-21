import { describe, expect, it } from "vitest";
import { GrokProvider } from "../../src/providers/grok/GrokProvider";

describe("GrokProvider Test Suite", () => {
  it("should declare capabilities correctly", () => {
    const grok = new GrokProvider();
    expect(grok.id).toBe("grok");
    expect(grok.name).toBe("Grok");
    expect(grok.capabilities.canExtract).toBe(true);
    expect(grok.capabilities.canInject).toBe(true);
    expect(grok.capabilities.supportsConversationTitle).toBe(true);
  });

  it("should extract conversation turns from mock Grok DOM", async () => {
    const grok = new GrokProvider();
    document.body.innerHTML = `
      <h1>Grok Web Architecture Chat</h1>
      <div class="user-prompt">What is the goal of Grok?</div>
      <div class="response-turn">Grok is an AI assistant developed by xAI.</div>
    `;

    const conv = await grok.extractConversation();
    expect(conv.provider).toBe("grok");
    expect(conv.title).toBe("Grok Web Architecture Chat");
    expect(conv.messages).toHaveLength(2);
    expect(conv.messages[0].role).toBe("user");
    expect(conv.messages[0].content).toContain("goal of Grok");
    expect(conv.messages[1].role).toBe("assistant");
    expect(conv.messages[1].content).toContain("developed by xAI");
  });

  it("should inject context into Grok composer textarea", async () => {
    const grok = new GrokProvider();
    document.body.innerHTML = `<textarea placeholder="Ask Grok anything..."></textarea>`;

    const injected = await grok.injectContext("Grok Context Prompt");
    expect(injected).toBe(true);

    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    expect(textarea.value).toBe("Grok Context Prompt");
  });
});
