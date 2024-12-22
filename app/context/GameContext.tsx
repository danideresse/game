'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Transaction {
  type: 'deposit' | 'withdraw' | 'bet' | 'win' | 'loss';
  amount: number;
  date: string;
  status: 'completed' | 'pending';
  gameId?: number;
}

interface GameContextType {
  balance: number;
  updateBalance: (amount: number) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const storedBalance = localStorage.getItem('gameBalance');
    const storedTransactions = localStorage.getItem('gameTransactions');
    
    if (storedBalance) {
      setBalance(parseFloat(storedBalance));
    }
    
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  const updateBalance = (amount: number) => {
    const newBalance = balance + amount;
    setBalance(newBalance);
    localStorage.setItem('gameBalance', newBalance.toString());
  };

  const addTransaction = (transaction: Transaction) => {
    const newTransactions = [transaction, ...transactions];
    setTransactions(newTransactions);
    localStorage.setItem('gameTransactions', JSON.stringify(newTransactions));
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gameBalance') {
        setBalance(parseFloat(e.newValue || '0'));
      }
      if (e.key === 'gameTransactions') {
        setTransactions(JSON.parse(e.newValue || '[]'));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <GameContext.Provider value={{ balance, updateBalance, transactions, addTransaction }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 