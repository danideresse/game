'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

interface CustomGame {
  code: string;
  creatorId: string;
  numberCount: number;
  timerLimit: number;
  stakeAmount: number;
  createdAt: string;
  active: boolean;
}

export default function JoinCustomGame() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState('');
  const [error, setError] = useState('');
  const [foundGame, setFoundGame] = useState<CustomGame | null>(null);

  const handleGameCodeChange = (code: string) => {
    setGameCode(code.toUpperCase());
    setError('');
    
    const games = JSON.parse(localStorage.getItem('customGames') || '[]');
    const game = games.find((g: CustomGame) => g.code === code.toUpperCase() && g.active);
    
    if (game) {
      setFoundGame(game);
    } else {
      setFoundGame(null);
    }
  };

  const handleJoinGame = () => {
    if (foundGame) {
      router.push(`/custom-game/play/${gameCode}`);
    } else {
      setError('Invalid game code or game no longer active');
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">Custom Games</h1>
      
      <div className="space-y-8">
        {/* Create Game Button */}
        <div>
          <button
            onClick={() => router.push('/custom-game/create')}
            className="w-full btn-primary flex items-center justify-center gap-2 py-4 mb-8"
          >
            <PlusCircleIcon className="w-6 h-6" />
            Create Your Custom Game
          </button>
        </div>

        {/* Join Game Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-primary">Join Game</h2>
          <div>
            <label className="text-sm text-theme-secondary block mb-2">
              Enter Game Code
            </label>
            <input
              type="text"
              value={gameCode}
              onChange={(e) => handleGameCodeChange(e.target.value)}
              className="w-full bg-gray-100 dark:bg-white/5 rounded-lg p-3 
                text-gray-600 dark:text-gray-400"
              placeholder="Enter 6-digit code"
              maxLength={6}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          {foundGame && (
            <div className="bg-gaming-dark/30 rounded-lg p-4 space-y-2">
              <h3 className="text-primary font-semibold">Game Details:</h3>
              <p className="text-sm text-theme-secondary">
                Numbers to choose from: {foundGame.numberCount}
              </p>
              <p className="text-sm text-theme-secondary">
                Timer: {foundGame.timerLimit} seconds
              </p>
              <p className="text-sm text-theme-secondary">
                Stake Amount: {foundGame.stakeAmount} Birr
              </p>
            </div>
          )}

          <button
            onClick={handleJoinGame}
            disabled={gameCode.length !== 6}
            className="w-full btn-primary py-3 disabled:opacity-50"
          >
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
} 