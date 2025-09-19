'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon, ChartBarIcon, ShieldCheckIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import PlanCard from '@/components/PlanCard';
import AnimatedCounters from '@/components/AnimatedCounters';
import TestimonialCarousel from '@/components/TestimonialCarousel';

const plans = [
  {
    id: 1,
    name: 'Plan A',
    dailyPercent: 3.0,
    lockPeriodDays: 30,
    refundablePrincipal: true,
    features: ['3% Daily Returns', '30 Days Lock Period', 'Refundable Principal', '24/7 Support'],
    recommended: false,
  },
  {
    id: 2,
    name: 'Plan B',
    dailyPercent: 7.0,
    lockPeriodDays: 90,
    refundablePrincipal: false,
    features: ['7% Daily Returns', '90 Days Lock Period', 'Higher Returns', 'Priority Support'],
    recommended: true,
  },
];

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Secure & Transparent',
    description: 'Your investments are protected with bank-level security and full transparency.',
  },
  {
    icon: ChartBarIcon,
    title: 'Proven Returns',
    description: 'Consistent daily returns backed by our expert trading algorithms.',
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Flexible Plans',
    description: 'Choose from multiple investment plans that suit your financial goals.',
  },
];

const stats = [
  { label: 'Total Invested', value: 2500000, prefix: '$', suffix: '+' },
  { label: 'Active Investors', value: 15000, suffix: '+' },
  { label: 'Countries Served', value: 45, suffix: '+' },
  { label: 'Success Rate', value: 98.5, suffix: '%' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900">
      <Header />
      
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Thousands of Investors
            </h2>
            <p className="text-xl text-white/70">
              Join a growing community of successful investors
            </p>
          </motion.div>

          <AnimatedCounters stats={stats} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose MyGrowVest?
            </h2>
            <p className="text-xl text-white/70">
              Experience the future of investment with our cutting-edge platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-full mb-6">
                  <feature.icon className="h-8 w-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-white/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Plans Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Investment Plans
            </h2>
            <p className="text-xl text-white/70">
              Choose the perfect plan for your investment goals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PlanCard plan={plan} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link href="/plans" className="btn-primary inline-flex items-center">
              View All Plans
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialCarousel />

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Investing?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join thousands of successful investors and start growing your wealth today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="btn-primary">
                Get Started Now
              </Link>
              <Link href="/about" className="btn-outline">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}