import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fc from 'fast-check'
import axios from 'axios'
import { apiService } from './apiService.js'

// Mock axios
vi.mock('axios')

describe('apiService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  /**
   * Property 9: API Data Parsed and Stored
   * 
   * **Validates: Requirements 5.5**
   * 
   * **Feature: student-info-app, Property 9: API data correctly transformed**
   * 
   * This property test verifies that for any API response from JSONPlaceholder,
   * the data is correctly transformed to the Student model format with all
   * required fields (id, name, course, year, email, phone, website) present and non-empty.
   */
  it('Property 9: correctly transforms any valid JSONPlaceholder user data to Student model', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random arrays of JSONPlaceholder user objects
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 10000 }),
            name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
            email: fc.emailAddress(),
            phone: fc.string({ minLength: 10, maxLength: 20 }),
            website: fc.webUrl(),
            company: fc.record({
              name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0)
            })
          }),
          { minLength: 1, maxLength: 20 }
        ),
        async (users) => {
          // Mock axios.create to return a mock instance with get method
          const mockGet = vi.fn().mockResolvedValue({ data: users })
          const mockAxiosInstance = { get: mockGet }
          axios.create = vi.fn().mockReturnValue(mockAxiosInstance)

          // Call fetchStudents
          const result = await apiService.fetchStudents()

          // Verify result is an array
          expect(Array.isArray(result)).toBe(true)
          expect(result.length).toBe(users.length)

          // Verify each student has correct structure and data
          result.forEach((student, index) => {
            // Verify Student model structure with Philippine-accurate fields
            expect(student).toHaveProperty('id')
            expect(student).toHaveProperty('name')
            expect(student).toHaveProperty('course')
            expect(student).toHaveProperty('year')
            expect(student).toHaveProperty('email')
            expect(student).toHaveProperty('phone')
            expect(student).toHaveProperty('website')

            // Verify correct transformation
            expect(student.id).toBeGreaterThan(0)
            expect(student.name.trim().length).toBeGreaterThan(0)
            expect(student.course.trim().length).toBeGreaterThan(0)
            expect(student.year).toMatch(/^[1-4]$/) // Year should be 1-4
            expect(student.email).toContain('@')
            expect(student.phone).toContain('+63') // Philippine phone format
            expect(student.website).toContain('.edu.ph') // Philippine domain
          })
        }
      ),
      { numRuns: 100 } // Run 100 iterations as per design document
    )
  })

  /**
   * Unit Test: Network Failure Error Handling
   * 
   * **Validates: Requirements 5.4**
   * 
   * This test verifies that when a network error occurs (no response received),
   * the service returns a structured error object with the correct format.
   */
  it('returns structured error object on network failure', async () => {
    // Mock axios to simulate network error (request made but no response)
    const networkError = new Error('Network Error')
    networkError.request = {}
    
    const mockGet = vi.fn().mockRejectedValue(networkError)
    const mockAxiosInstance = { get: mockGet }
    axios.create = vi.fn().mockReturnValue(mockAxiosInstance)

    const result = await apiService.fetchStudents()

    // Verify error object structure
    expect(result).toHaveProperty('error')
    expect(result).toHaveProperty('message')
    expect(result.error).toBe(true)
    expect(result.message).toBe('Network error - please check your connection')
  })

  /**
   * Unit Test: Timeout Error Handling
   * 
   * **Validates: Requirements 5.4**
   * 
   * This test verifies that when a request times out (exceeds 10 seconds),
   * the service returns a structured error object with a timeout-specific message.
   */
  it('returns structured error object on timeout', async () => {
    // Mock axios to simulate timeout error
    const timeoutError = new Error('timeout of 10000ms exceeded')
    timeoutError.code = 'ECONNABORTED'
    
    const mockGet = vi.fn().mockRejectedValue(timeoutError)
    const mockAxiosInstance = { get: mockGet }
    axios.create = vi.fn().mockReturnValue(mockAxiosInstance)

    const result = await apiService.fetchStudents()

    // Verify error object structure
    expect(result).toHaveProperty('error')
    expect(result).toHaveProperty('message')
    expect(result.error).toBe(true)
    expect(result.message).toBe('Request timeout - please try again')
  })

  /**
   * Unit Test: Server Error Handling
   * 
   * **Validates: Requirements 5.4**
   * 
   * This test verifies that when the server responds with an error status (e.g., 404, 500),
   * the service returns a structured error object with the status code.
   */
  it('returns structured error object on server error', async () => {
    // Mock axios to simulate server error response
    const serverError = new Error('Request failed with status code 404')
    serverError.response = {
      status: 404,
      data: {}
    }
    
    const mockGet = vi.fn().mockRejectedValue(serverError)
    const mockAxiosInstance = { get: mockGet }
    axios.create = vi.fn().mockReturnValue(mockAxiosInstance)

    const result = await apiService.fetchStudents()

    // Verify error object structure
    expect(result).toHaveProperty('error')
    expect(result).toHaveProperty('message')
    expect(result.error).toBe(true)
    expect(result.message).toBe('Server error: 404')
  })

  /**
   * Unit Test: Successful Fetch with Real Data Structure
   * 
   * **Validates: Requirements 5.1, 5.5**
   * 
   * This test verifies that the service correctly handles a successful response
   * with data that matches the actual JSONPlaceholder API structure.
   */
  it('successfully fetches and transforms data with realistic structure', async () => {
    // Mock data matching JSONPlaceholder structure
    const mockUsers = [
      {
        id: 1,
        name: 'Leanne Graham',
        email: 'Sincere@april.biz',
        phone: '1-770-736-8031 x56442',
        website: 'hildegard.org',
        company: {
          name: 'Romaguera-Crona'
        }
      },
      {
        id: 2,
        name: 'Ervin Howell',
        email: 'Shanna@melissa.tv',
        phone: '010-692-6593 x09125',
        website: 'anastasia.net',
        company: {
          name: 'Deckow-Crist'
        }
      }
    ]

    const mockGet = vi.fn().mockResolvedValue({ data: mockUsers })
    const mockAxiosInstance = { get: mockGet }
    axios.create = vi.fn().mockReturnValue(mockAxiosInstance)

    const result = await apiService.fetchStudents()

    // Verify result is an array
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(2)

    // Verify first student has Philippine-accurate data
    expect(result[0].id).toBe(1)
    expect(result[0].name).toBe('Leanne Graham')
    expect(result[0].course).toBe('BS Computer Science')
    expect(result[0].year).toBe('1')
    expect(result[0].email).toBe('leanne.graham@student.edu.ph')
    expect(result[0].phone).toContain('+63')
    expect(result[0].website).toBe('leanne-graham.edu.ph')

    // Verify second student has Philippine-accurate data
    expect(result[1].id).toBe(2)
    expect(result[1].name).toBe('Ervin Howell')
    expect(result[1].course).toBe('BS Information Technology')
    expect(result[1].year).toBe('2')
    expect(result[1].email).toBe('ervin.howell@student.edu.ph')
    expect(result[1].phone).toContain('+63')
    expect(result[1].website).toBe('ervin-howell.edu.ph')

    // Verify axios was called with correct URL
    expect(mockGet).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users')
  })
})
