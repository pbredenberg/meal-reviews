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
    <img 
      v-else 
      :src="placeholderImageSrc" 
      :alt="`Placeholder image for ${name}`"
      class="meal-image placeholder-image"
      loading="lazy"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import placeholderImage from '@/assets/meal-placeholder.jpg'

interface Props {
  imageUrl?: string | null
  altText?: string
  name: string
  rounded?: boolean
  hoverable?: boolean
  useFallbackPlaceholder?: boolean
}

defineProps<Props>()

const imageError = ref(false)

// Path to the placeholder image
const placeholderImageSrc = placeholderImage

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
  background-color: var(--color-background-soft);
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

.placeholder-image {
  object-fit: cover;
  opacity: 0.9;
}

.is-hoverable.has-image:hover .meal-image {
  transform: scale(1.05);
}
</style>
