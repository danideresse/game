'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Transaction {
  type: 'deposit' | 'withdraw' | 'bet' | 'win' | 'loss';
  amount: number;
  date: string;
  status: 'completed' | 'pending';
  gameId?: number;
  description?: string;
}

interface ReferralReward {
  referredUser: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed';
}

interface User {
  username: string;
  phone: string;
  isLoggedIn: boolean;
  referralCode: string;
  referredBy: string | null;
  referralCount: number;
  referralEarnings: number;
  referralRewards: ReferralReward[];
}

interface GameContextType {
  balance: number;
  updateBalance: (amount: number) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  user: User | null;
  updateReferralReward: (referredUser: string) => void;
  referralRewards: ReferralReward[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [referralRewards, setReferralRewards] = useState<ReferralReward[]>([]);

  useEffect(() => {
    const storedBalance = localStorage.getItem('gameBalance');
    const storedTransactions = localStorage.getItem('gameTransactions');
    const storedUser = localStorage.getItem('user');
    
    if (storedBalance) {
      setBalance(parseFloat(storedBalance));
    }
    
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setReferralRewards(parsedUser.referralRewards || []);
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

  const updateReferralReward = (referredUser: string) => {
    const reward: ReferralReward = {
      referredUser,
      amount: 3,
      date: new Date().toISOString(),
      status: 'completed'
    };

    const updatedRewards = [...referralRewards, reward];
    setReferralRewards(updatedRewards);

    if (user) {
      const updatedUser = {
        ...user,
        referralCount: user.referralCount + 1,
        referralEarnings: user.referralEarnings + reward.amount,
        referralRewards: updatedRewards
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    addTransaction({
      type: 'win',
      amount: reward.amount,
      date: reward.date,
      status: 'completed',
      description: `Referral Bonus: ${referredUser}`
    });

    updateBalance(reward.amount);
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gameBalance') {
        setBalance(parseFloat(e.newValue || '0'));
      }
      if (e.key === 'gameTransactions') {
        setTransactions(JSON.parse(e.newValue || '[]'));
      }
      if (e.key === 'user') {
        setUser(JSON.parse(e.newValue || '{}'));
      }
      if (e.key === 'referralRewards') {
        setReferralRewards(JSON.parse(e.newValue || '[]'));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <GameContext.Provider value={{ 
      balance, 
      updateBalance, 
      transactions, 
      addTransaction,
      user,
      updateReferralReward,
      referralRewards 
    }}>
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