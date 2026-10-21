import { detectActiveProvider } from "../providers";
import { ContentExtractor } from "./extractor";
import { ContentInjector } from "./injector";
import { ExtensionMessage } from "../shared/types";

const extractor = new ContentExtractor();
const injector = new ContentInjector();

function mountFloatingButton(): void {
  if (typeof document === "undefined" || document.getElementById("contextbridge-floating-host")) return;

  const host = document.createElement("div");
  host.id = "contextbridge-floating-host";
  const shadowRoot = host.attachShadow({ mode: "closed" });
  const style = document.createElement("style");
  style.textContent = `
    :host { all: initial; }
    button {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      gap: 7px;
      border: 0;
      border-radius: 999px;
      padding: 10px 14px;
      background: linear-gradient(135deg, #2563eb, #059669);
      color: #fff;
      box-shadow: 0 6px 20px rgba(15, 23, 42, .28);
      cursor: pointer;
      font: 700 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      transition: transform .15s ease, box-shadow .15s ease;
    }
    button:hover { transform: translateY(-2px); box-shadow: 0 9px 24px rgba(15, 23, 42, .36); }
    button:active { transform: translateY(0); }
    .mark { font-size: 14px; line-height: 1; }
  `;

  const button = document.createElement("button");
  button.type = "button";
  button.title = "Drag to move • Click to open ContextBridge";
  button.innerHTML = `<span class="mark">↔</span><span>ContextBridge</span>`;

  let isDragging = false;
  let suppressClick = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  const applyPosition = (left: number, top: number) => {
    const maxLeft = Math.max(8, window.innerWidth - button.offsetWidth - 8);
    const maxTop = Math.max(8, window.innerHeight - button.offsetHeight - 8);
    button.style.left = `${Math.min(Math.max(8, left), maxLeft)}px`;
    button.style.top = `${Math.min(Math.max(8, top), maxTop)}px`;
    button.style.right = "auto";
    button.style.bottom = "auto";
  };

  chrome.storage.local.get("cb_floating_button_position", (result) => {
    const position = result.cb_floating_button_position as { left?: number; top?: number } | undefined;
    if (typeof position?.left === "number" && typeof position.top === "number") {
      applyPosition(position.left, position.top);
    }
  });

  button.addEventListener("pointerdown", (event) => {
    isDragging = true;
    suppressClick = false;
    startX = event.clientX;
    startY = event.clientY;
    const rect = button.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
    button.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  button.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) suppressClick = true;
    applyPosition(startLeft + deltaX, startTop + deltaY);
  });

  button.addEventListener("pointerup", (event) => {
    if (!isDragging) return;
    isDragging = false;
    button.releasePointerCapture(event.pointerId);
    const rect = button.getBoundingClientRect();
    chrome.storage.local.set({
      cb_floating_button_position: { left: rect.left, top: rect.top }
    });
  });

  button.addEventListener("click", () => {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    chrome.runtime.sendMessage({ type: "OPEN_EXTENSION_POPUP" }, (response) => {
      if (chrome.runtime.lastError || response?.type === "RESPONSE_ERROR") {
        showInPageNotification("ContextBridge could not open");
      }
    });
  });

  shadowRoot.append(style, button);
  document.documentElement.appendChild(host);
}

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
      bottom: 70px;
      right: 24px;
      background: #10b981;
      color: #ffffff;
      padding: 10px 16px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
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

// Run auto-inject check & float pill when script loads
if (typeof document !== "undefined") {
  mountFloatingButton();
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
