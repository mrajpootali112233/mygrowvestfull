'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

interface Referral {
  id: number;
  referredUser: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  commissionEarned: number;
  status: 'pending' | 'paid';
  createdAt: string;
}

export default function ReferralsPage() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalEarned: 0,
    pendingCommission: 0,
    paidCommission: 0
  });

  const referralLink = `${window.location.origin}/register?ref=${user?.referralCode}`;

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const [referralsResponse, statsResponse] = await Promise.all([
        api.getReferrals(),
        api.getReferralStats()
      ]);
      setReferrals(referralsResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Join MyGrowVest - Start Your Investment Journey');
    const body = encodeURIComponent(
      `Hi there!

I wanted to share an amazing investment opportunity with you. MyGrowVest offers great returns on investment with professional management.

Use my referral link to get started: ${referralLink}

Best regards!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `Join MyGrowVest and start your investment journey! Use my referral link: ${referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`);
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(
      `Join MyGrowVest and start earning with smart investments! Use my referral link: ${referralLink} #Investment #Crypto #Earnings`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`);
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
          <h1 className="text-4xl font-bold text-white mb-4">Referral Program</h1>
          <p className="text-gray-300">Earn commissions by referring new users to MyGrowVest</p>
        </motion.div>

        {/* Stats Cards */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM9 9a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.totalReferrals}</div>
            <div className="text-sm text-gray-400">Total Referrals</div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">${stats.totalEarned.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Earned</div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">${stats.pendingCommission.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Pending Commission</div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">${stats.paidCommission.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Paid Commission</div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Referral Link Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 rounded-2xl border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Your Referral Link</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Referral Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white text-sm"
                  />
                  <button
                    onClick={copyReferralLink}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      copied
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'btn-secondary'
                    }`}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Your Referral Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={user?.referralCode || ''}
                    readOnly
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white text-lg font-mono text-center"
                  />
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <h4 className="text-blue-400 font-medium mb-2">How It Works</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Share your referral link with friends</li>
                  <li>• Earn 5% commission on their deposits</li>
                  <li>• Get 2% on their investment profits</li>
                  <li>• No limit on referrals or earnings</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-medium mb-4">Share Your Link</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={shareViaEmail}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-500/30 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Email
                  </button>

                  <button
                    onClick={shareViaWhatsApp}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl hover:bg-green-500/30 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.886 3.488"/>
                    </svg>
                    WhatsApp
                  </button>

                  <button
                    onClick={shareViaTwitter}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-xl hover:bg-sky-500/30 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Twitter
                  </button>

                  <button
                    onClick={copyReferralLink}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-500/30 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Commission Structure */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 rounded-2xl border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Commission Structure</h2>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Deposit Commission</h3>
                  <span className="text-2xl font-bold text-blue-400">5%</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Earn 5% commission on every deposit your referrals make
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Profit Commission</h3>
                  <span className="text-2xl font-bold text-green-400">2%</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Earn 2% commission on the investment profits your referrals generate
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-600/20 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Bonus Tiers</h3>
                  <span className="text-xl font-bold text-yellow-400">+10%</span>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>10+ Referrals:</span>
                    <span className="text-yellow-400">+10% bonus</span>
                  </div>
                  <div className="flex justify-between">
                    <span>25+ Referrals:</span>
                    <span className="text-yellow-400">+25% bonus</span>
                  </div>
                  <div className="flex justify-between">
                    <span>50+ Referrals:</span>
                    <span className="text-yellow-400">+50% bonus</span>
                  </div>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <h4 className="text-red-400 font-medium mb-2">Important Notes</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Commissions are paid weekly</li>
                  <li>• Minimum commission payout: $10</li>
                  <li>• Fraudulent referrals will void commissions</li>
                  <li>• Only active investments generate profit commissions</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Referral History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Referral History</h2>
          
          {referrals.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl border border-white/20 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM9 9a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Referrals Yet</h3>
              <p className="text-gray-400">Start sharing your referral link to earn commissions!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full glass-card rounded-2xl border border-white/20">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-6 text-gray-300 font-medium">Referred User</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-medium">Date</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-medium">Commission</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((referral, index) => (
                    <motion.tr
                      key={referral.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (index + 1) }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <div className="text-white font-medium">
                            {referral.referredUser.firstName} {referral.referredUser.lastName}
                          </div>
                          <div className="text-gray-400 text-sm">{referral.referredUser.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-green-400 font-medium">
                          ${referral.commissionEarned.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          referral.status === 'paid'
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        }`}>
                          {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}