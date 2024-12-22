'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface TransactionSuccessProps {
  amount: number;
  points: number;
  onClose: () => void;
}

export default function TransactionSuccess({ amount, points, onClose }: TransactionSuccessProps) {
  useEffect(() => {
    // Celebration effect
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00FF00', '#32CD32', '#008000']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#00FF00', '#32CD32', '#008000']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 md:p-8 
        text-white text-center transform transition-all duration-300 animate-slideUpAndFade 
        max-w-md w-full shadow-2xl">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Transaction Successful!
        </h2>
        <div className="space-y-2 mb-6">
          <p className="text-white/90">
            Deposited: <span className="font-bold">{amount.toFixed(2)} Birr</span>
          </p>
          <p className="text-white/90">
            Points Added: <span className="font-bold">{points.toFixed(2)} Points</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg
            transition-all duration-300 hover:scale-105"
        >
          Continue
        </button>
      </div>
    </div>
  );
} 