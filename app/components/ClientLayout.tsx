'use client';

import { useAuth } from '../hooks/useAuth';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return children;
} 