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
      document.querySelectorAll("[data-message-author-role], article, [data-message-id]")
    );

    if (messageElements.length === 0) {
      messageElements = Array.from(
        document.querySelectorAll(".text-base, [class*='conversation-turn']")
      );
    }

    for (let i = 0; i < messageElements.length; i++) {
      const el = messageElements[i];

      let role: MessageRole = "assistant";
      const authorRole = el.getAttribute("data-message-author-role");

      if (authorRole === "user" || authorRole === "assistant") {
        role = authorRole;
      } else {
        const isUser =
          el.querySelector("[data-message-author-role='user']") !== null ||
          el.classList.contains("user-message") ||
          (el as HTMLElement).innerText?.includes("You said:");
        role = isUser ? "user" : "assistant";
      }

      const markdownEl = el.querySelector(".markdown, .whitespace-pre-wrap, [class*='markdown']") || el;
      const content = markdownEl.textContent ? markdownEl.textContent.trim() : "";

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

  async injectContext(formattedContext: string): Promise<boolean> {
    if (typeof document === "undefined") return false;

    const textarea = document.querySelector("#prompt-textarea, [contenteditable='true'], textarea") as HTMLElement | null;
    if (textarea) {
      return pasteTextIntoElement(textarea, formattedContext);
    }

    return false;
  }
}
