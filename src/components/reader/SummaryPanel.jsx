import React, { useState } from 'react';
import { Sparkles, Copy, Check, Send, Loader2, Bot, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { base44 } from '@/api/base44Client';
import { toast } from '@/components/ui/use-toast';

export default function SummaryPanel({ documentText }) {
  const [selectedStyle, setSelectedStyle] = useState('Brief');
  const [summaryOutput, setSummaryOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Q&A state
  const [question, setQuestion] = useState('');
  const [qaHistory, setQaHistory] = useState([]);
  const [isAsking, setIsAsking] = useState(false);

  const summaryStyles = ['Brief', 'Detailed', 'Bullet Points', 'Key Terms', 'Study Notes'];

  const handleGenerateSummary = async (style = selectedStyle) => {
    setIsGenerating(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        documentText,
        type: 'summary',
        style,
      });
      setSummaryOutput(res);
    } catch (err) {
      console.error(err);
      toast.error('AI Generation Error', 'Could not generate summary.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopySummary = () => {
    if (!summaryOutput) return;
    navigator.clipboard.writeText(summaryOutput);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQ = question.trim();
    setQuestion('');
    setIsAsking(true);

    try {
      const answer = await base44.integrations.Core.InvokeLLM({
        prompt: userQ,
        documentText,
        type: 'qa',
      });

      setQaHistory((prev) => [
        ...prev,
        { question: userQ, answer, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    } catch (err) {
      console.error(err);
      toast.error('AI Error', 'Could not process question.');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-card/80 backdrop-blur-md border-l border-border/60">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-semibold text-sm text-foreground">AI Study Assistant</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="summary" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 pt-2">
          <TabsList className="w-full grid grid-cols-2 p-1 rounded-xl bg-secondary/80">
            <TabsTrigger value="summary" className="rounded-lg text-xs font-semibold">
              Summary
            </TabsTrigger>
            <TabsTrigger value="qa" className="rounded-lg text-xs font-semibold">
              Ask Q&A
            </TabsTrigger>
          </TabsList>
        </div>

        {/* SUMMARY TAB */}
        <TabsContent value="summary" className="flex-1 flex flex-col p-4 overflow-hidden space-y-3">
          {/* Style selector pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {summaryStyles.map((style) => (
              <button
                key={style}
                onClick={() => {
                  setSelectedStyle(style);
                  handleGenerateSummary(style);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedStyle === style
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Action button */}
          <Button
            onClick={() => handleGenerateSummary(selectedStyle)}
            disabled={isGenerating}
            variant="default"
            className="w-full h-9 rounded-xl text-xs font-semibold shadow-xs"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Generating {selectedStyle}...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                {summaryOutput ? `Regenerate (${selectedStyle})` : `Generate Summary (${selectedStyle})`}
              </>
            )}
          </Button>

          {/* Output Display */}
          <div className="flex-1 relative border border-border/60 rounded-xl bg-background/50 overflow-hidden flex flex-col">
            {summaryOutput ? (
              <>
                <button
                  onClick={handleCopySummary}
                  className="absolute top-2 right-2 z-10 h-7 w-7 rounded-lg bg-card/80 backdrop-blur-xs border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Copy to Clipboard"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <ScrollArea className="flex-1 p-4 text-sm prose dark:prose-invert max-w-none text-foreground leading-relaxed">
                  <ReactMarkdown>{summaryOutput}</ReactMarkdown>
                </ScrollArea>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                <Bot className="h-10 w-10 opacity-30 mb-2" />
                <p className="text-xs font-medium">Select a format style above and click Generate Summary.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Q&A TAB */}
        <TabsContent value="qa" className="flex-1 flex flex-col p-4 overflow-hidden">
          <ScrollArea className="flex-1 pr-2 space-y-3 mb-3">
            {qaHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <HelpCircle className="h-10 w-10 opacity-30 mb-2" />
                <p className="text-xs font-medium">Ask any question about this document text.</p>
                <p className="text-[11px] opacity-70 mt-1">e.g., "What are the main 3 conclusions?"</p>
              </div>
            ) : (
              <div className="space-y-4">
                {qaHistory.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    {/* User Question */}
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground text-xs p-3 rounded-2xl rounded-tr-xs max-w-[85%]">
                        {item.question}
                      </div>
                    </div>
                    {/* AI Answer */}
                    <div className="flex justify-start">
                      <div className="bg-secondary text-foreground border border-border/50 text-xs p-3 rounded-2xl rounded-tl-xs max-w-[90%] prose dark:prose-invert">
                        <ReactMarkdown>{item.answer}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Question Input Form */}
          <form onSubmit={handleAskQuestion} className="flex gap-2">
            <Textarea
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[42px] max-h-[100px] h-[42px] py-2.5 px-3 text-xs rounded-xl flex-1 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAskQuestion(e);
                }
              }}
            />
            <Button
              type="submit"
              disabled={isAsking || !question.trim()}
              size="icon"
              className="h-[42px] w-[42px] rounded-xl shrink-0"
            >
              {isAsking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
