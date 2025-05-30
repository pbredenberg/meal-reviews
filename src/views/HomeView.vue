<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMealsStore } from '@/stores/meals'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import Fuse from 'fuse.js'
import type { IFuseOptions } from 'fuse.js'
import type { Meal } from '@/types/database'

const router = useRouter()
const mealsStore = useMealsStore()
const authStore = useAuthStore()

const { meals, loading, error, sortedMeals } = storeToRefs(mealsStore)
const { isAuthenticated } = storeToRefs(authStore)

// Search query state
const searchQuery = ref<string>('')

// Fuzzy search options
const fuseOptions: IFuseOptions<Meal> = {
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
    return results.map(result => result.item)
  }
  return sortedMeals.value
})

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
  <main class="meals-container">
    <div class="meals-header">
      <h1>Meal Reviews</h1>
      <RouterLink v-if="isAuthenticated" to="/meals/new" class="add-meal-button">
        Add New Meal
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
    </div>

    <div v-else class="meals-list">
      <RouterLink
        v-for="meal in filteredMeals"
        :key="meal.id"
        :to="`/meals/${meal.id}`"
        class="meal-card"
      >
        <h2>{{ meal.name }}</h2>
        <p v-if="meal.description" class="description">{{ meal.description }}</p>
      </RouterLink>
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
  display: block;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.meal-card:hover {
  border-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
