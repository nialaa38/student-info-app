import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import HeaderComponent from './HeaderComponent.vue'

// Create a mock router for testing
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/students', component: { template: '<div>Students</div>' } }
  ]
})

describe('HeaderComponent', () => {
  it('renders with correct title', async () => {
    const wrapper = mount(HeaderComponent, {
      global: {
        plugins: [router]
      }
    })
    
    // Check that the title "Student Info App" is rendered
    expect(wrapper.text()).toContain('Student Info App')
    expect(wrapper.find('h1').text()).toBe('Student Info App')
  })

  it('navigation section exists with router-links', async () => {
    const wrapper = mount(HeaderComponent, {
      global: {
        plugins: [router]
      }
    })
    
    // Check that the nav element exists
    const nav = wrapper.find('nav')
    expect(nav.exists()).toBe(true)
    
    // Check that navigation links exist (router-link renders as <a> tags)
    const links = nav.findAll('a')
    expect(links.length).toBe(2)
    
    // Check link text
    expect(links[0].text()).toBe('Home')
    expect(links[1].text()).toBe('Students')
    
    // Check link destinations (router-link uses 'to' prop but renders as href)
    expect(links[0].attributes('href')).toBe('/')
    expect(links[1].attributes('href')).toBe('/students')
  })
})
