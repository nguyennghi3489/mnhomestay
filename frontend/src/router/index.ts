import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/properties',
    name: 'Properties', 
    component: () => import('@/views/Properties.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/bookings',
    name: 'Bookings',
    component: () => import('@/views/Bookings.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/guests',
    name: 'Guests',
    component: () => import('@/views/Guests.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings/users',
    name: 'SettingsUsers',
    component: () => import('@/views/SettingsUsers.vue'),
    meta: { requiresAuth: true, requiresOwner: true },
  },
]

if (import.meta.env.DEV) {
  routes.push({
    path: '/design',
    name: 'DesignPreview',
    component: () => import('@/views/DesignPreview.vue'),
  })
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(to => {
  const authStore = useAuthStore()

  if (!authStore.token) {
    authStore.initializeFromStorage()
  }

  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login'
  }

  if (to.meta.requiresOwner && authStore.role !== 'OWNER') {
    return '/dashboard'
  }

  if (to.path === '/login' && isAuthenticated) {
    return '/dashboard'
  }

  return true
})

export default router
