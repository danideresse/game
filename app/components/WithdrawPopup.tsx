'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useGame } from '../context/GameContext';
import WithdrawSuccess from './WithdrawSuccess';

interface WithdrawPopupProps {
  onClose: () => void;
  onSuccess: (points: number, amount: number) => void;
}

export default function WithdrawPopup({ onClose, onSuccess }: WithdrawPopupProps) {
  const { balance } = useGame();
  const [points, setPoints] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const POINT_TO_BIRR = 0.04;
  const COMMISSION_RATE = 0.05;
  const MIN_WITHDRAW_BIRR = 100;
  const MIN_POINTS = MIN_WITHDRAW_BIRR / POINT_TO_BIRR;

  useEffect(() => {
    const numPoints = parseFloat(points) || 0;
    
    // Validate points against balance
    if (numPoints > balance) {
      setError(`You only have ${balance.toFixed(2)} points available`);
    } else if (numPoints > 0 && numPoints < MIN_POINTS) {
      setError(`Minimum withdrawal is ${MIN_WITHDRAW_BIRR} Birr (${MIN_POINTS} Points)`);
    } else {
      setError('');
    }

    const calculatedAmount = numPoints * POINT_TO_BIRR;
    setAmount(calculatedAmount);
    setFinalAmount(calculatedAmount * (1 - COMMISSION_RATE));
  }, [points, balance]);

  const handleWithdraw = () => {
    const numPoints = parseFloat(points);
    if (numPoints <= balance && amount >= MIN_WITHDRAW_BIRR) {
      onSuccess(numPoints, finalAmount);
      setShowSuccess(true);
    }
  };

  if (showSuccess) {
    return (
      <WithdrawSuccess 
        points={parseFloat(points)}
        amount={finalAmount}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gaming-dark rounded-2xl p-6 md:p-8 max-w-md w-full animate-slideUpAndFade">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-theme-secondary hover:text-primary"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-primary mb-6">Withdraw Points</h2>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-theme-secondary">
                Points to Withdraw
              </label>
              <span className="text-sm text-theme-secondary">
                Available: {balance.toFixed(2)} Points
              </span>
            </div>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full bg-white/5 rounded-lg p-3 text-white"
              placeholder="Enter points"
              min={MIN_POINTS}
              max={balance}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">
                {error}
              </p>
            )}
          </div>

          <div className="bg-white/5 rounded-lg p-4 space-y-3">
            <div className="text-sm text-white/70 border-b border-white/10 pb-2">
              Conversion Details
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Amount in Birr</span>
              <span className="text-primary">{amount.toFixed(2)} Birr</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Commission (5%)</span>
              <span className="text-red-500">-{(amount * COMMISSION_RATE).toFixed(2)} Birr</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
              <span className="text-white/70">Final Amount</span>
              <span className="text-green-500">{finalAmount.toFixed(2)} Birr</span>
            </div>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={!points || parseFloat(points) > balance || amount < MIN_WITHDRAW_BIRR}
            className={`
              w-full py-3 rounded-lg font-bold transition-all duration-300
              ${(!points || parseFloat(points) > balance || amount < MIN_WITHDRAW_BIRR)
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105'}
            `}
          >
            Withdraw Now
          </button>
        </div>
      </div>
    </div>
  );
} 