<template>
  <v-container class="calendar-view">
    <v-card class="hearth-surface">
      <v-card-title class="d-flex flex-wrap align-center justify-space-between gap-3">
        <div>
          <div class="eyebrow">Availability</div>
          <h1 class="hearth-title text-h4 mt-1">Room calendar</h1>
          <p class="hearth-muted mb-0">{{ rangeLabel }}</p>
        </div>

        <div class="d-flex align-center gap-2">
          <v-btn icon variant="tonal" @click="goPreviousWeek">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn icon variant="tonal" @click="goNextWeek">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text>
        <div v-if="loading" class="skeleton-wrap">
          <v-skeleton-loader type="table-heading, table-row-divider@7" />
        </div>

        <template v-else>
          <v-alert
            v-if="rooms.length === 0"
            type="info"
            variant="tonal"
            text="No rooms found for this property."
          />

          <div v-else class="calendar-grid-wrap">
            <table class="calendar-grid">
              <thead>
                <tr>
                  <th class="room-col">Room</th>
                  <th
                    v-for="date in weekDates"
                    :key="dateToIso(date)"
                    class="date-col"
                  >
                    <div>{{ weekdayLabel(date) }}</div>
                    <small>{{ shortDateLabel(date) }}</small>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="room in rooms" :key="room.roomId">
                  <td class="room-col room-name">{{ room.roomName }}</td>

                  <template
                    v-for="cell in buildRowCells(room)"
                    :key="`${room.roomId}-${cell.key}`"
                  >
                    <td
                      v-if="cell.type === 'empty'"
                      class="cell-empty"
                      @click="openNewBooking(room.roomId, cell.date)"
                    />

                    <td
                      v-else
                      :colspan="cell.span"
                      class="cell-booked"
                      :class="bookingColorClass(cell.status)"
                      @click="openBooking(cell.bookingId)"
                    >
                      <div class="booking-name" :title="cell.guestName">{{ cell.guestName }}</div>
                      <small class="booking-meta">{{ statusLabel(cell.status) }}</small>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </v-card-text>
    </v-card>

    <v-btn class="fab-add" color="primary" icon="mdi-plus" size="large" @click="goToNewBooking" />

    <v-snackbar v-model="showError" color="error" timeout="3000">
      Failed to load availability
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

type SlotStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | null

type AvailabilitySlot = {
  date: string
  bookingId: string | null
  guestName: string | null
  status: SlotStatus
  checkinDate: string | null
  checkoutDate: string | null
}

type AvailabilityRoom = {
  roomId: string
  roomName: string
  slots: AvailabilitySlot[]
}

type EmptyCell = {
  type: 'empty'
  key: string
  date: string
}

type BookedCell = {
  type: 'booked'
  key: string
  bookingId: string
  guestName: string
  status: SlotStatus
  span: number
}

type RowCell = EmptyCell | BookedCell

const authStore = useAuthStore()
const router = useRouter()
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const loading = ref(false)
const showError = ref(false)
const rooms = ref<AvailabilityRoom[]>([])
const weekStart = ref(startOfUtcDay(new Date()))

const weekDates = computed(() => {
  return Array.from({ length: 7 }, (_, index) => addDaysUtc(weekStart.value, index))
})

const rangeLabel = computed(() => {
  const first = weekDates.value[0]
  const last = weekDates.value[6]
  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

  return `${formatter.format(first)} - ${formatter.format(last)}`
})

const headers = computed(() => ({
  Authorization: `Bearer ${authStore.token}`,
}))

const dateToIso = (date: Date) => {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseIsoDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

const startOfUtcDay = (date: Date) => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

const addDaysUtc = (date: Date, days: number) => {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

const weekdayLabel = (date: Date) => {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' }).format(date)
}

const shortDateLabel = (date: Date) => {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }).format(date)
}

const statusLabel = (status: SlotStatus) => {
  if (status === 'PENDING') return 'Pending'
  if (status === 'CONFIRMED') return 'Confirmed'
  if (status === 'CHECKED_IN') return 'Checked-in'
  return 'Booked'
}

const bookingColorClass = (status: SlotStatus) => {
  if (status === 'PENDING') return 'booking-pending'
  if (status === 'CONFIRMED') return 'booking-confirmed'
  if (status === 'CHECKED_IN') return 'booking-checkedin'
  return 'booking-default'
}

const loadAvailability = async () => {
  loading.value = true

  try {
    const from = dateToIso(weekDates.value[0])
    const to = dateToIso(weekDates.value[6])

    const { data } = await axios.get<AvailabilityRoom[]>(`${apiBase}/availability`, {
      params: { from, to },
      headers: headers.value,
    })

    rooms.value = data
  } catch {
    showError.value = true
  } finally {
    loading.value = false
  }
}

const buildRowCells = (room: AvailabilityRoom): RowCell[] => {
  const slotByDate = new Map(room.slots.map((slot) => [slot.date, slot]))
  const slotsForWeek = weekDates.value.map((date) => {
    return slotByDate.get(dateToIso(date)) ?? {
      date: dateToIso(date),
      bookingId: null,
      guestName: null,
      status: null,
      checkinDate: null,
      checkoutDate: null,
    }
  })

  const cells: RowCell[] = []
  let index = 0

  while (index < slotsForWeek.length) {
    const slot = slotsForWeek[index]

    if (!slot.bookingId) {
      cells.push({
        type: 'empty',
        key: slot.date,
        date: slot.date,
      })
      index += 1
      continue
    }

    const bookingId = slot.bookingId
    let span = 1

    while (index + span < slotsForWeek.length && slotsForWeek[index + span].bookingId === bookingId) {
      span += 1
    }

    cells.push({
      type: 'booked',
      key: `${slot.date}-${bookingId}`,
      bookingId,
      guestName: slot.guestName ?? 'Guest',
      status: slot.status,
      span,
    })

    index += span
  }

  return cells
}

const goPreviousWeek = async () => {
  weekStart.value = addDaysUtc(weekStart.value, -7)
  await loadAvailability()
}

const goNextWeek = async () => {
  weekStart.value = addDaysUtc(weekStart.value, 7)
  await loadAvailability()
}

const openBooking = async (bookingId: string) => {
  await router.push(`/bookings/${bookingId}`)
}

const openNewBooking = async (roomId: string, date: string) => {
  await router.push({
    path: '/bookings/new',
    query: {
      roomId,
      date,
    },
  })
}

const goToNewBooking = async () => {
  await router.push('/bookings/new')
}

onMounted(async () => {
  const now = startOfUtcDay(new Date())
  weekStart.value = parseIsoDate(dateToIso(now))
  await loadAvailability()
})
</script>

<style scoped>
.calendar-view {
  padding-top: 14px;
  padding-bottom: 90px;
}

.calendar-grid-wrap {
  overflow-x: auto;
}

.calendar-grid {
  width: 100%;
  min-width: 860px;
  border-collapse: separate;
  border-spacing: 0;
}

.calendar-grid th,
.calendar-grid td {
  border: 1px solid rgba(109, 95, 80, 0.16);
  text-align: center;
  height: 56px;
  min-width: 88px;
  background: rgba(255, 255, 255, 0.72);
}

.calendar-grid thead th {
  background: rgba(247, 241, 229, 0.9);
  font-weight: 600;
}

.room-col {
  min-width: 160px;
  position: sticky;
  left: 0;
  z-index: 2;
  background: rgba(247, 241, 229, 0.96);
}

.room-name {
  font-weight: 600;
  text-align: left;
  padding-left: 12px;
}

.cell-empty {
  background: rgba(246, 244, 240, 0.8);
  cursor: pointer;
  transition: background 0.2s ease;
}

.cell-empty:hover {
  background: rgba(223, 215, 199, 0.7);
}

.cell-booked {
  cursor: pointer;
  color: #1e1e1e;
  font-weight: 600;
  text-align: left;
  padding: 6px 10px;
}

.booking-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.booking-meta {
  opacity: 0.78;
}

.booking-pending {
  background: #f7de79;
}

.booking-confirmed {
  background: #97da98;
}

.booking-checkedin {
  background: #8ec5ff;
}

.booking-default {
  background: #d9d6d0;
}

.fab-add {
  position: fixed;
  right: 24px;
  bottom: 88px;
  z-index: 5;
}

.skeleton-wrap {
  padding-top: 6px;
}

.gap-2 {
  gap: 8px;
}

@media (max-width: 960px) {
  .calendar-grid {
    min-width: 760px;
  }

  .fab-add {
    right: 18px;
    bottom: 78px;
  }
}
</style>
