import { lazy, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AppErrorBoundary } from './components/AppErrorBoundary.tsx';
import './index.css';

// ChekCAReto price check lives at #check and #data; everything else is the existing app.
const CheckApp = lazy(() => import('./check/CheckApp.tsx'));
const checkRoute = (h: string): 'check' | 'data' | null => (h.startsWith('#data') ? 'data' : h.startsWith('#check') ? 'check' : null);

function Root() {
  const [route, setRoute] = useState(() => checkRoute(window.location.hash));
  useEffect(() => {
    const on = () => setRoute(checkRoute(window.location.hash));
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  if (route) {
    return (
      <Suspense fallback={null}>
        <CheckApp route={route} />
      </Suspense>
    );
  }
  return <App />;
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('CarCheck root element was not found.');
}

createRoot(rootElement).render(

    <AppErrorBoundary>
      <Root />
    </AppErrorBoundary>

);
