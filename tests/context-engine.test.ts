import { describe, expect, it } from "vitest";
import { ContextAnalyzer } from "../src/context-engine/analyzer";
import { ContextCompressor } from "../src/context-engine/compressor";
import { ContextFormatter } from "../src/context-engine/formatter";
import { Conversation } from "../src/shared/types";

describe("Context Engine Test Suite", () => {
  const sampleConversation: Conversation = {
    id: "test_conv_1",
    provider: "chatgpt",
    title: "ProjectSphere Architecture",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Goal: Build ProjectSphere SaaS application in React, TypeScript, and Node.js."
      },
      {
        id: "m2",
        role: "assistant",
        content: "Decision: We decided to use PostgreSQL with Prisma ORM and Docker for containerization."
      },
      {
        id: "m3",
        role: "user",
        content: "Requirement: Must not store unencrypted passwords. Todo: Implement authentication module."
      },
      {
        id: "m4",
        role: "assistant",
        content: "Here is the code spec:\n```typescript\ninterface User { id: string; email: string; }\n```"
      }
    ]
  };

  it("should extract goals, tech stack, decisions, and code blocks with ContextAnalyzer", () => {
    const analyzer = new ContextAnalyzer();
    const metadata = analyzer.analyze(sampleConversation);

    expect(metadata.goal).toBe("Goal: Build ProjectSphere SaaS application in React, TypeScript, and Node.js.");
    expect(metadata.technologies).toContain("React");
    expect(metadata.technologies).toContain("TypeScript");
    expect(metadata.technologies).toContain("Node.js");
    expect(metadata.technologies).toContain("PostgreSQL");
    expect(metadata.technologies).toContain("Prisma");
    expect(metadata.technologies).toContain("Docker");
    expect(metadata.decisions).toBeDefined();
    expect(metadata.decisions?.[0]).toContain("use PostgreSQL with Prisma");
    expect(metadata.codeSnippets).toHaveLength(1);
    expect(metadata.codeSnippets?.[0]?.language).toBe("typescript");
  });

  it("should process conversation in Smart mode with ContextCompressor", () => {
    const compressor = new ContextCompressor();
    const pkg = compressor.process(sampleConversation, { mode: "smart" });

    expect(pkg.title).toBe("ProjectSphere Architecture");
    expect(pkg.originalMessageCount).toBe(4);
    expect(pkg.estimatedTokens).toBeGreaterThan(50);
    expect(pkg.informationRetentionPercentage).toBeGreaterThanOrEqual(90);
    expect(pkg.formattedMarkdown).toContain("ProjectSphere Architecture");
    expect(pkg.formattedMarkdown).toContain("Key Architectural Decisions");
    expect(pkg.formattedMarkdown).toContain("Critical Code Architecture");
  });

  it("should keep user requests in smart context and avoid using title as goal", () => {
    const conversation: Conversation = {
      id: "long-conversation",
      provider: "chatgpt",
      title: "Five features to build first",
      messages: Array.from({ length: 14 }, (_, index) => ({
        id: `message-${index}`,
        role: index % 2 === 0 ? "user" as const : "assistant" as const,
        content: index === 0 ? "Please design the first release plan." : `Turn ${index}`
      }))
    };

    const pkg = new ContextCompressor().process(conversation, { mode: "smart" });
    const fullPkg = new ContextCompressor().process(conversation, { mode: "full" });

    expect(pkg.metadata.goal).toBe("Please design the first release plan.");
    expect(pkg.formattedMarkdown).toContain("Please design the first release plan.");
    expect(pkg.formattedMarkdown).toContain("Do not ask the user to acknowledge");
    expect(pkg.transferredMessageCount).toBe(11);
    expect(fullPkg.transferredMessageCount).toBe(14);
    expect(fullPkg.formattedMarkdown.length).toBeGreaterThan(pkg.formattedMarkdown.length);
  });

  it("should format portable AICP v1.0 JSON package", () => {
    const formatter = new ContextFormatter();
    const analyzer = new ContextAnalyzer();
    const metadata = analyzer.analyze(sampleConversation);

    const aicp = formatter.toAICP(sampleConversation, metadata);
    expect(aicp.version).toBe("1.0");
    expect(aicp.generator).toBe("ContextBridge");
    expect(aicp.source.provider).toBe("chatgpt");
    expect(aicp.conversation.messages).toHaveLength(4);
  });
});
