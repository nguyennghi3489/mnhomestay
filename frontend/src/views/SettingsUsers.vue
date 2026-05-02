<template>
  <v-container class="users-settings">
    <v-row>
      <v-col cols="12">
        <v-card class="hearth-surface">
          <v-card-title class="d-flex align-center justify-space-between flex-wrap gap-3">
            <div>
              <div class="eyebrow">Settings</div>
              <h1 class="hearth-title text-h4 mt-1">User management</h1>
              <p class="hearth-muted mb-0">Owner-only staff access control for your property</p>
            </div>
            <v-btn color="primary" prepend-icon="mdi-account-plus" @click="openCreateDialog">
              Add Staff
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="staffUsers"
              :loading="loading"
              loading-text="Loading staff users..."
              no-data-text="No staff users found"
              item-key="id"
            >
              <template #item.createdAt="{ item }">
                {{ formatDate(item.createdAt) }}
              </template>

              <template #item.actions="{ item }">
                <v-btn
                  variant="text"
                  color="error"
                  size="small"
                  prepend-icon="mdi-trash-can-outline"
                  @click="openDeleteDialog(item)"
                >
                  Delete
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showCreateDialog" max-width="560">
      <v-card>
        <v-card-title>Add Staff</v-card-title>
        <v-card-text class="pt-2">
          <v-text-field
            v-model="createForm.name"
            label="Name"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="createForm.phone"
            label="Phone"
            variant="outlined"
            density="comfortable"
          />
          <v-select
            v-model="createForm.role"
            label="Role"
            variant="outlined"
            density="comfortable"
            :items="roleOptions"
            item-title="label"
            item-value="value"
          />
          <v-text-field
            v-model="createForm.password"
            label="Temp Password"
            variant="outlined"
            density="comfortable"
            type="password"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showCreateDialog = false">Cancel</v-btn>
          <v-btn color="primary" :loading="saving" @click="createStaff">Create staff</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDeleteDialog" max-width="420">
      <v-card>
        <v-card-title>Delete staff user</v-card-title>
        <v-card-text>
          Remove <strong>{{ selectedUser?.name }}</strong> from this property?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn color="error" :loading="deleting" @click="deleteStaff">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="showSnackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'

import { useAuthStore } from '@/stores/auth'

type UserRole = 'OWNER' | 'STAFF'

type UserRow = {
  id: string
  name: string
  phone: string
  role: UserRole
  createdAt: string
}

const authStore = useAuthStore()

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Phone', key: 'phone' },
  { title: 'Role', key: 'role' },
  { title: 'Created', key: 'createdAt' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const users = ref<UserRow[]>([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)

const showCreateDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedUser = ref<UserRow | null>(null)

const createForm = ref({
  name: '',
  phone: '',
  role: 'STAFF' as UserRole,
  password: '',
})

const roleOptions = [
  { label: 'Staff', value: 'STAFF' as UserRole },
]

const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref<'success' | 'error'>('success')

const staffUsers = computed(() => users.value.filter(user => user.role === 'STAFF'))

const authHeaders = computed(() => ({
  Authorization: `Bearer ${authStore.token}`,
}))

const showMessage = (text: string, color: 'success' | 'error') => {
  snackbarText.value = text
  snackbarColor.value = color
  showSnackbar.value = true
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-GB')
}

const loadUsers = async () => {
  loading.value = true

  try {
    const { data } = await axios.get<UserRow[]>(`${apiBase}/users`, {
      headers: authHeaders.value,
    })
    users.value = data
  } catch {
    showMessage('Failed to load users', 'error')
  } finally {
    loading.value = false
  }
}

const openCreateDialog = () => {
  createForm.value = {
    name: '',
    phone: '',
    role: 'STAFF',
    password: '',
  }
  showCreateDialog.value = true
}

const createStaff = async () => {
  if (!createForm.value.name || !createForm.value.phone || !createForm.value.password) {
    showMessage('Please fill all required fields', 'error')
    return
  }

  saving.value = true

  try {
    await axios.post(
      `${apiBase}/users`,
      {
        name: createForm.value.name,
        phone: createForm.value.phone,
        role: createForm.value.role,
        password: createForm.value.password,
      },
      {
        headers: authHeaders.value,
      },
    )

    showCreateDialog.value = false
    showMessage('Staff user created', 'success')
    await loadUsers()
  } catch {
    showMessage('Failed to create staff user', 'error')
  } finally {
    saving.value = false
  }
}

const openDeleteDialog = (user: UserRow) => {
  selectedUser.value = user
  showDeleteDialog.value = true
}

const deleteStaff = async () => {
  if (!selectedUser.value) {
    return
  }

  deleting.value = true

  try {
    await axios.delete(`${apiBase}/users/${selectedUser.value.id}`, {
      headers: authHeaders.value,
    })

    showDeleteDialog.value = false
    showMessage('Staff user deleted', 'success')
    selectedUser.value = null
    await loadUsers()
  } catch {
    showMessage('Failed to delete staff user', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  await loadUsers()
})
</script>

<style scoped>
.users-settings {
  padding-top: 14px;
}

.gap-3 {
  gap: 12px;
}
</style>
