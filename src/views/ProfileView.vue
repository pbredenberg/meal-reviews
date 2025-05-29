<template>
  <div class="profile-container">
    <div class="profile-content">
      <div class="profile-header">
        <h2>Your Profile</h2>
      </div>

      <div v-if="loading" class="loading-container">
        <LoadingSpinner :size="6" />
      </div>

      <form v-else @submit.prevent="handleSubmit">
        <div class="form-fields">
          <div class="form-field">
            <label for="username">Username</label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              :class="{ error: errors.username }"
              @blur="validateUsername"
            />
            <p v-if="errors.username" class="error-message">
              {{ errors.username }}
            </p>
          </div>

          <div class="form-field">
            <label for="fullName">Full Name</label>
            <input
              id="fullName"
              v-model="form.fullName"
              name="fullName"
              type="text"
              :class="{ error: errors.fullName }"
            />
            <p v-if="errors.fullName" class="error-message">
              {{ errors.fullName }}
            </p>
          </div>

          <div class="form-field">
            <label for="avatarUrl">Avatar URL</label>
            <input
              id="avatarUrl"
              v-model="form.avatarUrl"
              name="avatarUrl"
              type="url"
              :class="{ error: errors.avatarUrl }"
              @blur="validateAvatarUrl"
            />
            <p v-if="errors.avatarUrl" class="error-message">
              {{ errors.avatarUrl }}
            </p>
          </div>

          <div v-if="form.avatarUrl" class="avatar-preview">
            <img :src="form.avatarUrl" alt="Avatar preview" />
            <p class="preview-note">Avatar preview</p>
          </div>
        </div>

        <div v-if="error" class="error-alert">
          {{ error }}
        </div>

        <div v-if="successMessage" class="success-alert">
          {{ successMessage }}
        </div>

        <div class="form-actions">
          <button
            type="submit"
            :disabled="saving || hasErrors"
            class="submit-button"
            :class="{ loading: saving, disabled: saving || hasErrors }"
          >
            <span v-if="saving" class="spinner-container">
              <LoadingSpinner :size="4" />
            </span>
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  min-height: 100vh;
  padding: 2rem 1rem;
}

.profile-content {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-header h2 {
  font-size: 1.875rem;
  font-weight: bold;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-field label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-field input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-field input.error {
  border-color: #dc2626;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.error-alert {
  background-color: #fee2e2;
  border: 1px solid #dc2626;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #dc2626;
}

.success-alert {
  background-color: #dcfce7;
  border: 1px solid #16a34a;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #16a34a;
}

.avatar-preview {
  text-align: center;
  margin-top: 1rem;
}

.avatar-preview img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto;
}

.preview-note {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.5rem;
}

.submit-button {
  width: 100%;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #2563eb;
  color: white;
  cursor: pointer;
  position: relative;
}

.submit-button:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.submit-button.disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.spinner-container {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const authStore = useAuthStore()

interface FormData {
  username: string
  fullName: string
  avatarUrl: string
}

interface FormErrors {
  username?: string
  fullName?: string
  avatarUrl?: string
}

const form = ref<FormData>({
  username: '',
  fullName: '',
  avatarUrl: ''
})

const errors = ref<FormErrors>({})
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const loading = ref(true)
const saving = ref(false)

const hasErrors = computed(() => Object.keys(errors.value).length > 0)

onMounted(async () => {
  if (authStore.profile) {
    form.value = {
      username: authStore.profile.username || '',
      fullName: authStore.profile.full_name || '',
      avatarUrl: authStore.profile.avatar_url || ''
    }
  }
  loading.value = false
})

function validateUsername() {
  if (!form.value.username) {
    errors.value.username = 'Username is required'
  } else if (form.value.username.length < 3) {
    errors.value.username = 'Username must be at least 3 characters'
  } else if (!/^[a-zA-Z0-9_-]+$/.test(form.value.username)) {
    errors.value.username = 'Username can only contain letters, numbers, underscores, and hyphens'
  } else {
    delete errors.value.username
  }
}

function validateAvatarUrl() {
  if (form.value.avatarUrl) {
    try {
      new URL(form.value.avatarUrl)
      delete errors.value.avatarUrl
    } catch {
      errors.value.avatarUrl = 'Please enter a valid URL'
    }
  } else {
    delete errors.value.avatarUrl
  }
}

async function handleSubmit() {
  validateUsername()
  validateAvatarUrl()
  
  if (hasErrors.value) return
  
  error.value = null
  successMessage.value = null
  saving.value = true
  
  const { success, error: updateError } = await authStore.updateProfile({
    username: form.value.username,
    full_name: form.value.fullName,
    avatar_url: form.value.avatarUrl || undefined
  })
  
  if (success) {
    successMessage.value = 'Profile updated successfully'
  } else {
    error.value = updateError || 'Failed to update profile'
  }
  
  saving.value = false
}
</script>
