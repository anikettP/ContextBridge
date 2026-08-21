import { BaseAIProvider } from "../base/AIProvider";
import { Conversation, Message, MessageRole, ProviderId } from "../../shared/types";
import { generateUniqueId } from "../../shared/utils";
import { pasteTextIntoElement } from "../../content/dom-utils";

export class GrokProvider extends BaseAIProvider {
  id: ProviderId = "grok";
  name = "Grok";

  detect(): boolean {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname;
    const href = window.location.href;

    if (host.includes("grok.com") || host.includes("x.ai") || href.includes("grok.com") || href.includes("x.ai")) {
      return true;
    }

    if (typeof document !== "undefined") {
      if (document.querySelector('[data-testid="message-turn"]') || document.querySelector(".user-prompt")) {
        return true;
      }
    }

    return false;
  }

  async getConversationTitle(): Promise<string | null> {
    if (typeof document === "undefined") return null;

    const h1 = document.querySelector("h1");
    if (h1 && h1.textContent?.trim() && h1.textContent.trim() !== "Grok") {
      return h1.textContent.trim();
    }

    const title = document.title;
    if (title && !title.startsWith("Grok")) {
      return title.replace(/ - Grok$/, "").trim();
    }

    return "Grok Conversation";
  }

  async extractConversation(): Promise<Conversation> {
    const messages: Message[] = [];
    if (typeof document === "undefined") {
      return { id: generateUniqueId("grok"), provider: this.id, messages };
    }

    let turnEls = Array.from(
      document.querySelectorAll('[data-testid="message-turn"], .response-turn, .user-prompt, .prose, .message-bubble')
    );

    if (turnEls.length === 0) {
      turnEls = Array.from(document.querySelectorAll('[class*="group/turn"], .items-start'));
    }

    for (let i = 0; i < turnEls.length; i++) {
      const el = turnEls[i];
      const isUser =
        el.classList.contains("user-prompt") ||
        el.getAttribute("data-is-user") === "true" ||
        el.querySelector('[data-testid="user-avatar"]') !== null ||
        (el as HTMLElement).innerText?.startsWith("You:");

      const role: MessageRole = isUser ? "user" : "assistant";
      const content = el.textContent ? el.textContent.trim() : "";

      if (content) {
        messages.push({
          id: generateUniqueId(`grok_msg_${i}`),
          role,
          content,
          timestamp: new Date().toISOString()
        });
      }
    }

    const title = await this.getConversationTitle();

    return {
      id: generateUniqueId("grok_conv"),
      title: title || "Grok Conversation",
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
