'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(pathname);

    if (!user && !isAuthPage) {
      router.push('/login');
    } else if (user && isAuthPage) {
      router.push('/');
    }

    setIsLoggedIn(!!user);
    setIsLoading(false);
  }, [pathname, router]);

  const logout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return { isLoggedIn, isLoading, logout };
} 