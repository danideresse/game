'use client';

import { useState } from 'react';
import { useGame } from '../context/GameContext';

export default function ReferralHistory() {
  const { referralRewards } = useGame();
  const [showAll, setShowAll] = useState(false);

  const displayedRewards = showAll ? referralRewards : referralRewards.slice(0, 3);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-theme-secondary">Recent Referrals</h3>
      
      {displayedRewards.map((reward) => (
        <div 
          key={reward.date}
          className="bg-gaming-dark/30 rounded-lg p-3 flex justify-between items-center"
        >
          <div>
            <p className="text-primary font-medium">{reward.referredUser}</p>
            <p className="text-sm text-theme-secondary">
              {new Date(reward.date).toLocaleDateString()}
            </p>
          </div>
          <div className="text-green-500 font-semibold">
            +{reward.amount} Birr
          </div>
        </div>
      ))}

      {referralRewards.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full text-center text-primary hover:text-orange-500 
            transition-colors duration-300 py-2 text-sm"
        >
          {showAll ? 'Show Less' : `View All (${referralRewards.length})`}
        </button>
      )}

      {referralRewards.length === 0 && (
        <div className="text-center text-theme-secondary py-4">
          No referral rewards yet
        </div>
      )}
    </div>
  );
} 