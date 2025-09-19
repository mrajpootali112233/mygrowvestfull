import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PlanCard from '@/components/PlanCard';

export const metadata: Metadata = {
  title: 'Investment Plans',
  description: 'Choose from our flexible investment plans designed to maximize your returns with guaranteed daily profits.',
};

const plans = [
  {
    id: 1,
    name: 'Plan A',
    dailyPercent: 3.0,
    lockPeriodDays: 30,
    refundablePrincipal: true,
    features: [
      '3% Daily Returns',
      '30 Days Lock Period',
      'Refundable Principal',
      '24/7 Support',
      'Instant Withdrawals',
      'Mobile App Access'
    ],
    recommended: false,
  },
  {
    id: 2,
    name: 'Plan B',
    dailyPercent: 7.0,
    lockPeriodDays: 90,
    refundablePrincipal: false,
    features: [
      '7% Daily Returns',
      '90 Days Lock Period',
      'Higher Returns',
      'Priority Support',
      'Dedicated Account Manager',
      'Advanced Analytics'
    ],
    recommended: true,
  },
];

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900">
      <Header />
      
      <main className="pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              Investment Plans
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Choose the perfect investment plan for your financial goals. All plans offer guaranteed daily returns and flexible investment options.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          {/* Plan Comparison */}
          <div className="glass-card max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Plan Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-4 px-6">Feature</th>
                    <th className="text-center py-4 px-6">Plan A</th>
                    <th className="text-center py-4 px-6">Plan B</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-4 px-6 text-white/80">Daily Return</td>
                    <td className="py-4 px-6 text-center text-primary-400 font-semibold">3%</td>
                    <td className="py-4 px-6 text-center text-secondary-400 font-semibold">7%</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-4 px-6 text-white/80">Lock Period</td>
                    <td className="py-4 px-6 text-center">30 Days</td>
                    <td className="py-4 px-6 text-center">90 Days</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-4 px-6 text-white/80">Principal</td>
                    <td className="py-4 px-6 text-center text-accent-400">Refundable</td>
                    <td className="py-4 px-6 text-center text-red-400">Non-refundable</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-4 px-6 text-white/80">Minimum Investment</td>
                    <td className="py-4 px-6 text-center">$100</td>
                    <td className="py-4 px-6 text-center">$100</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-white/80">Total Return (End of Term)</td>
                    <td className="py-4 px-6 text-center font-semibold text-primary-400">90%</td>
                    <td className="py-4 px-6 text-center font-semibold text-secondary-400">630%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}