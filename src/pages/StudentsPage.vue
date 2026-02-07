<template>
  <div class="students-page">
    <HeaderComponent />
    <main>
      <h2>Students Directory</h2>
      <p class="subtitle">{{ students.length }} students found</p>
      
      <div v-if="loading" class="loading">
        Loading students...
      </div>
      
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      
      <div v-else class="students-list">
        <StudentComponent
          v-for="student in students"
          :key="student.id"
          :name="student.name"
          :course="student.course"
          :year="student.year"
          :email="student.email"
          :phone="student.phone"
          :website="student.website"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HeaderComponent from '../components/HeaderComponent.vue'
import StudentComponent from '../components/StudentComponent.vue'
import { apiService } from '../services/apiService.js'

// Reactive state
const students = ref([])
const loading = ref(false)
const error = ref(null)

// Fetch students on component mount
onMounted(async () => {
  loading.value = true
  error.value = null
  
  try {
    const result = await apiService.fetchStudents()
    
    // Check if result is an error object
    if (result.error) {
      error.value = result.message
    } else {
      students.value = result
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.students-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
}

main {
  flex: 1;
  padding: var(--spacing-lg);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

h2 {
  font-size: 1.875rem;
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.subtitle {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-bottom: 2rem;
}

.loading {
  text-align: center;
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: var(--color-text-secondary);
  padding: var(--spacing-xl);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.error {
  text-align: center;
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  color: var(--color-error);
  padding: var(--spacing-lg);
  background-color: var(--color-error-bg);
  border: 2px solid var(--color-error-border);
  border-radius: var(--radius-md);
  margin: var(--spacing-lg) auto;
  max-width: 600px;
  box-shadow: var(--shadow-sm);
  font-weight: 500;
}

.students-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 900px;
  margin: 0 auto;
  padding: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  main {
    padding: var(--spacing-md);
  }
  
  h2 {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 640px) {
  main {
    padding: var(--spacing-sm);
  }
}

/* Empty state */
.students-list:empty::after {
  content: 'No students found';
  display: block;
  text-align: center;
  color: var(--color-text-secondary);
  padding: var(--spacing-xl);
  font-size: 1.1rem;
}
</style>
