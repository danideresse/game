'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Timer from '../../../components/Timer';
import GameResult from '../../../components/GameResult';
import GameOver from '../../../components/GameOver';
import { useGame } from '../../../context/GameContext';
import DepositPrompt from '../../../components/DepositPrompt';

interface CustomGame {
  code: string;
  creatorId: string;
  numberCount: number;
  timerLimit: number;
  stakeAmount: number;
  createdAt: string;
  active: boolean;
  name: string;
}

export default function PlayCustomGame({ params }: { params: { code: string } }) {
  const router = useRouter();
  const { balance, updateBalance, addTransaction } = useGame();
  const [game, setGame] = useState<CustomGame | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  const [winningAmount, setWinningAmount] = useState(0);
  const [winningNumber, setWinningNumber] = useState(0);
  const [timerReset, setTimerReset] = useState(false);
  const [showPickMessage, setShowPickMessage] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showDepositPrompt, setShowDepositPrompt] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const games = JSON.parse(localStorage.getItem('customGames') || '[]');
    const foundGame = games.find((g: CustomGame) => g.code === params.code && g.active);
    if (foundGame) {
      setGame(foundGame);
      const nums = generateRandomNumbers(foundGame.numberCount);
      setNumbers(nums);
    } else {
      router.push('/custom-game/join');
    }
  }, [params.code, router]);

  const generateRandomNumbers = (count: number) => {
    const nums = new Set<number>();
    while(nums.size < count) {
      nums.add(Math.floor(Math.random() * 100) + 1);
    }
    return Array.from(nums).sort((a, b) => a - b);
  };

  const handleBet = () => {
    if (!game) return;
    if (balance < game.stakeAmount) {
      setShowDepositPrompt(true);
      return;
    }
    setShowPickMessage(true);
    setIsLocked(true);
    setTimerStarted(true);
  };

  const handleTimeUp = () => {
    if (!game) return;
    const randomIndex = Math.floor(Math.random() * numbers.length);
    const randomWinningNumber = numbers[randomIndex];
    setWinningNumber(randomWinningNumber);
    
    const baseWinAmount = Math.floor(Math.random() * 150) + 50;
    const creatorCommission = Math.round((baseWinAmount * 0.05) * 100) / 100; // Round commission
    const finalWinAmount = Math.round((baseWinAmount - creatorCommission) * 100) / 100; // Round final amount
    setWinningAmount(finalWinAmount);
    
    const didWin = selectedNumber === randomWinningNumber;
    if (didWin) {
      updateBalance(finalWinAmount);
      addTransaction({
        type: 'win',
        amount: finalWinAmount,
        date: new Date().toISOString(),
        status: 'completed',
        gameId: parseInt(game.code),
        description: `Win (5% commission: ${creatorCommission.toFixed(2)} Birr)`
      });
    } else {
      updateBalance(-game.stakeAmount);
      addTransaction({
        type: 'loss',
        amount: game.stakeAmount,
        date: new Date().toISOString(),
        status: 'completed',
        gameId: parseInt(game.code),
        description: `${game.name} Loss`
      });
    }
    setGameResult(didWin ? 'win' : 'lose');
  };

  const handleResultClose = () => {
    setGameResult(null);
    setIsGameOver(true);
  };

  const resetGame = () => {
    setSelectedNumber(null);
    setGameResult(null);
    setWinningAmount(0);
    setWinningNumber(0);
    setIsLocked(false);
    setShowPickMessage(false);
    setTimerReset(true);
    setIsGameOver(false);
    setTimerStarted(false);
    
    // Generate new numbers
    if (game) {
      const nums = generateRandomNumbers(game.numberCount);
      setNumbers(nums);
    }
  };

  const handleGameExit = (targetPath: string) => {
    if (isLocked && !isGameOver && game) {
      if (window.confirm(`You will lose ${game.stakeAmount} birr if you leave. Are you sure?`)) {
        updateBalance(-game.stakeAmount);
        addTransaction({
          type: 'loss',
          amount: game.stakeAmount,
          date: new Date().toISOString(),
          status: 'completed',
          gameId: parseInt(game.code),
          description: `${game.name} (Left Game)`
        });
        router.push(targetPath);
      }
    } else {
      router.push(targetPath);
    }
  };

  // Add navigation blocking when game is in progress
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLocked && !isGameOver && game) {
        e.preventDefault();
        e.returnValue = `You will lose ${game.stakeAmount} birr if you leave. Are you sure?`;
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
  }, [isLocked, isGameOver, game, router]);

  return (
    <div className="p-4 sm:p-6 md:p-8 animate-slideUpAndFade space-y-6">
      {game && (
        <>
          {/* Game Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-2">{game.name}</h1>
            <p className="text-theme-secondary">
              Choose one number from {game.numberCount} numbers
            </p>
          </div>

          {/* Timer Card */}
          <div className="card p-4 md:p-6">
            <div className="text-center space-y-2">
              <p className="text-theme-secondary">Time Remaining</p>
              <Timer 
                initialTime={game.timerLimit} 
                onTimeUp={handleTimeUp}
                isReset={timerReset}
                isStarted={timerStarted}
              />
            </div>
          </div>

          {/* Game Status Message */}
          {showPickMessage && selectedNumber && !gameResult && (
            <div className="text-center animate-slideDownAndFade">
              <p className="text-theme-secondary">
                You picked number <span className="text-primary font-bold">{selectedNumber}</span>
              </p>
              <p className="text-sm text-theme-secondary mt-1">Good luck!</p>
            </div>
          )}

          {/* Numbers Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {numbers.map((num) => (
              <button
                key={num}
                onClick={() => !isLocked && setSelectedNumber(num)}
                disabled={isLocked}
                className={`
                  p-2 sm:p-3 rounded-lg text-base sm:text-lg font-bold
                  transition-all duration-300 hover:scale-105
                  ${isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                  ${selectedNumber === num 
                    ? 'bg-gradient-to-r from-primary to-orange-500 text-white' 
                    : 'bg-primary/10 text-primary hover:bg-primary/20'}
                `}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Bet Button */}
          {!isLocked && (
            <div className="card p-4">
              <button
                onClick={handleBet}
                disabled={!selectedNumber}
                className={`
                  w-full py-4 rounded-lg font-bold transition-all duration-300
                  ${!selectedNumber 
                    ? 'bg-gray-500/50 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-primary to-orange-500 text-white hover:scale-105'}
                `}
              >
                Bet {game.stakeAmount} Birr
              </button>
            </div>
          )}

          {/* Game Result Popups */}
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
        </>
      )}
    </div>
  );
} 