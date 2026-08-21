import React from "react";
import { ProviderId } from "../../shared/types";

interface ProviderLogoProps {
  providerId: ProviderId;
  size?: number;
  className?: string;
}

export const ProviderLogo: React.FC<ProviderLogoProps> = ({ providerId, size = 18, className }) => {
  switch (providerId) {
    case "chatgpt":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.259 23.5a6.0557 6.0557 0 0 0 5.761-4.1817 5.9847 5.9847 0 0 0 3.9977-2.9 6.0462 6.0462 0 0 0-.7358-6.5972zM13.69 21.6562a4.4718 4.4718 0 0 1-2.8764-1.0406l.1415-.0813 4.7725-2.7562a.792.792 0 0 0 .3947-.6813v-6.7369l2.016 1.1642a.0792.0792 0 0 1 .0395.0604v5.5898a4.5054 4.5054 0 0 1-4.4878 4.4817zm-8.8687-3.4862a4.467 4.467 0 0 1-.5347-3.0039l.1415.0859 4.7725 2.7562a.792.792 0 0 0 .7894 0l5.8341-3.3685v2.3283a.0792.0792 0 0 1-.0395.0697l-4.8423 2.7984a4.5054 4.5054 0 0 1-6.121-1.6661zm-1.0974-9.3905a4.4718 4.4718 0 0 1 2.3417-1.9633l-.0047.1627v5.5125a.792.792 0 0 0 .3947.6813l5.8341 3.3685-2.016 1.1642a.0792.0792 0 0 1-.0789 0l-4.8423-2.7984a4.496 4.496 0 0 1-1.6286-6.1275zm15.1764 3.0085a.792.792 0 0 0-.3947-.6813l-5.8341-3.3685 2.016-1.1642a.0792.0792 0 0 1 .0789 0l4.8423 2.7984a4.496 4.496 0 0 1 1.6286 6.1275 4.4718 4.4718 0 0 1-2.3417 1.9633l.0047-.1627v-5.5125zm2.0832-4.0874l-.1415-.0859-4.7725-2.7562a.792.792 0 0 0-.7894 0l-5.8341 3.3685v-2.3283a.0792.0792 0 0 1 .0395-.0697l4.8423-2.7984a4.5054 4.5054 0 0 1 6.6557 4.67zm-12.759 2.5063l2.8718-1.657 2.8718 1.657v3.314l-2.8718 1.657-2.8718-1.657z"
            fill="currentColor"
          />
        </svg>
      );

    case "claude":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
            fill="currentColor"
          />
        </svg>
      );

    case "gemini":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
            fill="currentColor"
          />
        </svg>
      );

    case "perplexity":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M12 2L3 7V17L12 22L21 17V7L12 2ZM12 4.5L18.5 8.1V15.9L12 19.5L5.5 15.9V8.1L12 4.5ZM12 8L7 11V14L12 17L17 14V11L12 8Z"
            fill="currentColor"
          />
        </svg>
      );

    case "grok":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            fill="currentColor"
          />
        </svg>
      );

    case "copilot":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12 5C14.21 5 16 6.79 16 9C16 11.21 14.21 13 12 13C9.79 13 8 11.21 8 9C8 6.79 9.79 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
            fill="currentColor"
          />
        </svg>
      );

    case "deepseek":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z"
            fill="currentColor"
          />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
  }
};
