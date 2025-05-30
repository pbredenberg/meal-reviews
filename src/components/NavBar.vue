<template>
  <nav class="navbar">
    <div class="container">
      <div class="nav-content">
        <div class="nav-brand">
          <router-link to="/">
            <span>Meal Reviews</span>
          </router-link>
        </div>
        
        <!-- Mobile menu button -->
        <button 
          class="mobile-menu-button" 
          @click="mobileMenuOpen = !mobileMenuOpen"
          aria-label="Toggle menu"
        >
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>

        <div class="nav-items" :class="{ 'mobile-open': mobileMenuOpen }">
          <div v-if="isLoading" class="loading">
            <LoadingSpinner :size="4" />
          </div>
          
          <router-link to="/" class="nav-link" @click="closeMobileMenu">
            Home
          </router-link>
          
          <template v-if="isAuthenticated">
            <router-link to="/profile" class="nav-link" @click="closeMobileMenu">
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
            <router-link to="/login" class="nav-link" @click="closeMobileMenu">
              Log in
            </router-link>
            <router-link to="/signup" class="nav-link signup" @click="closeMobileMenu">
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
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

.nav-brand a {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.nav-brand span {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-heading);
  transition: color 0.3s ease;
}

.nav-items {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.loading {
  margin-right: var(--space-2);
}

.nav-link {
  text-decoration: none;
  padding: var(--space-2) var(--space-3);
  color: var(--color-text);
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.nav-link.router-link-active {
  color: var(--color-primary);
  font-weight: 600;
}

.signup {
  background-color: var(--color-primary);
  color: white !important;
}

.signup:hover {
  background-color: var(--color-primary-hover);
  color: white !important;
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

/* Mobile menu button */
.mobile-menu-button {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
}

.bar {
  height: 3px;
  width: 100%;
  background-color: var(--color-text);
  border-radius: var(--radius-full);
  transition: all 0.3s ease;
}

/* Responsive styles */
@media (max-width: 768px) {
  .mobile-menu-button {
    display: flex;
  }
  
  .nav-items {
    position: fixed;
    top: 0;
    right: -100%;
    width: 70%;
    height: 100vh;
    flex-direction: column;
    align-items: flex-start;
    padding: 5rem var(--space-6) var(--space-6);
    background-color: var(--color-background);
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease;
    z-index: 5;
  }
  
  .nav-items.mobile-open {
    right: 0;
  }
  
  .nav-link {
    width: 100%;
    padding: var(--space-3) 0;
  }
}
</style>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated, loading: isLoading } = storeToRefs(authStore)

// Mobile menu state
const mobileMenuOpen = ref(false)

// Close mobile menu
function closeMobileMenu() {
  mobileMenuOpen.value = false
}

async function handleLogout() {
  const { success } = await authStore.logOut()
  if (success) {
    router.push('/login')
    closeMobileMenu()
  }
}
</script>
