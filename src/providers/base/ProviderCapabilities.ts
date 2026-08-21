import { ProviderId } from "../../shared/types";

export interface ProviderCapabilities {
  canExtract: boolean;
  canInject: boolean;
  supportsStreaming: boolean;
  supportsAttachments: boolean;
  supportsConversationTitle: boolean;
}

export interface ProviderMetadata {
  id: ProviderId;
  name: string;
  hostnamePatterns: string[];
  capabilities: ProviderCapabilities;
  homeUrl: string;
  logo: string;
  accentColor: string;
}
