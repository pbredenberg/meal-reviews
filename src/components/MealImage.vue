<template>
  <div class="meal-image-container" :class="{ 'has-image': imageUrl }">
    <img 
      v-if="imageUrl && !imageError" 
      :src="imageUrl" 
      :alt="altText"
      @error="handleImageError"
      class="meal-image"
    />
    <div v-else class="meal-placeholder">
      <span>{{ placeholderText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  imageUrl?: string | null
  altText?: string
  name: string
}

const props = defineProps<Props>()
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

.meal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.has-image:hover .meal-image {
  transform: scale(1.05);
}

.meal-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary-light);
}

.meal-placeholder span {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
}
</style>
