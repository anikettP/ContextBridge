import { describe, expect, it } from "vitest";
import { CopilotProvider } from "../../src/providers/copilot/CopilotProvider";

describe("CopilotProvider Test Suite", () => {
  it("should declare capabilities correctly", () => {
    const copilot = new CopilotProvider();
    expect(copilot.id).toBe("copilot");
    expect(copilot.name).toBe("Microsoft Copilot");
    expect(copilot.capabilities.canExtract).toBe(true);
    expect(copilot.capabilities.canInject).toBe(true);
  });

  it("should extract turns from Copilot mock DOM", async () => {
    const copilot = new CopilotProvider();
    document.body.innerHTML = `
      <h1>Copilot Design Discussion</h1>
      <div class="user-message">Can Copilot summarize code?</div>
      <div class="bot-message">Yes! Microsoft Copilot can analyze complex code repositories.</div>
    `;

    const conv = await copilot.extractConversation();
    expect(conv.provider).toBe("copilot");
    expect(conv.title).toBe("Copilot Design Discussion");
    expect(conv.messages).toHaveLength(2);
    expect(conv.messages[0].role).toBe("user");
    expect(conv.messages[1].role).toBe("assistant");
  });

  it("should inject context into Copilot textarea", async () => {
    const copilot = new CopilotProvider();
    document.body.innerHTML = `<textarea aria-label="Ask Copilot"></textarea>`;

    const injected = await copilot.injectContext("Copilot Context Prompt");
    expect(injected).toBe(true);

    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    expect(textarea.value).toBe("Copilot Context Prompt");
  });
});
