<template>
  <label class="base-field">
    <span v-if="label" class="field-label">{{ label }}</span>
    <div class="field-shell" :class="{ focused, disabled, invalid: Boolean(error) }">
      <span v-if="$slots.leading" class="field-icon">
        <slot name="leading" />
      </span>
      <input
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :disabled="disabled"
        @focus="focused = true"
        @blur="focused = false"
        @input="onInput"
      />
      <button
        v-if="$slots.trailing && trailingInteractive"
        type="button"
        class="field-trailing action"
        :disabled="disabled"
        @click="$emit('trailing-click')"
      >
        <slot name="trailing" />
      </button>
      <span v-else-if="$slots.trailing" class="field-trailing">
        <slot name="trailing" />
      </span>
    </div>
    <span v-if="error" class="field-help error">{{ error }}</span>
    <span v-else-if="help" class="field-help">{{ help }}</span>
  </label>
</template>

<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    type?: string
    placeholder?: string
    autocomplete?: string
    help?: string
    error?: string
    disabled?: boolean
    trailingInteractive?: boolean
  }>(),
  {
    label: undefined,
    type: 'text',
    placeholder: undefined,
    autocomplete: undefined,
    help: undefined,
    error: undefined,
    disabled: false,
    trailingInteractive: false,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'trailing-click'): void
}>()

const focused = ref(false)

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.base-field {
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

.field-shell {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  border-radius: 12px;
  border: 1px solid var(--line-2);
  background: var(--bg-raised);
  padding: 0 14px;
  box-shadow: var(--shadow-inset-top);
  transition: border-color var(--dur-2) var(--ease-settle), box-shadow var(--dur-2) var(--ease-settle);
}

.field-shell.focused {
  border-color: var(--moss);
  box-shadow: 0 0 0 3px rgba(92, 122, 82, 0.14);
}

.field-shell.invalid {
  border-color: rgba(184, 74, 46, 0.45);
}

.field-shell.disabled {
  opacity: 0.6;
}

.field-shell input {
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--fg-1);
  font-family: var(--font-body);
  font-size: var(--text-base);
}

.field-shell input::placeholder {
  color: var(--fg-3);
}

.field-icon,
.field-trailing {
  display: inline-flex;
  align-items: center;
  color: var(--fg-2);
}

.field-trailing.action {
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.field-help {
  font-size: var(--text-sm);
  line-height: var(--lh-sm);
  color: var(--fg-2);
}

.field-help.error {
  color: var(--ember);
}
</style>