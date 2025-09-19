'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export default function AnimatedCounter({ 
  end, 
  duration = 2000, 
  prefix = '', 
  suffix = '', 
  className = '',
  decimals = 0 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easedProgress * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [end, duration]);

  const formatNumber = (num: number) => {
    return decimals > 0 ? num.toFixed(decimals) : num.toLocaleString();
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {prefix}{formatNumber(count)}{suffix}
    </motion.span>
  );
}

// Pre-built counter variants
export function CurrencyCounter({ amount, className = '' }: { amount: number; className?: string }) {
  return (
    <AnimatedCounter
      end={amount}
      prefix="$"
      decimals={2}
      className={className}
    />
  );
}

export function PercentageCounter({ percentage, className = '' }: { percentage: number; className?: string }) {
  return (
    <AnimatedCounter
      end={percentage}
      suffix="%"
      decimals={1}
      className={className}
    />
  );
}

export function NumberCounter({ number, className = '' }: { number: number; className?: string }) {
  return (
    <AnimatedCounter
      end={number}
      className={className}
    />
  );
}