"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChatbotClient = exports.ChatbotClient = void 0;
var chatbot_client_1 = require("./chatbot-client");
Object.defineProperty(exports, "ChatbotClient", { enumerable: true, get: function () { return chatbot_client_1.ChatbotClient; } });
// Headless, cross-platform chat session (web + React Native + Node).
var chat_session_1 = require("./chat-session");
Object.defineProperty(exports, "createChatbotClient", { enumerable: true, get: function () { return chat_session_1.createChatbotClient; } });
//# sourceMappingURL=index.js.map