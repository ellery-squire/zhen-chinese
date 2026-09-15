<!-- app/pages/login.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref<string | null>(null);
const currentUser = ref<{ id: string; email: string } | null>(null);

// Optional: Check if the user is already logged in when the page loads
onMounted(() => {
  checkAuth();
});

async function handleLogin() {
  errorMessage.value = null;
  loading.value = true;

  try {
    const data = await $fetch<{ success: boolean; user: { id: string; email: string } }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: {
          email: email.value,
          password: password.value,
        },
      }
    );

    currentUser.value = data.user;
    password.value = '';
  } catch (err: any) {
    errorMessage.value = err.data?.statusMessage || err.message || 'Login failed.';
  } finally {
    loading.value = false;
  }
}

async function checkAuth() {
  try {
    const res = await $fetch<{ user: { id: string; email: string } | null }>('/api/auth/me');
    currentUser.value = res.user;
  } catch(err: any){
    console.error('Session check failed:', err.data?.statusMessage || err.message);
    currentUser.value = null;
  }
}

// NEW: Logout Function
async function handleLogout() {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
    currentUser.value = null; // Clear local state
  } catch (err) {
    console.error('Logout failed', err);
  }
}
</script>

<template>
  <main style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0a; color: #eee; font-family: sans-serif;">
    <div style="width: 100%; max-width: 400px; padding: 2rem; border: 1px solid #222; background: #111; border-radius: 8px;">
      
      <!-- LOGGED OUT VIEW -->
      <div v-if="!currentUser">
        <h2>Sign In</h2>
        <form @submit.prevent="handleLogin" style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
          <div>
            <label style="display: block; font-size: 0.8rem; margin-bottom: 0.25rem;">Email</label>
            <input v-model="email" type="email" required style="width: 100%; padding: 0.5rem; background: #000; border: 1px solid #333; color: #fff;" />
          </div>

          <div>
            <label style="display: block; font-size: 0.8rem; margin-bottom: 0.25rem;">Password</label>
            <input v-model="password" type="password" required style="width: 100%; padding: 0.5rem; background: #000; border: 1px solid #333; color: #fff;" />
          </div>

          <button type="submit" :disabled="loading" style="padding: 0.6rem; background: #dc2626; color: #fff; border: none; font-weight: bold; cursor: pointer;">
            {{ loading ? 'Authenticating...' : 'Sign In' }}
          </button>
        </form>
        
        <div v-if="errorMessage" style="margin-top: 1rem; color: #f87171; font-size: 0.85rem;">
          {{ errorMessage }}
        </div>
      </div>

      <!-- LOGGED IN VIEW -->
      <div v-else>
        <div style="padding: 1.5rem; background: #162a19; border: 1px solid #22c55e; border-radius: 4px; text-align: center;">
          <h2 style="margin-top: 0; color: #86efac;">Welcome Back</h2>
          <p style="margin: 0.5rem 0; font-size: 0.85rem; color: #bbf7d0;">{{ currentUser.email }}</p>
          
          <button @click="handleLogout" style="margin-top: 1.5rem; padding: 0.5rem 1rem; background: transparent; border: 1px solid #f87171; color: #f87171; font-weight: bold; cursor: pointer; border-radius: 4px;">
            Sign Out
          </button>
        </div>
      </div>

      <!-- DEBUG TOOLS -->
      <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #333; text-align: center;">
        <button type="button" @click="checkAuth" style="background: transparent; border: 1px solid #444; color: #aaa; padding: 0.3rem 0.6rem; font-size: 0.75rem; cursor: pointer;">
          Refresh Session State (/api/auth/me)
        </button>
      </div>

    </div>
  </main>
</template>