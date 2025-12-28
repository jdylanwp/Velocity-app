'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { mockCategories } from '@/lib/mockData';
import {
  Compass,
  Bookmark,
  Sparkles,
  Zap,
  ChevronLeft,
  ChevronRight,
  X,
  Target,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  isPro?: boolean;
  isAdmin?: boolean;
}

const mainNavItems = [
  { name: 'Discover', href: '/', icon: Compass },
  { name: 'Saved Trends', href: '/saved', icon: Bookmark },
  { name: 'Pro Predictions', href: '/predictions', icon: Sparkles },
];

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose, isPro = false, isAdmin = false }: SidebarProps) {
  const pathname = usePathname();

  const handleNavClick = () => {
    if (mobileOpen) {
      onMobileClose();
    }
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-card border-r border-zinc-200 dark:border-zinc-800 z-40 transition-all duration-300 flex flex-col',
        collapsed ? 'w-[72px]' : 'w-64',
        'lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 h-16 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#6366f1]">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold tracking-tight text-foreground">
              Velocity
            </span>
          )}
        </div>
        {mobileOpen && (
          <button
            onClick={onMobileClose}
            className="lg:hidden p-2 text-zinc-400 hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#6366f1]/10 text-[#6366f1]'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}

        {isPro && (
          <>
            <Link
              href="/?view=my-niches"
              onClick={handleNavClick}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname === '/' && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('view') === 'my-niches'
                  ? 'bg-[#6366f1]/10 text-[#6366f1]'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground'
              )}
            >
              <Target className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>My Niches</span>}
            </Link>
            <Link
              href="/hunter"
              onClick={handleNavClick}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname === '/hunter'
                  ? 'bg-[#6366f1]/10 text-[#6366f1]'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground'
              )}
            >
              <Target className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>Niche Hunter</span>}
            </Link>
          </>
        )}

        {isAdmin && (
          <Link
            href="/admin/seeds"
            onClick={handleNavClick}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === '/admin/seeds'
                ? 'bg-[#6366f1]/10 text-[#6366f1]'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground'
            )}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Admin Seeds</span>}
          </Link>
        )}

        {!collapsed && (
          <>
            <div className="pt-4 pb-2">
              <span className="px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Categories
              </span>
            </div>
            {mockCategories.map((category) => {
              const isActive = pathname === `/category/${category.slug}`;
              return (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  onClick={handleNavClick}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-[#6366f1]/10 text-[#6366f1]'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground'
                  )}
                >
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      isActive ? 'bg-[#6366f1]' : 'bg-zinc-300 dark:bg-zinc-600'
                    )}
                  />
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <button
        onClick={onToggle}
        className="hidden lg:flex items-center justify-center h-12 border-t border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>
    </aside>
  );
}
