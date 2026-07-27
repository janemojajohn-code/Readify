import React, { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { toast } from '@/components/ui/use-toast';

const COLOR_OPTIONS = [
  '#4f46e5', // Indigo
  '#0d9488', // Teal
  '#d97706', // Amber
  '#e11d48', // Pink
  '#0284c7', // Sky Blue
  '#7c3aed', // Purple
  '#16a34a', // Green
  '#ea580c', // Orange
  '#475569', // Slate
  '#db2777', // Magenta
];

export default function EditDocumentDialog({ open, onOpenChange, document }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverColor, setCoverColor] = useState(COLOR_OPTIONS[0]);

  const { updateDocument } = useAuth();

  useEffect(() => {
    if (document) {
      setTitle(document.title || '');
      setContent(document.extracted_text || '');
      setCoverColor(document.cover_color || COLOR_OPTIONS[0]);
    }
  }, [document, open]);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Title required', 'Please provide a title for the document.');
      return;
    }

    if (!document) return;

    updateDocument(document.id, {
      title: title.trim(),
      extracted_text: content,
      cover_color: coverColor,
      reading_time_minutes: Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)),
    });

    toast.success('Document updated', 'Your changes have been saved.');
    onOpenChange(false);
  };

  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Document</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-5 pr-1 py-2 custom-scrollbar">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Document Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl font-medium text-sm"
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Content / Text</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] font-serif text-base leading-relaxed rounded-xl"
            />
            <div className="text-[11px] text-muted-foreground text-right">
              {wordCount} words • ~{Math.ceil(wordCount / 200)} min read
            </div>
          </div>

          {/* Cover Color Picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Cover Color Banner</label>
            <div className="flex flex-wrap items-center gap-2.5">
              {COLOR_OPTIONS.map((color) => {
                const isSelected = coverColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setCoverColor(color)}
                    style={{ backgroundColor: color }}
                    className={`h-7 w-7 rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center ${
                      isSelected ? 'ring-3 ring-primary scale-110 shadow-md' : 'hover:scale-105 opacity-80'
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4 pt-4 border-t border-border/60">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button variant="default" onClick={handleSave} className="rounded-xl font-semibold">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
