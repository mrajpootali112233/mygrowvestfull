// Mock API responses for development when backend is not available
export const mockApiResponses = {
  // Auth responses
  login: {
    accessToken: 'mock.jwt.token',
    refreshToken: 'mock.refresh.token',
    user: {
      id: 1,
      email: 'user@example.com',
      role: 'user',
    },
  },

  adminLogin: {
    accessToken: 'mock.admin.jwt.token',
    refreshToken: 'mock.admin.refresh.token',
    user: {
      id: 2,
      email: 'admin@example.com',
      role: 'admin',
    },
  },

  register: {
    accessToken: 'mock.jwt.token',
    refreshToken: 'mock.refresh.token',
    user: {
      id: 3,
      email: 'newuser@example.com',
      role: 'user',
    },
  },

  // User data
  user: {
    id: 1,
    email: 'user@example.com',
    role: 'user',
    isSuspended: false,
    referralCode: 'ABC12345',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Investment plans
  plans: [
    {
      id: 1,
      name: 'Plan A',
      dailyPercent: 3.0,
      lockPeriodDays: 30,
      refundablePrincipal: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Plan B',
      dailyPercent: 7.0,
      lockPeriodDays: 90,
      refundablePrincipal: false,
      createdAt: '2024-01-01T00:00:00Z',
    },
  ],

  // Deposits
  deposits: [
    {
      id: 1,
      userId: 1,
      amount: 1000,
      method: 'bank_transfer',
      txId: 'TXN123456',
      proofUrl: 'proof1.jpg',
      status: 'pending',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 2,
      userId: 1,
      amount: 500,
      method: 'crypto',
      txId: 'TXN789012',
      proofUrl: 'proof2.jpg',
      status: 'approved',
      createdAt: '2024-01-10T15:30:00Z',
    },
  ],

  // Withdrawals
  withdrawals: [
    {
      id: 1,
      userId: 1,
      amount: 200,
      methodDetails: 'Bank: ABC Bank, Account: 1234567890',
      status: 'pending',
      createdAt: '2024-01-20T09:00:00Z',
    },
  ],

  // Investments
  investments: [
    {
      id: 1,
      userId: 1,
      planId: 1,
      amount: 1000,
      profitAccrued: 90,
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-01-31T00:00:00Z',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
    },
  ],

  // Support tickets
  tickets: [
    {
      id: 1,
      userId: 1,
      subject: 'Account Issue',
      message: 'I cannot access my account',
      status: 'open',
      adminReplies: null,
      createdAt: '2024-01-18T14:00:00Z',
    },
  ],

  // Dashboard stats
  dashboardStats: {
    totalBalance: 1290,
    totalInvested: 1000,
    totalProfit: 90,
    activeInvestments: 1,
    referralCount: 3,
    referralEarnings: 25,
  },

  // Charts data
  profitChart: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Daily Profit',
        data: [10, 15, 12, 18, 20, 25],
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
      },
    ],
  },

  investmentChart: {
    labels: ['Plan A', 'Plan B'],
    datasets: [
      {
        data: [70, 30],
        backgroundColor: [
          'rgba(14, 165, 233, 0.8)',
          'rgba(217, 70, 239, 0.8)',
        ],
        borderColor: [
          'rgb(14, 165, 233)',
          'rgb(217, 70, 239)',
        ],
        borderWidth: 2,
      },
    ],
  },
};

export const useMockApi = process.env.NODE_ENV === 'development' && 
  process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

export default mockApiResponses;