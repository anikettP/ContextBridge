import type { Conversation, ConversationContext } from "./types";

export function createContext(_conversation: Conversation): ConversationContext {
  return {
    goal: "",
    decisions: [],
    requirements: [],
    constraints: [],
    technologies: [],
    openTasks: [],
    recentMessages: []
  };
}
