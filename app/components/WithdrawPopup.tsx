'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import TransactionSuccess from './TransactionSuccess';
import { useGame } from '../context/GameContext';

interface WithdrawPopupProps {
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

export default function WithdrawPopup({ onClose, onSuccess }: WithdrawPopupProps) {
  const { balance } = useGame();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [processedAmount, setProcessedAmount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const withdrawAmount = parseFloat(amount);

    // Validate minimum withdrawal amount
    if (withdrawAmount < 100) {
      setError('Minimum withdrawal amount is 100 Birr');
      return;
    }

    // Check if user has sufficient balance
    if (withdrawAmount > balance) {
      setError(`Insufficient balance. Your current balance is ${balance} Birr`);
      return;
    }

    setIsProcessing(true);

    try {
      // Here you would typically handle the actual withdrawal process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessedAmount(withdrawAmount);
      onSuccess(withdrawAmount);
      setShowSuccess(true);
    } catch (error) {
      console.error('Withdrawal failed:', error);
      setError('Withdrawal failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <TransactionSuccess 
        type="withdraw"
        amount={processedAmount}
        onClose={onClose}
      />
    );
  }

  const presetAmounts = [100, 200, 500, 1000];  // Updated preset amounts to start from 100

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
          <h2 className="text-2xl font-bold text-primary">Withdraw</h2>
          <p className="text-theme-secondary mt-1">Withdraw funds to your Telebirr account</p>
          <p className="text-sm text-primary mt-2">Available Balance: {balance} Birr</p>
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
              placeholder="Enter amount (min. 100 Birr)"
              required
              min="100"
              max={balance}
              step="1"
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                disabled={preset > balance}
                className={`p-2 rounded-lg transition-colors ${
                  preset > balance 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-primary/10 hover:bg-primary/20 text-primary'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isProcessing || !amount || parseFloat(amount) > balance}
              className={`
                w-full py-3 rounded-lg font-bold transition-all duration-300
                bg-gradient-to-r from-primary to-orange-500 text-white
                ${isProcessing || !amount || parseFloat(amount) > balance 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105'}
              `}
            >
              {isProcessing ? 'Processing...' : 'Withdraw'}
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