'use client';

import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  TrendingUpIcon, 
  UsersIcon 
} from '@heroicons/react/24/outline';
import { DashboardStats } from '@/types';

interface StatsCardsProps {
  stats: DashboardStats;
}

const statCards = [
  {
    title: 'Total Balance',
    key: 'totalBalance' as keyof DashboardStats,
    icon: CurrencyDollarIcon,
    color: 'text-primary-400',
    bgColor: 'bg-primary-500/20',
    prefix: '$',
  },
  {
    title: 'Total Invested',
    key: 'totalInvested' as keyof DashboardStats,
    icon: TrendingUpIcon,
    color: 'text-secondary-400',
    bgColor: 'bg-secondary-500/20',
    prefix: '$',
  },
  {
    title: 'Total Profit',
    key: 'totalProfit' as keyof DashboardStats,
    icon: ChartBarIcon,
    color: 'text-accent-400',
    bgColor: 'bg-accent-500/20',
    prefix: '$',
  },
  {
    title: 'Referral Earnings',
    key: 'referralEarnings' as keyof DashboardStats,
    icon: UsersIcon,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    prefix: '$',
  },
];

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="glass-card hover:scale-105 transition-transform duration-300"
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-8 w-8 ${card.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/70">{card.title}</p>
              <p className="text-2xl font-bold text-white">
                {card.prefix}{stats[card.key]?.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}