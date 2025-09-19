'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { mockApiResponses } from '@/mocks/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ProfitChart() {
  const chartRef = useRef<ChartJS<'line'> | null>(null);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: 'Daily Profit Overview',
        color: '#ffffff',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3b82f6',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
          callback: function(value: any) {
            return '$' + value;
          },
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };

  const data = {
    ...mockApiResponses.profitChart,
    datasets: mockApiResponses.profitChart.datasets.map(dataset => ({
      ...dataset,
      fill: true,
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: '#0ea5e9',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
    })),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card h-96"
    >
      <Line ref={chartRef} options={options} data={data} />
    </motion.div>
  );
}