'use client';

import { useState } from 'react';
import { SeedWithTrendCount, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, Trash2, Loader2, Lock, Sparkles, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

interface NicheHunterClientProps {
  isPro: boolean;
  userSeeds: SeedWithTrendCount[];
  categories: Category[];
}

export function NicheHunterClient({ isPro, userSeeds, categories }: NicheHunterClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [newNiche, setNewNiche] = useState('');
  const [nicheCategory, setNicheCategory] = useState('');

  const handleAddNiche = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNiche.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/seeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          term: newNiche.trim(),
          category_id: nicheCategory ? parseInt(nicheCategory) : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add niche');
      }

      setNewNiche('');
      setNicheCategory('');
      toast.success('Niche added! Trends will appear after the next scrape.');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add niche');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNiche = async (id: number) => {
    try {
      const response = await fetch('/api/seeds', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete niche');

      toast.success('Niche removed');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete niche');
    }
  };

  if (!isPro) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Niche Hunter</h1>
          <p className="text-zinc-400">
            Track specific niches and get personalized trend discoveries
          </p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-zinc-400" />
            </div>
            <CardTitle className="text-2xl">Unlock Niche Hunter</CardTitle>
            <CardDescription className="text-base">
              Upgrade to Pro to track your own custom niches
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-emerald-400 mt-1" />
                <div>
                  <h3 className="font-medium text-white mb-1">3 Custom Niche Slots</h3>
                  <p className="text-sm text-zinc-400">
                    Add up to 3 specific niches like "Mechanical Keyboards" or "Nootropics"
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 mt-1" />
                <div>
                  <h3 className="font-medium text-white mb-1">Private Trend Feed</h3>
                  <p className="text-sm text-zinc-400">
                    Get a personalized "My Niches" tab with trends only you see
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-400 mt-1" />
                <div>
                  <h3 className="font-medium text-white mb-1">Early Discovery</h3>
                  <p className="text-sm text-zinc-400">
                    Be the first to spot emerging opportunities in your industry
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800">
              <Button asChild className="w-full" size="lg">
                <Link href="/pricing">
                  Upgrade to Pro
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const slotsUsed = userSeeds.length;
  const slotsRemaining = 3 - slotsUsed;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="border-b border-zinc-800 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Niche Hunter</h1>
            <p className="text-zinc-400">
              Track up to 3 custom niches and discover trends tailored to your interests
            </p>
          </div>
          <Badge variant="default" className="text-sm px-3 py-1">
            {slotsUsed} / 3 Slots Used
          </Badge>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Your Niche
          </CardTitle>
          <CardDescription>
            Enter a specific topic you want to track. Trends will appear in your "My Niches" tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddNiche} className="space-y-4">
            <div>
              <Label htmlFor="niche">Niche Topic</Label>
              <Input
                id="niche"
                value={newNiche}
                onChange={(e) => setNewNiche(e.target.value)}
                placeholder="e.g., Mechanical Keyboards, Nootropics, Electric Bikes"
                className="bg-zinc-800 border-zinc-700"
                disabled={slotsRemaining === 0}
              />
            </div>
            <div>
              <Label htmlFor="niche-category">Category (Optional)</Label>
              <Select
                value={nicheCategory}
                onValueChange={setNicheCategory}
                disabled={slotsRemaining === 0}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={isLoading || slotsRemaining === 0}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : slotsRemaining === 0 ? (
                'All Slots Used - Delete one to add another'
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Niche ({slotsRemaining} slot{slotsRemaining !== 1 ? 's' : ''} remaining)
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Your Niches ({userSeeds.length})</CardTitle>
          <CardDescription>
            Manage your tracked niches and view their discovery performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userSeeds.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No niches yet</h3>
              <p className="text-zinc-400 text-sm">
                Add your first niche above to start discovering personalized trends
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userSeeds.map((seed) => (
                <div
                  key={seed.id}
                  className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg border border-zinc-700"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-white">{seed.term}</h3>
                      {seed.categories && (
                        <Badge variant="outline" className="text-xs">
                          {seed.categories.name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                      <span>{seed.trend_count || 0} trends discovered</span>
                      <span>
                        Added {new Date(seed.created_at).toLocaleDateString()}
                      </span>
                      {seed.last_scraped_at && (
                        <span>
                          Last scraped {new Date(seed.last_scraped_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Niche</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove "{seed.term}"? You can add it back later.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteNiche(seed.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 mt-1" />
            <div>
              <h3 className="font-medium text-white mb-1">How it works</h3>
              <p className="text-sm text-zinc-400">
                Once you add a niche, our system will automatically discover related trends
                during the next scrape cycle. View your personalized trends in the "My Niches"
                tab on the main dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
