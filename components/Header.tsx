'use client';

import Link from 'next/link';
import { ModeToggle } from './ModeToggle';

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-900 bg-background">
      {/* Left side: App name / logo */}
      <Link href="/" className="text-xl font-bold tracking-tight">
        CronEase
      </Link>

      {/* Right side: Theme toggle */}
      <div className="flex items-center gap-2">
        <ModeToggle />
      </div>
    </header>
  );
}
