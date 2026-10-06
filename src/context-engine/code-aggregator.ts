import { Conversation, Message } from "../shared/types";

export interface AggregatedCodeSnippet {
  id: string;
  language: string;
  code: string;
  title?: string;
  turnIndex: number;
  role: string;
}

export interface CodeAggregatorResult {
  totalSnippets: number;
  languages: string[];
  snippets: AggregatedCodeSnippet[];
  formattedMarkdown: string;
}

export class CodeAggregator {
  /**
   * Scans a conversation and aggregates all code blocks turn-by-turn.
   */
  public aggregate(conversation: Conversation): CodeAggregatorResult {
    const snippets: AggregatedCodeSnippet[] = [];
    const languageSet = new Set<string>();
    const codeBlockRegex = /```([a-zA-Z0-9_\-+]*)\n([\s\S]*?)```/g;

    let snippetCounter = 0;

    conversation.messages.forEach((msg: Message, turnIdx: number) => {
      let match: RegExpExecArray | null;
      // Reset regex index for global matching
      codeBlockRegex.lastIndex = 0;

      while ((match = codeBlockRegex.exec(msg.content)) !== null) {
        snippetCounter++;
        const rawLang = match[1] ? match[1].trim().toLowerCase() : "text";
        const lang = rawLang || "text";
        const code = match[2] ? match[2].trim() : "";

        if (code.length > 0) {
          languageSet.add(lang);
          
          // Extract preceding line as title context if available
          const precedingText = msg.content.substring(0, match.index).trim();
          const precedingLines = precedingText.split("\n");
          const lastPrecedingLine = precedingLines[precedingLines.length - 1] || "";
          const title = lastPrecedingLine.replace(/^#+\s*/, "").replace(/[:*`]/g, "").trim().slice(0, 60);

          snippets.push({
            id: `snippet_${snippetCounter}`,
            language: lang,
            code,
            title: title || `Code Snippet #${snippetCounter}`,
            turnIndex: turnIdx + 1,
            role: msg.role
          });
        }
      }
    });

    const formattedMarkdown = this.formatAggregatedMarkdown(conversation.title, snippets);

    return {
      totalSnippets: snippets.length,
      languages: Array.from(languageSet),
      snippets,
      formattedMarkdown
    };
  }

  /**
   * Formats aggregated code snippets into a clean, structured Architecture Spec document.
   */
  private formatAggregatedMarkdown(convTitle: string | undefined, snippets: AggregatedCodeSnippet[]): string {
    const lines: string[] = [];

    lines.push(`# Architecture & Code Specification Document`);
    lines.push(`**Project Topic**: ${convTitle || "AI Conversation Code Aggregation"}`);
    lines.push(`**Total Snippets Extracted**: ${snippets.length}`);
    lines.push(`**Generated**: ${new Date().toLocaleString()}`);
    lines.push(``);
    lines.push(`---`);
    lines.push(``);

    if (snippets.length === 0) {
      lines.push(`*No code snippets detected in this conversation.*`);
      return lines.join("\n");
    }

    // Group snippets by language
    const grouped = new Map<string, AggregatedCodeSnippet[]>();
    snippets.forEach((s) => {
      const list = grouped.get(s.language) || [];
      list.push(s);
      grouped.set(s.language, list);
    });

    grouped.forEach((snippetList, lang) => {
      lines.push(`## Category: ${lang.toUpperCase()} (${snippetList.length} Snippets)`);
      lines.push(``);

      snippetList.forEach((s, idx) => {
        lines.push(`### Snippet #${idx + 1}: ${s.title || "Code Block"}`);
        lines.push(`*From Turn #${s.turnIndex} (${s.role})*`);
        lines.push(``);
        lines.push(`\`\`\`${s.language}`);
        lines.push(s.code);
        lines.push(`\`\`\``);
        lines.push(``);
      });

      lines.push(`---`);
      lines.push(``);
    });

    return lines.join("\n");
  }
}
