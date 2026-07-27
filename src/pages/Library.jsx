import React, { useState } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import RecentDocuments from '@/components/dashboard/RecentDocuments';
import { useAuth } from '@/lib/AuthContext';
import { toast } from '@/components/ui/use-toast';

export default function Library() {
  const { documents, deleteDocument } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filterOptions = ['All', 'Unread', 'Reading', 'Completed'];

  const handleDelete = (docId) => {
    deleteDocument(docId);
    toast.success('Document deleted', 'The document has been removed from your library.');
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.extracted_text && doc.extracted_text.toLowerCase().includes(searchQuery.toLowerCase()));

    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && (doc.status || 'unread').toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Document Library</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage, search, and organize all your study material in one place.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl bg-card border-border/80"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {filterOptions.map((filter) => {
            const isActive = statusFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Document Grid */}
      <RecentDocuments documents={filteredDocs} onDelete={handleDelete} />
    </div>
  );
}
