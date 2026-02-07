import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import * as fc from 'fast-check'
import HomePage from './HomePage.vue'
import HeaderComponent from '../components/HeaderComponent.vue'

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

describe('HomePage', () => {
  it('renders with HeaderComponent', () => {
    const router = createMockRouter()
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    })
    
    // Check that HeaderComponent is rendered
    const header = wrapper.findComponent(HeaderComponent)
    expect(header.exists()).toBe(true)
  })

  it('displays welcome message', () => {
    const router = createMockRouter()
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    })
    
    // Check that the welcome message is displayed
    expect(wrapper.text()).toContain('Welcome to the Student Info App!')
    expect(wrapper.find('h2').text()).toBe('Welcome to the Student Info App!')
  })

  it('has a button', () => {
    const router = createMockRouter()
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    })
    
    // Check that the button exists
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Click Me!')
  })

  it('initial state has buttonClicked as false', () => {
    const router = createMockRouter()
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    })
    
    // Check that the conditional message is not displayed initially
    const clickedMessage = wrapper.find('.clicked-message')
    expect(clickedMessage.exists()).toBe(false)
  })

  it('updates state when button is clicked', async () => {
    const router = createMockRouter()
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    })
    
    // Initially, the clicked message should not be visible
    expect(wrapper.find('.clicked-message').exists()).toBe(false)
    
    // Click the button
    const button = wrapper.find('button')
    await button.trigger('click')
    
    // After clicking, the message should be visible
    const clickedMessage = wrapper.find('.clicked-message')
    expect(clickedMessage.exists()).toBe(true)
    expect(clickedMessage.text()).toBe('Button was clicked!')
  })

  /**
   * Property 2: Button Interaction Updates State
   * 
   * **Validates: Requirements 3.2, 3.3**
   * 
   * **Feature: student-info-app, Property 2: Button clicks update state**
   * 
   * This property test verifies that for any button with a click handler,
   * when the button is clicked, the associated state is updated and reflected in the UI.
   * 
   * The test verifies:
   * 1. The button exists and can be found
   * 2. Before clicking, the conditional message is not visible
   * 3. After clicking, the state updates (buttonClicked becomes true)
   * 4. The conditional message appears in the UI after the click
   */
  it('Property 2: button interaction updates state for any number of clicks', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate a random number of clicks (1 to 10)
        fc.integer({ min: 1, max: 10 }),
        async (numClicks) => {
          const router = createMockRouter()
          // Mount the HomePage component
          const wrapper = mount(HomePage, {
            global: {
              plugins: [router]
            }
          })
          
          // Find the button element
          const button = wrapper.find('button')
          
          // Verify button exists
          expect(button.exists()).toBe(true)
          
          // Initially, the conditional message should not be visible
          expect(wrapper.find('.clicked-message').exists()).toBe(false)
          
          // Click the button the specified number of times
          for (let i = 0; i < numClicks; i++) {
            await button.trigger('click')
          }
          
          // After clicking, verify state has updated and message appears
          const clickedMessage = wrapper.find('.clicked-message')
          expect(clickedMessage.exists()).toBe(true)
          expect(clickedMessage.text()).toBe('Button was clicked!')
          
          // Verify the message is visible in the rendered output
          expect(wrapper.text()).toContain('Button was clicked!')
        }
      ),
      { numRuns: 100 } // Run 100 iterations as per design document
    )
  })
})
