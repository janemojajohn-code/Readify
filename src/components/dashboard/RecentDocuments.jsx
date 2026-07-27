import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Clock, FileText, File, Sparkles, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';

export default function RecentDocuments({ documents, onDelete }) {
  const navigate = useNavigate();

  const getGradient = (doc, index) => {
    const gradients = [
      'from-indigo-500/20 via-purple-500/10 to-indigo-500/5',
      'from-teal-500/20 via-emerald-500/10 to-teal-500/5',
      'from-amber-500/20 via-orange-500/10 to-amber-500/5',
      'from-sky-500/20 via-blue-500/10 to-sky-500/5',
      'from-pink-500/20 via-rose-500/10 to-pink-500/5',
    ];
    return gradients[index % gradients.length];
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-border/60 rounded-2xl bg-card/40 my-6">
        <div className="h-16 w-16 rounded-2xl bg-secondary/80 flex items-center justify-center mb-4 text-muted-foreground">
          <BookOpen className="h-8 w-8 opacity-40" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No documents found</h3>
        <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
          Upload your first document or paste some text to start reading, listening, and studying with AI.
        </p>
        <Link to="/upload">
          <Button variant="default" className="rounded-xl px-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Upload Now
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-4">
      {documents.map((doc, index) => {
        const isCompleted = doc.status === 'completed';
        const isReading = doc.status === 'reading';

        return (
          <Card
            key={doc.id}
            onClick={() => navigate(`/reader/${doc.id}`)}
            className="group relative flex flex-col overflow-hidden border-border/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            {/* Top Color Banner */}
            <div className={`h-32 w-full bg-gradient-to-br ${getGradient(doc, index)} relative flex items-center justify-center overflow-hidden border-b border-border/40`}>
              <div 
                className="absolute inset-0 opacity-15"
                style={{ backgroundColor: doc.cover_color || '#4f46e5' }}
              />
              <FileText className="h-12 w-12 text-foreground/25 group-hover:scale-110 transition-transform duration-300" />
              
              {/* Type pill on top right */}
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="uppercase text-[10px] tracking-wider font-bold bg-background/80 backdrop-blur-xs">
                  {doc.type}
                </Badge>
              </div>

              {/* Optional Delete Action on hover if onDelete passed */}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(doc.id);
                  }}
                  className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 h-8 w-8 rounded-lg bg-background/80 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all flex items-center justify-center cursor-pointer shadow-xs"
                  title="Delete Document"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Card Body */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <h4 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                  {doc.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
                  {doc.summary || doc.extracted_text?.slice(0, 100)}
                </p>
              </div>

              {/* Card Footer Info */}
              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <div className="flex items-center text-[11px] text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{formatDate(doc.createdAt)}</span>
                </div>

                <Badge
                  variant="outline"
                  className={
                    isCompleted
                      ? "border-accent/40 text-accent bg-accent/5 text-[10px]"
                      : isReading
                      ? "border-primary/40 text-primary bg-primary/5 text-[10px]"
                      : "border-border text-muted-foreground text-[10px]"
                  }
                >
                  {doc.status || 'unread'}
                </Badge>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
