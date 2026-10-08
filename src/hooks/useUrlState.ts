import { useEffect, useState } from 'react';

/**
 * Filters live in the hash query (e.g. #vehicles?fuel=Hybrid) so a filtered view
 * survives reloads and can be shared. Updates use replaceState so typing does not
 * add a history entry per keystroke.
 */
const readParams = () => new URLSearchParams(window.location.hash.split('?')[1] ?? '');

export function useUrlParam(key: string, fallback: string): [string, (value: string) => void] {
  const [value, setValue] = useState<string>(() => (typeof window === 'undefined' ? fallback : readParams().get(key) ?? fallback));

  const update = (next: string) => {
    setValue(next);
    const [base] = window.location.hash.split('?');
    const params = readParams();
    if (next === fallback || next === '') params.delete(key);
    else params.set(key, next);
    const query = params.toString();
    window.history.replaceState(window.history.state, '', `${base}${query ? `?${query}` : ''}`);
  };

  return [value, update];
}

/** Returns `value` after it has stopped changing for `delay` ms (used for polite live-region counts). */
export function useDebouncedValue<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
