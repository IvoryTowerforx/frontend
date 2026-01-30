# AI Chat Frontend (Vue3 + Element Plus)

一个简洁的 AI 对话页面骨架，包含：

- 新建对话与历史记录列表
- 聊天消息展示与输入发送
- Pinia 状态持久化（localStorage）
- 预留后端 API 端口（`VITE_API_BASE_URL`）

## 目录结构

```
frontend/
  ├─ src/
  │  ├─ components/        # Sidebar / ChatWindow / ChatInput
  │  ├─ services/          # api.js 占位，读取环境变量
  │  ├─ store/             # Pinia：会话与消息
  │  ├─ views/             # ChatView
  │  ├─ router/            # 路由
  │  ├─ styles/            # 全局样式
  │  ├─ App.vue
  │  └─ main.js
  ├─ .env.development      # 预留后端 API 地址
  ├─ index.html
  ├─ package.json
  └─ vite.config.js
```

## 开发运行

1. 安装 Node.js 18+（含 npm）。
2. 安装依赖：

```bash
npm install
```

3. 启动开发：

```bash
npm run dev
```

默认访问：http://localhost:5173

## GitHub Pages 部署（方案一）

> 说明：GitHub Pages 不提供固定 IP，会提供公开访问链接，形如：
> `https://<username>.github.io/<repo>/`

1. 将当前 `frontend/` 作为仓库根目录推到 GitHub。
2. 确保默认分支名为 `main`（工作流监听 `main`）。
3. 在 GitHub 仓库中开启 Pages：

- Settings → Pages → Build and deployment
- Source 选择 **GitHub Actions**

4. 推送代码后，Actions 会自动构建并部署。

> 注意：工作流会自动设置 `VITE_BASE_PATH=/<repo>/`，无需手动改配置。

完成后访问地址：
`https://<username>.github.io/<repo>/`

## 后端 API 对接

- 在 `.env.development` 配置 `VITE_API_BASE_URL`，默认 `http://localhost:8080`。
- 在 `src/services/api.js` 中替换 `sendMessage()` 的模拟实现为真实接口，例如：

```js
export async function sendMessage(text, conversationId) {
  const { data } = await api.post("/chat/completions", {
    conversationId,
    message: text,
  });
  return data.reply;
}
```

## 设计说明

- 侧边栏提供“新建对话”和历史会话；会话标题默认取首条用户消息前 20 字。
- 消息与会话持久化到 `localStorage`，刷新不丢失。
- 移动端隐藏侧栏（简化处理，可按需改造为 Drawer）。

## 语音输入

- 在 `ChatInput` 增加了语音输入按钮（🎤）。点击开始/停止识别，识别文本会自动填充到输入框。
- 基于浏览器的 Web Speech API（`SpeechRecognition`/`webkitSpeechRecognition`），目前在 Chrome 家族支持较好；Safari/Firefox 支持有限。
- 首次使用需允许网页访问麦克风权限；不支持的浏览器会自动禁用按钮并显示提示。
