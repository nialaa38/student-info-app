import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import StudentsPage from '../pages/StudentsPage.vue'

const routes = [
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

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
