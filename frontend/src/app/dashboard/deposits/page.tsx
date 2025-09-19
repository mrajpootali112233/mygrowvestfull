'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import FileUpload from '@/components/FileUpload';
import { DocumentIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const depositSchema = z.object({
  amount: z.number().min(10, 'Minimum deposit is $10'),
  method: z.string().min(1, 'Please select a deposit method'),
  txId: z.string().min(1, 'Transaction ID is required'),
  proof: z.any().refine((file) => file && file.length > 0, 'Please upload proof of payment'),
});

type DepositFormData = z.infer<typeof depositSchema>;

const BINANCE_DEPOSIT_ID = process.env.NEXT_PUBLIC_BINANCE_DEPOSIT_ID || '941704599';

export default function DepositsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema),
  });

  const selectedMethod = watch('method');

  const onSubmit = async (data: DepositFormData) => {
    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('amount', data.amount.toString());
      formData.append('method', data.method);
      formData.append('txId', data.txId);
      if (uploadedFile) {
        formData.append('proof', uploadedFile);
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Deposit request submitted successfully!');
      
    } catch (error) {
      console.error('Deposit submission error:', error);
      alert('Failed to submit deposit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setValue('proof', [file]);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="glass-card">
          <h1 className="text-3xl font-bold text-white mb-2">Make a Deposit</h1>
          <p className="text-white/70">
            Fund your account to start investing
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Deposit Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card"
            >
              <h2 className="text-xl font-semibold text-white mb-6">Deposit Details</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="form-label">Amount (USD)</label>
                  <input
                    {...register('amount', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="10"
                    className="form-input"
                    placeholder="Enter amount"
                  />
                  {errors.amount && (
                    <p className="form-error">{errors.amount.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Deposit Method</label>
                  <select
                    {...register('method')}
                    className="form-input"
                  >
                    <option value="">Select deposit method</option>
                    <option value="binance">Binance P2P</option>
                    <option value="usdt_trc20">USDT (TRC20)</option>
                    <option value="bitcoin">Bitcoin</option>
                    <option value="ethereum">Ethereum</option>
                  </select>
                  {errors.method && (
                    <p className="form-error">{errors.method.message}</p>
                  )}
                </div>

                {selectedMethod === 'binance' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-primary-500/20 border border-primary-400/30 rounded-lg p-4"
                  >
                    <div className="flex items-start">
                      <InformationCircleIcon className="h-5 w-5 text-primary-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-primary-300 mb-2">
                          Binance P2P Instructions
                        </h4>
                        <div className="text-sm text-white/80 space-y-2">
                          <p>1. Open Binance app and go to P2P trading</p>
                          <p>2. Use our Binance ID: <span className="font-mono bg-black/30 px-2 py-1 rounded">{BINANCE_DEPOSIT_ID}</span></p>
                          <p>3. Send your deposit amount via P2P</p>
                          <p>4. Enter the transaction ID below</p>
                          <p>5. Upload screenshot of the completed transaction</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div>
                  <label className="form-label">Transaction ID</label>
                  <input
                    {...register('txId')}
                    type="text"
                    className="form-input"
                    placeholder="Enter transaction ID"
                  />
                  {errors.txId && (
                    <p className="form-error">{errors.txId.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Proof of Payment</label>
                  <FileUpload
                    onFileSelect={handleFileUpload}
                    accept="image/*,.pdf"
                    maxSize={5 * 1024 * 1024} // 5MB
                  />
                  {uploadedFile && (
                    <div className="mt-2 flex items-center text-sm text-white/70">
                      <DocumentIcon className="h-4 w-4 mr-2" />
                      {uploadedFile.name}
                    </div>
                  )}
                  {errors.proof && (
                    <p className="form-error">{errors.proof.message}</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <span className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  ) : (
                    'Submit Deposit Request'
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Deposit Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Deposit Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Minimum Deposit:</span>
                  <span className="text-white">$10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Processing Time:</span>
                  <span className="text-white">5-15 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Deposit Fee:</span>
                  <span className="text-accent-400">Free</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Important Notes</h3>
              <div className="space-y-2 text-sm text-white/80">
                <p>• All deposits are manually reviewed for security</p>
                <p>• Make sure to upload clear proof of payment</p>
                <p>• Contact support if your deposit is not processed within 24 hours</p>
                <p>• Only send from your verified account</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}