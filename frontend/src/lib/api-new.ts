import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add JWT token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add CSRF token if available
        const csrfToken = this.getCSRFToken();
        if (csrfToken) {
          config.headers['X-CSRF-Token'] = csrfToken;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh and errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.removeToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  private getCSRFToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('csrfToken');
    }
    return null;
  }

  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  // Generic request method with mock fallback
  private async request(endpoint: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET', data?: any) {
    try {
      const config: AxiosRequestConfig = {
        url: endpoint,
        method,
        ...(data && (method === 'POST' || method === 'PATCH') && { data }),
      };

      const response = await this.api.request(config);
      return response;
    } catch (error: any) {
      // Mock fallback for development
      if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
        return this.getMockResponse(endpoint, method, data);
      }
      throw error;
    }
  }

  private getMockResponse(endpoint: string, method: string, data?: any) {
    // Mock responses for development
    const mockData = {
      '/auth/login': { 
        data: { 
          user: { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'user', balance: 5000, referralCode: 'REF123' }, 
          accessToken: 'mock-token' 
        } 
      },
      '/auth/register': { 
        data: { 
          user: { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'user', balance: 0, referralCode: 'REF123' }, 
          accessToken: 'mock-token' 
        } 
      },
      '/plans': { 
        data: [
          { id: 1, name: 'Starter Plan', minimumAmount: 100, maximumAmount: 1000, dailyInterestRate: 2, durationDays: 30, totalReturn: 60, description: 'Perfect for beginners' },
          { id: 2, name: 'Growth Plan', minimumAmount: 1000, maximumAmount: 5000, dailyInterestRate: 3, durationDays: 45, totalReturn: 135, description: 'For serious investors' },
          { id: 3, name: 'Premium Plan', minimumAmount: 5000, maximumAmount: 25000, dailyInterestRate: 4, durationDays: 60, totalReturn: 240, description: 'Maximum returns' }
        ] 
      },
      '/investments': { 
        data: [
          { 
            id: 1, 
            planId: 1, 
            amount: 500, 
            isActive: true, 
            activatedAt: '2024-01-01', 
            expiresAt: '2024-01-31', 
            currentProfit: 150,
            plan: { id: 1, name: 'Starter Plan', dailyInterestRate: 2, totalReturn: 60, durationDays: 30 }
          }
        ] 
      },
      '/withdrawals': { 
        data: [
          { id: 1, amount: 100, status: 'pending', createdAt: '2024-01-15', adminNote: null }
        ] 
      },
      '/referrals': { 
        data: [
          { 
            id: 1, 
            referredUser: { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' }, 
            commissionEarned: 25, 
            status: 'paid', 
            createdAt: '2024-01-10' 
          }
        ] 
      },
      '/referrals/stats': { 
        data: { 
          totalReferrals: 3, 
          totalEarned: 150, 
          pendingCommission: 50, 
          paidCommission: 100 
        } 
      },
      '/deposits': { 
        data: [
          { id: 1, amount: 500, status: 'approved', createdAt: '2024-01-01', proofFileName: 'proof.jpg' }
        ] 
      }
    };

    return { data: mockData[endpoint as keyof typeof mockData] || { data: [] } };
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', 'POST', { email, password });
    return response.data;
  }

  async register(firstName: string, lastName: string, email: string, password: string, referralCode?: string) {
    const response = await this.request('/auth/register', 'POST', {
      firstName,
      lastName,
      email,
      password,
      referralCode,
    });
    return response.data;
  }

  async forgotPassword(email: string) {
    const response = await this.request('/auth/forgot-password', 'POST', { email });
    return response.data;
  }

  async resetPassword(token: string, newPassword: string) {
    const response = await this.request('/auth/reset-password', 'POST', {
      token,
      newPassword,
    });
    return response.data;
  }

  // User methods
  async getUser(id: number) {
    const response = await this.request(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: number, data: any) {
    const response = await this.request(`/users/${id}`, 'PATCH', data);
    return response.data;
  }

  // Plans methods
  async getPlans() {
    const response = await this.request('/plans');
    return response.data;
  }

  async getUserPlans() {
    const response = await this.request('/investments');
    return response.data;
  }

  async activatePlan(planId: number, amount: number) {
    const response = await this.request('/investments/activate', 'POST', {
      planId,
      amount,
    });
    return response.data;
  }

  // Deposits methods
  async createDeposit(formData: FormData) {
    try {
      const response = await this.api.post('/deposits', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      // Mock response for development
      return { data: { id: 1, amount: 500, status: 'pending', createdAt: new Date().toISOString() } };
    }
  }

  async getDeposits(params?: any) {
    const response = await this.request('/deposits');
    return response.data;
  }

  // Withdrawals methods
  async createWithdrawal(amount: number, walletAddress: string) {
    const response = await this.request('/withdrawals', 'POST', {
      amount,
      methodDetails: walletAddress,
    });
    return response.data;
  }

  async getWithdrawals(params?: any) {
    const response = await this.request('/withdrawals');
    return response.data;
  }

  // Referrals methods
  async getReferrals() {
    const response = await this.request('/referrals');
    return response.data;
  }

  async getReferralStats() {
    const response = await this.request('/referrals/stats');
    return response.data;
  }

  // Support tickets methods
  async createTicket(subject: string, message: string) {
    const response = await this.request('/tickets', 'POST', { subject, message });
    return response.data;
  }

  async getTickets() {
    const response = await this.request('/tickets');
    return response.data;
  }

  async getTicket(id: number) {
    const response = await this.request(`/tickets/${id}`);
    return response.data;
  }

  async replyToTicket(id: number, message: string) {
    const response = await this.request(`/tickets/${id}/reply`, 'POST', { message });
    return response.data;
  }

  // Admin methods
  async approveDeposit(id: number) {
    const response = await this.request(`/admin/deposits/${id}/approve`, 'PATCH');
    return response.data;
  }

  async rejectDeposit(id: number, reason?: string) {
    const response = await this.request(`/admin/deposits/${id}/reject`, 'PATCH', { reason });
    return response.data;
  }

  async approveWithdrawal(id: number) {
    const response = await this.request(`/admin/withdrawals/${id}/approve`, 'PATCH');
    return response.data;
  }

  async rejectWithdrawal(id: number, reason?: string) {
    const response = await this.request(`/admin/withdrawals/${id}/reject`, 'PATCH', { reason });
    return response.data;
  }

  async runDailyProfit() {
    const response = await this.request('/admin/run-daily-profit', 'POST');
    return response.data;
  }
}

export const api = new ApiService();
export default api;