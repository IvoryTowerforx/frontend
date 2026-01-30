<template>
  <div class="chat-view">
    <div class="panel-header">
      <div class="badge">
        <el-icon><ChatLineRound /></el-icon>
        <span>小玉 · 医疗助手</span>
      </div>
    </div>
    <div class="chat-panel">
      <div class="chat-body">
        <ChatWindow :messages="active?.messages || []" @choose="onChoose">
          <template #composer>
            <ChatInput
              :loading="loading"
              @send="onSend"
              @shortcut="onShortcut"
            />
          </template>
        </ChatWindow>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useChatStore } from "../store/chatStore";
import ChatWindow from "../components/ChatWindow.vue";
import ChatInput from "../components/ChatInput.vue";
import { ChatLineRound } from "@element-plus/icons-vue";
import { buildFileUrl, sendMessage } from "../services/api";

const route = useRoute();
const router = useRouter();
const chat = useChatStore();
const { activeConversation: activeRef } = storeToRefs(chat);
const active = computed(() => activeRef.value);
const loading = computed(() => chat.loading);

onMounted(() => {
  const id = route.params.id;
  if (!id) {
    const nid = chat.ensureFirstConversation();
    router.replace({ name: "chat", params: { id: nid } });
  } else {
    chat.setActive(String(id));
  }
});

watch(
  () => route.params.id,
  (id) => id && chat.setActive(String(id)),
);

async function onSend(text) {
  const convId = chat.activeId || chat.ensureFirstConversation();
  chat.addUserMessage(convId, text);
  try {
    const data = await sendMessage(text, convId);
    if (data?.response) chat.addAssistantMessage(convId, data.response);

    const videoUrl = buildFileUrl(data?.video_file);
    if (videoUrl) {
      chat.addAssistantMessage(convId, {
        content: "相关视频",
        video: videoUrl,
      });
    }

    const imageUrl = buildFileUrl(data?.image_file || data?.image);
    if (imageUrl) {
      chat.addAssistantMessage(convId, {
        content: "相关图片",
        image: imageUrl,
      });
    }

    if (Array.isArray(data?.context_used) && data.context_used.length) {
      chat.addAssistantMessage(
        convId,
        `参考资料：\n- ${data.context_used.join("\n- ")}`,
      );
    }
  } catch (e) {
    chat.addAssistantMessage(convId, "请求失败，请检查后端服务可用性。");
  }
}

// 处理 ChatWindow 中的选择点击
function onChoose(payload) {
  const { label, context } = payload || {};
  if (!label) return;
  const query = context ? `${label}${context}` : label;
  onSend(query);
}

// 处理 ChatInput 触发的快捷按钮
function onShortcut(type) {
  const convId = chat.activeId || chat.ensureFirstConversation();
  if (type === "map") {
    chat.addAssistantMessage(convId, {
      content: "您可以选择以下地点：",
      choices: [
        "除颤仪",
        "健康亭",
        "人体成分分析仪",
        "心电图机",
        "动脉硬化检测仪",
        "采血台",
        "睡眠改善区域",
        "洗手间",
      ],
      context: "地图导航",
    });
  } else if (type === "device") {
    chat.addAssistantMessage(convId, {
      content: "以下是设备总览：",
      choices: [
        "健康亭",
        "人体成分分析仪",
        "动脉硬化检测仪",
        "血压血氧心率仪",
        "心电图机",
        "肺功能仪",
        "除颤仪",
      ],
      context: "设备介绍",
    });
  }
}
</script>

<style scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 20px 16px;
  box-sizing: border-box;
}

.panel-header {
  padding: 4px 4px 10px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(64, 158, 255, 0.12);
  color: #1f6fe5;
  font-weight: 600;
  font-size: 13px;
}

.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #fdfefe 0%, #f5f7fb 100%);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 14px 40px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  min-height: 0;
}

.chat-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
}

@media (max-width: 960px) {
  .chat-view {
    padding: 20px 16px;
  }
  .headline {
    font-size: 24px;
  }
}
</style>
