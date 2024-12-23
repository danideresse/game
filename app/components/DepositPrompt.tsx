'use client';

import { useRouter } from 'next/navigation';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface DepositPromptProps {
  onClose: () => void;
}

export default function DepositPrompt({ onClose }: DepositPromptProps) {
  const router = useRouter();

  const handleDeposit = () => {
    router.push('/profile');
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gaming-dark rounded-2xl p-6 md:p-8 max-w-md w-full animate-slideUpAndFade shadow-xl">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
            <CurrencyDollarIcon className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-primary">
            Insufficient Points
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            You need points to play this game. Deposit now to start playing!
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={handleDeposit}
            className="w-full py-3 rounded-lg font-bold transition-all duration-300
              bg-gradient-to-r from-primary to-orange-500 text-white hover:scale-105"
          >
            Deposit Now
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg font-bold transition-all duration-300
              bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300
              hover:bg-gray-200 dark:hover:bg-white/10"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
} 