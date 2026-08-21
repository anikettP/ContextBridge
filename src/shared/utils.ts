/**
 /**
  * Utility functions for token estimation, string processing, and formatting.
  */

/**
 * Estimates token count for a given text.
 * Rule of thumb: ~4 characters per token in English / code text.
 */
export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  // Account for words and special characters
  const cleaned = text.trim();
  const wordCount = cleaned.split(/\s+/).length;
  const charCount = cleaned.length;
  // Blended average estimation: 1 word ~ 1.3 tokens, 1 token ~ 4 chars
  const tokenEstByChar = Math.ceil(charCount / 4);
  const tokenEstByWord = Math.ceil(wordCount * 1.3);
  return Math.max(tokenEstByChar, tokenEstByWord);
}

/**
 * Calculates information retention percentage based on extracted metadata and included turns.
 */
export function calculateRetentionPercentage(
  originalCount: number,
  includedCount: number,
  hasMetadata: boolean
): number {
  if (originalCount === 0) return 100;
  if (includedCount >= originalCount) return 100;

  // Base proportion of turns
  const turnRatio = includedCount / originalCount;
  // Metadata preservation gives a strong bonus to retention quality
  const metadataBonus = hasMetadata ? 0.45 : 0;
  const calculated = Math.round((turnRatio * 0.5 + metadataBonus + 0.05) * 100);
  
  return Math.min(99, Math.max(30, calculated));
}

/**
 * Generates a unique string ID.
 */
export function generateUniqueId(prefix = "id"): string {
  const rand = Math.random().toString(36).substring(2, 9);
  const timestamp = Date.now().toString(36);
  return `${prefix}_${timestamp}_${rand}`;
}

/**
 * Formats a Date into a human readable string.
 */
export function formatDate(dateString?: string): string {
  const d = dateString ? new Date(dateString) : new Date();
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

/**
 * Sanitizes markdown string to prevent raw script injections.
 */
export function sanitizeText(text: string): string {
  if (!text) return "";
  return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "[script removed]");
}

/**
 * Truncates text with ellipsis.
 */
export function truncate(text: string, maxLength = 100): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
