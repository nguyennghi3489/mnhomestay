<template>
  <div class="design-preview hearth-page hearth">
    <section class="hero hearth-surface">
      <div>
        <div class="eyebrow">Design System</div>
        <h1 class="hearth-title">Hearth for LocalStay</h1>
        <p class="lead">
          Tokenized surfaces, warm typography, and reusable Vue primitives for every manager-facing screen.
        </p>
      </div>
      <BaseButton to="/dashboard" variant="secondary">Back to dashboard</BaseButton>
    </section>

    <section class="tokens-grid">
      <article v-for="token in tokens" :key="token.name" class="token-card hearth-surface">
        <span class="swatch" :style="{ background: token.value }" />
        <div>
          <div class="token-name">{{ token.name }}</div>
          <div class="token-value mono">{{ token.value }}</div>
        </div>
      </article>
    </section>

    <section class="section-grid">
      <BaseCard>
        <template #header>
          <div>
            <div class="eyebrow">Buttons</div>
            <h3>Action styles</h3>
          </div>
        </template>
        <div class="button-row">
          <BaseButton variant="primary">Add booking</BaseButton>
          <BaseButton variant="secondary">Save draft</BaseButton>
          <BaseButton variant="ghost">Cancel</BaseButton>
          <BaseButton variant="clay">Check in guest</BaseButton>
          <BaseButton variant="danger">Delete</BaseButton>
        </div>
      </BaseCard>

      <BaseCard>
        <template #header>
          <div>
            <div class="eyebrow">Badges</div>
            <h3>Status markers</h3>
          </div>
        </template>
        <div class="badge-row">
          <BaseBadge>Confirmed</BaseBadge>
          <BaseBadge variant="arriving">Arriving · 4:00 PM</BaseBadge>
          <BaseBadge variant="neutral">Draft</BaseBadge>
          <BaseBadge variant="danger">Attention</BaseBadge>
        </div>
      </BaseCard>
    </section>

    <section class="section-grid">
      <BaseCard>
        <template #header>
          <div>
            <div class="eyebrow">Fields</div>
            <h3>Input language</h3>
          </div>
        </template>
        <BaseInput v-model="guestName" label="Guest name" placeholder="Ananya Rao" help="Used on confirmations and invoices" />
        <BaseSelect
          v-model="roomType"
          label="Room type"
          :options="roomOptions"
          help="Design system wrapper around the app's selects"
        />
      </BaseCard>

      <BaseCard>
        <template #header>
          <div>
            <div class="eyebrow">Cards</div>
            <h3>Booking summary</h3>
          </div>
          <BaseBadge>Confirmed</BaseBadge>
        </template>
        <div class="booking-row">
          <div class="avatar">AR</div>
          <div>
            <div class="guest-name">Aanya Rao</div>
            <div class="hearth-muted">Garden Suite · 3 nights</div>
          </div>
        </div>
        <div class="booking-stat">
          <span>Total</span>
          <strong class="mono">VND 3,600,000</strong>
        </div>
      </BaseCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import BaseBadge from '@/components/base/Badge.vue'
import BaseButton from '@/components/base/Button.vue'
import BaseCard from '@/components/base/Card.vue'
import BaseInput from '@/components/base/Input.vue'
import BaseSelect from '@/components/base/Select.vue'

const guestName = ref('')
const roomType = ref('suite')

const tokens = [
  { name: 'Forest', value: '#2F4A3A' },
  { name: 'Moss', value: '#5C7A52' },
  { name: 'Ember', value: '#B84A2E' },
  { name: 'Honey', value: '#D9A441' },
  { name: 'Cream', value: '#F5EFE3' },
  { name: 'Linen', value: '#FAF6EC' },
]

const roomOptions = [
  { label: 'Garden Suite', value: 'suite' },
  { label: 'Loft', value: 'loft' },
  { label: 'Family Villa', value: 'villa' },
]
</script>

<style scoped>
.design-preview {
  display: grid;
  gap: 24px;
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 28px;
  border-radius: 24px;
}

.tokens-grid,
.section-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.token-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: 18px;
}

.swatch {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  box-shadow: inset 0 0 0 1px rgba(58, 46, 38, 0.08);
}

.token-name {
  font-weight: 600;
}

.token-value {
  color: var(--fg-2);
}

.button-row,
.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.booking-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--sage), var(--moss));
  color: var(--linen);
  font-family: var(--font-display);
  font-weight: 600;
}

.guest-name {
  font-weight: 600;
}

.booking-stat {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid var(--line-1);
  padding-top: 12px;
  color: var(--fg-2);
}

@media (max-width: 720px) {
  .hero {
    flex-direction: column;
  }
}
</style>