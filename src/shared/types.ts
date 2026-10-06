export type MessageRole = "user" | "assistant" | "system" | "tool";

export type ProviderId =
  | "chatgpt"
  | "claude"
  | "gemini"
  | "perplexity"
  | "grok"
  | "copilot"
  | "deepseek"
  | "unknown";

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url?: string;
  content?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp?: string;
  attachments?: Attachment[];
  metadata?: Record<string, unknown>;
}

export interface ConversationMetadata {
  goal?: string;
  goals?: string[];
  decisions?: string[];
  constraints?: string[];
  preferences?: string[];
  technologies?: string[];
  openQuestions?: string[];
  openTasks?: string[];
  todos?: string[];
  codeSnippets?: Array<{ language: string; code: string; title?: string }>;
  errorsEncountered?: string[];
}

export interface Conversation {
  id: string;
  title?: string;
  provider: ProviderId;
  messages: Message[];
  metadata?: ConversationMetadata;
  createdAt?: string;
  updatedAt?: string;
  url?: string;
  isPartial?: boolean;
}

export type ContextStrategyMode = "smart" | "full" | "important" | "last_n" | "custom";

export interface CustomStrategyConfig {
  includeGoals: boolean;
  includeDecisions: boolean;
  includeTechStack: boolean;
  includeCodeBlocks: boolean;
  includeOpenTasks: boolean;
  includeErrors: boolean;
  recentMessagesCount: number;
}

export type PersonaId = "standard" | "architect" | "bughunter" | "performance" | "writer" | "prototyper" | "custom";

export interface ContextPackageOptions {
  mode: ContextStrategyMode;
  lastNCount?: number;
  customConfig?: CustomStrategyConfig;
  targetProvider?: ProviderId;
  persona?: PersonaId;
  customPersonaPrompt?: string;
}

export interface ContextPackage {
  title: string;
  sourceProvider: ProviderId;
  timestamp: string;
  originalMessageCount: number;
  transferredMessageCount: number;
  estimatedTokens: number;
  informationRetentionPercentage: number;
  metadata: ConversationMetadata;
  recentMessages: Message[];
  formattedMarkdown: string;
  redactedCredentialsCount?: number;
}

// Portable AICP format (v1.0)
export interface AICPPackage {
  version: "1.0";
  generator: "ContextBridge";
  createdAt: string;
  source: {
    provider: ProviderId;
    title?: string;
    url?: string;
  };
  conversation: {
    messages: Message[];
  };
  context: ConversationMetadata;
}

export interface SavedProjectMemory {
  id: string;
  name: string;
  description?: string;
  sourceProvider: ProviderId;
  createdAt: string;
  updatedAt: string;
  context: ConversationMetadata;
  estimatedTokens: number;
  formattedMarkdown: string;
}

export interface ExtensionSettings {
  defaultStrategy: ContextStrategyMode;
  lastNMessageDefault: number;
  autoCopyFallback: boolean;
  preferredTargetProvider: ProviderId;
  useExternalLLM: boolean;
  externalLLMProvider?: "openai" | "anthropic" | "gemini";
  apiKey?: string;
  customSystemPrompt?: string;
}

export type ExtensionMessage =
  | { type: "DETECT_PROVIDER" }
  | { type: "EXTRACT_CONVERSATION" }
  | { type: "INJECT_CONTEXT"; payload: { formattedContext: string } }
  | { type: "GET_CONVERSATION_TITLE" }
  | { type: "RESPONSE_SUCCESS"; payload: any }
  | { type: "RESPONSE_ERROR"; error: string };
