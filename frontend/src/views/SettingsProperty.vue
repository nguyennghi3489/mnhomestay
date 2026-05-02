<template>
  <v-container class="property-settings">
    <v-row>
      <v-col cols="12" md="10" lg="8">
        <v-card class="hearth-surface">
          <v-card-title>
            <div>
              <div class="eyebrow">Settings</div>
              <h1 class="hearth-title text-h4 mt-1">Property profile</h1>
              <p class="hearth-muted mb-0">Owner-only homestay configuration</p>
            </div>
          </v-card-title>

          <v-card-text class="pt-2">
            <v-text-field v-model="form.name" label="Property name" variant="outlined" density="comfortable" />
            <v-text-field v-model="form.address" label="Address" variant="outlined" density="comfortable" />
            <v-text-field v-model="form.phone" label="Phone" variant="outlined" density="comfortable" />
            <v-text-field v-model="form.zaloId" label="Zalo ID" variant="outlined" density="comfortable" />

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.checkinTime" label="Check-in time" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.checkoutTime" label="Check-out time" variant="outlined" density="comfortable" />
              </v-col>
            </v-row>

            <v-text-field
              v-model.number="form.depositPercent"
              type="number"
              min="0"
              max="100"
              label="Deposit %"
              variant="outlined"
              density="comfortable"
            />
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" :loading="saving" @click="save">Save settings</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="showSnackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, reactive, ref } from 'vue'

import { useAuthStore } from '@/stores/auth'

type PropertyProfile = {
  name: string
  address: string
  phone: string
  zaloId: string | null
  checkinTime: string
  checkoutTime: string
  depositPercent: number
}

const authStore = useAuthStore()
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const form = reactive<PropertyProfile>({
  name: '',
  address: '',
  phone: '',
  zaloId: '',
  checkinTime: '',
  checkoutTime: '',
  depositPercent: 30,
})

const saving = ref(false)
const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref<'success' | 'error'>('success')

const headers = {
  Authorization: `Bearer ${authStore.token}`,
}

const showMessage = (text: string, color: 'success' | 'error') => {
  snackbarText.value = text
  snackbarColor.value = color
  showSnackbar.value = true
}

const load = async () => {
  try {
    const { data } = await axios.get<PropertyProfile>(`${apiBase}/property`, { headers })
    form.name = data.name
    form.address = data.address
    form.phone = data.phone
    form.zaloId = data.zaloId ?? ''
    form.checkinTime = data.checkinTime
    form.checkoutTime = data.checkoutTime
    form.depositPercent = data.depositPercent
  } catch {
    showMessage('Failed to load property profile', 'error')
  }
}

const save = async () => {
  saving.value = true

  try {
    await axios.patch(
      `${apiBase}/property`,
      {
        name: form.name,
        address: form.address,
        phone: form.phone,
        zaloId: form.zaloId || null,
        checkinTime: form.checkinTime,
        checkoutTime: form.checkoutTime,
        depositPercent: Number(form.depositPercent),
      },
      { headers },
    )
    showMessage('Property settings saved', 'success')
  } catch {
    showMessage('Failed to save property settings', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await load()
})
</script>

<style scoped>
.property-settings {
  padding-top: 14px;
}
</style>
