<template>
  <div class="chat-wrap">
    <el-scrollbar ref="scroller" class="messages">
      <div class="messages-inner">
        <div class="messages-container">
          <template v-if="messages.length">
            <div v-for="m in messages" :key="m.id" class="msg" :class="m.role">
              <div class="avatar" :class="m.role">
                <span>{{ m.role === "user" ? "我" : "玉" }}</span>
              </div>
              <div class="bubble" :class="m.role">
                <div class="content" v-if="m.content">{{ m.content }}</div>
                <div v-if="m.image" class="media image">
                  <img
                    :src="m.image"
                    alt="assistant attachment"
                    loading="lazy"
                  />
                </div>
                <div v-if="m.video" class="media video">
                  <video :src="m.video" controls preload="metadata"></video>
                </div>
                <!-- 可选项渲染 -->
                <div v-if="m.choices && m.choices.length" class="choices">
                  <el-button
                    v-for="(opt, i) in m.choices"
                    :key="i"
                    size="small"
                    round
                    class="choice-pill"
                    @click="
                      $emit('choose', { label: opt, context: m.context || '' })
                    "
                  >
                    {{ opt }}
                  </el-button>
                </div>
                <div class="time">{{ formatTime(m.time) }}</div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="empty-state">
              <div class="empty-icon">
                <img src="/xiaoyu-avatar.png" alt="小玉头像" />
              </div>
              <div class="empty-text">开始对话吧</div>
            </div>
          </template>
        </div>
      </div>
    </el-scrollbar>
    <div class="composer">
      <slot name="composer" />
    </div>
  </div>
</template>

<script setup>
import { onUpdated, ref } from "vue";

defineProps({
  messages: { type: Array, default: () => [] },
  showRole: { type: Boolean, default: true },
});

defineEmits(["choose"]);

const scroller = ref();

onUpdated(() => {
  scroller.value?.setScrollTop(999999);
});

function formatTime(t) {
  const d = new Date(t);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}
</script>

<style scoped>
.chat-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: transparent;
}

.messages {
  flex: 1;
  background: transparent;
  padding: 12px 0;
  min-height: 0;
}

.messages-inner {
  display: flex;
  justify-content: center;
  align-items: stretch;
  min-height: 100%;
}

.messages-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 0 18px 12px;
  box-sizing: border-box;
  min-height: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 360px;
  color: #8a92a3;
}

.empty-icon {
  width: 84px;
  height: 84px;
  margin-bottom: 12px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.08);
}

.empty-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-text {
  font-size: 14px;
}

.msg {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 4px;
  animation: slideIn 0.25s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.msg.user {
  flex-direction: row-reverse;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
  background: #e5e7eb;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.avatar.user {
  background: linear-gradient(135deg, #4f7cff, #7ecbff);
  color: #fff;
}

.avatar.assistant {
  background: linear-gradient(135deg, #e7f0ff, #f3f7ff);
  color: #0f172a;
}

.bubble {
  max-width: 70%;
  padding: 12px 14px;
  border-radius: 16px;
  word-break: break-word;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
}

.bubble.user {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  color: #fff;
  border-radius: 16px 6px 16px 16px;
  box-shadow: 0 6px 18px rgba(59, 130, 246, 0.25);
}

.bubble.assistant {
  background: #f8fafc;
  color: #111827;
  border-radius: 6px 16px 16px 16px;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(229, 234, 244, 0.9);
}

.content {
  white-space: pre-wrap;
  line-height: 1.65;
  font-size: 15px;
}

.time {
  font-size: 11px;
  opacity: 0.7;
  text-align: right;
}

.media {
  border-radius: 12px;
  overflow: hidden;
  background: #0f172a;
  border: 1px solid rgba(15, 23, 42, 0.1);
}

.media.image {
  max-width: 320px;
}

.media.image img {
  width: 100%;
  display: block;
}

.media.video {
  max-width: 360px;
}

.media.video video {
  width: 100%;
  display: block;
}

.bubble.user .time {
  color: rgba(255, 255, 255, 0.78);
}

.bubble.assistant .time {
  color: #6b7280;
}

.choices {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.choice-pill {
  border-color: #dbe3f3;
}

.composer {
  flex-shrink: 0;
  position: sticky;
  bottom: 0;
  background: linear-gradient(180deg, rgba(245, 247, 251, 0.35), #fff);
  padding-top: 4px;
}
</style>
