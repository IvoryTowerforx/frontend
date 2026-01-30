import { createRouter, createWebHashHistory } from "vue-router";

const ChatView = () => import("../views/ChatView.vue");

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", redirect: "/chat" },
    { path: "/chat/:id?", name: "chat", component: ChatView },
  ],
});

export default router;
