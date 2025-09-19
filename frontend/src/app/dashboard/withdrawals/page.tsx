'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

interface Withdrawal {
  id: number;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  processedAt?: string;
  adminNote?: string;
}

export default function WithdrawalsPage() {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [errors, setErrors] = useState<{ amount?: string; walletAddress?: string }>({});

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const response = await api.getWithdrawals();
      setWithdrawals(response.data);
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { amount?: string; walletAddress?: string } = {};
    
    if (!amount || parseFloat(amount) < 20) {
      newErrors.amount = 'Minimum withdrawal amount is $20';
    }
    
    if (!walletAddress || walletAddress.length < 10) {
      newErrors.walletAddress = 'Please enter a valid wallet address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      await api.createWithdrawal(parseFloat(amount), walletAddress);
      await fetchWithdrawals(); // Refresh data
      setAmount('');
      setWalletAddress('');
      setErrors({});
    } catch (error: any) {
      console.error('Failed to submit withdrawal:', error);
      alert(error.response?.data?.message || 'Failed to submit withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
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
          <h1 className="text-4xl font-bold text-white mb-4">Withdrawals</h1>
          <p className="text-gray-300">Request withdrawals and track their status</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Withdrawal Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 rounded-2xl border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Request Withdrawal</h2>
            
            <form onSubmit={handleSubmitWithdrawal} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Amount ($)</label>
                <input
                  type="number"
                  min="20"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Enter withdrawal amount"
                />
                {errors.amount && (
                  <p className="text-red-400 text-sm mt-1">{errors.amount}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">Minimum withdrawal: $20</p>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Wallet Address</label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Enter your wallet address"
                />
                {errors.walletAddress && (
                  <p className="text-red-400 text-sm mt-1">{errors.walletAddress}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">Ensure your wallet address is correct</p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <h4 className="text-blue-400 font-medium mb-2">Withdrawal Information</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Minimum withdrawal amount: $20</li>
                  <li>• Processing time: 24-48 hours</li>
                  <li>• Withdrawals are processed during business hours</li>
                  <li>• Double-check your wallet address before submitting</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Withdrawal Request'
                )}
              </button>
            </form>
          </motion.div>

          {/* User Balance Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 rounded-2xl border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Account Balance</h2>
            
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Available Balance</div>
                <div className="text-4xl font-bold text-green-400 mb-1">
                  ${user?.balance?.toLocaleString() || '0.00'}
                </div>
                <div className="text-sm text-gray-400">Ready for withdrawal</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-xs text-gray-400 mb-1">Total Earned</div>
                  <div className="text-lg font-semibold text-blue-400">
                    ${user?.totalEarned?.toLocaleString() || '0.00'}
                  </div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-xs text-gray-400 mb-1">Total Withdrawn</div>
                  <div className="text-lg font-semibold text-purple-400">
                    ${user?.totalWithdrawn?.toLocaleString() || '0.00'}
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <h4 className="text-yellow-400 font-medium mb-2">Important Notice</h4>
                <p className="text-sm text-gray-300">
                  Withdrawals are subject to verification and may take 24-48 hours to process. 
                  Ensure your wallet address is correct as transactions cannot be reversed.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Withdrawal History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Withdrawal History</h2>
          
          {withdrawals.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl border border-white/20 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Withdrawals Yet</h3>
              <p className="text-gray-400">Your withdrawal history will appear here once you make your first request.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {withdrawals.map((withdrawal, index) => (
                <motion.div
                  key={withdrawal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                  className="glass-card p-6 rounded-2xl border border-white/20"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-lg font-semibold text-white mr-3">
                          ${withdrawal.amount.toLocaleString()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(withdrawal.status)}`}>
                          {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Requested: {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </div>
                      {withdrawal.processedAt && (
                        <div className="text-sm text-gray-400">
                          Processed: {new Date(withdrawal.processedAt).toLocaleDateString()}
                        </div>
                      )}
                      {withdrawal.adminNote && (
                        <div className="text-sm text-yellow-400 mt-2">
                          Note: {withdrawal.adminNote}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}