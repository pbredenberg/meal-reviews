<template>
  <nav class="navbar">
    <div class="container">
      <div class="nav-content">
        <div class="nav-brand">
          <router-link to="/">
            <span>Meal Reviews</span>
          </router-link>
        </div>

        <div class="nav-items">
          <div v-if="isLoading" class="loading">
            <LoadingSpinner :size="4" />
          </div>
          
          <template v-if="isAuthenticated">
            <router-link to="/profile" class="nav-link">
              Profile
            </router-link>
            <button
              @click="handleLogout"
              class="nav-link"
              :disabled="isLoading"
            >
              Log out
            </button>
          </template>
          
          <template v-else>
            <router-link to="/login" class="nav-link">
              Log in
            </router-link>
            <router-link to="/signup" class="nav-link signup">
              Sign up
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  border-bottom: 1px solid #e5e5e5;
}

.container {
  margin: 0 auto;
  padding: 0 1rem;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

.nav-brand span {
  font-size: 1.25rem;
  font-weight: bold;
}

.nav-items {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.loading {
  margin-right: 1rem;
}

.nav-link {
  text-decoration: none;
  padding: 0.5rem 1rem;
}

button.nav-link {
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
}

button.nav-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import LoadingSpinner from './LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated, loading: isLoading } = storeToRefs(authStore)

async function handleLogout() {
  const { success } = await authStore.logOut()
  if (success) {
    router.push('/login')
  }
}
</script>
