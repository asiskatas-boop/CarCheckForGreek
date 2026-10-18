import { useEffect, useState } from 'react';
import type { PriceIndex } from '../pricing/engine.ts';
import { CheckPage } from './CheckPage.tsx';
import { DataPage } from './DataPage.tsx';
import { loadPriceIndex, type IndexSource } from './priceIndex.ts';
import './check.css';

export function CheckApp({ route }: { route: 'check' | 'data' }) {
  const [index, setIndex] = useState<PriceIndex | null>(null);
  const [from, setFrom] = useState<IndexSource | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    document.documentElement.lang = 'el';
    document.title = route === 'data' ? 'Δεδομένα τιμών · ChekCAReto' : 'ChekCAReto · Είναι καλή η τιμή;';
  }, [route]);

  useEffect(() => {
    let live = true;
    loadPriceIndex().then((r) => {
      if (!live) return;
      setIndex(r?.index ?? null);
      setFrom(r?.from ?? null);
    });
    return () => {
      live = false;
    };
  }, [reload]);

  return (
    <div className="cc">
      <a className="cc-skip" href="#cc-main">
        Μετάβαση στο περιεχόμενο
      </a>
      <header className="cc-top">
        <a href="#check" className="cc-logo" aria-label="ChekCAReto, αρχική">
          <span className="cc-mark" aria-hidden="true">
            ✓
          </span>
          ChekCAReto
        </a>
        <nav aria-label="Κύριο μενού">
          <a href="#check" aria-current={route === 'check' ? 'page' : undefined}>
            Έλεγχος τιμής
          </a>
          <a href="#data" aria-current={route === 'data' ? 'page' : undefined}>
            Δεδομένα
          </a>
        </nav>
      </header>
      <main id="cc-main">
        {route === 'check' ? (
          <CheckPage index={index} from={from} />
        ) : (
          <DataPage
            onIndex={(i) => {
              if (i) {
                setIndex(i);
                setFrom('local');
              } else setReload((n) => n + 1);
            }}
          />
        )}
      </main>
    </div>
  );
}

export default CheckApp;
