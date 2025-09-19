'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

interface Plan {
  id: number;
  name: string;
  minimumAmount: number;
  maximumAmount: number;
  dailyInterestRate: number;
  durationDays: number;
  totalReturn: number;
  description: string;
}

interface UserPlan {
  id: number;
  planId: number;
  amount: number;
  isActive: boolean;
  activatedAt: string;
  expiresAt: string;
  currentProfit: number;
  plan: Plan;
}

export default function PlansPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [activationAmount, setActivationAmount] = useState('');
  const [showActivationModal, setShowActivationModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansResponse, userPlansResponse] = await Promise.all([
        api.getPlans(),
        api.getUserPlans()
      ]);
      setPlans(plansResponse.data);
      setUserPlans(userPlansResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivatePlan = async (planId: number, amount: number) => {
    if (!user) return;
    
    try {
      setActivating(planId);
      await api.activatePlan(planId, amount);
      await fetchData(); // Refresh data
      setShowActivationModal(false);
      setSelectedPlan(null);
      setActivationAmount('');
    } catch (error: any) {
      console.error('Failed to activate plan:', error);
      alert(error.response?.data?.message || 'Failed to activate plan');
    } finally {
      setActivating(null);
    }
  };

  const openActivationModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setActivationAmount(plan.minimumAmount.toString());
    setShowActivationModal(true);
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
          <h1 className="text-4xl font-bold text-white mb-4">Investment Plans</h1>
          <p className="text-gray-300">Choose and activate your investment plans</p>
        </motion.div>

        {/* Active Plans */}
        {userPlans.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Your Active Plans</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userPlans.map((userPlan) => (
                <motion.div
                  key={userPlan.id}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card p-6 rounded-2xl border border-white/20"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-white">{userPlan.plan.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      userPlan.isActive 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {userPlan.isActive ? 'Active' : 'Expired'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Investment:</span>
                      <span className="text-white font-medium">${userPlan.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Profit:</span>
                      <span className="text-green-400 font-medium">${userPlan.currentProfit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Daily Rate:</span>
                      <span className="text-white font-medium">{userPlan.plan.dailyInterestRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expires:</span>
                      <span className="text-white font-medium">
                        {new Date(userPlan.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {userPlan.isActive && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (userPlan.currentProfit / (userPlan.amount * userPlan.plan.totalReturn / 100)) * 100)}%`
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Progress to maximum return
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Available Plans */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Available Plans</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-card p-8 rounded-2xl border border-white/20 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full -mr-16 -mt-16"></div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-300 mb-6">{plan.description}</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Daily Interest:</span>
                      <span className="text-green-400 font-bold text-lg">{plan.dailyInterestRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white font-medium">{plan.durationDays} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Return:</span>
                      <span className="text-blue-400 font-bold text-lg">{plan.totalReturn}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Min Investment:</span>
                      <span className="text-white font-medium">${plan.minimumAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Max Investment:</span>
                      <span className="text-white font-medium">${plan.maximumAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => openActivationModal(plan)}
                    disabled={activating === plan.id}
                    className="w-full btn-primary py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
                  >
                    {activating === plan.id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Activating...
                      </div>
                    ) : (
                      'Activate Plan'
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Activation Modal */}
        {showActivationModal && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowActivationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-8 rounded-2xl border border-white/20 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Activate {selectedPlan.name}</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-300 mb-2">Investment Amount ($)</label>
                  <input
                    type="number"
                    min={selectedPlan.minimumAmount}
                    max={selectedPlan.maximumAmount}
                    value={activationAmount}
                    onChange={(e) => setActivationAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="Enter amount"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Min: ${selectedPlan.minimumAmount.toLocaleString()} - Max: ${selectedPlan.maximumAmount.toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <h4 className="text-blue-400 font-medium mb-2">Investment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Daily Profit:</span>
                      <span className="text-white">
                        ${(parseFloat(activationAmount || '0') * selectedPlan.dailyInterestRate / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Return ({selectedPlan.durationDays} days):</span>
                      <span className="text-green-400 font-medium">
                        ${(parseFloat(activationAmount || '0') * selectedPlan.totalReturn / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowActivationModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleActivatePlan(selectedPlan.id, parseFloat(activationAmount))}
                  disabled={!activationAmount || parseFloat(activationAmount) < selectedPlan.minimumAmount || parseFloat(activationAmount) > selectedPlan.maximumAmount}
                  className="flex-1 btn-primary py-3 rounded-xl font-medium disabled:opacity-50"
                >
                  Activate Plan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}