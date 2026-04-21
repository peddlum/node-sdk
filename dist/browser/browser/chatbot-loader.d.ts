export interface LoadChatbotOptions {
    /** Defaults to `bottom-right`. */
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    primaryColor?: string;
    greeting?: string;
    placeholder?: string;
    /** Override the API base URL (useful for self-hosted peddlum deployments). */
    baseUrl?: string;
}
/**
 * Mounts a minimal floating chatbot bubble backed by the peddlum
 * chatbot API. Intentionally dependency-free — no React, no axios — so
 * it drops into any site via:
 *
 *   <script type="module">
 *     import { loadChatbot } from '@peddlum/node-sdk/browser';
 *     loadChatbot('anon_...', { primaryColor: '#5b21b6' });
 *   </script>
 *
 * This is the reference minimal UI; sellers who want deeper integration
 * (custom components, theming, avatars) can build their own against the
 * same POST /app-platform/chatbot/send endpoint.
 */
export declare function loadChatbot(anonKey: string, options?: LoadChatbotOptions): void;
//# sourceMappingURL=chatbot-loader.d.ts.map