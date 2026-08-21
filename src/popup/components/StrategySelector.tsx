import React from "react";
import { STRATEGY_DESCRIPTIONS } from "../../shared/constants";
import { ContextStrategyMode } from "../../shared/types";
import { SlidersHorizontal } from "lucide-react";

interface StrategySelectorProps {
  strategy: ContextStrategyMode;
  onSelectStrategy: (mode: ContextStrategyMode) => void;
  lastNCount: number;
  onChangeLastNCount: (count: number) => void;
}

export const StrategySelector: React.FC<StrategySelectorProps> = ({
  strategy,
  onSelectStrategy,
  lastNCount,
  onChangeLastNCount
}) => {
  return (
    <div className="panel-card">
      <div className="panel-header">
        <span className="panel-title" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <SlidersHorizontal size={12} /> Context Strategy
        </span>
      </div>

      <select
        className="form-select"
        value={strategy}
        onChange={(e) => onSelectStrategy(e.target.value as ContextStrategyMode)}
      >
        <option value="smart">Smart Context (Recommended)</option>
        <option value="full">Full Conversation (Complete Transcript)</option>
        <option value="important">Important Context Only (Project Memory Specs)</option>
        <option value="last_n">Last N Messages</option>
      </select>

      <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px", lineHeight: "1.4" }}>
        {STRATEGY_DESCRIPTIONS[strategy]?.description}
      </p>

      {strategy === "last_n" && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "500" }}>
            Number of recent turns:
          </span>
          <input
            type="number"
            className="form-input"
            style={{ width: "80px" }}
            value={lastNCount}
            min={1}
            max={200}
            onChange={(e) => onChangeLastNCount(parseInt(e.target.value) || 10)}
          />
        </div>
      )}
    </div>
  );
};
