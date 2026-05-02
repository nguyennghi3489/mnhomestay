<template>
  <v-app class="hearth-app">
    <v-navigation-drawer
      v-if="showSidebar"
      app
      permanent
      width="248"
      class="side-nav"
    >
      <div class="side-brand">
        <div class="brand-mark">
          <Home :size="18" />
        </div>
        <div>
          <div class="eyebrow side-eyebrow">LocalStay</div>
          <h2 class="side-title">Manager</h2>
        </div>
      </div>

      <v-list nav density="comfortable" class="side-list">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          rounded="lg"
          :title="item.title"
        >
          <template #prepend>
            <component :is="item.icon" :size="18" class="nav-icon" />
          </template>
        </v-list-item>
      </v-list>

      <template #append>
        <div class="side-footer">
          <div class="side-user">
            <CircleUserRound :size="18" />
            <span>{{ authStore.userName || 'Signed in' }}</span>
          </div>
          <v-btn block variant="tonal" class="logout-btn" @click="logout">
            <LogOut :size="16" class="me-2" />
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar v-if="showChrome" app flat class="app-bar" height="76">
      <div class="brand-lockup" v-if="!showSidebar">
        <div class="brand-mark">
          <Home :size="18" />
        </div>
        <div>
          <div class="eyebrow brand-eyebrow">LocalStay</div>
          <h2 class="brand-title">Manager</h2>
        </div>
      </div>
      <v-spacer />
      <v-btn v-if="isDev" to="/design" variant="text" class="nav-action">
        <Palette :size="16" class="me-2" />
        Design
      </v-btn>
      <v-btn icon variant="text" class="icon-action">
        <Bell :size="18" />
      </v-btn>
      <v-btn v-if="!showSidebar" icon variant="text" class="icon-action">
        <CircleUserRound :size="18" />
      </v-btn>
    </v-app-bar>

    <v-main class="app-main">
      <router-view />
    </v-main>

    <v-footer v-if="showChrome" app class="app-footer">
      <span>&copy; {{ currentYear }} LocalStay Manager</span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bell, Building2, CalendarDays, CircleUserRound, Home, LogOut, Palette, UsersRound } from 'lucide-vue-next'

import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const currentYear = computed(() => new Date().getFullYear())
const showChrome = computed(() => route.path !== '/login')
const showSidebar = computed(() => showChrome.value && authStore.isAuthenticated)
const isDev = import.meta.env.DEV

type NavItem = {
  title: string
  to: string
  icon: unknown
}

const navItems = computed<NavItem[]>(() => {
  const items: NavItem[] = [
    { title: 'Dashboard', to: '/dashboard', icon: Home },
    { title: 'Bookings', to: '/bookings', icon: CalendarDays },
    { title: 'Guests', to: '/guests', icon: UsersRound },
    { title: 'Properties', to: '/properties', icon: Building2 },
  ]

  if (authStore.role === 'OWNER') {
    items.push({ title: 'Settings · Users', to: '/settings/users', icon: UsersRound })
  }

  return items
})

const logout = async () => {
  authStore.logout()
  await router.push('/login')
}
</script>

<style scoped>
.app-bar {
  background: rgba(250, 246, 236, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line-1);
  color: var(--fg-1);
  padding: 0 8px;
}

.side-nav {
  background: rgba(250, 246, 236, 0.96);
  border-right: 1px solid var(--line-1);
}

.side-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 18px 12px;
}

.side-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 500;
}

.side-eyebrow {
  margin-bottom: 2px;
}

.side-list {
  padding: 8px 10px;
}

.nav-icon {
  color: var(--fg-2);
}

.side-footer {
  border-top: 1px solid var(--line-1);
  padding: 14px;
  display: grid;
  gap: 10px;
}

.side-user {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--fg-2);
  font-size: 0.92rem;
}

.logout-btn {
  color: var(--fg-1);
}

.brand-lockup {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--forest), var(--moss));
  color: var(--linen);
  box-shadow: var(--shadow-2);
}

.brand-eyebrow {
  margin-bottom: 4px;
}

.brand-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 500;
}

.nav-action,
.icon-action {
  color: var(--fg-1);
}

.app-main {
  background: transparent;
}

.app-footer {
  background: transparent;
  color: var(--fg-2);
  border-top: 1px solid transparent;
}
</style>