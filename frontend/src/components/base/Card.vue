<template>
  <section class="base-card" :class="{ raised }">
    <header v-if="$slots.header" class="card-header">
      <slot name="header" />
    </header>
    <div class="card-body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    raised?: boolean
  }>(),
  {
    raised: true,
  },
)
</script>

<style scoped>
.base-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  border-radius: 16px;
  background: var(--bg-surface);
  border: 1px solid var(--line-1);
}

.base-card.raised {
  box-shadow: var(--shadow-2);
}

.card-header,
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>