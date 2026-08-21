import React, { useState } from "react";
import { Check, Copy, Save } from "lucide-react";
import { ContextPackage } from "../../shared/types";

interface PreviewEditorProps {
  contextPackage: ContextPackage;
  onCopy: (text: string) => void;
  onSaveMemory: (name: string) => void;
}

export const PreviewEditor: React.FC<PreviewEditorProps> = ({
  contextPackage,
  onCopy,
  onSaveMemory
}) => {
  const [markdown, setMarkdown] = useState(contextPackage.formattedMarkdown);
  const [copied, setCopied] = useState(false);
  const [memoryName, setMemoryName] = useState(contextPackage.title);
  const [saving, setSaving] = useState(false);

  const handleCopy = () => {
    onCopy(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!memoryName) return;
    setSaving(true);
    onSaveMemory(memoryName);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div className="panel-card">
        <div className="panel-header">
          <div>
            <span className="panel-title">Context Preview & Editor</span>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
              ~{contextPackage.estimatedTokens.toLocaleString()} tokens • {contextPackage.informationRetentionPercentage}% context preserved
            </div>
          </div>
          <button className="secondary-btn" onClick={handleCopy}>
            {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy Context"}
          </button>
        </div>

        <textarea
          className="markdown-editor"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        />
      </div>

      <div className="panel-card">
        <span className="panel-title">Save Project Memory</span>
        <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
          <input
            type="text"
            className="form-input"
            placeholder="Project Memory Title (e.g. ProjectSphere)"
            value={memoryName}
            onChange={(e) => setMemoryName(e.target.value)}
          />
          <button className="secondary-btn" onClick={handleSave} style={{ whiteSpace: "nowrap" }}>
            <Save size={14} />
            {saving ? "Saved!" : "Save Memory"}
          </button>
        </div>
      </div>
    </div>
  );
};
