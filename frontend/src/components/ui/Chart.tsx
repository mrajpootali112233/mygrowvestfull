'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartProps {
  type: 'line' | 'bar' | 'doughnut';
  data: any;
  options?: any;
  height?: number;
  className?: string;
}

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#e5e7eb',
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      titleColor: '#f9fafb',
      bodyColor: '#e5e7eb',
      borderColor: 'rgba(59, 130, 246, 0.5)',
      borderWidth: 1,
      cornerRadius: 12,
      displayColors: true,
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(context.parsed.y);
          }
          return label;
        }
      }
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: '#9ca3af',
      },
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: '#9ca3af',
        callback: function(value: any) {
          return '$' + value.toLocaleString();
        }
      },
    },
  },
};

export default function Chart({ type, data, options = {}, height = 300, className = '' }: ChartProps) {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...(options.plugins || {}),
    },
  };

  const chartProps = {
    ref: chartRef,
    data,
    options: mergedOptions,
  };

  return (
    <div className={`glass-card p-6 rounded-2xl border border-white/20 ${className}`}>
      <div style={{ height: `${height}px` }}>
        {type === 'line' && <Line {...chartProps} />}
        {type === 'bar' && <Bar {...chartProps} />}
        {type === 'doughnut' && (
          <Doughnut 
            {...chartProps} 
            options={{
              ...mergedOptions,
              scales: undefined, // Doughnut charts don't use scales
            }} 
          />
        )}
      </div>
    </div>
  );
}

// Pre-configured chart components
export function ProfitChart({ data, className = '' }: { data?: any; className?: string }) {
  const defaultData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Profit',
        data: [1200, 1900, 3000, 5000, 4500, 6200],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  return (
    <Chart 
      type="line" 
      data={data || defaultData} 
      className={className}
      options={{
        plugins: {
          title: {
            display: true,
            text: 'Profit Over Time',
            color: '#f9fafb',
            font: {
              size: 18,
              weight: 'bold',
            },
            padding: 20,
          },
        },
      }}
    />
  );
}

export function PortfolioChart({ data, className = '' }: { data?: any; className?: string }) {
  const defaultData = {
    labels: ['Active Investments', 'Available Balance', 'Total Profit'],
    datasets: [
      {
        data: [45000, 15000, 8500],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <Chart 
      type="doughnut" 
      data={data || defaultData} 
      className={className}
      height={250}
      options={{
        plugins: {
          title: {
            display: true,
            text: 'Portfolio Distribution',
            color: '#f9fafb',
            font: {
              size: 18,
              weight: 'bold',
            },
            padding: 20,
          },
        },
      }}
    />
  );
}

export function EarningsChart({ data, className = '' }: { data?: any; className?: string }) {
  const defaultData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Weekly Earnings',
        data: [1200, 1500, 1800, 2100],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  return (
    <Chart 
      type="bar" 
      data={data || defaultData} 
      className={className}
      options={{
        plugins: {
          title: {
            display: true,
            text: 'Weekly Earnings',
            color: '#f9fafb',
            font: {
              size: 18,
              weight: 'bold',
            },
            padding: 20,
          },
        },
      }}
    />
  );
}