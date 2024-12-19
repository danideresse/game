'use client';

import { useState, useEffect } from 'react';
import Timer from '../../components/Timer';

export default function Game1() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [numbers, setNumbers] = useState<number[]>([]);
  
  useEffect(() => {
    // Generate 5 random numbers between 1 and 99
    const generateRandomNumbers = () => {
      const nums = new Set<number>();
      while(nums.size < 5) {
        nums.add(Math.floor(Math.random() * 99) + 1);
      }
      return Array.from(nums).sort((a, b) => a - b);
    };
    
    setNumbers(generateRandomNumbers());
  }, []);
  
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
                ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-glow' 
                : 'text-primary hover:text-white'}
            `}>
            {num}
          </button>
        ))}
      </div>
      
      <div className="mt-8 max-w-md mx-auto">
        <button 
          className="btn-primary w-full text-sm sm:text-base"
          disabled={!selectedNumber}
          onClick={() => {/* Implement bet logic */}}>
          Place Bet
        </button>
      </div>
    </div>
  );
} 