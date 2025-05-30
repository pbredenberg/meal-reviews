import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import type { Database } from '../../src/types/supabase'

// Load environment variables
config()

const { VITE_SUPABASE_URL: supabaseUrl, SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey } = process.env

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing required environment variables')
}

// Create Supabase admin client
export const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey)
