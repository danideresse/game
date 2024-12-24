'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface GameResultProps {
  result: 'win' | 'lose' | 'retry' | null;
  onClose: () => void;
  selectedNumber?: number;
  winningAmount?: number;
  winningNumber?: number;
}

export default function GameResult({ result, onClose, selectedNumber, winningAmount, winningNumber }: GameResultProps) {
  useEffect(() => {
    if (result === 'win') {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FFD700', '#FFA500', '#FF4500']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FFD700', '#FFA500', '#FF4500']
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
      title: 'Congratulations! 🎉',
      message: `You won ${winningAmount?.toFixed(2)} birr!`,
      color: 'from-green-500 to-emerald-500',
      description: 'Amazing job! Keep playing to win more!'
    },
    lose: {
      title: 'Better Luck Next Time 😔',
      message: `The winning number was ${winningNumber}`,
      color: 'from-red-500 to-rose-500',
      description: 'Don\'t give up! Try another round!'
    },
    retry: {
      title: 'System Error 🔄',
      message: 'Please try again',
      color: 'from-yellow-500 to-amber-500',
      description: 'We encountered a technical issue. Please try again.'
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
          {result === 'win' ? '🎉' : result === 'lose' ? '😔' : '🔄'}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          {resultConfig.title}
        </h2>
        <p className="text-white/90 mb-2">
          {resultConfig.message}
        </p>
        <p className="text-white/75 text-sm mb-6">
          {resultConfig.description}
        </p>
        <button
          onClick={onClose}
          className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg
            transition-all duration-300 hover:scale-105"
        >
          {result === 'retry' ? 'Try Again' : 'Close'}
        </button>
      </div>
    </div>
  );
} 