<template>
  <div class="sidebar-wrap">
    <XiaoyuAvatar :avatarUrl="`${baseUrl}xiaoyu-avatar.png`" />
    <div class="header">
      <el-button type="primary" :icon="Plus" class="new-btn" @click="createNew">
        新建对话
      </el-button>
    </div>

    <el-scrollbar class="list">
      <template v-if="conversations.length">
        <el-menu
          :default-active="activeId"
          class="conv-menu"
          @select="onSelect"
        >
          <el-menu-item v-for="c in conversations" :key="c.id" :index="c.id">
            <el-icon style="margin-right: 8px"><ChatLineSquare /></el-icon>
            <span class="title">{{ c.title || "未命名对话" }}</span>
            <el-button
              link
              type="danger"
              style="margin-left: auto"
              @click.stop="remove(c.id)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </el-menu-item>
        </el-menu>
      </template>
      <template v-else>
        <div class="empty">暂无历史对话</div>
      </template>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useChatStore } from "../store/chatStore";
import { Plus, ChatLineSquare, Delete } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import XiaoyuAvatar from "./XiaoyuAvatar.vue";

const baseUrl = import.meta.env.BASE_URL;

const router = useRouter();
const chat = useChatStore();
const { conversations, activeId } = storeToRefs(chat);

function createNew() {
  const id = chat.newConversation();
  router.push({ name: "chat", params: { id } });
}
function onSelect(id) {
  chat.setActive(id);
  router.push({ name: "chat", params: { id } });
}
function remove(id) {
  chat.removeConversation(id);
}
</script>

<style scoped>
.sidebar-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px;
  box-sizing: border-box;
}
.header {
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  background: linear-gradient(180deg, #f7fbff 0%, #ffffff 100%);
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(64, 158, 255, 0.08);
}
.new-btn {
  width: 100%;
  height: 40px;
  border-radius: 24px;
  background: linear-gradient(135deg, #409eff 0%, #6bc1ff 100%);
  border: none;
  box-shadow: 0 6px 14px rgba(64, 158, 255, 0.25);
}
.list {
  flex: 1;
  padding: 4px;
}
.conv-menu {
  border-right: none;
  background: transparent;
}
.conv-menu :deep(.el-menu-item) {
  margin: 4px 4px;
  border-radius: 12px;
  height: 44px;
  line-height: 44px;
  padding: 0 12px !important;
}
.conv-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #e8f2ff, #f7fbff);
  box-shadow: inset 0 0 0 1px rgba(64, 158, 255, 0.12);
}
.conv-menu :deep(.el-menu-item:hover) {
  background: #f7f9fb;
}
.title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
  display: inline-block;
}
.empty {
  color: #999;
  text-align: center;
  padding: 32px 0;
}
</style>
