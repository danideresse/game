'use client';

import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { TrashIcon, PencilIcon, UsersIcon } from '@heroicons/react/24/outline';

interface CustomGame {
  code: string;
  name: string;
  creatorId: string;
  numberCount: number;
  timerLimit: number;
  stakeAmount: number;
  createdAt: string;
  active: boolean;
  totalCommission: number;
  joinedUsers?: number;
}

export default function ManageGames() {
  const { user } = useGame();
  const [games, setGames] = useState<CustomGame[]>([]);
  const [showAllGames, setShowAllGames] = useState(false);
  const [editingGame, setEditingGame] = useState<CustomGame | null>(null);
  const [numberError, setNumberError] = useState('');
  const [timerError, setTimerError] = useState('');
  const [stakeError, setStakeError] = useState('');

  useEffect(() => {
    const storedGames = JSON.parse(localStorage.getItem('customGames') || '[]');
    const userGames = storedGames.filter((game: CustomGame) => 
      game.creatorId === user?.username
    );
    
    const gamesWithJoinedUsers = userGames.map((game: CustomGame) => ({
      ...game,
      joinedUsers: JSON.parse(localStorage.getItem(`game_${game.code}_users`) || '[]').length
    }));
    
    setGames(gamesWithJoinedUsers);
  }, [user]);

  const handleDelete = (code: string) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      const allGames = JSON.parse(localStorage.getItem('customGames') || '[]');
      const updatedGames = allGames.filter((g: CustomGame) => g.code !== code);
      localStorage.setItem('customGames', JSON.stringify(updatedGames));
      setGames(games.filter(g => g.code !== code));
    }
  };

  const validateNumberCount = (value: number) => {
    if (value < 2) {
      setNumberError('Minimum 2 numbers required');
      return false;
    }
    if (value > 20) {
      setNumberError('Maximum 20 numbers allowed');
      return false;
    }
    setNumberError('');
    return true;
  };

  const validateTimer = (seconds: number) => {
    if (seconds < 10) {
      setTimerError('Minimum time is 10 seconds');
      return false;
    }
    if (seconds > 300) {
      setTimerError('Maximum time is 5 minutes (300 seconds)');
      return false;
    }
    setTimerError('');
    return true;
  };

  const validateStake = (amount: number) => {
    if (amount < 10) {
      setStakeError('Minimum stake is 10 Birr');
      return false;
    }
    setStakeError('');
    return true;
  };

  const handleUpdate = (game: CustomGame) => {
    const isNumberValid = validateNumberCount(game.numberCount);
    const isTimerValid = validateTimer(game.timerLimit);
    const isStakeValid = validateStake(game.stakeAmount);

    if (!isNumberValid || !isTimerValid || !isStakeValid) {
      return;
    }

    const allGames = JSON.parse(localStorage.getItem('customGames') || '[]');
    const updatedGames = allGames.map((g: CustomGame) => 
      g.code === game.code ? { ...game } : g
    );
    localStorage.setItem('customGames', JSON.stringify(updatedGames));
    setGames(games.map(g => g.code === game.code ? game : g));
    setEditingGame(null);
    
    setNumberError('');
    setTimerError('');
    setStakeError('');
  };

  const displayedGames = showAllGames ? games : games.slice(0, 3);

  return (
    <div className="p-4 sm:p-6 md:p-8 animate-slideUpAndFade space-y-6">
      <h1 className="text-2xl font-bold text-primary mb-6">Manage Games</h1>

      {displayedGames.map((game) => (
        <div key={game.code} className="card p-4 md:p-6 space-y-4">
          {editingGame?.code === game.code ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-theme-secondary block mb-2">
                  Number of Choices
                </label>
                <input
                  type="number"
                  value={editingGame.numberCount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    validateNumberCount(value);
                    setEditingGame({
                      ...editingGame,
                      numberCount: value
                    });
                  }}
                  className={`w-full bg-gaming-dark/30 rounded-lg p-2
                    ${numberError ? 'border-2 border-red-500' : 'border border-gaming-dark/50'}`}
                  min={2}
                  max={20}
                />
                {numberError && (
                  <p className="text-red-500 text-xs mt-1">{numberError}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-theme-secondary block mb-2">
                  Timer (seconds)
                </label>
                <input
                  type="number"
                  value={editingGame.timerLimit}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    validateTimer(value);
                    setEditingGame({
                      ...editingGame,
                      timerLimit: value
                    });
                  }}
                  className={`w-full bg-gaming-dark/30 rounded-lg p-2
                    ${timerError ? 'border-2 border-red-500' : 'border border-gaming-dark/50'}`}
                  min={10}
                  max={300}
                />
                {timerError && (
                  <p className="text-red-500 text-xs mt-1">{timerError}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-theme-secondary block mb-2">
                  Stake Amount (Birr)
                </label>
                <input
                  type="number"
                  value={editingGame.stakeAmount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    validateStake(value);
                    setEditingGame({
                      ...editingGame,
                      stakeAmount: value
                    });
                  }}
                  className={`w-full bg-gaming-dark/30 rounded-lg p-2
                    ${stakeError ? 'border-2 border-red-500' : 'border border-gaming-dark/50'}`}
                  min={10}
                />
                {stakeError && (
                  <p className="text-red-500 text-xs mt-1">{stakeError}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(editingGame)}
                  disabled={!!(numberError || timerError || stakeError)}
                  className="flex-1 btn-primary py-2 disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingGame(null);
                    setNumberError('');
                    setTimerError('');
                    setStakeError('');
                  }}
                  className="flex-1 bg-gaming-dark/30 rounded-lg py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-primary">{game.name}</h2>
                  <p className="text-sm text-theme-secondary mt-1">Code: {game.code}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingGame(game)}
                    className="text-primary hover:text-orange-500 transition-colors"
                  >
                    <PencilIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleDelete(game.code)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-theme-secondary">Numbers</p>
                  <p className="font-bold text-primary">{game.numberCount}</p>
                </div>
                <div>
                  <p className="text-sm text-theme-secondary">Timer</p>
                  <p className="font-bold text-primary">{game.timerLimit}s</p>
                </div>
                <div>
                  <p className="text-sm text-theme-secondary">Stake</p>
                  <p className="font-bold text-primary">{game.stakeAmount} Birr</p>
                </div>
                <div>
                  <p className="text-sm text-theme-secondary">Commission</p>
                  <p className="font-bold text-primary">{game.totalCommission.toFixed(2)} Birr</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-theme-secondary">
                <UsersIcon className="w-5 h-5" />
                <span>{game.joinedUsers} users joined</span>
              </div>
            </>
          )}
        </div>
      ))}

      {games.length === 0 && (
        <div className="text-center text-theme-secondary py-8">
          No games created yet
        </div>
      )}

      {games.length > 3 && (
        <button
          onClick={() => setShowAllGames(!showAllGames)}
          className="w-full text-center text-primary hover:text-orange-500 
            transition-colors duration-300 py-2 rounded-lg glass-effect"
        >
          {showAllGames ? 'Show Less' : `See ${games.length - 3} More Games`}
        </button>
      )}
    </div>
  );
} 