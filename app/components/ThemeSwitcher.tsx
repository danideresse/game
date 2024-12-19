'use client';

import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-2 rounded-full glass-effect transition-all duration-300 
        hover:scale-110 sm:relative sm:top-0 sm:right-0 sm:float-right sm:m-4"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <SunIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
      ) : (
        <MoonIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
      )}
    </button>
  );
} 