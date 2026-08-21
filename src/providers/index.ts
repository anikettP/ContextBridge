import { ChatGPTProvider } from "./chatgpt/ChatGPTProvider";
import { ClaudeProvider } from "./claude/ClaudeProvider";
import { GeminiProvider } from "./gemini/GeminiProvider";
import { PerplexityProvider } from "./perplexity/PerplexityProvider";
import { GrokProvider } from "./grok/GrokProvider";
import { CopilotProvider } from "./copilot/CopilotProvider";
import { DeepSeekProvider } from "./deepseek/DeepSeekProvider";
import { providerRegistry } from "./registry/ProviderRegistry";
import { ProviderId } from "../shared/types";
import { AIProvider } from "./base/AIProvider";

export * from "./base/AIProvider";
export * from "./base/ProviderCapabilities";
export * from "./registry/ProviderRegistry";

export * from "./chatgpt/ChatGPTProvider";
export * from "./claude/ClaudeProvider";
export * from "./gemini/GeminiProvider";
export * from "./perplexity/PerplexityProvider";
export * from "./grok/GrokProvider";
export * from "./copilot/CopilotProvider";
export * from "./deepseek/DeepSeekProvider";

// Register all 7 AI Provider Adapters into the ProviderRegistry
providerRegistry.register(new ChatGPTProvider());
providerRegistry.register(new ClaudeProvider());
providerRegistry.register(new GeminiProvider());
providerRegistry.register(new PerplexityProvider());
providerRegistry.register(new GrokProvider());
providerRegistry.register(new CopilotProvider());
providerRegistry.register(new DeepSeekProvider());

/**
 * Facade helper returning all registered provider adapter instances.
 */
export function getAllProviders(): AIProvider[] {
  return providerRegistry.getAll();
}

/**
 * Facade helper detecting active provider adapter on the page.
 */
export function detectActiveProvider(): AIProvider | null {
  return providerRegistry.detectCurrent() || null;
}

/**
 * Facade helper retrieving provider adapter by ID.
 */
export function getProviderById(id: ProviderId): AIProvider | null {
  return providerRegistry.get(id) || null;
}
