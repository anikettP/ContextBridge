import { detectActiveProvider } from "../providers";
import { Conversation } from "../shared/types";

export class ContentExtractor {
  /**
   * Detects active provider and extracts conversation turns from the current tab.
   */
  public async extract(): Promise<{ conversation: Conversation; isPartial: boolean }> {
    const provider = detectActiveProvider();
    if (!provider) {
      throw new Error("No supported AI provider detected on this page.");
    }

    const conversation = await provider.extractConversation();

    // Check if partial conversation (e.g. scroll container has unrendered top messages)
    const hasScrollTop = document.documentElement.scrollTop > 500 || document.body.scrollTop > 500;
    const isPartial = hasScrollTop && conversation.messages.length < 10;

    return {
      conversation: {
        ...conversation,
        isPartial
      },
      isPartial
    };
  }
}
