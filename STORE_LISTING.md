# Chrome Web Store Listing - Policy-Compliant Metadata (v2.0.0)

This file contains the policy-compliant Chrome Web Store metadata for **ContextBridge - Universal AI Context Sync** to resolve **Violation Reference ID: Yellow Argon (Keyword Spam)**.

---

## Item Summary / Short Description (Max 132 characters)
`Seamlessly transfer conversation goals, architecture decisions, and code across AI assistants with privacy and token optimization.`

---

## Detailed Store Description (Copy & Paste to Developer Dashboard)

ContextBridge is a privacy-first Chrome Extension built for developers and power users who work across multiple AI platforms. Continuously bridge your conversation goals, architectural decisions, technical specifications, and active code blocks between different AI workspace environments—without repeating yourself or wasting context window tokens.

### KEY FEATURES

- Universal Context Transfer: Effortlessly carry forward project state, technical requirements, and active code blocks between AI workspace tabs in a single click.
- 100% Local Privacy Shield: Automatic client-side secret detection and redaction engine. Instantly sanitizes API keys (OpenAI, Anthropic, Google, GitHub), AWS credentials, database connection strings, SSH private keys, and JWTs before context transfer. Zero telemetry or external server calls.
- Smart Token Optimization: Standardized Universal AI Context Protocol (AICP v1.0) condenses chat history into high-density continuation prompts, saving 60%–80% of token window capacity.
- Customized Role Directives: Instruct receiving AI models to adopt specialized developer personas such as Senior System Architect, Security Auditor, Refactoring Specialist, or Technical Writer upon receiving context.
- Code & Specs Aggregator: Consolidate code snippets across long conversation threads into clean, organized markdown architecture documentation (`architecture_specs.md`).
- IDE & PKM Exporters: Generate `.cursorrules` files for Cursor IDE and export tagged notes for Obsidian Vaults (`.md`).
- Saved Project Memory Vault: Store key context snapshots locally in browser storage to reload anytime across fresh sessions.

### PRIVACY & SECURITY FIRST

ContextBridge operates entirely inside your local browser sandbox:
- Zero External Servers: All text analysis, secret redaction, and prompt formatting happen 100% locally inside your web browser.
- Minimal Permissions: Requests host permission strictly for supported AI interface domains.
- No Tracking: No analytics, telemetry, or user data collection of any kind.

### HOW TO USE

1. Open your active web AI interface and click the ContextBridge extension icon in your toolbar or SidePanel.
2. Select your target destination and desired role directive (for example, Senior Software Architect).
3. Click "Transfer Context" to automatically format and open your target workspace with your project state preserved.

Organize your multi-AI workflow efficiently and securely with ContextBridge.

---

## RECTIFICATION & RESUBMISSION CHECKLIST

1. **Manifest File**:
   - `src/manifest.json` `description` field updated to clean text without brand lists.

2. **Chrome Web Store Developer Dashboard**:
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
   - Select **ContextBridge - Universal AI Context Sync** (ID: `ajolgpgimgfhondgbhdkpdmojhdfpoip`).
   - Go to **Store Listing** > **Listing Details**.
   - Paste the **Short Description** and **Detailed Description** above.
   - Click **Save Draft** and upload the newly built extension zip file (`dist/` folder zipped or production zip).
   - Submit for Review.
