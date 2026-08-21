import { Conversation, ConversationMetadata, Message } from "../shared/types";

export class ContextAnalyzer {
  /**
   * Analyzes conversation turn history and extracts structured project metadata.
   */
  public analyze(conversation: Conversation): ConversationMetadata {
    const messages = conversation.messages;
    
    const goals: string[] = [];
    const decisions: string[] = [];
    const constraints: string[] = [];
    const preferences: string[] = [];
    const technologies = new Set<string>();
    const openTasks: string[] = [];
    const codeSnippets: Array<{ language: string; code: string; title?: string }> = [];
    const errorsEncountered: string[] = [];

    // Tech keywords regex dictionary
    const techKeywords = [
      "React", "TypeScript", "JavaScript", "Python", "Vue", "Next.js", "Vite",
      "Node.js", "Express", "FastAPI", "Django", "PostgreSQL", "MySQL", "MongoDB",
      "SQLite", "Prisma", "Docker", "Kubernetes", "TailwindCSS", "CSS", "HTML",
      "Chrome Extension", "Manifest V3", "Vitest", "Jest", "GraphQL", "REST API",
      "Zustand", "Redux", "WebSockets", "Rust", "Go", "Java", "C#", ".NET"
    ];

    const techRegex = new RegExp(`\\b(${techKeywords.join("|")})\\b`, "gi");

    messages.forEach((msg) => {
      const content = msg.content;
      if (!content) return;

      // Extract technologies
      const matches = content.match(techRegex);
      if (matches) {
        matches.forEach((t) => technologies.add(t));
      }

      // Extract code blocks
      const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
      let match: RegExpExecArray | null;
      while ((match = codeBlockRegex.exec(content)) !== null) {
        const lang = match[1] || "text";
        const code = match[2].trim();
        if (code.length > 10 && codeSnippets.length < 15) {
          codeSnippets.push({ language: lang, code });
        }
      }

      // Sentence level analysis
      const lines = content.split("\n");
      lines.forEach((line) => {
        const cleanLine = line.trim().replace(/^[-*•>]\s*/, "");

        // Goals extraction
        if (/^(goal|objective|aim|target):/i.test(cleanLine) ||
            /^(i want to|we need to|our goal is|building a|create a)\b/i.test(cleanLine)) {
          if (cleanLine.length > 10 && !goals.includes(cleanLine)) {
            goals.push(cleanLine);
          }
        }

        // Decisions extraction
        if (/^(decision|architecture|decided):/i.test(cleanLine) ||
            /\b(we decided to|chosen to|settled on|will use|decision:)\b/i.test(cleanLine)) {
          if (cleanLine.length > 10 && !decisions.includes(cleanLine)) {
            decisions.push(cleanLine);
          }
        }

        // Constraints extraction
        if (/^(constraint|restriction|requirement):/i.test(cleanLine) ||
            /\b(must not|cannot|do not use|avoid|constraint:)\b/i.test(cleanLine)) {
          if (cleanLine.length > 10 && !constraints.includes(cleanLine)) {
            constraints.push(cleanLine);
          }
        }

        // Open Tasks / TODOs extraction
        if (/^\[\s*\]/i.test(line) ||
            /^(todo|task|remaining|next step):/i.test(cleanLine) ||
            /\b(need to implement|still need to)\b/i.test(cleanLine)) {
          if (cleanLine.length > 5 && !openTasks.includes(cleanLine)) {
            openTasks.push(cleanLine);
          }
        }

        // Errors encountered extraction
        if (/\b(error|exception|failed|bug|crash|typeerror):/i.test(cleanLine) ||
            /\b(encountered error|got error)\b/i.test(cleanLine)) {
          if (cleanLine.length > 10 && errorsEncountered.length < 8 && !errorsEncountered.includes(cleanLine)) {
            errorsEncountered.push(cleanLine);
          }
        }
      });
    });

    const primaryGoal = goals.length > 0 ? goals[0] : conversation.title;

    return {
      goal: primaryGoal,
      goals: goals.slice(0, 5),
      decisions: decisions.slice(0, 8),
      constraints: constraints.slice(0, 5),
      preferences: preferences.slice(0, 5),
      technologies: Array.from(technologies),
      openTasks: openTasks.slice(0, 8),
      codeSnippets: codeSnippets.slice(0, 6),
      errorsEncountered: errorsEncountered.slice(0, 5)
    };
  }
}
