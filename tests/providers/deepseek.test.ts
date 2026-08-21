import { describe, expect, it } from "vitest";
import { DeepSeekProvider } from "../../src/providers/deepseek/DeepSeekProvider";

describe("DeepSeekProvider Test Suite", () => {
  it("should declare capabilities correctly", () => {
    const deepseek = new DeepSeekProvider();
    expect(deepseek.id).toBe("deepseek");
    expect(deepseek.name).toBe("DeepSeek");
    expect(deepseek.capabilities.canExtract).toBe(true);
    expect(deepseek.capabilities.canInject).toBe(true);
  });

  it("should extract turns from DeepSeek mock DOM", async () => {
    const deepseek = new DeepSeekProvider();
    document.body.innerHTML = `
      <div class="chat-header-title">DeepSeek Reasoning Session</div>
      <div class="user-msg">Explain DeepSeek-R1 reasoning.</div>
      <div class="assistant-msg">DeepSeek-R1 uses reinforcement learning for step-by-step reasoning.</div>
    `;

    const conv = await deepseek.extractConversation();
    expect(conv.provider).toBe("deepseek");
    expect(conv.title).toBe("DeepSeek Reasoning Session");
    expect(conv.messages).toHaveLength(2);
    expect(conv.messages[0].role).toBe("user");
    expect(conv.messages[1].role).toBe("assistant");
  });

  it("should inject context into DeepSeek composer textarea", async () => {
    const deepseek = new DeepSeekProvider();
    document.body.innerHTML = `<textarea placeholder="Send a message..."></textarea>`;

    const injected = await deepseek.injectContext("DeepSeek Context Prompt");
    expect(injected).toBe(true);

    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    expect(textarea.value).toBe("DeepSeek Context Prompt");
  });
});
