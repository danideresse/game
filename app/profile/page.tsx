'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PhoneIcon, WalletIcon, ArrowPathIcon, ArrowRightOnRectangleIcon, CogIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline';
import DepositPopup from '../components/DepositPopup';
import { useGame } from '../context/GameContext';
import WithdrawPopup from '../components/WithdrawPopup';
import UpdatePhonePopup from '../components/UpdatePhonePopup';
import SignOutConfirm from '../components/SignOutConfirm';
import ReferralSection from '../components/ReferralSection';

export default function Profile() {
  const router = useRouter();
  const { balance, transactions, updateBalance, addTransaction } = useGame();
  const [phoneNumber, setPhoneNumber] = useState('+251 91 234 5678');
  const [username] = useState('USER123');
  const [showDepositPopup, setShowDepositPopup] = useState(false);
  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
  const [showUpdatePhone, setShowUpdatePhone] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleDepositSuccess = (amount: number) => {
    updateBalance(amount);
    addTransaction({
      type: 'deposit',
      amount: amount,
      date: new Date().toISOString(),
      status: 'completed'
    });
  };

  const handleWithdrawSuccess = (amount: number) => {
    updateBalance(-amount);
    addTransaction({
      type: 'withdraw',
      amount: amount,
      date: new Date().toISOString(),
      status: 'completed'
    });
  };

  const handleUpdatePhone = (newPhone: string) => {
    setPhoneNumber(newPhone);
    // Here you would typically update the phone number in your backend
  };

  const handleSignOut = () => {
    // Here you would handle the sign out logic
    // For example, clear local storage, redirect to login, etc.
    localStorage.clear();
    window.location.href = '/login'; // or use router.push('/login')
  };

  // Filter transactions for profile page
  const filteredTransactions = transactions.filter(
    tx => tx.type === 'deposit' || tx.type === 'withdraw'
  );

  // Get either all transactions or just the first 4
  const displayedTransactions = showAllTransactions 
    ? filteredTransactions 
    : filteredTransactions.slice(0, 4);

  // Add refresh balance function
  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    // Here you would typically fetch the latest balance from your API
    // For now, we'll simulate a refresh
    const storedBalance = localStorage.getItem('gameBalance');
    if (storedBalance) {
      updateBalance(parseFloat(storedBalance) - balance);
    }
    
    // Add spinning animation duration
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-20 space-y-6">
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
      <div className="card p-6 md:p-8 text-center transform transition-all duration-300 hover:scale-105">
        <div className="flex justify-between items-center mb-4 animate-slideDownAndFade delay-100">
          <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
            <WalletIcon className="w-6 h-6" />
            Balance
          </h2>
          <button
            onClick={handleRefreshBalance}
            className={`text-theme-secondary hover:text-primary transition-colors
              ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="text-3xl font-bold text-primary mb-4 animate-float number-glow">
          {balance.toFixed(2)} Birr
        </div>
        <div className="grid grid-cols-2 gap-3 animate-slideUpAndFade delay-200">
          <button
            onClick={() => setShowDepositPopup(true)}
            className="btn-primary py-2 px-4 hover:scale-105 transition-transform duration-300"
          >
            Deposit
          </button>
          <button
            onClick={() => setShowWithdrawPopup(true)}
            className="btn-primary py-2 px-4 hover:scale-105 transition-transform duration-300"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Add Custom Games Card */}
      <div className="card p-6 md:p-8 transform transition-all duration-300 hover:scale-105 animate-slideUpAndFade">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary animate-slideRightAndFade">
            <PuzzlePieceIcon className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Custom Games</h2>
          </div>
          <button
            onClick={() => router.push('/custom-game/manage')}
            className="btn-primary py-2 px-4 transform transition-all duration-300 
              hover:scale-110 hover:rotate-1 animate-slideLeftAndFade"
          >
            Manage Games
          </button>
        </div>
        <p className="text-theme-secondary mt-2 animate-fadeIn">
          Create and manage your own custom number games
        </p>
      </div>

      {/* Transaction History */}
      <div className="card p-6 md:p-8 transform transition-all duration-300 hover:scale-105">
        <h2 className="text-xl font-semibold text-primary mb-4 animate-slideLeftAndFade">
          Recent Transactions
        </h2>
        <div className="space-y-4">
          {displayedTransactions.map((transaction, index) => (
            <TransactionItem 
              key={transaction.date}
              {...transaction}
            />
          ))}
          
          {filteredTransactions.length === 0 && (
            <div className="text-center text-theme-secondary py-4">
              No transactions yet
            </div>
          )}

          {/* Show "See More" button only if there are more than 4 transactions */}
          {filteredTransactions.length > 4 && (
            <button
              onClick={() => setShowAllTransactions(!showAllTransactions)}
              className="w-full mt-4 text-center text-primary hover:text-orange-500 
                transition-colors duration-300 py-2 rounded-lg glass-effect"
            >
              {showAllTransactions ? 'Show Less' : `See ${filteredTransactions.length - 4} More`}
            </button>
          )}
        </div>
      </div>

      {/* Referral Section */}
      <ReferralSection 
        referralCode={user.referralCode || 'CODE123'}
        referralCount={user.referralCount || 0}
        referralEarnings={user.referralEarnings || 0}
      />

      {/* Account Settings - Moved to bottom */}
      <div className="card p-6 md:p-8 transform transition-all duration-300 hover:scale-105">
        <h2 className="text-xl font-semibold text-primary mb-4 animate-slideLeftAndFade delay-300">
          Account Settings
        </h2>
        <div className="space-y-3">
          <button 
            onClick={() => setShowUpdatePhone(true)}
            className="w-full text-left px-4 py-3 rounded-lg glass-effect hover:text-primary 
              transition-all duration-300 hover:scale-105 hover:translate-x-2 flex items-center gap-3"
          >
            <PhoneIcon className="w-5 h-5" />
            Update Phone Number
          </button>
          <button 
            onClick={() => setShowSignOutConfirm(true)}
            className="w-full text-left px-4 py-3 rounded-lg glass-effect text-red-500 
              hover:text-red-400 transition-all duration-300 hover:scale-105 hover:translate-x-2 
              flex items-center gap-3"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {showDepositPopup && (
        <DepositPopup 
          onClose={() => setShowDepositPopup(false)}
          onSuccess={handleDepositSuccess}
        />
      )}

      {showWithdrawPopup && (
        <WithdrawPopup 
          onClose={() => setShowWithdrawPopup(false)}
          onSuccess={handleWithdrawSuccess}
        />
      )}

      {showUpdatePhone && (
        <UpdatePhonePopup
          currentPhone={phoneNumber}
          onClose={() => setShowUpdatePhone(false)}
          onUpdate={handleUpdatePhone}
        />
      )}

      {showSignOutConfirm && (
        <SignOutConfirm
          onConfirm={handleSignOut}
          onCancel={() => setShowSignOutConfirm(false)}
        />
      )}
    </div>
  );
}

// Update TransactionItem with hover animation
function TransactionItem({ type, amount, date, status }: {
  type: 'deposit' | 'withdraw' | 'win' | 'loss' | 'bet';
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}) {
  const getTypeColor = () => {
    switch(type) {
      case 'deposit':
      case 'win': 
        return 'text-green-500';
      case 'withdraw':
      case 'loss': 
        return 'text-red-500';
      case 'bet': 
        return 'text-blue-500';
      default: 
        return 'text-gray-500';
    }
  };

  const isPositive = type === 'deposit' || type === 'win';

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
          {isPositive ? '+' : '-'}{amount} Birr
        </span>
        <span className={`text-sm ${status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
          {status}
        </span>
      </div>
    </div>
  );
} 