import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Mic, 
  Sliders 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export default function AudioControls({
  isPlaying,
  onPlayPause,
  onRestart,
  onSkipBack,
  onSkipForward,
  isMuted,
  onToggleMute,
  playbackSpeed,
  onChangeSpeed,
  pitch,
  onChangePitch,
  currentVoiceName,
  onOpenVoiceSelector,
  progressPercentage = 0,
  currentWordIndex = 0,
  totalWords = 1,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-2xl transition-all">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-secondary/80 overflow-hidden cursor-pointer">
        <div 
          className="h-full bg-primary transition-all duration-200"
          style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
        />
      </div>

      {/* Controls Container */}
      <div className="max-w-screen-xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Cluster: Playback Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Restart */}
          <button
            onClick={onRestart}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center justify-center transition-colors cursor-pointer"
            title="Restart from beginning"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Skip Back -20 words */}
          <button
            onClick={onSkipBack}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center justify-center transition-colors cursor-pointer"
            title="Skip back 20 words"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          {/* Play / Pause Circle Button */}
          <button
            onClick={onPlayPause}
            className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isPlaying ? 'Pause Speech' : 'Start Speech'}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Skip Forward +20 words */}
          <button
            onClick={onSkipForward}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center justify-center transition-colors cursor-pointer"
            title="Skip forward 20 words"
          >
            <SkipForward className="h-4 w-4" />
          </button>

          {/* Mute / Unmute */}
          <button
            onClick={onToggleMute}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center justify-center transition-colors cursor-pointer ml-1"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-destructive" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* Word Progress Counter */}
          <span className="hidden sm:inline-block text-[11px] font-mono text-muted-foreground ml-2">
            {currentWordIndex + 1} / {totalWords} words
          </span>
        </div>

        {/* Middle/Right Cluster: Speed, Pitch & Voice Selector */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Speed Select */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">Speed</span>
            <Select
              value={playbackSpeed}
              onChange={(e) => onChangeSpeed(parseFloat(e.target.value))}
              className="w-[72px] h-8 text-xs rounded-lg py-1 px-2 border-border/70"
            >
              <option value="0.5">0.5×</option>
              <option value="0.75">0.75×</option>
              <option value="1">1.0×</option>
              <option value="1.25">1.25×</option>
              <option value="1.5">1.5×</option>
              <option value="1.75">1.75×</option>
              <option value="2">2.0×</option>
            </Select>
          </div>

          {/* Pitch Slider (lg screen only) */}
          <div className="hidden lg:flex items-center gap-2 border-l border-border/50 pl-3">
            <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[10px] font-semibold text-muted-foreground">Pitch ({pitch}×)</span>
            <Slider
              min={0.5}
              max={2.0}
              step={0.1}
              value={pitch}
              onValueChange={(val) => onChangePitch(val)}
              className="w-20"
            />
          </div>

          {/* Voice Selector launcher button */}
          <Button
            variant="outline"
            onClick={onOpenVoiceSelector}
            className="h-8 rounded-lg px-3 text-xs border-border/80 hover:bg-secondary font-medium flex items-center gap-1.5"
          >
            <Mic className="h-3.5 w-3.5 text-primary" />
            <span className="max-w-[100px] truncate">
              {currentVoiceName ? currentVoiceName.split(' ')[0] : 'Voice'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
