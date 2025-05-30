import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Meal, MealInsert, MealUpdate } from '@/types/database'

export const useMealsStore = defineStore('meals', () => {
  const meals = ref<Meal[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const sortedMeals = computed(() => {
    return [...meals.value].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
  })

  async function fetchMeals() {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('meals')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      meals.value = data
      return { success: true }
    } catch (e) {
      error.value = (e as Error).message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function getMeal(id: string) {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('meals')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError
      return { success: true, meal: data }
    } catch (e) {
      error.value = (e as Error).message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function createMeal(meal: Omit<MealInsert, 'created_by'>) {
    loading.value = true
    error.value = null

    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        throw new Error('User not authenticated')
      }

      const { data, error: insertError } = await supabase
        .from('meals')
        .insert({
          ...meal,
          created_by: userData.user.id,
        })
        .select()
        .single()

      if (insertError) throw insertError
      meals.value.unshift(data)
      return { success: true, meal: data }
    } catch (e) {
      error.value = (e as Error).message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateMeal(id: string, updates: Partial<MealUpdate>) {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('meals')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      const index = meals.value.findIndex((meal) => meal.id === id)
      if (index !== -1) {
        meals.value[index] = data
      }

      return { success: true, meal: data }
    } catch (e) {
      error.value = (e as Error).message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function deleteMeal(id: string) {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase.from('meals').delete().eq('id', id)

      if (deleteError) throw deleteError

      meals.value = meals.value.filter((meal) => meal.id !== id)
      return { success: true }
    } catch (e) {
      error.value = (e as Error).message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    meals,
    sortedMeals,
    loading,
    error,
    fetchMeals,
    getMeal,
    createMeal,
    updateMeal,
    deleteMeal,
  }
})
