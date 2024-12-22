'use client';

import { useGame } from '../context/GameContext';

export default function History() {
  const { transactions } = useGame();
  
  // Filter for game transactions only
  const gameTransactions = transactions.filter(
    tx => tx.type === 'win' || tx.type === 'loss' || tx.type === 'bet'
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 animate-slideUpAndFade space-y-6">
      <h1 className="text-2xl font-bold text-primary mb-6">Game History</h1>
      <div className="space-y-4">
        {gameTransactions.map((transaction, index) => (
          <div 
            key={index}
            className="card p-4 flex justify-between items-center animate-slideUpAndFade"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div>
              <div className="font-semibold text-primary capitalize">
                {transaction.type}
                {transaction.gameId && ` - Game ${transaction.gameId}`}
              </div>
              <div className="text-sm text-theme-secondary">
                {new Date(transaction.date).toLocaleDateString()}
              </div>
            </div>
            <div className={`font-bold ${
              transaction.type === 'win' || transaction.type === 'deposit' 
                ? 'text-green-500' 
                : 'text-red-500'
            }`}>
              {transaction.type === 'win' || transaction.type === 'deposit' ? '+' : '-'}
              {transaction.amount.toFixed(2)}
            </div>
          </div>
        ))}
        
        {gameTransactions.length === 0 && (
          <div className="text-center text-theme-secondary py-8">
            No transactions yet
          </div>
        )}
      </div>
    </div>
  );
} 