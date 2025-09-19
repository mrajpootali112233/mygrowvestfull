export interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
  isSuspended: boolean;
  referralCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export interface Plan {
  id: number;
  name: string;
  dailyPercent: number;
  lockPeriodDays: number;
  refundablePrincipal: boolean;
  createdAt: string;
}

export interface Investment {
  id: number;
  userId: number;
  planId: number;
  amount: number;
  profitAccrued: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Deposit {
  id: number;
  userId: number;
  amount: number;
  method: string;
  txId?: string;
  proofUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedBy?: number;
}

export interface Withdrawal {
  id: number;
  userId: number;
  amount: number;
  methodDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedBy?: number;
}

export interface SupportTicket {
  id: number;
  userId: number;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  adminReplies?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalBalance: number;
  totalInvested: number;
  totalProfit: number;
  activeInvestments: number;
  referralCount: number;
  referralEarnings: number;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label?: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string | string[];
    tension?: number;
    borderWidth?: number;
  }>;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FormErrors {
  [key: string]: string | undefined;
}