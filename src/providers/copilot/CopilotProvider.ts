import { BaseAIProvider } from "../base/AIProvider";
import { Conversation, Message, MessageRole, ProviderId } from "../../shared/types";
import { generateUniqueId } from "../../shared/utils";
import { pasteTextIntoElement } from "../../content/dom-utils";

export class CopilotProvider extends BaseAIProvider {
  id: ProviderId = "copilot";
  name = "Microsoft Copilot";

  detect(): boolean {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname;
    const href = window.location.href;

    if (host.includes("copilot.microsoft.com") || host.includes("bing.com") || href.includes("copilot") || href.includes("bing.com/chat")) {
      return true;
    }

    if (typeof document !== "undefined") {
      if (document.querySelector("cib-chat-turn") || document.querySelector(".user-message") || document.querySelector("#searchbox")) {
        return true;
      }
    }

    return false;
  }

  async getConversationTitle(): Promise<string | null> {
    if (typeof document === "undefined") return null;

    const titleEl = document.querySelector(".chat-title, h1, [data-testid='conversation-title']");
    if (titleEl && titleEl.textContent?.trim() && titleEl.textContent.trim() !== "Copilot" && titleEl.textContent.trim() !== "Microsoft Copilot") {
      return titleEl.textContent.trim();
    }

    const title = document.title;
    if (title && !title.startsWith("Copilot")) {
      return title.replace(/ - Copilot$/, "").trim();
    }

    return "Microsoft Copilot Conversation";
  }

  async extractConversation(): Promise<Conversation> {
    const messages: Message[] = [];
    if (typeof document === "undefined") {
      return { id: generateUniqueId("copilot"), provider: this.id, messages };
    }

    let turnEls = Array.from(
      document.querySelectorAll("cib-chat-turn, .user-message, .bot-message, .group-container, [data-author='user']")
    );

    if (turnEls.length === 0) {
      turnEls = Array.from(document.querySelectorAll(".message-content, .ac-container"));
    }

    for (let i = 0; i < turnEls.length; i++) {
      const el = turnEls[i];
      const tag = el.tagName.toLowerCase();

      const isUser =
        tag.includes("user") ||
        el.classList.contains("user-message") ||
        el.getAttribute("data-author") === "user" ||
        el.querySelector(".user-avatar") !== null;

      const role: MessageRole = isUser ? "user" : "assistant";
      const content = el.textContent ? el.textContent.trim() : "";

      if (content) {
        messages.push({
          id: generateUniqueId(`copilot_msg_${i}`),
          role,
          content,
          timestamp: new Date().toISOString()
        });
      }
    }

    const title = await this.getConversationTitle();

    return {
      id: generateUniqueId("copilot_conv"),
      title: title || "Microsoft Copilot Conversation",
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

    const selectors = ['#searchbox', 'textarea[aria-label*="Ask"]', 'textarea', '[contenteditable="true"]'];
    for (const sel of selectors) {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el) {
        return pasteTextIntoElement(el, formattedContext);
      }
    }

    return false;
  }
}
