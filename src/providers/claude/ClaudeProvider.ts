import { BaseAIProvider } from "../base/AIProvider";
import { Conversation, Message, MessageRole, ProviderId } from "../../shared/types";
import { generateUniqueId } from "../../shared/utils";
import { pasteTextIntoElement } from "../../content/dom-utils";

export class ClaudeProvider extends BaseAIProvider {
  id: ProviderId = "claude";
  name = "Claude";

  detect(): boolean {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname;
    const href = window.location.href;

    if (host.includes("claude.ai") || href.includes("claude.ai")) {
      return true;
    }

    if (typeof document !== "undefined") {
      if (document.querySelector(".font-claude-message") || document.querySelector('[data-testid="user-message"]')) {
        return true;
      }
    }

    return false;
  }

  async getConversationTitle(): Promise<string | null> {
    if (typeof document === "undefined") return null;

    const titleBtn = document.querySelector("button[data-testid='chat-title-button'], [aria-label*='rename']");
    if (titleBtn && titleBtn.textContent?.trim()) {
      return titleBtn.textContent.trim();
    }

    const h1 = document.querySelector("h1");
    if (h1 && h1.textContent?.trim() && !h1.textContent.includes("Claude")) {
      return h1.textContent.trim();
    }

    const title = document.title;
    if (title && !title.startsWith("Claude")) {
      return title.replace(/ - Claude$/, "").trim();
    }

    return "Claude Conversation";
  }

  async extractConversation(): Promise<Conversation> {
    const messages: Message[] = [];
    if (typeof document === "undefined") {
      return { id: generateUniqueId("claude"), provider: this.id, messages };
    }

    let messageEls = Array.from(
      document.querySelectorAll(".font-claude-message, [data-test-render-count], .group\\/turn")
    );

    if (messageEls.length === 0) {
      messageEls = Array.from(document.querySelectorAll(".prose, fieldset + div"));
    }

    for (let i = 0; i < messageEls.length; i++) {
      const el = messageEls[i];
      const isUser =
        el.querySelector('[data-testid="user-message"]') !== null ||
        el.classList.contains("user-message") ||
        el.getAttribute("data-is-user") === "true" ||
        el.parentElement?.classList.contains("user-message");

      const role: MessageRole = isUser ? "user" : "assistant";
      const content = el.textContent ? el.textContent.trim() : "";

      if (content) {
        messages.push({
          id: generateUniqueId(`claude_msg_${i}`),
          role,
          content,
          timestamp: new Date().toISOString()
        });
      }
    }

    const title = await this.getConversationTitle();

    return {
      id: generateUniqueId("claude_conv"),
      title: title || "Claude Conversation",
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
      '.ProseMirror',
      'fieldset [contenteditable="true"]',
      'div[contenteditable="true"]',
      'p.placeholder',
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
