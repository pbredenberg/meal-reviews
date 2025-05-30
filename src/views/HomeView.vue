<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMealsStore } from '@/stores/meals'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import Fuse from 'fuse.js'
import MealImage from '@/components/MealImage.vue'
import type { Meal } from '@/types/database'

const router = useRouter()
const mealsStore = useMealsStore()
const authStore = useAuthStore()

const { meals, loading, error, sortedMeals } = storeToRefs(mealsStore)
const { isAuthenticated } = storeToRefs(authStore)

// Search query state
const searchQuery = ref<string>('')

// Fuzzy search options
const fuseOptions = {
  keys: ['name', 'description'],
  threshold: 0.4,
  ignoreLocation: true,
}

// Computed: filtered meals using Fuse.js or all meals if query is empty
type FilteredMealList = Meal[]
const filteredMeals = computed<FilteredMealList>(() => {
  if (searchQuery.value.trim() !== '') {
    const fuse = new Fuse(meals.value, fuseOptions)
    const results = fuse.search(searchQuery.value.trim())
    return results.map((result: { item: Meal }) => result.item)
  }
  return sortedMeals.value
})

// Format date to a more readable format
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

// Determine if a meal is popular (for now, just the first 3 meals)
function isPopular(meal: Meal): boolean {
  // In a real app, this would be based on review count or rating
  // For now, just mark the first 3 meals as popular
  const index = meals.value.findIndex(m => m.id === meal.id)
  return index < 3
}
async function loadMeals() {
  const result = await mealsStore.fetchMeals()
  if (!result.success) {
    console.error('Failed to load meals:', result.error)
  }
}

onMounted(() => {
  loadMeals()
})

// Reload meals when navigating back to this route
router.afterEach((to) => {
  if (to.name === 'home') {
    loadMeals()
  }
})
</script>

<template>
  <main>
    <div class="page-header">
      <h1>Discover Meals</h1>
      <RouterLink v-if="isAuthenticated" to="/meals/new" class="btn btn-primary">
        <span>Add New Meal</span>
      </RouterLink>
    </div>

    <div class="search-bar-container">
      <input
        v-model="searchQuery"
        class="search-bar"
        type="text"
        placeholder="Search meals..."
        aria-label="Search meals"
      />
    </div>

    <div v-if="loading" class="loading-container">
      <LoadingSpinner :size="6" />
    </div>

    <div v-else-if="error" class="error-alert">
      {{ error }}
    </div>

    <div v-else-if="meals.length === 0" class="empty-state">
      <p>No meals have been added yet.</p>
      <RouterLink v-if="isAuthenticated" to="/meals/new" class="btn btn-primary mt-4">
        Add Your First Meal
      </RouterLink>
    </div>

    <div v-else class="grid">
      <RouterLink
        v-for="meal in filteredMeals"
        :key="meal.id"
        :to="`/meals/${meal.id}`"
        class="card meal-card"
      >
        <div class="meal-card-image">
          <MealImage :name="meal.name" :image-url="meal.image_url" :alt-text="meal.name" />
        </div>
        <div class="card-body">
          <h2 class="meal-title">{{ meal.name }}</h2>
          <p v-if="meal.description" class="meal-description">{{ meal.description }}</p>
          <div class="meal-meta">
            <span class="meal-date">{{ formatDate(meal.created_at) }}</span>
            <span class="meal-badge" v-if="isPopular(meal)">
              Popular
            </span>
          </div>
        </div>
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
.page-header {
  margin-bottom: var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.page-header h1 {
  margin: 0;
  color: var(--color-heading);
  font-weight: bold;
}

.search-bar-container {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.search-bar {
  width: 100%;
  max-width: 400px;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  transition: border 0.2s;
}

.search-bar:focus {
  outline: none;
  border-color: #2563eb;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: var(--space-8);
}

.error-alert {
  background-color: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.5);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  color: rgb(220, 38, 38);
}

.empty-state {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-text-light);
  background-color: var(--color-background-soft);
  border-radius: var(--radius-lg);
}

/* Meal Card Styling */
.meal-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: var(--color-text);
  overflow: hidden;
}

.meal-card-image {
  height: 160px;
  overflow: hidden;
  border-top-left-radius: var(--radius-lg);
  border-top-right-radius: var(--radius-lg);
}

.meal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--space-2);
  color: var(--color-heading);
}

.meal-description {
  color: var(--color-text);
  line-height: 1.5;
  margin-bottom: var(--space-3);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meal-meta {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
}

.meal-date {
  color: var(--color-text-light);
}

.meal-badge {
  background-color: var(--color-accent-light);
  color: var(--color-accent);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-weight: 500;
  font-size: 0.75rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .meal-card-image {
    height: 120px;
  }
}
</style>
