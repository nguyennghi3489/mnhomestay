<template>
  <v-container class="rooms-settings">
    <v-row>
      <v-col cols="12">
        <v-card class="hearth-surface">
          <v-card-title class="d-flex align-center justify-space-between flex-wrap gap-3">
            <div>
              <div class="eyebrow">Settings</div>
              <h1 class="hearth-title text-h4 mt-1">Room management</h1>
              <p class="hearth-muted mb-0">Owner-only room catalog and status control</p>
            </div>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateSheet">Add Room</v-btn>
          </v-card-title>

          <v-card-text>
            <v-row v-if="rooms.length" class="room-grid" dense>
              <v-col
                v-for="room in rooms"
                :key="room.id"
                cols="12"
                sm="6"
                lg="4"
              >
                <v-card class="room-card" variant="outlined" @click="openEditDialog(room)">
                  <v-card-text>
                    <div class="d-flex align-center justify-space-between gap-3">
                      <h3 class="text-h6 mb-0">{{ room.name }}</h3>
                      <v-chip :color="statusColor(room.status)" size="small" label>
                        {{ statusLabel(room.status) }}
                      </v-chip>
                    </div>
                    <p class="hearth-muted mt-2 mb-1">Type: {{ room.roomType }}</p>
                    <p class="hearth-muted mb-1">Max occupancy: {{ room.maxOccupancy }}</p>
                    <p class="mb-0"><strong>{{ formatVnd(room.baseRate) }}</strong> / night</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-alert v-else type="info" variant="tonal">
              No rooms found. Add your first room to get started.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-bottom-sheet v-model="showCreateSheet" inset>
      <v-card>
        <v-card-title>Add Room</v-card-title>
        <v-card-text class="pt-2">
          <v-text-field v-model="createForm.name" label="Room name" variant="outlined" density="comfortable" />
          <v-select
            v-model="createForm.roomType"
            :items="roomTypeOptions"
            label="Room type"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model.number="createForm.maxOccupancy"
            type="number"
            min="1"
            max="20"
            label="Max occupancy"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model.number="createForm.baseRate"
            type="number"
            min="0"
            label="Base rate / night"
            variant="outlined"
            density="comfortable"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showCreateSheet = false">Cancel</v-btn>
          <v-btn color="primary" :loading="saving" @click="createRoom">Create room</v-btn>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>

    <v-dialog v-model="showEditDialog" max-width="560">
      <v-card>
        <v-card-title>Edit Room</v-card-title>
        <v-card-text class="pt-2">
          <v-text-field v-model="editForm.name" label="Room name" variant="outlined" density="comfortable" />
          <v-select
            v-model="editForm.roomType"
            :items="roomTypeOptions"
            label="Room type"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model.number="editForm.maxOccupancy"
            type="number"
            min="1"
            max="20"
            label="Max occupancy"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model.number="editForm.baseRate"
            type="number"
            min="0"
            label="Base rate / night"
            variant="outlined"
            density="comfortable"
          />
          <v-select
            v-model="editForm.status"
            :items="statusOptions"
            item-title="label"
            item-value="value"
            label="Status"
            variant="outlined"
            density="comfortable"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" variant="text" :loading="deleting" @click="deleteRoom">Delete</v-btn>
          <v-spacer />
          <v-btn variant="text" @click="showEditDialog = false">Cancel</v-btn>
          <v-btn color="primary" :loading="saving" @click="saveRoom">Save</v-btn>
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
import { onMounted, reactive, ref } from 'vue'

import { useAuthStore } from '@/stores/auth'

type RoomStatus = 'AVAILABLE' | 'MAINTENANCE' | 'OUT_OF_ORDER' | 'OCCUPIED'

type Room = {
  id: string
  name: string
  roomType: string
  maxOccupancy: number
  baseRate: string | number
  status: RoomStatus
}

const authStore = useAuthStore()
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const headers = {
  Authorization: `Bearer ${authStore.token}`,
}

const rooms = ref<Room[]>([])
const saving = ref(false)
const deleting = ref(false)

const showCreateSheet = ref(false)
const showEditDialog = ref(false)
const selectedRoomId = ref<string | null>(null)

const createForm = reactive({
  name: '',
  roomType: 'DELUXE',
  maxOccupancy: 2,
  baseRate: 0,
})

const editForm = reactive({
  name: '',
  roomType: 'DELUXE',
  maxOccupancy: 2,
  baseRate: 0,
  status: 'AVAILABLE' as RoomStatus,
})

const roomTypeOptions = ['STANDARD', 'DELUXE', 'SUITE', 'FAMILY']

const statusOptions = [
  { label: 'Available', value: 'AVAILABLE' as RoomStatus },
  { label: 'Maintenance', value: 'MAINTENANCE' as RoomStatus },
  { label: 'Out of Order', value: 'OUT_OF_ORDER' as RoomStatus },
]

const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref<'success' | 'error' | 'warning'>('success')

const showMessage = (text: string, color: 'success' | 'error' | 'warning') => {
  snackbarText.value = text
  snackbarColor.value = color
  showSnackbar.value = true
}

const formatVnd = (amount: string | number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

const statusLabel = (status: RoomStatus) => {
  if (status === 'AVAILABLE') return 'Available'
  if (status === 'MAINTENANCE') return 'Maintenance'
  if (status === 'OUT_OF_ORDER') return 'Out of Order'
  return 'Occupied'
}

const statusColor = (status: RoomStatus) => {
  if (status === 'AVAILABLE') return 'success'
  if (status === 'MAINTENANCE') return 'error'
  if (status === 'OUT_OF_ORDER') return 'grey'
  return 'warning'
}

const loadRooms = async () => {
  try {
    const { data } = await axios.get<Room[]>(`${apiBase}/rooms`, { headers })
    rooms.value = data
  } catch {
    showMessage('Failed to load rooms', 'error')
  }
}

const openCreateSheet = () => {
  createForm.name = ''
  createForm.roomType = 'DELUXE'
  createForm.maxOccupancy = 2
  createForm.baseRate = 0
  showCreateSheet.value = true
}

const createRoom = async () => {
  if (!createForm.name) {
    showMessage('Room name is required', 'error')
    return
  }

  saving.value = true

  try {
    await axios.post(
      `${apiBase}/rooms`,
      {
        name: createForm.name,
        roomType: createForm.roomType,
        maxOccupancy: Number(createForm.maxOccupancy),
        baseRate: Number(createForm.baseRate),
      },
      { headers },
    )
    showCreateSheet.value = false
    showMessage('Room created', 'success')
    await loadRooms()
  } catch {
    showMessage('Failed to create room', 'error')
  } finally {
    saving.value = false
  }
}

const openEditDialog = (room: Room) => {
  selectedRoomId.value = room.id
  editForm.name = room.name
  editForm.roomType = room.roomType
  editForm.maxOccupancy = Number(room.maxOccupancy)
  editForm.baseRate = Number(room.baseRate)
  editForm.status = room.status
  showEditDialog.value = true
}

const saveRoom = async () => {
  if (!selectedRoomId.value) {
    return
  }

  saving.value = true

  try {
    await axios.patch(
      `${apiBase}/rooms/${selectedRoomId.value}`,
      {
        name: editForm.name,
        roomType: editForm.roomType,
        maxOccupancy: Number(editForm.maxOccupancy),
        baseRate: Number(editForm.baseRate),
      },
      { headers },
    )

    await axios.patch(
      `${apiBase}/rooms/${selectedRoomId.value}/status`,
      {
        status: editForm.status,
      },
      { headers },
    )

    showEditDialog.value = false
    showMessage('Room updated', 'success')
    await loadRooms()
  } catch {
    showMessage('Failed to update room', 'error')
  } finally {
    saving.value = false
  }
}

const deleteRoom = async () => {
  if (!selectedRoomId.value) {
    return
  }

  deleting.value = true

  try {
    await axios.delete(`${apiBase}/rooms/${selectedRoomId.value}`, { headers })
    showEditDialog.value = false
    showMessage('Room deleted', 'success')
    await loadRooms()
  } catch (error) {
    const message =
      axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : ''

    if (message.toLowerCase().includes('active bookings')) {
      showMessage('Cannot delete room with active booking', 'warning')
    } else {
      showMessage('Failed to delete room', 'error')
    }
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  await loadRooms()
})
</script>

<style scoped>
.rooms-settings {
  padding-top: 14px;
}

.room-grid :deep(.v-col) {
  display: flex;
}

.room-card {
  width: 100%;
  cursor: pointer;
}

.gap-3 {
  gap: 12px;
}
</style>
