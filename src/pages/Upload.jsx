import React from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FileDropZone from '@/components/upload/FileDropZone';
import TextPaster from '@/components/upload/TextPaster';

export default function UploadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Import Document</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload PDF files, images, or paste plain text to listen and study with AI assistance.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="file" className="w-full">
        <TabsList className="w-full grid grid-cols-2 p-1.5 h-12 rounded-2xl bg-secondary/80">
          <TabsTrigger value="file" className="rounded-xl flex items-center justify-center gap-2 py-2 text-sm font-semibold">
            <UploadCloud className="h-4 w-4" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="paste" className="rounded-xl flex items-center justify-center gap-2 py-2 text-sm font-semibold">
            <FileText className="h-4 w-4" />
            Paste Text
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="mt-6">
          <FileDropZone />
        </TabsContent>

        <TabsContent value="paste" className="mt-6">
          <TextPaster />
        </TabsContent>
      </Tabs>
    </div>
  );
}
