'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckIcon, StarIcon } from '@heroicons/react/24/solid';

interface Plan {
  id: number;
  name: string;
  dailyPercent: number;
  lockPeriodDays: number;
  refundablePrincipal: boolean;
  features: string[];
  recommended?: boolean;
}

interface PlanCardProps {
  plan: Plan;
}

export default function PlanCard({ plan }: PlanCardProps) {
  const totalReturn = (plan.dailyPercent * plan.lockPeriodDays).toFixed(1);
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className={`glass-card relative overflow-hidden ${
        plan.recommended ? 'ring-2 ring-primary-400/50 shadow-neon' : ''
      }`}
    >
      {plan.recommended && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 text-sm font-semibold rounded-bl-lg">
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 mr-1" />
            Recommended
          </div>
        </div>
      )}

      <div className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
          <div className="text-4xl font-bold text-primary-400 mb-2">
            {plan.dailyPercent}%
          </div>
          <div className="text-white/70 text-sm">Daily Returns</div>
          <div className="mt-4 text-lg text-white/80">
            <span className="font-semibold text-accent-400">{totalReturn}%</span> total return
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Lock Period:</span>
            <span className="text-white font-medium">{plan.lockPeriodDays} days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Principal:</span>
            <span className="text-white font-medium">
              {plan.refundablePrincipal ? 'Refundable' : 'Non-refundable'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Minimum:</span>
            <span className="text-white font-medium">$100</span>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <CheckIcon className="h-5 w-5 text-accent-400 mr-3 flex-shrink-0" />
              <span className="text-white/80 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <Link
          href="/login"
          className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
            plan.recommended
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40'
          }`}
        >
          Choose {plan.name}
        </Link>
      </div>
    </motion.div>
  );
}