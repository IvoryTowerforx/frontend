<template>
  <div class="composer-container">
    <div class="composer-card">
      <div class="input-row">
        <div class="tools">
          <el-tooltip content="添加" placement="top">
            <el-button text circle class="icon-btn"><Plus /></el-button>
          </el-tooltip>
          <el-tooltip content="上传" placement="top">
            <el-button text circle class="icon-btn"><Paperclip /></el-button>
          </el-tooltip>
          <el-tooltip content="设置" placement="top">
            <el-button text circle class="icon-btn"><Setting /></el-button>
          </el-tooltip>
        </div>
        <div class="input-area" :class="{ recording: isRecording }">
          <el-input
            v-model="text"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 5 }"
            placeholder="请输入任务或问题，Shift+Enter 换行"
            @keydown.enter.exact.prevent="emitSend"
            @keydown.enter.shift.exact.stop
            class="msg-input"
          />
        </div>
        <div class="actions">
          <!-- 小体积默认回复按钮，点击后弹出两个快捷项 -->
          <el-popover placement="top" trigger="click" :width="220">
            <template #default>
              <div class="shortcut-menu">
                <el-button
                  size="small"
                  round
                  class="choice-btn"
                  @click="emitShortcut('map')"
                >地图导航</el-button>
                <el-button
                  size="small"
                  round
                  class="choice-btn"
                  @click="emitShortcut('device')"
                >设备介绍</el-button>
              </div>
            </template>
            <template #reference>
              <el-button
                size="small"
                text
                class="shortcut-toggle"
                :disabled="loading"
              >默认回复</el-button>
            </template>
          </el-popover>
          <el-tooltip :content="micTooltip" placement="top">
            <el-button
              text
              circle
              class="icon-btn mic-btn"
              :class="{ recording: isRecording }"
              :disabled="loading || !speechSupported"
              @mousedown.prevent="handlePressStart"
              @mouseup="handlePressEnd"
              @mouseleave="handlePressEnd"
              @touchstart.prevent="handlePressStart"
              @touchend="handlePressEnd"
              @touchcancel="handlePressEnd"
            >
              <img src="/mic.svg" alt="mic" class="mic-icon" />
            </el-button>
          </el-tooltip>
          <el-button
            type="primary"
            class="send-btn"
            :disabled="!text.trim() || loading"
            @click="emitSend"
            >发送</el-button
          >
        </div>
      </div>
      <div class="hint">
        小贴士：描述越具体，回复越准确；可直接提问或粘贴文本。
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import { Plus, Paperclip, Setting } from "@element-plus/icons-vue";
import { createSpeechRecognition, isSpeechSupported } from "../services/speech";

const props = defineProps({ loading: { type: Boolean, default: false } });
const emit = defineEmits(["send", "shortcut"]);

const text = ref("");

// 语音识别相关
const isRecording = ref(false);
const speechSupported = ref(false);
const micTooltip = ref("按住说话，松开结束");
let recognition = null;

function emitSend() {
  const t = text.value.trim();
  if (!t) return;
  emit("send", t);
  text.value = "";
}

function emitShortcut(type) {
  emit("shortcut", type);
}

function handlePressStart() {
  if (!speechSupported.value || !recognition || props.loading) return;
  try {
    if (!isRecording.value) recognition.start();
  } catch (e) {}
}

function handlePressEnd() {
  if (!speechSupported.value || !recognition) return;
  try {
    if (isRecording.value) recognition.stop();
  } catch (e) {}
}

onMounted(() => {
  speechSupported.value = isSpeechSupported();
  micTooltip.value = speechSupported.value
    ? "按住说话，松开结束"
    : "浏览器不支持语音";
  if (!speechSupported.value) return;

  recognition = createSpeechRecognition({
    lang: "zh-CN",
    interimResults: true,
  });
  if (!recognition) return;

  recognition.onstart = () => {
    isRecording.value = true;
  };
  recognition.onend = () => {
    isRecording.value = false;
  };
  recognition.onerror = () => {
    isRecording.value = false;
  };
  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const res = event.results[i];
      if (res[0] && res[0].transcript) {
        transcript += res[0].transcript;
      }
    }
    if (transcript) {
      const sep = text.value && !text.value.endsWith(" ") ? " " : "";
      text.value = `${text.value}${sep}${transcript}`;
    }
  };
});

onBeforeUnmount(() => {
  try {
    if (recognition && isRecording.value) recognition.stop();
  } catch {}
  recognition = null;
});
</script>

<style scoped>
.composer-container {
  padding: 18px 18px 22px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.9),
    rgba(248, 250, 252, 0.9)
  );
}

.composer-card {
  --tools-width: 0px;
  width: min(100%, 1040px);
  margin: 0 auto;
  background: #fff;
  border: 1px solid rgba(229, 231, 235, 0.8);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.06);
  border-radius: 18px;
  padding: 14px 16px 10px;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 10px;
}

.tools {
  display: none;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  color: #475569;
}
.icon-btn:hover {
  background: #f3f6fb;
}

.input-area {
  display: flex;
  align-items: center;
}

.msg-input {
  width: 100%;
}

.msg-input :deep(.el-textarea__inner) {
  border: 1px solid #e5e7eb;
  padding: 10px 12px;
  min-height: 40px;
  resize: none;
  background: #f8fafc;
  font-size: 15px;
  border-radius: 12px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.msg-input :deep(.el-textarea__inner:focus) {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.35);
}

.actions {
  display: flex;
  align-items: center;
}

.shortcut-toggle {
  font-size: 12px;
  margin-right: 6px;
}

.shortcut-menu {
  display: flex;
  gap: 8px;
}

.choice-btn {
  border-color: #dbe3f3;
}

.mic-btn.recording {
  background: #fee2e2;
  color: #dc2626;
}

.mic-icon {
  width: 20px;
  height: 20px;
  display: block;
}

.input-area.recording .msg-input :deep(.el-textarea__inner) {
  border-color: #f87171;
  box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.35);
  background: #fff0f0;
}

.send-btn {
  min-width: 84px;
  height: 38px;
  border-radius: 12px;
  font-weight: 700;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.25);
}

.send-btn:disabled {
  opacity: 0.65;
  box-shadow: none;
}

.hint {
  margin-top: 6px;
  margin-left: 0;
  padding-left: 0;
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.4;
  text-align: left;
}

@media (max-width: 768px) {
  .input-row {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
  .tools {
    order: 2;
  }
  .actions {
    justify-content: flex-end;
  }
  .hint {
    margin-left: 0;
    padding-left: 0;
  }
}
</style>
