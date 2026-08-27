<!-- app/app.vue -->
<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref<string | null>(null);
const result = ref<Record<string, any> | null>(null);

async function handleRegister() {
    errorMessage.value = null;
    result.value = null;
    loading.value = true;

    try {
        const data = await $fetch<Record<string, any>>('/api/auth/register', {
            method: 'POST',
            body: {
                email: email.value,
                password: password.value,
            },
        });

        result.value = data;
        password.value = '';
    } catch (err: any) {
        errorMessage.value = err.data?.statusMessage || err.message || 'Registration failed.';
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <main class="auth-wrapper">
        <div class="card">
            <header>
                <h2>Register Account</h2>
                <p>Test the serverless D1 registration workflow.</p>
            </header>

            <form @submit.prevent="handleRegister">
                <div class="field">
                    <label for="email">Email Address</label>
                    <input id="email" v-model="email" type="email" placeholder="user@example.com" required
                        :disabled="loading" />
                </div>

                <div class="field">
                    <label for="password">Password (min 8 chars)</label>
                    <input id="password" v-model="password" type="password" placeholder="••••••••" required
                        minlength="8" :disabled="loading" />
                </div>

                <button type="submit" :disabled="loading">
                    <span v-if="loading">Processing...</span>
                    <span v-else>Create Account</span>
                </button>
            </form>

            <!-- Error State -->
            <div v-if="errorMessage" class="feedback error">
                <strong>Error:</strong> {{ errorMessage }}
            </div>

            <!-- Success / Payload Inspection -->
            <div v-if="result" class="feedback success">
                <strong>Registration Complete!</strong>
                <pre>{{ JSON.stringify(result, null, 2) }}</pre>
            </div>
        </div>
    </main>
</template>

<style scoped>
.auth-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #0f1117;
    color: #e2e8f0;
    font-family: system-ui, -apple-system, sans-serif;
    padding: 1.5rem;
}

.card {
    width: 100%;
    max-width: 440px;
    background: #181b26;
    border: 1px solid #282d3f;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}

header h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    color: #f8fafc;
}

header p {
    margin: 0 0 1.5rem 0;
    font-size: 0.875rem;
    color: #94a3b8;
}

.field {
    margin-bottom: 1.25rem;
}

label {
    display: block;
    font-size: 0.8rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: #cbd5e1;
}

input {
    width: 100%;
    padding: 0.75rem;
    background: #0f1117;
    border: 1px solid #334155;
    border-radius: 6px;
    color: #f8fafc;
    font-size: 0.95rem;
    box-sizing: border-box;
}

input:focus {
    outline: none;
    border-color: #6366f1;
}

button {
    width: 100%;
    padding: 0.75rem;
    background-color: #6366f1;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.feedback {
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
}

.feedback.error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid #ef4444;
    color: #fca5a5;
}

.feedback.success {
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid #22c55e;
    color: #86efac;
}

pre {
    margin-top: 0.5rem;
    background: #0b0d13;
    padding: 0.75rem;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.8rem;
    color: #f1f5f9;
}
</style>