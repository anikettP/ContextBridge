import { describe, expect, it } from "vitest";
import { providerRegistry } from "../../src/providers/registry/ProviderRegistry";
import "../../src/providers/index"; // Triggers registration

describe("ProviderRegistry Test Suite", () => {
  it("should have registered all 7 first-class AI provider adapters", () => {
    const all = providerRegistry.getAll();
    expect(all).toHaveLength(7);
    const ids = all.map((p) => p.id);
    expect(ids).toEqual(["chatgpt", "claude", "gemini", "perplexity", "grok", "copilot", "deepseek"]);
  });

  it("should filter target providers excluding source provider", () => {
    const targetsForChatGPT = providerRegistry.getTargets("chatgpt");
    expect(targetsForChatGPT).toHaveLength(6);
    expect(targetsForChatGPT.find((p) => p.id === "chatgpt")).toBeUndefined();
    expect(targetsForChatGPT.find((p) => p.id === "claude")).toBeDefined();
    expect(targetsForChatGPT.find((p) => p.id === "grok")).toBeDefined();
  });

  it("should validate supported hostname patterns", () => {
    expect(providerRegistry.isSupportedHostname("https://chatgpt.com/c/123")).toBe(true);
    expect(providerRegistry.isSupportedHostname("https://claude.ai/chat/456")).toBe(true);
    expect(providerRegistry.isSupportedHostname("https://grok.com/")).toBe(true);
    expect(providerRegistry.isSupportedHostname("https://copilot.microsoft.com/")).toBe(true);
    expect(providerRegistry.isSupportedHostname("https://chat.deepseek.com/")).toBe(true);
    expect(providerRegistry.isSupportedHostname("https://example-unsupported-ai.com")).toBe(false);
  });
});
