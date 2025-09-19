'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  PlusIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

const actions = [
  {
    title: 'Make Deposit',
    description: 'Add funds to your account',
    href: '/dashboard/deposits',
    icon: ArrowUpIcon,
    color: 'bg-accent-500/20 hover:bg-accent-500/30',
    iconColor: 'text-accent-400',
  },
  {
    title: 'New Investment',
    description: 'Start a new investment plan',
    href: '/dashboard/investments',
    icon: PlusIcon,
    color: 'bg-primary-500/20 hover:bg-primary-500/30',
    iconColor: 'text-primary-400',
  },
  {
    title: 'Request Withdrawal',
    description: 'Withdraw your earnings',
    href: '/dashboard/withdrawals',
    icon: ArrowDownIcon,
    color: 'bg-secondary-500/20 hover:bg-secondary-500/30',
    iconColor: 'text-secondary-400',
  },
  {
    title: 'View Earnings',
    description: 'Check your profit history',
    href: '/dashboard/earnings',
    icon: CurrencyDollarIcon,
    color: 'bg-yellow-500/20 hover:bg-yellow-500/30',
    iconColor: 'text-yellow-400',
  },
];

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card"
    >
      <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
      <div className="space-y-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
          >
            <Link
              href={action.href}
              className={`block p-4 rounded-lg transition-all duration-300 ${action.color} hover:scale-105`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white">{action.title}</p>
                  <p className="text-xs text-white/60">{action.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}