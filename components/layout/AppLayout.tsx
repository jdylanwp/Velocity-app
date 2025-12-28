'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SubscriptionTier } from '@/lib/plans';

interface AppLayoutProps {
  children: ReactNode;
  userTier?: SubscriptionTier;
  userEmail?: string | null;
}

const ADMIN_EMAIL = 'admin@velocity.com';

export function AppLayout({ children, userTier = 'free', userEmail = null }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const isPro = userTier === 'pro';
  const isAdmin = userEmail === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-background">
      {mobileMenuOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        collapsed={isMobile ? false : sidebarCollapsed}
        onToggle={handleToggleSidebar}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        isPro={isPro}
        isAdmin={isAdmin}
      />

      <div
        className={`transition-all duration-300 ${
          isMobile ? 'pl-0' : sidebarCollapsed ? 'pl-[72px]' : 'pl-64'
        }`}
      >
        <Header onMenuClick={handleToggleSidebar} showMenuButton={isMobile} userTier={userTier} userEmail={userEmail} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
