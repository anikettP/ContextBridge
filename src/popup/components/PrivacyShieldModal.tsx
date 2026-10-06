import React from "react";
import { CheckCircle2, Lock, Shield, ShieldCheck, X } from "lucide-react";

interface PrivacyShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  redactedCount: number;
}

export const PrivacyShieldModal: React.FC<PrivacyShieldModalProps> = ({
  isOpen,
  onClose,
  redactedCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content privacy-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ borderBottom: "1px solid var(--border-main)", paddingBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "rgba(16, 185, 129, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--success)"
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
                Google Privacy Policy & Security Shield
              </h3>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Manifest V3 & Chrome Web Store Compliant
              </span>
            </div>
          </div>
          <button className="icon-button" onClick={onClose} style={{ width: "26px", height: "26px" }}>
            <X size={14} />
          </button>
        </div>

        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
          <div
            style={{
              background: "var(--success-light)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "10px",
              padding: "10px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Lock size={16} color="var(--success)" />
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-main)" }}>
                  100% Local Browser Memory Execution
                </div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                  Zero external servers, zero telemetry analytics, zero remote API endpoints.
                </div>
              </div>
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--success)" }}>Active</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <h4 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>
              Data Safety Guarantees
            </h4>

            <div className="privacy-feature-item">
              <CheckCircle2 size={14} color="var(--success)" />
              <span>
                <strong>Least Privilege Permissions:</strong> Scoped exclusively to explicit AI provider URLs.
              </span>
            </div>

            <div className="privacy-feature-item">
              <CheckCircle2 size={14} color="var(--success)" />
              <span>
                <strong>Automated Credential Redaction:</strong> Real-time regex sanitization of OpenAI, Anthropic, Google, AWS, GitHub, DB keys, and JWTs.
              </span>
            </div>

            <div className="privacy-feature-item">
              <CheckCircle2 size={14} color="var(--success)" />
              <span>
                <strong>No Remote Code Execution:</strong> 100% bundled locally in compliance with Chrome MV3 Web Store rules.
              </span>
            </div>
          </div>

          {redactedCount > 0 && (
            <div
              style={{
                background: "var(--bg-subtle)",
                border: "1px solid var(--border-main)",
                borderRadius: "8px",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "11px"
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>Credentials Sanitized in Session:</span>
              <span style={{ fontWeight: 700, color: "var(--primary)" }}>{redactedCount} Secrets Redacted</span>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ marginTop: "16px", paddingTop: "10px", borderTop: "1px solid var(--border-main)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a
            href="https://github.com/anikettP/ContextBridge/blob/main/PRIVACY.md"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: "11px", color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}
          >
            Read Full PRIVACY.md Document
          </a>
          <button className="btn-secondary" onClick={onClose} style={{ padding: "6px 12px", fontSize: "11px" }}>
            Close Shield Details
          </button>
        </div>
      </div>
    </div>
  );
};
