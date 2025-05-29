<template>
  <div
    class="spinner"
    :style="{ width: `${size}rem`, height: `${size}rem` }"
    role="status"
    :aria-label="label"
  >
    <span class="visually-hidden">{{ label }}</span>
  </div>
</template>

<style scoped>
.spinner {
  display: inline-block;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
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

<script setup lang="ts">
interface Props {
  size?: 4 | 5 | 6 | 8 | 10 | 12
  className?: string
  label?: string
}

withDefaults(defineProps<Props>(), {
  size: 5,
  className: 'text-blue-600',
  label: 'Loading...'
})
</script>
