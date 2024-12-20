'use client';

import { useState, useEffect } from 'react';
import Timer from '../../components/Timer';
import GameResult from '../../components/GameResult';
import GameOver from '../../components/GameOver';

export default function Game2() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'retry' | null>(null);
  const [winningAmount, setWinningAmount] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winningNumber, setWinningNumber] = useState(0);
  const [timerReset, setTimerReset] = useState(false);

  const generateRandomNumbers = () => {
    const nums = new Set<number>();
    while(nums.size < 10) {
      nums.add(Math.floor(Math.random() * 100) + 1);
    }
    return Array.from(nums).sort((a, b) => a - b);
  };

  useEffect(() => {
    setNumbers(generateRandomNumbers());
  }, []);

  const handleBet = () => {
    const results = ['win', 'lose', 'retry'] as const;
    const randomResult = results[Math.floor(Math.random() * results.length)];
    
    if (randomResult === 'win') {
      setWinningAmount(Math.floor(Math.random() * 200) + 100);
    }
    
    setGameResult(randomResult);
  };

  const handleTimeUp = () => {
    setIsGameOver(true);
    setWinningNumber(Math.floor(Math.random() * 100) + 1);
    setWinningAmount(Math.floor(Math.random() * 200) + 100);
  };

  const resetGame = () => {
    setIsGameOver(false);
    setSelectedNumber(null);
    setGameResult(null);
    setWinningAmount(0);
    setNumbers(generateRandomNumbers());
    setTimerReset(!timerReset);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 animate-slide-up max-w-2xl mx-auto">
      <div className="text-center mb-8 card p-4 md:p-6">
        <Timer 
          initialTime={60} 
          onTimeUp={handleTimeUp}
          isReset={timerReset}
        />
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
                : 'bg-white dark:bg-gaming-dark text-orange-500 dark:text-white hover:bg-primary/10'}
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

      {gameResult && (
        <GameResult 
          result={gameResult} 
          onClose={() => setGameResult(null)}
          selectedNumber={selectedNumber || undefined}
          winningAmount={winningAmount}
        />
      )}

      {isGameOver && (
        <GameOver
          winningNumber={winningNumber}
          winningAmount={winningAmount}
          onClose={resetGame}
        />
      )}
    </div>
  );
} 