# ContextBridge - Universal AI Conversation Context Sync

[![Manifest V3](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-2563eb.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Tests](https://img.shields.io/badge/Vitest-28%2F28%20Passed-10b981.svg)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

> **ContextBridge** is a privacy-first, developer-centric Chrome Extension that seamlessly bridges your project context, goals, architectural decisions, and code specifications across **ChatGPT**, **Claude**, **Google Gemini**, **Grok**, **Perplexity**, **Microsoft Copilot**, and **DeepSeek**.

---

## Key Features

- **7 AI Platforms Supported**: Native adapter extraction and input composer auto-injection for ChatGPT, Claude, Gemini, Grok, Perplexity, Copilot, and DeepSeek.
- **Universal AI Context Protocol (AICP v1.0)**: Formats raw conversation turns into a structured continuation prompt preserving goals, tech stack frameworks, key architectural decisions, open action items, and recent turns with **60-80% token size reduction**.
- **100% Local Privacy Shield**: Automated secret detection and redaction engine. Instantly sanitizes OpenAI/Anthropic/Google/GitHub API keys, AWS credentials, database connection strings, SSH private keys, and JWTs before context transfer. Zero server logging.
- **Target Role Directives**: Direct receiving AIs to adopt specialized roles upon receiving context:
  - Senior Software Architect
  - Bug Hunter & Security Auditor
  - Performance Specialist
  - Technical Writer
  - Rapid Prototyper
  - Custom Role Directive
- **Code Specs & Architecture Aggregator**: Extract all code blocks written across 50+ conversation turns into a clean, downloadable architecture spec file (`architecture_specs.md`).
- **25-Second SPA Composer Polling & MutationObserver**: Handles Single-Page Application (SPA) load delays automatically when opening new target AI tabs.

---

## Privacy Policy, Security & API Data Safety

ContextBridge was built from the ground up to address developer privacy and API key security concerns.

### 1. 100% Local Browser Execution
- **Zero External Telemetry**: ContextBridge contains no analytics, no external tracking scripts, and no remote server logging.
- **No Remote Backend**: All conversation extraction, text compression, and secret redaction processes occur **100% locally** inside your web browser's memory.

### 2. Automated Secret & API Key Redaction (PrivacyShield)
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

### 3. Minimal Permissions & No Overreach
ContextBridge follows Google's **Least Privilege Principle**:
- **Restricted Host Permissions**: Access is strictly limited to the supported AI domains (`chatgpt.com`, `claude.ai`, `gemini.google.com`, `grok.com`, `perplexity.ai`, `copilot.microsoft.com`, `chat.deepseek.com`). ContextBridge does **NOT** request `<all_urls>` permission.
- **No Sensitive Access**: ContextBridge does **NOT** request access to browser history, cookies, credentials, or web requests.

For full details, read our complete [PRIVACY.md Privacy Policy](PRIVACY.md).

---

## Architectural Layer Breakdown

ContextBridge is built with a pluggable, modular multi-tier architecture:

```mermaid
graph TD
    subgraph Architecture ["ContextBridge Architecture"]
        subgraph Layer1 ["1. Provider Adapter Layer"]
            L1_1["ChatGPT Provider"]
            L1_2["Claude Provider"]
            L1_3["Gemini Provider"]
            L1_4["Grok / xAI Provider"]
            L1_5["DeepSeek Provider"]
            L1_6["Perplexity Provider"]
            L1_7["Copilot Provider"]
        end

        subgraph Layer2 ["2. Context Engine Layer"]
            L2_1["ContextAnalyzer"]
            L2_2["ContextCompressor"]
            L2_3["ContextFormatter"]
            L2_4["PrivacyShield Engine"]
            L2_5["CodeAggregator"]
            L2_6["AICP v1.0 Generator"]
        end

        subgraph Layer3 ["3. UI & Storage Layer"]
            L3_1["React 19 Popup UI"]
            L3_2["Strategy Selector"]
            L3_3["Target Persona Bar"]
            L3_4["Chrome Storage Service"]
            L3_5["Service Worker (MV3)"]
            L3_6["Content Script Injector"]
        end
    end

    Layer1 --> Layer2
    Layer2 --> Layer3
```

---

## Data Flow Diagram (DFD)

### Level 0 - Context Transfer Overview
```mermaid
flowchart LR
    Source["Source AI Tab"] -->|Active Chat HTML| Extractor["ContentScript Extractor"]
    Extractor -->|Extracted Turns| Engine["ContextEngine (PrivacyShield & AICP Formatter)"]
    Engine -->|Structured AICP Prompt| Storage["Chrome Storage (cb_active_ctx)"]
    Storage -->|Auto-Inject Composer| Target["Target AI Tab"]
```

### Level 1 - Detailed Processing Pipeline

```mermaid
flowchart TD
    Start["User Clicks Transfer"] --> DOM["DOM Turn Extraction"]
    DOM --> Analyzer["Context Analyzer (Goals, Stack, Decisions)"]
    Analyzer --> Persona["Target Persona Injector (Role Directive)"]
    Persona --> Shield["PrivacyShield Redactor (API Keys & Secrets)"]
    Shield --> Storage["Chrome Storage Write"]
    Storage --> TabPoll["Tab Create & Composer Polling (25s Loop)"]
    TabPoll --> Inject["Auto-Inject Prompt into Target Composer"]
```

---

## Technology Stack

- **Core**: HTML5, TypeScript 5.7, CSS3 (Vanilla design tokens)
- **UI Framework**: React 19, Lucide React Icons
- **Build System**: Vite 6, esbuild, TypeScript Compiler (`tsc`)
- **Testing**: Vitest 3, JSDOM
- **Extension Standard**: Manifest V3 (Chrome, Edge, Brave, Opera)

---

## Local Installation & Setup

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

## Unit Testing

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

## License & Credits

- **Author**: Aniket Patel ([@anikettP](https://github.com/anikettP))
- **Bug Reports & Feedback**: `aniketpatel4p@gmail.com`
- **Privacy Policy**: [PRIVACY.md](PRIVACY.md)
- **License**: MIT License
