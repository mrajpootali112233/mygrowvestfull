'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Stat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

interface AnimatedCountersProps {
  stats: Stat[];
}

function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!hasAnimated) {
      motionValue.set(value);
      setHasAnimated(true);
    }
  }, [motionValue, value, hasAnimated]);

  useEffect(() => {
    return springValue.onChange((latest) => {
      setDisplayValue(latest);
    });
  }, [springValue]);

  const formatValue = (val: number) => {
    if (suffix === '%') {
      return val.toFixed(1);
    }
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M';
    }
    if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'K';
    }
    return Math.round(val).toString();
  };

  return (
    <span className="stat-value">
      {prefix}{formatValue(displayValue)}{suffix}
    </span>
  );
}

export default function AnimatedCounters({ stats }: AnimatedCountersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="stat-card"
        >
          <AnimatedCounter
            value={stat.value}
            prefix={stat.prefix}
            suffix={stat.suffix}
          />
          <div className="stat-label">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}