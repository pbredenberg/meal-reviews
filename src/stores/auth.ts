import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  updated_at: string
}

interface ProfileUpdateData {
  username?: string
  full_name?: string
  avatar_url?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const profile = ref<Profile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  async function initialize() {
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    
    if (user.value) {
      await fetchProfile()
    }
    
    supabase.auth.onAuthStateChange(async (_event, session) => {
      user.value = session?.user ?? null
      if (user.value) {
        await fetchProfile()
      } else {
        profile.value = null
      }
    })
  }

  async function signUp(email: string, password: string) {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError
      
      user.value = data.user
      return { success: true }
    } catch (e) {
      error.value = (e as Error).message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function logIn(email: string, password: string) {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError
      
      user.value = data.user
      return { success: true }
    } catch (e) {
      error.value = (e as Error).message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function logOut() {
    try {
      loading.value = true
      error.value = null
      
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
      
      user.value = null
      return { success: true }
    } catch (e) {
      error.value = (e as Error).message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    try {
      if (!user.value?.id) return null

      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (fetchError) throw fetchError
      profile.value = data
      return { success: true }
    } catch (e) {
      error.value = (e as Error).message
      return { success: false, error: error.value }
    }
  }

  async function updateProfile(updates: ProfileUpdateData) {
    try {
      if (!user.value?.id) return { success: false, error: 'Not authenticated' }

      const { data, error: updateError } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.value.id)
        .select()
        .single()

      if (updateError) throw updateError
      profile.value = data
      return { success: true }
    } catch (e) {
      error.value = (e as Error).message
      return { success: false, error: error.value }
    }
  }

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated,
    initialize,
    signUp,
    logIn,
    logOut,
    fetchProfile,
    updateProfile
  }
})
