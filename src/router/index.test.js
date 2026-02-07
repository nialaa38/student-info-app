import { describe, it, expect } from 'vitest'
import router from './index.js'

describe('Router Configuration', () => {
  it('defines both routes', () => {
    const routes = router.getRoutes()
    
    // Check that we have exactly 2 routes
    expect(routes.length).toBe(2)
    
    // Check that both paths are defined
    const paths = routes.map(route => route.path)
    expect(paths).toContain('/')
    expect(paths).toContain('/students')
  })

  it('route names match expected values', () => {
    const routes = router.getRoutes()
    
    // Find routes by path and check their names
    const homeRoute = routes.find(route => route.path === '/')
    const studentsRoute = routes.find(route => route.path === '/students')
    
    expect(homeRoute).toBeDefined()
    expect(homeRoute.name).toBe('Home')
    
    expect(studentsRoute).toBeDefined()
    expect(studentsRoute.name).toBe('Students')
  })

  it('uses HTML5 history mode', () => {
    // Check that the router is using createWebHistory (HTML5 mode)
    // The router.options.history will have a base property in HTML5 mode
    expect(router.options.history).toBeDefined()
    expect(router.options.history.base).toBeDefined()
  })

  it('routes point to correct components', () => {
    const routes = router.getRoutes()
    
    const homeRoute = routes.find(route => route.path === '/')
    const studentsRoute = routes.find(route => route.path === '/students')
    
    // Check that components are defined
    expect(homeRoute.components.default).toBeDefined()
    expect(studentsRoute.components.default).toBeDefined()
    
    // Check component names (Vue components have a __name property)
    expect(homeRoute.components.default.__name).toBe('HomePage')
    expect(studentsRoute.components.default.__name).toBe('StudentsPage')
  })
})
