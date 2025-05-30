<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMealsStore } from '@/stores/meals'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import Fuse from 'fuse.js'
import MealCard from '@/components/MealCard.vue'
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
    return results.map((result) => result.item as Meal)
  }
  return sortedMeals.value
})



// Helper function to get estimated rating based on meal data
function getEstimatedRating(meal: Meal): number {
  // In a real app, this would calculate from actual reviews
  // For now, use a simple algorithm based on the meal ID
  const idSum = meal.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return Math.max(1, Math.min(5, Math.floor(idSum % 5) + 1))
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
    <section class="section">
      <h1 class="section-title slide-in">Discover Meals</h1>

      <div class="header-actions">
        <div class="search-container" v-if="!loading && meals.length > 0">
          <input
            v-model="searchQuery"
            type="text"
            class="form-input search-input"
            placeholder="Search meals..."
            aria-label="Search meals"
          />
        </div>

        <RouterLink v-if="isAuthenticated" to="/meals/new" class="btn btn-primary glow">
          <span>Add New Meal</span>
        </RouterLink>
      </div>

      <div v-if="loading" class="loading-container">
        <LoadingSpinner :size="6" label="Loading meals" />
      </div>

      <div v-else-if="error" class="error-alert">
        <p>{{ error }}</p>
        <button @click="loadMeals" class="btn btn-secondary btn-sm mt-4">Try Again</button>
      </div>

      <div v-else-if="meals.length === 0" class="empty-state">
        <p>No meals have been added yet.</p>
        <RouterLink v-if="isAuthenticated" to="/meals/new" class="btn btn-primary mt-4">
          Add Your First Meal
        </RouterLink>
      </div>

      <div v-else class="grid">
        <MealCard
          v-for="meal in filteredMeals"
          :key="meal.id"
          class="stagger-item slide-up"
          :meal="{
            id: meal.id,
            name: meal.name,
            description: meal.description ?? 'No description available',
            rating: getEstimatedRating(meal),
            imageUrl: meal.image_url ?? undefined
          }"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  position: relative;
}

.search-container {
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-input {
  padding-left: 2.5rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a78bfa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 0.75rem center;
  background-size: 1.25rem;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: var(--space-12);
}

.error-alert {
  background: linear-gradient(to right, rgba(236, 72, 153, 0.05), rgba(236, 72, 153, 0.1));
  border-left: 4px solid var(--color-accent);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  margin-bottom: var(--space-8);
  color: var(--color-accent);
  text-align: center;
  box-shadow: var(--shadow-md);
}

.empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-8);
  color: var(--color-text-light);
  background: linear-gradient(to bottom, var(--color-background-soft), var(--color-background));
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-inner);
  position: relative;
  overflow: hidden;
}

.empty-state::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(124, 58, 237, 0.1), transparent 70%);
  pointer-events: none;
}

.empty-state p {
  font-size: 1.25rem;
  margin-bottom: var(--space-6);
  font-weight: 500;
}

.btn-glow {
  animation: glow 3s infinite alternate;
}

@keyframes glow {
  0% {
    box-shadow: 0 0 5px rgba(124, 58, 237, 0.5);
  }
  100% {
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.8);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .search-container {
    max-width: 100%;
    margin-bottom: var(--space-4);
  }
}
</style>
