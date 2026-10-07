import { existsSync } from 'node:fs';
import { createServer, preview } from 'vite';

const parsedPort = Number.parseInt(process.env.PORT || '', 10);
const port = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 3000;
const host = '0.0.0.0';
const disableHmr = process.env.DISABLE_HMR === 'true';
const useBuiltFiles = process.env.NODE_ENV === 'production' && existsSync('dist/index.html');

try {
  if (useBuiltFiles) {
    const server = await preview({
      preview: { host, port, strictPort: true }
    });
    server.printUrls();
    console.log(`[CarCheck] Production preview listening on ${host}:${port}`);
  } else {
    const server = await createServer({
      server: {
        host,
        port,
        strictPort: true,
        hmr: disableHmr ? false : undefined,
        watch: disableHmr ? null : undefined
      },
      appType: 'spa'
    });
    await server.listen();
    server.printUrls();
    console.log(`[CarCheck] Development server listening on ${host}:${port}`);
  }
} catch (error) {
  console.error('[CarCheck] Failed to start:', error);
  process.exitCode = 1;
}
