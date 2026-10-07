import React, { useEffect, useState } from 'react';
import { Vehicle, Currency, UserPreferences, MarketRegion } from '../types';
import { formatPrice, formatPriceRange } from '../services/currency';
import { AccessibleDialog } from './AccessibleDialog';
import { VehicleImage } from './VehicleImage';
import { X, Scale, Sparkles } from 'lucide-react';
import { compareLocally } from '../services/localAdvisor';

interface ComparisonModalProps {
  vehicles: Vehicle[];
  onClose: () => void;
  currency: Currency;
  marketRegion?: MarketRegion;
  userPreferences: UserPreferences;
  onRemoveVehicle: (id: string) => void;
}

const priorityLabel = (value: string, isGreek: boolean) => {
  const el: Record<string, string> = {
    reliability: 'αξιοπιστία', 'low-running-costs': 'χαμηλό κόστος χρήσης', 'fuel-economy': 'οικονομία καυσίμου',
    performance: 'επιδόσεις', comfort: 'άνεση', technology: 'τεχνολογία', safety: 'ασφάλεια', practicality: 'πρακτικότητα',
    luxury: 'πολυτέλεια', design: 'σχεδίαση', 'resale-value': 'μεταπωλητική αξία', 'environmental-impact': 'περιβαλλοντικό αποτύπωμα'
  };
  return isGreek ? (el[value] || value) : value.replaceAll('-', ' ');
};

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  vehicles, onClose, currency, marketRegion = 'greece', userPreferences, onRemoveVehicle
}) => {
  const isGreek = marketRegion === 'greece';
  const [aiAnalysis, setAiAnalysis] = useState<{ headline?: string; tradeOffs?: string[]; verdict?: string } | null>(null);

  useEffect(() => {
    setAiAnalysis(compareLocally(vehicles, userPreferences, marketRegion));
  }, [vehicles, userPreferences, marketRegion]);

  const gridStyle = { gridTemplateColumns: `minmax(140px, .8fr) repeat(${Math.max(vehicles.length, 1)}, minmax(160px, 1fr))` };
  const priorities = userPreferences.priorities.map((p) => priorityLabel(p, isGreek)).join(isGreek ? ', ' : ', ');

  return (
    <AccessibleDialog
      open
      onClose={onClose}
      labelledBy="comparison-title"
      panelClassName="w-full max-w-6xl max-h-[94vh] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl flex flex-col overflow-hidden my-auto"
      overlayClassName="p-2 sm:p-5 items-center justify-center"
    >
      <header className="p-5 sm:p-6 border-b border-[var(--color-border)] flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent-text)] shrink-0"><Scale className="w-5 h-5" aria-hidden="true" /></div>
          <div className="min-w-0">
            <h2 id="comparison-title" className="text-lg sm:text-xl font-semibold text-[var(--color-text)] tracking-tight">{isGreek ? 'Σύγκριση οχημάτων' : 'Side-by-side comparison'}</h2>
            <p className="text-[15px] text-[var(--color-text-muted)]">{isGreek ? `${vehicles.length} οχήματα με βάση το προφίλ σου` : `${vehicles.length} vehicles based on your profile`}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="touch-target rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text)] flex items-center justify-center" aria-label={isGreek ? 'Κλείσιμο σύγκρισης' : 'Close comparison'}><X className="w-5 h-5" aria-hidden="true" /></button>
      </header>

      <div className="p-5 sm:p-7 overflow-y-auto space-y-7">
        {vehicles.length === 0 ? (
          <div className="text-center py-14">
            <Scale className="w-11 h-11 text-[var(--color-text-muted)] mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-bold text-[var(--color-text)]">{isGreek ? 'Δεν έχουν επιλεγεί οχήματα' : 'No vehicles selected'}</h3>
            <p className="text-[15px] text-[var(--color-text-muted)] mt-2">{isGreek ? 'Επίλεξε έως 3 αυτοκίνητα από τις προτάσεις ή τον κατάλογο.' : 'Select up to 3 cars from recommendations or the catalog.'}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((v) => (
                <article key={v.id} className="relative surface-card p-4 overflow-hidden">
                  <button type="button" onClick={() => onRemoveVehicle(v.id)} className="touch-target absolute top-2 right-2 rounded-full bg-[rgba(255,253,249,0.94)] text-[var(--color-text)] border border-white/80 shadow-sm flex items-center justify-center" aria-label={isGreek ? `Αφαίρεση ${v.make} ${v.model} από τη σύγκριση` : `Remove ${v.make} ${v.model} from comparison`}><X className="w-4 h-4" aria-hidden="true" /></button>
                  <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-[var(--color-surface-subtle)] mb-3"><VehicleImage vehicle={v} decorative marketRegion={marketRegion} /></div>
                  <p className="text-[13px] text-[var(--color-text-muted)]">{v.generation} · {v.years}</p>
                  <h3 className="text-base font-semibold text-[var(--color-text)]">{v.make} {v.model}</h3>
                  <p className="text-[15px] font-bold text-[var(--color-accent-text)] mt-1">{isGreek ? 'Καλή αγορά έως' : 'Good buy up to'} {formatPrice(v.goodBuyPrice, currency)}</p>
                </article>
              ))}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]" aria-label={isGreek ? 'Πίνακας σύγκρισης' : 'Comparison table'}>
              <div className="min-w-max text-[15px]">
                {[
                  [isGreek ? 'Ενδεικτική τιμή αγοράς' : 'Reference market price', (v: Vehicle) => formatPriceRange(v.typicalPriceMin, v.typicalPriceMax, currency)],
                  [isGreek ? 'Αξιοπιστία' : 'Reliability', (v: Vehicle) => `${v.reliabilityRating} / 5`],
                  [isGreek ? 'Καύσιμο & κατανάλωση' : 'Fuel & consumption', (v: Vehicle) => `${v.fuelType} · ${v.fuelEconomy}`],
                  [isGreek ? 'Ισχύς & 0–100' : 'Power & 0–100', (v: Vehicle) => `${v.horsepower} hp · ${v.acceleration0to100}s`],
                  [isGreek ? 'Χώρος αποσκευών' : 'Boot capacity', (v: Vehicle) => `${v.cargoCapacityLiters} L · ${v.seats} ${isGreek ? 'θέσεις' : 'seats'}`],
                  [isGreek ? 'Κόστος χρήσης' : 'Running cost', (v: Vehicle) => v.runningCostLevel],
                  [isGreek ? 'Κιβώτιο & κίνηση' : 'Transmission & drivetrain', (v: Vehicle) => `${v.transmission} · ${v.drivetrain}`]
                ].map(([label, formatter], index) => (
                  <div key={String(label)} className={`grid p-4 gap-4 ${index % 2 ? '' : 'bg-[var(--color-surface-subtle)]'}`} style={gridStyle}>
                    <div className="font-bold text-[var(--color-text-muted)]">{String(label)}</div>
                    {vehicles.map((v) => <div key={v.id} className="font-semibold text-[var(--color-text)]">{(formatter as (v: Vehicle) => string)(v)}</div>)}
                  </div>
                ))}
              </div>
            </div>

            <section className="p-5 sm:p-6 rounded-2xl bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/25" aria-labelledby="advisor-verdict-title">
              <div className="flex items-center justify-between gap-3">
                <h3 id="advisor-verdict-title" className="flex items-center gap-2 text-[var(--color-accent-text)] font-semibold text-[15px] uppercase tracking-wider"><Sparkles className="w-4 h-4" aria-hidden="true" />{isGreek ? 'Ποιο ταιριάζει καλύτερα;' : 'Which one fits best?'}</h3>
              </div>
              <div className="mt-3 text-[15px] text-[var(--color-text)] leading-relaxed" aria-live="polite">
                {aiAnalysis ? (
                  <div className="space-y-3">
                    {aiAnalysis.headline && <p className="font-bold">{aiAnalysis.headline}</p>}
                    {aiAnalysis.tradeOffs && <ul className="list-disc pl-5 space-y-1 text-[var(--color-text-muted)]">{aiAnalysis.tradeOffs.map((item, index) => <li key={index}>{item}</li>)}</ul>}
                    {aiAnalysis.verdict && <p className="surface-card p-4"><strong>{isGreek ? 'Συμπέρασμα συμβούλου:' : 'Advisor verdict:'}</strong> {aiAnalysis.verdict}</p>}
                  </div>
                ) : (
                  <p className="text-[var(--color-text-muted)]">
                    {isGreek
                      ? `Οι βασικές προτεραιότητές σου${priorities ? ` είναι ${priorities}` : ''}. Σύγκρινε πρώτα κόστος χρήσης, αξιοπιστία και πρακτικότητα και επιβεβαίωσε την πραγματική κατάσταση του συγκεκριμένου μεταχειρισμένου πριν την αγορά.`
                      : `Your key priorities${priorities ? ` are ${priorities}` : ''}. Compare running cost, reliability and practicality first, then verify the condition of the specific used car before buying.`}
                  </p>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </AccessibleDialog>
  );
};
