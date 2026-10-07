import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AppErrorBoundary } from './components/AppErrorBoundary.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('CarCheck root element was not found.');
}

createRoot(rootElement).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);
