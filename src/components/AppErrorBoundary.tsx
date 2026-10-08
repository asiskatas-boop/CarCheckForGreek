import React from 'react';

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('[CarCheck] Unhandled render error:', error);
  }

  render() {
    if (this.state.hasError) {
      // The app may have crashed before rendering, so read the language App last set.
      const isGreek = typeof document === 'undefined' || document.documentElement.lang !== 'en';
      return (
        <main className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-text)] px-5 py-16">
          <section className="mx-auto max-w-xl surface-card p-6 sm:p-8">
            <p className="text-[13px] font-semibold text-[var(--color-accent-text)]" translate="no">CarCheck</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              {isGreek ? 'Η εφαρμογή δεν μπόρεσε να φορτώσει σωστά' : 'CarCheck couldn’t load properly'}
            </h1>
            <p className="mt-3 text-[15px] text-[var(--color-text-muted)]">
              {isGreek
                ? 'Δοκίμασε να ανανεώσεις τη σελίδα. Αν το πρόβλημα παραμένει, τα αποθηκευμένα δεδομένα του προγράμματος περιήγησης μπορεί να μην είναι συμβατά με τη νέα έκδοση. Η επαναφορά διαγράφει τα αποθηκευμένα οχήματα, τις σημειώσεις και τις προτιμήσεις σου.'
                : 'Try reloading the page. If the problem continues, data saved in your browser may not match the new version. Resetting deletes your saved cars, notes, and preferences.'}
            </p>
            <button
              type="button"
              onClick={() => {
                try {
                  Object.keys(window.localStorage)
                    .filter((key) => key.startsWith('carcheck_'))
                    .forEach((key) => window.localStorage.removeItem(key));
                } catch {
                  // Reload still helps if storage is unavailable.
                }
                window.location.reload();
              }}
              className="mt-5 min-h-11 rounded-full bg-[var(--color-accent)] px-5 text-[15px] font-semibold text-white"
            >
              {isGreek ? 'Επαναφορά αποθηκευμένων δεδομένων και ανανέωση' : 'Reset Saved Data and Reload'}
            </button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}
