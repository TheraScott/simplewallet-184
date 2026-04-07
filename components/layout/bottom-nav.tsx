'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Home,
  UserRound,
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/deposit', label: 'Deposit', icon: ArrowDownToLine },
  { href: '/withdraw', label: 'Withdraw', icon: ArrowUpFromLine },
  { href: '/activity', label: 'Activity', icon: Activity },
  { href: '/me', label: 'Me', icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <nav className="pointer-events-auto flex w-full max-w-[430px] rounded-full border border-white/80 bg-[#101828]/95 px-2 py-2 shadow-soft backdrop-blur">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-full px-1 py-2 text-[11px] font-semibold transition',
                active
                  ? 'bg-white text-[#101828]'
                  : 'text-white/75 hover:text-white'
              )}
            >
              <Icon size={18} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
