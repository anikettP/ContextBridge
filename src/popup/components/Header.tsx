import React from "react";
import { ArrowLeftRight, Moon, Settings, ShieldCheck, Sun } from "lucide-react";

interface HeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenOptions: () => void;
  onOpenPrivacyModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenOptions,
  onOpenPrivacyModal
}) => {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-logo">
          <ArrowLeftRight size={18} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <h1 className="brand-title">ContextBridge</h1>
            <span className="version-tag">v2.0</span>
          </div>
          <span className="brand-sub">Universal AI Context & Privacy Sync</span>
        </div>
      </div>

      <div className="header-tools">
        {onOpenPrivacyModal && (
          <button
            className="icon-button privacy-btn"
            onClick={onOpenPrivacyModal}
            title="Google Web Store Privacy & Data Safety Shield"
          >
            <ShieldCheck size={15} color="var(--success)" />
          </button>
        )}

        <button
          className="icon-button"
          onClick={onToggleTheme}
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} Theme`}
        >
          {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
        </button>

        <button className="icon-button" onClick={onOpenOptions} title="Extension Settings">
          <Settings size={15} />
        </button>
      </div>
    </header>
  );
};
