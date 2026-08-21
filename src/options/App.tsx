import React, { useEffect, useState } from "react";
import { ArrowLeftRight, Key, Keyboard, Save, ShieldCheck } from "lucide-react";
import { DEFAULT_SETTINGS } from "../shared/constants";
import { ContextStrategyMode, ExtensionSettings, ProviderId } from "../shared/types";
import { storageService } from "../storage/storage";
import { providerRegistry } from "../providers/registry/ProviderRegistry";

export const App: React.FC = () => {
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const s = await storageService.getSettings();
      setSettings(s);
    })();
  }, []);

  const handleSave = async () => {
    await storageService.saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const allProviders = providerRegistry.getAll();

  return (
    <div className="options-container">
      <div className="options-header">
        <div style={{ background: "var(--accent-gradient)", padding: "10px", borderRadius: "10px", color: "#fff" }}>
          <ArrowLeftRight size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "700" }}>ContextBridge Settings & Privacy</h1>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Configure default context strategies, keyboard shortcuts, and local privacy preferences.
          </p>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">
          <ShieldCheck size={18} color="#10b981" /> Privacy & Local Processing
        </h2>
        <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "12px 16px", borderRadius: "8px", fontSize: "12px", color: "#e2e8f0" }}>
          <p>✓ All 7 supported AI platforms are processed 100% locally inside your browser.</p>
          <p>✓ No conversation transcripts or project memories are uploaded to external servers by default.</p>
          <p>✓ Saved project memories are stored securely in Chrome local storage.</p>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">
          <Keyboard size={18} color="#3b82f6" /> Keyboard Shortcuts
        </h2>
        <div className="shortcut-row">
          <span style={{ fontSize: "13px" }}>Capture Current AI Conversation</span>
          <kbd>Ctrl + Shift + C</kbd>
        </div>
        <div className="shortcut-row">
          <span style={{ fontSize: "13px" }}>Quick Transfer Context</span>
          <kbd>Ctrl + Shift + T</kbd>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Defaults & Preferences</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Default Context Strategy</label>
          <select
            style={{ padding: "8px", borderRadius: "6px", background: "var(--bg-card)", color: "#fff", border: "1px solid var(--border-color)" }}
            value={settings.defaultStrategy}
            onChange={(e) => setSettings({ ...settings, defaultStrategy: e.target.value as ContextStrategyMode })}
          >
            <option value="smart">Smart Context (Recommended)</option>
            <option value="full">Full Conversation</option>
            <option value="important">Important Context Only</option>
            <option value="last_n">Last N Messages</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Default Target AI Provider</label>
          <select
            style={{ padding: "8px", borderRadius: "6px", background: "var(--bg-card)", color: "#fff", border: "1px solid var(--border-color)" }}
            value={settings.preferredTargetProvider}
            onChange={(e) => setSettings({ ...settings, preferredTargetProvider: e.target.value as ProviderId })}
          >
            {allProviders.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">
          <Key size={18} color="#8b5cf6" /> Optional External LLM API Key
        </h2>
        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          Optional. Provide an API key only if you wish to use external AI models (e.g. OpenAI GPT-4o-mini) for summarization instead of the built-in local engine.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            checked={settings.useExternalLLM}
            onChange={(e) => setSettings({ ...settings, useExternalLLM: e.target.checked })}
          />
          <span style={{ fontSize: "13px" }}>Enable External LLM API Summarization</span>
        </div>

        {settings.useExternalLLM && (
          <input
            type="password"
            placeholder="sk-..."
            style={{ padding: "10px", borderRadius: "6px", background: "var(--bg-card)", color: "#fff", border: "1px solid var(--border-color)" }}
            value={settings.apiKey || ""}
            onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
          />
        )}
      </div>

      <button
        onClick={handleSave}
        style={{
          background: "var(--accent-gradient)",
          border: "none",
          color: "#fff",
          fontWeight: "700",
          fontSize: "14px",
          padding: "12px 24px",
          borderRadius: "8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "12px"
        }}
      >
        <Save size={16} /> {saved ? "Settings Saved!" : "Save Settings"}
      </button>
    </div>
  );
};
