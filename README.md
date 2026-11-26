# SIdelineOS-templateplugin

Minimales, funktionsfreies Plugin-Template für **[SidelineOS-Core](https://github.com/moritztw/SidelineOS-core)** (SDK `v1.0`, kompatibel mit dem Semantik-Token-, Headless-Provider- und Theme-Stand).
Es erfüllt alle Manifest-, SDK- und Bundle-Anforderungen, damit es direkt installiert werden kann und als Kopiervorlage für neue Fachmodule, Headless-/Settings-Plugins oder Theme-Pakete dient.

## Struktur

```text
├── .github/workflows/release.yml   # Release-Bundle (sideline-plugin-v1.tar.gz + .sha256)
├── LICENSE                         # GNU AGPLv3
├── plugin.manifest.json            # Deklaratives Manifest (Single Source of Truth)
├── scripts/
│   ├── build.mjs                   # esbuild -> dist/client.js (mit ImportMap-Externals)
│   └── pack.mjs                    # USTAR .tar.gz + .sha256 -> build-release/
├── src/
│   ├── sdk.d.ts                    # Lokale Typ-Verträge (@sidelineos/plugin-sdk v1.0)
│   └── client.tsx                  # Minimaler SidelinePlugin-Export mit sl-*-Design-Tokens
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

> **Hinweis zu `@sidelineos/plugin-sdk`:** Das SDK wird vom Core zur Laufzeit über die Browser-ImportMap bereitgestellt. Falls ein lokales Core-Checkout existiert (`npm run build:sdk`), lässt sich alternativ auch das Release-Archiv `sidelineos-plugin-sdk-1.0.0.tgz` bzw. `npm link ../SidelineOS-core/packages/plugin-sdk` verwenden; für CI und eigenständige Repos liefert `src/sdk.d.ts` alle Typen direkt mit.

## Installation in SidelineOS-Core

1. **GitHub Release (Produktion):**
   Tag pushen (`git tag v0.2.0 && git push origin v0.2.0`) — die GitHub Action veröffentlicht `sideline-plugin-v1.tar.gz`, `.sha256` und `plugin.manifest.json`, die im Sysadmin-Plugin-Store direkt über die Repo-URL installiert werden können.
2. **Offline-Upload:**
   `npm run pack:plugin` ausführen und `build-release/sideline-plugin-v1.tar.gz` (optional samt `.sha256`) im Plugin-Store hochladen.
3. **Dev-Modus (`DEV_ALLOW_GIT_INSTALL=true`):**
   Im Sysadmin-Plugin-Store unter *Dev: Git Clone & Build* `https://github.com/moritztw/SIdelineOS-templateplugin` und den gewünschten Branch (z. B. `main`) angeben. Updates lassen sich anschließend direkt über den *Git Pull*-Button im Store nachziehen.

## Neues Plugin aus diesem Template ableiten

1. `plugin.manifest.json` anpassen: `id`, `name`, `kurzbeschreibung`, `dbPrefix` (`mod_<slug>_`), `repositoryUrl`, `permissions`.
2. In `src/client.tsx` Tabs, `PrimaerAktion` und Views ergänzen — dabei für alle UI-Flächen die semantischen Core-Tokens (`bg-sl-surface`, `bg-sl-canvas`, `border-sl-border`, `text-sl-heading`, `text-sl-primary`, `text-sl-muted`, `bg-sl-accent`, `text-sl-accent-contrast`, …) verwenden.
3. **Für Headless- oder Theme-Plugins (optional):**
   - Im Manifest `"hideHubTile": true` setzen, damit keine Modul-Kachel auf der Startseite erscheint.
   - `defaultTab`, `getTabs` und `renderMainView` weglassen und stattdessen `Provider` (mit `ctx: PluginProviderKontext`), `settingsPanels` und/oder deklarative `"themes"` im Manifest definieren.
4. Bei Bedarf Backend (`src/server.ts` -> `dist/server.js`) und `migrations/*.sql` hinzufügen.

---

## Bestehende Plugins aktualisieren (von Template v0.1.1 auf v0.2.0)

Wenn ein Plugin auf Basis von **`SIdelineOS-templateplugin` v0.1.1** erstellt wurde, solltest du folgende Punkte nachziehen, damit es sauber mit Themes, Team-Akzentfarben und den neuen Core-SDK-Typen zusammenspielt:

### 1. `src/sdk.d.ts` auf den aktuellen Core-SDK-Stand bringen
Übernehme die aktuelle `src/sdk.d.ts` aus diesem Template. Neu hinzugekommen sind u. a.:
- **`PluginManifest`:** optionale Felder `hideHubTile?: boolean` und `themes?: PluginThemePreset[]`
- **`SidelinePlugin`:** `defaultTab`, `getTabs` und `renderMainView` sind jetzt optional; neu sind `themes` sowie `Provider?: ComponentType<PluginProviderProps>` mit Live-Kontext `PluginProviderKontext`
- **`BenutzerKonto`:** `preferredTheme?: string`
- **`PluginS3Scope`:** `deleteObject(objectPath: string): Promise<void>`
- **Theme-Konstanten & -Helfer:** `SIDELINE_CSS_TOKENS`, `SIDELINE_STANDARD_THEME_TOKENS`, `CORE_STANDARD_THEME_PRESET`, `ermittleTeamAkzentTokens`, `ermittleKontrastTextFarbe`, `validiereThemeTokenWert`, `loeseAktivesThemeAuf` u. a.

### 2. UI-Farben auf semantische `sl-*` Design-Tokens umstellen (Pflicht für Light-/Theme-Support)
In v0.1.1 nutzte das Template feste Tailwind-Slate-Klassen. Damit dein Plugin sowohl im Standard-Dark-Theme als auch in Light-, High-Contrast- oder Vereins-Themes korrekt lesbar bleibt und keine fehlenden Utility-Klassen entstehen, ersetze feste Farbklassen durch die semantischen Core-Tokens:

| Alt (v0.1.1 / fest) | Neu (Core-Token) | Zweck |
| :--- | :--- | :--- |
| `bg-slate-950`, `bg-[#0B0E11]` | `bg-sl-canvas` | Seiten- und Eingabehintergrund |
| `bg-slate-900`, `bg-[#13171D]` | `bg-sl-surface` | Karten, Modals, Panels |
| `bg-slate-800`, `bg-[#1E2530]` | `bg-sl-elevated` | Sekundäre Buttons, Hervorhebungen |
| `border-slate-800`, `border-[#232933]` | `border-sl-border` | Standard-Rahmen und Trennlinien |
| `border-slate-700`, `border-[#36404F]` | `border-sl-border-strong` | Stärkere Trenner / Badges |
| `text-white` | `text-sl-heading` | Überschriften, aktive Labels |
| `text-slate-100`, `text-slate-200` | `text-sl-primary` | Fließtext, Werte |
| `text-slate-400` | `text-sl-muted` | Beschreibungen, Meta-Infos |
| `text-slate-500` | `text-sl-subtle` | Platzhalter, leere Zustände |
| `bg-amber-500` / `text-amber-400` | `bg-sl-accent` / `text-sl-accent` | Team-Primärfarbe / Akzente |
| Text auf `bg-sl-accent` | `text-sl-accent-contrast` | Automatischer WCAG-Kontrasttext |
| Fehler / Erfolg / Warnung | `sl-danger` (`text-sl-danger-text`), `sl-success` (`text-sl-success-text`), `text-sl-warning-text` | Statusmeldungen |

> **Wichtig:** Wenn das Plugin zusätzlich ein eigenes `dist/client.css` ausliefert, verwende dort ebenfalls `var(--sl-bg-surface)`, `var(--sl-text-primary)` usw. statt fester Hex-Werte.

### 3. Optional: Headless- oder Theme-Funktionen aktivieren
- **Keine Kachel auf dem Hub:** `"hideHubTile": true` in `plugin.manifest.json` ergänzen (z. B. für reine Settings-, Background- oder Theme-Plugins).
- **Globaler `Provider` mit Kontext:** `function MyProvider({ children, ctx }: PluginProviderProps)` nutzen und vor DOM- oder Effekt-Änderungen `ctx?.istGlobalAktiv` bzw. `ctx?.istFuerAktivesTeamAktiv` prüfen.
- **Deklarative Themes:** Farb-Presets direkt unter `"themes": [...]` in `plugin.manifest.json` pflegen, statt eigene `<style>`-Overrides zu injizieren. Setzt ein `Provider` eigene Akzentfarben per JS, `document.documentElement.dataset.slThemeAccentOverride = 'true'` setzen und im `useEffect`-Cleanup wieder entfernen.

### 4. `package.json`, `plugin.manifest.json` & CI prüfen
1. Falls dein abgeleitetes Plugin noch `--omit=peer` oder keinen Peer-Flag in `.github/workflows/release.yml` nutzt: auf `npm ci --legacy-peer-deps` bzw. `npm install --legacy-peer-deps` umstellen.
2. In `plugin.manifest.json` die `version` erhöhen (z. B. Patch/Minor) und — falls das Plugin zwingend die neuen `sl-*`-Tokens oder `hideHubTile`/`themes` voraussetzt — `minCoreVersion` auf die zugehörige Core-Release-Version anheben.
3. Abschließend lokal verifizieren und neues Release-Tag pushen:
   ```bash
   npm run lint && npm test && npm run pack:plugin
   ```

## Lizenz

GNU Affero General Public License v3.0 (AGPLv3) — siehe `LICENSE`.
