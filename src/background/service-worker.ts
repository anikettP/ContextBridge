import { SUPPORTED_PROVIDERS } from "../shared/constants";
import { storageService } from "../storage/storage";

if (typeof chrome !== "undefined" && chrome.runtime) {
  chrome.runtime.onInstalled.addListener(() => {
    console.log("ContextBridge Extension Installed Successfully.");
  });

  // Listen for Keyboard Commands (Ctrl+Shift+C / Ctrl+Shift+T)
  if (chrome.commands) {
    chrome.commands.onCommand.addListener(async (command) => {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!activeTab?.id) return;

      if (command === "capture-conversation") {
        chrome.tabs.sendMessage(activeTab.id, { type: "EXTRACT_CONVERSATION" });
      } else if (command === "transfer-conversation") {
        const settings = await storageService.getSettings();
        const targetId = settings.preferredTargetProvider || "claude";
        const targetProviderInfo = SUPPORTED_PROVIDERS[targetId];

        if (targetProviderInfo) {
          chrome.tabs.create({ url: targetProviderInfo.homeUrl });
        }
      }
    });
  }

  // Auto-inject context when target AI tab finishes loading
  if (chrome.tabs) {
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      if (changeInfo.status === "complete" && tab.url) {
        const activeContext = await storageService.getActiveContext();
        if (activeContext) {
          const isAIProvider = Object.values(SUPPORTED_PROVIDERS).some((p) =>
            p.hostnamePatterns && p.hostnamePatterns.some((pattern) => tab.url?.includes(pattern))
          );

          if (isAIProvider) {
            const attemptInjection = (retriesLeft: number) => {
              chrome.tabs.sendMessage(
                tabId,
                {
                  type: "INJECT_CONTEXT",
                  payload: { formattedContext: activeContext }
                },
                (response) => {
                  const lastErr = chrome.runtime?.lastError;
                  if (response?.payload?.success) {
                    storageService.setActiveContext("");
                  } else if (retriesLeft > 0) {
                    if (lastErr && chrome.scripting) {
                      chrome.scripting.executeScript({
                        target: { tabId },
                        files: ["content.js"]
                      }, () => {
                        setTimeout(() => attemptInjection(retriesLeft - 1), 1000);
                      });
                    } else {
                      setTimeout(() => attemptInjection(retriesLeft - 1), 1500);
                    }
                  }
                }
              );
            };

            setTimeout(() => attemptInjection(5), 1500);
          }
        }
      }
    });
  }
}
