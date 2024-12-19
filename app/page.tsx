'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [balance, setBalance] = useState(0);
  const uniqueId = "USER123";
  
  return (
    <div className="p-4 sm:p-6 md:p-8 pb-20 space-y-8 animate-slide-up">
      <div className="text-center mb-8 card p-6 md:p-8 max-w-xl mx-auto">
        <p className="text-gray-300 animate-fade-in text-sm sm:text-base">ID: {uniqueId}</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 animate-float number-glow text-primary">
          {balance.toFixed(2)} Birr
        </h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8 max-w-2xl mx-auto">
        <Link href="/games/game1" 
          className="card p-6 md:p-8 text-center hover:scale-105 transition-transform">
          <h2 className="font-bold mb-2 text-primary text-lg sm:text-xl">Game 1</h2>
          <p className="text-sm sm:text-base text-gray-300">Choose from 5 numbers</p>
        </Link>
        
        <Link href="/games/game2"
          className="card p-6 md:p-8 text-center hover:scale-105 transition-transform">
          <h2 className="font-bold mb-2 text-primary text-lg sm:text-xl">Game 2</h2>
          <p className="text-sm sm:text-base text-gray-300">Choose from 10 numbers</p>
        </Link>
      </div>
      
      <div className="max-w-md mx-auto w-full">
        <button 
          className="btn-primary w-full animate-fade-in text-sm sm:text-base flex items-center justify-center gap-2"
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