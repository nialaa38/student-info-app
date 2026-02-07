<template>
  <header class="app-header">
    <h1>Student Info App</h1>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/students">Students</router-link>
    </nav>
  </header>
</template>

<script setup>
// No props or state needed for this component
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--color-header-bg);
  color: var(--color-header-text);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-header-text);
}

.app-header nav {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.app-header nav a {
  color: #94a3b8;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.app-header nav a:hover {
  color: var(--color-header-text);
}

.app-header nav a:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.app-header nav a.router-link-active {
  color: var(--color-accent);
  font-weight: 600;
}

/* Responsive design */
@media (max-width: 640px) {
  .app-header {
    flex-direction: column;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    text-align: center;
  }
  
  .app-header nav {
    justify-content: center;
    width: 100%;
  }
}
</style>
