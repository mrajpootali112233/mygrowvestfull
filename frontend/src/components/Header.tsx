'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Plans', href: '/plans' },
  { name: 'Contact', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <header className="relative z-50">
      <nav className="glass border-b border-white/10" aria-label="Global">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <div className="flex lg:flex-1 items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="text-2xl font-bold text-white">MyGrowVest</span>
            </Link>
            
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="nav-link"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href={isAdmin ? '/admin' : '/dashboard'}
                    className="btn-glass"
                  >
                    {isAdmin ? 'Admin Panel' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={logout}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="nav-link">
                    Log in
                  </Link>
                  <Link href="/login" className="btn-primary">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden"
          >
            <div className="fixed inset-0 z-50" />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto glass px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="text-2xl font-bold text-white">MyGrowVest</span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-white/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-white/10"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6">
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <Link
                          href={isAdmin ? '/admin' : '/dashboard'}
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-white/10"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {isAdmin ? 'Admin Panel' : 'Dashboard'}
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setMobileMenuOpen(false);
                          }}
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-white/10 w-full text-left"
                        >
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Link
                          href="/login"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-white/10"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Log in
                        </Link>
                        <Link
                          href="/login"
                          className="btn-primary block text-center"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Get Started
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
}