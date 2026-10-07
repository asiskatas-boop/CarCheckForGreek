import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Bot } from 'lucide-react';
import { MarketRegion, SmartFilterState, UserPreferences } from '../types';

interface ConversationalRefinerProps {
  currentPreferences: UserPreferences;
  marketRegion?: MarketRegion;
  onApplyRefinements: (result: { advisorResponse: string; filterOverrides?: Partial<SmartFilterState> }) => void;
  lastAdvisorMessage?: string;
}

export const ConversationalRefiner: React.FC<ConversationalRefinerProps> = ({
  currentPreferences, marketRegion = 'greece', onApplyRefinements, lastAdvisorMessage
}) => {
  const isGreek = marketRegion === 'greece';
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const suggestedPrompts = isGreek
    ? ['Κάτι φθηνότερο', 'Κάτι πιο σπορ', 'Μόνο SUV', 'Δεν θέλω diesel', 'Δείξε μου ηλεκτρικά']
    : ['Something cheaper', 'Something sportier', 'Only SUVs', "I don't want diesel", 'Show electric cars'];

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || input).trim();
    if (!text || isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat-refine', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: text, currentPreferences, marketRegion })
      });
      if (!res.ok) throw new Error('Refinement failed');
      const data = await res.json();
      onApplyRefinements({
        advisorResponse: data.advisorResponse || (isGreek ? 'Οι προτάσεις ενημερώθηκαν με βάση το αίτημά σου.' : 'Recommendations updated based on your request.'),
        filterOverrides: data.filterOverrides
      });
      setInput('');
    } catch (error) {
      console.error(error);
      onApplyRefinements({
        advisorResponse: isGreek ? `Κατάλαβα: «${text}». Προσάρμοσα τα φίλτρα όσο ήταν δυνατό.` : `Understood: “${text}”. I adjusted the filters where possible.`,
        filterOverrides: { searchQuery: text }
      });
      setInput('');
    } finally { setIsLoading(false); }
  };

  return (
    <section className="surface-card p-4 sm:p-5 mb-8" aria-labelledby="refiner-title">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/12 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent-text)]"><Bot className="w-5 h-5" aria-hidden="true" /></div>
        <div>
          <h3 id="refiner-title" className="text-[15px] font-bold text-[var(--color-text)]">{isGreek ? 'Προσαρμογή με τον σύμβουλο' : 'Refine with the advisor'}</h3>
          <p className="text-[15px] text-[var(--color-text-muted)]">{isGreek ? 'Πες τι θέλεις να αλλάξει χωρίς να ξεκινήσεις ξανά.' : 'Tell CarCheck what to change without restarting.'}</p>
        </div>
      </div>

      {lastAdvisorMessage && (
        <div role="status" aria-live="polite" aria-atomic="true" className="mb-4 p-3 rounded-full bg-[var(--color-accent)]/8 border border-[var(--color-accent)]/25 text-[15px] text-[var(--color-text)] flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-accent-text)]" aria-hidden="true" /><p className="leading-relaxed">{lastAdvisorMessage}</p>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-end gap-2">
        <div className="flex-1">
          <label htmlFor="advisor-refinement" className="text-[15px] font-semibold text-[var(--color-text)]">{isGreek ? 'Τι θέλεις να αλλάξεις;' : 'What would you like to change?'}</label>
          <input id="advisor-refinement" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={isGreek ? 'π.χ. «κάτι φθηνότερο», «μόνο SUV»…' : 'e.g. “something cheaper”, “only SUVs”…'} disabled={isLoading} className="mt-1 min-h-11 w-full px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] text-[15px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]" />
        </div>
        <button type="submit" disabled={!input.trim() || isLoading} aria-label={isLoading ? (isGreek ? 'Ενημέρωση προτάσεων' : 'Updating recommendations') : (isGreek ? 'Αποστολή στον σύμβουλο' : 'Send to advisor')} className="touch-target min-w-11 px-4 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-40 text-white flex items-center justify-center">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Send className="w-4 h-4" aria-hidden="true" />}
        </button>
      </form>

      <div className="mt-3 flex items-center gap-2 flex-wrap" aria-label={isGreek ? 'Γρήγορες προτάσεις' : 'Quick suggestions'}>
        {suggestedPrompts.map((promptText) => (
          <button key={promptText} type="button" disabled={isLoading} onClick={() => handleSend(promptText)} className="min-h-10 px-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[13px] font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-accent-text)] hover:border-[var(--color-accent)]">
            {promptText}
          </button>
        ))}
      </div>
    </section>
  );
};
