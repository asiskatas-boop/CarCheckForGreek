import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pullScript = path.join(__dirname, 'pull-carimages.mjs');

const child = spawn(process.execPath, [pullScript], { stdio: 'inherit' });
child.on('error', (error) => {
  console.warn(`CarImages preparation skipped: ${error.message}`);
  process.exit(0);
});
child.on('exit', (code) => {
  if (code && code !== 0) {
    console.warn('CarImages preparation could not reach the image source. Continuing the app build with safe placeholders.');
  }
  process.exit(0);
});
