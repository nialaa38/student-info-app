import axios from 'axios'

/**
 * API Service for fetching student data
 */
export const apiService = {
  /**
   * Fetches students from JSONPlaceholder API and transforms to Student model
   * @returns {Promise<Array<{id: number, name: string, course: string, year: string, email: string, phone: string, website: string}>>} Array of student objects
   * @returns {Promise<{error: boolean, message: string}>} Error object if fetch fails
   */
  async fetchStudents() {
    try {
      // Configure Axios instance with 10-second timeout
      const axiosInstance = axios.create({
        timeout: 10000 // 10 seconds
      })
      
      const response = await axiosInstance.get('https://jsonplaceholder.typicode.com/users')
      
      // Philippine course names
      const courses = [
        'BS Computer Science',
        'BS Information Technology',
        'BS Business Administration',
        'BS Accountancy',
        'BS Nursing',
        'BS Psychology',
        'BS Civil Engineering',
        'BS Electrical Engineering',
        'BS Architecture',
        'AB Communication'
      ]
      
      // Transform API response to Student model with Philippine context
      const students = response.data.map((user, index) => {
        // Format phone number to Philippine format (+63)
        const phoneDigits = user.phone.replace(/\D/g, '').slice(0, 10)
        const formattedPhone = `+63 ${phoneDigits.slice(0, 3)} ${phoneDigits.slice(3, 6)} ${phoneDigits.slice(6, 10)}`
        
        // Generate email from name (firstname.lastname@student.edu.ph)
        const nameParts = user.name.toLowerCase().split(' ')
        const firstName = nameParts[0] || 'student'
        const lastName = nameParts[nameParts.length - 1] || 'user'
        const studentEmail = `${firstName}.${lastName}@student.edu.ph`
        
        // Generate website from name (firstname-lastname.edu.ph)
        const phWebsite = `${firstName}-${lastName}.edu.ph`
        
        // Assign year level (1-4)
        const yearLevel = ((index % 4) + 1).toString()
        
        return {
          id: user.id,
          name: user.name,
          course: courses[index % courses.length],
          year: yearLevel,
          email: studentEmail,
          phone: formattedPhone,
          website: phWebsite
        }
      })
      
      return students
    } catch (error) {
      // Handle errors and return structured error object
      let errorMessage = 'Failed to fetch students'
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - please try again'
      } else if (error.response) {
        // Server responded with error status
        errorMessage = `Server error: ${error.response.status}`
      } else if (error.request) {
        // Request made but no response received
        errorMessage = 'Network error - please check your connection'
      }
      
      return {
        error: true,
        message: errorMessage
      }
    }
  }
}
