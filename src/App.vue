<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import NavBar from './components/NavBar.vue'

// Initialize auth store
const authStore = useAuthStore()
authStore.initialize()
</script>

<template>
  <div class="app-wrapper">
    <a href="#main-content" class="skip-to-content">Skip to content</a>
    <NavBar />
    <main id="main-content" tabindex="-1">
      <div class="container">
        <RouterView />
      </div>
    </main>
    <footer class="site-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">
            <router-link to="/">Meal Reviews</router-link>
          </div>
          <div class="footer-links">
            <router-link to="/">Home</router-link>
            <router-link to="/about">About</router-link>
            <router-link to="/profile">Profile</router-link>
          </div>
          <div class="footer-copyright">
            <p>&copy; {{ new Date().getFullYear() }} Meal Reviews. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  padding: var(--space-4) 0;
}

.site-footer {
  background-color: var(--color-background-soft);
  border-top: 1px solid var(--color-border);
  padding: var(--space-6) 0;
  margin-top: var(--space-8);
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.footer-logo a {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.footer-links a {
  color: var(--color-text);
}

.footer-links a:hover {
  color: var(--color-primary);
}

.footer-copyright {
  color: var(--color-text-light);
  font-size: 0.875rem;
}

/* Responsive styles */
@media (min-width: 768px) {
  .footer-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .footer-links {
    order: 2;
  }
  
  .footer-copyright {
    order: 3;
  }
}
</style>
