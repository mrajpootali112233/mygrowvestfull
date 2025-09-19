'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const footerSections = [
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Investment Plans', href: '/plans' },
      { name: 'Contact', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms & Conditions', href: '/terms-and-conditions' },
      { name: 'Risk Disclosure', href: '/risk-disclosure' },
      { name: 'Compliance', href: '/compliance' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'Security', href: '/security' },
      { name: 'API Documentation', href: '/api-docs' },
      { name: 'Status', href: '/status' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-black/40 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/" className="text-2xl font-bold text-white">
                MyGrowVest
              </Link>
              <p className="mt-4 text-sm text-white/70">
                Empowering investors worldwide with secure, transparent, and profitable investment opportunities.
              </p>
              <div className="mt-6">
                <p className="text-sm text-white/60">
                  📧 support@mygrowvest.com
                </p>
                <p className="text-sm text-white/60 mt-1">
                  📞 +1 (555) 123-4567
                </p>
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={section.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-sm font-semibold leading-6 text-white">
                  {section.title}
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm leading-6 text-white/70 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 border-t border-white/10 pt-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">
                Subscribe to our newsletter
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Get the latest updates on investment opportunities and market insights.
              </p>
            </div>
            <div className="mt-6 sm:flex sm:max-w-md lg:mt-0">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="form-input min-w-0 flex-auto"
                placeholder="Enter your email"
              />
              <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                <button type="submit" className="btn-primary">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 border-t border-white/10 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-xs leading-5 text-white/60">
            &copy; 2024 MyGrowVest. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <Link href="/privacy-policy" className="text-xs text-white/60 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms-and-conditions" className="text-xs text-white/60 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="text-xs text-white/60 hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </motion.div>

        {/* Risk Warning */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 glass-card"
        >
          <p className="text-xs text-white/70 leading-relaxed">
            <strong className="text-white/90">Risk Warning:</strong> Trading and investing in financial markets involves substantial risk of loss and is not suitable for all investors. 
            Past performance does not guarantee future results. Please carefully consider your investment objectives, 
            level of experience, and risk appetite before making any investment decisions.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}