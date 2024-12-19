"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline'

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/', icon: <HomeIcon className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Home' },
  { href: '/history', icon: <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'History' },
  { href: '/profile', icon: <UserIcon className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Profile' }
]

const Navigation = () => {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-7xl mx-auto">
      <div className="bg-gaming-dark/95 backdrop-blur-lg rounded-t-3xl shadow-lg">
        <div className="flex justify-around items-center px-4 h-14 sm:h-16 max-w-3xl mx-auto">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`
                flex flex-col items-center justify-center
                ${isActive(item.href) ? 'text-primary' : 'text-gray-400'}
                transition-colors duration-200 hover:text-primary
              `}
            >
              {item.icon}
              <span className="text-xs sm:text-sm mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
