'use client';

import { useState, useEffect } from 'react';

interface TimerProps {
  initialTime: number;
  onTimeUp?: () => void;
  isReset?: boolean;
}

export default function Timer({ initialTime, onTimeUp, isReset }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  
  useEffect(() => {
    if (isReset) {
      setTimeLeft(initialTime);
    }
  }, [isReset, initialTime]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [onTimeUp, isReset]);
  
  return (
    <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${timeLeft <= 10 ? 'animate-pulse text-red-500' : 'text-primary'}`}>
      {timeLeft}s
    </div>
  );
}
