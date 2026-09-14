<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const token = route.params.token as string;

const status = ref<'pending' | 'success' | 'error'>('pending');
const message = ref('Verifying your identity...');

onMounted(async () => {

    try {
        await $fetch('/api/auth/verify', {
            method: "POST",
            body: { token }
        })
        status.value = 'success';
        message.value = "Identity confirmed. Access granted.";
    } catch (err: any) {
        status.value = "error";
        message.value = err.data?.statusMessage || 'Verification failed.';
    }
})
</script>


<template>
  <main class="verification-layout">
    <div class="terminal-box">
      <div class="status-indicator" :class="status"></div>
      <h1 class="kanji-header">联系</h1>
      <h2 class="title">{{ status === 'pending' ? 'AUTHENTICATING' : status === 'success' ? 'VERIFIED' : 'DENIED' }}</h2>
      <p class="message">{{ message }}</p>
      
      <NuxtLink v-if="status === 'success'" href="/login" class="action-btn">
        PROCEED TO LOGIN
      </NuxtLink>
    </div>
  </main>
</template>

<style scoped>
.verification-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #050505;
  color: #e5e5e5;
  font-family: ui-monospace, system-ui, sans-serif;
}

.terminal-box {
  position: relative;
  background: #0a0a0a;
  border: 1px solid #1f1f1f;
  border-top: 3px solid #1f1f1f;
  padding: 3rem 4rem;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.terminal-box::before {
  content: '';
  position: absolute;
  top: -3px;
  left: 0;
  width: 30%;
  height: 3px;
  background-color: #dc2626; /* Crimson accent */
  transition: width 0.4s ease;
}

.status-indicator {
  width: 8px;
  height: 8px;
  margin: 0 auto 1.5rem;
  background-color: #525252;
}

.status-indicator.pending { animation: pulse 1s infinite; background-color: #fbbf24; }
.status-indicator.success { background-color: #dc2626; box-shadow: 0 0 10px #dc2626; }
.status-indicator.error { background-color: #525252; }

.kanji-header {
  font-family: 'Noto Serif SC', serif;
  font-size: 3rem;
  margin: 0 0 0.5rem 0;
  color: #262626;
  text-shadow: 1px 1px 0px #111, 2px 2px 0px #000;
}

.title {
  font-size: 0.85rem;
  letter-spacing: 4px;
  font-weight: 600;
  color: #737373;
  margin-bottom: 1.5rem;
}

.message {
  font-size: 0.95rem;
  color: #a3a3a3;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.action-btn {
  display: inline-block;
  background: transparent;
  color: #e5e5e5;
  border: 1px solid #dc2626;
  padding: 0.75rem 2rem;
  font-size: 0.75rem;
  letter-spacing: 2px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #dc2626;
  color: #fff;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>