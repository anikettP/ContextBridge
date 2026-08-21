import { ContextStrategyMode, ExtensionSettings, PersonaId, ProviderId } from "./types";
import { ProviderMetadata } from "../providers/base/ProviderCapabilities";

export const SUPPORTED_PROVIDERS: Record<ProviderId, ProviderMetadata> = {
  chatgpt: {
    id: "chatgpt",
    name: "ChatGPT",
    hostnamePatterns: ["chatgpt.com", "chat.openai.com"],
    homeUrl: "https://chatgpt.com",
    logo: "https://chatgpt.com/favicon.ico",
    accentColor: "#10a37f",
    capabilities: {
      canExtract: true,
      canInject: true,
      supportsStreaming: true,
      supportsAttachments: true,
      supportsConversationTitle: true
    }
  },
  claude: {
    id: "claude",
    name: "Claude",
    hostnamePatterns: ["claude.ai"],
    homeUrl: "https://claude.ai",
    logo: "https://claude.ai/favicon.ico",
    accentColor: "#d97706",
    capabilities: {
      canExtract: true,
      canInject: true,
      supportsStreaming: true,
      supportsAttachments: true,
      supportsConversationTitle: true
    }
  },
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    hostnamePatterns: ["gemini.google.com"],
    homeUrl: "https://gemini.google.com",
    logo: "https://gemini.google.com/favicon.ico",
    accentColor: "#2563eb",
    capabilities: {
      canExtract: true,
      canInject: true,
      supportsStreaming: true,
      supportsAttachments: true,
      supportsConversationTitle: true
    }
  },
  perplexity: {
    id: "perplexity",
    name: "Perplexity",
    hostnamePatterns: ["perplexity.ai", "www.perplexity.ai"],
    homeUrl: "https://www.perplexity.ai",
    logo: "https://www.perplexity.ai/favicon.ico",
    accentColor: "#20b2aa",
    capabilities: {
      canExtract: true,
      canInject: true,
      supportsStreaming: true,
      supportsAttachments: false,
      supportsConversationTitle: true
    }
  },
  grok: {
    id: "grok",
    name: "Grok",
    hostnamePatterns: ["grok.com", "x.ai"],
    homeUrl: "https://grok.com",
    logo: "https://grok.com/favicon.ico",
    accentColor: "#ef4444",
    capabilities: {
      canExtract: true,
      canInject: true,
      supportsStreaming: true,
      supportsAttachments: true,
      supportsConversationTitle: true
    }
  },
  copilot: {
    id: "copilot",
    name: "Microsoft Copilot",
    hostnamePatterns: ["copilot.microsoft.com", "edgeservices.bing.com"],
    homeUrl: "https://copilot.microsoft.com",
    logo: "https://copilot.microsoft.com/favicon.ico",
    accentColor: "#0284c7",
    capabilities: {
      canExtract: true,
      canInject: true,
      supportsStreaming: true,
      supportsAttachments: false,
      supportsConversationTitle: true
    }
  },
  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    hostnamePatterns: ["chat.deepseek.com", "deepseek.com"],
    homeUrl: "https://chat.deepseek.com",
    logo: "https://chat.deepseek.com/favicon.ico",
    accentColor: "#4f46e5",
    capabilities: {
      canExtract: true,
      canInject: true,
      supportsStreaming: true,
      supportsAttachments: true,
      supportsConversationTitle: true
    }
  },
  unknown: {
    id: "unknown",
    name: "Unknown Provider",
    hostnamePatterns: [],
    homeUrl: "",
    logo: "",
    accentColor: "#6b7280",
    capabilities: {
      canExtract: false,
      canInject: false,
      supportsStreaming: false,
      supportsAttachments: false,
      supportsConversationTitle: false
    }
  }
};

export const DEFAULT_SETTINGS: ExtensionSettings = {
  defaultStrategy: "smart",
  lastNMessageDefault: 20,
  autoCopyFallback: true,
  preferredTargetProvider: "claude",
  useExternalLLM: false,
  externalLLMProvider: undefined,
  apiKey: ""
};

export const STRATEGY_DESCRIPTIONS: Record<ContextStrategyMode, { name: string; description: string }> = {
  smart: {
    name: "Smart Context",
    description: "Extracts objectives, technical decisions, requirements, code architecture & recent turns."
  },
  full: {
    name: "Full Conversation",
    description: "Includes every message turn without summarization or omissions."
  },
  important: {
    name: "Important Context Only",
    description: "Includes project summary, decisions, tech stack, and goals without message transcript."
  },
  last_n: {
    name: "Last N Messages",
    description: "Includes the structured context package plus the last selected N conversation turns."
  },
  custom: {
    name: "Custom Strategy",
    description: "Customize exactly which elements (code, decisions, open tasks, turns) to include."
  }
};

export const PERSONA_DESCRIPTIONS: Record<PersonaId, { name: string; promptDirective: string }> = {
  standard: {
    name: "Standard Assistant",
    promptDirective: "Continue assisting the user seamlessly from where they left off."
  },
  architect: {
    name: "Senior Software Architect",
    promptDirective: "Adopt the role of a Senior Software Architect. Focus on clean design patterns, modularity, scalability, code elegance, and enterprise best practices."
  },
  bughunter: {
    name: "Bug Hunter & Security Auditor",
    promptDirective: "Adopt the role of a Bug Hunter and Security Auditor. Analyze the code & context for edge cases, race conditions, security vulnerabilities, memory leaks, and potential bugs."
  },
  performance: {
    name: "Performance Specialist",
    promptDirective: "Adopt the role of a Performance Optimization Specialist. Focus on execution speed, memory footprint reduction, bundle size optimization, and latency reduction."
  },
  writer: {
    name: "Technical Writer",
    promptDirective: "Adopt the role of a Lead Technical Writer. Focus on clear documentation, API reference guides, setup instructions, and clean markdown formatting."
  },
  prototyper: {
    name: "Rapid Prototyper",
    promptDirective: "Adopt the role of a Rapid Prototyping Developer. Focus on immediate working code, minimal boilerplate, high velocity, and practical implementation."
  },
  custom: {
    name: "Custom Role Directive",
    promptDirective: "Adopt the custom role directive specified by the user."
  }
};

export const AICP_VERSION = "1.0";
