import { defineStore } from "pinia";

const STORAGE_KEY = "ai-chat-conversations-v1";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function loadConversations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveConversations(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export const useChatStore = defineStore("chat", {
  state: () => ({
    conversations: loadConversations(),
    activeId: "",
    loading: false,
  }),
  getters: {
    activeConversation(state) {
      return state.conversations.find((c) => c.id === state.activeId) || null;
    },
  },
  actions: {
    ensureFirstConversation() {
      if (!this.conversations.length) {
        return this.newConversation();
      }
      if (!this.activeId) {
        this.activeId = this.conversations[0].id;
      }
      return this.activeId;
    },
    newConversation() {
      const id = uid();
      const conv = {
        id,
        title: "新的对话",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [],
      };
      this.conversations.unshift(conv);
      this.activeId = id;
      saveConversations(this.conversations);
      return id;
    },
    setActive(id) {
      this.activeId = id;
    },
    removeConversation(id) {
      const idx = this.conversations.findIndex((c) => c.id === id);
      if (idx >= 0) this.conversations.splice(idx, 1);
      if (this.activeId === id) this.activeId = this.conversations[0]?.id || "";
      saveConversations(this.conversations);
    },
    clearConversation(id) {
      const c = this.conversations.find((x) => x.id === id);
      if (c) {
        c.messages = [];
        c.updatedAt = Date.now();
      }
      saveConversations(this.conversations);
    },
    addUserMessage(id, text) {
      const c = this.conversations.find((x) => x.id === id);
      if (!c) return;
      c.messages.push({
        id: uid(),
        role: "user",
        content: text,
        time: Date.now(),
      });
      c.updatedAt = Date.now();
      if (!c.title || c.title === "新的对话") c.title = text.slice(0, 20);
      saveConversations(this.conversations);
    },
    addAssistantMessage(id, payload) {
      const c = this.conversations.find((x) => x.id === id);
      if (!c) return;
      const isObjectPayload = payload && typeof payload === "object";
      c.messages.push({
        id: uid(),
        role: "assistant",
        content: isObjectPayload
          ? payload.content || ""
          : String(payload || ""),
        video: isObjectPayload ? payload.video || "" : "",
        image: isObjectPayload ? payload.image || "" : "",
        // 新增：可选项与上下文（用于快速选择）
        choices:
          isObjectPayload && Array.isArray(payload.choices)
            ? payload.choices
            : undefined,
        context:
          isObjectPayload && typeof payload.context === "string"
            ? payload.context
            : undefined,
        time: Date.now(),
      });
      c.updatedAt = Date.now();
      saveConversations(this.conversations);
    },
  },
});
