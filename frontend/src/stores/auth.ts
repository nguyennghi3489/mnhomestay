import { defineStore } from 'pinia'
import axios from 'axios'

interface LoginResponse {
  access_token: string
  refresh_token: string
  user: {
    id: string
    name: string
    phone: string
    role: 'OWNER' | 'STAFF'
    propertyId: string
  }
}

interface AuthState {
  token: string | null
  refreshToken: string | null
  role: 'OWNER' | 'STAFF' | null
  userId: string | null
  userName: string | null
  propertyId: string | null
}

const STORAGE_KEY = 'localstay-auth'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    refreshToken: null,
    role: null,
    userId: null,
    userName: null,
    propertyId: null,
  }),

  getters: {
    isAuthenticated: state => Boolean(state.token),
  },

  actions: {
    initializeFromStorage() {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        return
      }

      try {
        const parsed = JSON.parse(raw) as AuthState
        this.token = parsed.token
        this.refreshToken = parsed.refreshToken
        this.role = parsed.role
        this.userId = parsed.userId
        this.userName = parsed.userName
        this.propertyId = parsed.propertyId
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    },

    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          token: this.token,
          refreshToken: this.refreshToken,
          role: this.role,
          userId: this.userId,
          userName: this.userName,
          propertyId: this.propertyId,
        }),
      )
    },

    async login(phone: string, password: string) {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const { data } = await axios.post<LoginResponse>(`${apiBase}/auth/login`, {
        phone,
        password,
      })

      this.token = data.access_token
      this.refreshToken = data.refresh_token
      this.role = data.user.role
      this.userId = data.user.id
      this.userName = data.user.name
      this.propertyId = data.user.propertyId
      this.persist()
    },

    logout() {
      this.token = null
      this.refreshToken = null
      this.role = null
      this.userId = null
      this.userName = null
      this.propertyId = null
      localStorage.removeItem(STORAGE_KEY)
    },
  },
})
