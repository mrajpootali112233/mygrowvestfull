/// <reference types="cypress" />

describe('Authentication and Security Tests', () => {
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'SecurePassword123!'
  }

  beforeEach(() => {
    cy.cleanDatabase()
    cy.seedDatabase()
    cy.visit('/')
  })

  describe('Authentication Flow', () => {
    it('should register new user successfully', () => {
      cy.get('[data-cy="register-link"]').click()
      
      cy.get('[data-cy="firstName"]').type(testUser.firstName)
      cy.get('[data-cy="lastName"]').type(testUser.lastName)
      cy.get('[data-cy="email"]').type(testUser.email)
      cy.get('[data-cy="password"]').type(testUser.password)
      cy.get('[data-cy="confirmPassword"]').type(testUser.password)
      cy.get('[data-cy="terms-checkbox"]').check()
      
      cy.get('[data-cy="register-button"]').click()
      
      cy.url().should('include', '/dashboard')
      cy.get('[data-cy="user-menu"]').should('contain', testUser.firstName)
    })

    it('should login existing user successfully', () => {
      // First register user
      cy.register(testUser.firstName, testUser.lastName, testUser.email, testUser.password)
      cy.logout()
      
      // Then login
      cy.get('[data-cy="login-link"]').click()
      cy.get('[data-cy="email"]').type(testUser.email)
      cy.get('[data-cy="password"]').type(testUser.password)
      cy.get('[data-cy="login-button"]').click()
      
      cy.url().should('include', '/dashboard')
      cy.get('[data-cy="user-menu"]').should('contain', testUser.firstName)
    })

    it('should handle login with invalid credentials', () => {
      cy.get('[data-cy="login-link"]').click()
      cy.get('[data-cy="email"]').type('wrong@email.com')
      cy.get('[data-cy="password"]').type('wrongpassword')
      cy.get('[data-cy="login-button"]').click()
      
      cy.get('[data-cy="error-message"]').should('contain', 'Invalid credentials')
      cy.url().should('include', '/login')
    })

    it('should validate password requirements during registration', () => {
      cy.get('[data-cy="register-link"]').click()
      
      cy.get('[data-cy="firstName"]').type(testUser.firstName)
      cy.get('[data-cy="lastName"]').type(testUser.lastName)
      cy.get('[data-cy="email"]').type(testUser.email)
      cy.get('[data-cy="password"]').type('weak')
      cy.get('[data-cy="confirmPassword"]').type('weak')
      
      cy.get('[data-cy="password-error"]').should('be.visible')
      cy.get('[data-cy="register-button"]').should('be.disabled')
    })

    it('should logout user successfully', () => {
      cy.register(testUser.firstName, testUser.lastName, testUser.email, testUser.password)
      
      cy.get('[data-cy="user-menu"]').click()
      cy.get('[data-cy="logout-button"]').click()
      
      cy.url().should('include', '/')
      cy.get('[data-cy="login-link"]').should('be.visible')
    })
  })

  describe('Route Protection', () => {
    it('should redirect unauthenticated users to login', () => {
      cy.visit('/dashboard')
      cy.url().should('include', '/login')
    })

    it('should redirect non-admin users from admin routes', () => {
      cy.register(testUser.firstName, testUser.lastName, testUser.email, testUser.password)
      
      cy.visit('/admin')
      cy.url().should('include', '/dashboard')
      cy.get('[data-cy="error-message"]').should('contain', 'Access denied')
    })

    it('should allow admin access to admin routes', () => {
      cy.loginAsAdmin('admin@mygrowvest.com', 'AdminPassword123!')
      
      cy.visit('/admin')
      cy.url().should('include', '/admin')
      cy.get('[data-cy="admin-dashboard"]').should('be.visible')
    })
  })

  describe('CSRF Protection', () => {
    it('should include CSRF token in form submissions', () => {
      cy.register(testUser.firstName, testUser.lastName, testUser.email, testUser.password)
      
      cy.intercept('POST', '/api/deposits', (req) => {
        expect(req.headers).to.have.property('x-csrf-token')
        expect(req.headers['x-csrf-token']).to.not.be.empty
      }).as('depositRequest')
      
      cy.uploadDeposit('100', 'basic')
      
      cy.wait('@depositRequest')
    })

    it('should reject requests without CSRF token', () => {
      cy.register(testUser.firstName, testUser.lastName, testUser.email, testUser.password)
      
      // Make request without CSRF token
      cy.request({
        method: 'POST',
        url: '/api/deposits',
        failOnStatusCode: false,
        body: {
          amount: 100,
          planType: 'basic'
        }
      }).then((response) => {
        expect(response.status).to.eq(403)
        expect(response.body.message).to.include('CSRF')
      })
    })
  })

  describe('Rate Limiting', () => {
    it('should enforce rate limits on login attempts', () => {
      const attemptLogin = () => {
        return cy.request({
          method: 'POST',
          url: '/api/auth/login',
          failOnStatusCode: false,
          body: {
            email: 'wrong@email.com',
            password: 'wrongpassword'
          }
        })
      }

      // Make multiple failed login attempts
      for (let i = 0; i < 6; i++) {
        attemptLogin()
      }

      // Should be rate limited on next attempt
      attemptLogin().then((response) => {
        expect(response.status).to.eq(429)
        expect(response.body.message).to.include('rate limit')
      })
    })

    it('should enforce rate limits on deposit submissions', () => {
      cy.register(testUser.firstName, testUser.lastName, testUser.email, testUser.password)
      
      // Get CSRF token first
      cy.getCsrfToken().then((csrfToken) => {
        const submitDeposit = () => {
          return cy.request({
            method: 'POST',
            url: '/api/deposits',
            failOnStatusCode: false,
            headers: {
              'x-csrf-token': csrfToken,
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: {
              amount: 100,
              planType: 'basic'
            }
          })
        }

        // Make multiple deposit attempts quickly
        for (let i = 0; i < 4; i++) {
          submitDeposit()
        }

        // Should be rate limited
        submitDeposit().then((response) => {
          expect(response.status).to.eq(429)
        })
      })
    })
  })

  describe('Input Validation and XSS Prevention', () => {
    it('should sanitize user input in forms', () => {
      const maliciousScript = '<script>alert("xss")</script>'
      
      cy.get('[data-cy="register-link"]').click()
      
      cy.get('[data-cy="firstName"]').type(maliciousScript)
      cy.get('[data-cy="lastName"]').type('User')
      cy.get('[data-cy="email"]').type('test@example.com')
      cy.get('[data-cy="password"]').type(testUser.password)
      cy.get('[data-cy="confirmPassword"]').type(testUser.password)
      cy.get('[data-cy="terms-checkbox"]').check()
      
      cy.get('[data-cy="register-button"]').click()
      
      // Should not execute script, should sanitize input
      cy.get('[data-cy="user-menu"]').should('not.contain', maliciousScript)
      cy.get('[data-cy="user-menu"]').should('contain', 'scriptalert("xss")/script') // sanitized
    })

    it('should validate file upload types', () => {
      cy.register(testUser.firstName, testUser.lastName, testUser.email, testUser.password)
      
      cy.get('[data-cy="nav-deposits"]').click()
      cy.get('[data-cy="new-deposit-button"]').click()
      
      // Try to upload invalid file type
      cy.fixture('malicious.txt').then(fileContent => {
        cy.get('[data-cy="receipt-upload"]').selectFile({
          contents: Cypress.Buffer.from(fileContent),
          fileName: 'malicious.exe',
          mimeType: 'application/octet-stream'
        }, { force: true })
      })
      
      cy.get('[data-cy="file-error"]').should('contain', 'Invalid file type')
    })

    it('should validate file upload size limits', () => {
      cy.register(testUser.firstName, testUser.lastName, testUser.email, testUser.password)
      
      cy.get('[data-cy="nav-deposits"]').click()
      cy.get('[data-cy="new-deposit-button"]').click()
      
      // Try to upload oversized file (mock large file)
      const largeFileContent = 'x'.repeat(10 * 1024 * 1024) // 10MB
      
      cy.get('[data-cy="receipt-upload"]').selectFile({
        contents: Cypress.Buffer.from(largeFileContent),
        fileName: 'large-receipt.jpg',
        mimeType: 'image/jpeg'
      }, { force: true })
      
      cy.get('[data-cy="file-error"]').should('contain', 'File size too large')
    })
  })

  describe('Session Management', () => {
    it('should handle expired tokens', () => {
      cy.register(testUser.firstName, testUser.lastName, testUser.email, testUser.password)
      
      // Simulate expired token
      cy.window().then((win) => {
        const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ'
        win.localStorage.setItem('token', expiredToken)
      })
      
      // Try to access protected route
      cy.visit('/dashboard/deposits')
      
      // Should redirect to login due to expired token
      cy.url().should('include', '/login')
      cy.get('[data-cy="error-message"]').should('contain', 'Session expired')
    })

    it('should refresh tokens automatically', () => {
      cy.register(testUser.firstName, testUser.lastName, testUser.email, testUser.password)
      
      // Mock token refresh
      cy.intercept('POST', '/api/auth/refresh', { 
        statusCode: 200,
        body: { accessToken: 'new-token', refreshToken: 'new-refresh-token' }
      }).as('tokenRefresh')
      
      // Navigate around to trigger token refresh
      cy.get('[data-cy="nav-deposits"]').click()
      cy.get('[data-cy="nav-withdrawals"]').click()
      
      // Should have attempted token refresh
      cy.wait('@tokenRefresh')
    })
  })

  afterEach(() => {
    cy.cleanDatabase()
  })
})