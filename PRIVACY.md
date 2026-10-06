# ContextBridge - Privacy Policy (v2.0.0)

**Effective Date**: October 2026  
**Developer**: Aniket Patel ([@anikettP](https://github.com/anikettP))  
**Contact**: `aniketpatel4p@gmail.com`  
**Extension Name**: ContextBridge - Universal AI Context Sync  

---

## 1. Our Privacy Commitment

**ContextBridge** was built with a privacy-first architecture. **We do not collect, store, track, transmit, or sell your personal data, chat conversations, or API credentials.**

All conversation extraction, context structuring, and secret redaction processes take place **100% locally inside your web browser**.

```mermaid
flowchart TD
    subgraph LocalBrowser ["Local Browser Environment"]
        Tab["Active AI Tab"] -->|Extract Turns| Engine["Context Engine"]
        Engine -->|Scan Text| Shield["Privacy Shield Engine"]
        Shield -->|Redact API Keys / Secrets| Storage["chrome.storage.local"]
        Storage -->|Inject Formatted Context| Target["Target AI Tab"]
    end
    
    subgraph ExternalNetwork ["External Network"]
        Analytics["Tracking / Telemetry Server"]
        RemoteDB["Remote Database"]
    end

    Shield -.->|NO CONNECTION| Analytics
    Shield -.->|NO CONNECTION| RemoteDB
```

---

## 2. Information Handled & How It Is Used

ContextBridge operates entirely on your local device. The extension handles data strictly for the single purpose of transferring your conversation context between AI platforms that you explicitly select.

| Data Type | Processed Locally? | Sent to Remote Servers? | Retention / Storage |
| :--- | :---: | :---: | :--- |
| **Conversation Turns & Text** | Yes | No | Temporary local memory; cleared upon transfer. |
| **User Settings & Target Role Directives** | Yes | No | Saved in browser `chrome.storage.local`. |
| **API Keys, Secrets & Credentials** | Yes (Redacted) | No | Redacted by Privacy Shield before formatting. |
| **Telemetry & Analytics** | No | No | We do not use any analytics or tracking scripts. |

---

## 3. Privacy Shield & Secret Redaction

ContextBridge includes an automated **Privacy Shield** engine that runs on your local machine before formatting context prompts. Privacy Shield automatically detects and redacts sensitive patterns.

```mermaid
flowchart LR
    RawInput["Raw Conversation Text"] --> Matcher["Privacy Shield Scanner"]
    Matcher --> CheckSecrets{"Contains Secrets or API Keys?"}
    CheckSecrets -- Yes --> Redact["Sanitize & Replace with [REDACTED_*]"]
    CheckSecrets -- No --> Pass["Keep Text Intact"]
    Redact --> CleanOutput["Sanitized AICP Prompt"]
    Pass --> CleanOutput
```

### Sanitized Data Categories:
- **API Keys & Tokens**: OpenAI (`sk-...`), Anthropic (`sk-ant-api...`), Google Cloud (`AIzaSy...`), GitHub (`ghp_...`), AWS Access Keys (`AKIA...`).
- **Private Key Files**: RSA, SSH, and PEM private keys (`-----BEGIN PRIVATE KEY-----`).
- **Database Connection Strings**: Passwords inside `postgres://`, `mongodb://`, `mysql://`, and `redis://` connection URLs.
- **Passwords & JWTs**: `password = "..."` assignments and JWT authorization tokens.

Redacted secrets are replaced with safe, local tags (for example `[REDACTED_OPENAI_KEY]`) to prevent accidental leaks.

---

## 4. Permissions & Host Permissions Justification

ContextBridge requests only the minimum set of permissions required to perform its functions:

- **`storage`**: Allows saving your local settings (for example, preferred target AI, default strategy, saved project memories) on your device.
- **`activeTab` & `scripting`**: Allows extracting message turns from your active AI tab when you trigger a transfer.
- **`clipboardWrite`**: Provides a manual copy fallback for formatted context prompts.
- **`tabs`**: Opens new tabs for your selected destination AI platform (`claude.ai`, `gemini.google.com`, etc.).
- **`sidePanel`**: Renders the extension interface inside Chrome's native SidePanel sidebar for developer workflows.
- **Host Permissions**: Restricted exclusively to the supported AI domains (`chatgpt.com`, `claude.ai`, `gemini.google.com`, `grok.com`, `perplexity.ai`, `copilot.microsoft.com`, `chat.deepseek.com`). We do **not** request `<all_urls>` permission.

---

## 5. Third-Party Webpages

When you use ContextBridge to open a target AI platform (for example, opening Claude from ChatGPT), you interact directly with that target AI platform's webpage under their respective Terms of Service and Privacy Policies. ContextBridge does not send your data to any intermediary server.

---

## 6. Contact & Support

If you have any questions or feedback regarding this Privacy Policy or ContextBridge:

- **Developer**: Aniket Patel
- **GitHub**: [https://github.com/anikettP/ContextBridge](https://github.com/anikettP/ContextBridge)
- **Support Email**: `aniketpatel4p@gmail.com`
