<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-header">
        <h2>Sign in to your account</h2>
        <p>
          Or
          <router-link to="/signup">create a new account</router-link>
        </p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-fields">
          <div class="form-field">
            <label for="email" class="visually-hidden">Email address</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              :class="{ error: errors.email }"
              placeholder="Email address"
              @blur="validateEmail"
            />
            <p v-if="errors.email" class="error-message">
              {{ errors.email }}
            </p>
          </div>

          <div class="form-field">
            <label for="password" class="visually-hidden">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              :class="{ error: errors.password }"
              placeholder="Password"
              @blur="validatePassword"
            />
            <p v-if="errors.password" class="error-message">
              {{ errors.password }}
            </p>
          </div>
        </div>

        <div v-if="error" class="error-alert">
          {{ error }}
        </div>

        <div class="form-actions">
          <button
            type="submit"
            :disabled="loading || hasErrors"
            class="submit-button"
            :class="{ loading: loading, disabled: loading || hasErrors }"
          >
            <span v-if="loading" class="spinner-container">
              <LoadingSpinner :size="4" />
            </span>
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.login-content {
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h2 {
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
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

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

const form = ref<FormData>({
  email: '',
  password: ''
})

const errors = ref<FormErrors>({})
const error = ref<string | null>(null)
const loading = ref(false)

const hasErrors = computed(() => {
  return Object.keys(errors.value).length > 0 || 
    !form.value.email || 
    !form.value.password
})

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email) {
    errors.value.email = 'Email is required'
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  } else {
    delete errors.value.email
  }
}

function validatePassword() {
  if (!form.value.password) {
    errors.value.password = 'Password is required'
  } else {
    delete errors.value.password
  }
}

async function handleSubmit() {
  validateEmail()
  validatePassword()
  
  if (hasErrors.value) return
  
  error.value = null
  loading.value = true
  
  const { success, error: loginError } = await authStore.logIn(
    form.value.email,
    form.value.password
  )
  
  if (success) {
    router.push('/profile')
  } else {
    error.value = loginError || 'Invalid email or password'
  }
  
  loading.value = false
}
</script>
