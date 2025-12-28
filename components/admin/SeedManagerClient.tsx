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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
import { Sparkles, Plus, Trash2, Power, PowerOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface SeedManagerClientProps {
  seeds: SeedWithTrendCount[];
  categories: Category[];
}

export function SeedManagerClient({ seeds, categories }: SeedManagerClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [newSeedTerm, setNewSeedTerm] = useState('');
  const [newSeedCategory, setNewSeedCategory] = useState('');
  const [isScraping, setIsScraping] = useState(false);

  const handleAddSeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeedTerm.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/seeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          term: newSeedTerm.trim(),
          category_id: newSeedCategory ? parseInt(newSeedCategory) : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add seed');
      }

      setNewSeedTerm('');
      setNewSeedCategory('');
      toast.success('Seed added successfully');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add seed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSeed = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/seeds', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          is_active: !currentStatus,
        }),
      });

      if (!response.ok) throw new Error('Failed to toggle seed');

      toast.success(currentStatus ? 'Seed deactivated' : 'Seed activated');
      router.refresh();
    } catch (error) {
      toast.error('Failed to update seed');
    }
  };

  const handleDeleteSeed = async (id: number) => {
    try {
      const response = await fetch('/api/seeds', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete seed');

      toast.success('Seed deleted');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete seed');
    }
  };

  const handleTriggerScrape = async () => {
    setIsScraping(true);
    try {
      const response = await fetch('/api/trigger-scrape', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to trigger scrape');

      const data = await response.json();
      toast.success('Scraper triggered successfully!');
    } catch (error) {
      toast.error('Failed to trigger scraper');
    } finally {
      setIsScraping(false);
    }
  };

  const activeSeeds = seeds.filter(s => s.is_active);
  const inactiveSeeds = seeds.filter(s => !s.is_active);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Global Seed
            </CardTitle>
            <CardDescription>
              Add broad topics to discover new trends across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSeed} className="space-y-4">
              <div>
                <Label htmlFor="term">Seed Term</Label>
                <Input
                  id="term"
                  value={newSeedTerm}
                  onChange={(e) => setNewSeedTerm(e.target.value)}
                  placeholder="e.g., Biohacking, SaaS, Web3"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <Label htmlFor="category">Category (Optional)</Label>
                <Select value={newSeedCategory} onValueChange={setNewSeedCategory}>
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
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Seed
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Manual Scrape Trigger
            </CardTitle>
            <CardDescription>
              Wake up the GitHub Action to scrape immediately
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
              <div className="text-sm text-zinc-400 space-y-2">
                <p>Active Seeds: {activeSeeds.length}</p>
                <p>Total Trends Generated: {seeds.reduce((acc, s) => acc + (s.trend_count || 0), 0)}</p>
              </div>
            </div>
            <Button
              onClick={handleTriggerScrape}
              disabled={isScraping}
              className="w-full"
              variant="default"
            >
              {isScraping ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Triggering...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Trigger Scrape Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>All Seeds ({seeds.length})</CardTitle>
          <CardDescription>
            Manage all discovery seeds and monitor their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800">
                <TableHead>Term</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Added By</TableHead>
                <TableHead>Trends</TableHead>
                <TableHead>Last Scraped</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seeds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-zinc-500 py-8">
                    No seeds yet. Add your first seed to get started.
                  </TableCell>
                </TableRow>
              ) : (
                seeds.map((seed) => (
                  <TableRow key={seed.id} className="border-zinc-800">
                    <TableCell className="font-medium">{seed.term}</TableCell>
                    <TableCell>
                      {seed.categories ? (
                        <Badge variant="outline" className="text-xs">
                          {seed.categories.name}
                        </Badge>
                      ) : (
                        <span className="text-zinc-500 text-sm">Uncategorized</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {seed.added_by_user_id ? (
                        <Badge variant="secondary" className="text-xs">
                          User
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-xs">
                          Admin
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{seed.trend_count || 0}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-zinc-400">
                        {seed.last_scraped_at
                          ? new Date(seed.last_scraped_at).toLocaleDateString()
                          : 'Never'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {seed.is_active ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleSeed(seed.id, seed.is_active)}
                        >
                          {seed.is_active ? (
                            <PowerOff className="w-4 h-4" />
                          ) : (
                            <Power className="w-4 h-4" />
                          )}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Seed</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{seed.term}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteSeed(seed.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
