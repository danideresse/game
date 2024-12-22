'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface CodeSentSuccessProps {
  phone: string;
  onClose: () => void;
}

export default function CodeSentSuccess({ phone, onClose }: CodeSentSuccessProps) {
  useEffect(() => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10B981', '#34D399', '#6EE7B7']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10B981', '#34D399', '#6EE7B7']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Auto close after animation
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 md:p-8 
        text-white text-center transform transition-all duration-300 animate-slideUpAndFade 
        max-w-md w-full shadow-2xl">
        <div className="text-6xl mb-4">📱</div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Verification Code Sent!
        </h2>
        <div className="space-y-2 mb-6">
          <p className="text-white/90">
            We've sent a verification code to:
          </p>
          <p className="font-bold text-lg">
            {phone}
          </p>
          <p className="text-sm text-white/75 mt-4">
            Please check your messages for the code
          </p>
        </div>
      </div>
    </div>
  );
} 