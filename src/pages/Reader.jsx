import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Pencil, 
  PanelRightClose, 
  PanelRightOpen, 
  Bookmark, 
  Highlighter, 
  Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TextViewer from '@/components/reader/TextViewer';
import AudioControls from '@/components/reader/AudioControls';
import VoiceSelector from '@/components/reader/VoiceSelector';
import EditDocumentDialog from '@/components/reader/EditDocumentDialog';
import SummaryPanel from '@/components/reader/SummaryPanel';
import { useAuth } from '@/lib/AuthContext';
import { toast } from '@/components/ui/use-toast';

export default function Reader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { documents, updateDocument, settings, updateSettings, addNote } = useAuth();

  const doc = documents.find((d) => d.id === id);

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(settings.speed || 1.0);
  const [pitch, setPitch] = useState(settings.pitch || 1.0);
  const [selectedVoiceName, setSelectedVoiceName] = useState(settings.voiceName || '');
  const [showAiPanel, setShowAiPanel] = useState(true);

  // Modals
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Parse words list
  const textContent = doc ? doc.extracted_text || '' : '';
  const wordsList = textContent ? textContent.trim().split(/\s+/).filter(Boolean) : [];
  const totalWords = Math.max(1, wordsList.length);

  // Speech synth refs
  const utteranceRef = useRef(null);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Set document status to 'reading' on initial mount if unread
  useEffect(() => {
    if (doc && doc.status === 'unread') {
      updateDocument(doc.id, { status: 'reading' });
    }
  }, [doc]);

  // Speech player core function
  const speakFromIndex = useCallback((startIndex, speed = playbackSpeed, pt = pitch, voiceName = selectedVoiceName) => {
    if (!('speechSynthesis' in window) || wordsList.length === 0) return;

    window.speechSynthesis.cancel();

    const remainingText = wordsList.slice(startIndex).join(' ');
    if (!remainingText.trim()) {
      setIsPlaying(false);
      setCurrentWordIndex(0);
      if (doc) updateDocument(doc.id, { status: 'completed' });
      return;
    }

    const utter = new SpeechSynthesisUtterance(remainingText);
    utter.rate = speed;
    utter.pitch = pt;

    // Pick selected voice or default
    const voices = window.speechSynthesis.getVoices();
    if (voiceName) {
      const match = voices.find((v) => v.name === voiceName);
      if (match) utter.voice = match;
    } else if (voices.length > 0) {
      utter.voice = voices[0];
    }

    // Word boundary tracking
    let wordCountOffset = 0;
    utter.onboundary = (event) => {
      if (event.name === 'word') {
        const textUpToBoundary = remainingText.slice(0, event.charIndex + event.charLength);
        const spokenWordsCount = textUpToBoundary.trim().split(/\s+/).filter(Boolean).length - 1;
        const newIndex = startIndex + Math.max(0, spokenWordsCount);
        setCurrentWordIndex(Math.min(totalWords - 1, newIndex));
      }
    };

    utter.onend = () => {
      setIsPlaying(false);
      if (startIndex + 10 >= totalWords && doc) {
        updateDocument(doc.id, { status: 'completed' });
      }
    };

    utter.onerror = (e) => {
      console.error('Speech error:', e);
      setIsPlaying(false);
    };

    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);
    setIsPlaying(true);
  }, [wordsList, totalWords, doc, updateDocument]);

  // Handle Play/Pause
  const handlePlayPause = () => {
    if (!('speechSynthesis' in window)) {
      toast.error('Web Speech API not supported in this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        speakFromIndex(currentWordIndex);
      }
    }
  };

  const handleRestart = () => {
    setCurrentWordIndex(0);
    speakFromIndex(0);
  };

  const handleSkipBack = () => {
    const nextIdx = Math.max(0, currentWordIndex - 20);
    setCurrentWordIndex(nextIdx);
    if (isPlaying) speakFromIndex(nextIdx);
  };

  const handleSkipForward = () => {
    const nextIdx = Math.min(totalWords - 1, currentWordIndex + 20);
    setCurrentWordIndex(nextIdx);
    if (isPlaying) speakFromIndex(nextIdx);
  };

  const handleWordClick = (wordIdx) => {
    setCurrentWordIndex(wordIdx);
    speakFromIndex(wordIdx);
  };

  const handleParagraphClick = (startWordIdx) => {
    setCurrentWordIndex(startWordIdx);
    speakFromIndex(startWordIdx);
  };

  const handleChangeSpeed = (newSpeed) => {
    setPlaybackSpeed(newSpeed);
    updateSettings({ speed: newSpeed });
    if (isPlaying) {
      speakFromIndex(currentWordIndex, newSpeed, pitch, selectedVoiceName);
    }
  };

  const handleChangePitch = (newPitch) => {
    setPitch(newPitch);
    updateSettings({ pitch: newPitch });
    if (isPlaying) {
      speakFromIndex(currentWordIndex, playbackSpeed, newPitch, selectedVoiceName);
    }
  };

  const handleSelectVoice = (vName) => {
    setSelectedVoiceName(vName);
    updateSettings({ voiceName: vName });
    if (isPlaying) {
      speakFromIndex(currentWordIndex, playbackSpeed, pitch, vName);
    }
  };

  // Add bookmark/highlight note helper
  const handleAddBookmark = () => {
    if (!doc) return;
    const currentWordSnippet = wordsList.slice(currentWordIndex, currentWordIndex + 15).join(' ');
    addNote({
      document_id: doc.id,
      type: 'bookmark',
      content: `Bookmark at word ${currentWordIndex + 1}: "${currentWordSnippet}..."`,
      color: '#bfdbfe',
      page_number: doc.current_page || 1,
    });
    toast.success('Bookmark saved!', 'Added to your study notes.');
  };

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4 px-4 text-center">
        <h2 className="text-xl font-bold">Document Not Found</h2>
        <p className="text-sm text-muted-foreground">The requested document could not be located in your library.</p>
        <Button onClick={() => navigate('/library')} variant="default" className="rounded-xl">
          Back to Library
        </Button>
      </div>
    );
  }

  const progressPercentage = ((currentWordIndex + 1) / totalWords) * 100;

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden bg-background">
      {/* 4.4 Top Bar */}
      <div className="h-12 border-b border-border/50 bg-card/70 backdrop-blur-md px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate('/library')}
            className="rounded-lg shrink-0"
            title="Back to Library"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <h2 className="font-semibold text-sm text-foreground truncate max-w-xs sm:max-w-md">
            {doc.title}
          </h2>

          <Badge variant="secondary" className="hidden sm:inline-flex uppercase text-[9px] font-bold">
            {doc.type}
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          {/* Quick Bookmark */}
          <button
            onClick={handleAddBookmark}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center justify-center transition-colors cursor-pointer"
            title="Add Bookmark"
          >
            <Bookmark className="h-4 w-4" />
          </button>

          {/* Edit Button */}
          <button
            onClick={() => setShowEditDialog(true)}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center justify-center transition-colors cursor-pointer"
            title="Edit Document"
          >
            <Pencil className="h-4 w-4" />
          </button>

          {/* Toggle AI Panel Button */}
          <button
            onClick={() => setShowAiPanel(!showAiPanel)}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              showAiPanel ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
            title="Toggle AI Panel"
          >
            {showAiPanel ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden pb-16">
        {/* Left: Text Viewer */}
        <div className="flex-1 p-3 sm:p-4 overflow-hidden">
          <TextViewer
            text={doc.extracted_text}
            currentWordIndex={currentWordIndex}
            onWordClick={handleWordClick}
            onParagraphClick={handleParagraphClick}
            fontStyle={settings.fontStyle}
            fontSize={settings.fontSize}
          />
        </div>

        {/* Right: AI Summary Panel (desktop togglable) */}
        {showAiPanel && (
          <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 h-full hidden lg:block">
            <SummaryPanel documentText={doc.extracted_text} />
          </div>
        )}
      </div>

      {/* Bottom Audio Controls Bar */}
      <AudioControls
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onRestart={handleRestart}
        onSkipBack={handleSkipBack}
        onSkipForward={handleSkipForward}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={handleChangeSpeed}
        pitch={pitch}
        onChangePitch={handleChangePitch}
        currentVoiceName={selectedVoiceName}
        onOpenVoiceSelector={() => setShowVoiceDialog(true)}
        progressPercentage={progressPercentage}
        currentWordIndex={currentWordIndex}
        totalWords={totalWords}
      />

      {/* Modals */}
      <VoiceSelector
        open={showVoiceDialog}
        onOpenChange={setShowVoiceDialog}
        onSelectVoice={handleSelectVoice}
        currentVoiceName={selectedVoiceName}
      />

      <EditDocumentDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        document={doc}
      />
    </div>
  );
}
