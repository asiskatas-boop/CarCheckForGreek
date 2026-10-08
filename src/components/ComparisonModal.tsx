import React, { useMemo } from 'react';
import { runningCostLabel, drivetrainLabel, formatNumber, fuelLabel, plural, transmissionLabel } from '../services/format';
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
  // Derived synchronously, so there is no empty first render or flash.
  const aiAnalysis = useMemo<{ headline?: string; tradeOffs?: string[]; verdict?: string } | null>(
    () => (vehicles.length > 0 ? compareLocally(vehicles, userPreferences, marketRegion) : null),
    [vehicles, userPreferences, marketRegion]
  );

  const num = (value: number, options?: Intl.NumberFormatOptions) => formatNumber(value, marketRegion, options);
  const rows: [string, (v: Vehicle) => string][] = [
    [isGreek ? 'Ενδεικτική τιμή αγοράς' : 'Reference market price', (v) => formatPriceRange(v.typicalPriceMin, v.typicalPriceMax, currency)],
    [isGreek ? 'Αξιοπιστία' : 'Reliability', (v) => `${num(v.reliabilityRating)} / 5`],
    [isGreek ? 'Καύσιμο & κατανάλωση' : 'Fuel & consumption', (v) => `${fuelLabel(v.fuelType, marketRegion)} · ${v.fuelEconomy}`],
    [isGreek ? 'Ισχύς & 0–100' : 'Power & 0–100', (v) => `${num(v.horsepower)} hp · ${num(v.acceleration0to100, { maximumFractionDigits: 1 })} s`],
    [isGreek ? 'Χώρος αποσκευών' : 'Boot capacity', (v) => `${num(v.cargoCapacityLiters)} L · ${plural(v.seats, marketRegion, isGreek ? { one: 'θέση', other: 'θέσεις' } : { one: 'seat', other: 'seats' })}`],
    [isGreek ? 'Κόστος χρήσης' : 'Running cost', (v) => runningCostLabel(v.runningCostLevel, marketRegion)],
    [isGreek ? 'Κιβώτιο & κίνηση' : 'Transmission & drivetrain', (v) => `${transmissionLabel(v.transmission, marketRegion)} · ${drivetrainLabel(v.drivetrain, marketRegion)}`]
  ];
  const priorities = userPreferences.priorities.map((p) => priorityLabel(p, isGreek)).join(isGreek ? ', ' : ', ');

  return (
    <AccessibleDialog
      open
      onClose={onClose}
      labelledBy="comparison-title"
      panelClassName="w-full max-w-6xl h-[100dvh] sm:h-auto sm:max-h-[94dvh] bg-[var(--color-surface)] sm:border border-[var(--color-border)] sm:rounded-2xl shadow-xl flex flex-col overflow-hidden my-auto"
      overlayClassName="p-0 sm:p-5 items-center justify-center"
    >
      <div className="p-4 sm:p-6 border-b border-[var(--color-border)] flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent-text)] shrink-0"><Scale className="w-5 h-5" aria-hidden="true" /></div>
          <div className="min-w-0">
            <h2 id="comparison-title" className="text-lg sm:text-xl font-semibold text-[var(--color-text)] tracking-tight">{isGreek ? 'Σύγκριση οχημάτων' : 'Side-by-side comparison'}</h2>
            <p className="text-[15px] text-[var(--color-text-muted)]">{isGreek ? `${plural(vehicles.length, marketRegion, { one: 'όχημα', other: 'οχήματα' })} με βάση το προφίλ σου` : `${plural(vehicles.length, marketRegion, { one: 'vehicle', other: 'vehicles' })} based on your profile`}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="touch-target rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text)] flex items-center justify-center" aria-label={isGreek ? 'Κλείσιμο σύγκρισης' : 'Close comparison'}><X className="w-5 h-5" aria-hidden="true" /></button>
      </div>

      <div className="p-4 sm:p-7 overflow-y-auto overscroll-contain space-y-6 sm:space-y-7">
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

            <div
              className="overflow-x-auto rounded-2xl border border-[var(--color-border)]"
              role="region"
              aria-labelledby="comparison-table-caption"
              tabIndex={0}
            >
              <table className="w-full min-w-max text-[15px] text-left border-collapse">
                <caption id="comparison-table-caption" className="sr-only">
                  {isGreek ? 'Πίνακας σύγκρισης οχημάτων' : 'Vehicle comparison table'}
                </caption>
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <td className="p-4 min-w-[140px]" />
                    {vehicles.map((v) => (
                      <th key={v.id} scope="col" className="p-4 min-w-[160px] font-semibold text-[var(--color-text)]">
                        {v.make} {v.model}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([label, formatter], index) => (
                    <tr key={label} className={index % 2 ? '' : 'bg-[var(--color-surface-subtle)]'}>
                      <th scope="row" className="p-4 font-bold text-[var(--color-text-muted)] align-top">{label}</th>
                      {vehicles.map((v) => (
                        <td key={v.id} className="p-4 font-semibold text-[var(--color-text)] align-top tabular-nums">{formatter(v)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <section className="p-5 sm:p-6 rounded-2xl bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/25" aria-labelledby="advisor-verdict-title">
              <div className="flex items-center justify-between gap-3">
                <h3 id="advisor-verdict-title" className="flex items-center gap-2 text-[var(--color-accent-text)] font-semibold text-[15px]"><Sparkles className="w-4 h-4" aria-hidden="true" />{isGreek ? 'Ποιο ταιριάζει καλύτερα;' : 'Which one fits best?'}</h3>
              </div>
              <div className="mt-3 text-[15px] text-[var(--color-text)] leading-relaxed">
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
