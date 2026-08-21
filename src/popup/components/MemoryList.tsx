import React from "react";
import { Copy, Trash2 } from "lucide-react";
import { SavedProjectMemory } from "../../shared/types";
import { formatDate } from "../../shared/utils";

interface MemoryListProps {
  memories: SavedProjectMemory[];
  onCopyMemory: (memory: SavedProjectMemory) => void;
  onDeleteMemory: (id: string) => void;
}

export const MemoryList: React.FC<MemoryListProps> = ({
  memories,
  onCopyMemory,
  onDeleteMemory
}) => {
  if (memories.length === 0) {
    return (
      <div className="panel-card" style={{ textAlign: "center", padding: "24px 14px" }}>
        <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-main)" }}>No saved project memories yet.</p>
        <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Analyze any conversation and save its project memory to restore context in fresh AI chats.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {memories.map((mem) => (
        <div key={mem.id} className="panel-card">
          <div className="panel-header">
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-main)" }}>{mem.name}</h3>
              <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                Saved {formatDate(mem.createdAt)} • ~{mem.estimatedTokens.toLocaleString()} tokens
              </span>
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                className="icon-button"
                title="Copy Memory Prompt"
                onClick={() => onCopyMemory(mem)}
              >
                <Copy size={14} />
              </button>
              <button
                className="icon-button"
                title="Delete Memory"
                onClick={() => onDeleteMemory(mem.id)}
                style={{ color: "var(--danger)" }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {mem.context.goal && (
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
              🎯 {mem.context.goal}
            </p>
          )}

          {mem.context.technologies && mem.context.technologies.length > 0 && (
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "4px" }}>
              {mem.context.technologies.map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    background: "var(--primary-light)",
                    color: "var(--primary)",
                    padding: "2px 8px",
                    borderRadius: "4px"
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
