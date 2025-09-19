'use client';

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

interface AdminStats {
  totalUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalInvestments: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  activeInvestments: number;
}

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalInvestments: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    activeInvestments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
      return;
    }

    if (user && user.role === 'admin') {
      fetchAdminStats();
    }
  }, [user, isLoading, router]);

  const fetchAdminStats = async () => {
    try {
      // Mock admin stats for now
      setStats({
        totalUsers: 1234,
        totalDeposits: 567890,
        totalWithdrawals: 234567,
        totalInvestments: 890123,
        pendingDeposits: 45,
        pendingWithdrawals: 23,
        activeInvestments: 156,
      });
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl border border-white/20 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">You don't have permission to access this page.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-primary px-6 py-3 rounded-xl"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-gray-300">Manage users, deposits, withdrawals, and investments</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8"
        >
          <div className="glass-card p-6 rounded-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Users</div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">${stats.totalDeposits.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Deposits</div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">${stats.totalWithdrawals.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Withdrawals</div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">${stats.totalInvestments.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Investments</div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8"
        >
          <div className="glass-card p-6 rounded-2xl border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Pending Deposits</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-orange-400">{stats.pendingDeposits}</span>
              <button className="btn-primary px-4 py-2 rounded-xl text-sm">
                Review
              </button>
            </div>
            <p className="text-sm text-gray-400">Deposits awaiting approval</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Pending Withdrawals</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-red-400">{stats.pendingWithdrawals}</span>
              <button className="btn-primary px-4 py-2 rounded-xl text-sm">
                Review
              </button>
            </div>
            <p className="text-sm text-gray-400">Withdrawals awaiting approval</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Active Investments</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-green-400">{stats.activeInvestments}</span>
              <button className="btn-primary px-4 py-2 rounded-xl text-sm">
                Manage
              </button>
            </div>
            <p className="text-sm text-gray-400">Currently active investments</p>
          </div>
        </motion.div>

        {/* Admin Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 rounded-2xl border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Admin Tools</h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <button className="flex flex-col items-center p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
              <div className="p-3 bg-blue-500/20 rounded-xl mb-3 group-hover:bg-blue-500/30 transition-colors">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <span className="text-white font-medium">Manage Users</span>
              <span className="text-gray-400 text-sm text-center mt-1">View and manage user accounts</span>
            </button>

            <button className="flex flex-col items-center p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
              <div className="p-3 bg-green-500/20 rounded-xl mb-3 group-hover:bg-green-500/30 transition-colors">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white font-medium">Deposits</span>
              <span className="text-gray-400 text-sm text-center mt-1">Review deposit requests</span>
            </button>

            <button className="flex flex-col items-center p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
              <div className="p-3 bg-purple-500/20 rounded-xl mb-3 group-hover:bg-purple-500/30 transition-colors">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <span className="text-white font-medium">Withdrawals</span>
              <span className="text-gray-400 text-sm text-center mt-1">Process withdrawal requests</span>
            </button>

            <button className="flex flex-col items-center p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
              <div className="p-3 bg-yellow-500/20 rounded-xl mb-3 group-hover:bg-yellow-500/30 transition-colors">
                <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-white font-medium">Analytics</span>
              <span className="text-gray-400 text-sm text-center mt-1">View detailed reports</span>
            </button>

            <button className="flex flex-col items-center p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
              <div className="p-3 bg-indigo-500/20 rounded-xl mb-3 group-hover:bg-indigo-500/30 transition-colors">
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-white font-medium">Settings</span>
              <span className="text-gray-400 text-sm text-center mt-1">System configuration</span>
            </button>

            <button className="flex flex-col items-center p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
              <div className="p-3 bg-red-500/20 rounded-xl mb-3 group-hover:bg-red-500/30 transition-colors">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white font-medium">Support</span>
              <span className="text-gray-400 text-sm text-center mt-1">Manage support tickets</span>
            </button>

            <button className="flex flex-col items-center p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
              <div className="p-3 bg-orange-500/20 rounded-xl mb-3 group-hover:bg-orange-500/30 transition-colors">
                <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white font-medium">Daily Profits</span>
              <span className="text-gray-400 text-sm text-center mt-1">Run daily profit calculation</span>
            </button>

            <button className="flex flex-col items-center p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
              <div className="p-3 bg-teal-500/20 rounded-xl mb-3 group-hover:bg-teal-500/30 transition-colors">
                <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-white font-medium">Reports</span>
              <span className="text-gray-400 text-sm text-center mt-1">Generate system reports</span>
            </button>
          </div>
        </motion.div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 glass-card p-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-yellow-400 font-medium mb-1">Admin Dashboard Note</h4>
              <p className="text-gray-300 text-sm">
                This is a skeleton implementation of the admin dashboard. Individual admin tools and 
                detailed management pages can be implemented based on specific requirements.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}