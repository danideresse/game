'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Timer from '../../components/Timer';
import GameResult from '../../components/GameResult';
import GameOver from '../../components/GameOver';
import { useGame } from '../../context/GameContext';
import DepositPrompt from '../../components/DepositPrompt';

export default function Game2() {
  const { balance, updateBalance, addTransaction } = useGame();
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'retry' | null>(null);
  const [winningAmount, setWinningAmount] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winningNumber, setWinningNumber] = useState(0);
  const [timerReset, setTimerReset] = useState(false);
  const [showPickMessage, setShowPickMessage] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [betAmount] = useState(30);
  const [showDepositPrompt, setShowDepositPrompt] = useState(false);
  const router = useRouter();
  const [timerStarted, setTimerStarted] = useState(false);

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
    if (balance < betAmount) {
      setShowDepositPrompt(true);
      return;
    }
    setShowPickMessage(true);
    setIsLocked(true);
    setTimerStarted(true);
  };

  const handleTimeUp = () => {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    const randomWinningNumber = numbers[randomIndex];
    setWinningNumber(randomWinningNumber);
    
    const baseWinAmount = Math.floor(Math.random() * 150) + 50;
    const commission = Math.round((baseWinAmount * 0.05) * 100) / 100; // Round commission
    const finalWinAmount = Math.round((baseWinAmount - commission) * 100) / 100; // Round final amount
    setWinningAmount(finalWinAmount);
    
    const didWin = selectedNumber === randomWinningNumber;
    if (didWin) {
      updateBalance(finalWinAmount);
      addTransaction({
        type: 'win',
        amount: finalWinAmount,
        date: new Date().toISOString(),
        status: 'completed',
        gameId: 2,
        description: `Win (5% commission: ${commission.toFixed(2)} Birr)`
      });
    } else {
      updateBalance(-betAmount);
      addTransaction({
        type: 'loss',
        amount: betAmount,
        date: new Date().toISOString(),
        status: 'completed',
        gameId: 2
      });
    }
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
    setTimerStarted(false);
  };

  const handleGameExit = (targetPath: string) => {
    if (isLocked && !isGameOver) {
      if (window.confirm(`You will lose ${betAmount} birr if you leave. Are you sure?`)) {
        updateBalance(-betAmount);
        addTransaction({
          type: 'loss',
          amount: betAmount,
          date: new Date().toISOString(),
          status: 'completed',
          gameId: 2
        });
        router.push(targetPath);
      }
    } else {
      router.push(targetPath);
    }
  };

  const handleNavigation = (e: MouseEvent) => {
    if (isLocked && !isGameOver) {
      e.preventDefault();
      const targetPath = (e.target as HTMLAnchorElement).closest('a')?.href;
      if (targetPath) {
        const path = new URL(targetPath).pathname;
        handleGameExit(path);
      }
    }
  };

  // Add navigation blocking when game is in progress
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLocked && !isGameOver) {
        e.preventDefault();
        e.returnValue = `You will lose ${betAmount} birr if you leave. Are you sure?`;
        return e.returnValue;
      }
    };

    // Block navigation during active game
    const handleNavigation = (e: MouseEvent) => {
      if (isLocked && !isGameOver) {
        e.preventDefault();
        const targetPath = (e.target as HTMLAnchorElement).closest('a')?.href;
        if (targetPath) {
          const path = new URL(targetPath).pathname;
          handleGameExit(path);
        }
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Add click handler to all navigation links
    const navLinks = document.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', handleNavigation as any);
    });

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      navLinks.forEach(link => {
        link.removeEventListener('click', handleNavigation as any);
      });
    };
  }, [isLocked, isGameOver, router]);

  return (
    <div className="p-4 sm:p-6 md:p-8 animate-slide-up max-w-2xl mx-auto">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-primary mb-2">ጨዋታ 2</h1>
        <p className="text-theme-secondary">
          Stake Amount: <span className="text-primary font-bold">{betAmount} Birr</span>
        </p>
      </div>

      <div className="text-center mb-8 card p-4 md:p-6">
        <Timer 
          initialTime={60} 
          onTimeUp={handleTimeUp}
          isReset={timerReset}
          isStarted={timerStarted}
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
                ? 'selected-number' 
                : 'bg-gaming-dark/30 text-theme-secondary hover:text-primary'}
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
          {isLocked ? 'Number Locked' : balance < betAmount ? 'Deposit to Play' : 'Choose'}
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

      {showDepositPrompt && (
        <DepositPrompt onClose={() => setShowDepositPrompt(false)} />
      )}
    </div>
  );
} 