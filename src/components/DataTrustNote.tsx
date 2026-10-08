import React from 'react';
import { Database, ShieldCheck } from 'lucide-react';
import { MarketRegion } from '../types';

interface DataTrustNoteProps {
  marketRegion: MarketRegion;
  compact?: boolean;
}

export const DataTrustNote: React.FC<DataTrustNoteProps> = ({ marketRegion, compact = false }) => {
  const isGreek = marketRegion === 'greece';
  const verifiedFeed = import.meta.env.VITE_VERIFIED_VEHICLE_DATA === 'true';
  return (
    <aside className={`data-trust-note ${compact ? 'p-3' : 'p-4 sm:p-5'}`} aria-label={isGreek ? 'Κατάσταση δεδομένων' : 'Data status'}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]">
          <Database className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[var(--color-text)]">
            {verifiedFeed
              ? (isGreek ? 'Επαληθευμένες πηγές δεδομένων συνδεδεμένες' : 'Verified data sources connected')
              : (isGreek ? 'Δεδομένα αναφοράς — όχι ακόμη εμπορικά επαληθευμένη ροή' : 'Reference data — not yet a commercially verified feed')}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-text-muted)]">
            {verifiedFeed
              ? (isGreek
                  ? 'Κάθε κρίσιμο πεδίο πρέπει να κρατά πάροχο, αγορά και ημερομηνία ανάκτησης ώστε να μπορεί να ελεγχθεί ξανά.'
                  : 'Each critical field should retain its provider, market, and retrieval date so it can be re-checked.')
              : (isGreek
                  ? 'Οι τιμές, οι προδιαγραφές και τα φορολογικά στοιχεία είναι ενδεικτικά και δεν ενημερώνονται αυτόματα. Επιβεβαίωσε τα κρίσιμα στοιχεία στις επίσημες πηγές πριν από αγορά.'
                  : 'Prices, specifications, and tax details are reference values and are not updated automatically. Confirm critical details with official sources before you buy.')}
          </p>
          {!compact && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-text-muted)]">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              {isGreek ? 'Μην χρησιμοποιείς τις ενδεικτικές τιμές ως τελικό έλεγχο αγοράς.' : 'Do not use reference prices as the final purchase verification.'}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};
