import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';

const LIMITS = {
  initialJavaScript: 200_000,
  initialCss: 35_000,
  singleInitialScript: 100_000,
};

const clientRoot = path.resolve('dist/client');
const rscManifestPath = path.resolve('dist/server/__vite_rsc_assets_manifest.js');
const rscSource = await readFile(rscManifestPath, 'utf8');
const rscManifest = JSON.parse(
  rscSource.replace(/^export default\s+/, '').replace(/;?\s*$/, ''),
);
const files = new Set();

function addAsset(asset) {
  if (typeof asset !== 'string' || !asset.trim()) {
    throw new Error('RSC asset manifest contains an invalid asset path.');
  }
  files.add(asset.replace(/^\//, ''));
}

const clientReferences = Object.values(rscManifest.clientReferenceDeps ?? {});
const serverResources = Object.values(rscManifest.serverResources ?? {});
if (
  !rscManifest.bootstrapScriptContent ||
  !clientReferences.length ||
  !rscManifest.serverResources ||
  !serverResources.length ||
  !rscManifest.serverResources['app/layout.tsx']
) {
  throw new Error(
    'RSC asset manifest is missing the bootstrap, client references, or layout server resources.',
  );
}

const bootstrapMatch = rscManifest.bootstrapScriptContent.match(/import\(["']\/(.*?)["']\)/);
if (!bootstrapMatch) throw new Error('Unable to resolve the client bootstrap script.');
addAsset(bootstrapMatch[1]);

for (const record of [...clientReferences, ...serverResources]) {
  for (const asset of [...(record.js ?? []), ...(record.css ?? [])]) addAsset(asset);
}

const sizes = [];
for (const file of [...files].sort()) {
  let content;
  try {
    content = await readFile(path.join(clientRoot, file));
  } catch {
    throw new Error(`Initial asset is missing from the client build: ${file}`);
  }
  sizes.push({
    file,
    raw: content.byteLength,
    gzip: gzipSync(content).byteLength,
  });
}

const scripts = sizes.filter(({ file }) => file.endsWith('.js'));
const styles = sizes.filter(({ file }) => file.endsWith('.css'));
const initialJavaScript = scripts.reduce((sum, item) => sum + item.gzip, 0);
const initialCss = styles.reduce((sum, item) => sum + item.gzip, 0);
const singleInitialScript = Math.max(0, ...scripts.map((item) => item.gzip));

console.table(sizes);
console.table({
  initialJavaScript: {
    actual: initialJavaScript,
    limit: LIMITS.initialJavaScript,
  },
  initialCss: { actual: initialCss, limit: LIMITS.initialCss },
  singleInitialScript: {
    actual: singleInitialScript,
    limit: LIMITS.singleInitialScript,
  },
});

const violations = [
  ['Initial JavaScript', initialJavaScript, LIMITS.initialJavaScript],
  ['Initial CSS', initialCss, LIMITS.initialCss],
  ['Largest initial script', singleInitialScript, LIMITS.singleInitialScript],
].filter(([, actual, limit]) => actual > limit);

if (violations.length) {
  for (const [label, actual, limit] of violations) {
    console.error(`${label}: ${actual} bytes exceeds ${limit} byte gzip budget.`);
  }
  process.exit(1);
}
