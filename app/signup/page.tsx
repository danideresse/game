'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PhoneIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import PhoneInput from '../components/PhoneInput';
import { useGame } from '../context/GameContext';

function generateReferralCode(): string {
  // Generate a random string of 8 characters
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

export default function Signup() {
  const searchParams = useSearchParams();
  const [manualReferralCode, setManualReferralCode] = useState('');
  // Get referral code from URL or manual input
  const referralCode = searchParams.get('ref') || manualReferralCode;
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validatePassword = (pass: string) => {
    if (pass.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    if (!/\d/.test(pass)) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    if (!/[A-Z]/.test(pass)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (pass: string, confirm: string) => {
    if (pass !== confirm) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate password
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(password, confirmPassword);
    
    if (!isPasswordValid || !isConfirmValid) {
      return;
    }

    setIsLoading(true);

    try {
      // Generate a random referral code
      const newReferralCode = generateReferralCode();
      
      // Create new user
      const newUser = {
        username: username || 'User123',
        phone: phone || '+251912345678',
        isLoggedIn: true,
        referralCode: newReferralCode,
        referredBy: referralCode || null,
        referralCount: 0,
        referralbirr: 0,
        referralRewards: []
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));

      // If user was referred, update referrer's stats
      if (referralCode) {
        const referrer = JSON.parse(localStorage.getItem('user') || '{}');
        if (referrer.referralCode === referralCode) {
          const { updateReferralReward } = useGame();
          updateReferralReward(username);
        }
      }

      router.push('/');
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      username.length >= 3 &&
      phone.length >= 10 &&
      password.length >= 6 &&
      confirmPassword === password &&
      !passwordError &&
      !confirmPasswordError
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 card p-6 md:p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">Create Account</h2>
          <p className="mt-2 text-theme-secondary">Join us and start playing</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm text-theme-secondary block mb-2">
                Username
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-secondary" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-white/5 rounded-lg p-3 pl-10 
                    text-gray-600 dark:text-gray-400"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-theme-secondary block mb-2">
                Phone Number
              </label>
              <PhoneInput
                value={phone}
                onChange={setPhone}
                error={error && error.includes('phone') ? error : undefined}
              />
            </div>

            <div>
              <label className="text-sm text-theme-secondary block mb-2">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-secondary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  className={`w-full bg-gray-100 dark:bg-white/5 rounded-lg p-3 pl-10 
                    text-gray-600 dark:text-gray-400
                    ${passwordError ? 'border-2 border-red-500' : ''}
                  `}
                  placeholder="••••••••"
                  required
                />
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
              )}
              <p className="text-xs text-theme-secondary mt-1">
                Must be at least 6 characters with 1 number and 1 uppercase letter
              </p>
            </div>

            <div>
              <label className="text-sm text-theme-secondary block mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-secondary" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    validateConfirmPassword(password, e.target.value);
                  }}
                  className={`w-full bg-gray-100 dark:bg-white/5 rounded-lg p-3 pl-10 
                    text-gray-600 dark:text-gray-400
                    ${confirmPasswordError ? 'border-2 border-red-500' : ''}
                  `}
                  placeholder="••••••••"
                  required
                />
              </div>
              {confirmPasswordError && (
                <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>
              )}
            </div>

            {/* Optional Referral Code Input - only show if no URL referral code */}
            {!searchParams.get('ref') && (
              <div>
                <label className="text-sm text-theme-secondary block mb-2 flex justify-between">
                  <span>Referral Code</span>
                  <span className="text-primary">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={manualReferralCode}
                    onChange={(e) => setManualReferralCode(e.target.value.toUpperCase())}
                    className="w-full bg-gray-100 dark:bg-white/5 rounded-lg p-3
                      text-gray-600 dark:text-gray-400 font-mono"
                    placeholder="Enter referral code"
                  />
                  {manualReferralCode && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                      <span className={`${
                        manualReferralCode.length === 8 
                          ? 'text-green-500' 
                          : 'text-gray-400'
                      }`}>
                        {manualReferralCode.length}/8
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-theme-secondary mt-1">
                  Enter a friend's referral code to get bonus birr!
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !isFormValid()}
            className={`
              w-full py-3 rounded-lg font-bold transition-all duration-300
              bg-gradient-to-r from-primary to-orange-500
              ${(isLoading || !isFormValid()) 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-105'}
            `}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Show referral bonus info if code is present */}
          {referralCode && (
            <div className="text-center text-sm">
              <span className="text-green-500">✨ Bonus birr will be added on signup!</span>
            </div>
          )}

          <div className="text-center text-sm text-theme-secondary">
            Already have an account?{' '}
            <Link 
              href="/login"
              className="text-primary hover:text-orange-500 transition-colors font-semibold"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 