export { ChatbotClient } from './chatbot-client';
export type {
  ChatbotConfig,
  ChatbotConfigPatch,
  ChatbotDocument,
  ChatbotMessage,
  SendMessageInput,
  SendMessageResult,
  UploadDocumentOptions,
} from './types';

// Headless, cross-platform chat session (web + React Native + Node).
export { createChatbotClient } from './chat-session';
export type {
  ChatbotClient as ChatbotSessionClient,
  ChatbotClientOptions as ChatbotSessionOptions,
  ChatSendResult,
} from './chat-session';
