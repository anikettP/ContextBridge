import React from "react";
import { SUPPORTED_PROVIDERS } from "../../shared/constants";
import { ProviderId } from "../../shared/types";
import { CheckCircle2, AlertTriangle, Radio } from "lucide-react";

interface ProviderBadgeProps {
  providerId: ProviderId;
  detectedMessageCount?: number;
  isPartial?: boolean;
}

export const ProviderBadge: React.FC<ProviderBadgeProps> = ({
  providerId,
  detectedMessageCount = 0,
  isPartial = false
}) => {
  const provider = SUPPORTED_PROVIDERS[providerId] || SUPPORTED_PROVIDERS.unknown;

  return (
    <div className="panel-card" style={{ borderLeft: `4px solid ${provider.accentColor}` }}>
      <div className="panel-header">
        <span className="panel-title" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--success)" }}>
          <Radio size={14} color="var(--success)" className="spin" style={{ animationDuration: "3s" }} /> Auto-Detected Active AI
        </span>
        <span
          style={{
            fontSize: "11px",
            fontWeight: "700",
            color: "var(--success)",
            background: "var(--success-light)",
            padding: "2px 10px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          <CheckCircle2 size={12} /> {detectedMessageCount} Turns
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "2px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-main)" }}>
          {provider.name}
        </h2>
        <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "500" }}>
          {provider.hostnamePatterns[0] || "Active Web Page"}
        </span>
      </div>

      {isPartial && (
        <div
          style={{
            fontSize: "11px",
            color: "var(--warning)",
            background: "var(--warning-light)",
            padding: "6px 10px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "4px"
          }}
        >
          <AlertTriangle size={13} /> Scroll up in your chat tab to capture complete history.
        </div>
      )}
    </div>
  );
};
