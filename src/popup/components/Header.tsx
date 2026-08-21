import React from "react";
import { ArrowLeftRight, Moon, Settings, Sun } from "lucide-react";

interface HeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenOptions: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onOpenOptions }) => {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-logo">
          <ArrowLeftRight size={18} />
        </div>
        <div>
          <h1 className="brand-title">ContextBridge</h1>
          <span className="brand-sub">AI Conversation Sync</span>
        </div>
      </div>

      <div className="header-tools">
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
