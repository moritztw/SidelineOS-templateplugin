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
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
      <header className="space-y-1">
        <h2 className="text-base font-semibold text-white">{t('title')}</h2>
        <p className="text-sm text-slate-400">{t('subtitle')}</p>
      </header>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2">
          <dt className="text-xs text-slate-400">{t('teamLabel')}</dt>
          <dd className="font-medium text-slate-100">{ctx.team.name}</dd>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2">
          <dt className="text-xs text-slate-400">{t('seasonLabel')}</dt>
          <dd className="font-medium text-slate-100">{ctx.gewaehlteSaison}</dd>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2">
          <dt className="text-xs text-slate-400">{t('roleLabel')}</dt>
          <dd className="font-medium text-slate-100">{ctx.aktiveTeamAnsicht}</dd>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2">
          <dt className="text-xs text-slate-400">{t('versionLabel')}</dt>
          <dd className="font-mono text-slate-100">{manifest.version}</dd>
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
