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
  const [showPickMessage, setShowPickMessage] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

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
    setShowPickMessage(true);
    setIsLocked(true);
  };

  const handleTimeUp = () => {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    const randomWinningNumber = numbers[randomIndex];
    setWinningNumber(randomWinningNumber);
    setWinningAmount(Math.floor(Math.random() * 200) + 100);
    
    const didWin = selectedNumber === randomWinningNumber;
    setGameResult(didWin ? 'win' : 'lose');
  };

  const handleResultClose = () => {
    setGameResult(null);
    setShowPickMessage(false);
    setIsGameOver(true);
    setSelectedNumber(null);
    setIsLocked(false);
  };

  const resetGame = () => {
    setIsGameOver(false);
    setSelectedNumber(null);
    setGameResult(null);
    setWinningAmount(0);
    setWinningNumber(0);
    setNumbers(generateRandomNumbers());
    setTimerReset(!timerReset);
    setShowPickMessage(false);
    setIsLocked(false);
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
      
      {showPickMessage && selectedNumber && !gameResult && (
        <div className="text-center mb-4 animate-slide-in-right">
          <p className="text-theme-secondary">
            You picked number <span className="text-primary font-bold">{selectedNumber}</span>. Good luck!
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => !isLocked && setSelectedNumber(num)}
            disabled={isLocked}
            className={`
              card p-4 md:p-6 text-lg sm:text-xl md:text-2xl font-bold 
              transition-all
              ${isLocked ? 'cursor-not-allowed opacity-70' : 'hover:scale-110'}
              ${selectedNumber === num 
                ? 'bg-primary dark:bg-primary dark:text-white-500'
                : 'bg-primary white:bg-gaming-dark text-orange-500 white:text-orange-500'}
            `}>
            {num}
          </button>
        ))}
      </div>
      
      <div className="mt-8 max-w-md mx-auto">
        <button 
          className="btn-primary w-full text-sm sm:text-base"
          disabled={!selectedNumber || isLocked}
          onClick={handleBet}>
          {isLocked ? 'Number Locked' : 'Choose'}
        </button>
      </div>

      {gameResult && !isGameOver && (
        <GameResult 
          result={gameResult} 
          onClose={handleResultClose}
          selectedNumber={selectedNumber || undefined}
          winningAmount={winningAmount}
          winningNumber={winningNumber}
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