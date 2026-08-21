import type { Conversation, Message } from "../shared/types";

export interface ConversationContext {
  goal: string;
  decisions: string[];
  requirements: string[];
  constraints: string[];
  technologies: string[];
  openTasks: string[];
  recentMessages: Message[];
}

export type { Conversation };
