<template>
  <span class="base-badge" :class="variant">
    <span v-if="dot" class="dot" />
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'confirmed' | 'arriving' | 'neutral' | 'danger'
    dot?: boolean
  }>(),
  {
    variant: 'confirmed',
    dot: true,
  },
)
</script>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
}

.base-badge.confirmed {
  background: #e5ebdf;
  color: var(--forest);
}

.base-badge.arriving {
  background: #f2d9cb;
  color: #7a3a22;
}

.base-badge.neutral {
  background: rgba(58, 46, 38, 0.08);
  color: var(--fg-1);
}

.base-badge.danger {
  background: rgba(184, 74, 46, 0.12);
  color: var(--ember);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: currentColor;
}
</style>