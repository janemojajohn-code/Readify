import React, { useState, useEffect } from 'react';
import { Moon, Sun, Type, Sliders, Volume2, Mic, Check, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { toast } from '@/components/ui/use-toast';

export default function Settings() {
  const { settings, updateSettings } = useAuth();
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const fetchVoices = () => {
      if ('speechSynthesis' in window) {
        setVoices(window.speechSynthesis.getVoices());
      }
    };

    fetchVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = fetchVoices;
    }
  }, []);

  const handleFontChange = (style) => {
    updateSettings({ fontStyle: style });
    toast.success('Font updated', `Reader typography set to ${style}.`);
  };

  const handleFontSizeChange = (size) => {
    updateSettings({ fontSize: size });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your reading environment, speech narration preferences, and theme.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
        <Card className="border-border/60 p-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Sun className="h-5 w-5 text-primary" />
              Appearance & Reader Display
            </CardTitle>
            <CardDescription>
              Adjust theme mode and text styling for optimal readability.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-border/40">
              <div>
                <div className="text-sm font-semibold text-foreground">Dark Mode</div>
                <div className="text-xs text-muted-foreground">
                  Switch between clean light mode and high-contrast dark theme.
                </div>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(val) => updateSettings({ darkMode: val })}
              />
            </div>

            {/* Font Style Select */}
            <div className="space-y-2 py-2 border-b border-border/40">
              <label className="text-sm font-semibold text-foreground block">
                Reading Font Style
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'serif', label: 'Merriweather (Serif)', sample: 'Aa' },
                  { id: 'sans', label: 'Inter (Sans-Serif)', sample: 'Aa' },
                  { id: 'mono', label: 'JetBrains (Monospace)', sample: 'Aa' },
                ].map((font) => (
                  <button
                    key={font.id}
                    onClick={() => handleFontChange(font.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                      settings.fontStyle === font.id
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'border-border/80 hover:bg-secondary/60'
                    }`}
                  >
                    <span className="text-xs font-semibold">{font.label}</span>
                    <span className={`text-xl font-bold ${font.id === 'serif' ? 'font-serif' : font.id === 'mono' ? 'font-mono' : 'font-sans'}`}>
                      {font.sample}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size Slider */}
            <div className="space-y-3 py-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">
                  Font Size ({settings.fontSize || 'medium'})
                </label>
                <span className="text-xs text-muted-foreground">Small → Large</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold">A</span>
                <div className="grid grid-cols-3 gap-2 flex-1">
                  {['small', 'medium', 'large'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => handleFontSizeChange(sz)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                        settings.fontSize === sz
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                          : 'bg-card border-border hover:bg-secondary'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                <span className="text-lg font-bold">A</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voice & Audio Section */}
        <Card className="border-border/60 p-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-accent" />
              Voice & Text-to-Speech
            </CardTitle>
            <CardDescription>
              Configure default speech voice engine, speed, and pitch.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {/* Default TTS Voice Select */}
            <div className="space-y-2 py-2 border-b border-border/40">
              <label className="text-sm font-semibold text-foreground block">
                Default Speech Voice
              </label>
              <Select
                value={settings.voiceName || ''}
                onChange={(e) => updateSettings({ voiceName: e.target.value })}
                className="rounded-xl"
              >
                <option value="">System Default Voice</option>
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </Select>
            </div>

            {/* Speed Slider */}
            <div className="space-y-3 py-2 border-b border-border/40">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">
                  Default Speech Speed ({settings.speed || 1.0}×)
                </label>
                <span className="text-xs text-muted-foreground">0.5× – 2.0×</span>
              </div>
              <Slider
                min={0.5}
                max={2.0}
                step={0.25}
                value={settings.speed || 1.0}
                onValueChange={(val) => updateSettings({ speed: val })}
              />
            </div>

            {/* Pitch Slider */}
            <div className="space-y-3 py-2 border-b border-border/40">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">
                  Default Speech Pitch ({settings.pitch || 1.0}×)
                </label>
                <span className="text-xs text-muted-foreground">0.5 – 2.0</span>
              </div>
              <Slider
                min={0.5}
                max={2.0}
                step={0.1}
                value={settings.pitch || 1.0}
                onValueChange={(val) => updateSettings({ pitch: val })}
              />
            </div>

            {/* Auto-Play Toggle */}
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-semibold text-foreground">Auto-Play on Reader Open</div>
                <div className="text-xs text-muted-foreground">
                  Automatically start speech narration when opening a document.
                </div>
              </div>
              <Switch
                checked={settings.autoPlay}
                onCheckedChange={(val) => updateSettings({ autoPlay: val })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
