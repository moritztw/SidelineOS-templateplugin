# SIdelineOS-templateplugin

Minimales, funktionsfreies Plugin-Template für **[SidelineOS-Core (`dev`)](https://github.com/moritztw/SidelineOS-core/tree/dev)**.
Es erfüllt alle SDK- (`v1.0`), Manifest- und Bundle-Anforderungen, damit es direkt installiert werden kann und als Kopiervorlage für neue Fachmodule dient.

## Struktur

```text
├── .github/workflows/release.yml   # Release-Bundle (sideline-plugin-v1.tar.gz + .sha256)
├── LICENSE                         # GNU AGPLv3
├── plugin.manifest.json            # Deklaratives Manifest (Single Source of Truth)
├── scripts/
│   ├── build.mjs                   # esbuild -> dist/client.js (mit ImportMap-Externals)
│   └── pack.mjs                    # USTAR .tar.gz + .sha256 -> build-release/
├── src/
│   ├── sdk.d.ts                    # Lokale Typ-Verträge (SidelineOS-core/dev SDK v1.0)
│   └── client.tsx                  # Minimaler SidelinePlugin-Export (Platzhalter-View)
└── tests/
    └── plugin.test.mjs             # Contract-Tests (node:test)
```

## Lokale Entwicklung & Prüfung

```bash
npm install --legacy-peer-deps
npm run lint        # TypeScript-Prüfung (tsc --noEmit)
npm test            # Build + Contract-Tests (node:test)
npm run pack:plugin # Erzeugt build-release/sideline-plugin-v1.tar.gz + .sha256
```

## Installation in SidelineOS-Core (`dev`)

1. **Dev-Modus (`DEV_ALLOW_GIT_INSTALL=true`):**
   Im Sysadmin-Plugin-Store unter *Dev: Git Clone & Build* `https://github.com/moritztw/SIdelineOS-templateplugin` und Branch `main` (bzw. `dev`) angeben.
2. **Offline-Upload:**
   `npm run pack:plugin` ausführen und `build-release/sideline-plugin-v1.tar.gz` (optional samt SHA-256) im Plugin-Store hochladen.
3. **GitHub Release:**
   Tag pushen (`git tag v0.1.0 && git push origin v0.1.0`) — die GitHub Action veröffentlicht `sideline-plugin-v1.tar.gz`, `.sha256` und `plugin.manifest.json`.

## Neues Plugin aus diesem Template ableiten

1. `plugin.manifest.json` anpassen: `id`, `name`, `kurzbeschreibung`, `dbPrefix` (`mod_<slug>_`), `repositoryUrl`, `permissions`.
2. In `src/client.tsx` Tabs, `PrimaerAktion` und Views ergänzen.
3. Bei Bedarf Backend (`src/server.ts` -> `dist/server.js`) und `migrations/*.sql` hinzufügen.

## Lizenz

GNU Affero General Public License v3.0 (AGPLv3) — siehe `LICENSE`.
