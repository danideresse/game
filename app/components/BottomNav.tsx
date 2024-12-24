'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: HomeIcon,
    },
    {
      label: 'History',
      href: '/history',
      icon: ClockIcon,
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: UserIcon,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gaming-dark/80">
      <div className="max-w-xl mx-auto flex justify-around items-center p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center transition-colors
                ${isActive ? 'text-primary' : 'text-theme-secondary hover:text-primary'}`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 