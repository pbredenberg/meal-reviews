/**
 * This file contains convenience types for the auto-generated types in:
 * src/types/supabase.ts
 */

import { type Database } from './supabase'

export type User = Database['public']['Tables']['user_profiles']['Row']
export type Meal = Database['public']['Tables']['meals']['Row']
export type MealInsert = Database['public']['Tables']['meals']['Insert']
export type MealUpdate = Database['public']['Tables']['meals']['Update']
