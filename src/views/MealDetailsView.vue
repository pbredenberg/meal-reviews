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
      <LoadingSpinner :size="6" label="Loading meal details" />
    </div>

    <div v-else-if="error" class="error-alert">
      <p>{{ error }}</p>
      <button @click="loadMeal" class="btn btn-secondary btn-sm mt-4">Try Again</button>
    </div>

    <div v-else-if="meal">
      <div class="page-header slide-in">
        <RouterLink to="/" class="back-link">
          <span class="back-icon">←</span> Back to Meals
        </RouterLink>
        <div v-if="user?.id === meal.created_by" class="actions">
          <button v-if="!isEditing" @click="startEditing" class="btn btn-primary hover-lift">
            <span>Edit Meal</span>
          </button>
          <button v-if="!isEditing" @click="deleteMeal" class="btn btn-accent hover-lift">
            <span>Delete Meal</span>
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
          <div class="meal-header-modern">
            <div class="meal-image-wrapper">
              <MealImage :name="meal.name" :image-url="meal.image_url" :alt-text="meal.name" :hoverable="true" />
            </div>
            <div class="meal-rating-banner">
              <div class="rating-stars">{{ getStarRating(4) }}</div>
              <div class="rating-count">{{ reviews.length }} reviews</div>
            </div>
          </div>
          
          <div class="meal-content slide-up">
            <h1 class="meal-title">{{ meal.name }}</h1>
            <div class="meal-meta">
              <span class="meal-date">
                <span class="meta-icon">📅</span> Added on {{ formatDate(meal.created_at) }}
              </span>
            </div>
            <div class="divider"></div>
            <div class="meal-description-section">
              <h2 class="section-subtitle">Description</h2>
              <div class="meal-description-content">
                <p v-if="meal.description" class="description">{{ meal.description }}</p>
                <p v-else class="no-description">No description provided</p>
              </div>
            </div>
          </div>
        </section>
        
        <section class="reviews-section">
          <h2 class="section-title slide-in">Reviews</h2>
          
          <div class="reviews-list">
            <div v-for="(review, index) in reviews" 
                :key="review.id" 
                class="review-item stagger-item slide-up"
                :style="{ animationDelay: `${index * 0.1}s` }">
              <div class="review-header">
                <div class="review-user">
                  <img 
                    v-if="review.user.avatar" 
                    :src="review.user.avatar" 
                    :alt="review.user.name" 
                    class="user-avatar"
                  />
                  <div v-else class="user-avatar-placeholder">
                    {{ review.user.name.charAt(0) }}
                  </div>
                  <div class="user-info">
                    <span class="user-name">{{ review.user.name }}</span>
                    <span class="review-date">{{ formatDateTime(review.created_at) }}</span>
                  </div>
                </div>
                <div class="review-rating" :class="`rating-${review.rating}`">
                  <span class="stars">{{ getStarRating(review.rating) }}</span>
                </div>
              </div>
              <div class="review-content">
                <p>{{ review.comment }}</p>
              </div>
            </div>
            
            <div v-if="reviews.length === 0" class="no-reviews">
              <p>No reviews yet. Be the first to review this meal!</p>
              <button class="btn btn-primary mt-4 glow">Add a Review</button>
            </div>
          </div>
        </section>
      </div>
    </div>
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
  margin-bottom: 2.5rem;
  position: relative;
}

.back-link {
  color: var(--color-primary-300);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(124, 58, 237, 0.1);
}

.back-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.back-link:hover {
  color: var(--color-primary);
  background: rgba(124, 58, 237, 0.2);
  box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);
}

.back-link:hover .back-icon {
  transform: translateX(-4px);
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

/* Bold & Adventurous layout styles */
.section-header {
  margin-bottom: 2rem;
  position: relative;
}

.section-header h2 {
  margin: 0;
  font-size: 1.75rem;
  color: var(--color-primary-300);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.section-title {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: var(--color-primary-300);
  position: relative;
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 60px;
  height: 4px;
  background: var(--gradient-primary);
  border-radius: 2px;
}

.section-subtitle {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--color-primary-400);
  font-weight: 600;
}

.meal-section, 
.reviews-section,
.edit-form {
  margin-bottom: 3rem;
  overflow: hidden;
}

.meal-header-modern {
  position: relative;
  margin-bottom: 2rem;
}

.meal-image-wrapper {
  width: 100%;
  height: 400px;
  overflow: hidden;
  position: relative;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
}

.meal-content {
  display: flex;
  flex-direction: column;
  padding: 2rem 0;
}

.meal-rating-banner {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.7));
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.meal-image-wrapper:hover .meal-rating-banner {
  transform: translateY(0);
}

.meal-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--color-primary-300);
  font-weight: 700;
  letter-spacing: 0.5px;
  position: relative;
  display: inline-block;
}

.meal-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 80px;
  height: 3px;
  background: var(--gradient-primary);
  border-radius: 2px;
}

.meal-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  color: var(--color-text-light);
  font-size: 1rem;
}

.meal-date {
  display: flex;
  align-items: center;
  background: rgba(124, 58, 237, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-weight: 500;
}

.meta-icon {
  margin-right: 0.5rem;
}

.rating-stars {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-highlight);
  letter-spacing: 2px;
}

.rating-count {
  font-size: 1rem;
  color: white;
  opacity: 0.9;
  font-weight: 500;
}

.meal-description-section {
  margin-top: 1.5rem;
}

.meal-description-content {
  margin-top: 1rem;
  background: rgba(15, 23, 42, 0.03);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid var(--color-primary-400);
}

.description {
  color: var(--color-text);
  line-height: 1.8;
  white-space: pre-wrap;
  font-size: 1.05rem;
}

.no-description {
  color: var(--color-text-light);
  font-style: italic;
  font-size: 1.05rem;
}

/* Reviews styles */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.review-item {
  background: rgba(15, 23, 42, 0.03);
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  transition: all 0.3s ease;
  border-left: 4px solid var(--color-primary-700);
  box-shadow: var(--shadow-sm);
}

.review-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  position: relative;
}

.review-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar,
.user-avatar-placeholder {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.3);
}

.user-avatar-placeholder {
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: var(--color-primary-300);
  font-size: 1.1rem;
}

.review-date {
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-top: 0.25rem;
}

.review-rating {
  color: var(--color-accent);
  font-size: 1.25rem;
  background: rgba(236, 72, 153, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-weight: 600;
}

.rating-5 { color: var(--color-highlight); }
.rating-4 { color: var(--color-primary); }
.rating-3 { color: var(--color-secondary); }
.rating-2 { color: var(--color-accent); }
.rating-1 { color: var(--color-error); }

.stars {
  letter-spacing: 2px;
}

.review-content {
  color: var(--color-text);
  line-height: 1.7;
  font-size: 1.05rem;
}

.review-content p {
  margin: 0;
}

.no-reviews {
  color: var(--color-text-light);
  font-style: italic;
  text-align: center;
  padding: 3rem 0;
  background: rgba(15, 23, 42, 0.03);
  border-radius: 16px;
}

/* Form styles */
.edit-form {
  background: var(--gradient-card);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(124, 58, 237, 0.2);
}

.edit-form-content {
  padding: 1.5rem 0;
}

.form-group {
  margin-bottom: 2rem;
}

.form-label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--color-primary-300);
  font-size: 1rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.form-input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid var(--color-border);
  border-radius: 12px;
  font-size: 1rem;
  background-color: var(--color-input-bg);
  color: var(--color-text);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-focus-ring), var(--shadow-glow);
  transform: translateY(-2px);
}

textarea.form-input {
  resize: vertical;
  min-height: 150px;
  line-height: 1.6;
}

.form-actions {
  display: flex;
  gap: 1.25rem;
  margin-top: 3rem;
  position: relative;
}

.form-actions::before {
  content: '';
  position: absolute;
  top: -1.5rem;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--color-primary-400), transparent);
  opacity: 0.3;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 5rem;
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

@media (max-width: 768px) {
  .meal-details {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  
  .actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .meal-image-wrapper {
    height: 250px;
  }
  
  .meal-rating-banner {
    padding: 0.75rem 1rem;
  }
  
  .rating-stars {
    font-size: 1.25rem;
  }
  
  .rating-count {
    font-size: 0.875rem;
  }
  
  .review-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .review-rating {
    align-self: flex-start;
  }
  
  .meal-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}
</style>
