'use client';

import BottomNav from './BottomNav';

export default function BottomNavWrapper() {
  // Check if user is logged in
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('user') !== null;
  
  // Don't render navigation if not logged in
  if (!isLoggedIn) {
    return null;
  }

  return <BottomNav />;
} 