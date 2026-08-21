import { describe, expect, it } from "vitest";
import { PrivacyShield } from "../src/context-engine/privacy-shield";

describe("PrivacyShield Test Suite", () => {
  it("should redact OpenAI API keys", () => {
    const raw = "Here is my key sk-proj-1234567890abcdef1234567890abcdef for testing.";
    const { sanitizedText, redactedCount } = PrivacyShield.sanitize(raw);
    expect(redactedCount).toBe(1);
    expect(sanitizedText).toContain("[REDACTED_OPENAI_KEY]");
    expect(sanitizedText).not.toContain("sk-proj-1234567890abcdef");
  });

  it("should redact Anthropic API keys", () => {
    const raw = "Use anthropic key sk-ant-api03-abcdef1234567890abcdef1234567890";
    const { sanitizedText, redactedCount } = PrivacyShield.sanitize(raw);
    expect(redactedCount).toBe(1);
    expect(sanitizedText).toContain("[REDACTED_ANTHROPIC_KEY]");
  });

  it("should redact GitHub Personal Access Tokens", () => {
    const raw = "My token ghp_1234567890abcdef1234567890abcdef1234";
    const { sanitizedText, redactedCount } = PrivacyShield.sanitize(raw);
    expect(redactedCount).toBe(1);
    expect(sanitizedText).toContain("[REDACTED_GITHUB_TOKEN]");
  });

  it("should redact Private RSA Keys", () => {
    const raw = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC
-----END PRIVATE KEY-----`;
    const { sanitizedText, redactedCount } = PrivacyShield.sanitize(raw);
    expect(redactedCount).toBe(1);
    expect(sanitizedText).toContain("[REDACTED_PRIVATE_KEY]");
  });

  it("should redact Secret Assignments", () => {
    const raw = 'const password = "mySecretPassword123";';
    const { sanitizedText, redactedCount } = PrivacyShield.sanitize(raw);
    expect(redactedCount).toBe(1);
    expect(sanitizedText).toContain('[REDACTED_SECRET]');
  });
});
