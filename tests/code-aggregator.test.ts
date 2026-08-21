import { describe, expect, it } from "vitest";
import { CodeAggregator } from "../src/context-engine/code-aggregator";
import { Conversation } from "../src/shared/types";

describe("CodeAggregator Test Suite", () => {
  it("should extract code snippets turn-by-turn and group by language", () => {
    const mockConv: Conversation = {
      id: "conv_test",
      provider: "chatgpt",
      title: "SaaS Database & API Architecture",
      messages: [
        {
          id: "m1",
          role: "user",
          content: "Here is our schema:\n```sql\nCREATE TABLE users (id UUID PRIMARY KEY, email TEXT);\n```"
        },
        {
          id: "m2",
          role: "assistant",
          content: "Here is the TypeScript interface:\n```typescript\ninterface User { id: string; email: string; }\n```"
        },
        {
          id: "m3",
          role: "assistant",
          content: "And here is the React component:\n```tsx\nexport const UserBadge = () => <div>User</div>;\n```"
        }
      ]
    };

    const aggregator = new CodeAggregator();
    const result = aggregator.aggregate(mockConv);

    expect(result.totalSnippets).toBe(3);
    expect(result.languages).toContain("sql");
    expect(result.languages).toContain("typescript");
    expect(result.languages).toContain("tsx");
    expect(result.formattedMarkdown).toContain("Architecture & Code Specification Document");
    expect(result.formattedMarkdown).toContain("CREATE TABLE users");
    expect(result.formattedMarkdown).toContain("interface User");
  });

  it("should handle conversation with no code blocks gracefully", () => {
    const mockConv: Conversation = {
      id: "conv_empty",
      provider: "claude",
      title: "General Discussion",
      messages: [{ id: "m1", role: "user", content: "Hello, how are you today?" }]
    };

    const aggregator = new CodeAggregator();
    const result = aggregator.aggregate(mockConv);

    expect(result.totalSnippets).toBe(0);
    expect(result.formattedMarkdown).toContain("No code snippets detected");
  });
});
