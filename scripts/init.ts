import { createTestUser } from './create-test-user'
import { createTestMeals } from './create-test-meals'

;(async () => {
  await createTestUser()
  await createTestMeals()
})()
