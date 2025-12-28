'use client';

import { Crown, ChevronDown, Settings, LogOut, User, Menu, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { SearchLock } from '@/components/layout/SearchLock';
import { ExportLock } from '@/components/layout/ExportLock';
import { SubscriptionTier } from '@/lib/plans';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useState } from 'react';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  userTier?: SubscriptionTier;
  userEmail?: string | null;
}

export function Header({ onSearch, onMenuClick, showMenuButton, userTier = 'free', userEmail = null }: HeaderProps) {
  const router = useRouter();
  const isPro = userTier !== 'free';
  const isAuthenticated = !!userEmail;
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-3 flex-1">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}

          <SearchLock onSearch={onSearch} userTier={userTier} />
        </div>

        <div className="flex items-center gap-2 md:gap-4 ml-2 md:ml-4">
          <ExportLock userTier={userTier} />

          {!isPro && isAuthenticated && (
            <Link href="/pricing">
              <Button className="hidden sm:flex bg-[#6366f1] hover:bg-[#5558e3] text-white gap-2">
                <Crown className="w-4 h-4" />
                <span className="hidden md:inline">Upgrade to Pro</span>
              </Button>
              <Button size="icon" className="sm:hidden bg-[#6366f1] hover:bg-[#5558e3] text-white">
                <Crown className="w-4 h-4" />
              </Button>
            </Link>
          )}

          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-[#6366f1] hover:bg-[#5558e3] text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-2 md:px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#6366f1] flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {userEmail?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-foreground">
                      {userEmail?.split('@')[0]}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {userTier} Plan
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-zinc-400 hidden md:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{userEmail}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {userTier} Plan
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings?tab=subscription" className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {isLoggingOut ? 'Logging out...' : 'Log out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
