'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface GameResultProps {
  result: 'win' | 'lose' | 'retry' | null;
  onClose: () => void;
  selectedNumber?: number;
  winningAmount?: number;
}

export default function GameResult({ result, onClose, selectedNumber, winningAmount }: GameResultProps) {
  useEffect(() => {
    if (result === 'win') {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FFD700', '#FFA500']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FFD700', '#FFA500']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [result]);

  if (!result) return null;

  const resultConfig = {
    win: {
      title: 'Congratulations!',
      message: `You won ${winningAmount?.toFixed(2)} Birr with number ${selectedNumber}!`,
      color: 'from-green-500 to-emerald-500',
      icon: '🎉'
    },
    lose: {
      title: 'Better Luck Next Time',
      message: `Your number was ${selectedNumber}`,
      color: 'from-red-500 to-rose-500',
      icon: '😔'
    },
    retry: {
      title: 'Connection Error',
      message: 'Please try again',
      color: 'from-yellow-500 to-amber-500',
      icon: '🔄'
    }
  }[result];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`
        relative bg-gradient-to-r ${resultConfig.color}
        rounded-2xl p-6 md:p-8 text-white text-center
        transform transition-all duration-300
        animate-slideUpAndFade max-w-md w-full
        shadow-2xl
      `}>
        <div className="text-6xl mb-4 animate-bounce">
          {resultConfig.icon}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          {resultConfig.title}
        </h2>
        <p className="text-white/90 mb-6">
          {resultConfig.message}
        </p>
        <button
          onClick={onClose}
          className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg
            transition-all duration-300 hover:scale-105"
        >
          Close
        </button>
      </div>
    </div>
  );
} 