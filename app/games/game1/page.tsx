'use client';

import { useState, useEffect } from 'react';
import Timer from '../../components/Timer';
import GameResult from '../../components/GameResult';

export default function Game1() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'retry' | null>(null);
  
  useEffect(() => {
    // Generate 5 random numbers between 1 and 100
    const generateRandomNumbers = () => {
      const nums = new Set<number>();
      while(nums.size < 5) {
        nums.add(Math.floor(Math.random() * 100) + 1);
      }
      return Array.from(nums).sort((a, b) => a - b);
    };
    
    setNumbers(generateRandomNumbers());
  }, []);

  const handleBet = () => {
    // Simulate random result
    const results = ['win', 'lose', 'retry'] as const;
    const randomResult = results[Math.floor(Math.random() * results.length)];
    setGameResult(randomResult);
  };
  
  return (
    <div className="p-4 sm:p-6 md:p-8 animate-slide-up max-w-2xl mx-auto">
      <div className="text-center mb-8 card p-4 md:p-6">
        <Timer initialTime={60} />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => setSelectedNumber(num)}
            className={`
              card p-4 md:p-6 text-lg sm:text-xl md:text-2xl font-bold 
              hover:scale-105 transition-all
              ${selectedNumber === num 
                ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-#f5a001 shadow-glow' 
                : 'bg-white dark:bg-gaming-dark text-orange-500 hover:bg-primary/10'}
            `}>
            {num}
          </button>
        ))}
      </div>
      
      <div className="mt-8 max-w-md mx-auto">
        <button 
          className="btn-primary w-full text-sm sm:text-base"
          disabled={!selectedNumber}
          onClick={handleBet}>
          Choose
        </button>
      </div>

      <GameResult 
        result={gameResult} 
        onClose={() => setGameResult(null)} 
      />
    </div>
  );
}
