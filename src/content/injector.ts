import { detectActiveProvider, getProviderById } from "../providers";
import { ProviderId } from "../shared/types";
import { pasteTextIntoElement } from "./dom-utils";

export { pasteTextIntoElement } from "./dom-utils";

export class ContentInjector {
  private readonly commonSelectors = [
    ".ProseMirror",
    "fieldset [contenteditable='true']",
    "#prompt-textarea",
    "rich-textarea div[contenteditable='true']",
    "textarea[placeholder*='Ask']",
    "textarea[placeholder*='Send']",
    "textarea[placeholder*='Message']",
    "#searchbox",
    "textarea",
    'div[contenteditable="true"]'
  ];

  public async inject(
    formattedContext: string,
    targetProviderId?: ProviderId
  ): Promise<{ success: boolean; method: "autoinject" | "clipboard" }> {
    let provider = detectActiveProvider();
    if (!provider && targetProviderId) {
      provider = getProviderById(targetProviderId);
    }

    if (provider) {
      const injected = await provider.injectContext(formattedContext);
      if (injected) {
        return { success: true, method: "autoinject" };
      }
    }

    for (const selector of this.commonSelectors) {
      const element = document.querySelector(selector) as HTMLElement | null;
      if (element && (element.offsetWidth > 0 || element.offsetHeight > 0 || element.isConnected)) {
        const pasted = pasteTextIntoElement(element, formattedContext);
        if (pasted) {
          return { success: true, method: "autoinject" };
        }
      }
    }

    return { success: false, method: "clipboard" };
  }
}
