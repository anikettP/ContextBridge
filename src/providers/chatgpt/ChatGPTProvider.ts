import { BaseAIProvider } from "../base/AIProvider";
import { Conversation, Message, MessageRole, ProviderId } from "../../shared/types";
import { generateUniqueId } from "../../shared/utils";
import { pasteTextIntoElement } from "../../content/dom-utils";

export class ChatGPTProvider extends BaseAIProvider {
  id: ProviderId = "chatgpt";
  name = "ChatGPT";

  detect(): boolean {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname;
    const href = window.location.href;

    if (host.includes("chatgpt.com") || host.includes("chat.openai.com") || href.includes("chatgpt.com") || href.includes("chat.openai.com")) {
      return true;
    }

    if (typeof document !== "undefined") {
      if (document.querySelector("#prompt-textarea") || document.querySelector("[data-message-author-role]")) {
        return true;
      }
    }

    return false;
  }

  async getConversationTitle(): Promise<string | null> {
    if (typeof document === "undefined") return null;

    const h1 = document.querySelector("h1");
    if (h1 && h1.textContent?.trim() && !h1.textContent.includes("ChatGPT")) {
      return h1.textContent.trim();
    }

    const title = document.title;
    if (title && !title.startsWith("ChatGPT") && !title.startsWith("New chat")) {
      return title.replace(/ - ChatGPT$/, "").trim();
    }

    return "ChatGPT Conversation";
  }

  async extractConversation(): Promise<Conversation> {
    const messages: Message[] = [];
    if (typeof document === "undefined") {
      return { id: generateUniqueId("chatgpt"), provider: this.id, messages };
    }

    let messageElements = Array.from(
      document.querySelectorAll("[data-message-author-role='user'], [data-message-author-role='assistant']")
    );

    if (messageElements.length === 0) {
      messageElements = Array.from(
        document.querySelectorAll("article, [data-message-id], [class*='conversation-turn']")
      );
    }

    const uniqueElements = Array.from(new Set(messageElements));

    for (let i = 0; i < uniqueElements.length; i++) {
      const el = uniqueElements[i];

      const role = this.getMessageRole(el, i);

      const markdownEl = el.querySelector(".markdown, .whitespace-pre-wrap, [class*='markdown']") || el;
      const content = this.cleanMessageContent((markdownEl as HTMLElement).innerText || markdownEl.textContent || "");

      if (content) {
        messages.push({
          id: generateUniqueId(`msg_${i}`),
          role,
          content,
          timestamp: new Date().toISOString()
        });
      }
    }

    const title = await this.getConversationTitle();

    return {
      id: generateUniqueId("chatgpt_conv"),
      title: title || "ChatGPT Conversation",
      provider: this.id,
      messages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : undefined,
      isPartial: false
    };
  }

  private getMessageRole(element: Element, index: number): MessageRole {
    const roleValue = element.getAttribute("data-message-author-role") ||
      element.getAttribute("data-role") ||
      element.getAttribute("data-is-user");

    if (roleValue === "user" || roleValue === "true") return "user";
    if (roleValue === "assistant" || roleValue === "false") return "assistant";

    const descriptor = [
      element.className,
      element.getAttribute("aria-label"),
      element.getAttribute("data-testid"),
      element.parentElement?.className,
      element.parentElement?.getAttribute("data-testid")
    ].filter(Boolean).join(" ").toLowerCase();

    if (/user|human|you-message|prompt/.test(descriptor)) return "user";
    if (/assistant|bot|response|message-content/.test(descriptor)) return "assistant";

    return index % 2 === 0 ? "user" : "assistant";
  }

  private cleanMessageContent(content: string): string {
    return content
      .replace(/^\s*(copy|edit|retry|regenerate)\s*$/gim, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  async injectContext(formattedContext: string): Promise<boolean> {
    if (typeof document === "undefined") return false;

    const textarea = document.querySelector("#prompt-textarea, [contenteditable='true'], textarea") as HTMLElement | null;
    if (textarea) {
      return pasteTextIntoElement(textarea, formattedContext);
    }

    return false;
  }
}
