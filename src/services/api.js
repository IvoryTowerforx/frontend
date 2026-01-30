import axios from "axios";

// 后端基础地址：
// - 开发阶段推荐留空并通过 Vite 代理到后端（见 vite.config.js）
// - 若需直连可在 .env.* 配置 VITE_API_BASE_URL，例如 http://10.176.42.46:8000
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// 将后端返回的相对路径转换为可访问的完整地址
export function buildFileUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

// 发送消息到后端 /api/chat，入参 { query }
// 期望返回：{ response, video_file, context_used }
export async function sendMessage(text, conversationId) {
  const { data } = await api.post("/api/chat", { query: text });
  return data;
}
