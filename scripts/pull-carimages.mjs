import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const profilesPath = path.join(root, 'data-import', 'carimages-profiles.json');
const outputDir = path.join(root, 'public', 'carimages');
const manifestPath = path.join(root, 'src', 'data', 'carImages.generated.ts');
const manifestUrl = 'https://carimages.org/media/data/carimages-rights-latest.csv';

const normalize = (value = '') => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const bool = (value) => ['1', 'true', 'yes', 'y'].includes(String(value ?? '').trim().toLowerCase());

function forEachCsvRow(text, callback) {
  let row = [];
  let field = '';
  let quoted = false;
  let headers = null;

  const emitField = () => {
    row.push(field);
    field = '';
  };

  const emitRow = () => {
    if (!headers) {
      headers = row.map((value) => value.trim());
    } else if (row.some((value) => value.length > 0)) {
      const record = {};
      headers.forEach((header, index) => { record[header] = row[index] ?? ''; });
      callback(record);
    }
    row = [];
  };

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      emitField();
    } else if (char === '\n') {
      emitField();
      emitRow();
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (field.length || row.length) {
    emitField();
    emitRow();
  }
}

const includesAll = (haystack, values = []) => values.every((value) => haystack.includes(normalize(value)));
const includesAny = (haystack, values = []) => values.length === 0 || values.some((value) => haystack.includes(normalize(value)));

function scoreCandidate(record, profile) {
  if (record.allows_derivatives && !bool(record.allows_derivatives)) return Number.NEGATIVE_INFINITY;

  const haystack = normalize([
    record.source_filename,
    record.carimages_url,
    record.source_page_url,
    record.credit_text
  ].join(' '));

  if (!includesAll(haystack, profile.required)) return Number.NEGATIVE_INFINITY;
  if (!includesAny(haystack, profile.generationAny)) return Number.NEGATIVE_INFINITY;
  if (!includesAny(haystack, profile.requiredAny)) return Number.NEGATIVE_INFINITY;

  // Avoid the common bad-card choices even if the filename technically matches.
  const rejectedViews = ['interior', 'engine bay', 'badge', 'wheel', 'headlight', 'taillight', 'rear view', 'rear'];
  if (rejectedViews.some((value) => haystack.includes(value))) return Number.NEGATIVE_INFINITY;

  let score = 100;
  const code = String(record.license_code ?? '').toUpperCase();
  if (code.includes('CC0') || code.includes('PUBLIC')) score += 40;
  else if (code.includes('CC BY')) score += 20;

  if (!bool(record.attribution_required)) score += 10;

  const width = Number(record.width || 0);
  const height = Number(record.height || 0);
  if (width >= 1600) score += 12;
  else if (width >= 1200) score += 8;
  else if (width >= 900) score += 4;
  if (height > 0 && width / height >= 1.25) score += 8;

  for (const preferred of profile.preferred ?? []) {
    if (haystack.includes(normalize(preferred))) score += 6;
  }
  if (haystack.includes('front')) score += 8;
  if (haystack.includes('three quarter') || haystack.includes('3 4')) score += 5;

  return score;
}

const escapeTs = (value = '') => JSON.stringify(String(value));

async function resolveCarImagesAsset(record) {
  const pageUrl = record.carimages_url?.trim();
  if (pageUrl) {
    try {
      const pageResponse = await fetch(pageUrl, { headers: { 'user-agent': 'CarCheck image importer/1.0' } });
      if (pageResponse.ok) {
        const html = await pageResponse.text();
        const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
          ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
        if (match?.[1]) return match[1];
      }
    } catch {
      // Fall through to the original Wikimedia asset URL from the rights manifest.
    }
  }
  return record.source_url?.trim() || null;
}

function extensionFor(contentType, url) {
  const type = String(contentType ?? '').toLowerCase();
  if (type.includes('webp')) return 'webp';
  if (type.includes('png')) return 'png';
  if (type.includes('avif')) return 'avif';
  if (type.includes('jpeg') || type.includes('jpg')) return 'jpg';
  const pathname = new URL(url).pathname.toLowerCase();
  const ext = pathname.match(/\.(webp|png|avif|jpe?g)$/)?.[1];
  if (ext === 'jpeg') return 'jpg';
  return ext || 'jpg';
}

async function downloadImage(url, vehicleId) {
  const response = await fetch(url, { headers: { 'user-agent': 'CarCheck image importer/1.0' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) throw new Error(`Expected image, got ${contentType || 'unknown content type'}`);
  const extension = extensionFor(contentType, url);
  const filename = `${vehicleId}.${extension}`;
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join(outputDir, filename), buffer);
  return `carimages/${filename}`;
}

const profiles = JSON.parse(await readFile(profilesPath, 'utf8'));
const activeProfiles = profiles.filter((profile) => !profile.disabled);
const selected = new Map(activeProfiles.map((profile) => [profile.vehicleId, { profile, score: Number.NEGATIVE_INFINITY, record: null }]));

console.log(`Downloading CarImages rights manifest: ${manifestUrl}`);
const response = await fetch(manifestUrl, { headers: { 'user-agent': 'CarCheck image importer/1.0' } });
if (!response.ok) throw new Error(`Could not download CarImages manifest: HTTP ${response.status}`);
const csvText = await response.text();

forEachCsvRow(csvText, (record) => {
  for (const entry of selected.values()) {
    const score = scoreCandidate(record, entry.profile);
    if (score > entry.score) {
      entry.score = score;
      entry.record = record;
    }
  }
});

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

const manifest = {};
for (const profile of profiles) {
  if (profile.disabled) {
    console.log(`SKIP ${profile.vehicleId}: ${profile.reason}`);
    continue;
  }

  const selection = selected.get(profile.vehicleId);
  if (!selection?.record || !Number.isFinite(selection.score)) {
    console.warn(`MISS ${profile.vehicleId}: no safe non-ShareAlike match found`);
    continue;
  }

  const record = selection.record;
  try {
    const remoteUrl = await resolveCarImagesAsset(record);
    if (!remoteUrl) throw new Error('No downloadable image URL in selected row');
    const src = await downloadImage(remoteUrl, profile.vehicleId);
    manifest[profile.vehicleId] = {
      src,
      carImagesUrl: record.carimages_url || 'https://carimages.org/',
      sourcePageUrl: record.source_page_url || record.carimages_url || 'https://carimages.org/',
      creatorName: record.creator_name || 'Unknown photographer',
      creatorUrl: record.creator_url || undefined,
      creditText: record.credit_text || `${record.creator_name || 'Photographer'} / Wikimedia Commons / ${record.license_code || record.license_name || 'Creative Commons'}`,
      licenseCode: record.license_code || record.license_name || 'Creative Commons',
      licenseName: record.license_name || record.license_code || 'Creative Commons',
      licenseUrl: record.license_url || 'https://carimages.org/licensing/',
      attributionRequired: bool(record.attribution_required),
      photoId: record.photo_id || ''
    };
    console.log(`OK   ${profile.vehicleId}: ${record.credit_text || record.source_filename}`);
  } catch (error) {
    console.warn(`MISS ${profile.vehicleId}: ${error.message}`);
  }
}

const ts = `// Generated by \`npm run images:pull\` from the CarImages rights manifest.\n// Do not hand-edit; rerun the importer instead.\n\nexport interface CarImageRecord {\n  src: string;\n  carImagesUrl: string;\n  sourcePageUrl: string;\n  creatorName: string;\n  creatorUrl?: string;\n  creditText: string;\n  licenseCode: string;\n  licenseName: string;\n  licenseUrl: string;\n  attributionRequired: boolean;\n  photoId: string;\n}\n\nexport const CAR_IMAGE_MANIFEST: Record<string, CarImageRecord> = ${JSON.stringify(manifest, null, 2)};\n`;
await writeFile(manifestPath, ts, 'utf8');

console.log(`\nSaved ${Object.keys(manifest).length} images to public/carimages/`);
console.log(`Generated ${path.relative(root, manifestPath)}`);
console.log('CarImages licences are preserved per image. CC BY-SA images remain unmodified and keep their required attribution/licence links.');
