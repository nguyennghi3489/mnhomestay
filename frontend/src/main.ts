import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import './styles/design-tokens.css'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#2F4A3A',
          secondary: '#5C7A52',
          accent: '#A8B89A',
          error: '#B84A2E',
          info: '#7A736B',
          success: '#5C7A52',
          warning: '#D9A441',
          background: '#F5EFE3',
          surface: '#FAF6EC',
        },
      },
    },
  },
})

app.use(pinia)

const authStore = useAuthStore(pinia)
authStore.initializeFromStorage()

app.use(router)
app.use(vuetify)

app.mount('#app')
