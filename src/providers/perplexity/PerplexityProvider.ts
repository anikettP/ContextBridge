import { BaseAIProvider } from "../base/AIProvider";
import { Conversation, Message, MessageRole, ProviderId } from "../../shared/types";
import { generateUniqueId } from "../../shared/utils";
import { pasteTextIntoElement } from "../../content/dom-utils";

export class PerplexityProvider extends BaseAIProvider {
  id: ProviderId = "perplexity";
  name = "Perplexity";

  detect(): boolean {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname;
    const href = window.location.href;

    if (host.includes("perplexity.ai") || href.includes("perplexity.ai")) {
      return true;
    }

    if (typeof document !== "undefined") {
      if (document.querySelector('[data-testid="query"]') || document.querySelector('[data-testid="answer"]')) {
        return true;
      }
    }

    return false;
  }

  async getConversationTitle(): Promise<string | null> {
    if (typeof document === "undefined") return null;

    const h1 = document.querySelector("h1");
    if (h1 && h1.textContent?.trim()) {
      return h1.textContent.trim();
    }

    const title = document.title;
    if (title && !title.startsWith("Perplexity")) {
      return title.replace(/ - Perplexity$/, "").trim();
    }

    return "Perplexity Conversation";
  }

  async extractConversation(): Promise<Conversation> {
    const messages: Message[] = [];
    if (typeof document === "undefined") {
      return { id: generateUniqueId("pplx"), provider: this.id, messages };
    }

    const turnEls = Array.from(
      document.querySelectorAll('[data-testid="query"], [data-testid="answer"], .prose, .group\\/query')
    );

    for (let i = 0; i < turnEls.length; i++) {
      const el = turnEls[i];
      const testId = el.getAttribute("data-testid");
      const isUser = testId === "query" || el.classList.contains("group/query");
      const role: MessageRole = isUser ? "user" : "assistant";
      const content = el.textContent ? el.textContent.trim() : "";

      if (content) {
        messages.push({
          id: generateUniqueId(`pplx_msg_${i}`),
          role,
          content,
          timestamp: new Date().toISOString()
        });
      }
    }

    const title = await this.getConversationTitle();

    return {
      id: generateUniqueId("pplx_conv"),
      title: title || "Perplexity Conversation",
      provider: this.id,
      messages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : undefined,
      isPartial: false
    };
  }

  async injectContext(formattedContext: string): Promise<boolean> {
    if (typeof document === "undefined") return false;

    const selectors = ['textarea[placeholder*="Ask"]', 'textarea', '[contenteditable="true"]'];
    for (const sel of selectors) {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el) {
        return pasteTextIntoElement(el, formattedContext);
      }
    }

    return false;
  }
}
