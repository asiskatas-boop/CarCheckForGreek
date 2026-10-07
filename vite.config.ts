import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const parsedPort = Number.parseInt(process.env.PORT || '', 10);
const port = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 3000;
const disableHmr = process.env.DISABLE_HMR === 'true';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port,
    strictPort: true,
    hmr: disableHmr ? false : undefined,
    watch: disableHmr ? null : undefined
  },
  preview: {
    host: '0.0.0.0',
    port,
    strictPort: true
  }
});
