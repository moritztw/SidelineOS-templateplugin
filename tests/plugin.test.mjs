import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import zlib from 'node:zlib';

const ROOT_DIR = path.resolve(import.meta.dirname, '..');

const RESERVIERTE_PLUGIN_IDS = new Set([
  'hub',
  'settings',
  'settings-hub',
  'team-settings',
  'sysadmin',
  'invite',
  'share',
  'auth',
  'login',
  'api',
  'plugins',
]);

const GUELTIGE_PERMISSIONS = new Set([
  'team:read',
  'team:roster-read',
  's3:team-rw',
  's3:cleanup-queue',
  'db:plugin-tables',
  'share:public-links',
  'notifications:send',
  'notifications:channel',
]);

const GUELTIGE_ICONS = new Set([
  'film',
  'book-open',
  'clipboard-check',
  'layers',
  'puzzle',
]);

test('plugin.manifest.json erfüllt alle Validierungsregeln von SidelineOS-Core (dev)', async () => {
  const raw = await fs.readFile(path.join(ROOT_DIR, 'plugin.manifest.json'), 'utf8');
  const manifest = JSON.parse(raw);

  assert.match(manifest.id, /^[a-z0-9][a-z0-9-]{1,46}[a-z0-9]$/);
  assert.equal(RESERVIERTE_PLUGIN_IDS.has(manifest.id), false);
  assert.ok(manifest.name.trim().length > 0);
  assert.match(manifest.version, /^\d+\.\d+\.\d+/);
  assert.equal(manifest.sdkVersion, '1.0');
  assert.match(manifest.minCoreVersion, /^\d+\.\d+\.\d+/);
  assert.match(manifest.dbPrefix, /^mod_[a-z0-9_]+_$/);
  assert.ok(GUELTIGE_ICONS.has(manifest.icon));
  assert.ok(manifest.status === 'AKTIV' || manifest.status === 'VORSCHAU');
  assert.equal(typeof manifest.standardAktiviert, 'boolean');
  assert.ok(Array.isArray(manifest.permissions));
  for (const perm of manifest.permissions) {
    assert.ok(GUELTIGE_PERMISSIONS.has(perm), `Unbekannte Permission: ${perm}`);
  }
  assert.equal(typeof manifest.settingsAnker, 'object');
  assert.match(manifest.repositoryUrl, /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/);
});

test('dist/client.js ist ein gültiges ESM-Bundle mit Core-ImportMap-Externals und semantischen sl-Tokens', async () => {
  const bundleCode = await fs.readFile(path.join(ROOT_DIR, 'dist/client.js'), 'utf8');

  assert.match(bundleCode, /from\s+["']@sidelineos\/plugin-sdk["']/);
  assert.match(bundleCode, /from\s+["']react\/jsx-runtime["']/);
  assert.doesNotMatch(bundleCode, /dangerouslySetInnerHTML/);
  assert.doesNotMatch(bundleCode, /\b(?:bg|text|border)-slate-\d+/);
  assert.match(bundleCode, /\bbg-sl-surface\b/);
  assert.match(bundleCode, /\bbg-sl-canvas\b/);
  assert.match(bundleCode, /\bborder-sl-border\b/);
  assert.match(bundleCode, /\btext-sl-heading\b/);
  assert.match(bundleCode, /\btext-sl-primary\b/);
  assert.match(bundleCode, /\btext-sl-muted\b/);
  assert.match(bundleCode, /export\s*\{[\s\S]*default[\s\S]*\}/);
});

test('src/sdk.d.ts bildet die SDK-Erweiterungen aus Core Issue #13 (PR1–PR3) ab', async () => {
  const sdkTypes = await fs.readFile(path.join(ROOT_DIR, 'src/sdk.d.ts'), 'utf8');

  assert.match(sdkTypes, /hideHubTile\?:\s*boolean/);
  assert.match(sdkTypes, /themes\?:\s*PluginThemePreset\[\]/);
  assert.match(sdkTypes, /preferredTheme\?:\s*string/);
  assert.match(sdkTypes, /interface PluginProviderKontext/);
  assert.match(sdkTypes, /interface PluginProviderProps/);
  assert.match(sdkTypes, /SIDELINE_CSS_TOKENS/);
});

test('Release-Packaging erzeugt valides USTAR .tar.gz ohne Symlinks oder Pfad-Traversal', async () => {
  const { erzeugeTarGzBuffer } = await import(path.join(ROOT_DIR, 'scripts/pack.mjs'));
  const manifestBuf = await fs.readFile(path.join(ROOT_DIR, 'plugin.manifest.json'));
  const clientBuf = await fs.readFile(path.join(ROOT_DIR, 'dist/client.js'));

  const gz = erzeugeTarGzBuffer({
    'plugin.manifest.json': manifestBuf,
    'dist/client.js': clientBuf,
  });

  const sha = crypto.createHash('sha256').update(gz).digest('hex');
  assert.match(sha, /^[a-f0-9]{64}$/);

  const tar = zlib.gunzipSync(gz);
  const eintraege = [];
  let offset = 0;

  while (offset + 512 <= tar.length) {
    const header = tar.subarray(offset, offset + 512);
    offset += 512;
    if (header.every((b) => b === 0)) break;

    const name = header.subarray(0, 100).toString('utf8').replace(/\0.*$/, '');
    const size = Number.parseInt(
      header.subarray(124, 136).toString('utf8').replace(/\0.*$/, '').trim(),
      8
    );
    const typeflag = String.fromCharCode(header[156]);
    assert.equal(typeflag, '0');
    assert.equal(name.includes('..'), false);
    assert.equal(name.startsWith('/'), false);

    eintraege.push(name);
    offset += Math.ceil(size / 512) * 512;
  }

  assert.deepEqual(eintraege, ['plugin.manifest.json', 'dist/client.js']);
});

test('Release-Workflow installiert ohne Peer-Resolution-Fehler (--legacy-peer-deps)', async () => {
  const workflow = await fs.readFile(
    path.join(ROOT_DIR, '.github/workflows/release.yml'),
    'utf8'
  );
  assert.match(workflow, /npm ci --legacy-peer-deps/);
  assert.match(workflow, /npm install --legacy-peer-deps/);
});
