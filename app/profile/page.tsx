'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PhoneIcon, WalletIcon, ArrowPathIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Profile() {
  const [balance] = useState(1000);
  const [phoneNumber] = useState('+251 91 234 5678');
  const [username] = useState('USER123');

  return (
    <div className="p-4 sm:p-6 md:p-8 animate-slideUpAndFade space-y-6">
      {/* Profile Header */}
      <div className="card p-6 md:p-8 text-center transform transition-all duration-300 hover:scale-105">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-white text-3xl font-bold animate-bounce">
            {username[0]}
          </div>
        </div>
        <h1 className="text-2xl font-bold text-primary mb-2 animate-slideDownAndFade delay-100">
          {username}
        </h1>
        <div className="flex items-center justify-center gap-2 text-theme-secondary animate-slideUpAndFade delay-200">
          <PhoneIcon className="w-4 h-4" />
          <span>{phoneNumber}</span>
        </div>
      </div>

      {/* Balance Card */}
      <div className="card p-6 md:p-8 transform transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 animate-slideRightAndFade">
            <WalletIcon className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-theme-secondary">Balance</h2>
          </div>
          <button className="text-primary hover:text-orange-600 transition-colors animate-wiggle">
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="text-3xl font-bold text-primary mb-6 animate-shimmer bg-gradient-to-r from-transparent via-primary/10 to-transparent bg-[length:200%_100%]">
          {balance.toFixed(2)} Birr
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="btn-primary transform transition-all duration-300 hover:scale-110 hover:rotate-1">
            Deposit
          </button>
          <button className="glass-effect text-theme-secondary hover:text-primary px-6 py-3 rounded-lg transition-all duration-300 hover:scale-110 hover:-rotate-1">
            Withdraw
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="card p-6 md:p-8 transform transition-all duration-300 hover:scale-105">
        <h2 className="text-xl font-semibold text-primary mb-4 animate-slideLeftAndFade">
          Recent Transactions
        </h2>
        <div className="space-y-4">
          {/* Add staggered animation to transactions */}
          <div className="space-y-4 [&>*:nth-child(1)]:animate-slideRightAndFade [&>*:nth-child(2)]:animate-slideRightAndFade [&>*:nth-child(2)]:delay-100 [&>*:nth-child(3)]:animate-slideRightAndFade [&>*:nth-child(3)]:delay-200">
            <TransactionItem 
              type="deposit"
              amount={500}
              date="2024-03-19"
              status="completed"
            />
            <TransactionItem 
              type="withdraw"
              amount={200}
              date="2024-03-18"
              status="pending"
            />
            <TransactionItem 
              type="bet"
              amount={100}
              date="2024-03-17"
              status="completed"
            />
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="card p-6 md:p-8 transform transition-all duration-300 hover:scale-105">
        <h2 className="text-xl font-semibold text-primary mb-4 animate-slideLeftAndFade delay-300">
          Account Settings
        </h2>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 rounded-lg glass-effect hover:text-primary transition-all duration-300 hover:scale-105 hover:translate-x-2 flex items-center gap-3">
            <PhoneIcon className="w-5 h-5" />
            Update Phone Number
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg glass-effect text-red-500 hover:text-red-400 transition-all duration-300 hover:scale-105 hover:translate-x-2 flex items-center gap-3">
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

// Update TransactionItem with hover animation
function TransactionItem({ type, amount, date, status }: {
  type: 'deposit' | 'withdraw' | 'bet';
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}) {
  const getTypeColor = () => {
    switch(type) {
      case 'deposit': return 'text-green-500';
      case 'withdraw': return 'text-red-500';
      case 'bet': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 glass-effect rounded-lg transform transition-all duration-300 hover:scale-105 hover:translate-x-2">
      <div className="flex items-center gap-3">
        <div className={`capitalize ${getTypeColor()}`}>
          {type}
        </div>
        <div className="text-theme-secondary">
          {new Date(date).toLocaleDateString()}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-primary">
          {type === 'deposit' ? '+' : '-'}{amount} Birr
        </span>
        <span className={`text-sm ${status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
          {status}
        </span>
      </div>
    </div>
  );
} 