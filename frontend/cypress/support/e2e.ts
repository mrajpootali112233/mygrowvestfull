// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR logs to reduce noise
Cypress.on('window:before:load', (win) => {
  // Stub console.warn for cleaner test output
  cy.stub(win.console, 'warn').as('consoleWarn')
})

// Configure global test settings
Cypress.Commands.add('seedDatabase', () => {
  // Add test data seeding logic here
  cy.task('db:seed')
})

Cypress.Commands.add('cleanDatabase', () => {
  // Add database cleanup logic here
  cy.task('db:clean')
})