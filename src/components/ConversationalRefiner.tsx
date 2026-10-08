import React, { useState } from 'react';
import { Sparkles, Send, Bot } from 'lucide-react';
import { MarketRegion, UserPreferences } from '../types';
import { refineLocally, type AdvisorFilterOverrides } from '../services/localAdvisor';

interface ConversationalRefinerProps {
  currentPreferences: UserPreferences;
  marketRegion?: MarketRegion;
  onApplyRefinements: (result: { advisorResponse: string; filterOverrides?: AdvisorFilterOverrides }) => void;
  lastAdvisorMessage?: string;
}

export const ConversationalRefiner: React.FC<ConversationalRefinerProps> = ({
  currentPreferences, marketRegion = 'greece', onApplyRefinements, lastAdvisorMessage
}) => {
  const isGreek = marketRegion === 'greece';
  const [input, setInput] = useState('');
  const suggestedPrompts = isGreek
    ? ['Κάτι φθηνότερο', 'Κάτι πιο σπορ', 'Μόνο SUV', 'Δεν θέλω diesel', 'Δείξε μου ηλεκτρικά']
    : ['Something cheaper', 'Something sportier', 'Only SUVs', "I don't want diesel", 'Show electric cars'];

  const [error, setError] = useState('');

  // refineLocally is synchronous, so there is no loading state to show.
  const handleSend = (messageToSend?: string) => {
    const text = (messageToSend || input).trim();
    if (!text) {
      setError(isGreek ? 'Γράψε τι θέλεις να αλλάξει ή διάλεξε μια γρήγορη πρόταση.' : 'Type what you want to change, or pick a quick suggestion.');
      return;
    }
    setError('');
    onApplyRefinements(refineLocally(text, marketRegion));
    setInput('');
  };

  return (
    <section className="surface-card p-3 sm:p-5 mb-5 sm:mb-8" aria-labelledby="refiner-title">
      <div className="flex items-center gap-3 mb-2 sm:mb-4">
        <div className="hidden sm:flex w-10 h-10 rounded-full bg-[var(--color-accent)]/12 border border-[var(--color-accent)]/30 items-center justify-center text-[var(--color-accent-text)]"><Bot className="w-5 h-5" aria-hidden="true" /></div>
        <div>
          <h2 id="refiner-title" className="text-[15px] font-bold text-[var(--color-text)]">{isGreek ? 'Προσαρμογή με τον σύμβουλο' : 'Refine with the advisor'}</h2>
          <p className="hidden sm:block text-[15px] text-[var(--color-text-muted)]">{isGreek ? 'Πες τι θέλεις να αλλάξει χωρίς να ξεκινήσεις ξανά.' : 'Tell CarCheck what to change without restarting.'}</p>
        </div>
      </div>

      {/* The live region stays mounted so the first advisor reply is announced too. */}
      <div role="status" aria-live="polite" aria-atomic="true">
        {lastAdvisorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-[var(--color-accent)]/8 border border-[var(--color-accent)]/25 text-[15px] text-[var(--color-text)] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-accent-text)]" aria-hidden="true" /><p className="leading-relaxed min-w-0">{lastAdvisorMessage}</p>
          </div>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} noValidate>
        <label htmlFor="advisor-refinement" className="sr-only sm:not-sr-only sm:block sm:mb-1 text-[15px] font-semibold text-[var(--color-text)]">{isGreek ? 'Τι θέλεις να αλλάξεις;' : 'What would you like to change?'}</label>
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <input id="advisor-refinement" name="refinement" type="text" autoComplete="off" enterKeyHint="send" value={input} onChange={(e) => { setInput(e.target.value); if (error) setError(''); }} aria-invalid={error ? true : undefined} aria-describedby={error ? 'advisor-refinement-error' : undefined} placeholder={isGreek ? 'π.χ. «κάτι φθηνότερο», «μόνο SUV»…' : 'e.g. “something cheaper”, “only SUVs”…'} className="min-h-11 w-full px-4 rounded-xl border border-[var(--color-border-control)] bg-[var(--color-canvas)] text-[15px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]" />
          </div>
          <button type="submit" aria-label={isGreek ? 'Αποστολή στον σύμβουλο' : 'Send to advisor'} className="touch-target min-w-11 px-4 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white flex items-center justify-center">
          <Send className="w-4 h-4" aria-hidden="true" />
        </button>
        </div>
        {error && <p id="advisor-refinement-error" className="mt-1.5 text-[13px] font-semibold text-[var(--color-danger)]">{error}</p>}
      </form>

      <div className="mt-3 -mx-3 px-3 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto sm:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label={isGreek ? 'Γρήγορες προτάσεις' : 'Quick suggestions'}>
        {suggestedPrompts.map((promptText) => (
          <button key={promptText} type="button" onClick={() => handleSend(promptText)} className="shrink-0 whitespace-nowrap min-h-11 px-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[13px] font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-accent-text)] hover:border-[var(--color-accent)]">
            {promptText}
          </button>
        ))}
      </div>
    </section>
  );
};
