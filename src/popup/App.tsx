import React, { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { ProviderBadge } from "./components/ProviderBadge";
import { StrategySelector } from "./components/StrategySelector";
import { PreviewEditor } from "./components/PreviewEditor";
import { MemoryList } from "./components/MemoryList";
import { ExportImportModal } from "./components/ExportImportModal";
import { ProviderLogo } from "./components/ProviderLogos";

import { ContextCompressor } from "../context-engine/compressor";
import { providerRegistry } from "../providers/registry/ProviderRegistry";
import "../providers/index"; // Guaranteed provider registration
import { PERSONA_DESCRIPTIONS, SUPPORTED_PROVIDERS } from "../shared/constants";
import {
  ContextPackage,
  ContextStrategyMode,
  Conversation,
  PersonaId,
  ProviderId,
  SavedProjectMemory
} from "../shared/types";
import { storageService } from "../storage/storage";
import { generateUniqueId } from "../shared/utils";
import {
  Check,
  Copy,
  ExternalLink,
  FileText,
  Layers,
  Send,
  ShieldCheck,
  UserCheck,
  Zap
} from "lucide-react";

export const App: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeTab, setActiveTab] = useState<"transfer" | "preview" | "memories" | "export">("transfer");
  const [providerId, setProviderId] = useState<ProviderId>("chatgpt");
  const [messageCount, setMessageCount] = useState<number>(0);
  const [isPartial, setIsPartial] = useState<boolean>(false);
  const [rawConversation, setRawConversation] = useState<Conversation | null>(null);
  
  const [strategy, setStrategy] = useState<ContextStrategyMode>("smart");
  const [lastNCount, setLastNCount] = useState<number>(20);
  const [targetProvider, setTargetProvider] = useState<ProviderId>("claude");
  const [persona, setPersona] = useState<PersonaId>("architect");
  const [customPersonaPrompt, setCustomPersonaPrompt] = useState<string>(
    "Act as a Senior Developer. Analyze the context and provide clean implementation steps."
  );

  const [contextPackage, setContextPackage] = useState<ContextPackage | null>(null);
  const [savedMemories, setSavedMemories] = useState<SavedProjectMemory[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  const compressor = new ContextCompressor();

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load storage data and detect active tab
  useEffect(() => {
    (async () => {
      const memories = await storageService.getSavedMemories();
      setSavedMemories(memories);

      const settings = await storageService.getSettings();
      if (settings.defaultStrategy) setStrategy(settings.defaultStrategy);
      if (settings.preferredTargetProvider) setTargetProvider(settings.preferredTargetProvider);

      detectAndExtractCurrentTab();
    })();
  }, []);

  const detectAndExtractCurrentTab = () => {
    if (typeof chrome === "undefined" || !chrome.tabs) {
      mockLocalDetection();
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) return;

      const detectedFromUrl = providerRegistry.detectFromUrl(tab.url);
      if (detectedFromUrl) {
        setProviderId(detectedFromUrl.id);
        const targets = providerRegistry.getTargets(detectedFromUrl.id);
        if (targets.length > 0) {
          setTargetProvider((prev) => (prev === detectedFromUrl.id ? targets[0].id : prev));
        }
      }

      const tryExtraction = () => {
        chrome.tabs.sendMessage(tab.id!, { type: "EXTRACT_CONVERSATION" }, (response) => {
          const lastErr = chrome.runtime?.lastError;

          if (response && response.type === "RESPONSE_SUCCESS") {
            const conv: Conversation = response.payload.conversation;
            setRawConversation(conv);
            setProviderId(conv.provider);
            setMessageCount(conv.messages.length);
            setIsPartial(response.payload.isPartial);

            const processed = compressor.process(conv, {
              mode: strategy,
              lastNCount,
              targetProvider,
              persona,
              customPersonaPrompt
            });
            setContextPackage(processed);
          } else if (lastErr && chrome.scripting) {
            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id! },
                files: ["content.js"]
              },
              () => {
                setTimeout(() => {
                  chrome.tabs.sendMessage(tab.id!, { type: "EXTRACT_CONVERSATION" }, (retryResp) => {
                    if (retryResp && retryResp.type === "RESPONSE_SUCCESS") {
                      const conv: Conversation = retryResp.payload.conversation;
                      setRawConversation(conv);
                      setProviderId(conv.provider);
                      setMessageCount(conv.messages.length);
                      setIsPartial(retryResp.payload.isPartial);
                      const processed = compressor.process(conv, {
                        mode: strategy,
                        lastNCount,
                        targetProvider,
                        persona,
                        customPersonaPrompt
                      });
                      setContextPackage(processed);
                    }
                  });
                }, 200);
              }
            );
          }
        });
      };

      tryExtraction();
    });
  };

  const mockLocalDetection = () => {
    const mockConv: Conversation = {
      id: "mock_1",
      provider: "chatgpt",
      title: "Build SaaS Web Application Architecture",
      messages: [
        { id: "1", role: "user", content: "I want to build a Chrome Extension for transferring AI conversations." },
        { id: "2", role: "assistant", content: "Great! We should use TypeScript, React 19, Vite, and Manifest V3." },
        { id: "3", role: "user", content: "We decided to perform local processing and support ChatGPT, Claude, Gemini, Grok, Copilot, DeepSeek." },
        { id: "4", role: "assistant", content: "Perfect decision. I will structure provider adapters and Context Engine." }
      ]
    };
    setRawConversation(mockConv);
    setProviderId("chatgpt");
    setMessageCount(4);

    const processed = compressor.process(mockConv, {
      mode: "smart",
      lastNCount: 20,
      persona: "architect",
      customPersonaPrompt
    });
    setContextPackage(processed);
  };

  const handleStrategyChange = (newStrategy: ContextStrategyMode) => {
    setStrategy(newStrategy);
    if (rawConversation) {
      const processed = compressor.process(rawConversation, {
        mode: newStrategy,
        lastNCount,
        targetProvider,
        persona,
        customPersonaPrompt
      });
      setContextPackage(processed);
    }
  };

  const handlePersonaChange = (newPersona: PersonaId) => {
    setPersona(newPersona);
    if (rawConversation) {
      const processed = compressor.process(rawConversation, {
        mode: strategy,
        lastNCount,
        targetProvider,
        persona: newPersona,
        customPersonaPrompt
      });
      setContextPackage(processed);
    }
  };

  const handleCustomPromptChange = (prompt: string) => {
    setCustomPersonaPrompt(prompt);
    if (rawConversation && persona === "custom") {
      const processed = compressor.process(rawConversation, {
        mode: strategy,
        lastNCount,
        targetProvider,
        persona: "custom",
        customPersonaPrompt: prompt
      });
      setContextPackage(processed);
    }
  };

  const handleExecuteTransfer = async (selectedTargetId?: ProviderId) => {
    const targetId = selectedTargetId || targetProvider;

    let pkg = contextPackage;
    if (!pkg && rawConversation) {
      pkg = compressor.process(rawConversation, {
        mode: strategy,
        targetProvider: targetId,
        persona,
        customPersonaPrompt
      });
      setContextPackage(pkg);
    }
    if (!pkg) {
      showToast("No conversation detected on active page.");
      return;
    }

    copyToClipboard(pkg.formattedMarkdown);
    await storageService.setActiveContext(pkg.formattedMarkdown);
    const targetInfo = SUPPORTED_PROVIDERS[targetId];

    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (
          tab?.id &&
          tab.url &&
          targetInfo.hostnamePatterns.some((pattern) => tab.url?.includes(pattern))
        ) {
          chrome.tabs.sendMessage(tab.id, {
            type: "INJECT_CONTEXT",
            payload: { formattedContext: pkg!.formattedMarkdown }
          }, (res) => {
            if (res && res.payload?.success) {
              showToast(`Context injected into ${targetInfo.name}`);
            } else {
              showToast(`Context copied. Ready for ${targetInfo.name}.`);
            }
          });
        } else {
          chrome.tabs.create({ url: targetInfo.homeUrl });
          showToast(`Opening ${targetInfo.name}... Prompt copied & ready`);
        }
      });
    } else {
      showToast(`Context prompt copied for ${targetInfo.name}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const handleSaveMemory = async (name: string) => {
    if (!contextPackage) return;
    const memory: SavedProjectMemory = {
      id: generateUniqueId("mem"),
      name,
      sourceProvider: contextPackage.sourceProvider,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      context: contextPackage.metadata,
      estimatedTokens: contextPackage.estimatedTokens,
      formattedMarkdown: contextPackage.formattedMarkdown
    };
    await storageService.saveMemory(memory);
    const updated = await storageService.getSavedMemories();
    setSavedMemories(updated);
    showToast(`Saved memory "${name}"`);
  };

  const handleDeleteMemory = async (id: string) => {
    await storageService.deleteMemory(id);
    const updated = await storageService.getSavedMemories();
    setSavedMemories(updated);
    showToast("Memory deleted");
  };

  const handleOpenOptions = () => {
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      alert("Options page available in extension build.");
    }
  };

  const availableTargets = providerRegistry.getTargets(providerId);
  const targetInfo = SUPPORTED_PROVIDERS[targetProvider] || SUPPORTED_PROVIDERS.claude;
  const currentPersonaInfo = PERSONA_DESCRIPTIONS[persona] || PERSONA_DESCRIPTIONS.architect;

  return (
    <div className="app-container">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenOptions={handleOpenOptions}
      />

      <div className="nav-bar">
        <button
          className={`tab-btn ${activeTab === "transfer" ? "active" : ""}`}
          onClick={() => setActiveTab("transfer")}
        >
          <Zap size={14} /> Transfer
        </button>
        <button
          className={`tab-btn ${activeTab === "preview" ? "active" : ""}`}
          onClick={() => setActiveTab("preview")}
        >
          <FileText size={14} /> Preview
        </button>
        <button
          className={`tab-btn ${activeTab === "memories" ? "active" : ""}`}
          onClick={() => setActiveTab("memories")}
        >
          <Layers size={14} /> Memories ({savedMemories.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "export" ? "active" : ""}`}
          onClick={() => setActiveTab("export")}
        >
          <ExternalLink size={14} /> Export
        </button>
      </div>

      {toastMessage && <div className="toast-banner">{toastMessage}</div>}

      <div className="main-body">
        {activeTab === "transfer" && (
          <>
            {/* Auto Detected Source Card */}
            <ProviderBadge
              providerId={providerId}
              detectedMessageCount={messageCount}
              isPartial={isPartial}
            />

            {/* Target Destination Selector Card */}
            <div className="panel-card" style={{ borderLeft: `4px solid ${targetInfo.accentColor}` }}>
              <div className="panel-header">
                <span className="panel-title">Target Destination AI</span>
                <span style={{ fontSize: "11px", fontWeight: "700", color: targetInfo.accentColor, display: "flex", alignItems: "center", gap: "4px" }}>
                  <ProviderLogo providerId={targetProvider} size={14} /> {targetInfo.name} Selected
                </span>
              </div>

              <div className="target-main-grid">
                {availableTargets.map((p) => (
                  <div
                    key={p.id}
                    className={`target-mini-card ${p.id === targetProvider ? "selected" : ""}`}
                    onClick={() => {
                      setTargetProvider(p.id);
                      if (rawConversation) {
                        const proc = compressor.process(rawConversation, {
                          mode: strategy,
                          lastNCount,
                          targetProvider: p.id,
                          persona,
                          customPersonaPrompt
                        });
                        setContextPackage(proc);
                      }
                    }}
                  >
                    <div
                      className="target-mini-icon"
                      style={{ background: p.metadata.accentColor }}
                    >
                      <ProviderLogo providerId={p.id} size={14} />
                    </div>
                    <span className="target-mini-name">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target AI Persona Adapter */}
            <div className="panel-card">
              <div className="panel-header">
                <span className="panel-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <UserCheck size={13} color="var(--primary)" /> Target Role Directive
                </span>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--primary)" }}>
                  {currentPersonaInfo.name}
                </span>
              </div>
              <select
                className="form-select"
                value={persona}
                onChange={(e) => handlePersonaChange(e.target.value as PersonaId)}
              >
                {Object.entries(PERSONA_DESCRIPTIONS).map(([id, info]) => (
                  <option key={id} value={id}>
                    {info.name}
                  </option>
                ))}
              </select>

              {persona === "custom" && (
                <div style={{ marginTop: "6px" }}>
                  <textarea
                    className="form-input"
                    style={{ height: "60px", resize: "none", fontSize: "12px" }}
                    placeholder="Type custom target role directive..."
                    value={customPersonaPrompt}
                    onChange={(e) => handleCustomPromptChange(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Strategy Switcher Pills */}
            <StrategySelector
              strategy={strategy}
              onSelectStrategy={handleStrategyChange}
              lastNCount={lastNCount}
              onChangeLastNCount={setLastNCount}
            />

            {/* Privacy Shield Status Pill */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-subtle)", padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border-main)" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--success)", display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={14} color="var(--success)" /> Privacy Shield Active
              </span>
              <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "500" }}>
                Auto-redacting API keys & credentials
              </span>
            </div>

            {contextPackage && (
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Estimated Token Size</span>
                  <span className="stat-number">~{contextPackage.estimatedTokens.toLocaleString()}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Fidelity Preserved</span>
                  <span className="stat-number" style={{ color: "var(--success)" }}>
                    {contextPackage.informationRetentionPercentage}%
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" }}>
              <button
                className="btn-secondary"
                onClick={() => {
                  if (contextPackage) copyToClipboard(contextPackage.formattedMarkdown);
                }}
              >
                {copiedToast ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                {copiedToast ? "Copied Prompt to Clipboard" : "Copy Context Prompt"}
              </button>

              <button className="btn-hero" onClick={() => handleExecuteTransfer(targetProvider)}>
                Transfer Conversation to {targetInfo.name} <Send size={16} />
              </button>
            </div>
          </>
        )}

        {activeTab === "preview" && (
          contextPackage ? (
            <PreviewEditor
              contextPackage={contextPackage}
              onCopy={copyToClipboard}
              onSaveMemory={handleSaveMemory}
            />
          ) : (
            <div className="panel-card" style={{ textAlign: "center", padding: "20px" }}>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                No conversation analyzed yet. Click "Transfer" on the main tab.
              </p>
            </div>
          )
        )}

        {activeTab === "memories" && (
          <MemoryList
            memories={savedMemories}
            onCopyMemory={(m) => {
              copyToClipboard(m.formattedMarkdown);
              showToast(`Copied memory "${m.name}" markdown`);
            }}
            onDeleteMemory={handleDeleteMemory}
          />
        )}

        {activeTab === "export" && (
          <ExportImportModal
            contextPackage={contextPackage || undefined}
            rawConversation={rawConversation}
            onImportAICP={(data) => {
              if (data.conversation && data.context) {
                const conv: Conversation = {
                  id: generateUniqueId("imp"),
                  provider: data.source?.provider || "unknown",
                  title: data.source?.title || "Imported Conversation",
                  messages: data.conversation.messages || []
                };
                setRawConversation(conv);
                setMessageCount(conv.messages.length);
                const proc = compressor.process(conv, { mode: "smart", persona, customPersonaPrompt });
                setContextPackage(proc);
                setActiveTab("preview");
                showToast("Successfully imported AICP package");
              }
            }}
          />
        )}
      </div>

      <div className="app-footer">
        Having Issues? <a href="mailto:aniketpatel4p@gmail.com?subject=ContextBridge%20Bug%20Report" target="_blank" rel="noreferrer">Report Bug</a> | Made with ♥ by <a href="https://github.com/anikettP" target="_blank" rel="noreferrer">@anikettP</a>
      </div>
    </div>
  );
};
