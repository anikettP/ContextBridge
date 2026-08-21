import { ContextAnalyzer } from "./analyzer";
import { ContextFormatter } from "./formatter";
import { ContextSummarizer } from "./summarizer";
import { PrivacyShield } from "./privacy-shield";
import {
  ContextPackage,
  ContextPackageOptions,
  Conversation,
  Message
} from "../shared/types";
import { calculateRetentionPercentage, estimateTokenCount } from "../shared/utils";

export class ContextCompressor {
  private analyzer = new ContextAnalyzer();
  private summarizer = new ContextSummarizer();
  private formatter = new ContextFormatter();

  /**
   * Processes a conversation based on the selected context strategy mode and persona adapter.
   */
  public process(
    conversation: Conversation,
    options: ContextPackageOptions
  ): ContextPackage {
    const totalOriginalTurns = conversation.messages.length;
    const metadata = this.analyzer.analyze(conversation);

    let messagesToInclude: Message[] = [];

    switch (options.mode) {
      case "full":
        messagesToInclude = [...conversation.messages];
        break;

      case "important":
        // Only structured metadata, no raw turns
        messagesToInclude = [];
        break;

      case "last_n":
        const count = options.lastNCount || 20;
        messagesToInclude = conversation.messages.slice(-count);
        break;

      case "custom":
        if (options.customConfig) {
          const recentCount = options.customConfig.recentMessagesCount || 10;
          messagesToInclude = conversation.messages.slice(-recentCount);
          if (!options.customConfig.includeGoals) metadata.goal = undefined;
          if (!options.customConfig.includeDecisions) metadata.decisions = [];
          if (!options.customConfig.includeTechStack) metadata.technologies = [];
          if (!options.customConfig.includeCodeBlocks) metadata.codeSnippets = [];
          if (!options.customConfig.includeOpenTasks) metadata.openTasks = [];
          if (!options.customConfig.includeErrors) metadata.errorsEncountered = [];
        }
        break;

      case "smart":
      default:
        // Smart mode: Includes all extracted metadata + recent key turns
        messagesToInclude = conversation.messages.slice(-10);
        break;
    }

    const rawMarkdown = this.formatter.formatToMarkdown(
      conversation.provider,
      conversation.title,
      metadata,
      messagesToInclude,
      totalOriginalTurns,
      options.targetProvider,
      options.persona,
      options.customPersonaPrompt
    );

    // Run PrivacyShield sanitization to auto-redact API keys, secret tokens, and passwords
    const { sanitizedText: formattedMarkdown } = PrivacyShield.sanitize(rawMarkdown);

    const estimatedTokens = estimateTokenCount(formattedMarkdown);

    const hasMetadata = Boolean(
      metadata.goal ||
      (metadata.decisions && metadata.decisions.length > 0) ||
      (metadata.technologies && metadata.technologies.length > 0) ||
      (metadata.codeSnippets && metadata.codeSnippets.length > 0)
    );

    const retentionPercentage = calculateRetentionPercentage(
      totalOriginalTurns,
      messagesToInclude.length,
      hasMetadata
    );

    return {
      title: conversation.title || "AI Conversation",
      sourceProvider: conversation.provider,
      timestamp: new Date().toISOString(),
      originalMessageCount: totalOriginalTurns,
      transferredMessageCount: messagesToInclude.length,
      estimatedTokens,
      informationRetentionPercentage: retentionPercentage,
      metadata,
      recentMessages: messagesToInclude,
      formattedMarkdown
    };
  }
}
