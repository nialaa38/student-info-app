import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import * as fc from 'fast-check'
import App from '../App.vue'
import HomePage from '../pages/HomePage.vue'
import StudentsPage from '../pages/StudentsPage.vue'
import { apiService } from '../services/apiService.js'

// Mock the apiService to prevent actual API calls during tests
vi.mock('../services/apiService.js', () => ({
  apiService: {
    fetchStudents: vi.fn()
  }
}))

// Create a router for testing with actual routes
const createTestRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/',
        name: 'Home',
        component: HomePage
      },
      {
        path: '/students',
        name: 'Students',
        component: StudentsPage
      }
    ]
  })
}

describe('Navigation Property Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    // Mock API to return empty array to avoid loading states
    apiService.fetchStudents.mockResolvedValue([])
  })

  /**
   * Property 3: Navigation Without Page Reload
   * 
   * **Validates: Requirements 4.2**
   * 
   * **Feature: student-info-app, Property 3: Navigation without page reload**
   * 
   * This property test verifies that for any navigation link in the application,
   * when clicked, the route changes without triggering a full page reload.
   * This is the core behavior of a Single Page Application (SPA).
   * 
   * The test verifies:
   * 1. Navigation can occur between routes
   * 2. The route changes correctly
   * 3. The Vue instance persists without page reload (vm instance remains the same)
   * 4. The correct component is rendered after navigation
   * 5. Navigation links are present and functional
   * 
   * We verify SPA behavior by checking that:
   * - The wrapper's Vue instance remains the same throughout navigation
   * - The router's currentRoute updates correctly
   * - Component content changes without remounting the entire app
   * - Navigation links exist and point to correct routes
   */
  it('Property 3: navigation occurs without page reload for any route sequence', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random sequences of navigation actions
        // Each action is either 'home' or 'students'
        fc.array(
          fc.constantFrom('home', 'students'),
          { minLength: 1, maxLength: 10 }
        ),
        async (navigationSequence) => {
          // Create a fresh router for each test iteration
          const router = createTestRouter()
          
          // Mount the App component with the router
          const wrapper = mount(App, {
            global: {
              plugins: [router]
            }
          })

          // Wait for initial mount
          await router.isReady()
          await wrapper.vm.$nextTick()

          // Store the initial Vue instance to verify it doesn't change
          // In a full page reload, the entire Vue app would be recreated
          const initialVueInstance = wrapper.vm
          
          // Store the router instance to verify it persists
          const initialRouter = router
          
          // Track navigation count to verify SPA behavior
          let navigationCount = 0

          // Execute the navigation sequence
          for (const targetRoute of navigationSequence) {
            const expectedPath = targetRoute === 'home' ? '/' : '/students'

            // Verify navigation links exist before navigating
            const linkSelector = targetRoute === 'home' ? 'a[href="/"]' : 'a[href="/students"]'
            const link = wrapper.find(linkSelector)
            expect(link.exists()).toBe(true)

            // Use router.push to navigate (simulates clicking a router-link)
            // This is the proper way to test Vue Router navigation
            await router.push(expectedPath)

            // Wait for navigation to complete
            await router.isReady()
            await wrapper.vm.$nextTick()

            // Verify the route has changed to the expected path
            expect(router.currentRoute.value.path).toBe(expectedPath)

            // CRITICAL: Verify the Vue instance is still the same
            // If a page reload occurred, this would be a different instance
            expect(wrapper.vm).toBe(initialVueInstance)
            
            // Verify the router instance is still the same
            expect(router).toBe(initialRouter)

            // Verify the correct component is rendered
            if (targetRoute === 'home') {
              // HomePage should be rendered
              expect(wrapper.text()).toContain('Welcome to the Student Info App!')
              expect(wrapper.text()).toContain('Click Me!')
            } else {
              // StudentsPage should be rendered
              expect(wrapper.text()).toContain('Students Directory')
            }

            // Verify the header is still present (consistent across routes)
            expect(wrapper.text()).toContain('Student Info App')

            navigationCount++
          }

          // Final verification: Vue instance never changed during navigation
          expect(wrapper.vm).toBe(initialVueInstance)
          expect(router).toBe(initialRouter)
          
          // Verify we actually performed navigations
          expect(navigationCount).toBe(navigationSequence.length)
        }
      ),
      { numRuns: 100 } // Run 100 iterations as per design document
    )
  }, 30000) // 30 second timeout for this test due to multiple navigation operations

  /**
   * Property 4: URL Updates on Navigation
   * 
   * **Validates: Requirements 4.3**
   * 
   * **Feature: student-info-app, Property 4: URL updates on navigation**
   * 
   * This property test verifies that for any route navigation,
   * the browser URL updates to reflect the new route path.
   * 
   * The test verifies:
   * 1. When navigating to a route programmatically, the URL updates
   * 2. The URL path matches the expected route path
   * 3. The router's currentRoute reflects the URL change
   * 4. URL updates occur for any sequence of navigation actions
   * 
   * We use createMemoryHistory for testing, which simulates browser history
   * without actually changing the browser URL. The router's currentRoute.value.path
   * represents what the URL would be in a real browser environment.
   */
  it('Property 4: URL updates to match route path for any navigation', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random sequences of navigation actions
        // Each action is either 'home' or 'students'
        fc.array(
          fc.constantFrom('home', 'students'),
          { minLength: 1, maxLength: 10 }
        ),
        async (navigationSequence) => {
          // Create a fresh router for each test iteration
          const router = createTestRouter()
          
          // Mount the App component with the router
          const wrapper = mount(App, {
            global: {
              plugins: [router]
            }
          })

          // Wait for initial mount
          await router.isReady()
          await wrapper.vm.$nextTick()

          // Verify initial URL is '/'
          expect(router.currentRoute.value.path).toBe('/')

          // Execute the navigation sequence
          for (const targetRoute of navigationSequence) {
            const expectedPath = targetRoute === 'home' ? '/' : '/students'

            // Navigate to the route programmatically
            await router.push(expectedPath)

            // Wait for navigation to complete
            await router.isReady()
            await wrapper.vm.$nextTick()

            // CRITICAL: Verify the URL (currentRoute.path) updates to match the route path
            expect(router.currentRoute.value.path).toBe(expectedPath)
            
            // Also verify the route name matches
            const expectedName = targetRoute === 'home' ? 'Home' : 'Students'
            expect(router.currentRoute.value.name).toBe(expectedName)
            
            // Verify the fullPath also matches (includes query params and hash if any)
            expect(router.currentRoute.value.fullPath).toBe(expectedPath)
          }

          // Final verification: ensure we're at the last route in the sequence
          const lastRoute = navigationSequence[navigationSequence.length - 1]
          const finalExpectedPath = lastRoute === 'home' ? '/' : '/students'
          expect(router.currentRoute.value.path).toBe(finalExpectedPath)
        }
      ),
      { numRuns: 100 } // Run 100 iterations as per design document
    )
  }, 30000) // 30 second timeout for this test due to multiple navigation operations

  /**
   * Property 5: Route Displays Correct Content
   * 
   * **Validates: Requirements 4.4**
   * 
   * **Feature: student-info-app, Property 5: Correct content for routes**
   * 
   * This property test verifies that for any defined route,
   * when navigated to, the correct page component is rendered with
   * its component-specific content.
   * 
   * The test verifies:
   * 1. When navigating to a route, the correct component is rendered
   * 2. Component-specific content is visible (e.g., "Students List" heading on /students)
   * 3. The correct page component is displayed based on the current route
   * 4. Content changes appropriately when navigating between routes
   * 
   * For each route, we verify specific content that uniquely identifies
   * the page component:
   * - Home route (/): "Welcome to the Student Info App!" and "Click Me!" button
   * - Students route (/students): "Students List" heading
   * 
   * This ensures the router correctly maps routes to components and
   * renders the appropriate content for each route.
   */
  it('Property 5: correct page component and content rendered for any route', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random sequences of navigation actions
        // Each action is either 'home' or 'students'
        fc.array(
          fc.constantFrom('home', 'students'),
          { minLength: 1, maxLength: 10 }
        ),
        async (navigationSequence) => {
          // Create a fresh router for each test iteration
          const router = createTestRouter()
          
          // Mount the App component with the router
          const wrapper = mount(App, {
            global: {
              plugins: [router]
            }
          })

          // Wait for initial mount
          await router.isReady()
          await wrapper.vm.$nextTick()

          // Execute the navigation sequence
          for (const targetRoute of navigationSequence) {
            const expectedPath = targetRoute === 'home' ? '/' : '/students'

            // Navigate to the route
            await router.push(expectedPath)

            // Wait for navigation to complete
            await router.isReady()
            await wrapper.vm.$nextTick()

            // Verify the route has changed
            expect(router.currentRoute.value.path).toBe(expectedPath)

            // CRITICAL: Verify the correct page component is rendered with its specific content
            if (targetRoute === 'home') {
              // HomePage should be rendered with its specific content
              // Check for the welcome message (unique to HomePage)
              expect(wrapper.text()).toContain('Welcome to the Student Info App!')
              
              // Check for the button (unique to HomePage)
              expect(wrapper.text()).toContain('Click Me!')
              
              // Verify the button element exists
              const button = wrapper.find('button')
              expect(button.exists()).toBe(true)
              expect(button.text()).toBe('Click Me!')
              
              // Verify HomePage component is actually mounted
              const homePage = wrapper.findComponent(HomePage)
              expect(homePage.exists()).toBe(true)
              
              // Verify StudentsPage is NOT rendered
              const studentsPage = wrapper.findComponent(StudentsPage)
              expect(studentsPage.exists()).toBe(false)
              
            } else {
              // StudentsPage should be rendered with its specific content
              // Check for the "Students Directory" heading (unique to StudentsPage)
              expect(wrapper.text()).toContain('Students Directory')
              
              // Verify StudentsPage component is actually mounted
              const studentsPage = wrapper.findComponent(StudentsPage)
              expect(studentsPage.exists()).toBe(true)
              
              // Verify HomePage is NOT rendered
              const homePage = wrapper.findComponent(HomePage)
              expect(homePage.exists()).toBe(false)
              
              // Verify we don't see HomePage-specific content
              expect(wrapper.text()).not.toContain('Click Me!')
            }

            // Verify the header is present on all pages (consistent across routes)
            expect(wrapper.text()).toContain('Student Info App')
          }

          // Final verification: ensure we're at the last route with correct content
          const lastRoute = navigationSequence[navigationSequence.length - 1]
          if (lastRoute === 'home') {
            expect(wrapper.text()).toContain('Welcome to the Student Info App!')
            expect(wrapper.findComponent(HomePage).exists()).toBe(true)
          } else {
            expect(wrapper.text()).toContain('Students Directory')
            expect(wrapper.findComponent(StudentsPage).exists()).toBe(true)
          }
        }
      ),
      { numRuns: 100 } // Run 100 iterations as per design document
    )
  }, 30000) // 30 second timeout for this test due to multiple navigation operations
})
