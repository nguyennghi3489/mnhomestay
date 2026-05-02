<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-6">
          <v-icon class="me-3">mdi-view-dashboard</v-icon>
          Dashboard
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text class="text-center">
            <v-icon size="48" color="primary">mdi-home-variant</v-icon>
            <div class="text-h4 mt-2">{{ stats.totalProperties }}</div>
            <div class="text-subtitle-1">Properties</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-text class="text-center">
            <v-icon size="48" color="success">mdi-bed</v-icon>
            <div class="text-h4 mt-2">{{ stats.availableRooms }}</div>
            <div class="text-subtitle-1">Available Rooms</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-text class="text-center">
            <v-icon size="48" color="info">mdi-calendar-check</v-icon>
            <div class="text-h4 mt-2">{{ stats.todayBookings }}</div>
            <div class="text-subtitle-1">Today's Bookings</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-text class="text-center">
            <v-icon size="48" color="warning">mdi-cash</v-icon>
            <div class="text-h4 mt-2">{{ formatCurrency(stats.monthlyRevenue) }}</div>
            <div class="text-subtitle-1">Monthly Revenue</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="me-2">mdi-chart-line</v-icon>
            Quick Actions
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  color="primary"
                  prepend-icon="mdi-plus"
                  to="/bookings"
                >
                  New Booking
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  color="success"
                  prepend-icon="mdi-account-plus"
                  to="/guests"
                >
                  Add Guest
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  color="info"
                  prepend-icon="mdi-home-plus"
                  to="/properties"
                >
                  Add Property
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  color="warning"
                  prepend-icon="mdi-chart-box"
                  variant="outlined"
                >
                  View Reports
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const stats = ref({
  totalProperties: 0,
  availableRooms: 0,
  todayBookings: 0,
  monthlyRevenue: 0,
})

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}
</script>