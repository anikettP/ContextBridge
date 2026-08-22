import React from "react";
import { SUPPORTED_PROVIDERS } from "../../shared/constants";
import { ProviderId } from "../../shared/types";
import { ProviderLogo } from "./ProviderLogos";
import { CheckCircle2, AlertTriangle } from "lucide-react";

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
          <span className="pulse-dot" /> Connected Active AI
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
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: provider.accentColor, display: "flex", alignItems: "center" }}>
            <ProviderLogo providerId={providerId} size={20} />
          </span>
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
            color: "#d97706",
            background: "#fffbebf5",
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
