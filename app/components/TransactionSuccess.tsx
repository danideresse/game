'use client';

import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TransactionSuccessProps {
  type: 'deposit' | 'withdraw';
  amount: number;
  onClose: () => void;
}

export default function TransactionSuccess({ type, amount, onClose }: TransactionSuccessProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gaming-dark rounded-2xl p-6 md:p-8 max-w-md w-full animate-slideUpAndFade">
        <div className="text-center space-y-4">
          {/* Animated Checkmark */}
          <svg className="success-checkmark" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" />
            <path d="M30 50 L45 65 L70 35" />
          </svg>

          <h2 className="text-2xl font-bold text-primary">
            {type === 'deposit' ? 'Deposit Successful!' : 'Withdrawal Successful!'}
          </h2>
          <p className="text-theme-secondary">
            {amount.toFixed(2)} Birr has been {type === 'deposit' ? 'added to' : 'withdrawn from'} your account
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-lg font-bold transition-all duration-300
            bg-gradient-to-r from-primary to-orange-500 text-white hover:scale-105"
        >
          Done
        </button>
      </div>
    </div>
  );
} 