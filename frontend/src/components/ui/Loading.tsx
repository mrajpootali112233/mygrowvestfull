'use client';

import { motion } from 'framer-motion';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  type?: 'spinner' | 'dots' | 'pulse';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export default function Loading({ size = 'md', type = 'spinner', text, className = '' }: LoadingProps) {
  if (type === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className={`animate-spin rounded-full border-2 border-white/20 border-t-white ${sizeClasses[size]}`}></div>
        {text && <p className="mt-2 text-sm text-gray-400">{text}</p>}
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`bg-white rounded-full ${size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'}`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        {text && <p className="mt-2 text-sm text-gray-400">{text}</p>}
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <motion.div
          className={`bg-white rounded-full ${sizeClasses[size]}`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
        {text && <p className="mt-2 text-sm text-gray-400">{text}</p>}
      </div>
    );
  }

  return null;
}

// Pre-built loading variants
export function PageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <Loading size="lg" text="Loading..." />
    </div>
  );
}

export function CardLoading() {
  return (
    <div className="glass-card p-8 rounded-2xl border border-white/20 flex items-center justify-center">
      <Loading size="md" type="dots" />
    </div>
  );
}

export function ButtonLoading({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  return <Loading size={size} type="spinner" className="inline-flex" />;
}