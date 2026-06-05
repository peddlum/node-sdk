// src/constants.ts
var PEDDLUM_BASE_URL = "https://api-dev.peddlum.com/api/v1";

// src/browser/chatbot-loader.ts
var WIDGET_ROOT_ID = "peddlum-chatbot-widget-root";
function loadChatbot(anonKey, options = {}) {
  var _a, _b, _c;
  if (typeof document === "undefined") {
    throw new Error("loadChatbot must run in the browser");
  }
  if (!anonKey || !anonKey.startsWith("anon_")) {
    console.warn(
      "[peddlum-chatbot] Prefer anon_ keys in the browser. service_ keys expose full privileges."
    );
  }
  if (document.getElementById(WIDGET_ROOT_ID)) return;
  const baseUrl = (_a = options.baseUrl) != null ? _a : PEDDLUM_BASE_URL;
  const position = (_b = options.position) != null ? _b : "bottom-right";
  const primaryColor = (_c = options.primaryColor) != null ? _c : "#4f46e5";
  const container = document.createElement("div");
  container.id = WIDGET_ROOT_ID;
  Object.assign(container.style, {
    position: "fixed",
    zIndex: "2147483647",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    ...positionStyles(position)
  });
  document.body.appendChild(container);
  const state = {
    sessionId: null,
    open: false,
    config: null
  };
  const bubble = buildBubble(primaryColor);
  const panel = buildPanel(primaryColor, options);
  container.appendChild(bubble);
  container.appendChild(panel.root);
  panel.root.style.display = "none";
  bubble.addEventListener("click", () => {
    state.open = !state.open;
    panel.root.style.display = state.open ? "flex" : "none";
    if (state.open && !state.config) {
      void fetchConfig();
    }
  });
  panel.form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const text = panel.input.value.trim();
    if (!text) return;
    panel.input.value = "";
    appendMessage(panel.messages, "user", text, primaryColor);
    const pending = appendMessage(panel.messages, "assistant", "\u2026", primaryColor);
    void send(text).then((reply) => {
      pending.textContent = reply;
    }).catch((err) => {
      pending.textContent = `Error: ${err.message}`;
    });
  });
  async function fetchConfig() {
    var _a2, _b2, _c2;
    try {
      const res = await fetch(`${baseUrl}/app-platform/chatbot/config`, {
        headers: { "x-api-key": anonKey }
      });
      if (!res.ok) return;
      const env = await res.json();
      const cfg = (_a2 = "data" in env ? env.data : env) != null ? _a2 : null;
      if (cfg) {
        state.config = cfg;
        const welcome = (_c2 = (_b2 = options.greeting) != null ? _b2 : cfg.welcomeMessage) != null ? _c2 : "Hi! How can I help?";
        appendMessage(panel.messages, "assistant", welcome, primaryColor);
      }
    } catch {
    }
  }
  async function send(message) {
    var _a2, _b2;
    const res = await fetch(`${baseUrl}/app-platform/chatbot/send`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": anonKey
      },
      body: JSON.stringify({ message, sessionId: state.sessionId })
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status} ${text.slice(0, 200)}`);
    }
    const env = await res.json();
    const data = "data" in env ? env.data : env;
    if (!data) throw new Error("Empty response");
    state.sessionId = data.sessionId;
    return (_b2 = (_a2 = data.reply) == null ? void 0 : _a2.content) != null ? _b2 : "";
  }
}
function positionStyles(pos) {
  const base = {};
  if (pos === "bottom-right") {
    base.bottom = "24px";
    base.right = "24px";
  } else if (pos === "bottom-left") {
    base.bottom = "24px";
    base.left = "24px";
  } else if (pos === "top-right") {
    base.top = "24px";
    base.right = "24px";
  } else {
    base.top = "24px";
    base.left = "24px";
  }
  return base;
}
function buildBubble(primary) {
  const el = document.createElement("button");
  el.type = "button";
  el.setAttribute("aria-label", "Open chat");
  Object.assign(el.style, {
    width: "56px",
    height: "56px",
    borderRadius: "28px",
    border: "none",
    boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
    background: primary,
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  });
  el.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
  return el;
}
function buildPanel(primary, options) {
  var _a;
  const root = document.createElement("div");
  Object.assign(root.style, {
    width: "360px",
    height: "520px",
    marginBottom: "12px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 20px 48px rgba(0,0,0,0.18)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  });
  const header = document.createElement("div");
  Object.assign(header.style, {
    padding: "12px 16px",
    background: primary,
    color: "white",
    fontWeight: "600"
  });
  header.textContent = "Support";
  root.appendChild(header);
  const messages = document.createElement("div");
  Object.assign(messages.style, {
    flex: "1",
    overflowY: "auto",
    padding: "12px 16px",
    background: "#f9fafb",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  });
  root.appendChild(messages);
  const form = document.createElement("form");
  Object.assign(form.style, {
    display: "flex",
    padding: "12px",
    background: "white",
    borderTop: "1px solid #e5e7eb",
    gap: "8px"
  });
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = (_a = options.placeholder) != null ? _a : "Type a message\u2026";
  Object.assign(input.style, {
    flex: "1",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px"
  });
  const send = document.createElement("button");
  send.type = "submit";
  send.textContent = "Send";
  Object.assign(send.style, {
    padding: "10px 14px",
    background: primary,
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  });
  form.appendChild(input);
  form.appendChild(send);
  root.appendChild(form);
  return { root, messages, form, input };
}
function appendMessage(container, role, content, primary) {
  const bubble = document.createElement("div");
  Object.assign(bubble.style, {
    alignSelf: role === "user" ? "flex-end" : "flex-start",
    maxWidth: "85%",
    padding: "8px 12px",
    borderRadius: "12px",
    fontSize: "14px",
    lineHeight: "1.4",
    background: role === "user" ? primary : "white",
    color: role === "user" ? "white" : "#111827",
    border: role === "user" ? "none" : "1px solid #e5e7eb",
    whiteSpace: "pre-wrap"
  });
  bubble.textContent = content;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
  return bubble;
}
export {
  loadChatbot
};
