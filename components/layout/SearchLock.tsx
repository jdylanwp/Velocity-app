'use client';

import { useState } from 'react';
import { Search, Lock, Crown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SubscriptionTier } from '@/lib/plans';

interface SearchLockProps {
  onSearch?: (query: string) => void;
  userTier: SubscriptionTier;
}

export function SearchLock({ onSearch, userTier }: SearchLockProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const isLocked = userTier === 'free';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      setShowUpgradeDialog(true);
      return;
    }
    onSearch?.(searchQuery);
  };

  const handleInputClick = () => {
    if (isLocked) {
      setShowUpgradeDialog(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          {isLocked && (
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6366f1]" />
          )}
          <Input
            type="text"
            placeholder={isLocked ? 'Search locked - Upgrade to Pro' : 'Search for trends...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={handleInputClick}
            disabled={isLocked}
            className={`pl-10 ${isLocked ? 'pr-10' : ''} h-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 focus:border-[#6366f1] focus:ring-[#6366f1]/20 ${
              isLocked ? 'cursor-pointer' : ''
            }`}
          />
        </div>
      </form>

      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              Search is a Pro Feature
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Upgrade to Pro to unlock unlimited search across all trends, advanced filters, and real-time insights.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
              <div className="w-8 h-8 rounded-full bg-[#6366f1]/10 flex items-center justify-center shrink-0">
                <Search className="w-4 h-4 text-[#6366f1]" />
              </div>
              <div>
                <p className="text-sm font-medium">Advanced Search</p>
                <p className="text-xs text-muted-foreground">Find any trend instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Crown className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Velocity Scores</p>
                <p className="text-xs text-muted-foreground">Track trend momentum</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowUpgradeDialog(false)}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Link href="/pricing" className="flex-1">
              <Button className="w-full bg-[#6366f1] hover:bg-[#5558e3] text-white">
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
