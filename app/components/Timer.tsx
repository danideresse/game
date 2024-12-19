'use client';

import { useState, useEffect } from 'react';

interface TimerProps {
  initialTime: number;
}

export default function Timer({ initialTime }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${timeLeft <= 10 ? 'animate-pulse text-red-500' : 'text-primary'}`}>
      {timeLeft}s
    </div>
  );
} 