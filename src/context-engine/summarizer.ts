import { Conversation, Message } from "../shared/types";
import { estimateTokenCount, truncate } from "../shared/utils";

export class ContextSummarizer {
  private chunkSize = 15; // Message turns per chunk

  /**
   * Performs hierarchical local summarization for long conversation transcripts.
   */
  public summarizeChunks(conversation: Conversation): string[] {
    const messages = conversation.messages;
    if (messages.length === 0) return [];

    const chunks: Message[][] = [];
    for (let i = 0; i < messages.length; i += this.chunkSize) {
      chunks.push(messages.slice(i, i + this.chunkSize));
    }

    return chunks.map((chunk, index) => this.summarizeChunk(chunk, index + 1));
  }

  private summarizeChunk(chunk: Message[], chunkIndex: number): string {
    const userMessages = chunk.filter((m) => m.role === "user");
    const assistantMessages = chunk.filter((m) => m.role === "assistant");

    const keyUserPrompts = userMessages.map((m) => truncate(m.content, 80)).join("; ");
    const keyAssistantTopics = assistantMessages
      .map((m) => {
        const firstLine = m.content.split("\n")[0];
        return truncate(firstLine, 80);
      })
      .slice(0, 3)
      .join("; ");

    return `Chunk ${chunkIndex} (${chunk.length} turns): Focus on "${keyUserPrompts || "User queries"}". Key responses: "${keyAssistantTopics || "AI explanations"}".`;
  }
}
