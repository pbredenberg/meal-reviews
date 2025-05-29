<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <router-link to="/" class="flex items-center">
            <span class="text-xl font-bold text-gray-800">Meal Reviews</span>
          </router-link>
        </div>

        <div class="flex items-center">
          <div v-if="isLoading" class="mr-4">
            <LoadingSpinner :size="4" />
          </div>
          
          <template v-if="isAuthenticated">
            <router-link
              to="/profile"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Profile
            </router-link>
            <button
              @click="handleLogout"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              :disabled="isLoading"
            >
              Log out
            </button>
          </template>
          
          <template v-else>
            <router-link
              to="/login"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Log in
            </router-link>
            <router-link
              to="/signup"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium ml-3"
            >
              Sign up
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

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
