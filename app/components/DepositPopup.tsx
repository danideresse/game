'use client';

import { useState } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';
import TransactionSuccess from './TransactionSuccess';

interface DepositPopupProps {
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

export default function DepositPopup({ onClose, onSuccess }: DepositPopupProps) {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [processedAmount, setProcessedAmount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const depositAmount = parseFloat(amount);
      // Here you would typically handle the actual deposit process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessedAmount(depositAmount);
      onSuccess(depositAmount);
      setShowSuccess(true);
    } catch (error) {
      console.error('Deposit failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <TransactionSuccess 
        type="deposit"
        amount={processedAmount}
        onClose={onClose}
      />
    );
  }

  const presetAmounts = [50, 100, 200, 500, 1000];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gaming-dark rounded-2xl p-6 md:p-8 max-w-md w-full animate-slideUpAndFade">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Deposit</h2>
          <p className="text-theme-secondary mt-1">Add funds to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm text-theme-secondary block mb-2">
              Amount (Birr)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-100 dark:bg-white/5 rounded-lg p-3 
                text-gray-600 dark:text-gray-400"
              placeholder="Enter amount"
              required
              min="10"
              step="1"
            />
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 
                  text-primary transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isProcessing || !amount}
              className={`
                w-full py-3 rounded-lg font-bold transition-all duration-300
                bg-gradient-to-r from-primary to-orange-500 text-white
                ${isProcessing || !amount ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
              `}
            >
              {isProcessing ? 'Processing...' : 'Deposit'}
            </button>

            <div className="text-center">
              <Image
                src="/Telebirr.png"
                alt="Telebirr"
                width={120}
                height={40}
                className="mx-auto"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 