import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import type { Database } from '../src/types/supabase'

// Load environment variables
config()

const { VITE_SUPABASE_URL: supabaseUrl, SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey } = process.env

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing required environment variables')
}

// Create Supabase admin client
const supabase = createClient<Database>(supabaseUrl, serviceRoleKey)

const TEST_USER = {
  email: 'test@testperson.com',
  password: 'password123',
}

async function createTestUser() {
  try {
    // Check if user already exists
    // First check if we can get the user by email
    const { data: existingUser, error: fetchError } = await supabase.auth.admin.listUsers()

    // Find user with matching email
    const existingTestUser = existingUser?.users.find((user) => user.email === TEST_USER.email)

    if (fetchError) {
      throw fetchError
    }

    if (existingTestUser) {
      console.log('Test user already exists')
      return
    }

    // Create new user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: TEST_USER.email,
      password: TEST_USER.password,
      email_confirm: true,
    })

    if (createError) {
      throw createError
    }

    console.log('Test user created successfully:', newUser.user.email)
  } catch (error) {
    console.error('Error creating test user:', error)
    process.exit(1)
  }
}

createTestUser()
