<template>
  <div class="avatar-container">
    <div class="avatar-wrap">
      <img :src="avatarUrl" :alt="name" class="avatar-img" />
    </div>
    <div class="name">{{ name }}</div>
    <div class="desc">{{ desc }}</div>
  </div>
</template>

<script setup>
defineProps({
  avatarUrl: {
    type: String,
    default: `${import.meta.env.BASE_URL}xiaoyu-avatar.png`,
  },
  name: {
    type: String,
    default: "小玉",
  },
  desc: {
    type: String,
    default: "医疗助手",
  },
});
</script>

<style scoped>
.avatar-container {
  text-align: center;
  padding: 16px 12px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f4fd 100%);
  border-bottom: 1px solid var(--border-color);
}

.avatar-wrap {
  width: 120px;
  height: 120px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

.name {
  font-size: 18px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 4px;
}

.desc {
  font-size: 12px;
  color: #999;
}
</style>
