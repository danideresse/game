'use client';

import Link from 'next/link';
import { PlusCircleIcon, PlayCircleIcon, CogIcon } from '@heroicons/react/24/outline';

export default function CustomGameNav() {
  return (
    <div className="fixed bottom-20 left-0 right-0 bg-gaming-dark/80 border-t border-white/10">
      <div className="max-w-xl mx-auto flex justify-around items-center p-3">
        <Link 
          href="/custom-game/create"
          className="flex flex-col items-center text-theme-secondary hover:text-primary transition-colors"
        >
          <PlusCircleIcon className="w-6 h-6" />
          <span className="text-xs">Create Game</span>
        </Link>

        <Link 
          href="/custom-game/join"
          className="flex flex-col items-center text-theme-secondary hover:text-primary transition-colors"
        >
          <PlayCircleIcon className="w-6 h-6" />
          <span className="text-xs">Join Game</span>
        </Link>

        <Link 
          href="/custom-game/manage"
          className="flex flex-col items-center text-theme-secondary hover:text-primary transition-colors"
        >
          <CogIcon className="w-6 h-6" />
          <span className="text-xs">Manage Games</span>
        </Link>
      </div>
    </div>
  );
} 