/// <reference types="cypress" />

describe('Complete User Investment Flow', () => {
  const testUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    password: 'TestPassword123!',
    referralCode: 'REF123'
  }

  const adminUser = {
    email: 'admin@mygrowvest.com',
    password: 'AdminPassword123!'
  }

  beforeEach(() => {
    // Clean database and seed test data
    cy.cleanDatabase()
    cy.seedDatabase()
    
    // Visit homepage
    cy.visit('/')
  })

  it('should complete full investment workflow from registration to withdrawal', () => {
    // Step 1: User Registration
    cy.log('Step 1: User Registration')
    cy.get('[data-cy="register-link"]').click()
    cy.url().should('include', '/register')
    
    cy.get('[data-cy="firstName"]').type(testUser.firstName)
    cy.get('[data-cy="lastName"]').type(testUser.lastName)
    cy.get('[data-cy="email"]').type(testUser.email)
    cy.get('[data-cy="password"]').type(testUser.password)
    cy.get('[data-cy="confirmPassword"]').type(testUser.password)
    cy.get('[data-cy="referralCode"]').type(testUser.referralCode)
    cy.get('[data-cy="terms-checkbox"]').check()
    
    cy.get('[data-cy="register-button"]').click()
    
    // Should redirect to dashboard after successful registration
    cy.url().should('include', '/dashboard')
    cy.get('[data-cy="welcome-message"]').should('contain', testUser.firstName)

    // Step 2: Upload Deposit Receipt
    cy.log('Step 2: Upload Deposit Receipt')
    cy.get('[data-cy="nav-deposits"]').click()
    cy.url().should('include', '/dashboard/deposits')
    
    // Check that no active plan exists yet
    cy.get('[data-cy="no-active-plan"]').should('be.visible')
    
    cy.get('[data-cy="new-deposit-button"]').click()
    
    // Fill deposit form
    cy.get('[data-cy="deposit-amount"]').type('500')
    cy.get('[data-cy="deposit-plan"]').select('basic')
    
    // Upload receipt file
    cy.fixture('sample-receipt.jpg').then(fileContent => {
      cy.get('[data-cy="receipt-upload"]').selectFile({
        contents: Cypress.Buffer.from(fileContent),
        fileName: 'receipt.jpg',
        mimeType: 'image/jpeg'
      })
    })
    
    cy.get('[data-cy="submit-deposit"]').click()
    
    // Should show success message and pending status
    cy.get('[data-cy="success-message"]').should('contain', 'Deposit submitted successfully')
    cy.get('[data-cy="deposit-status"]').should('contain', 'PENDING')

    // Step 3: Admin Approves Deposit
    cy.log('Step 3: Admin Approves Deposit')
    cy.logout()
    cy.loginAsAdmin(adminUser.email, adminUser.password)
    
    cy.get('[data-cy="nav-admin"]').click()
    cy.url().should('include', '/admin')
    
    // Navigate to pending deposits
    cy.get('[data-cy="pending-deposits-tab"]').click()
    
    // Find and approve the test user's deposit
    cy.get('[data-cy="deposit-row"]')
      .contains(testUser.email)
      .parent()
      .within(() => {
        cy.get('[data-cy="approve-deposit"]').click()
      })
    
    // Confirm approval in modal
    cy.get('[data-cy="approve-modal"]').within(() => {
      cy.get('[data-cy="confirm-approve"]').click()
    })
    
    cy.get('[data-cy="success-message"]').should('contain', 'Deposit approved successfully')

    // Step 4: Admin Activates Investment Plan
    cy.log('Step 4: Admin Activates Investment Plan')
    cy.get('[data-cy="investments-tab"]').click()
    
    // Find and activate the investment
    cy.get('[data-cy="investment-row"]')
      .contains(testUser.email)
      .parent()
      .within(() => {
        cy.get('[data-cy="activate-investment"]').click()
      })
    
    cy.get('[data-cy="activate-modal"]').within(() => {
      cy.get('[data-cy="confirm-activate"]').click()
    })
    
    cy.get('[data-cy="success-message"]').should('contain', 'Investment activated successfully')

    // Step 5: Run Daily Profit Calculation
    cy.log('Step 5: Run Daily Profit Calculation')
    cy.get('[data-cy="profit-distribution-tab"]').click()
    
    // Run profit calculation for today
    cy.get('[data-cy="run-profit-calculation"]').click()
    
    cy.get('[data-cy="profit-modal"]').within(() => {
      cy.get('[data-cy="profit-date"]').type(new Date().toISOString().split('T')[0])
      cy.get('[data-cy="confirm-profit-run"]').click()
    })
    
    cy.get('[data-cy="success-message"]').should('contain', 'Profit calculation completed')

    // Step 6: User Checks Updated Earnings
    cy.log('Step 6: User Checks Updated Earnings')
    cy.logout()
    cy.login(testUser.email, testUser.password)
    
    cy.get('[data-cy="nav-dashboard"]').click()
    
    // Check that earnings have been updated
    cy.get('[data-cy="total-earnings"]').should('not.contain', '$0.00')
    cy.get('[data-cy="active-investment"]').should('be.visible')
    
    // Check investment details
    cy.get('[data-cy="investment-status"]').should('contain', 'ACTIVE')
    cy.get('[data-cy="investment-amount"]').should('contain', '$500.00')

    // Step 7: User Requests Withdrawal
    cy.log('Step 7: User Requests Withdrawal')
    cy.get('[data-cy="nav-withdrawals"]').click()
    cy.url().should('include', '/dashboard/withdrawals')
    
    cy.get('[data-cy="new-withdrawal-button"]').click()
    
    // Fill withdrawal form
    cy.get('[data-cy="withdrawal-amount"]').type('50')
    cy.get('[data-cy="withdrawal-method"]').select('binance')
    cy.get('[data-cy="wallet-address"]').type('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')
    
    cy.get('[data-cy="submit-withdrawal"]').click()
    
    cy.get('[data-cy="success-message"]').should('contain', 'Withdrawal request submitted')
    cy.get('[data-cy="withdrawal-status"]').should('contain', 'PENDING')

    // Step 8: Admin Approves Withdrawal (Mock)
    cy.log('Step 8: Admin Approves Withdrawal (Mock)')
    cy.logout()
    cy.loginAsAdmin(adminUser.email, adminUser.password)
    
    cy.get('[data-cy="nav-admin"]').click()
    cy.get('[data-cy="pending-withdrawals-tab"]').click()
    
    // Find and approve the withdrawal
    cy.get('[data-cy="withdrawal-row"]')
      .contains(testUser.email)
      .parent()
      .within(() => {
        cy.get('[data-cy="approve-withdrawal"]').click()
      })
    
    cy.get('[data-cy="approve-modal"]').within(() => {
      cy.get('[data-cy="confirm-approve"]').click()
    })
    
    cy.get('[data-cy="success-message"]').should('contain', 'Withdrawal approved successfully')

    // Step 9: Verify Final State
    cy.log('Step 9: Verify Final State')
    cy.logout()
    cy.login(testUser.email, testUser.password)
    
    // Check withdrawal status updated
    cy.get('[data-cy="nav-withdrawals"]').click()
    cy.get('[data-cy="withdrawal-status"]').should('contain', 'APPROVED')
    
    // Check dashboard reflects changes
    cy.get('[data-cy="nav-dashboard"]').click()
    cy.get('[data-cy="recent-activity"]').should('contain', 'Withdrawal approved')
  })

  it('should handle deposit rejection flow', () => {
    cy.log('Testing deposit rejection flow')
    
    // Register user and submit deposit
    cy.register(testUser.firstName, testUser.lastName, testUser.email, testUser.password)
    cy.uploadDeposit('100', 'basic')
    
    // Admin rejects deposit
    cy.logout()
    cy.loginAsAdmin(adminUser.email, adminUser.password)
    
    cy.get('[data-cy="nav-admin"]').click()
    cy.get('[data-cy="pending-deposits-tab"]').click()
    
    cy.get('[data-cy="deposit-row"]')
      .contains(testUser.email)
      .parent()
      .within(() => {
        cy.get('[data-cy="reject-deposit"]').click()
      })
    
    cy.get('[data-cy="reject-modal"]').within(() => {
      cy.get('[data-cy="rejection-reason"]').type('Invalid receipt format')
      cy.get('[data-cy="confirm-reject"]').click()
    })
    
    // User checks rejection
    cy.logout()
    cy.login(testUser.email, testUser.password)
    
    cy.get('[data-cy="nav-deposits"]').click()
    cy.get('[data-cy="deposit-status"]').should('contain', 'REJECTED')
    cy.get('[data-cy="rejection-reason"]').should('contain', 'Invalid receipt format')
  })

  it('should enforce withdrawal limits and validations', () => {
    cy.log('Testing withdrawal limits and validations')
    
    // Setup approved investment
    cy.register(testUser.firstName, testUser.lastName, testUser.email, testUser.password)
    cy.uploadDeposit('100', 'basic')
    
    // Admin approves and activates
    cy.logout()
    cy.loginAsAdmin(adminUser.email, adminUser.password)
    cy.approveDeposit(testUser.email)
    cy.activateInvestment(testUser.email)
    
    // User tries withdrawal below minimum
    cy.logout()
    cy.login(testUser.email, testUser.password)
    
    cy.get('[data-cy="nav-withdrawals"]').click()
    cy.get('[data-cy="new-withdrawal-button"]').click()
    
    cy.get('[data-cy="withdrawal-amount"]').type('10') // Below $20 minimum
    cy.get('[data-cy="withdrawal-method"]').select('binance')
    cy.get('[data-cy="wallet-address"]').type('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')
    
    cy.get('[data-cy="submit-withdrawal"]').click()
    
    cy.get('[data-cy="error-message"]').should('contain', 'Minimum withdrawal amount is $20')
  })

  it('should show proper profit calculations and history', () => {
    cy.log('Testing profit calculations and history')
    
    // Setup complete flow up to profit calculation
    cy.register(testUser.firstName, testUser.lastName, testUser.email, testUser.password)
    cy.uploadDeposit('1000', 'premium') // Higher amount for better profits
    
    cy.logout()
    cy.loginAsAdmin(adminUser.email, adminUser.password)
    cy.approveDeposit(testUser.email)
    cy.activateInvestment(testUser.email)
    
    // Run profit calculation
    cy.runProfitCalculation()
    
    // Check user dashboard
    cy.logout()
    cy.login(testUser.email, testUser.password)
    
    cy.get('[data-cy="nav-dashboard"]').click()
    
    // Should show profit history
    cy.get('[data-cy="profit-history"]').should('be.visible')
    cy.get('[data-cy="daily-profit"]').should('not.contain', '$0.00')
    
    // Check detailed investment view
    cy.get('[data-cy="view-investment-details"]').click()
    cy.get('[data-cy="profit-chart"]').should('be.visible')
    cy.get('[data-cy="investment-performance"]').should('contain', 'Premium Plan')
  })

  afterEach(() => {
    // Clean up after each test
    cy.cleanDatabase()
  })
})