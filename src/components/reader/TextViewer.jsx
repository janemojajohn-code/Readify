import React, { useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export default function TextViewer({
  text = '',
  currentWordIndex = -1,
  onWordClick,
  onParagraphClick,
  fontStyle = 'serif', // serif, sans, mono
  fontSize = 'medium', // small, medium, large
}) {
  const activeWordRef = useRef(null);

  // Auto scroll to current spoken word
  useEffect(() => {
    if (activeWordRef.current) {
      activeWordRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentWordIndex]);

  // Font family helper
  const getFontFamilyClass = () => {
    switch (fontStyle) {
      case 'sans': return 'font-sans';
      case 'mono': return 'font-mono';
      default: return 'font-serif';
    }
  };

  // Font size helper
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-sm sm:text-base leading-relaxed';
      case 'large': return 'text-lg sm:text-xl leading-[2.1]';
      default: return 'text-base sm:text-lg leading-[1.9]';
    }
  };

  // Split text into paragraphs
  const rawParagraphs = text ? text.split(/\n\s*\n/) : ['No content available.'];
  
  let globalWordCounter = 0;

  const parsedParagraphs = rawParagraphs.map((paragraphStr) => {
    const words = paragraphStr.trim().split(/\s+/).filter(Boolean);
    const startWordIndex = globalWordCounter;
    const endWordIndex = globalWordCounter + words.length - 1;
    globalWordCounter += words.length;

    return {
      text: paragraphStr,
      words,
      startWordIndex,
      endWordIndex,
    };
  });

  return (
    <div className="h-full w-full bg-card/60 rounded-2xl border border-border/60 shadow-xs overflow-hidden flex flex-col">
      <ScrollArea className="flex-1 px-4 sm:px-8 py-6">
        <div className={cn("max-w-prose mx-auto space-y-6 tracking-wide text-foreground", getFontFamilyClass(), getFontSizeClass())}>
          {parsedParagraphs.map((para, paraIdx) => {
            const isParaActive =
              currentWordIndex >= para.startWordIndex &&
              currentWordIndex <= para.endWordIndex;

            return (
              <div
                key={paraIdx}
                className={cn(
                  "group relative rounded-xl px-4 py-2 -mx-4 transition-all duration-150 border-l-2 cursor-pointer",
                  isParaActive
                    ? "bg-primary/5 border-primary shadow-2xs"
                    : "border-transparent hover:bg-secondary/60 hover:border-primary/40"
                )}
                onClick={() => onParagraphClick && onParagraphClick(para.startWordIndex)}
              >
                <p className="select-text">
                  {para.words.map((word, wIdx) => {
                    const absoluteWordIndex = para.startWordIndex + wIdx;
                    const isWordActive = currentWordIndex === absoluteWordIndex;

                    return (
                      <React.Fragment key={wIdx}>
                        <span
                          ref={isWordActive ? activeWordRef : null}
                          onClick={(e) => {
                            e.stopPropagation();
                            onWordClick && onWordClick(absoluteWordIndex);
                          }}
                          className={cn(
                            "cursor-pointer rounded px-0.5 transition-colors duration-100",
                            isWordActive
                              ? "bg-primary/25 text-primary font-semibold ring-1 ring-primary/30"
                              : "hover:bg-primary/10 hover:text-primary"
                          )}
                        >
                          {word}
                        </span>
                        {' '}
                      </React.Fragment>
                    );
                  })}
                </p>

                {/* Hover hint */}
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="text-[10px] font-sans font-medium text-muted-foreground/70 bg-card/90 px-2 py-0.5 rounded-full border border-border/50 flex items-center gap-1 shadow-2xs">
                    <Play className="h-2.5 w-2.5 fill-primary text-primary" />
                    read from here
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
