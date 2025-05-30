<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMealsStore } from '@/stores/meals'
import { useAuthStore } from '@/stores/auth'
import type { Meal } from '@/types/database'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

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
      <div class="meal-header">
        <RouterLink to="/" class="back-link">← Back to Meals</RouterLink>
        <div v-if="user?.id === meal.created_by" class="actions">
          <button v-if="!isEditing" @click="startEditing" class="edit-button">
            Edit Meal
          </button>
          <button v-if="!isEditing" @click="deleteMeal" class="delete-button">
            Delete Meal
          </button>
        </div>
      </div>

      <div v-if="isEditing" class="edit-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="editedName"
            type="text"
            required
            placeholder="Enter meal name"
          >
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="editedDescription"
            placeholder="Enter meal description"
            rows="4"
          ></textarea>
        </div>

        <div class="form-actions">
          <button @click="saveMeal" class="save-button">Save Changes</button>
          <button @click="cancelEditing" class="cancel-button">Cancel</button>
        </div>
      </div>

      <div v-else class="meal-content">
        <h1>{{ meal.name }}</h1>
        <p v-if="meal.description" class="description">{{ meal.description }}</p>
        <p v-else class="no-description">No description provided</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.meal-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.back-link {
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  color: #1f2937;
}

.actions {
  display: flex;
  gap: 1rem;
}

.edit-button,
.save-button {
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
}

.edit-button:hover,
.save-button:hover {
  background-color: #1d4ed8;
}

.delete-button {
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #b91c1c;
}

.cancel-button {
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #4b5563;
}

.meal-content {
  margin-top: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.description {
  color: #4b5563;
  line-height: 1.6;
  white-space: pre-wrap;
}

.no-description {
  color: #6b7280;
  font-style: italic;
}

.edit-form {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
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
  padding: 2rem;
}

.error-alert {
  color: #dc2626;
  padding: 1rem;
  border: 1px solid #f87171;
  border-radius: 4px;
  background-color: #fee2e2;
}
</style>
