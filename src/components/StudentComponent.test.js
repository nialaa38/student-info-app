import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import StudentComponent from './StudentComponent.vue'

describe('StudentComponent', () => {
  /**
   * Property 1: Props Render Correctly
   * 
   * **Validates: Requirements 2.3, 2.5**
   * 
   * **Feature: student-info-app, Property 1: For any valid student data, props render correctly**
   * 
   * This property test verifies that for any valid student data (name, course, year, email, phone, website),
   * when passed as props to StudentComponent, all values appear in the rendered HTML.
   */
  it('Property 1: renders all props correctly for any valid student data', () => {
    fc.assert(
      fc.property(
        // Generate random student data (non-empty, non-whitespace-only strings)
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0), // name
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0), // course
        fc.integer({ min: 1, max: 4 }).map(n => n.toString()), // year
        fc.emailAddress(), // email
        fc.string({ minLength: 10, maxLength: 20 }), // phone
        fc.webUrl(), // website
        (name, course, year, email, phone, website) => {
          // Mount component with generated props
          const wrapper = mount(StudentComponent, {
            props: {
              name,
              course,
              year,
              email,
              phone,
              website
            }
          })

          // Get the rendered HTML text
          const renderedText = wrapper.text()

          // Verify all values appear in rendered HTML
          // Note: HTML rendering trims whitespace, so we compare trimmed values
          expect(renderedText).toContain(name.trim())
          expect(renderedText).toContain(course.trim())
          expect(renderedText).toContain(year.trim())
          expect(renderedText).toContain(email)
          expect(renderedText).toContain(phone)
          expect(renderedText).toContain(website)

          // Additional verification: check specific elements
          expect(wrapper.find('h3').text()).toBe(name.trim())
          expect(wrapper.find('.student-card').exists()).toBe(true)
          
          // Verify the structure contains the labels
          expect(renderedText).toContain('Course:')
          expect(renderedText).toContain('Year')
          expect(renderedText).toContain('Email:')
          expect(renderedText).toContain('Phone:')
          expect(renderedText).toContain('Website:')
        }
      ),
      { numRuns: 100 } // Run 100 iterations as per design document
    )
  })

  /**
   * Unit Test: Edge Case - Empty Strings
   * 
   * **Validates: Requirements 2.3**
   * 
   * This test verifies that the component still renders correctly when provided
   * with empty strings for all props. The component should display the structure
   * with labels even if the values are empty.
   */
  it('renders correctly with empty strings', () => {
    const wrapper = mount(StudentComponent, {
      props: {
        name: '',
        course: '',
        year: '',
        email: '',
        phone: '',
        website: ''
      }
    })

    // Verify the component renders without errors
    expect(wrapper.find('.student-card').exists()).toBe(true)
    
    // Verify the structure elements exist
    expect(wrapper.find('h3').exists()).toBe(true)
    
    // Verify labels are present even with empty values
    const renderedText = wrapper.text()
    expect(renderedText).toContain('Course:')
    expect(renderedText).toContain('Year')
    expect(renderedText).toContain('Email:')
    expect(renderedText).toContain('Phone:')
    expect(renderedText).toContain('Website:')
  })

  /**
   * Unit Test: Edge Case - Very Long Names
   * 
   * **Validates: Requirements 2.3**
   * 
   * This test verifies that the component handles very long strings gracefully
   * without breaking the layout or causing rendering issues.
   */
  it('renders correctly with very long names', () => {
    const longName = 'A'.repeat(500)
    const longCourse = 'Computer Science and Engineering with Specialization in Artificial Intelligence and Machine Learning'.repeat(5)
    const longYear = '4'
    const longEmail = 'verylongemailaddress@verylongdomainname.com'
    const longPhone = '+63 999 999 9999'
    const longWebsite = 'verylongwebsitename.edu.ph'

    const wrapper = mount(StudentComponent, {
      props: {
        name: longName,
        course: longCourse,
        year: longYear,
        email: longEmail,
        phone: longPhone,
        website: longWebsite
      }
    })

    // Verify the component renders without errors
    expect(wrapper.find('.student-card').exists()).toBe(true)
    
    // Verify all long values are present in the rendered output
    expect(wrapper.find('h3').text()).toBe(longName)
    expect(wrapper.text()).toContain(longCourse)
    expect(wrapper.text()).toContain(longYear)
    expect(wrapper.text()).toContain(longEmail)
    expect(wrapper.text()).toContain(longPhone)
    expect(wrapper.text()).toContain(longWebsite)
    
    // Verify the structure is maintained
    expect(wrapper.text()).toContain('Course:')
    expect(wrapper.text()).toContain('Year')
    expect(wrapper.text()).toContain('Email:')
    expect(wrapper.text()).toContain('Phone:')
    expect(wrapper.text()).toContain('Website:')
  })
})
