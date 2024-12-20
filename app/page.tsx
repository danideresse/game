'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Squares2X2Icon as ViewGridIcon, ListBulletIcon as ViewListIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [balance] = useState(0);
  const [isGridView, setIsGridView] = useState(true);
  const uniqueId = "USER123";
  
  const games = [
    {
      id: 1,
      title: 'ጨዋታ 1',
      description: 'ከ አምስቱ ቁጥሮች ውስጥ አንዱን ይምረጡ',
      href: '/games/game1'
    },
    {
      id: 2,
      title: 'ጨዋታ 2',
      description: 'ከ አስሩ ቁጥሮች ውስጥ አንዱን ይምረጡ',
      href: '/games/game2'
    }
  ];

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
          onClick={() => {/* Implement Telebirr integration */}}>
          <Image
            src="/telebirr.png"
            alt="Telebirr"
            width={24}
            height={24}
            className="w-6 h-6 sm:w-7 sm:h-7"
          />
          Deposit with Telebirr
        </button>
      </div>
    </div>
  );
}