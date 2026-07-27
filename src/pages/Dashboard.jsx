import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatsGrid from '@/components/dashboard/StatsGrid';
import RecentDocuments from '@/components/dashboard/RecentDocuments';
import { useAuth } from '@/lib/AuthContext';

export default function Dashboard() {
  const { user, documents } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const recentDocs = documents.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border border-primary/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {getGreeting()}, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ready to learn something new today?
          </p>
        </div>

        <Link to="/upload" className="shrink-0">
          <Button variant="default" className="rounded-xl px-5 h-11 font-semibold shadow-md shadow-primary/20 hover:scale-[1.02] transition-all">
            <Upload className="h-4 w-4 mr-2" />
            Upload New
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Recent Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
            Recent Documents
          </h2>
          {documents.length > 6 && (
            <Link 
              to="/library" 
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <RecentDocuments documents={recentDocs} />
      </div>
    </div>
  );
}
