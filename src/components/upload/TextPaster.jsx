import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { toast } from '@/components/ui/use-toast';

const COLOR_OPTIONS = [
  '#4f46e5', // Indigo
  '#0d9488', // Teal
  '#d97706', // Amber
  '#e11d48', // Pink / Rose
  '#0284c7', // Sky Blue
  '#7c3aed', // Purple
  '#16a34a', // Green
  '#ea580c', // Orange
];

export default function TextPaster() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addDocument } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title required', 'Please provide a title for your text document.');
      return;
    }
    if (!content.trim()) {
      toast.error('Content required', 'Please paste or type your document content.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newDoc = addDocument({
        title: title.trim(),
        type: 'text',
        extracted_text: content.trim(),
        cover_color: selectedColor,
        status: 'unread',
      });

      toast.success('Document created!', 'Your text has been saved to your library.');
      setIsSubmitting(false);
      navigate(`/reader/${newDoc.id}`);
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-card/60 p-6 rounded-2xl border border-border/80">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">Document Title</label>
        <Input
          placeholder="e.g. Lecture Notes on Quantum Mechanics"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-xl"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground flex justify-between">
          <span>Content / Article Text</span>
          <span className="text-muted-foreground font-normal">
            {content.split(/\s+/).filter(Boolean).length} words
          </span>
        </label>
        <Textarea
          placeholder="Paste your study notes, essay, or article text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[220px] font-serif rounded-xl leading-relaxed text-base"
        />
      </div>

      {/* Color picker row */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground">Cover Color Accent</label>
        <div className="flex items-center gap-2.5">
          {COLOR_OPTIONS.map((color) => {
            const isSelected = selectedColor === color;
            return (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                style={{ backgroundColor: color }}
                className={`h-8 w-8 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center ${
                  isSelected ? 'ring-3 ring-primary scale-110 shadow-md' : 'hover:scale-105 opacity-80 hover:opacity-100'
                }`}
              >
                {isSelected && <Check className="h-4 w-4 text-white stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        variant="default"
        className="w-full h-11 rounded-xl font-semibold shadow-md shadow-primary/20"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Creating Document...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Create & Open Reader
          </>
        )}
      </Button>
    </form>
  );
}
