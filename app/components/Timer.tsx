'use client';

import { useState, useEffect } from 'react';

interface TimerProps {
  initialTime: number;
  onTimeUp: () => void;
  isReset: boolean;
  isStarted: boolean;
}

export default function Timer({ initialTime, onTimeUp, isReset, isStarted }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTimeLeft(initialTime);
    setIsRunning(false);
  }, [isReset, initialTime]);

  useEffect(() => {
    if (isStarted) {
      setIsRunning(true);
    }
  }, [isStarted]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      onTimeUp();
      setIsRunning(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, isRunning, onTimeUp]);

  return (
    <div className="text-4xl font-bold text-primary animate-pulse">
      {!isStarted ? 'Choose a Number' : `${timeLeft}s`}
    </div>
  );
}
