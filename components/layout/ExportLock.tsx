'use client';

import { useState } from 'react';
import { Download, Lock, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { SubscriptionTier } from '@/lib/plans';

interface ExportLockProps {
  userTier: SubscriptionTier;
}

export function ExportLock({ userTier }: ExportLockProps) {
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const isLocked = userTier !== 'business';

  const handleExport = () => {
    if (isLocked) {
      setShowUpgradeDialog(true);
      return;
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        className="hidden md:flex gap-2"
      >
        {isLocked ? (
          <>
            <Lock className="w-4 h-4" />
            <span>Export</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </>
        )}
      </Button>

      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Download className="w-8 h-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              CSV Export is a Business Feature
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Upgrade to Business to export trends data, access our API, and unlock team collaboration features.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Download className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-medium">CSV Export</p>
                <p className="text-xs text-muted-foreground">Download all trend data</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
              <div className="w-8 h-8 rounded-full bg-[#6366f1]/10 flex items-center justify-center shrink-0">
                <Crown className="w-4 h-4 text-[#6366f1]" />
              </div>
              <div>
                <p className="text-sm font-medium">API Access</p>
                <p className="text-xs text-muted-foreground">Integrate with your tools</p>
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
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                Upgrade to Business
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
