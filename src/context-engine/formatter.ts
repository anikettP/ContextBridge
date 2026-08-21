import { AICPPackage, Conversation, ConversationMetadata, Message, PersonaId, ProviderId } from "../shared/types";
import { AICP_VERSION, PERSONA_DESCRIPTIONS, SUPPORTED_PROVIDERS } from "../shared/constants";

export class ContextFormatter {
  /**
   * Generates a portable AICP v1.0 JSON object.
   */
  public toAICP(
    conversation: Conversation,
    metadata: ConversationMetadata
  ): AICPPackage {
    return {
      version: AICP_VERSION as "1.0",
      generator: "ContextBridge",
      createdAt: new Date().toISOString(),
      source: {
        provider: conversation.provider,
        title: conversation.title,
        url: conversation.url
      },
      conversation: {
        messages: conversation.messages
      },
      context: metadata
    };
  }

  /**
   * Formats extracted metadata and message turns into a clean, professional Markdown Context Prompt.
   */
  public formatToMarkdown(
    sourceProvider: ProviderId,
    title: string | undefined,
    metadata: ConversationMetadata,
    messagesToInclude: Message[],
    totalOriginalTurns: number,
    targetProvider?: ProviderId,
    persona?: PersonaId,
    customPersonaPrompt?: string
  ): string {
    const sourceName = SUPPORTED_PROVIDERS[sourceProvider]?.name || sourceProvider;
    const targetName = targetProvider ? SUPPORTED_PROVIDERS[targetProvider]?.name || targetProvider : "AI Assistant";

    const personaInfo = persona ? PERSONA_DESCRIPTIONS[persona] || PERSONA_DESCRIPTIONS.standard : PERSONA_DESCRIPTIONS.standard;
    const directiveText = persona === "custom" && customPersonaPrompt?.trim()
      ? customPersonaPrompt.trim()
      : personaInfo.promptDirective;

    const lines: string[] = [];

    lines.push(`# ContextBridge — AI Conversation Context Protocol`);
    lines.push(`> **SYSTEM DIRECTIVE FOR ${targetName.toUpperCase()} (Role: ${personaInfo.name})**: This conversation context was transferred from **${sourceName}**.`);
    lines.push(`> **ROLE INSTRUCTION**: ${directiveText}`);
    lines.push(``);
    lines.push(`**Original Platform**: ${sourceName}`);
    lines.push(`**Topic**: ${title || "Untitled Project Conversation"}`);
    lines.push(`**Context Preserved**: ${messagesToInclude.length} of ${totalOriginalTurns} key turns packaged`);
    lines.push(``);
    lines.push(`---`);
    lines.push(``);

    // Goal / Objective
    if (metadata.goal || (metadata.goals && metadata.goals.length > 0)) {
      lines.push(`## Primary Goal & Objective`);
      lines.push(`${metadata.goal || metadata.goals?.[0]}`);
      lines.push(``);
    }

    // Tech Stack
    if (metadata.technologies && metadata.technologies.length > 0) {
      lines.push(`## Technical Stack & Frameworks`);
      lines.push(metadata.technologies.map((t) => `- \`${t}\``).join("\n"));
      lines.push(``);
    }

    // Architectural Decisions
    if (metadata.decisions && metadata.decisions.length > 0) {
      lines.push(`## Key Architectural Decisions`);
      lines.push(metadata.decisions.map((d) => `- ${d}`).join("\n"));
      lines.push(``);
    }

    // Requirements & Constraints
    if (metadata.constraints && metadata.constraints.length > 0) {
      lines.push(`## Constraints & Requirements`);
      lines.push(metadata.constraints.map((c) => `- ${c}`).join("\n"));
      lines.push(``);
    }

    // Open Tasks / Action Items
    if (metadata.openTasks && metadata.openTasks.length > 0) {
      lines.push(`## Action Items & Open Tasks`);
      lines.push(metadata.openTasks.map((t) => `- [ ] ${t}`).join("\n"));
      lines.push(``);
    }

    // Bugs & Resolved Issues
    if (metadata.errorsEncountered && metadata.errorsEncountered.length > 0) {
      lines.push(`## Bugs & Errors Resolved`);
      lines.push(metadata.errorsEncountered.map((e) => `- ${e}`).join("\n"));
      lines.push(``);
    }

    // Code Architecture Snippets
    if (metadata.codeSnippets && metadata.codeSnippets.length > 0) {
      lines.push(`## Critical Code Architecture & Specs`);
      metadata.codeSnippets.forEach((snippet) => {
        lines.push(`\`\`\`${snippet.language}`);
        lines.push(snippet.code);
        lines.push(`\`\`\``);
        lines.push(``);
      });
    }

    // Conversation History
    if (messagesToInclude.length > 0) {
      lines.push(`## Preserved Conversation Turns`);
      lines.push(``);

      messagesToInclude.forEach((msg) => {
        const roleLabel = msg.role === "user" ? "**User**" : `**Assistant (${sourceName})**`;
        lines.push(`${roleLabel}:`);
        lines.push(msg.content);
        lines.push(``);
        lines.push(`---`);
        lines.push(``);
      });
    }

    lines.push(`## Continuation Request`);
    lines.push(`Please acknowledge that you have received this transferred context from **${sourceName}** in your role as **${personaInfo.name}**, and provide the next step or solution to continue our conversation.`);

    return lines.join("\n");
  }
}
