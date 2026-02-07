<template>
  <div class="home-page">
    <HeaderComponent />
    <main>
      <h2>{{ message }}</h2>
      <button @click="handleClick">Click Me!</button>
      <p v-if="buttonClicked" class="clicked-message">Button was clicked!</p>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HeaderComponent from '../components/HeaderComponent.vue'

// Reactive state
const message = ref('Welcome to the Student Info App!')
const buttonClicked = ref(false)

// Event handler
const handleClick = () => {
  buttonClicked.value = true
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) var(--spacing-lg);
  text-align: center;
}

h2 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  font-weight: 700;
}

button {
  padding: var(--spacing-sm) var(--spacing-xl);
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background-color: var(--color-accent);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-md);
  min-width: 200px;
}

button:hover {
  background-color: var(--color-accent-hover);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

button:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

.clicked-message {
  margin-top: var(--spacing-lg);
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: var(--color-accent);
  font-weight: 600;
  animation: fadeIn 0.4s ease-in;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-accent-light);
  border-radius: var(--radius-md);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 640px) {
  main {
    padding: var(--spacing-lg) var(--spacing-md);
  }
  
  button {
    min-width: auto;
    width: 100%;
    max-width: 300px;
  }
}
</style>
