import { detectActiveProvider } from "../providers";
import { ContentExtractor } from "./extractor";
import { ContentInjector } from "./injector";
import { ExtensionMessage } from "../shared/types";

const extractor = new ContentExtractor();
const injector = new ContentInjector();

/**
 * Renders a clean in-page toast notification for confirmation when context is injected.
 */
function showInPageNotification(message: string): void {
  if (typeof document === "undefined") return;

  const existing = document.getElementById("cb-in-page-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "cb-in-page-toast";
  toast.innerText = message;
  toast.setAttribute(
    "style",
    `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #10b981;
      color: #ffffff;
      padding: 10px 16px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 999999;
      transition: all 0.3s ease;
    `
  );

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Auto-inject stored active context on target AI page load with 25s polling loop & DOM MutationObserver.
 */
async function checkAndAutoInjectOnLoad(): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) return;

  chrome.storage.local.get("cb_active_context", async (result) => {
    const activeContext = result["cb_active_context"];
    if (!activeContext || typeof activeContext !== "string" || activeContext.trim().length === 0) {
      return;
    }

    let injected = false;
    const startTime = Date.now();
    const timeoutMs = 25000;

    const tryInjectNow = async (): Promise<boolean> => {
      if (injected) return true;
      const activeProvider = detectActiveProvider();
      const res = await injector.inject(activeContext, activeProvider?.id);

      if (res.success) {
        injected = true;
        chrome.storage.local.remove("cb_active_context");
        showInPageNotification(
          `Context injected into ${activeProvider?.name || "Composer"}`
        );
        return true;
      }
      return false;
    };

    if (await tryInjectNow()) return;

    const observer = new MutationObserver(async () => {
      if (!injected) {
        if (await tryInjectNow()) {
          observer.disconnect();
        }
      }
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }

    while (Date.now() - startTime < timeoutMs && !injected) {
      if (await tryInjectNow()) {
        observer.disconnect();
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    observer.disconnect();
  });
}

// Run auto-inject check when script loads
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkAndAutoInjectOnLoad);
  } else {
    checkAndAutoInjectOnLoad();
  }
}

// Chrome runtime message listener
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
    (async () => {
      try {
        switch (message.type) {
          case "DETECT_PROVIDER": {
            const active = detectActiveProvider();
            sendResponse({
              type: "RESPONSE_SUCCESS",
              payload: {
                detected: Boolean(active),
                providerId: active ? active.id : "unknown",
                providerName: active ? active.name : "Unknown"
              }
            });
            break;
          }

          case "EXTRACT_CONVERSATION": {
            const result = await extractor.extract();
            sendResponse({
              type: "RESPONSE_SUCCESS",
              payload: result
            });
            break;
          }

          case "INJECT_CONTEXT": {
            const result = await injector.inject(message.payload.formattedContext);
            if (result.success) {
              chrome.storage.local.remove("cb_active_context");
              showInPageNotification("Context Injected into Composer");
            }
            sendResponse({
              type: "RESPONSE_SUCCESS",
              payload: result
            });
            break;
          }

          case "GET_CONVERSATION_TITLE": {
            const active = detectActiveProvider();
            const title = active ? await active.getConversationTitle() : null;
            sendResponse({
              type: "RESPONSE_SUCCESS",
              payload: { title }
            });
            break;
          }

          default:
            sendResponse({
              type: "RESPONSE_ERROR",
              error: "Unknown message type"
            });
        }
      } catch (err: any) {
        sendResponse({
          type: "RESPONSE_ERROR",
          error: err?.message || "Content script error"
        });
      }
    })();

    return true;
  });
}
