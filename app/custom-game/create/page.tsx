'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '../../context/GameContext';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function CreateCustomGame() {
  const router = useRouter();
  const { user } = useGame();
  const [numberCount, setNumberCount] = useState(5);
  const [timerLimit, setTimerLimit] = useState(60);
  const [stakeAmount, setStakeAmount] = useState(10);
  const [gameCode, setGameCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [gameName, setGameName] = useState('');
  const [numberError, setNumberError] = useState('');
  const [timerError, setTimerError] = useState('');

  const generateGameCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreateGame = async () => {
    const newGameCode = generateGameCode();
    const newGame = {
      code: newGameCode,
      name: gameName,
      creatorId: user?.username,
      numberCount,
      timerLimit,
      stakeAmount,
      createdAt: new Date().toISOString(),
      active: true,
      totalCommission: 0
    };

    const existingGames = JSON.parse(localStorage.getItem('customGames') || '[]');
    localStorage.setItem('customGames', JSON.stringify([...existingGames, newGame]));
    
    setGameCode(newGameCode);
    setShowSuccess(true);
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(gameCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNumberCountChange = (value: number) => {
    if (value < 2) {
      setNumberError('Minimum 2 numbers required');
      setNumberCount(2);
    } else if (value > 20) {
      setNumberError('Maximum 20 numbers allowed');
      setNumberCount(20);
    } else {
      setNumberError('');
      setNumberCount(value);
    }
  };

  const validateTimer = (seconds: number) => {
    if (seconds < 10) {
      setTimerError('Minimum time is 10 seconds');
      setTimerLimit(10);
      return false;
    }
    if (seconds > 300) {
      setTimerError('Maximum time is 5 minutes (300 seconds)');
      setTimerLimit(300);
      return false;
    }
    setTimerError('');
    return true;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto animate-slideUpAndFade">
      <div className="text-center mb-8 card p-4 md:p-6">
        <h1 className="text-2xl font-bold text-primary">Create Custom Game</h1>
        <p className="text-theme-secondary mt-2">Customize your own number game</p>
      </div>
      
      <div className="space-y-6">
        {/* Game Name Card */}
        <div className="card p-4 md:p-6">
          <label className="text-sm text-theme-secondary block mb-2">
            Game Name
          </label>
          <input
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="w-full bg-gaming-dark/30 rounded-lg p-3 transition-all focus:ring-2 focus:ring-primary"
            placeholder="Enter a name for your game"
            required
          />
        </div>

        {/* Game Settings Card */}
        <div className="card p-4 md:p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">Game Settings</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Number Count */}
            <div>
              <label className="text-sm text-theme-secondary block mb-2">
                Numbers
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={2}
                  max={20}
                  value={numberCount}
                  onChange={(e) => handleNumberCountChange(parseInt(e.target.value))}
                  className={`w-full bg-gaming-dark/30 rounded-lg p-3 text-center font-bold
                    ${numberError ? 'border-red-500 border-2' : 'border border-gaming-dark/50'}
                    text-primary`}
                />
              </div>
              {numberError && (
                <p className="text-red-500 text-xs mt-1">{numberError}</p>
              )}
              <p className="text-xs text-theme-secondary mt-1">2-20 numbers</p>
            </div>

            {/* Timer */}
            <div>
              <label className="text-sm text-theme-secondary block mb-2">
                Timer (seconds)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={10}
                  max={300}
                  value={timerLimit}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    validateTimer(value);
                    setTimerLimit(value);
                  }}
                  className={`w-full bg-gaming-dark/30 rounded-lg p-3 text-center font-bold
                    ${timerError ? 'border-2 border-red-500' : 'border border-gaming-dark/50'}
                    text-primary`}
                />
              </div>
              {timerError && (
                <p className="text-red-500 text-xs mt-1">{timerError}</p>
              )}
              <p className="text-xs text-theme-secondary mt-1">10-300 seconds</p>
            </div>

            {/* Stake Amount */}
            <div>
              <label className="text-sm text-theme-secondary block mb-2">
                Stake
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={10}
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(parseInt(e.target.value))}
                  className="w-full bg-gaming-dark/30 rounded-lg p-3 text-center font-bold text-primary"
                />
              </div>
              <p className="text-xs text-theme-secondary mt-1">Min. 10 Birr</p>
            </div>
          </div>
        </div>

        {/* Quick Presets Card */}
        <div className="card p-4 md:p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">Quick Presets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => {
                setNumberCount(5);
                setTimerLimit(60);
                setStakeAmount(10);
              }}
              className="card p-4 text-center hover:scale-105 transition-all duration-300"
            >
              <h3 className="text-primary font-bold mb-2">Basic</h3>
              <div className="text-sm text-theme-secondary space-y-1">
                <p>5 numbers</p>
                <p>60 seconds</p>
                <p>10 Birr</p>
              </div>
            </button>

            <button
              onClick={() => {
                setNumberCount(10);
                setTimerLimit(90);
                setStakeAmount(20);
              }}
              className="card p-4 text-center hover:scale-105 transition-all duration-300"
            >
              <h3 className="text-primary font-bold mb-2">Standard</h3>
              <div className="text-sm text-theme-secondary space-y-1">
                <p>10 numbers</p>
                <p>90 seconds</p>
                <p>20 Birr</p>
              </div>
            </button>

            <button
              onClick={() => {
                setNumberCount(15);
                setTimerLimit(120);
                setStakeAmount(50);
              }}
              className="card p-4 text-center hover:scale-105 transition-all duration-300"
            >
              <h3 className="text-primary font-bold mb-2">Pro</h3>
              <div className="text-sm text-theme-secondary space-y-1">
                <p>15 numbers</p>
                <p>120 seconds</p>
                <p>50 Birr</p>
              </div>
            </button>
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreateGame}
          disabled={!gameName || numberError}
          className="w-full btn-primary py-4 text-lg disabled:opacity-50"
        >
          Create Game
        </button>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-gaming-dark rounded-2xl p-6 md:p-8 max-w-md w-full animate-slideUpAndFade">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckIcon className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-primary">Game Created!</h2>
              <p className="text-theme-secondary">Share this code with your friends to let them join:</p>
              
              <div className="bg-gaming-dark/30 rounded-lg p-4 flex items-center gap-2">
                <div className="flex-1 font-mono text-2xl text-primary text-center">
                  {gameCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary"
                >
                  {copied ? <CheckIcon className="w-5 h-5" /> : <ClipboardIcon className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => router.push('/custom-game/manage')}
                  className="flex-1 btn-primary py-3"
                >
                  Manage Games
                </button>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="flex-1 bg-gaming-dark/30 text-theme-secondary hover:text-primary rounded-lg py-3"
                >
                  Create Another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 