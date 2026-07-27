import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Highlighter, Bookmark, StickyNote, Trash2, ExternalLink, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/lib/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { formatDate } from '@/lib/utils';

export default function Notes() {
  const { notes, documents, deleteNote } = useAuth();
  const [activeCategory, setActiveCategory] = useState('highlight');

  const highlights = notes.filter((n) => n.type === 'highlight');
  const bookmarks = notes.filter((n) => n.type === 'bookmark');
  const stickyNotes = notes.filter((n) => n.type === 'sticky_note');

  const handleDelete = (noteId) => {
    deleteNote(noteId);
    toast.success('Note deleted', 'The note was removed.');
  };

  const getDocTitle = (docId) => {
    const d = documents.find((doc) => doc.id === docId);
    return d ? d.title : 'Document';
  };

  const renderNoteCard = (note) => {
    return (
      <Card key={note.id} className="group relative p-4 border-0 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
        {/* Left colored stripe */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5"
          style={{ backgroundColor: note.color || '#4f46e5' }}
        />

        <div className="pl-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
              Page {note.page_number || 1}
            </span>

            <button
              onClick={() => handleDelete(note.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-destructive rounded-md hover:bg-secondary cursor-pointer"
              title="Delete Note"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="text-sm font-medium text-foreground leading-relaxed">
            "{note.content}"
          </p>
        </div>

        <div className="pl-2 mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
          <Link
            to={`/reader/${note.document_id}`}
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1.5 truncate max-w-[200px]"
          >
            <ExternalLink className="h-3 w-3 shrink-0" />
            <span className="truncate">{getDocTitle(note.document_id)}</span>
          </Link>

          <span className="text-[10px] text-muted-foreground">
            {formatDate(note.createdAt)}
          </span>
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Study Notes & Highlights</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review key passages, saved bookmarks, and sticky notes created across your readings.
        </p>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md p-1 rounded-2xl bg-secondary/80">
          <TabsTrigger value="highlight" className="rounded-xl flex items-center justify-center gap-1.5 py-2 text-xs font-semibold">
            <Highlighter className="h-3.5 w-3.5 text-amber-500" />
            <span>Highlights</span>
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
              {highlights.length}
            </Badge>
          </TabsTrigger>

          <TabsTrigger value="bookmark" className="rounded-xl flex items-center justify-center gap-1.5 py-2 text-xs font-semibold">
            <Bookmark className="h-3.5 w-3.5 text-blue-500" />
            <span>Bookmarks</span>
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
              {bookmarks.length}
            </Badge>
          </TabsTrigger>

          <TabsTrigger value="sticky_note" className="rounded-xl flex items-center justify-center gap-1.5 py-2 text-xs font-semibold">
            <StickyNote className="h-3.5 w-3.5 text-pink-500" />
            <span>Sticky Notes</span>
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
              {stickyNotes.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="highlight" className="mt-6">
          {highlights.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border/60 rounded-2xl bg-card/40">
              <Highlighter className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <h3 className="font-semibold text-base">No highlights yet</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Select text while reading inside any document to save highlights.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {highlights.map(renderNoteCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookmark" className="mt-6">
          {bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border/60 rounded-2xl bg-card/40">
              <Bookmark className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <h3 className="font-semibold text-base">No bookmarks saved</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Click the bookmark icon in the reader top bar to save your position.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarks.map(renderNoteCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sticky_note" className="mt-6">
          {stickyNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border/60 rounded-2xl bg-card/40">
              <StickyNote className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <h3 className="font-semibold text-base">No sticky notes created</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Add thoughts and annotations to your study collection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stickyNotes.map(renderNoteCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
