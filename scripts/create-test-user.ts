import { supabaseAdmin } from './lib/supabase-admin'
import { TEST_USER } from './mocks/test-user'

export async function createTestUser() {
  try {
    // Check if user already exists
    // First check if we can get the user by email
    const { data: existingUser, error: fetchError } = await supabaseAdmin.auth.admin.listUsers()

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
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
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
