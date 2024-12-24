'use client';

import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

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
}

export default function ManageGames() {
  const { user } = useGame();
  const [games, setGames] = useState<CustomGame[]>([]);
  const [editingGame, setEditingGame] = useState<CustomGame | null>(null);
  const [showAllCommissions, setShowAllCommissions] = useState(false);

  useEffect(() => {
    const storedGames = JSON.parse(localStorage.getItem('customGames') || '[]');
    const userGames = storedGames.filter((game: CustomGame) => game.creatorId === user?.username);
    setGames(userGames);
  }, [user]);

  const handleDelete = (code: string) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      const allGames = JSON.parse(localStorage.getItem('customGames') || '[]');
      const updatedGames = allGames.filter((g: CustomGame) => g.code !== code);
      localStorage.setItem('customGames', JSON.stringify(updatedGames));
      setGames(games.filter(g => g.code !== code));
    }
  };

  const handleUpdate = (game: CustomGame) => {
    const allGames = JSON.parse(localStorage.getItem('customGames') || '[]');
    const updatedGames = allGames.map((g: CustomGame) => 
      g.code === game.code ? { ...game } : g
    );
    localStorage.setItem('customGames', JSON.stringify(updatedGames));
    setGames(games.map(g => g.code === game.code ? game : g));
    setEditingGame(null);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">Manage Your Games</h1>
      
      {/* Commission Summary */}
      <div className="card p-4 mb-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Commission Earnings</h2>
        <div className="text-2xl font-bold text-primary mb-2">
          {games.reduce((total, game) => total + (game.totalCommission || 0), 0).toFixed(2)} Birr
        </div>
        <p className="text-sm text-theme-secondary">
          Total earnings from all your custom games
        </p>
      </div>

      {/* Games List */}
      <div className="space-y-4">
        {games.length === 0 ? (
          <p className="text-center text-theme-secondary py-8">
            You haven't created any games yet
          </p>
        ) : (
          <>
            {(showAllCommissions ? games : games.slice(0, 3)).map(game => (
              <div key={game.code} className="card p-4">
                {editingGame?.code === game.code ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-theme-secondary block mb-2">
                        Number of Choices
                      </label>
                      <input
                        type="number"
                        value={editingGame.numberCount}
                        onChange={(e) => setEditingGame({
                          ...editingGame,
                          numberCount: parseInt(e.target.value)
                        })}
                        className="w-full bg-gaming-dark/30 rounded-lg p-2"
                        min={2}
                        max={20}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-theme-secondary block mb-2">
                        Timer (seconds)
                      </label>
                      <input
                        type="number"
                        value={editingGame.timerLimit}
                        onChange={(e) => setEditingGame({
                          ...editingGame,
                          timerLimit: parseInt(e.target.value)
                        })}
                        className="w-full bg-gaming-dark/30 rounded-lg p-2"
                        min={30}
                        max={300}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-theme-secondary block mb-2">
                        Stake Amount (Birr)
                      </label>
                      <input
                        type="number"
                        value={editingGame.stakeAmount}
                        onChange={(e) => setEditingGame({
                          ...editingGame,
                          stakeAmount: parseInt(e.target.value)
                        })}
                        className="w-full bg-gaming-dark/30 rounded-lg p-2"
                        min={10}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(editingGame)}
                        className="flex-1 btn-primary py-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingGame(null)}
                        className="flex-1 bg-gaming-dark/30 rounded-lg py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-primary font-bold">Game Code: {game.code}</h3>
                        <p className="text-sm text-theme-secondary">
                          Created: {new Date(game.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingGame(game)}
                          className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(game.code)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-theme-secondary">Numbers</p>
                        <p className="text-primary font-bold">{game.numberCount}</p>
                      </div>
                      <div>
                        <p className="text-theme-secondary">Timer</p>
                        <p className="text-primary font-bold">{game.timerLimit}s</p>
                      </div>
                      <div>
                        <p className="text-theme-secondary">Stake</p>
                        <p className="text-primary font-bold">{game.stakeAmount} Birr</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gaming-dark/30">
                      <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">Commission Earned:</span>
                        <span className="text-primary font-bold">
                          {game.totalCommission?.toFixed(2) || '0.00'} Birr
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}

            {games.length > 3 && (
              <button
                onClick={() => setShowAllCommissions(!showAllCommissions)}
                className="w-full text-center text-primary hover:text-orange-500 
                  transition-colors duration-300 py-2 rounded-lg glass-effect"
              >
                {showAllCommissions ? 'Show Less' : `See ${games.length - 3} More Games`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
} 