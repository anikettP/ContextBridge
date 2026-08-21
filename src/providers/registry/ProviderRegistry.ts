import { AIProvider } from "../base/AIProvider";
import { ProviderId } from "../../shared/types";
import { ChatGPTProvider } from "../chatgpt/ChatGPTProvider";
import { ClaudeProvider } from "../claude/ClaudeProvider";
import { GeminiProvider } from "../gemini/GeminiProvider";
import { PerplexityProvider } from "../perplexity/PerplexityProvider";
import { GrokProvider } from "../grok/GrokProvider";
import { CopilotProvider } from "../copilot/CopilotProvider";
import { DeepSeekProvider } from "../deepseek/DeepSeekProvider";

export class ProviderRegistry {
  private providers: Map<ProviderId, AIProvider> = new Map();

  /**
   * Registers an AIProvider adapter instance into the registry.
   */
  public register(provider: AIProvider): void {
    this.providers.set(provider.id, provider);
  }

  /**
   * Ensures all 7 first-class AI providers are registered.
   */
  private ensureRegistered(): void {
    if (this.providers.size === 0) {
      this.register(new ChatGPTProvider());
      this.register(new ClaudeProvider());
      this.register(new GeminiProvider());
      this.register(new PerplexityProvider());
      this.register(new GrokProvider());
      this.register(new CopilotProvider());
      this.register(new DeepSeekProvider());
    }
  }

  /**
   * Retrieves a registered provider by its ID.
   */
  public get(id: ProviderId): AIProvider | undefined {
    this.ensureRegistered();
    return this.providers.get(id);
  }

  /**
   * Returns all registered provider adapter instances.
   */
  public getAll(): AIProvider[] {
    this.ensureRegistered();
    return Array.from(this.providers.values());
  }

  /**
   * Detects the active provider on the current browser page.
   */
  public detectCurrent(): AIProvider | undefined {
    this.ensureRegistered();
    for (const provider of this.getAll()) {
      if (provider.detect()) {
        return provider;
      }
    }
    return undefined;
  }

  /**
   * Returns all valid target providers excluding the given source provider ID.
   */
  public getTargets(sourceId: ProviderId): AIProvider[] {
    this.ensureRegistered();
    const targets = this.getAll().filter((p) => p.id !== sourceId);
    return targets.length > 0 ? targets : this.getAll();
  }

  /**
   * Detects provider matching a given URL or hostname string.
   */
  public detectFromUrl(url?: string): AIProvider | undefined {
    if (!url) return undefined;
    this.ensureRegistered();
    for (const provider of this.getAll()) {
      if (provider.metadata.hostnamePatterns.some((pattern) => url.includes(pattern))) {
        return provider;
      }
    }
    return undefined;
  }

  /**
   * Checks if a given URL or hostname belongs to any registered provider.
   */
  public isSupportedHostname(url: string): boolean {
    return Boolean(this.detectFromUrl(url));
  }
}

// Global Singleton Instance
export const providerRegistry = new ProviderRegistry();
