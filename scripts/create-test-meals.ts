import { supabaseAdmin } from './lib/supabase-admin'
import { TEST_USER } from './mocks/test-user'
import { TEST_MEALS } from './mocks/test-meals'

export async function createTestMeals() {
  try {
    // First, get the test user's ID
    const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers()

    if (userError) {
      throw userError
    }

    const testUser = users.users.find((user) => user.email === TEST_USER.email)

    if (!testUser) {
      throw new Error('Test user not found. Please run create-test-user.ts first')
    }

    // Create meals for the test user
    for (const meal of TEST_MEALS) {
      const { error: insertError } = await supabaseAdmin.from('meals').insert({
        ...meal,
        created_by: testUser.id,
      })

      if (insertError) {
        throw insertError
      }
    }

    console.log(`Successfully created ${TEST_MEALS.length} test meals for user: ${testUser.email}`)
  } catch (error) {
    console.error('Error creating test meals:', error)
    process.exit(1)
  }
}
