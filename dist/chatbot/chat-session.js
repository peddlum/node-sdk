"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChatbotClient = createChatbotClient;
const constants_1 = require("../constants");
/** Unwrap `{ data: ... }` envelopes the API sometimes wraps responses in. */
function unwrap(body) {
    if (body && typeof body === 'object' && 'data' in body) {
        return body.data;
    }
    return body;
}
function createChatbotClient(anonKey, options = {}) {
    if (!anonKey) {
        throw new Error('createChatbotClient requires an anon key');
    }
    const baseUrl = (options.baseUrl ?? constants_1.PEDDLUM_BASE_URL).replace(/\/$/, '');
    let sessionId = options.sessionId ?? null;
    async function getConfig() {
        const res = await fetch(`${baseUrl}/app-platform/chatbot/config`, {
            headers: { 'x-api-key': anonKey },
        });
        if (!res.ok)
            return null;
        return unwrap(await res.json());
    }
    async function send(message) {
        const res = await fetch(`${baseUrl}/app-platform/chatbot/send`, {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'x-api-key': anonKey },
            body: JSON.stringify({ message, sessionId }),
        });
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`Chatbot request failed: ${res.status} ${text.slice(0, 200)}`);
        }
        const data = unwrap(await res.json());
        if (!data)
            throw new Error('Empty chatbot response');
        if (data.sessionId)
            sessionId = data.sessionId;
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
//# sourceMappingURL=chat-session.js.map