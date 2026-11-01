import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  BottomNav,
  Heading,
  Text,
  BellIcon,
  CalendarIcon,
  HomeIcon,
  PieChartIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
  type BottomNavItem,
  type BottomNavProps,
} from "@michaelthomasjach/liseuse-dashboard-kit";

const ITEMS: BottomNavItem[] = [
  { id: "accueil", label: "Accueil", icon: <HomeIcon /> },
  { id: "agenda", label: "Agenda", icon: <CalendarIcon /> },
  { id: "rapports", label: "Rapports", icon: <PieChartIcon /> },
  { id: "alertes", label: "Alertes", icon: <BellIcon />, badge: 3 },
  { id: "profil", label: "Profil", icon: <UserIcon /> },
];

/** Un écran de téléphone de 390 px : la page défile, la barre reste au pied. */
function Phone({ children, nav }: { children: ReactNode; nav: ReactNode }) {
  return (
    <div
      style={{
        width: 390,
        maxWidth: "100%",
        height: 620,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        background: "var(--lq-color-bg)",
        boxShadow: "var(--lq-shadow-panel)",
        border: "1px solid var(--lq-color-border-subtle)",
        overflow: "hidden",
      }}
    >
      <div style={{ flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
      {nav}
    </div>
  );
}

function PageBody({ title }: { title: string }) {
  return (
    <>
      <Heading level={4}>{title}</Heading>
      <Text muted size="sm">
        Le contenu de l&apos;écran défile au-dessus de la barre.
      </Text>
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} style={{ height: 64, flex: "none", background: "var(--lq-color-panel)", boxShadow: "var(--lq-shadow-panel)" }} />
      ))}
    </>
  );
}

/** Tient l'entrée active, et pose la barre dans le téléphone. */
function InPhone(args: BottomNavProps) {
  const [active, setActive] = useState(args.activeId ?? args.items[0]?.id);
  return (
    <Phone
      nav={
        <BottomNav
          {...args}
          activeId={active}
          onChange={(id) => {
            setActive(id);
            args.onChange?.(id);
          }}
        />
      }
    >
      <PageBody title={args.items.find((i) => i.id === active)?.label ?? ""} />
    </Phone>
  );
}

/**
 * La barre de navigation basse d'une application mobile.
 */
const meta = {
  title: "Layouts/BottomNav",
  component: BottomNav,
  parameters: {
    docs: {
      description: {
        component: [
          "**Barre de navigation basse** d'application mobile : trois à cinq destinations de premier niveau, chacune une icône et un libellé, l'active marquée, une **pastille de compteur** au besoin.",
          "",
          "**Quand l'utiliser** — sur téléphone, pour les sections entre lesquelles on saute sans cesse (accueil, agenda, alertes, profil). Sur un écran large, la même navigation va dans `SidebarLayout` ou `HeaderLayout` ; au-delà de cinq destinations, regroupez le reste derrière une entrée « Plus ». Pour des vues d'un même écran, `Tabs`.",
          "",
          "**Entrées (`items`)** — chaque `BottomNavItem` porte `id`, `label`, `icon` (et `activeIcon` si l'icône de l'entrée active diffère, pleine plutôt qu'au trait). Avec `href`, l'entrée est un vrai lien `<a>` ; sans, un `<button>`. `onClick` est appelé au choix (et, avec `href`, empêche le lien d'être suivi), `disabled` grise l'entrée.",
          "",
          "**Active** — `activeId` désigne l'entrée active (contrôlé), `onChange(id)` est appelé à chaque choix. L'active prend la couleur d'accent, une **pilule** derrière son icône et un libellé en gras ; elle porte `aria-current=\"page\"`. `labels=\"active\"` ne garde que le libellé de l'entrée active à l'écran — les autres restent lus par les lecteurs d'écran.",
          "",
          "**Pastille (`badge`)** — un nombre (0 la masque ; au-delà de `badgeMax`, 99 par défaut, on lit « 99+ ») ou `true` pour un simple point. Un lecteur d'écran entend « Alertes, 3 notifications » ; `badgeLabel` remplace cette fin de phrase.",
          "",
          "**Position** — `position=\"fixed\"` (défaut) colle la barre au bas de la fenêtre, au-dessus du contenu (z-index 900, sous les modales et popovers) : laissez une marge basse au contenu de la page. `\"static\"` la laisse dans le flux, au pied d'un conteneur en colonne, comme dans ces exemples. Dans les deux cas, la barre ajoute sous elle la **zone sûre** des téléphones à encoche (`env(safe-area-inset-bottom)`, qui demande `viewport-fit=cover` dans la balise `viewport`). Les entrées se partagent la largeur, plafonnée à 640 px et centrée.",
          "",
          "**Clavier et accessibilité** — un `<nav>` nommé par `ariaLabel` (« Navigation principale »), une liste d'entrées dans l'ordre de tabulation, activées par Entrée (et Espace pour un bouton). Le focus clavier se voit en anneau autour de l'icône.",
          "",
          "**Thème** — `--lq-color-panel` (fond), `--lq-color-border-subtle` (filet du haut), `--lq-color-text-muted` (repos), `--lq-color-accent` (active, pilule à 14 %), `--lq-color-danger` / `--lq-color-accent-contrast` (pastille), `--lq-color-focus-ring`. Variables optionnelles : `--lq-bottom-nav-height` (56 px), `--lq-bottom-nav-bg`, `--lq-bottom-nav-border`, `--lq-bottom-nav-shadow`, `--lq-bottom-nav-color`, `--lq-bottom-nav-active-color`, `--lq-bottom-nav-indicator-bg`, `--lq-bottom-nav-label-size` (0,7 rem), `--lq-bottom-nav-badge-bg`, `--lq-bottom-nav-badge-text`, `--lq-bottom-nav-z-index`.",
        ].join("\n"),
      },
    },
  },
  args: {
    items: ITEMS,
    activeId: "accueil",
    position: "static",
    labels: "always",
    badgeMax: 99,
    ariaLabel: "Navigation principale",
    onChange: fn(),
  },
  argTypes: {
    items: { control: "object" },
    activeId: { control: "text" },
    position: { control: "inline-radio", options: ["fixed", "static"], table: { defaultValue: { summary: '"fixed"' } } },
    labels: { control: "inline-radio", options: ["always", "active"], table: { defaultValue: { summary: '"always"' } } },
    badgeMax: { control: "number", table: { defaultValue: { summary: "99" } } },
    ariaLabel: { control: "text", table: { defaultValue: { summary: '"Navigation principale"' } } },
    className: { control: false },
    style: { control: false },
  },
  render: (args) => <InPhone key={args.activeId} {...args} />,
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Cinq destinations dans un téléphone ; touchez-en une, la page change de titre. « Alertes » porte une pastille de 3." } } },
};

export const Badges: Story = {
  name: "Pastilles",
  args: {
    items: [
      { id: "accueil", label: "Accueil", icon: <HomeIcon /> },
      { id: "recherche", label: "Recherche", icon: <SearchIcon />, badge: true, badgeLabel: "nouveaux résultats" },
      { id: "agenda", label: "Agenda", icon: <CalendarIcon />, badge: 12 },
      { id: "alertes", label: "Alertes", icon: <BellIcon />, badge: 240 },
    ],
  },
  parameters: { docs: { description: { story: "Un point (`badge: true`), un compteur, et un compteur au-delà de `badgeMax` qui se lit « 99+ »." } } },
};

export const ActiveLabelOnly: Story = {
  name: "Libellé de l'active seulement",
  args: { labels: "active" },
  parameters: { docs: { description: { story: "`labels=\"active\"` : une barre plus calme, où seul le libellé de l'entrée active reste à l'écran." } } },
};

export const ThreeItems: Story = {
  name: "Trois destinations",
  args: {
    items: [
      { id: "accueil", label: "Accueil", icon: <HomeIcon /> },
      { id: "rapports", label: "Rapports", icon: <PieChartIcon /> },
      { id: "reglages", label: "Réglages", icon: <SettingsIcon />, disabled: true },
    ],
  },
  parameters: { docs: { description: { story: "Le minimum : trois entrées, qui se partagent la largeur. « Réglages » est désactivée (`disabled`)." } } },
};

export const Fixed: Story = {
  name: "Fixée en bas de fenêtre",
  args: { position: "fixed" },
  parameters: {
    layout: "fullscreen",
    rdkPadding: 0,
    docs: {
      story: { inline: false, iframeHeight: "520px" },
      description: { story: "`position=\"fixed\"` : la barre colle au bas de la fenêtre pendant que la page défile ; la page garde une marge basse pour ne rien cacher sous elle." },
    },
  },
  render: function Render(args) {
    const [active, setActive] = useState(args.activeId ?? "accueil");
    return (
      <div style={{ padding: 16, paddingBottom: 96, display: "flex", flexDirection: "column", gap: 12 }}>
        <PageBody title="Page longue" />
        <PageBody title="Suite" />
        <BottomNav
          {...args}
          activeId={active}
          onChange={(id) => {
            setActive(id);
            args.onChange?.(id);
          }}
        />
      </div>
    );
  },
};
