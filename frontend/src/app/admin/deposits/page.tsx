'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Deposit {
  id: number;
  userId: number;
  amount: number;
  planType: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  receiptUrl: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  processingNotes?: string;
  rejectionReason?: string;
}

interface ApprovalModalProps {
  deposit: Deposit;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (depositId: number, notes: string) => void;
  onReject: (depositId: number, reason: string) => void;
}

function ApprovalModal({ deposit, isOpen, onClose, onApprove, onReject }: ApprovalModalProps) {
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!action) return;
    
    setLoading(true);
    try {
      if (action === 'approve') {
        await onApprove(deposit.id, notes);
        toast.success('Deposit approved successfully');
      } else {
        await onReject(deposit.id, reason);
        toast.success('Deposit rejected');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to process deposit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=\"fixed inset-0 bg-black/50 flex items-center justify-center z-50\">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className=\"glass-card p-6 rounded-2xl border border-white/20 max-w-md w-full mx-4\"
      >
        <div className=\"flex items-center justify-between mb-6\">
          <h3 className=\"text-xl font-bold text-white\">
            {action === 'approve' ? 'Approve' : action === 'reject' ? 'Reject' : 'Review'} Deposit
          </h3>
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
          <div className=\"glass-card p-4 rounded-xl border border-white/10 mb-4\">
            <div className=\"grid grid-cols-2 gap-4 text-sm\">
              <div>
                <span className=\"text-gray-400\">User:</span>
                <p className=\"text-white font-medium\">{deposit.user.firstName} {deposit.user.lastName}</p>
                <p className=\"text-gray-300\">{deposit.user.email}</p>
              </div>
              <div>
                <span className=\"text-gray-400\">Amount:</span>
                <p className=\"text-white font-medium\">${deposit.amount.toLocaleString()}</p>
                <span className=\"text-gray-400\">Plan:</span>
                <p className=\"text-white font-medium capitalize\">{deposit.planType}</p>
              </div>
            </div>
          </div>

          <div className=\"mb-4\">
            <label className=\"block text-gray-300 text-sm font-medium mb-2\">
              Receipt Image
            </label>
            <div className=\"glass-card p-4 rounded-xl border border-white/10\">
              <img
                src={deposit.receiptUrl}
                alt=\"Deposit Receipt\"
                className=\"w-full max-h-64 object-contain rounded-lg\"
              />
            </div>
          </div>
        </div>

        {!action && (
          <div className=\"flex gap-3\">
            <button
              onClick={() => setAction('approve')}
              className=\"flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors\"
            >
              Approve
            </button>
            <button
              onClick={() => setAction('reject')}
              className=\"flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition-colors\"
            >
              Reject
            </button>
          </div>
        )}

        {action === 'approve' && (
          <div>
            <label className=\"block text-gray-300 text-sm font-medium mb-2\">
              Processing Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className=\"w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 mb-4\"
              placeholder=\"Add any notes about the approval...\"
              rows={3}
            />
            <div className=\"flex gap-3\">
              <button
                onClick={() => setAction(null)}
                className=\"flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition-colors\"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className=\"flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50\"
              >
                {loading ? 'Processing...' : 'Confirm Approval'}
              </button>
            </div>
          </div>
        )}

        {action === 'reject' && (
          <div>
            <label className=\"block text-gray-300 text-sm font-medium mb-2\">
              Rejection Reason *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className=\"w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 mb-4\"
              placeholder=\"Please provide a reason for rejection...\"
              rows={3}
              required
            />
            <div className=\"flex gap-3\">
              <button
                onClick={() => setAction(null)}
                className=\"flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition-colors\"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !reason.trim()}
                className=\"flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50\"
              >
                {loading ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function DepositsManagement() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    fetchDeposits();
    fetchCsrfToken();
  }, [filter]);

  const fetchCsrfToken = async () => {
    try {
      const response = await api.get('/auth/csrf-token');
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  };

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/deposits?status=${filter === 'all' ? '' : filter}`);
      setDeposits(response.data);
    } catch (error) {
      toast.error('Failed to fetch deposits');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (depositId: number, notes: string) => {
    try {
      await api.post(
        `/admin/deposits/${depositId}/approve`,
        { notes },
        { headers: { 'X-CSRF-Token': csrfToken } }
      );
      fetchDeposits();
    } catch (error) {
      throw error;
    }
  };

  const handleReject = async (depositId: number, reason: string) => {
    try {
      await api.post(
        `/admin/deposits/${depositId}/reject`,
        { reason },
        { headers: { 'X-CSRF-Token': csrfToken } }
      );
      fetchDeposits();
    } catch (error) {
      throw error;
    }
  };

  const openModal = (deposit: Deposit) => {
    setSelectedDeposit(deposit);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedDeposit(null);
    setShowModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-500/20';
      case 'APPROVED': return 'text-green-400 bg-green-500/20';
      case 'REJECTED': return 'text-red-400 bg-red-500/20';
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
          <h1 className=\"text-4xl font-bold text-white mb-4\">Deposits Management</h1>
          <p className=\"text-gray-300\">Review and approve deposit requests</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className=\"mb-6\"
        >
          <div className=\"flex gap-2\">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors capitalize
                  ${filter === status 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Deposits Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className=\"glass-card p-6 rounded-2xl border border-white/20\"
        >
          {loading ? (
            <div className=\"flex items-center justify-center py-12\">
              <div className=\"animate-spin rounded-full h-8 w-8 border-b-2 border-white\"></div>
            </div>
          ) : deposits.length === 0 ? (
            <div className=\"text-center py-12\">
              <p className=\"text-gray-400\">No deposits found for the selected filter.</p>
            </div>
          ) : (
            <div className=\"overflow-x-auto\">
              <table className=\"w-full\">
                <thead>
                  <tr className=\"border-b border-white/10\">
                    <th className=\"text-left py-3 px-4 text-gray-300 font-medium\">User</th>
                    <th className=\"text-left py-3 px-4 text-gray-300 font-medium\">Amount</th>
                    <th className=\"text-left py-3 px-4 text-gray-300 font-medium\">Plan</th>
                    <th className=\"text-left py-3 px-4 text-gray-300 font-medium\">Status</th>
                    <th className=\"text-left py-3 px-4 text-gray-300 font-medium\">Date</th>
                    <th className=\"text-left py-3 px-4 text-gray-300 font-medium\">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit) => (
                    <tr key={deposit.id} className=\"border-b border-white/5 hover:bg-white/5\">
                      <td className=\"py-4 px-4\">
                        <div>
                          <p className=\"text-white font-medium\">
                            {deposit.user.firstName} {deposit.user.lastName}
                          </p>
                          <p className=\"text-gray-400 text-sm\">{deposit.user.email}</p>
                        </div>
                      </td>
                      <td className=\"py-4 px-4\">
                        <span className=\"text-white font-medium\">
                          ${deposit.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className=\"py-4 px-4\">
                        <span className=\"text-gray-300 capitalize\">{deposit.planType}</span>
                      </td>
                      <td className=\"py-4 px-4\">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deposit.status)}`}>
                          {deposit.status}
                        </span>
                      </td>
                      <td className=\"py-4 px-4\">
                        <span className=\"text-gray-300\">
                          {new Date(deposit.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className=\"py-4 px-4\">
                        <button
                          onClick={() => openModal(deposit)}
                          className=\"bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors\"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Approval Modal */}
        {selectedDeposit && (
          <ApprovalModal
            deposit={selectedDeposit}
            isOpen={showModal}
            onClose={closeModal}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </div>
    </div>
  );
}"