import { cloneElement, useEffect, useId, useMemo, useRef, useState } from 'react';
import { checkPrice, VERDICT_LABEL, type CheckResult, type PriceIndex } from '../pricing/engine.ts';
import { readAd } from './adReader.ts';
import { euro, num, type IndexSource } from './priceIndex.ts';

const FUELS = ['Βενζίνη', 'Πετρέλαιο', 'Υβριδικό', 'Plug-in υβριδικό', 'Ηλεκτρικό', 'Υγραέριο', 'Φυσικό αέριο'];
const THIS_YEAR = new Date().getFullYear();

interface Form {
  make: string;
  model: string;
  year: string;
  km: string;
  price: string;
  fuel: string;
  gearbox: string;
  origin: string;
}
const EMPTY: Form = { make: '', model: '', year: '', km: '', price: '', fuel: '', gearbox: '', origin: '' };

const digits = (s: string) => {
  const d = s.replace(/[^\d]/g, '');
  return d ? parseInt(d, 10) : null;
};

const VERDICT_TEXT: Record<string, string> = {
  suspicious: 'Πολύ κάτω από την αγορά. Μπορεί να είναι ευκαιρία, συχνά όμως κρύβει πρόβλημα: ζήτα ιστορικό ΚΤΕΟ και δες το αυτοκίνητο από κοντά πριν δώσεις χρήματα.',
  good: 'Κάτω από τα περισσότερα παρόμοια. Αξίζει να το δεις γρήγορα.',
  fair: 'Μέσα στο εύρος που ζητάνε για παρόμοια αυτοκίνητα.',
  high: 'Πάνω από τα περισσότερα παρόμοια. Διαπραγματεύσου ή ζήτα κάτι παραπάνω (σέρβις, λάστιχα).',
  veryHigh: 'Πολύ πάνω από την αγορά. Χρειάζεται σοβαρός λόγος για αυτή την τιμή.',
};

export function CheckPage({ index, from }: { index: PriceIndex | null; from: IndexSource | null }) {
  const [adText, setAdText] = useState('');
  const [form, setForm] = useState<Form>(EMPTY);
  const [readNote, setReadNote] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResult | null | 'none'>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const resultRef = useRef<HTMLDivElement>(null);
  const ids = { ad: useId(), make: useId(), model: useId(), makes: useId(), models: useId() };

  const makes = useMemo(() => {
    if (!index) return [];
    const set = new Map<string, string[]>();
    for (const m of Object.values(index.models)) set.set(m.make, [...(set.get(m.make) || []), m.model]);
    return [...set.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [index]);
  const modelsOfMake = makes.find(([m]) => m.toLowerCase() === form.make.trim().toLowerCase())?.[1] || [];

  const set = (k: keyof Form) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  function onRead() {
    const r = readAd(adText);
    const f = r.fields;
    const next: Form = {
      make: f.make || form.make,
      model: f.model || form.model,
      year: f.year ? String(f.year) : form.year,
      km: f.km != null ? num(f.km) : form.km,
      price: f.price != null ? num(f.price) : form.price,
      fuel: f.fuel || form.fuel,
      gearbox: f.gearbox || form.gearbox,
      origin: f.origin || form.origin,
    };
    setForm(next);
    const got = [f.make && 'μάρκα', f.model && 'μοντέλο', f.year && 'χρονιά', f.km != null && 'χιλιόμετρα', f.price != null && 'τιμή'].filter(Boolean);
    const missing = (['make', 'model', 'year', 'price'] as const).filter((k) => !next[k]);
    const label: Record<string, string> = { make: 'μάρκα', model: 'μοντέλο', year: 'χρονιά', price: 'τιμή' };
    setReadNote(
      (got.length ? 'Βρήκα: ' + got.join(', ') + '.' : 'Δεν βρήκα στοιχεία στο κείμενο.') +
        (missing.length ? ' Συμπλήρωσε: ' + missing.map((k) => label[k]).join(', ') + '.' : ' Έλεγξέ τα και πάτα «Τσέκαρέ το».') +
        (r.kind === 'wanted' ? ' Προσοχή: μοιάζει με αγγελία «ζητείται».' : ''),
    );
  }

  function onCheck(e: React.FormEvent) {
    e.preventDefault();
    const er: typeof errors = {};
    const year = digits(form.year);
    if (!form.make.trim()) er.make = 'Γράψε τη μάρκα.';
    if (!form.model.trim()) er.model = 'Γράψε το μοντέλο.';
    if (!year || year < 1980 || year > THIS_YEAR + 1) er.year = 'Γράψε τη χρονιά, π.χ. 2016.';
    setErrors(er);
    if (Object.keys(er).length || !index) return;
    const r = checkPrice(index, {
      make: form.make.trim(),
      model: form.model.trim(),
      year: year!,
      km: digits(form.km),
      price: digits(form.price),
      fuel: form.fuel || null,
      gearbox: form.gearbox || null,
      origin: form.origin || null,
    });
    setResult(r || 'none');
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  return (
    <div className="cc-page">
      <section className="cc-hero">
        <h1>Είναι καλή η τιμή;</h1>
        <p className="cc-lead">Επικόλλησε την αγγελία από το Facebook ή το car.gr, ή γράψε τα στοιχεία. Σου λέμε τι τιμή είναι λογική και από πού να ξεκινήσεις τη διαπραγμάτευση.</p>
      </section>

      {index?.synthetic && (
        <p className="cc-banner" role="note">
          Δοκιμαστική έκδοση: οι τιμές βγαίνουν από δείγμα δεδομένων, όχι από πραγματικές αγγελίες. Μην τις χρησιμοποιήσεις ακόμα για αγορά.
        </p>
      )}
      {from === 'local' && !index?.synthetic && (
        <p className="cc-banner" role="note">Χρησιμοποιείς τον δείκτη τιμών από τα αρχεία σου (σελίδα Δεδομένα), μόνο σε αυτόν τον browser.</p>
      )}

      <div className="cc-field">
        <label htmlFor={ids.ad}>Κείμενο ή σύνδεσμος αγγελίας</label>
        <textarea
          id={ids.ad}
          rows={4}
          value={adText}
          onChange={(e) => setAdText(e.target.value)}
          placeholder="π.χ. Πωλείται Toyota Yaris 1.0, 2014, 98.000 χλμ, βενζίνη, 7.900€"
        />
        <button type="button" className="cc-btn cc-btn-secondary" onClick={onRead} disabled={!adText.trim()}>
          Διάβασε την αγγελία
        </button>
        {readNote && (
          <p className="cc-note" role="status">
            {readNote}
          </p>
        )}
      </div>

      <form className="cc-form" onSubmit={onCheck} noValidate>
        <h2>Στοιχεία αυτοκινήτου</h2>
        <div className="cc-grid">
          <Field label="Μάρκα" id={ids.make} error={errors.make}>
            <input id={ids.make} list={ids.makes} value={form.make} onChange={set('make')} autoComplete="off" aria-invalid={!!errors.make} />
            <datalist id={ids.makes}>
              {makes.map(([m]) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </Field>
          <Field label="Μοντέλο" id={ids.model} error={errors.model}>
            <input id={ids.model} list={ids.models} value={form.model} onChange={set('model')} autoComplete="off" aria-invalid={!!errors.model} />
            <datalist id={ids.models}>
              {modelsOfMake.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </Field>
          <Field label="Χρονιά" error={errors.year}>
            <input inputMode="numeric" value={form.year} onChange={set('year')} placeholder="2016" aria-invalid={!!errors.year} />
          </Field>
          <Field label="Χιλιόμετρα">
            <input inputMode="numeric" value={form.km} onChange={set('km')} placeholder="120.000" />
          </Field>
          <Field label="Τιμή αγγελίας (€)">
            <input inputMode="numeric" value={form.price} onChange={set('price')} placeholder="8.500" />
          </Field>
          <Field label="Καύσιμο">
            <select value={form.fuel} onChange={set('fuel')}>
              <option value="">Δεν ξέρω</option>
              {FUELS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </Field>
        </div>
        <Segmented label="Κιβώτιο" value={form.gearbox} options={['Χειροκίνητο', 'Αυτόματο']} onChange={(v) => setForm((f) => ({ ...f, gearbox: v }))} />
        <Segmented label="Προέλευση" value={form.origin} options={['Ελληνικό', 'Εισαγωγής']} onChange={(v) => setForm((f) => ({ ...f, origin: v }))} />
        <button type="submit" className="cc-btn cc-btn-primary" disabled={!index}>
          Τσέκαρέ το
        </button>
        {!index && <p className="cc-note">Οι τιμές δεν φόρτωσαν. Ανανέωσε τη σελίδα.</p>}
      </form>

      <div ref={resultRef} tabIndex={-1} aria-live="polite" className="cc-result-wrap">
        {result === 'none' && (
          <section className="cc-result">
            <h2>Δεν έχουμε ακόμα τιμές για αυτό το μοντέλο</h2>
            <p className="cc-note">Έλεγξε τη γραφή της μάρκας. Αν είναι σωστή, θα το προσθέσουμε όταν μαζευτούν αρκετές αγγελίες.</p>
          </section>
        )}
        {result && result !== 'none' && <Result r={result} price={digits(form.price)} year={digits(form.year)!} km={digits(form.km)} />}
      </div>
    </div>
  );
}

function Field({ label, id, error, children }: { label: string; id?: string; error?: string; children: React.ReactElement | React.ReactElement[] }) {
  const autoId = useId();
  const kids = Array.isArray(children) ? children : [children];
  const first = kids[0];
  const inputId = id || autoId;
  const errId = inputId + '-err';
  const input = cloneElement(first as React.ReactElement<Record<string, unknown>>, { id: inputId, 'aria-describedby': error ? errId : undefined });
  return (
    <div className="cc-field">
      <label htmlFor={inputId}>{label}</label>
      {input}
      {kids.slice(1)}
      {error && (
        <p id={errId} className="cc-error">
          {error}
        </p>
      )}
    </div>
  );
}

function Segmented({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <fieldset className="cc-seg">
      <legend>{label}</legend>
      <div>
        {['', ...options].map((o) => (
          <label key={o || 'none'} className={value === o ? 'on' : ''}>
            <input type="radio" name={label} value={o} checked={value === o} onChange={() => onChange(o)} />
            {o || 'Δεν ξέρω'}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Result({ r, price, year, km }: { r: CheckResult; price: number | null; year: number; km: number | null }) {
  const b = r.bands;
  const span = b.p90 - b.p10 || 1;
  const pct = (v: number) => `${Math.max(0, Math.min(100, ((v - b.p10) / span) * 100))}%`;
  return (
    <section className={`cc-result v-${r.verdict || 'none'}`}>
      <p className="cc-kicker">
        {r.modelName} {year}
        {km != null ? `, ${num(km)} χλμ` : ''}
      </p>
      {r.verdict && price != null ? (
        <>
          <h2 className="cc-verdict">{VERDICT_LABEL[r.verdict]}</h2>
          <p className="cc-verdict-text">
            {euro(price)}
            {r.diff != null && Math.abs(r.diff) >= 100 ? ` είναι ${euro(Math.abs(r.diff))} ${r.diff > 0 ? 'πάνω' : 'κάτω'} από τη μέση τιμή. ` : ' είναι κοντά στη μέση τιμή. '}
            {VERDICT_TEXT[r.verdict]}
          </p>
        </>
      ) : (
        <h2 className="cc-verdict">Λογική τιμή: {euro(b.low)} έως {euro(b.high)}</h2>
      )}

      <div className="cc-meter" aria-hidden="true">
        <div className="cc-track">
          <span className="cc-band" style={{ left: pct(b.low), width: `calc(${pct(b.high)} - ${pct(b.low)})` }} />
          <span className="cc-mid" style={{ left: pct(b.mid) }} />
          {price != null && <span className="cc-you" style={{ left: pct(price) }} />}
        </div>
        <div className="cc-scale">
          <span>{euro(b.p10)}</span>
          <span>{euro(b.p90)}</span>
        </div>
      </div>

      <dl className="cc-facts">
        <div>
          <dt>Λογικό εύρος</dt>
          <dd>
            {euro(b.low)} έως {euro(b.high)}
          </dd>
        </div>
        <div>
          <dt>Μέση τιμή</dt>
          <dd>{euro(b.mid)}</dd>
        </div>
        {r.negotiate && (
          <div>
            <dt>Διαπραγμάτευση</dt>
            <dd>
              Ξεκίνα από {euro(r.negotiate.start)}, στόχος {euro(r.negotiate.target)}
            </dd>
          </div>
        )}
        <div>
          <dt>Συνηθισμένα χιλιόμετρα</dt>
          <dd>{num(r.typicalKm)} χλμ για αυτή την ηλικία</dd>
        </div>
      </dl>

      {r.factors.length > 0 && (
        <>
          <h3>Τι επηρεάζει την τιμή</h3>
          <ul className="cc-factors">
            {r.factors.map((f) => (
              <li key={f.label}>
                <span>{f.label}</span>
                <span className={f.effect > 0 ? 'up' : 'down'}>
                  {f.effect > 0 ? '+' : '−'}
                  {Math.round(Math.abs(f.effect) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className={`cc-confidence c-${r.confidence}`}>
        {r.found === 'make'
          ? `Δεν έχουμε αρκετές αγγελίες για αυτό το μοντέλο. Η εκτίμηση βγαίνει από άλλα μοντέλα της ${r.modelName.split(' ')[0]}, άρα είναι χοντρική.`
          : `Βάση: ${num(r.basedOn)} αγγελίες ${r.modelName} με χρονιά ${year - 2} έως ${year + 2}` +
            (r.confidence === 'low' ? '. Λίγα στοιχεία, η εκτίμηση είναι χοντρική.' : '.')}{' '}
        Οι αγγελίες δείχνουν ζητούμενες τιμές. Η τελική τιμή πώλησης είναι συνήθως λίγο χαμηλότερη.
      </p>
    </section>
  );
}

export default CheckPage;

// Keep the page scrolled to the top when it opens.
export function useScrollTop() {
  useEffect(() => window.scrollTo(0, 0), []);
}
