import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export default function FileDropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const { addDocument } = useAuth();
  const navigate = useNavigate();

  const acceptedFormats = ['PDF', 'PNG', 'JPG', 'DOCX'];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file) => {
    setIsProcessing(true);

    try {
      let fileText = '';
      const extension = file.name.split('.').pop().toLowerCase();
      
      // If plain text file
      if (file.type.includes('text') || extension === 'txt' || extension === 'md') {
        fileText = await file.text();
      } else {
        // Simulated AI extraction for PDF/DOCX/Images
        fileText = `Extracted Text from ${file.name}:\n\nThis document provides an overview of essential principles and practices. Key concepts include structured focus, analytical synthesis, and systematic review.\n\nParagraph 1: In modern study environments, retaining complex information requires multi-modal engagement—combining auditory narration with visual reading.\n\nParagraph 2: Web Speech APIs and real-time word boundary tracking enable learners to follow along at customized paces while maintaining deep cognitive engagement.\n\nParagraph 3: Utilizing AI-generated summaries and targeted Q&A accelerates recall and strengthens mental model formation across diverse subjects.`;
      }

      // Add Document
      const newDoc = addDocument({
        title: file.name.replace(/\.[^/.]+$/, ""),
        type: extension === 'pdf' ? 'pdf' : extension === 'docx' ? 'docx' : 'image',
        extracted_text: fileText,
        cover_color: '#4f46e5',
        status: 'unread',
      });

      toast.success('Document uploaded!', `Processing complete for ${file.name}`);

      setTimeout(() => {
        setIsProcessing(false);
        navigate(`/reader/${newDoc.id}`);
      }, 600);

    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      toast.error('Upload failed', 'Failed to read file content.');
    }
  };

  return (
    <div
      onClick={() => !isProcessing && fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer bg-card/60",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border/80 hover:border-primary/50 hover:bg-card/90"
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.png,.jpg,.jpeg,.docx,.txt,.md"
        className="hidden"
      />

      {isProcessing ? (
        <div className="flex flex-col items-center justify-center space-y-3 py-6">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <h4 className="font-semibold text-base text-foreground">Processing & Extracting Text...</h4>
          <p className="text-xs text-muted-foreground">Parsing document structure and initializing AI reader</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
            <UploadCloud className="h-8 w-8" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Drop your document here, or <span className="text-primary underline underline-offset-2">browse</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Drag and drop any compatible document or book to extract text and generate audio narration.
            </p>
          </div>

          {/* Badges list */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-[11px] text-muted-foreground mr-1">Supported formats:</span>
            {acceptedFormats.map((fmt) => (
              <Badge key={fmt} variant="secondary" className="text-[10px] uppercase font-bold px-2 py-0.5">
                {fmt}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
