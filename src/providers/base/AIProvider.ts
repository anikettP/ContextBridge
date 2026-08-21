import { Conversation, ProviderId } from "../../shared/types";
import { ProviderCapabilities, ProviderMetadata } from "./ProviderCapabilities";
import { SUPPORTED_PROVIDERS } from "../../shared/constants";

export interface AIProvider {
  id: ProviderId;
  name: string;
  metadata: ProviderMetadata;
  capabilities: ProviderCapabilities;

  /**
   * Returns true if the current web page belongs to this provider.
   */
  detect(): boolean;

  /**
   * Extracts the full conversation turn by turn from the active page DOM.
   */
  extractConversation(): Promise<Conversation>;

  /**
   * Injects context markdown into the provider's active input composer element.
   */
  injectContext(formattedContext: string): Promise<boolean>;

  /**
   * Retrieves the title of the active conversation from the DOM.
   */
  getConversationTitle(): Promise<string | null>;
}

export abstract class BaseAIProvider implements AIProvider {
  abstract id: ProviderId;
  abstract name: string;

  get metadata(): ProviderMetadata {
    return SUPPORTED_PROVIDERS[this.id] || SUPPORTED_PROVIDERS.unknown;
  }

  get capabilities(): ProviderCapabilities {
    return this.metadata.capabilities;
  }

  abstract detect(): boolean;
  abstract extractConversation(): Promise<Conversation>;
  abstract injectContext(formattedContext: string): Promise<boolean>;
  abstract getConversationTitle(): Promise<string | null>;

  /**
   * Helper to dispatch input/change events to trigger React/Vue state updates on injected content.
   */
  protected dispatchInputEvents(element: HTMLElement): void {
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    element.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: " " }));
    element.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, key: " " }));
  }

  /**
   * Helper to insert text into a contenteditable element preserving line breaks.
   */
  protected insertIntoContentEditable(element: HTMLElement, text: string): boolean {
    element.focus();
    
    // Try ExecCommand first if available
    try {
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      if (document.execCommand("insertText", false, text)) {
        this.dispatchInputEvents(element);
        return true;
      }
    } catch {
      // Fallback to textContent / innerText
    }

    // Direct content replacement fallback
    element.innerText = text;
    this.dispatchInputEvents(element);
    return true;
  }

  /**
   * Helper to insert text into standard HTMLTextAreaElement or HTMLInputElement.
   */
  protected insertIntoTextArea(element: HTMLTextAreaElement | HTMLInputElement, text: string): boolean {
    element.focus();
    element.value = text;
    this.dispatchInputEvents(element);
    return true;
  }
}
