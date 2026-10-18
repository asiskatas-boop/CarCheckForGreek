import { useState } from 'react';
import { importCsv, type ImportReport, type Listing } from '../pricing/importer.ts';
import { buildIndex, type PriceIndex } from '../pricing/engine.ts';
import { clearLocalIndex, num, saveLocalIndex } from './priceIndex.ts';

const FIELD_LABEL: Record<string, string> = {
  id: 'Κωδικός αγγελίας', url: 'Σύνδεσμος', make: 'Μάρκα', model: 'Μοντέλο', version: 'Έκδοση', year: 'Χρονιά', km: 'Χιλιόμετρα',
  price: 'Τιμή', fuel: 'Καύσιμο', gearbox: 'Κιβώτιο', cc: 'Κυβικά', hp: 'Ίπποι', body: 'Αμάξωμα', region: 'Περιοχή',
  seller: 'Ιδιώτης ή έμπορος', origin: 'Ελληνικό ή εισαγωγής', seenAt: 'Ημερομηνία', source: 'Πηγή', sold: 'Πουλήθηκε',
};
const REQUIRED = ['make', 'model', 'year', 'price'];
const IMPORTANT = ['km', 'fuel', 'gearbox', 'origin', 'id'];

export function DataPage({ onIndex }: { onIndex: (i: PriceIndex | null) => void }) {
  const [reports, setReports] = useState<ImportReport[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [index, setIndex] = useState<PriceIndex | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setSaved(null);
    const reps: ImportReport[] = [];
    const all: Listing[] = [];
    for (const f of Array.from(files)) {
      const text = await f.text();
      const source = /collector|chekcareto|facebook|fb/i.test(f.name) ? 'facebook' : 'car.gr';
      const { listings: ls, report } = importCsv(text, { file: f.name, source });
      reps.push(report);
      all.push(...ls);
    }
    setReports(reps);
    setListings(all);
    setIndex(all.length >= 30 ? buildIndex(all) : null);
    setBusy(false);
  }

  function download() {
    if (!index) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(index)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'price-index.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  const top = index ? Object.values(index.models).sort((a, b) => b.n - a.n) : [];

  return (
    <div className="cc-page">
      <section className="cc-hero">
        <h1>Δεδομένα τιμών</h1>
        <p className="cc-lead">
          Βάλε εδώ τα CSV από τον scraper του car.gr ή από την επέκταση. Θα δεις τι διαβάστηκε, τι πετάχτηκε και γιατί, και τις τιμές που βγαίνουν. Τα αρχεία μένουν
          στον υπολογιστή σου, δεν ανεβαίνουν πουθενά.
        </p>
        <p className="cc-note">
          Η μορφή που περιμένουμε: <a href={`${import.meta.env.BASE_URL}cargr-template.csv`} download>πρότυπο CSV</a>. Δεχόμαστε και ελληνικές επικεφαλίδες, «;» ή «,» και
          τιμές όπως «8.500 €».
        </p>
      </section>

      <label className="cc-drop">
        <input type="file" accept=".csv,text/csv" multiple onChange={(e) => onFiles(e.target.files)} />
        <span className="cc-btn cc-btn-primary">Επιλογή αρχείων CSV</span>
        <span className="cc-note">ή σύρε τα εδώ</span>
      </label>
      {busy && <p className="cc-note" role="status">Διαβάζω…</p>}

      {reports.map((r) => {
        const droppedTotal = Object.values(r.dropped).reduce((s, n) => s + n, 0);
        return (
          <section key={r.file} className="cc-result">
            <p className="cc-kicker">{r.file}</p>
            <h2>
              {num(r.kept)} από {num(r.rows)} γραμμές χρησιμοποιήθηκαν
            </h2>
            <h3>Στήλες</h3>
            <ul className="cc-cols">
              {[...REQUIRED, ...IMPORTANT].map((k) => (
                <li key={k} className={r.columns[k] ? 'ok' : REQUIRED.includes(k) ? 'bad' : 'warn'}>
                  <span>{FIELD_LABEL[k]}</span>
                  <span>{r.columns[k] ? `«${r.columns[k]}»` : REQUIRED.includes(k) ? 'λείπει, χρειάζεται' : 'λείπει'}</span>
                </li>
              ))}
            </ul>
            {r.unknownHeaders.length > 0 && <p className="cc-note">Αγνοήθηκαν: {r.unknownHeaders.join(', ')}</p>}
            {droppedTotal > 0 && (
              <>
                <h3>Γραμμές που πετάχτηκαν</h3>
                <ul className="cc-factors">
                  {Object.entries(r.dropped).map(([reason, n]) => (
                    <li key={reason}>
                      <span>
                        {reason}
                        <small className="cc-example">π.χ. {r.examples[reason]?.[0]}</small>
                      </span>
                      <span>{num(n)}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {Object.keys(r.missing).length > 0 && (
              <p className="cc-note">
                Κράτησα αλλά λείπει:{' '}
                {Object.entries(r.missing)
                  .map(([k, n]) => `${FIELD_LABEL[k] || k} σε ${num(n)}`)
                  .join(', ')}
                .
              </p>
            )}
          </section>
        );
      })}

      {reports.length > 0 && !index && <p className="cc-banner">Χρειάζονται τουλάχιστον 30 αγγελίες για να βγουν τιμές.</p>}

      {index && (
        <section className="cc-result">
          <p className="cc-kicker">Δείκτης τιμών</p>
          <h2>
            {num(Object.keys(index.models).length)} μοντέλα από {num(index.total)} αγγελίες
          </h2>
          <p className="cc-note">
            Μέση πτώση αξίας ανά χρόνο: {Math.round((1 - Math.exp(index.slopes.age)) * 100)}%. Αυτόματο κιβώτιο: {index.slopes.auto >= 0 ? '+' : '−'}
            {Math.abs(Math.round((Math.exp(index.slopes.auto) - 1) * 100))}%. Εισαγωγής: {index.slopes.imported >= 0 ? '+' : '−'}
            {Math.abs(Math.round((Math.exp(index.slopes.imported) - 1) * 100))}%.
          </p>
          <div className="cc-table-wrap">
            <table className="cc-table">
              <thead>
                <tr>
                  <th scope="col">Μοντέλο</th>
                  <th scope="col">Αγγελίες</th>
                  <th scope="col">Χρονιές</th>
                </tr>
              </thead>
              <tbody>
                {top.slice(0, 40).map((m) => {
                  const ys = Object.keys(m.years).map(Number);
                  return (
                    <tr key={m.make + m.model}>
                      <td>
                        {m.make} {m.model}
                      </td>
                      <td>{num(m.n)}</td>
                      <td>
                        {Math.min(...ys)} έως {Math.max(...ys)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {top.length > 40 && <p className="cc-note">και άλλα {num(top.length - 40)} μοντέλα.</p>}
          <div className="cc-actions">
            <button
              type="button"
              className="cc-btn cc-btn-primary"
              onClick={() => {
                const ok = saveLocalIndex(index);
                onIndex(index);
                setSaved(ok ? 'Η σελίδα «Έλεγχος τιμής» χρησιμοποιεί τώρα αυτές τις τιμές, μόνο σε αυτόν τον browser.' : 'Δεν χωράει στον browser. Κατέβασε το αρχείο αντί γι’ αυτό.');
              }}
            >
              Δοκίμασέ το στον έλεγχο τιμής
            </button>
            <button type="button" className="cc-btn cc-btn-secondary" onClick={download}>
              Λήψη price-index.json
            </button>
          </div>
          {saved && (
            <p className="cc-note" role="status">
              {saved} <a href="#check">Πήγαινε στον έλεγχο</a>
            </p>
          )}
          <p className="cc-note">Το price-index.json έχει μόνο μέσους όρους και πλήθη, όχι αγγελίες, οπότε μπορεί να ανέβει δημόσια στο site.</p>
        </section>
      )}

      <p className="cc-note">
        <button
          type="button"
          className="cc-link"
          onClick={() => {
            clearLocalIndex();
            onIndex(null);
            setSaved('Επέστρεψες στις τιμές του site.');
          }}
        >
          Επαναφορά στις τιμές του site
        </button>
        {listings.length > 0 && ` · ${num(listings.length)} αγγελίες φορτωμένες`}
      </p>
    </div>
  );
}

export default DataPage;
