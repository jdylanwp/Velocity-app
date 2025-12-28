'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AdminRefresh() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTriggerScraper = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/trigger-scrape`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to trigger scraper');
      }

      const data = await response.json();

      toast({
        title: 'Scraper Triggered',
        description: data.message || 'The trend scraper has been initiated successfully.',
      });
    } catch (error) {
      console.error('Error triggering scraper:', error);
      toast({
        title: 'Error',
        description: 'Failed to trigger the scraper. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleTriggerScraper}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <RefreshCw className="w-4 h-4 mr-2" />
          Trigger Scraper
        </>
      )}
    </Button>
  );
}
