<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMealsStore } from '@/stores/meals'
import { useAuthStore } from '@/stores/auth'
import type { Meal } from '@/types/database'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import MealImage from '@/components/MealImage.vue'

const route = useRoute()
const router = useRouter()
const mealsStore = useMealsStore()
const authStore = useAuthStore()

const { loading, error } = storeToRefs(mealsStore)
const { user } = storeToRefs(authStore)

const meal = ref<Meal | null>(null)
const isEditing = ref(false)
const editedName = ref('')
const editedDescription = ref('')

// Hardcoded reviews data for display purposes
interface Review {
  id: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  rating: number
  comment: string
  created_at: string
}

const reviews = ref<Review[]>([
  {
    id: '1',
    user: {
      id: '101',
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    },
    rating: 5,
    comment: 'This meal was absolutely delicious! I loved the flavors and the presentation was beautiful.',
    created_at: '2025-05-25T14:22:10Z'
  },
  {
    id: '2',
    user: {
      id: '102',
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?u=michael'
    },
    rating: 4,
    comment: 'Great meal overall. The sauce was perfect, though I would have liked a bit more spice.',
    created_at: '2025-05-23T09:15:45Z'
  },
  {
    id: '3',
    user: {
      id: '103',
      name: 'Jessica Williams',
      avatar: 'https://i.pravatar.cc/150?u=jessica'
    },
    rating: 3,
    comment: 'Decent meal but nothing extraordinary. The portion size was good though.',
    created_at: '2025-05-20T18:30:22Z'
  }
])

// Format date to a more readable format
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(date)
}

// Format date with time
function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date)
}

// Generate star rating display
function getStarRating(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

async function loadMeal() {
  loading.value = true
  error.value = null
  
  try {
    const result = await mealsStore.getMeal(route.params.id as string)
    if (result.success && result.meal) {
      meal.value = result.meal
      editedName.value = result.meal.name
      editedDescription.value = result.meal.description || ''
    } else {
      router.push('/')
    }
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}

function startEditing() {
  isEditing.value = true
}

function cancelEditing() {
  isEditing.value = false
  editedName.value = meal.value?.name || ''
  editedDescription.value = meal.value?.description || ''
}

async function saveMeal() {
  if (!editedName.value.trim() || !meal.value) return

  const result = await mealsStore.updateMeal(meal.value.id, {
    name: editedName.value.trim(),
    description: editedDescription.value.trim() || null
  })

  if (result.success && result.meal) {
    meal.value = result.meal
    isEditing.value = false
  }
}

async function deleteMeal() {
  if (!confirm('Are you sure you want to delete this meal?') || !meal.value) return

  const result = await mealsStore.deleteMeal(meal.value.id)
  if (result.success) {
    router.push('/')
  }
}

onMounted(() => {
  loadMeal()
})
</script>

<template>
  <div class="meal-details">
    <div v-if="loading" class="loading-container">
      <LoadingSpinner :size="6" />
    </div>

    <div v-else-if="error" class="error-alert">
      {{ error }}
    </div>

    <template v-else-if="meal">
      <div class="page-header">
        <RouterLink to="/" class="back-link">← Back to Meals</RouterLink>
        <div v-if="user?.id === meal.created_by" class="actions">
          <button v-if="!isEditing" @click="startEditing" class="btn btn-primary">
            Edit Meal
          </button>
          <button v-if="!isEditing" @click="deleteMeal" class="btn btn-accent">
            Delete Meal
          </button>
        </div>
      </div>

      <div v-if="isEditing" class="edit-form">
        <div class="section-header">
          <h2>Edit Meal</h2>
        </div>
        <div class="edit-form-content">
          <div class="form-group">
            <label for="name" class="form-label">Name</label>
            <input
              id="name"
              v-model="editedName"
              type="text"
              required
              placeholder="Enter meal name"
              class="form-input"
            >
          </div>

          <div class="form-group">
            <label for="description" class="form-label">Description</label>
            <textarea
              id="description"
              v-model="editedDescription"
              placeholder="Enter meal description"
              rows="4"
              class="form-input"
            ></textarea>
          </div>

          <div class="form-actions">
            <button @click="saveMeal" class="btn btn-primary">Save Changes</button>
            <button @click="cancelEditing" class="btn btn-outline">Cancel</button>
          </div>
        </div>
      </div>

      <div v-else>
        <section class="meal-section">
          <div class="meal-header">
            <div class="meal-image-container">
              <MealImage :name="meal.name" :image-url="meal.image_url" :alt-text="meal.name" />
            </div>
            <div class="meal-header-content">
              <h1 class="meal-title">{{ meal.name }}</h1>
              <div class="meal-meta">
                <span class="meal-date">Added on {{ formatDate(meal.created_at) }}</span>
                <span v-if="meal.updated_at !== meal.created_at" class="meal-date">
                  · Updated on {{ formatDate(meal.updated_at) }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="meal-description-section">
            <h2 class="section-title">About this meal</h2>
            <div class="meal-description-content">
              <p v-if="meal.description" class="description">{{ meal.description }}</p>
              <p v-else class="no-description">No description provided</p>
            </div>
          </div>
        </section>
        
        <section class="reviews-section">
          <h2 class="section-title">Reviews</h2>
          
          <div class="reviews-list">
            <div v-for="review in reviews" :key="review.id" class="review-item">
              <div class="review-header">
                <div class="review-user">
                  <img 
                    v-if="review.user.avatar" 
                    :src="review.user.avatar" 
                    :alt="review.user.name" 
                    class="user-avatar"
                  >
                  <div v-else class="user-avatar-placeholder">{{ review.user.name.charAt(0) }}</div>
                  <div class="user-info">
                    <div class="user-name">{{ review.user.name }}</div>
                    <div class="review-date">{{ formatDateTime(review.created_at) }}</div>
                  </div>
                </div>
                <div class="review-rating" :title="`${review.rating} out of 5 stars`">
                  <span class="stars">{{ getStarRating(review.rating) }}</span>
                </div>
              </div>
              <div class="review-content">
                <p>{{ review.comment }}</p>
              </div>
            </div>
            
            <div v-if="reviews.length === 0" class="no-reviews">
              <p>No reviews yet. Be the first to review this meal!</p>
            </div>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped>
.meal-details {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.back-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

.actions {
  display: flex;
  gap: 1rem;
}

.btn {
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.btn-accent {
  background-color: var(--color-accent);
  color: white;
}

.btn-accent:hover {
  background-color: var(--color-accent-dark);
}

.btn-outline {
  background-color: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-outline:hover {
  background-color: var(--color-gray-100);
}

/* New traditional layout styles */
.section-header {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75rem;
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-heading);
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.25rem;
  color: var(--color-heading);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75rem;
}

.meal-section, 
.reviews-section,
.edit-form {
  background-color: var(--color-background);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid var(--color-border);
}

.meal-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.meal-image-container {
  width: 40%;
  height: 300px;
  overflow: hidden;
  position: relative;
  border-radius: 8px;
  flex-shrink: 0;
}

.meal-header-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.meal-title {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  color: var(--color-heading);
}

.meal-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.meal-date {
  display: flex;
  align-items: center;
}

.meal-description-section {
  margin-top: 1rem;
}

.meal-description-content {
  margin-top: 1rem;
}

.description {
  color: var(--color-text);
  line-height: 1.6;
  white-space: pre-wrap;
}

.no-description {
  color: var(--color-text-light);
  font-style: italic;
}

/* Reviews styles */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-item {
  border-bottom: 1px solid var(--color-border-light);
  padding-bottom: 1.5rem;
}

.review-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.review-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar,
.user-avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-avatar-placeholder {
  background-color: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: var(--color-heading);
}

.review-date {
  font-size: 0.85rem;
  color: var(--color-text-light);
}

.review-rating {
  color: var(--color-accent);
  font-size: 1.1rem;
}

.stars {
  letter-spacing: 1px;
}

.review-content {
  color: var(--color-text);
  line-height: 1.5;
}

.no-reviews {
  color: var(--color-text-light);
  font-style: italic;
  text-align: center;
  padding: 2rem 0;
}

/* Form styles */
.edit-form-content {
  padding: 1rem 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-heading);
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  background-color: var(--color-input-bg);
  color: var(--color-text);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.error-alert {
  color: var(--color-error);
  padding: 1rem;
  border: 1px solid var(--color-error-light);
  border-radius: 8px;
  background-color: var(--color-error-bg);
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .meal-details {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .actions {
    width: 100%;
  }
  
  .btn {
    flex: 1;
    text-align: center;
  }
  
  .meal-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .meal-image-container {
    width: 100%;
    height: 200px;
  }
  
  .review-header {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .review-rating {
    align-self: flex-start;
  }
}
</style>
