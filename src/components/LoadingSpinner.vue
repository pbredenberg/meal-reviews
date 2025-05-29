<template>
  <div
    :class="[
      'inline-block animate-spin rounded-full border-2 border-solid',
      'border-current border-r-transparent align-[-0.125em]',
      `h-${size} w-${size}`,
      className
    ]"
    role="status"
    :aria-label="label"
  >
    <span class="sr-only">{{ label }}</span>
  </div>
</template>

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
