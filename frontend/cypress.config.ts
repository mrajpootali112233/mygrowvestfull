import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    env: {
      apiUrl: 'http://localhost:3001/api',
      adminEmail: 'admin@mygrowvest.com',
      adminPassword: 'AdminPassword123!'
    },
    setupNodeEvents(on, config) {
      // Database operations for testing
      on('task', {
        'db:seed': async () => {
          // Seed test database with initial data
          const axios = require('axios')
          try {
            await axios.post(`${config.env.apiUrl}/test/seed`)
            return null
          } catch (error) {
            throw new Error(`Failed to seed database: ${error.message}`)
          }
        },
        
        'db:clean': async () => {
          // Clean test database
          const axios = require('axios')
          try {
            await axios.post(`${config.env.apiUrl}/test/clean`)
            return null
          } catch (error) {
            throw new Error(`Failed to clean database: ${error.message}`)
          }
        },
        
        'db:reset': async () => {
          // Reset database to initial state
          const axios = require('axios')
          try {
            await axios.post(`${config.env.apiUrl}/test/reset`)
            return null
          } catch (error) {
            throw new Error(`Failed to reset database: ${error.message}`)
          }
        },
        
        'log': (message) => {
          console.log(message)
          return null
        }
      })
      
      // Handle uncaught exceptions
      on('uncaught:exception', (err, runnable) => {
        // Prevent Cypress from failing on uncaught exceptions
        // in certain scenarios (like network errors)
        if (err.message.includes('Network Error') ||
            err.message.includes('fetch')) {
          return false
        }
        return true
      })
    },
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
  
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false,
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  responseTimeout: 10000
})