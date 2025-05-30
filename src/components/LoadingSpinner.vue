<template>
  <div
    class="spinner"
    :class="[`spinner-${color}`, { 'spinner-centered': centered }]"
    :style="{ width: `${size}rem`, height: `${size}rem`, borderWidth: `${borderWidth}px` }"
    role="status"
    :aria-label="label"
  >
    <span class="visually-hidden">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 4 | 5 | 6 | 8 | 10 | 12
  color?: 'primary' | 'secondary' | 'accent' | 'light' | 'dark'
  label?: string
  centered?: boolean
  borderWidth?: number
}

withDefaults(defineProps<Props>(), {
  size: 5,
  color: 'primary',
  label: 'Loading...',
  centered: false,
  borderWidth: 2
})
</script>

<style scoped>
.spinner {
  display: inline-block;
  border-style: solid;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

.spinner-centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.spinner-primary {
  border-color: var(--color-primary);
  border-right-color: transparent;
}

.spinner-secondary {
  border-color: var(--color-secondary);
  border-right-color: transparent;
}

.spinner-accent {
  border-color: var(--color-accent);
  border-right-color: transparent;
}

.spinner-light {
  border-color: var(--color-text-light);
  border-right-color: transparent;
}

.spinner-dark {
  border-color: var(--color-text);
  border-right-color: transparent;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
