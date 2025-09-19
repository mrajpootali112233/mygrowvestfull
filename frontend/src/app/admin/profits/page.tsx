'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface ProfitRun {
  id: number;
  profitDate: string;
  totalAmount: number;
  totalInvestments: number;
  usersAffected: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
}

interface ProfitCalculationResult {
  totalInvestments: number;
  totalProfitAmount: number;
  usersAffected: number;
  estimatedDuration: string;
  breakdown: {
    planType: string;
    count: number;
    totalAmount: number;
    profitAmount: number;
  }[];
}

interface ProfitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string, dryRun: boolean) => void;
}

function ProfitCalculationModal({ isOpen, onClose, onConfirm }: ProfitModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [dryRun, setDryRun] = useState(true);
  const [dryRunResult, setDryRunResult] = useState<ProfitCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
      setDryRun(true);
      setDryRunResult(null);
      fetchCsrfToken();
    }
  }, [isOpen]);

  const fetchCsrfToken = async () => {
    try {
      const response = await api.get('/auth/csrf-token');
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  };

  const handleDryRun = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(
        '/admin/profit/calculate',
        { date: selectedDate, dryRun: true },
        { headers: { 'X-CSRF-Token': csrfToken } }
      );
      setDryRunResult(response.data);
      toast.success('Dry run completed');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Dry run failed');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    onConfirm(selectedDate, dryRun);
  };

  if (!isOpen) return null;

  return (
    <div className=\"fixed inset-0 bg-black/50 flex items-center justify-center z-50\">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className=\"glass-card p-6 rounded-2xl border border-white/20 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto\"
      >
        <div className=\"flex items-center justify-between mb-6\">
          <h3 className=\"text-xl font-bold text-white\">Profit Distribution</h3>
          <button
            onClick={onClose}
            className=\"text-gray-400 hover:text-white transition-colors\"
          >
            <svg className=\"w-6 h-6\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">
              <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M6 18L18 6M6 6l12 12\" />
            </svg>
          </button>
        </div>

        <div className=\"mb-6\">
          <div className=\"grid gap-4 mb-4\">
            <div>
              <label className=\"block text-gray-300 text-sm font-medium mb-2\">
                Profit Date
              </label>
              <input
                type=\"date\"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className=\"w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500\"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className=\"flex items-center gap-3\">
              <label className=\"flex items-center cursor-pointer\">
                <input
                  type=\"checkbox\"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  className=\"sr-only\"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                  ${dryRun ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}>
                  {dryRun && (
                    <svg className=\"w-3 h-3 text-white\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">
                      <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M5 13l4 4L19 7\" />
                    </svg>
                  )}
                </div>
                <span className=\"ml-2 text-gray-300\">Dry Run (Preview Only)</span>
              </label>
            </div>
          </div>

          {selectedDate && (
            <div className=\"flex gap-3 mb-4\">
              <button
                onClick={handleDryRun}
                disabled={loading}
                className=\"bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50\"
              >
                {loading ? 'Running...' : 'Preview Calculation'}
              </button>
            </div>
          )}

          {dryRunResult && (
            <div className=\"glass-card p-4 rounded-xl border border-white/10 mb-4\">
              <h4 className=\"text-white font-medium mb-3\">Calculation Preview</h4>
              
              <div className=\"grid grid-cols-2 gap-4 mb-4\">
                <div className=\"text-center\">
                  <div className=\"text-2xl font-bold text-blue-400\">{dryRunResult.totalInvestments}</div>
                  <div className=\"text-sm text-gray-400\">Active Investments</div>
                </div>
                <div className=\"text-center\">
                  <div className=\"text-2xl font-bold text-green-400\">${dryRunResult.totalProfitAmount.toLocaleString()}</div>
                  <div className=\"text-sm text-gray-400\">Total Profit</div>
                </div>
                <div className=\"text-center\">
                  <div className=\"text-2xl font-bold text-purple-400\">{dryRunResult.usersAffected}</div>
                  <div className=\"text-sm text-gray-400\">Users Affected</div>
                </div>
                <div className=\"text-center\">
                  <div className=\"text-2xl font-bold text-yellow-400\">{dryRunResult.estimatedDuration}</div>
                  <div className=\"text-sm text-gray-400\">Est. Duration</div>
                </div>
              </div>

              <div>
                <h5 className=\"text-white font-medium mb-2\">Breakdown by Plan</h5>
                <div className=\"space-y-2\">
                  {dryRunResult.breakdown.map((plan, index) => (
                    <div key={index} className=\"flex justify-between items-center bg-white/5 p-3 rounded-lg\">
                      <div>
                        <span className=\"text-white font-medium capitalize\">{plan.planType}</span>
                        <span className=\"text-gray-400 text-sm ml-2\">({plan.count} investments)</span>
                      </div>
                      <div className=\"text-right\">
                        <div className=\"text-white font-medium\">${plan.profitAmount.toLocaleString()}</div>
                        <div className=\"text-gray-400 text-sm\">${plan.totalAmount.toLocaleString()} invested</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className=\"flex gap-3\">
          <button
            onClick={onClose}
            className=\"flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition-colors\"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedDate || loading}
            className=\"flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50\"
          >
            {dryRun ? 'Run Preview' : 'Execute Calculation'}
          </button>
        </div>

        {!dryRun && (
          <div className=\"mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl\">
            <div className=\"flex items-center gap-2 text-red-400\">
              <svg className=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">
                <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z\" />
              </svg>
              <span className=\"font-medium\">Warning</span>
            </div>
            <p className=\"text-red-300 text-sm mt-1\">
              This will execute the actual profit distribution. This action cannot be undone.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function ProfitManagement() {
  const [profitRuns, setProfitRuns] = useState<ProfitRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    fetchProfitRuns();
    fetchCsrfToken();
  }, []);

  const fetchCsrfToken = async () => {
    try {
      const response = await api.get('/auth/csrf-token');
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  };

  const fetchProfitRuns = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/profit/history');
      setProfitRuns(response.data);
    } catch (error) {
      toast.error('Failed to fetch profit runs');
    } finally {
      setLoading(false);
    }
  };

  const handleProfitCalculation = async (date: string, dryRun: boolean) => {
    try {
      const response = await api.post(
        '/admin/profit/calculate',
        { date, dryRun },
        { headers: { 'X-CSRF-Token': csrfToken } }
      );
      
      if (dryRun) {
        toast.success('Dry run completed successfully');
      } else {
        toast.success('Profit calculation executed successfully');
        fetchProfitRuns(); // Refresh the list
      }
      
      setShowModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Profit calculation failed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-500/20';
      case 'COMPLETED': return 'text-green-400 bg-green-500/20';
      case 'FAILED': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8\">
      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className=\"mb-8\"
        >
          <h1 className=\"text-4xl font-bold text-white mb-4\">Profit Distribution</h1>
          <p className=\"text-gray-300\">Manage daily profit calculations and distributions</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className=\"mb-8\"
        >
          <div className=\"glass-card p-6 rounded-2xl border border-white/20\">
            <div className=\"flex items-center justify-between mb-4\">
              <h2 className=\"text-xl font-bold text-white\">Daily Profit Calculation</h2>
              <button
                onClick={() => setShowModal(true)}
                className=\"bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2\"
              >
                <svg className=\"w-5 h-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">
                  <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z\" />
                </svg>
                Run Profit Calculation
              </button>
            </div>
            <p className=\"text-gray-300\">
              Execute daily profit distribution for active investments. Use dry run to preview results before execution.
            </p>
          </div>
        </motion.div>

        {/* Profit Runs History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className=\"glass-card p-6 rounded-2xl border border-white/20\"
        >
          <h2 className=\"text-xl font-bold text-white mb-6\">Profit Distribution History</h2>
          
          {loading ? (
            <div className=\"flex items-center justify-center py-12\">
              <div className=\"animate-spin rounded-full h-8 w-8 border-b-2 border-white\"></div>
            </div>
          ) : profitRuns.length === 0 ? (
            <div className=\"text-center py-12\">
              <div className=\"p-4 bg-orange-500/20 rounded-xl mb-4 inline-block\">
                <svg className=\"w-8 h-8 text-orange-400\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">
                  <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z\" />
                </svg>
              </div>
              <p className=\"text-gray-400 mb-4\">No profit distributions have been run yet.</p>
              <button
                onClick={() => setShowModal(true)}
                className=\"bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors\"
              >
                Run First Calculation
              </button>
            </div>
          ) : (
            <div className=\"overflow-x-auto\">
              <table className=\"w-full\">
                <thead>
                  <tr className=\"border-b border-white/10\">
                    <th className=\"text-left py-3 px-4 text-gray-300 font-medium\">Date</th>
                    <th className=\"text-left py-3 px-4 text-gray-300 font-medium\">Total Amount</th>
                    <th className=\"text-left py-3 px-4 text-gray-300 font-medium\">Investments</th>
                    <th className=\"text-left py-3 px-4 text-gray-300 font-medium\">Users</th>
                    <th className=\"text-left py-3 px-4 text-gray-300 font-medium\">Status</th>
                    <th className=\"text-left py-3 px-4 text-gray-300 font-medium\">Executed</th>
                  </tr>
                </thead>
                <tbody>
                  {profitRuns.map((run) => (
                    <tr key={run.id} className=\"border-b border-white/5 hover:bg-white/5\">
                      <td className=\"py-4 px-4\">
                        <span className=\"text-white font-medium\">
                          {new Date(run.profitDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className=\"py-4 px-4\">
                        <span className=\"text-green-400 font-medium\">
                          ${run.totalAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className=\"py-4 px-4\">
                        <span className=\"text-blue-400 font-medium\">
                          {run.totalInvestments}
                        </span>
                      </td>
                      <td className=\"py-4 px-4\">
                        <span className=\"text-purple-400 font-medium\">
                          {run.usersAffected}
                        </span>
                      </td>
                      <td className=\"py-4 px-4\">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(run.status)}`}>
                          {run.status}
                        </span>
                      </td>
                      <td className=\"py-4 px-4\">
                        <span className=\"text-gray-300\">
                          {new Date(run.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Profit Calculation Modal */}
        <ProfitCalculationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleProfitCalculation}
        />
      </div>
    </div>
  );
}"