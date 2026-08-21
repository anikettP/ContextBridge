import { BaseAIProvider } from "../base/AIProvider";
import { Conversation, Message, MessageRole, ProviderId } from "../../shared/types";
import { generateUniqueId } from "../../shared/utils";
import { pasteTextIntoElement } from "../../content/dom-utils";

export class GeminiProvider extends BaseAIProvider {
  id: ProviderId = "gemini";
  name = "Google Gemini";

  detect(): boolean {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname;
    const href = window.location.href;

    if (host.includes("gemini.google.com") || href.includes("gemini.google.com")) {
      return true;
    }

    if (typeof document !== "undefined") {
      if (document.querySelector("user-query") || document.querySelector("model-response") || document.querySelector("rich-textarea")) {
        return true;
      }
    }

    return false;
  }

  async getConversationTitle(): Promise<string | null> {
    if (typeof document === "undefined") return null;

    const titleEl = document.querySelector(".conversation-title, [data-test-id='conversation-title']");
    if (titleEl && titleEl.textContent?.trim()) {
      return titleEl.textContent.trim();
    }

    const title = document.title;
    if (title && !title.startsWith("Gemini")) {
      return title.replace(/ - Gemini$/, "").trim();
    }

    return "Gemini Conversation";
  }

  async extractConversation(): Promise<Conversation> {
    const messages: Message[] = [];
    if (typeof document === "undefined") {
      return { id: generateUniqueId("gemini"), provider: this.id, messages };
    }

    let turnEls = Array.from(
      document.querySelectorAll("user-query, model-response, .user-query-container, .model-response-container, [class*='user-query'], [class*='model-response']")
    );

    if (turnEls.length === 0) {
      turnEls = Array.from(document.querySelectorAll(".message-content, .query-content, .response-content"));
    }

    for (let i = 0; i < turnEls.length; i++) {
      const el = turnEls[i];
      const tag = el.tagName.toLowerCase();
      const isUser =
        tag === "user-query" ||
        el.classList.contains("user-query-container") ||
        el.className.includes("user-query") ||
        el.className.includes("query");

      const role: MessageRole = isUser ? "user" : "assistant";
      const content = el.textContent ? el.textContent.trim() : "";

      if (content) {
        messages.push({
          id: generateUniqueId(`gemini_msg_${i}`),
          role,
          content,
          timestamp: new Date().toISOString()
        });
      }
    }

    const title = await this.getConversationTitle();

    return {
      id: generateUniqueId("gemini_conv"),
      title: title || "Gemini Conversation",
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

    const selectors = [
      'rich-textarea div[contenteditable="true"]',
      '.rich-textarea div[contenteditable="true"]',
      'div[contenteditable="true"]',
      'textarea'
    ];

    for (const sel of selectors) {
      const editable = document.querySelector(sel) as HTMLElement | null;
      if (editable) {
        return pasteTextIntoElement(editable, formattedContext);
      }
    }

    return false;
  }
}
