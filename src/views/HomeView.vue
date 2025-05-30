<script setup lang="ts">
import { onMounted } from 'vue'
import { useMealsStore } from '@/stores/meals'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const mealsStore = useMealsStore()
const authStore = useAuthStore()

onMounted(() => {
  mealsStore.fetchMeals()
})
</script>

<template>
  <main class="meals-container">
    <div class="meals-header">
      <h1>Meal Reviews</h1>
      <RouterLink v-if="authStore.isAuthenticated" to="/meals/new" class="add-meal-button">
        Add New Meal
      </RouterLink>
    </div>

    <div v-if="mealsStore.loading" class="loading-container">
      <LoadingSpinner :size="6" />
    </div>

    <div v-else-if="mealsStore.error" class="error-alert">
      {{ mealsStore.error }}
    </div>

    <div v-else-if="mealsStore.meals.length === 0" class="empty-state">
      <p>No meals have been added yet.</p>
    </div>

    <div v-else class="meals-list">
      <article v-for="meal in mealsStore.sortedMeals" :key="meal.id" class="meal-card">
        <h2>{{ meal.name }}</h2>
        <p v-if="meal.description">{{ meal.description }}</p>
      </article>
    </div>
  </main>
</template>

<style scoped>
.meals-container {
  padding: 2rem 1rem;
}

.meals-header {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.meals-header h1 {
  font-size: 2rem;
  margin: 0;
  font-weight: bold;
}

.add-meal-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: 1px solid #2563eb;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;
}

.add-meal-button:hover {
  background-color: #1d4ed8;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.error-alert {
  background-color: #fee2e2;
  border: 1px solid #dc2626;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #dc2626;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.meals-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.meal-card {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.meal-card h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.meal-card p {
  color: #666;
  line-height: 1.5;
}
</style>
