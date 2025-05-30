<template>
  <div class="meal-card card card-animated" :class="{ 'card-highlight': meal.rating >= 4 }">
    <div class="meal-card-image">
      <MealImage :name="meal.name" :image-url="meal.imageUrl" :alt-text="meal.name" />
      <div class="meal-card-rating">
        <span class="rating-value">{{ meal.rating }}</span>
        <span class="rating-max">/5</span>
      </div>
    </div>
    
    <div class="card-body">
      <h3 class="meal-card-title">{{ meal.name }}</h3>

      <p class="meal-card-description">{{ truncateDescription(meal.description) }}</p>
    </div>
    
    <div class="card-footer">
      <RouterLink :to="`/meals/${meal.id}`" class="btn btn-primary btn-sm">
        View Details
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import MealImage from './MealImage.vue';

interface MealCardProps {
  meal: {
    id: string;
    name: string;
    description: string;
    rating: number;
    imageUrl?: string;
  }
}

defineProps<MealCardProps>();

const truncateDescription = (text: string): string => {
  if (text.length <= 100) return text;
  return text.substring(0, 100) + '...';
};
</script>

<style scoped>
.meal-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.meal-card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.meal-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.meal-card:hover .meal-card-image img {
  transform: scale(1.05);
}

.meal-card-rating {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--gradient-primary);
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.rating-value {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
}

.rating-max {
  font-size: 0.75rem;
  opacity: 0.8;
}

.meal-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--color-primary-300);
}

.meal-card-restaurant {
  font-size: 0.875rem;
  color: var(--color-accent);
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.meal-card-description {
  color: var(--color-text);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 0;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
}

/* High rating highlight effect */
.card-highlight .meal-card-rating {
  background: var(--gradient-accent);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(236, 72, 153, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(236, 72, 153, 0);
  }
}
</style>
