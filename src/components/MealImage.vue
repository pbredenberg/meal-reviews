<template>
  <div 
    class="meal-image-container" 
    :class="{ 
      'has-image': imageUrl && !imageError, 
      'is-rounded': rounded,
      'is-hoverable': hoverable
    }"
  >
    <img 
      v-if="imageUrl && !imageError" 
      :src="imageUrl" 
      :alt="altText || `Image of ${name}`"
      @error="handleImageError"
      class="meal-image"
      loading="lazy"
    />
    <div v-else class="meal-placeholder" :style="{ backgroundColor: placeholderColor }">
      <span class="placeholder-text" :style="{ fontSize: `${fontSize}rem` }">{{ placeholderText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  imageUrl?: string | null
  altText?: string
  name: string
  rounded?: boolean
  hoverable?: boolean
  placeholderColor?: string
  fontSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  rounded: false,
  hoverable: true,
  placeholderColor: 'var(--color-primary-light)',
  fontSize: 2
})

const imageError = ref(false)

const placeholderText = computed(() => {
  return props.name.charAt(0).toUpperCase()
})

function handleImageError() {
  imageError.value = true
}
</script>

<style scoped>
.meal-image-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: var(--color-primary-light);
}

.is-rounded {
  border-radius: 8px;
}

.meal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  display: block; /* Removes bottom spacing */
}

.is-hoverable.has-image:hover .meal-image {
  transform: scale(1.05);
}

.meal-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
}
</style>
