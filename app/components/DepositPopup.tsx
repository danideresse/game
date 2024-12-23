'use client';

import { useState, useEffect } from 'react';
import TransactionSuccess from './TransactionSuccess';

interface DepositPopupProps {
  onClose: () => void;
  onSuccess: (points: number) => void;
}

export default function DepositPopup({ onClose, onSuccess }: DepositPopupProps) {
  const [amount, setAmount] = useState<string>('');
  const [points, setPoints] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const POINT_MULTIPLIER = 25;
  const MIN_DEPOSIT = 5;

  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    setPoints(numAmount * POINT_MULTIPLIER);
  }, [amount]);

  const handleDeposit = () => {
    const numAmount = parseFloat(amount);
    if (numAmount < MIN_DEPOSIT) {
      return;
    }
    setShowSuccess(true);
    onSuccess(points);
  };

  if (showSuccess) {
    return (
      <TransactionSuccess 
        amount={parseFloat(amount)}
        points={points}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gaming-dark/95 rounded-2xl p-6 md:p-8 text-white text-center
        transform transition-all duration-300 animate-slideUpAndFade max-w-md w-full shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">
          Deposit with Telebirr
        </h2>
        
        <div className="space-y-6">
          <div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-100 dark:bg-white/5 rounded-lg p-3 pl-10 
                text-gray-300 dark:text-white"
              placeholder="Enter amount"
              min={MIN_DEPOSIT}
              required
            />
            {parseFloat(amount) > 0 && parseFloat(amount) < MIN_DEPOSIT && (
              <p className="text-red-500 text-sm mt-2">
                Minimum deposit is {MIN_DEPOSIT} Birr
              </p>
            )}
          </div>

          <div className="bg-white/5 rounded-lg p-4 space-y-2">
            <div className="text-sm text-white/70 border-b border-white/10 pb-2">
              Conversion Rate: 1 Birr = {POINT_MULTIPLIER} Points
            </div>
            <p className="text-sm text-white/70 mb-1">Your Points</p>
            <div className="text-xl font-bold text-primary">
              {points.toLocaleString()} Points
            </div>
            <div className="text-xs text-white/50 mt-1">
              ({amount ? parseFloat(amount).toLocaleString() : '0'} Birr × {POINT_MULTIPLIER})
            </div>
          </div>

          <button
            onClick={handleDeposit}
            disabled={!amount || parseFloat(amount) < MIN_DEPOSIT}
            className={`
              w-full py-3 rounded-lg font-bold transition-all duration-300
              ${(!amount || parseFloat(amount) < MIN_DEPOSIT)
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:scale-105'}
            `}
          >
            Deposit Now
          </button>
        </div>
      </div>
    </div>
  );
} 