'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Squares2X2Icon as ViewGridIcon, ListBulletIcon as ViewListIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import DepositPopup from './components/DepositPopup';
import { useGame } from './context/GameContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { balance, updateBalance, transactions, addTransaction } = useGame();
  const [isGridView, setIsGridView] = useState(true);
  const [showDepositPopup, setShowDepositPopup] = useState(false);
  const uniqueId = "USER123";
  const router = useRouter();
  
  const games = [
    {
      id: 1,
      title: 'ጨዋታ 1',
      description: 'ከ አምስቱ ቁጥሮች ውስጥ አንዱን ይምረጡ',
      href: '/games/game1',
      stake: 10
    },
    {
      id: 2,
      title: 'ጨዋታ 2',
      description: 'ከ አስሩ ቁጥሮች ውስጥ አንዱን ይምረጡ',
      href: '/games/game2',
      stake: 30
    }
  ];

  const handleDepositSuccess = (birr: number) => {
    updateBalance(birr);
    addTransaction({
      type: 'deposit',
      amount: birr,
      date: new Date().toISOString(),
      status: 'completed'
    });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-20 space-y-8 animate-slideUpAndFade">
      <div className="text-center mb-8 card p-6 md:p-8 max-w-xl mx-auto">
        <p className="text-theme-secondary animate-fadeIn text-sm sm:text-base">ID: {uniqueId}</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 animate-float number-glow text-primary">
          {balance.toFixed(2)} Birr
        </h1>
      </div>
      
      <div className="flex justify-end max-w-2xl mx-auto px-2">
        <div className="bg-gaming-dark/50 backdrop-blur-sm rounded-lg p-1 flex gap-1">
          <button
            onClick={() => setIsGridView(true)}
            className={`p-2 rounded-md transition-all duration-300 ${
              isGridView 
                ? 'bg-primary/20 text-primary' 
                : 'hover:bg-primary/10 text-theme-secondary'
            }`}
            aria-label="Grid view"
          >
            <ViewGridIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsGridView(false)}
            className={`p-2 rounded-md transition-all duration-300 ${
              !isGridView 
                ? 'bg-primary/20 text-primary' 
                : 'hover:bg-primary/10 text-theme-secondary'
            }`}
            aria-label="List view"
          >
            <ViewListIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/custom-game/join')}
          className="w-full btn-primary flex items-center justify-center gap-2 py-4"
        >
          <PlusCircleIcon className="w-6 h-6" />
          Join / Create Custom Game
        </button>
      </div>

      <div className={`
        max-w-2xl mx-auto transition-all duration-500 ease-in-out
        ${isGridView ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6' : 'flex flex-col space-y-4'}
      `}>
        {games.map((game) => (
          <Link
            key={game.id}
            href={game.href}
            className={`
              card p-6 md:p-8 group
              transition-all duration-300 
              hover:scale-105 hover:shadow-xl
              ${isGridView ? 'text-center' : 'flex items-center justify-between hover:translate-x-2'}
            `}
          >
            <div className={isGridView ? '' : 'flex items-center gap-4'}>
              <div className={`
                w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 
                flex items-center justify-center text-white font-bold
                ${isGridView ? 'mx-auto mb-4' : 'shrink-0'}
              `}>
                {game.id}
              </div>
              <div className={!isGridView ? 'flex-1' : ''}>
                <h2 className="font-bold mb-2 text-primary text-lg sm:text-xl">
                  {game.title}
                </h2>
                <p className="text-sm sm:text-base text-theme-secondary">
                  {game.description}
                </p>
                <p className="text-sm font-semibold text-primary">
                  Stake: {game.stake} Birr
                </p>
              </div>
            </div>
            {!isGridView && (
              <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            )}
          </Link>
        ))}
      </div>
      
      <div className="max-w-md mx-auto w-full">
        <button 
          className="btn-primary w-full animate-fadeIn text-sm sm:text-base flex items-center justify-center gap-2"
          onClick={() => setShowDepositPopup(true)}>
          Deposit with Telebirr
        </button>
      </div>

      {showDepositPopup && (
        <DepositPopup 
          onClose={() => setShowDepositPopup(false)}
          onSuccess={handleDepositSuccess}
        />
      )}
    </div>
  );
}