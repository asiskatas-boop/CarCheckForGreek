import React, { useState } from 'react';
import { Sparkles, Send, Loader2, MessageSquare, Bot } from 'lucide-react';
import { UserPreferences } from '../types';

interface ConversationalRefinerProps {
  currentPreferences: UserPreferences;
  onApplyRefinements: (result: {
    advisorResponse: string;
    filterOverrides?: any;
  }) => void;
  lastAdvisorMessage?: string;
}

export const ConversationalRefiner: React.FC<ConversationalRefinerProps> = ({
  currentPreferences,
  onApplyRefinements,
  lastAdvisorMessage
}) => {
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const suggestedPrompts = [
    'Something cheaper',
    'I want something sportier',
    'Only SUVs',
    "I don't want diesel",
    'Show me electric cars',
    'I need more luggage space',
    'Anything under €15,000?',
    'I want something more premium'
  ];

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || input).trim();
    if (!text || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/chat-refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: text,
          currentPreferences
        })
      });

      if (!res.ok) {
        throw new Error('Refinement failed');
      }

      const data = await res.json();
      onApplyRefinements({
        advisorResponse: data.advisorResponse || "Updated recommendations based on your request.",
        filterOverrides: data.filterOverrides
      });
      setInput('');
    } catch (err) {
      console.error(err);
      // Fallback
      onApplyRefinements({
        advisorResponse: `Understood: "${text}". I have adjusted the recommendation profile accordingly.`,
        filterOverrides: {
          searchQuery: text
        }
      });
      setInput('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#e5e5ea] dark:border-[#2d2d30] bg-white/80 dark:bg-[#1d1d1f]/80 p-4 sm:p-5 backdrop-blur-md shadow-xs mb-8">
      {/* Advisor Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#0066cc]/10 border border-[#0066cc]/20 flex items-center justify-center text-[#0066cc] dark:text-[#2997ff]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1d1d1f] dark:text-white uppercase tracking-wider">
              Conversational Refinement
            </h4>
            <p className="text-[11px] text-[#86868b]">
              Tell CarCheck what to tweak without restarting your answers
            </p>
          </div>
        </div>
      </div>

      {/* Advisor note if exists */}
      {lastAdvisorMessage && (
        <div className="mb-3.5 p-3 rounded-xl bg-[#0066cc]/10 border border-[#0066cc]/20 text-xs text-[#0066cc] dark:text-[#2997ff] flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">{lastAdvisorMessage}</p>
        </div>
      )}

      {/* Input row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Ask like a friend: "Something cheaper", "Only SUVs", "I don&apos;t want diesel"...'
            disabled={isLoading}
            className="w-full pl-3.5 pr-10 py-2.5 rounded-full border border-[#e5e5ea] dark:border-[#2d2d30] bg-[#f5f5f7] dark:bg-[#272729] text-[#1d1d1f] dark:text-white placeholder:text-[#86868b] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0066cc]/30 focus:border-[#0066cc] transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>

      {/* Quick click suggestions */}
      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-[#86868b] mr-1 hidden sm:inline">
          Quick suggestions:
        </span>
        {suggestedPrompts.slice(0, 5).map((promptText) => (
          <button
            key={promptText}
            type="button"
            disabled={isLoading}
            onClick={() => handleSend(promptText)}
            className="px-3 py-1 rounded-full border border-[#e5e5ea] dark:border-[#2d2d30] bg-[#f5f5f7] dark:bg-[#272729] text-[11px] font-medium text-[#86868b] hover:border-[#0066cc] hover:text-[#0066cc] dark:hover:text-[#2997ff] transition-colors cursor-pointer"
          >
            "{promptText}"
          </button>
        ))}
      </div>
    </div>
  );
};
