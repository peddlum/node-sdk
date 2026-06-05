import { PEDDLUM_BASE_URL } from '../constants';

/**
 * Headless, cross-platform chat session — works in the browser, React Native
 * (Expo), and Node 18+. Unlike `loadChatbot` (which builds a DOM widget and
 * therefore only runs in a browser), this exposes just the data layer:
 * `getConfig()` + `send()`, with automatic session tracking. Build whatever UI
 * you like on top (a React Native FlatList + TextInput, a custom web component,
 * a CLI, …). Only depends on global `fetch`, which all three runtimes provide.
 *
 *   const chat = createChatbotClient(PEDDLUM_ANON_KEY);
 *   const cfg = await chat.getConfig();          // welcome message, etc.
 *   const reply = await chat.send('How do I reset my PIN?');
 *   // sessionId is remembered across calls so history threads correctly.
 */

export interface ChatbotConfig {
  name?: string;
  welcomeMessage?: string;
  suggestedPrompts?: string[];
  [key: string]: unknown;
}

export interface ChatSendResult {
  sessionId: string;
  reply: { content: string; role?: string };
  handoff?: boolean;
  sources?: unknown[];
}

export interface ChatbotClientOptions {
  /** Override the API base URL (defaults to the Peddlum platform). */
  baseUrl?: string;
  /** Resume an existing conversation by seeding its session id. */
  sessionId?: string;
}

export interface ChatbotClient {
  /** Fetch the chatbot's public config (welcome message, suggested prompts). */
  getConfig(): Promise<ChatbotConfig | null>;
  /** Send a user message; the reply text is returned and history is threaded. */
  send(message: string): Promise<ChatSendResult>;
  /** The current conversation id (null until the first send). */
  getSessionId(): string | null;
  /** Reset the conversation so the next send starts a fresh session. */
  reset(): void;
}

/** Unwrap `{ data: ... }` envelopes the API sometimes wraps responses in. */
function unwrap<T>(body: unknown): T {
  if (body && typeof body === 'object' && 'data' in (body as Record<string, unknown>)) {
    return (body as { data: T }).data;
  }
  return body as T;
}

export function createChatbotClient(
  anonKey: string,
  options: ChatbotClientOptions = {},
): ChatbotClient {
  if (!anonKey) {
    throw new Error('createChatbotClient requires an anon key');
  }
  const baseUrl = (options.baseUrl ?? PEDDLUM_BASE_URL).replace(/\/$/, '');
  let sessionId: string | null = options.sessionId ?? null;

  async function getConfig(): Promise<ChatbotConfig | null> {
    const res = await fetch(`${baseUrl}/app-platform/chatbot/config`, {
      headers: { 'x-api-key': anonKey },
    });
    if (!res.ok) return null;
    return unwrap<ChatbotConfig | null>(await res.json());
  }

  async function send(message: string): Promise<ChatSendResult> {
    const res = await fetch(`${baseUrl}/app-platform/chatbot/send`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': anonKey },
      body: JSON.stringify({ message, sessionId }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Chatbot request failed: ${res.status} ${text.slice(0, 200)}`);
    }
    const data = unwrap<ChatSendResult>(await res.json());
    if (!data) throw new Error('Empty chatbot response');
    if (data.sessionId) sessionId = data.sessionId;
    return data;
  }

  return {
    getConfig,
    send,
    getSessionId: () => sessionId,
    reset: () => {
      sessionId = null;
    },
  };
}
