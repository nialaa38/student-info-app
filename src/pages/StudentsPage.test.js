import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import * as fc from 'fast-check'
import StudentsPage from './StudentsPage.vue'
import HeaderComponent from '../components/HeaderComponent.vue'
import StudentComponent from '../components/StudentComponent.vue'
import { apiService } from '../services/apiService.js'

// Mock the apiService
vi.mock('../services/apiService.js', () => ({
  apiService: {
    fetchStudents: vi.fn()
  }
}))

// Create a mock router for testing
const createMockRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div>Home</div>' } },
      { path: '/students', component: { template: '<div>Students</div>' } }
    ]
  })
}

describe('StudentsPage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  it('renders with HeaderComponent', () => {
    // Mock successful API response
    apiService.fetchStudents.mockResolvedValue([])
    
    const router = createMockRouter()
    const wrapper = mount(StudentsPage, {
      global: {
        plugins: [router]
      }
    })
    
    // Check that HeaderComponent is rendered
    const header = wrapper.findComponent(HeaderComponent)
    expect(header.exists()).toBe(true)
  })

  it('displays "Students List" heading', () => {
    // Mock successful API response
    apiService.fetchStudents.mockResolvedValue([])
    
    const router = createMockRouter()
    const wrapper = mount(StudentsPage, {
      global: {
        plugins: [router]
      }
    })
    
    // Check that the heading is displayed
    expect(wrapper.find('h2').text()).toBe('Students Directory')
  })

  /**
   * Property 6: Loading Indicator During Fetch
   * 
   * **Validates: Requirements 5.2, 7.1**
   * 
   * **Feature: student-info-app, Property 6: Loading indicator shown during fetch**
   * 
   * This property test verifies that for any API fetch operation,
   * while the request is in progress, a loading indicator is visible to the user.
   */
  it('Property 6: displays loading indicator during fetch', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random delay times (10ms to 100ms for faster tests)
        fc.integer({ min: 10, max: 100 }),
        async (delayMs) => {
          // Mock API with delayed response
          apiService.fetchStudents.mockImplementation(() => 
            new Promise(resolve => setTimeout(() => resolve([]), delayMs))
          )

          const router = createMockRouter()
          // Mount component
          const wrapper = mount(StudentsPage, {
            global: {
              plugins: [router]
            }
          })

          // Wait for onMounted to execute
          await wrapper.vm.$nextTick()
          
          // Check that loading indicator is visible
          const loadingDiv = wrapper.find('.loading')
          expect(loadingDiv.exists()).toBe(true)
          expect(loadingDiv.text()).toContain('Loading students')

          // Wait for the delay plus some buffer time
          await new Promise(resolve => setTimeout(resolve, delayMs + 20))
          
          // Wait for all promises and updates
          await flushPromises()
          await wrapper.vm.$nextTick()

          // After loading, the loading indicator should be gone
          expect(wrapper.find('.loading').exists()).toBe(false)
        }
      ),
      { numRuns: 100 }
    )
  }, 15000) // 15 second timeout for this test

  /**
   * Property 7: Data Display After Successful Fetch
   * 
   * **Validates: Requirements 5.3**
   * 
   * **Feature: student-info-app, Property 7: Data displayed after successful fetch**
   * 
   * This property test verifies that for any successful API response,
   * the returned data is displayed in the UI as a list with the correct
   * number of StudentComponent instances.
   */
  it('Property 7: displays correct number of students after successful fetch', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random arrays of student data with Philippine-accurate fields
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 10000 }),
            name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
            course: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
            year: fc.integer({ min: 1, max: 4 }).map(n => n.toString()),
            email: fc.emailAddress(),
            phone: fc.string({ minLength: 10, maxLength: 20 }),
            website: fc.webUrl()
          }),
          { minLength: 1, maxLength: 20 }
        ),
        async (students) => {
          // Mock API to return generated students
          apiService.fetchStudents.mockResolvedValue(students)

          const router = createMockRouter()
          // Mount component
          const wrapper = mount(StudentsPage, {
            global: {
              plugins: [router]
            }
          })

          // Wait for API call and component updates
          await flushPromises()
          await wrapper.vm.$nextTick()

          // Verify correct number of StudentComponent instances
          const studentComponents = wrapper.findAllComponents(StudentComponent)
          expect(studentComponents.length).toBe(students.length)

          // Verify each student component receives correct props
          studentComponents.forEach((component, index) => {
            expect(component.props('name')).toBe(students[index].name)
            expect(component.props('course')).toBe(students[index].course)
            expect(component.props('year')).toBe(students[index].year)
            expect(component.props('email')).toBe(students[index].email)
            expect(component.props('phone')).toBe(students[index].phone)
            expect(component.props('website')).toBe(students[index].website)
          })

          // Verify students list container exists
          const studentsList = wrapper.find('.students-list')
          expect(studentsList.exists()).toBe(true)

          // Verify no loading or error messages
          expect(wrapper.find('.loading').exists()).toBe(false)
          expect(wrapper.find('.error').exists()).toBe(false)
        }
      ),
      { numRuns: 100, timeout: 10000 }
    )
  }, 15000)

  /**
   * Property 8: Error Message on Failed Fetch
   * 
   * **Validates: Requirements 5.4, 7.2**
   * 
   * **Feature: student-info-app, Property 8: Error message on failed fetch**
   * 
   * This property test verifies that for any failed API request,
   * an error message is displayed to the user.
   */
  it('Property 8: displays error message when fetch fails', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random error messages (non-empty, trimmed)
        fc.string({ minLength: 1, maxLength: 100 })
          .filter(s => s.trim().length > 0)
          .map(s => s.trim()),
        async (errorMessage) => {
          // Mock API to return error
          apiService.fetchStudents.mockResolvedValue({
            error: true,
            message: errorMessage
          })

          const router = createMockRouter()
          // Mount component
          const wrapper = mount(StudentsPage, {
            global: {
              plugins: [router]
            }
          })

          // Wait for API call and component updates
          await flushPromises()
          await wrapper.vm.$nextTick()

          // Verify error message is displayed
          const errorDiv = wrapper.find('.error')
          expect(errorDiv.exists()).toBe(true)
          expect(errorDiv.text()).toBe(errorMessage)

          // Verify no loading indicator or students list
          expect(wrapper.find('.loading').exists()).toBe(false)
          expect(wrapper.find('.students-list').exists()).toBe(false)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 10: Consistent List Item Formatting
   * 
   * **Validates: Requirements 6.2**
   * 
   * **Feature: student-info-app, Property 10: Consistent list formatting**
   * 
   * This property test verifies that for any list of students displayed,
   * each student card has consistent structure and formatting (same CSS classes).
   */
  it('Property 10: all student cards have consistent formatting', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random arrays of student data with varying sizes
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 10000 }),
            name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
            course: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
            year: fc.integer({ min: 1, max: 4 }).map(n => n.toString()),
            email: fc.emailAddress(),
            phone: fc.string({ minLength: 10, maxLength: 20 }),
            website: fc.webUrl()
          }),
          { minLength: 2, maxLength: 15 } // At least 2 to compare consistency
        ),
        async (students) => {
          // Mock API to return generated students
          apiService.fetchStudents.mockResolvedValue(students)

          const router = createMockRouter()
          // Mount component
          const wrapper = mount(StudentsPage, {
            global: {
              plugins: [router]
            }
          })

          // Wait for API call and component updates
          await flushPromises()
          await wrapper.vm.$nextTick()

          // Get all StudentComponent instances
          const studentComponents = wrapper.findAllComponents(StudentComponent)
          expect(studentComponents.length).toBeGreaterThan(1)

          // Verify all components have the same structure
          const firstComponentClasses = studentComponents[0].classes()
          
          studentComponents.forEach((component) => {
            // Each component should have the same CSS classes
            expect(component.classes()).toEqual(firstComponentClasses)
            
            // Each component should have the same props structure with Philippine-accurate fields
            expect(component.props()).toHaveProperty('name')
            expect(component.props()).toHaveProperty('course')
            expect(component.props()).toHaveProperty('year')
            expect(component.props()).toHaveProperty('email')
            expect(component.props()).toHaveProperty('phone')
            expect(component.props()).toHaveProperty('website')
          })

          // Verify the students list container has consistent grid layout
          const studentsList = wrapper.find('.students-list')
          expect(studentsList.exists()).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Unit Test: Empty Students Array
   * 
   * **Validates: Requirements 5.3**
   * 
   * This test verifies that when the API returns an empty array,
   * the component handles it gracefully without errors.
   */
  it('handles empty students array gracefully', async () => {
    // Mock API to return empty array
    apiService.fetchStudents.mockResolvedValue([])

    const router = createMockRouter()
    const wrapper = mount(StudentsPage, {
      global: {
        plugins: [router]
      }
    })

    // Wait for API call and component updates
    await flushPromises()
    await wrapper.vm.$nextTick()

    // Verify students list exists but is empty
    const studentsList = wrapper.find('.students-list')
    expect(studentsList.exists()).toBe(true)

    // Verify no StudentComponent instances
    const studentComponents = wrapper.findAllComponents(StudentComponent)
    expect(studentComponents.length).toBe(0)

    // Verify no error or loading messages
    expect(wrapper.find('.loading').exists()).toBe(false)
    expect(wrapper.find('.error').exists()).toBe(false)
  })

  /**
   * Unit Test: Single Student
   * 
   * **Validates: Requirements 5.3**
   * 
   * This test verifies that the component correctly displays a single student.
   */
  it('displays single student correctly', async () => {
    const singleStudent = {
      id: 1,
      name: 'John Doe',
      course: 'BS Computer Science',
      year: '3',
      email: 'john@example.com',
      phone: '+63 123 456 7890',
      website: 'johndoe.edu.ph'
    }

    // Mock API to return single student
    apiService.fetchStudents.mockResolvedValue([singleStudent])

    const router = createMockRouter()
    const wrapper = mount(StudentsPage, {
      global: {
        plugins: [router]
      }
    })

    // Wait for API call and component updates
    await flushPromises()
    await wrapper.vm.$nextTick()

    // Verify exactly one StudentComponent
    const studentComponents = wrapper.findAllComponents(StudentComponent)
    expect(studentComponents.length).toBe(1)

    // Verify props are correct with Philippine-accurate fields
    expect(studentComponents[0].props('name')).toBe('John Doe')
    expect(studentComponents[0].props('course')).toBe('BS Computer Science')
    expect(studentComponents[0].props('year')).toBe('3')
    expect(studentComponents[0].props('email')).toBe('john@example.com')
    expect(studentComponents[0].props('phone')).toBe('+63 123 456 7890')
    expect(studentComponents[0].props('website')).toBe('johndoe.edu.ph')
  })

  /**
   * Unit Test: Initial State
   * 
   * This test verifies the component's initial state before API call completes.
   */
  it('has correct initial state', async () => {
    let resolvePromise
    const delayedPromise = new Promise(resolve => {
      resolvePromise = resolve
    })

    // Mock API with delayed response
    apiService.fetchStudents.mockImplementation(() => delayedPromise)

    const router = createMockRouter()
    const wrapper = mount(StudentsPage, {
      global: {
        plugins: [router]
      }
    })

    // Wait for onMounted to execute
    await wrapper.vm.$nextTick()

    // Check initial state - loading should be true
    expect(wrapper.find('.loading').exists()).toBe(true)

    // Clean up - resolve the promise
    resolvePromise([])
    await flushPromises()
  })
})
