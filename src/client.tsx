import type {
  PluginLaufzeitKontext,
  SidelinePlugin,
  SprachWoerterbuecher,
} from '@sidelineos/plugin-sdk';
import { uebersetzeSchluessel } from '@sidelineos/plugin-sdk';
import manifest from '../plugin.manifest.json';

const WOERTERBUCH: SprachWoerterbuecher = {
  de: {
    tabOverview: 'Übersicht',
    title: 'Template Plugin aktiv',
    subtitle: 'Minimale, funktionsfreie Vorlage für SidelineOS-Plugins (SDK v1.0).',
    teamLabel: 'Team',
    seasonLabel: 'Saison',
    roleLabel: 'Rolle',
    versionLabel: 'Version',
  },
  en: {
    tabOverview: 'Overview',
    title: 'Template Plugin active',
    subtitle: 'Minimal, function-free starter template for SidelineOS plugins (SDK v1.0).',
    teamLabel: 'Team',
    seasonLabel: 'Season',
    roleLabel: 'Role',
    versionLabel: 'Version',
  },
};

function TemplateMainView({ ctx }: { ctx: PluginLaufzeitKontext }) {
  const t = (key: string) => uebersetzeSchluessel(WOERTERBUCH, ctx.locale, key);

  return (
    <section className="rounded-xl border border-sl-border bg-sl-surface p-6 space-y-4">
      <header className="space-y-1">
        <h2 className="text-base font-semibold text-sl-heading">{t('title')}</h2>
        <p className="text-sm text-sl-muted">{t('subtitle')}</p>
      </header>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-sl-border bg-sl-canvas px-3 py-2">
          <dt className="text-xs text-sl-muted">{t('teamLabel')}</dt>
          <dd className="font-medium text-sl-primary">{ctx.team.name}</dd>
        </div>
        <div className="rounded-lg border border-sl-border bg-sl-canvas px-3 py-2">
          <dt className="text-xs text-sl-muted">{t('seasonLabel')}</dt>
          <dd className="font-medium text-sl-primary">{ctx.gewaehlteSaison}</dd>
        </div>
        <div className="rounded-lg border border-sl-border bg-sl-canvas px-3 py-2">
          <dt className="text-xs text-sl-muted">{t('roleLabel')}</dt>
          <dd className="font-medium text-sl-primary">{ctx.aktiveTeamAnsicht}</dd>
        </div>
        <div className="rounded-lg border border-sl-border bg-sl-canvas px-3 py-2">
          <dt className="text-xs text-sl-muted">{t('versionLabel')}</dt>
          <dd className="font-mono text-sl-primary">{manifest.version}</dd>
        </div>
      </dl>
    </section>
  );
}

const plugin: SidelinePlugin = {
  manifest: manifest as SidelinePlugin['manifest'],
  defaultTab: 'overview',
  getTabs: ({ locale }) => [
    {
      id: 'overview',
      label: uebersetzeSchluessel(WOERTERBUCH, locale, 'tabOverview'),
    },
  ],
  renderMainView: (ctx) => <TemplateMainView ctx={ctx} />,
};

export default plugin;
