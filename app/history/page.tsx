'use client';

import { useGame } from '../context/GameContext';
import { useState } from 'react';

export default function History() {
  const { transactions } = useGame();
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  
  // Helper function to get game name from code
  const getGameName = (gameId: string | number) => {
    // For built-in games
    if (gameId === 1) return 'ጨዋታ 1';
    if (gameId === 2) return 'ጨዋታ 2';
    
    // For custom games, fetch from localStorage
    const customGames = JSON.parse(localStorage.getItem('customGames') || '[]');
    const game = customGames.find((g: any) => g.code === gameId.toString());
    
    if (game?.name) {
      return `Custom Game: ${game.name}`;
    }

    // Fallback
    return `Custom Game ${gameId}`;
  };

  // Filter for game transactions only and sort by date
  const gameTransactions = transactions
    .filter(tx => tx.type === 'win' || tx.type === 'loss')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get either all transactions or just the first 5
  const displayedTransactions = showAllTransactions 
    ? gameTransactions 
    : gameTransactions.slice(0, 5);

  return (
    <div className="p-4 sm:p-6 md:p-8 animate-slideUpAndFade space-y-6">
      <h1 className="text-2xl font-bold text-primary mb-6">Game History</h1>
      <div className="space-y-4">
        {displayedTransactions.map((transaction, index) => (
          <div 
            key={transaction.date}
            className="card p-4 flex justify-between items-center animate-slideUpAndFade"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div>
              <div className="font-semibold text-primary capitalize">
                {transaction.type === 'win' ? 'Won' : 'Lost'}
                {transaction.gameId && ` - ${getGameName(transaction.gameId)}`}
                {transaction.description && (
                  <div className="text-sm text-theme-secondary mt-1">
                    {transaction.type === 'win' 
                      ? `Commission deducted: ${transaction.description.split(': ')[1]}`
                      : transaction.description}
                  </div>
                )}
              </div>
              <div className="text-sm text-theme-secondary">
                {new Date(transaction.date).toLocaleDateString()}
              </div>
            </div>
            <div className={`font-bold ${
              transaction.type === 'win' ? 'text-green-500' : 'text-red-500'
            }`}>
              {transaction.type === 'win' ? '+' : '-'}
              {transaction.amount.toFixed(2)}
            </div>
          </div>
        ))}
        
        {gameTransactions.length === 0 && (
          <div className="text-center text-theme-secondary py-8">
            No game history yet
          </div>
        )}

        {/* Show "See More" button only if there are more than 5 transactions */}
        {gameTransactions.length > 5 && (
          <button
            onClick={() => setShowAllTransactions(!showAllTransactions)}
            className="w-full mt-4 text-center text-primary hover:text-orange-500 
              transition-colors duration-300 py-2 rounded-lg glass-effect"
          >
            {showAllTransactions ? 'Show Less' : `See ${gameTransactions.length - 5} More Games`}
          </button>
        )}
      </div>
    </div>
  );
} 