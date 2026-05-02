<template>
  <component
    :is="tag"
    class="base-button"
    :class="[variant, size, { block, disabled }]"
    v-bind="componentProps"
  >
    <span v-if="$slots.icon" class="icon-wrap">
      <slot name="icon" />
    </span>
    <span><slot /></span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'clay'
    size?: 'sm' | 'md' | 'lg'
    block?: boolean
    disabled?: boolean
    href?: string
    to?: string
    type?: 'button' | 'submit' | 'reset'
    target?: string
    rel?: string
  }>(),
  {
    variant: 'primary',
    size: 'md',
    block: false,
    disabled: false,
    href: undefined,
    to: undefined,
    type: 'button',
    target: undefined,
    rel: undefined,
  },
)

const tag = computed(() => {
  if (props.to) {
    return RouterLink
  }

  if (props.href) {
    return 'a'
  }

  return 'button'
})

const componentProps = computed(() => {
  if (props.to) {
    return { to: props.to }
  }

  if (props.href) {
    return {
      href: props.href,
      target: props.target,
      rel: props.rel ?? (props.target === '_blank' ? 'noreferrer' : undefined),
    }
  }

  return {
    type: props.type,
    disabled: props.disabled,
  }
})
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid transparent;
  padding: 10px 18px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--dur-2) var(--ease-settle);
}

.base-button.block {
  display: flex;
  width: 100%;
}

.base-button.disabled {
  opacity: 0.45;
  pointer-events: none;
}

.base-button.primary {
  background: var(--forest);
  color: var(--linen);
  box-shadow: var(--shadow-1), var(--shadow-inset-top);
}

.base-button.primary:hover {
  background: var(--accent-hover);
}

.base-button.secondary {
  background: var(--linen);
  border-color: var(--line-2);
  color: var(--fg-1);
}

.base-button.secondary:hover {
  border-color: var(--moss);
}

.base-button.ghost {
  background: transparent;
  color: var(--moss);
}

.base-button.ghost:hover {
  background: rgba(92, 122, 82, 0.08);
}

.base-button.danger {
  background: transparent;
  border-color: rgba(184, 74, 46, 0.28);
  color: var(--ember);
}

.base-button.danger:hover {
  background: rgba(184, 74, 46, 0.06);
}

.base-button.clay {
  background: var(--clay);
  color: var(--linen);
}

.base-button.sm {
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 12.5px;
}

.base-button.lg {
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 15px;
}

.icon-wrap {
  display: inline-flex;
  align-items: center;
}
</style>