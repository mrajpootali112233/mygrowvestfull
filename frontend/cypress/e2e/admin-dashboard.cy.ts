/// <reference types="cypress" />

describe('Admin Dashboard Tests', () => {
  const adminUser = {
    email: 'admin@mygrowvest.com',
    password: 'AdminPassword123!'
  }

  const testUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.test@example.com',
    password: 'TestPassword123!'
  }

  beforeEach(() => {
    cy.cleanDatabase()
    cy.seedDatabase()
    cy.loginAsAdmin(adminUser.email, adminUser.password)
    cy.visit('/admin')
  })

  describe('Admin Dashboard Overview', () => {
    it('should display admin dashboard with key metrics', () => {
      cy.get('[data-cy="admin-dashboard"]').should('be.visible')
      cy.get('[data-cy="total-users"]').should('be.visible')
      cy.get('[data-cy="total-deposits"]').should('be.visible')
      cy.get('[data-cy="total-withdrawals"]').should('be.visible')
      cy.get('[data-cy="platform-revenue"]').should('be.visible')
    })

    it('should show recent activity feed', () => {
      cy.get('[data-cy="recent-activity"]').should('be.visible')
      cy.get('[data-cy="activity-item"]').should('have.length.at.least', 1)
    })

    it('should display system health status', () => {
      cy.get('[data-cy="system-health"]').should('be.visible')
      cy.get('[data-cy="database-status"]').should('contain', 'Healthy')
      cy.get('[data-cy="api-status"]').should('contain', 'Healthy')
    })
  })

  describe('Deposit Management', () => {
    beforeEach(() => {
      // Create test user and deposit
      cy.createTestUserWithDeposit(testUser, '500', 'basic')
      cy.get('[data-cy="pending-deposits-tab"]').click()
    })

    it('should display pending deposits', () => {
      cy.get('[data-cy="deposits-table"]').should('be.visible')
      cy.get('[data-cy="deposit-row"]').should('contain', testUser.email)
      cy.get('[data-cy="deposit-amount"]').should('contain', '$500.00')
      cy.get('[data-cy="deposit-status"]').should('contain', 'PENDING')
    })

    it('should approve deposit successfully', () => {
      cy.get('[data-cy="deposit-row"]')
        .contains(testUser.email)
        .parent()
        .within(() => {
          cy.get('[data-cy="view-receipt"]').click()
        })

      // Verify receipt modal
      cy.get('[data-cy="receipt-modal"]').should('be.visible')
      cy.get('[data-cy="receipt-image"]').should('be.visible')
      cy.get('[data-cy="close-modal"]').click()

      // Approve deposit
      cy.get('[data-cy="deposit-row"]')
        .contains(testUser.email)
        .parent()
        .within(() => {
          cy.get('[data-cy="approve-deposit"]').click()
        })

      cy.get('[data-cy="approve-modal"]').within(() => {
        cy.get('[data-cy="approval-notes"]').type('Receipt verified, amount confirmed')
        cy.get('[data-cy="confirm-approve"]').click()
      })

      cy.get('[data-cy="success-message"]').should('contain', 'Deposit approved successfully')
      
      // Verify status updated
      cy.get('[data-cy="approved-deposits-tab"]').click()
      cy.get('[data-cy="deposit-row"]').should('contain', testUser.email)
    })

    it('should reject deposit with reason', () => {
      cy.get('[data-cy="deposit-row"]')
        .contains(testUser.email)
        .parent()
        .within(() => {
          cy.get('[data-cy="reject-deposit"]').click()
        })

      cy.get('[data-cy="reject-modal"]').within(() => {
        cy.get('[data-cy="rejection-reason"]').type('Receipt image is unclear, please resubmit')
        cy.get('[data-cy="confirm-reject"]').click()
      })

      cy.get('[data-cy="success-message"]').should('contain', 'Deposit rejected')
      
      // Verify rejection appears in rejected tab
      cy.get('[data-cy="rejected-deposits-tab"]').click()
      cy.get('[data-cy="deposit-row"]').should('contain', testUser.email)
      cy.get('[data-cy="rejection-reason"]').should('contain', 'Receipt image is unclear')
    })

    it('should filter deposits by status and date', () => {
      cy.get('[data-cy="filter-status"]').select('PENDING')
      cy.get('[data-cy="filter-date-from"]').type('2024-01-01')
      cy.get('[data-cy="filter-date-to"]').type('2024-12-31')
      cy.get('[data-cy="apply-filters"]').click()

      cy.get('[data-cy="deposits-table"]').should('be.visible')
      cy.get('[data-cy="filter-results"]').should('contain', 'Showing filtered results')
    })
  })

  describe('Investment Management', () => {
    beforeEach(() => {
      // Create approved deposit ready for activation
      cy.createTestUserWithApprovedDeposit(testUser, '1000', 'premium')
      cy.get('[data-cy="investments-tab"]').click()
    })

    it('should display pending investments for activation', () => {
      cy.get('[data-cy="investments-table"]').should('be.visible')
      cy.get('[data-cy="investment-row"]').should('contain', testUser.email)
      cy.get('[data-cy="investment-status"]').should('contain', 'PENDING_ACTIVATION')
    })

    it('should activate investment plan successfully', () => {
      cy.get('[data-cy="investment-row"]')
        .contains(testUser.email)
        .parent()
        .within(() => {
          cy.get('[data-cy="activate-investment"]').click()
        })

      cy.get('[data-cy="activate-modal"]').within(() => {
        cy.get('[data-cy="activation-date"]').should('have.value', new Date().toISOString().split('T')[0])
        cy.get('[data-cy="plan-details"]').should('contain', 'Premium Plan')
        cy.get('[data-cy="investment-amount"]').should('contain', '$1,000.00')
        cy.get('[data-cy="confirm-activate"]').click()
      })

      cy.get('[data-cy="success-message"]').should('contain', 'Investment activated successfully')
      
      // Verify in active investments
      cy.get('[data-cy="active-investments-tab"]').click()
      cy.get('[data-cy="investment-row"]').should('contain', testUser.email)
      cy.get('[data-cy="investment-status"]').should('contain', 'ACTIVE')
    })

    it('should show investment performance metrics', () => {
      // First activate an investment
      cy.activateInvestment(testUser.email)
      
      cy.get('[data-cy="active-investments-tab"]').click()
      cy.get('[data-cy="investment-row"]')
        .contains(testUser.email)
        .parent()
        .within(() => {
          cy.get('[data-cy="view-performance"]').click()
        })

      cy.get('[data-cy="performance-modal"]').within(() => {
        cy.get('[data-cy="total-invested"]').should('be.visible')
        cy.get('[data-cy="total-earnings"]').should('be.visible')
        cy.get('[data-cy="daily-rate"]').should('be.visible')
        cy.get('[data-cy="days-active"]').should('be.visible')
        cy.get('[data-cy="performance-chart"]').should('be.visible')
      })
    })
  })

  describe('Withdrawal Management', () => {
    beforeEach(() => {
      // Create user with active investment and withdrawal request
      cy.createTestUserWithActiveInvestmentAndWithdrawal(testUser, '50')
      cy.get('[data-cy="pending-withdrawals-tab"]').click()
    })

    it('should display pending withdrawals', () => {
      cy.get('[data-cy="withdrawals-table"]').should('be.visible')
      cy.get('[data-cy="withdrawal-row"]').should('contain', testUser.email)
      cy.get('[data-cy="withdrawal-amount"]').should('contain', '$50.00')
      cy.get('[data-cy="withdrawal-status"]').should('contain', 'PENDING')
    })

    it('should approve withdrawal successfully', () => {
      cy.get('[data-cy="withdrawal-row"]')
        .contains(testUser.email)
        .parent()
        .within(() => {
          cy.get('[data-cy="approve-withdrawal"]').click()
        })

      cy.get('[data-cy="approve-modal"]').within(() => {
        cy.get('[data-cy="wallet-address"]').should('be.visible')
        cy.get('[data-cy="transaction-reference"]').type('TXN123456789')
        cy.get('[data-cy="processing-notes"]').type('Processed via Binance')
        cy.get('[data-cy="confirm-approve"]').click()
      })

      cy.get('[data-cy="success-message"]').should('contain', 'Withdrawal approved and processed')
      
      // Verify in processed withdrawals
      cy.get('[data-cy="processed-withdrawals-tab"]').click()
      cy.get('[data-cy="withdrawal-row"]').should('contain', testUser.email)
      cy.get('[data-cy="transaction-ref"]').should('contain', 'TXN123456789')
    })

    it('should reject withdrawal with reason', () => {
      cy.get('[data-cy="withdrawal-row"]')
        .contains(testUser.email)
        .parent()
        .within(() => {
          cy.get('[data-cy="reject-withdrawal"]').click()
        })

      cy.get('[data-cy="reject-modal"]').within(() => {
        cy.get('[data-cy="rejection-reason"]').type('Insufficient earnings balance')
        cy.get('[data-cy="confirm-reject"]').click()
      })

      cy.get('[data-cy="success-message"]').should('contain', 'Withdrawal rejected')
    })
  })

  describe('Profit Distribution', () => {
    beforeEach(() => {
      // Setup multiple active investments
      cy.createMultipleActiveInvestments()
      cy.get('[data-cy="profit-distribution-tab"]').click()
    })

    it('should run profit calculation for specific date', () => {
      const targetDate = new Date().toISOString().split('T')[0]
      
      cy.get('[data-cy="profit-date"]').type(targetDate)
      cy.get('[data-cy="dry-run-checkbox"]').check()
      cy.get('[data-cy="run-profit-calculation"]').click()

      cy.get('[data-cy="dry-run-results"]').should('be.visible')
      cy.get('[data-cy="total-investments"]').should('contain', '3') // From setup
      cy.get('[data-cy="total-profit-amount"]').should('be.visible')
      cy.get('[data-cy="affected-users"]').should('be.visible')

      // Actually run the calculation
      cy.get('[data-cy="dry-run-checkbox"]').uncheck()
      cy.get('[data-cy="confirm-run"]').click()

      cy.get('[data-cy="success-message"]').should('contain', 'Profit calculation completed')
    })

    it('should show profit distribution history', () => {
      cy.get('[data-cy="profit-history-tab"]').click()
      
      cy.get('[data-cy="profit-runs-table"]').should('be.visible')
      cy.get('[data-cy="date-column"]').should('be.visible')
      cy.get('[data-cy="total-amount-column"]').should('be.visible')
      cy.get('[data-cy="users-affected-column"]').should('be.visible')
    })

    it('should prevent duplicate profit runs for same date', () => {
      const today = new Date().toISOString().split('T')[0]
      
      // Run profit calculation
      cy.get('[data-cy="profit-date"]').type(today)
      cy.get('[data-cy="run-profit-calculation"]').click()
      cy.get('[data-cy="confirm-run"]').click()

      cy.get('[data-cy="success-message"]').should('contain', 'Profit calculation completed')

      // Try to run again for same date
      cy.get('[data-cy="profit-date"]').clear().type(today)
      cy.get('[data-cy="run-profit-calculation"]').click()

      cy.get('[data-cy="error-message"]').should('contain', 'Profit already calculated for this date')
    })
  })

  describe('User Management', () => {
    beforeEach(() => {
      cy.get('[data-cy="user-management-tab"]').click()
    })

    it('should display all users with their details', () => {
      cy.get('[data-cy="users-table"]').should('be.visible')
      cy.get('[data-cy="user-row"]').should('have.length.at.least', 1)
      
      cy.get('[data-cy="user-email"]').should('be.visible')
      cy.get('[data-cy="user-status"]').should('be.visible')
      cy.get('[data-cy="registration-date"]').should('be.visible')
    })

    it('should view user details and activity', () => {
      cy.get('[data-cy="user-row"]').first().within(() => {
        cy.get('[data-cy="view-user"]').click()
      })

      cy.get('[data-cy="user-details-modal"]').within(() => {
        cy.get('[data-cy="user-info"]').should('be.visible')
        cy.get('[data-cy="investment-summary"]').should('be.visible')
        cy.get('[data-cy="transaction-history"]').should('be.visible')
        cy.get('[data-cy="activity-log"]').should('be.visible')
      })
    })

    it('should suspend and reactivate user account', () => {
      cy.get('[data-cy="user-row"]').first().within(() => {
        cy.get('[data-cy="suspend-user"]').click()
      })

      cy.get('[data-cy="suspend-modal"]').within(() => {
        cy.get('[data-cy="suspension-reason"]').type('Suspicious activity detected')
        cy.get('[data-cy="confirm-suspend"]').click()
      })

      cy.get('[data-cy="success-message"]').should('contain', 'User suspended')

      // Reactivate user
      cy.get('[data-cy="user-row"]').first().within(() => {
        cy.get('[data-cy="reactivate-user"]').click()
      })

      cy.get('[data-cy="confirm-reactivate"]').click()
      cy.get('[data-cy="success-message"]').should('contain', 'User reactivated')
    })
  })

  describe('System Settings', () => {
    beforeEach(() => {
      cy.get('[data-cy="system-settings-tab"]').click()
    })

    it('should update platform settings', () => {
      cy.get('[data-cy="minimum-deposit"]').clear().type('50')
      cy.get('[data-cy="minimum-withdrawal"]').clear().type('25')
      cy.get('[data-cy="platform-fee-percentage"]').clear().type('2.5')
      
      cy.get('[data-cy="save-settings"]').click()
      
      cy.get('[data-cy="success-message"]').should('contain', 'Settings updated successfully')
    })

    it('should manage investment plans', () => {
      cy.get('[data-cy="investment-plans-section"]').within(() => {
        cy.get('[data-cy="edit-basic-plan"]').click()
      })

      cy.get('[data-cy="plan-modal"]').within(() => {
        cy.get('[data-cy="daily-rate"]').clear().type('0.8')
        cy.get('[data-cy="minimum-amount"]').clear().type('100')
        cy.get('[data-cy="maximum-amount"]').clear().type('5000')
        cy.get('[data-cy="save-plan"]').click()
      })

      cy.get('[data-cy="success-message"]').should('contain', 'Investment plan updated')
    })
  })

  afterEach(() => {
    cy.cleanDatabase()
  })
})