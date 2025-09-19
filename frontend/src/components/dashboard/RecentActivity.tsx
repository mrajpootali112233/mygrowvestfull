'use client';

import { motion } from 'framer-motion';
import { mockApiResponses } from '@/mocks/api';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  CheckCircleIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

const getStatusIcon = (status: string, type: string) => {
  if (status === 'approved') {
    return <CheckCircleIcon className="h-5 w-5 text-accent-400" />;
  }
  if (status === 'pending') {
    return <ClockIcon className="h-5 w-5 text-yellow-400" />;
  }
  return type === 'deposit' 
    ? <ArrowUpIcon className="h-5 w-5 text-primary-400" />
    : <ArrowDownIcon className="h-5 w-5 text-secondary-400" />;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'text-accent-400';
    case 'pending':
      return 'text-yellow-400';
    case 'rejected':
      return 'text-red-400';
    default:
      return 'text-white/70';
  }
};

export default function RecentActivity() {
  // Combine deposits and withdrawals for recent activity
  const activities = [
    ...mockApiResponses.deposits.map(d => ({
      ...d,
      type: 'deposit' as const,
    })),
    ...mockApiResponses.withdrawals.map(w => ({
      ...w,
      type: 'withdrawal' as const,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
   .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card"
    >
      <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={`${activity.type}-${activity.id}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {getStatusIcon(activity.status, activity.type)}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white capitalize">
                  {activity.type}
                </p>
                <p className="text-xs text-white/60">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white">
                ${activity.amount.toLocaleString()}
              </p>
              <p className={`text-xs capitalize ${getStatusColor(activity.status)}`}>
                {activity.status}
              </p>
            </div>
          </motion.div>
        ))}
        
        {activities.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/60">No recent activity</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}