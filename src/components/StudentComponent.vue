<template>
  <div class="student-card">
    <div class="card-header">
      <h3>{{ name }}</h3>
      <span class="year-badge">Year {{ year }}</span>
    </div>
    <div class="card-body">
      <div class="info-row">
        <span class="label">Course:</span>
        <span class="value">{{ course }}</span>
      </div>
      <div class="info-row">
        <span class="label">Email:</span>
        <span class="value">{{ email }}</span>
      </div>
      <div class="info-row">
        <span class="label">Phone:</span>
        <span class="value">{{ phone }}</span>
      </div>
      <div class="info-row">
        <span class="label">Website:</span>
        <span class="value link">{{ website }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.student-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  background-color: var(--color-card-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.student-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.student-card h3 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 1.125rem;
  font-weight: 600;
}

.year-badge {
  background-color: var(--color-accent);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.label {
  color: var(--color-text-secondary);
  min-width: 70px;
  font-weight: 500;
}

.value {
  color: var(--color-text-primary);
}

.value.link {
  color: var(--color-accent);
  cursor: pointer;
}

.value.link:hover {
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .student-card {
    padding: 1rem;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
