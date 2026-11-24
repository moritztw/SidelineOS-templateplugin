declare module '@sidelineos/plugin-sdk' {
  import type { ComponentType, ReactNode } from 'react';

  export type UnterstuetzteSprache = 'de' | 'en';
  export type SprachPaket = Record<string, string>;
  export type SprachWoerterbuecher = {
    de: SprachPaket;
  } & Partial<Record<UnterstuetzteSprache, SprachPaket>>;

  export type TeamRolle = 'TEAM_ADMIN' | 'COACH' | 'PLAYER';
  export type SpielerUnit = 'OFFENSE' | 'DEFENSE' | 'SPECIAL_TEAMS';
  export type PluginId = string;

  export interface ProfilCustomFeld {
    key: string;
    label: string;
    typ: 'text' | 'number' | 'select';
    pflicht?: boolean;
    optionen?: string[];
  }

  export interface BenutzerKonto {
    uuid: string;
    benutzername: string;
    vollerName: string;
    email: string;
    telefon?: string;
    trikotNummer?: string;
    position?: string;
    istSysadmin: boolean;
    erstelltAm: string;
    preferredLocale?: UnterstuetzteSprache;
    customProfilWerte: Record<string, string>;
  }

  export interface S3Konfiguration {
    endpoint: string;
    region: string;
    bucket: string;
    accessKey: string;
    forcePathStyle: boolean;
    cleanupRetentionDays?: number;
    hatSecretKey?: boolean;
    konfiguriert?: boolean;
  }

  export interface TeamKontext {
    id: string;
    name: string;
    kurzname: string;
    aktiveSaison: string;
    saisons: string[];
    primaerFarbe?: string;
    aktivierteModule: PluginId[];
    customProfilFelder: ProfilCustomFeld[];
  }

  export interface BrandKonfiguration {
    produktName: string;
    coreName: string;
    kurzName: string;
    sdkScope: '@sidelineos/plugin-sdk';
    paketFormat: 'sideline-plugin-v1';
  }

  export type PluginPermission =
    | 'team:read'
    | 'team:roster-read'
    | 's3:team-rw'
    | 's3:cleanup-queue'
    | 'db:plugin-tables'
    | 'share:public-links'
    | 'notifications:send'
    | 'notifications:channel';

  export type PluginIconName =
    | 'film'
    | 'book-open'
    | 'clipboard-check'
    | 'layers'
    | 'puzzle';

  export interface PluginSettingsAnker {
    id: string;
    label: string;
    badge?: number;
  }

  export interface PluginManifest {
    id: PluginId;
    name: string;
    kurzbeschreibung: string;
    version: string;
    sdkVersion: '1.0' | (string & {});
    minCoreVersion?: string;
    maxCoreVersion?: string;
    autor: string;
    repositoryUrl: string;
    icon: PluginIconName;
    status: 'AKTIV' | 'VORSCHAU';
    standardAktiviert: boolean;
    permissions: PluginPermission[];
    dbPrefix: string;
    s3Prefix?: string;
    settingsAnker: {
      user?: PluginSettingsAnker[];
      team?: PluginSettingsAnker[];
      sysadmin?: PluginSettingsAnker[];
    };
  }

  export interface PluginTab {
    id: string;
    label: string;
  }

  export interface PluginLaufzeitKontext {
    team: TeamKontext;
    aktiveTeamAnsicht: TeamRolle;
    gewaehlteSaison: string;
    benutzer: BenutzerKonto;
    locale: string;
    aktuellerTab: string;
    onTabWechseln: (tabId: string) => void;
    onTeamSettingsOeffnen: () => void;
    onZurueckZurStartseite: () => void;
    onPublicShareOeffnen?: (token: string) => void;
  }

  export interface PluginSettingsKontext {
    team: TeamKontext;
    benutzer: BenutzerKonto;
    aktiveTeamAnsicht: TeamRolle | null;
    s3Konfig: S3Konfiguration;
    locale: string;
  }

  export interface SidelinePlugin {
    manifest: PluginManifest;
    Provider?: ComponentType<{ children: ReactNode }>;
    defaultTab: string;
    getTabs: (ctx: { teamRolle: TeamRolle; locale?: string }) => PluginTab[];
    PrimaerAktion?: ComponentType<{ ctx: PluginLaufzeitKontext; className: string }>;
    renderMainView: (ctx: PluginLaufzeitKontext) => ReactNode;
    renderPublicShareView?: (ctx: {
      token: string;
      locale?: string;
      onSchliessen: () => void;
    }) => ReactNode;
    settingsPanels?: {
      user?: ComponentType<{ ctx: PluginSettingsKontext }>;
      team?: ComponentType<{ ctx: PluginSettingsKontext }>;
      sysadmin?: ComponentType<{ ctx: PluginSettingsKontext }>;
    };
  }

  export function holeAktuelleBrandKonfig(explizitName?: string): BrandKonfiguration;
  export function teileWortmarke(produktName: string): { basis: string; akzent: string };
  export function uebersetzeSchluessel(
    woerterbuecher: SprachWoerterbuecher,
    sprache: string | undefined,
    schluessel: string,
    variablen?: Record<string, string | number | undefined>
  ): string;
  export function createPluginTranslator(
    woerterbuecher: SprachWoerterbuecher,
    locale?: string
  ): (schluessel: string, variablen?: Record<string, string | number | undefined>) => string;
}
