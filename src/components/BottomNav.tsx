'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bell, User } from 'lucide-react';
import { clsx } from 'clsx';

export default function BottomNav() {
  const pathname = usePathname();
  
  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/alerts', icon: Bell, label: 'Alerts' }, // Page à créer plus tard
    { href: '/profile', icon: User, label: 'Profile' }, // Page à créer plus tard
  ];

  // Ne pas afficher la nav si on est dans un formulaire d'ajout
  if (pathname.includes('/add')) return null;

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 px-6 py-3 safe-area-bottom z-50">
      <div className="flex items-center justify-around">
        {links.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link 
              key={href} 
              href={href}
              className="flex flex-col items-center gap-1 py-2 transition-all"
            >
              <Icon className={clsx("w-6 h-6", isActive ? 'text-emerald-500' : 'text-gray-400')} />
              <span className={clsx("text-xs font-medium", isActive ? 'text-emerald-500' : 'text-gray-500')}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}