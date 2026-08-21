/**
 * PrivacyShield Module — Automatically detects and redacts sensitive API keys,
 * secret tokens, private keys, database passwords, and credentials before context transfer.
 */
export class PrivacyShield {
  private static readonly PATTERNS: Array<{ name: string; regex: RegExp; replacement: string }> = [
    // Anthropic API Keys
    {
      name: "Anthropic API Key",
      regex: /sk-ant-api[a-zA-Z0-9\-_]{20,}/g,
      replacement: "[REDACTED_ANTHROPIC_KEY]"
    },
    // OpenAI API Keys
    {
      name: "OpenAI API Key",
      regex: /sk-(proj-|svcacct-)?(?!ant-)[a-zA-Z0-9T3BlbkFJ\-_]{20,}/g,
      replacement: "[REDACTED_OPENAI_KEY]"
    },
    // Google Cloud / Gemini API Keys
    {
      name: "Google API Key",
      regex: /AIzaSy[a-zA-Z0-9\-_]{33}/g,
      replacement: "[REDACTED_GOOGLE_API_KEY]"
    },
    // GitHub Personal Access Tokens
    {
      name: "GitHub Token",
      regex: /(ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{82}/g,
      replacement: "[REDACTED_GITHUB_TOKEN]"
    },
    // AWS Access Key ID
    {
      name: "AWS Access Key",
      regex: /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g,
      replacement: "[REDACTED_AWS_ACCESS_KEY]"
    },
    // Private RSA / SSH Keys
    {
      name: "Private Key",
      regex: /-----BEGIN\s+(RSA|OPENSSH|EC|DSA|PRIVATE)?\s*KEY-----[\s\S]*?-----END\s+(RSA|OPENSSH|EC|DSA|PRIVATE)?\s*KEY-----/gi,
      replacement: "[REDACTED_PRIVATE_KEY]"
    },
    // Connection Strings (PostgreSQL, MySQL, MongoDB, Redis)
    {
      name: "Database Connection String",
      regex: /(postgres|postgresql|mysql|mongodb|mongodb\+srv|redis):\/\/[a-zA-Z0-9_\-]+:[^@\s]+@[a-zA-Z0-9._\-]+:\d+\/[a-zA-Z0-9_\-]+/gi,
      replacement: "$1://[REDACTED_USER]:[REDACTED_PASSWORD]@$4"
    },
    // Common Secret Assignments (e.g. password = "...", SECRET_KEY = "...")
    {
      name: "Secret Assignment",
      regex: /(password|passwd|secret|api_key|access_token|auth_token)\s*[:=]\s*["']([^"'\s]{6,})["']/gi,
      replacement: '$1: "[REDACTED_SECRET]"'
    },
    // JWT Tokens
    {
      name: "JWT Token",
      regex: /eyJ[a-zA-Z0-9\-_]+\.eyJ[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+/g,
      replacement: "[REDACTED_JWT_TOKEN]"
    }
  ];

  /**
   * Sanitizes text string by replacing detected sensitive keys and secrets.
   */
  public static sanitize(text: string): { sanitizedText: string; redactedCount: number } {
    if (!text) return { sanitizedText: text, redactedCount: 0 };

    let result = text;
    let totalRedacted = 0;

    for (const pattern of this.PATTERNS) {
      const matches = result.match(pattern.regex);
      if (matches) {
        totalRedacted += matches.length;
        result = result.replace(pattern.regex, pattern.replacement);
      }
    }

    return { sanitizedText: result, redactedCount: totalRedacted };
  }
}
