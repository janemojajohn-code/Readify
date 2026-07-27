import React, { useState, useEffect } from 'react';
import { Search, Check, Play, Volume2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/AuthContext';

export default function VoiceSelector({ open, onOpenChange, onSelectVoice, currentVoiceName }) {
  const [voices, setVoices] = useState([]);
  const [search, setSearch] = useState('');
  const [previewingVoice, setPreviewingVoice] = useState(null);

  useEffect(() => {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      }
    };

    updateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const filteredVoices = voices.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.lang.toLowerCase().includes(search.toLowerCase())
  );

  // Grouping voices by gender estimation / type
  const femaleVoices = filteredVoices.filter(v => 
    /female|zira|samantha|victoria|karen|fiona|jenny|aria|sara|eva|google US English/i.test(v.name)
  );
  const maleVoices = filteredVoices.filter(v => 
    /male|david|alex|george|daniel|guy|ryan|google UK English Male/i.test(v.name)
  );
  const otherVoices = filteredVoices.filter(v => 
    !femaleVoices.includes(v) && !maleVoices.includes(v)
  );

  const handlePreview = (voice, e) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    setPreviewingVoice(voice.name);

    const utter = new SpeechSynthesisUtterance('Hello, I am ready to read your document.');
    utter.voice = voice;
    utter.onend = () => setPreviewingVoice(null);
    utter.onerror = () => setPreviewingVoice(null);

    window.speechSynthesis.speak(utter);
  };

  const renderVoiceRow = (voice) => {
    const isSelected = voice.name === currentVoiceName;
    const isPreviewing = previewingVoice === voice.name;

    return (
      <div
        key={voice.name}
        onClick={() => {
          onSelectVoice(voice.name);
          onOpenChange(false);
        }}
        className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-150 border mb-1.5 ${
          isSelected
            ? 'bg-primary/10 border-primary/30 text-primary font-medium'
            : 'border-transparent hover:bg-secondary/70 hover:border-border/60'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
              isSelected
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground group-hover:bg-card'
            }`}
          >
            {voice.name.charAt(0).toUpperCase()}
          </div>
          <div className="truncate">
            <div className="text-sm font-medium truncate flex items-center gap-1.5">
              <span className="truncate">{voice.name}</span>
              {voice.localService && (
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-border">
                  Local
                </Badge>
              )}
            </div>
            <div className="text-[10px] text-muted-foreground">{voice.lang}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => handlePreview(voice, e)}
            className={`h-7 w-7 rounded-lg flex items-center justify-center transition-opacity cursor-pointer ${
              isPreviewing
                ? 'bg-primary text-primary-foreground opacity-100 animate-pulse'
                : 'bg-secondary text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100'
            }`}
            title="Preview Voice"
          >
            {isPreviewing ? <Volume2 className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
          </button>

          {isSelected && <Check className="h-4 w-4 text-primary shrink-0 ml-1" />}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-5">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center justify-between">
            <span>Select Speech Voice</span>
            <Badge variant="secondary" className="text-xs font-normal">
              {voices.length} Available
            </Badge>
          </DialogTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search voice by name or language..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-xl text-xs"
            />
          </div>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-2">
          {voices.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Loading system voices... If no voices appear, your browser may not support Web Speech API.
            </div>
          ) : filteredVoices.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No voices match "{search}".
            </div>
          ) : (
            <div className="space-y-4">
              {femaleVoices.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1 flex items-center justify-between">
                    <span>Female Voices</span>
                    <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-full">{femaleVoices.length}</span>
                  </div>
                  {femaleVoices.map(renderVoiceRow)}
                </div>
              )}

              {maleVoices.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1 flex items-center justify-between">
                    <span>Male Voices</span>
                    <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-full">{maleVoices.length}</span>
                  </div>
                  {maleVoices.map(renderVoiceRow)}
                </div>
              )}

              {otherVoices.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1 flex items-center justify-between">
                    <span>Other System Voices</span>
                    <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-full">{otherVoices.length}</span>
                  </div>
                  {otherVoices.map(renderVoiceRow)}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
