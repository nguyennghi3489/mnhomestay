<template>
  <label class="base-select-field">
    <span v-if="label" class="field-label">{{ label }}</span>
    <div class="select-shell" :class="{ disabled }">
      <select :value="modelValue" :disabled="disabled" @change="onChange">
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
    <span v-if="help" class="field-help">{{ help }}</span>
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    help?: string
    disabled?: boolean
    options: Array<{ label: string; value: string }>
  }>(),
  {
    label: undefined,
    help: undefined,
    disabled: false,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.base-select-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: var(--text-sm);
  line-height: var(--lh-sm);
  font-weight: 600;
  color: var(--fg-1);
}

.select-shell {
  min-height: 52px;
  border-radius: 12px;
  border: 1px solid var(--line-2);
  background: var(--bg-raised);
  padding: 0 14px;
  display: flex;
  align-items: center;
}

.select-shell.disabled {
  opacity: 0.6;
}

.select-shell select {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--fg-1);
  font-family: var(--font-body);
  font-size: var(--text-base);
}

.field-help {
  font-size: var(--text-sm);
  line-height: var(--lh-sm);
  color: var(--fg-2);
}
</style>