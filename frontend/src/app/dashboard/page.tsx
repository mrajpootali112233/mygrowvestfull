'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { mockApiResponses } from '@/mocks/api';
import StatsCards from '@/components/dashboard/StatsCards';
import ProfitChart from '@/components/dashboard/ProfitChart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(mockApiResponses.dashboardStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Simulate loading dashboard data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="loading-dots text-white">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="glass-card">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-white/70">
            Here's your investment portfolio overview
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Charts and Activity */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProfitChart />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </DashboardLayout>
  );
}