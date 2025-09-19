'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  referralCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register: registerUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  // Set referral code if present in URL
  useState(() => {
    if (referralCode && !isLogin) {
      setValue('referralCode' as any, referralCode);
    }
  });

  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        const response = await login(data.email, data.password);
        // Redirect based on role
        if (response.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        const registerData = data as RegisterFormData;
        const response = await registerUser(
          registerData.email,
          registerData.password,
          registerData.referralCode
        );
        // Redirect to dashboard after registration
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            MyGrowVest
          </motion.h1>
          <motion.p 
            className="text-white/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isLogin ? 'Welcome back!' : 'Start your investment journey'}
          </motion.p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="form-label">Email Address</label>
            <input
              {...registerForm('email')}
              type="email"
              className="form-input"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="form-error">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Password</label>
            <div className="relative">
              <input
                {...registerForm('password')}
                type={showPassword ? 'text' : 'password'}
                className="form-input pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="form-error">{errors.password.message}</p>
            )}
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="form-label">Confirm Password</label>
                <div className="relative">
                  <input
                    {...registerForm('confirmPassword' as any)}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-input pr-12"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="form-error">{(errors as any).confirmPassword.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Referral Code (Optional)</label>
                <input
                  {...registerForm('referralCode' as any)}
                  type="text"
                  className="form-input"
                  placeholder="Enter referral code"
                  defaultValue={referralCode || ''}
                />
              </div>
            </>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <span className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </motion.button>

          {isLogin && (
            <div className="text-center">
              <Link 
                href="/forgot-password" 
                className="text-sm text-primary-300 hover:text-primary-200 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          )}

          <div className="text-center">
            <p className="text-white/70 text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={switchMode}
                className="text-primary-300 hover:text-primary-200 ml-1 font-medium transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-xs text-white/50 text-center">
            By continuing, you agree to our{' '}
            <Link href="/terms-and-conditions" className="text-primary-300 hover:text-primary-200">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="text-primary-300 hover:text-primary-200">
              Privacy Policy
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}