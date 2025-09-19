'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-400/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="inline-flex items-center px-4 py-2 bg-primary-500/20 border border-primary-400/30 rounded-full text-primary-300 text-sm font-medium mb-8">
              <SparklesIcon className="h-4 w-4 mr-2" />
              Trusted by 15,000+ investors worldwide
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Grow Your{' '}
            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent animate-glow">
              Wealth
            </span>
            <br />
            With Confidence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed"
          >
            Secure, transparent investment platform offering up to 7% daily returns
            with flexible plans designed for every investor.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link 
              href="/login" 
              className="btn-primary inline-flex items-center text-lg px-8 py-4"
            >
              Start Investing Today
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/plans" 
              className="btn-outline inline-flex items-center text-lg px-8 py-4"
            >
              View Investment Plans
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            <div className="glass-card text-center">
              <div className="text-2xl font-bold text-primary-400 mb-2">98.5%</div>
              <div className="text-white/70 text-sm">Success Rate</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-2xl font-bold text-secondary-400 mb-2">$2.5M+</div>
              <div className="text-white/70 text-sm">Total Invested</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-2xl font-bold text-accent-400 mb-2">45+</div>
              <div className="text-white/70 text-sm">Countries</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
        </div>
      </motion.div>
    </section>
  );
}