<template>
  <div class="shell">
    <div class="bg-shape one"></div>
    <div class="bg-shape two"></div>
    <div class="layout">
      <aside class="sidebar">
        <Sidebar />
      </aside>
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import Sidebar from "./components/Sidebar.vue";
</script>

<style scoped>
.shell {
  position: relative;
  min-height: 100vh;
  background:
    radial-gradient(
      circle at 20% 20%,
      rgba(89, 169, 255, 0.18),
      transparent 40%
    ),
    radial-gradient(
      circle at 80% 30%,
      rgba(118, 105, 255, 0.12),
      transparent 38%
    ),
    #f6f8fb;
  overflow: hidden;
}

.bg-shape {
  position: absolute;
  filter: blur(45px);
  opacity: 0.6;
}

.bg-shape.one {
  width: 320px;
  height: 320px;
  top: -80px;
  left: -60px;
  background: linear-gradient(145deg, #7cc4ff, #a6b8ff);
}

.bg-shape.two {
  width: 360px;
  height: 360px;
  bottom: -120px;
  right: -80px;
  background: linear-gradient(155deg, #9ae6ff, #c5c7ff);
}

.layout {
  position: relative;
  display: grid;
  grid-template-columns: 260px 1fr;
  height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 18px;
  gap: 16px;
}

.sidebar {
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.92),
    rgba(255, 255, 255, 0.86)
  );
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.06);
  border-radius: 18px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.content {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.94);
  border-radius: 22px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  overflow: hidden;
}

@media (max-width: 1100px) {
  .layout {
    grid-template-columns: 100%;
    padding: 16px;
  }
  .sidebar {
    display: none;
  }
}

@media (max-width: 640px) {
  .layout {
    padding: 12px;
  }
  .content {
    border-radius: 16px;
  }
}
</style>
