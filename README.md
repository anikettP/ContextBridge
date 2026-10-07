# 🌉 ContextBridge — Universal AI Conversation Context Sync

[![Manifest V3](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-2563eb.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Tests](https://img.shields.io/badge/Vitest-28%2F28%20Passed-10b981.svg)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

> **ContextBridge** is a privacy-first, developer-centric Chrome Extension that seamlessly bridges your project context, goals, architectural decisions, and code specifications across **ChatGPT**, **Claude**, **Google Gemini**, **Grok**, **Perplexity**, **Microsoft Copilot**, and **DeepSeek**.
---

## 🌟 Key Features

- **⚡ 7 AI Platforms Supported**: Native adapter extraction and input composer auto-injection for ChatGPT, Claude, Gemini, Grok, Perplexity, Copilot, and DeepSeek.
- **📜 Universal AI Context Protocol (AICP v1.0)**: Formats raw conversation turns into a structured continuation prompt preserving goals, tech stack frameworks, key architectural decisions, open action items, and recent turns with **60–80% token size reduction**.
- **🛡️ 100% Local Privacy Shield**: Automated secret detection and redaction engine. Instantly sanitizes OpenAI/Anthropic/Google/GitHub API keys, AWS credentials, database connection strings, SSH private keys, and JWTs before context transfer. Zero server logging.
- **🎭 Target Role Directives**: Direct receiving AIs to adopt specialized roles upon receiving context:
  - 👨‍💻 **Senior Software Architect**
  - 🐛 **Bug Hunter & Security Auditor**
  - ⚡ **Performance Specialist**
  - 📝 **Technical Writer**
  - 🎯 **Rapid Prototyper**
  - ✏️ **Custom Role Directive**
- **💻 Code Specs & Architecture Aggregator**: Extract all code blocks written across 50+ conversation turns into a clean, downloadable architecture spec file (`architecture_specs.md`).
- **🔄 25-Second SPA Composer Polling & MutationObserver**: Handles Single-Page Application (SPA) load delays automatically when opening new target AI tabs.

---

## 🛡️ Privacy Policy, Security & API Data Safety

ContextBridge was built from the ground up to address developer privacy and API key security concerns.

### 🔒 1. 100% Local Browser Execution
- **Zero External Telemetry**: ContextBridge contains no analytics, no external tracking scripts, and no remote server logging.
- **No Remote Backend**: All conversation extraction, text compression, and secret redaction processes occur **100% locally** inside your web browser's memory.

### 🔑 2. Automated Secret & API Key Redaction (`PrivacyShield`)
Before any context prompt is generated or transferred to a target AI platform, ContextBridge passes the text through **PrivacyShield**. PrivacyShield automatically scans and redacts sensitive credentials:

| Secret Category | Detected Patterns | Redaction Replacement |
| :--- | :--- | :--- |
| **OpenAI API Keys** | `sk-proj-...`, `sk-svcacct-...` | `[REDACTED_OPENAI_KEY]` |
| **Anthropic API Keys** | `sk-ant-api...` | `[REDACTED_ANTHROPIC_KEY]` |
| **Google API Keys** | `AIzaSy...` | `[REDACTED_GOOGLE_API_KEY]` |
| **GitHub Tokens** | `ghp_...`, `github_pat_...` | `[REDACTED_GITHUB_TOKEN]` |
| **AWS Access Keys** | `AKIA...`, `ASIA...` | `[REDACTED_AWS_ACCESS_KEY]` |
| **SSH / RSA Keys** | `-----BEGIN PRIVATE KEY-----` | `[REDACTED_PRIVATE_KEY]` |
| **Database URLs** | `postgres://`, `mongodb://`, `mysql://` | Passwords stripped automatically |
| **JWTs & Secrets** | `password = "..."`, JWT bearer tokens | `[REDACTED_SECRET]` |

### 🔒 3. Minimal Permissions & No Overreach
ContextBridge follows Google's **Least Privilege Principle**:
- **Restricted Host Permissions**: Access is strictly limited to the 7 supported AI domains (`chatgpt.com`, `claude.ai`, `gemini.google.com`, `grok.com`, `perplexity.ai`, `copilot.microsoft.com`, `chat.deepseek.com`). ContextBridge does **NOT** request `<all_urls>` permission.
- **No Sensitive Access**: ContextBridge does **NOT** request access to browser history, cookies, credentials, or web requests.

For full details, read our complete [PRIVACY.md Privacy Policy](PRIVACY.md).

---

## 🏗️ Architectural Layer Breakdown

ContextBridge is built with a pluggable, modular multi-tier architecture:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              CONTEXTBRIDGE ARCHITECTURE                                │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
┌─────────────────────────┐   ┌─────────────────────────┐   ┌─────────────────────────┐
│   1. PROVIDER ADAPTER   │   │    2. CONTEXT ENGINE    │   │     3. UI & STORAGE     │
│         LAYER           │   │          LAYER          │   │          LAYER          │
├─────────────────────────┤   ├─────────────────────────┤   ├─────────────────────────┤
│ • ChatGPT Provider      │   │ • ContextAnalyzer       │   │ • React 19 Popup UI     │
│ • Claude Provider       │   │ • ContextCompressor     │   │ • Strategy Selector     │
│ • Gemini Provider       │   │ • ContextFormatter      │   │ • Target Persona Bar    │
│ • Grok / xAI Provider   │   │ • PrivacyShield Engine  │   │ • Chrome Storage Service│
│ • DeepSeek Provider     │   │ • CodeAggregator        │   │ • Service Worker (MV3)  │
│ • Perplexity Provider   │   │ • AICP v1.0 Generator   │   │ • Content Script Injector│
│ • Copilot Provider      │   │                         │   │   (25s Loop + Observer) │
└─────────────────────────┘   └─────────────────────────┘   └─────────────────────────┘
```

---

## 📊 Data Flow Diagram (DFD)

### Level 0 — Context Transfer Overview
```
┌───────────────┐        Active Chat HTML        ┌──────────────────┐
│  Source AI    ├───────────────────────────────►│  ContentScript   │
│  (e.g ChatGPT)│                                │   (Extractor)    │
└───────────────┘                                └────────┬─────────┘
                                                          │ Extracted Turns
                                                          ▼
                                                 ┌──────────────────┐
                                                 │  ContextEngine   │
                                                 │ (PrivacyShield & │
                                                 │  AICP Formatter) │
                                                 └────────┬─────────┘
                                                          │ Structured AICP Prompt
                                                          ▼
┌───────────────┐       Auto-Inject Composer     ┌──────────────────┐
│   Target AI   │◄───────────────────────────────┤   Chrome Storage │
│ (e.g. Claude) │                                │  (cb_active_ctx) │
└───────────────┘                                └──────────────────┘
```

### Level 1 — Detailed Processing Pipeline

```
  [User Clicks "Transfer"]
             │
             ▼
  ┌──────────────────────┐
  │  DOM Turn Extraction │  ──► Extracts user & assistant message turns
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │   Context Analyzer   │  ──► Parses goals, tech stack, decisions & code blocks
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │ Target Persona Inject│  ──► Attaches Target Role Directive (e.g. Senior Architect)
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │ PrivacyShield Redact │  ──► Replaces API keys, secrets & JWTs with safe tags
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │ Chrome Storage Write │  ──► Stores AICP prompt in chrome.storage.local
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │ Tab Create & Poll    │  ──► Opens Target AI tab; 25s loop waits for DOM composer
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │ Auto-Inject Composer │  ──► Injects prompt via native property setters & execCommand
  └──────────────────────┘
```

---

## 🛠️ Technology Stack

- **Core**: HTML5, TypeScript 5.7, CSS3 (Vanilla design tokens)
- **UI Framework**: React 19, Lucide React Icons
- **Build System**: Vite 6, esbuild, TypeScript Compiler (`tsc`)
- **Testing**: Vitest 3, JSDOM
- **Extension Standard**: Manifest V3 (Chrome, Edge, Brave, Opera)

---

## 💻 Local Installation & Setup

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/anikettP/ContextBridge.git
   cd ContextBridge
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run unit tests**:
   ```bash
   npm test
   ```

4. **Build production bundle**:
   ```bash
   npm run build
   ```

5. **Load Extension in Chrome**:
   - Open `chrome://extensions` in Google Chrome or Microsoft Edge.
   - Enable **Developer mode** (toggle in upper-right corner).
   - Click **Load unpacked** and select the `dist/` directory generated in step 4.

---

## 🧪 Unit Testing

ContextBridge features an extensive test suite powered by **Vitest**:

```bash
npm test
```

### Test Coverage:
- `tests/privacy-shield.test.ts`: OpenAI, Anthropic, GitHub, AWS, DB credentials, RSA keys redactions.
- `tests/code-aggregator.test.ts`: Turn-by-turn code block extraction & language categorization.
- `tests/context-engine.test.ts`: Analyzer, compressor, and AICP formatter verification.
- `tests/providers.test.ts`: Provider adapters and DOM extraction pipelines.
- `tests/storage.test.ts`: Chrome storage persistence wrappers.

---

## 📄 License & Credits

- **Author**: Aniket Patel ([@anikettP](https://github.com/anikettP))
- **Bug Reports & Feedback**: `aniketpatel4p@gmail.com`
- **Privacy Policy**: [PRIVACY.md](PRIVACY.md)
- **License**: MIT License
