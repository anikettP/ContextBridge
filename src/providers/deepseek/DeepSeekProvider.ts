import { BaseAIProvider } from "../base/AIProvider";
import { Conversation, Message, MessageRole, ProviderId } from "../../shared/types";
import { generateUniqueId } from "../../shared/utils";
import { pasteTextIntoElement } from "../../content/dom-utils";

export class DeepSeekProvider extends BaseAIProvider {
  id: ProviderId = "deepseek";
  name = "DeepSeek";

  detect(): boolean {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname;
    const href = window.location.href;

    if (host.includes("deepseek.com") || href.includes("deepseek.com")) {
      return true;
    }

    if (typeof document !== "undefined") {
      if (document.querySelector(".ds-markdown") || document.querySelector(".chat-message") || document.querySelector(".user-msg")) {
        return true;
      }
    }

    return false;
  }

  async getConversationTitle(): Promise<string | null> {
    if (typeof document === "undefined") return null;

    const titleEl = document.querySelector(".chat-header-title, h1, [data-testid='chat-title']");
    if (titleEl && titleEl.textContent?.trim() && titleEl.textContent.trim() !== "DeepSeek") {
      return titleEl.textContent.trim();
    }

    const title = document.title;
    if (title && !title.startsWith("DeepSeek")) {
      return title.replace(/ - DeepSeek$/, "").trim();
    }

    return "DeepSeek Conversation";
  }

  async extractConversation(): Promise<Conversation> {
    const messages: Message[] = [];
    if (typeof document === "undefined") {
      return { id: generateUniqueId("deepseek"), provider: this.id, messages };
    }

    let turnEls = Array.from(
      document.querySelectorAll(".chat-message, .ds-markdown, .user-msg, .assistant-msg, [data-role]")
    );

    if (turnEls.length === 0) {
      turnEls = Array.from(document.querySelectorAll('[class*="group/message"], .message-turn'));
    }

    for (let i = 0; i < turnEls.length; i++) {
      const el = turnEls[i];
      const roleAttr = el.getAttribute("data-role");

      let isUser = false;
      if (roleAttr === "user") {
        isUser = true;
      } else {
        isUser =
          el.classList.contains("user-msg") ||
          el.querySelector(".user-avatar") !== null ||
          (el as HTMLElement).innerText?.startsWith("You:");
      }

      const role: MessageRole = isUser ? "user" : "assistant";
      const content = el.textContent ? el.textContent.trim() : "";

      if (content) {
        messages.push({
          id: generateUniqueId(`ds_msg_${i}`),
          role,
          content,
          timestamp: new Date().toISOString()
        });
      }
    }

    const title = await this.getConversationTitle();

    return {
      id: generateUniqueId("ds_conv"),
      title: title || "DeepSeek Conversation",
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

    const selectors = ['textarea[placeholder*="Send"]', 'textarea', '[contenteditable="true"]'];
    for (const sel of selectors) {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el) {
        return pasteTextIntoElement(el, formattedContext);
      }
    }

    return false;
  }
}
