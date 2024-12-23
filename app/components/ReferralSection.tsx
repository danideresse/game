'use client';

import { useState } from 'react';
import { UserPlusIcon, ClipboardIcon, CheckIcon, ShareIcon } from '@heroicons/react/24/outline';
import ReferralHistory from './ReferralHistory';

interface ReferralSectionProps {
  referralCode: string;
  referralCount: number;
  referralPoints: number;
}

export default function ReferralSection({ referralCode, referralCount, referralPoints }: ReferralSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyReferralLink = async () => {
    const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Number Game!',
          text: `Use my referral code ${referralCode} to sign up and get bonus points!`,
          url: `${window.location.origin}/signup?ref=${referralCode}`
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopyReferralLink();
    }
  };

  return (
    <div className="card p-6 md:p-8 transform transition-all duration-300 hover:scale-105">
      <div className="flex items-center gap-2 mb-6">
        <UserPlusIcon className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-primary">Referrals</h2>
      </div>

      <div className="space-y-6">
        {/* Referral Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gaming-dark/30 rounded-lg p-4 text-center">
            <p className="text-theme-secondary text-sm">Total Referrals</p>
            <p className="text-2xl font-bold text-primary mt-1">{referralCount}</p>
          </div>
          <div className="bg-gaming-dark/30 rounded-lg p-4 text-center">
            <p className="text-theme-secondary text-sm">Points Earned</p>
            <p className="text-2xl font-bold text-primary mt-1">{referralPoints}</p>
          </div>
        </div>

        {/* Referral Code */}
        <div className="space-y-2">
          <p className="text-sm text-theme-secondary">Your Referral Code</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-gaming-dark/30 rounded-lg p-3 font-mono text-primary">
              {referralCode}
            </div>
            <button
              onClick={handleCopyReferralLink}
              className="bg-primary/10 hover:bg-primary/20 text-primary p-3 rounded-lg transition-all duration-300"
            >
              {copied ? <CheckIcon className="w-5 h-5" /> : <ClipboardIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full bg-primary/10 hover:bg-primary/20 text-primary p-3 
            rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          <ShareIcon className="w-5 h-5" />
          Share with Friends
        </button>

        {/* Referral History */}
        <ReferralHistory />

        {/* Referral Info */}
        <div className="bg-gaming-dark/30 rounded-lg p-4 text-sm">
          <p className="text-theme-secondary">
            Share your referral code with friends and earn <span className="text-primary font-bold">100 points</span> for each friend who signs up and makes their first deposit!
          </p>
        </div>
      </div>
    </div>
  );
} 