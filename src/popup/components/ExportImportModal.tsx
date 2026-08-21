import React, { useRef } from "react";
import { Code, Download, FileJson, FileText, Upload } from "lucide-react";
import { ContextPackage, Conversation } from "../../shared/types";
import { CodeAggregator } from "../../context-engine/code-aggregator";

interface ExportImportModalProps {
  contextPackage?: ContextPackage;
  rawConversation?: Conversation | null;
  onImportAICP: (importedData: any) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  contextPackage,
  rawConversation,
  onImportAICP
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const codeAggregator = new CodeAggregator();

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (!contextPackage) return;
    const jsonStr = JSON.stringify(contextPackage, null, 2);
    downloadFile(jsonStr, `${contextPackage.title.replace(/\s+/g, "_")}_context.json`, "application/json");
  };

  const handleExportMarkdown = () => {
    if (!contextPackage) return;
    downloadFile(contextPackage.formattedMarkdown, `${contextPackage.title.replace(/\s+/g, "_")}_context.md`, "text/markdown");
  };

  const handleExportText = () => {
    if (!contextPackage) return;
    downloadFile(contextPackage.formattedMarkdown, `${contextPackage.title.replace(/\s+/g, "_")}_context.txt`, "text/plain");
  };

  const handleExportCodeSpecs = () => {
    if (!rawConversation) return;
    const aggResult = codeAggregator.aggregate(rawConversation);
    const filename = `${(rawConversation.title || "architecture").replace(/\s+/g, "_")}_code_specs.md`;
    downloadFile(aggResult.formattedMarkdown, filename, "text/markdown");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onImportAICP(parsed);
      } catch (err) {
        alert("Invalid AICP JSON package file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div className="panel-card">
        <span className="panel-title">Export Context Package (AICP v1.0)</span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "6px" }}>
          <button className="secondary-btn" onClick={handleExportJSON} disabled={!contextPackage}>
            <FileJson size={14} /> JSON
          </button>
          <button className="secondary-btn" onClick={handleExportMarkdown} disabled={!contextPackage}>
            <FileText size={14} /> Markdown
          </button>
          <button className="secondary-btn" onClick={handleExportText} disabled={!contextPackage}>
            <Download size={14} /> Text
          </button>
        </div>
      </div>

      <div className="panel-card">
        <span className="panel-title">Code Specs & Architecture Aggregator</span>
        <button
          className="secondary-btn"
          onClick={handleExportCodeSpecs}
          disabled={!rawConversation}
          style={{ marginTop: "6px", width: "100%", background: "var(--primary-light)", color: "var(--primary)", border: "1px solid var(--primary)" }}
        >
          <Code size={14} /> Download Aggregated Architecture Specs (.md)
        </button>
      </div>

      <div className="panel-card">
        <span className="panel-title">Import Universal AICP Package</span>
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <button
          className="secondary-btn"
          onClick={() => fileInputRef.current?.click()}
          style={{ marginTop: "6px" }}
        >
          <Upload size={14} /> Select AICP .json File to Restore Context
        </button>
      </div>
    </div>
  );
};
