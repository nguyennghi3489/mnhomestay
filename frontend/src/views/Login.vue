<template>
  <div class="login-page hearth">
    <div class="login-shell">
      <section class="welcome-panel">
        <div class="eyebrow">Hearth Design System</div>
        <h1 class="hearth-title">A calmer control room for every stay.</h1>
        <p class="lead">
          Sign in to manage rooms, arrivals, and bookings with the new Hearth tokens already applied.
        </p>
        <div class="feature-list">
          <div class="feature-item">
            <Sparkles :size="18" />
            Cream surfaces and Forest actions across the app shell
          </div>
          <div class="feature-item">
            <Leaf :size="18" />
            Fraunces headlines paired with Inter body copy
          </div>
          <div class="feature-item">
            <ShieldCheck :size="18" />
            Protected routes backed by persisted auth state
          </div>
        </div>
      </section>

      <BaseCard class="login-card">
        <template #header>
          <div class="login-header">
            <div class="brand-chip">
              <House :size="20" />
            </div>
            <div>
              <div class="eyebrow">LocalStay Manager</div>
              <h2>Welcome back</h2>
            </div>
          </div>
        </template>

        <form class="login-form" @submit.prevent="onSubmit">
          <BaseInput
            v-model="phone"
            label="Phone"
            placeholder="0901111111"
            autocomplete="username"
            :disabled="loading"
          >
            <template #leading>
              <Phone :size="18" />
            </template>
          </BaseInput>

          <BaseInput
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            :disabled="loading"
            trailing-interactive
            @trailing-click="showPassword = !showPassword"
          >
            <template #leading>
              <LockKeyhole :size="18" />
            </template>
            <template #trailing>
              <EyeOff v-if="showPassword" :size="18" />
              <Eye v-else :size="18" />
            </template>
          </BaseInput>

          <BaseButton type="submit" variant="primary" size="lg" block :disabled="loading">
            <template #icon>
              <LogIn :size="18" />
            </template>
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </BaseButton>
        </form>
      </BaseCard>
    </div>

    <v-snackbar v-model="showError" color="error" timeout="3000">
      Invalid credentials. Please check phone/password and try again.
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, House, Leaf, LockKeyhole, LogIn, Phone, ShieldCheck, Sparkles } from 'lucide-vue-next'

import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/base/Button.vue'
import BaseCard from '@/components/base/Card.vue'
import BaseInput from '@/components/base/Input.vue'

const router = useRouter()
const authStore = useAuthStore()

const phone = ref('')
const password = ref('')
const showPassword = ref(false)
const showError = ref(false)
const loading = ref(false)

const onSubmit = async () => {
  loading.value = true
  showError.value = false

  try {
    await authStore.login(phone.value, password.value)
    await router.push('/dashboard')
  } catch {
    showError.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100%;
  padding: 32px 20px;
}

.login-shell {
  min-height: calc(100vh - 64px);
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 460px);
  gap: 24px;
  align-items: center;
  max-width: 1180px;
  margin: 0 auto;
}

.welcome-panel {
  padding: 40px;
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(217, 164, 65, 0.14), transparent 22%),
    linear-gradient(140deg, rgba(250, 246, 236, 0.92), rgba(245, 239, 227, 0.88));
  border: 1px solid var(--line-1);
  box-shadow: var(--shadow-3);
}

.welcome-panel h1 {
  max-width: 9ch;
  margin: 0 0 16px;
  font-size: clamp(2.8rem, 7vw, 4.5rem);
  line-height: 0.96;
}

.feature-list {
  display: grid;
  gap: 12px;
  margin-top: 28px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: rgba(255, 254, 251, 0.72);
  border-radius: 14px;
  color: var(--fg-1);
}

.login-card {
  padding: 28px;
  border-radius: 24px;
}

.login-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.login-header h2 {
  margin: 4px 0 0;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 1.9rem;
}

.brand-chip {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--forest), var(--moss));
  color: var(--linen);
}

.login-form {
  display: grid;
  gap: 16px;
}

@media (max-width: 920px) {
  .login-shell {
    grid-template-columns: 1fr;
  }

  .welcome-panel {
    padding: 28px;
  }
}

@media (max-width: 640px) {
  .login-page {
    padding: 20px 14px;
  }

  .welcome-panel h1 {
    max-width: none;
    font-size: 2.75rem;
  }

  .login-card {
    padding: 22px;
  }
}
</style>
