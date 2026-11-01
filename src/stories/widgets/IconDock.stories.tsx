import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  IconDock,
  BarChartIcon,
  BoxesIcon,
  BriefcaseIcon,
  CalendarIcon,
  ClipboardListIcon,
  GaugeIcon,
  HelpIcon,
  LayersIcon,
  RefreshIcon,
  SearchIcon,
  SettingsIcon,
  TruckIcon,
  type IconDockItem,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { Caption, Corner, Stage } from "./_Stage";

const SECTIONS: { id: string; label: string; icon: ReactNode; badge?: ReactNode }[] = [
  { id: "tableau", label: "Tableau de bord", icon: <GaugeIcon /> },
  { id: "commandes", label: "Commandes", icon: <ClipboardListIcon />, badge: 3 },
  { id: "stocks", label: "Stocks", icon: <BoxesIcon /> },
  { id: "livraisons", label: "Livraisons", icon: <TruckIcon />, badge: true },
  { id: "planning", label: "Planning", icon: <CalendarIcon /> },
  { id: "clients", label: "Clients", icon: <BriefcaseIcon /> },
  { id: "rapports", label: "Rapports", icon: <BarChartIcon /> },
];

const TOOLS: IconDockItem[] = [
  { id: "chercher", label: "Rechercher", icon: <SearchIcon />, onClick: () => {} },
  { id: "calques", label: "Calques", icon: <LayersIcon />, onClick: () => {} },
  { id: "actualiser", label: "Actualiser", icon: <RefreshIcon />, onClick: () => {} },
  { id: "aide", label: "Aide", icon: <HelpIcon />, onClick: () => {} },
  { id: "reglages", label: "Réglages — réservé aux administrateurs", icon: <SettingsIcon />, disabled: true, onClick: () => {} },
];

/** Les sections, marquées actives selon `active` ; un clic ouvre la section, un second la referme. */
const sectionItems = (active: string | null, setActive: (fn: (a: string | null) => string | null) => void): IconDockItem[] =>
  SECTIONS.map((s) => ({ ...s, active: s.id === active, onClick: () => setActive((a) => (a === s.id ? null : s.id)) }));

/**
 * Le dock d'icônes : une petite barre d'outils flottante, des boutons carrés dont le nom vit dans
 * une infobulle.
 */
const meta = {
  title: "Widgets/IconDock",
  component: IconDock,
  parameters: {
    docs: {
      description: {
        component: [
          "Le **dock d'icônes** — une barre d'outils flottante à la manière des jeux de gestion : une rangée de boutons carrés, posée sur un panneau par-dessus la scène, qui remplace un menu de texte là où la place manque.",
          "",
          "**Quand l'utiliser** — pour cinq à dix sections ou outils qu'on reconnaît à leur icône, en surimpression d'une carte, d'un plan, d'un éditeur. Pour une navigation principale avec libellés, `SidebarLayout` ; pour une action isolée, `IconButton` ; pour des choix exclusifs avec texte, `SegmentedControl`.",
          "",
          "**Une icône, un nom** — chaque bouton n'affiche que son icône ; son `label` vit dans une infobulle (au survol comme au focus clavier, sous le dock s'il est horizontal, à sa droite s'il est vertical) et sert de nom accessible.",
          "",
          "**États** — l'élément `active` est rempli à l'accent (`aria-pressed`) ; un élément `disabled` est estompé mais **reste atteignable au clavier** (`aria-disabled`), pour qu'on découvre l'outil et lise dans son infobulle pourquoi il est indisponible. `badge` pose une pastille : `true` ou `\"\"` un point, un nombre ou un texte une pastille chiffrée (ajoutée au nom accessible), `0` ou rien aucune.",
          "",
          "**Clavier** — un `role=\"toolbar\"` à tabindex itinérant : un seul arrêt de tabulation (le bouton actif, à défaut le premier), puis les flèches — gauche / droite à l'horizontale, haut / bas à la verticale — en bouclant ; Début et Fin vont aux extrémités.",
          "",
          "**Variantes** — `orientation` (`horizontal` par défaut, ou `vertical`), `size` (`sm` 36 px, `md` 44 px, `lg` 52 px), `compact` : un ruban qui défile au lieu de s'étaler — automatique sous 640 px pour un dock horizontal. Le dock ne retient rien : `active` et `onClick` sont à l'application. Il se place dans un conteneur positionné.",
          "",
          "**Thème** — `--lq-color-panel`, `--lq-color-border`, `--lq-color-border-subtle`, `--lq-color-accent` et `--lq-color-accent-contrast` (élément actif), `--lq-color-danger` (pastille), `--lq-color-focus-ring`, `--lq-transition-fast`.",
        ].join("\n"),
      },
    },
  },
  args: {
    items: SECTIONS.map((s) => ({ ...s, active: s.id === "commandes", onClick: () => {} })),
    orientation: "horizontal",
    size: "md",
    compact: false,
    "aria-label": "Sections",
  },
  argTypes: { items: { control: false } },
  // La story tient la section active ; les contrôles règlent l'orientation, la taille et le ruban.
  render: function Render(args) {
    const [active, setActive] = useState<string | null>("commandes");
    return (
      <Stage height={args.orientation === "vertical" ? 400 : 220}>
        <Corner at="top-left">
          <IconDock {...args} items={sectionItems(active, setActive)} />
        </Corner>
        <Caption>Section : {SECTIONS.find((s) => s.id === active)?.label ?? "aucune"}</Caption>
      </Stage>
    );
  },
} satisfies Meta<typeof IconDock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Cliquez une section pour l'ouvrir, une seconde fois pour la refermer. Tab entre dans le dock, les flèches s'y déplacent." } } },
};

export const Vertical: Story = {
  name: "Vertical",
  args: { orientation: "vertical", size: "sm" },
  parameters: { docs: { description: { story: "À la verticale, les infobulles passent à droite et les flèches haut / bas prennent le relais." } } },
};

export const Tools: Story = {
  name: "Outils, dont un désactivé",
  render: function Render(args) {
    const [last, setLast] = useState("—");
    return (
      <Stage height={220}>
        <Corner at="top-right">
          <IconDock {...args} aria-label="Outils" size="sm" items={TOOLS.map((t) => ({ ...t, onClick: () => setLast(t.label) }))} />
        </Corner>
        <Caption>Dernier outil : {last}</Caption>
      </Stage>
    );
  },
  parameters: { docs: { description: { story: "« Réglages » est désactivé mais reste atteignable : son infobulle dit pourquoi." } } },
};

export const Sizes: Story = {
  name: "Tailles",
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <IconDock key={size} {...args} size={size} items={TOOLS.slice(0, 4)} aria-label={`Outils ${size}`} />
      ))}
    </div>
  ),
};

export const Compact: Story = {
  name: "Ruban compact",
  args: { compact: true },
  render: function Render(args) {
    const [active, setActive] = useState<string | null>("stocks");
    return (
      <div style={{ maxWidth: 260 }}>
        <IconDock {...args} items={sectionItems(active, setActive)} />
      </div>
    );
  },
  parameters: { docs: { description: { story: "`compact` : les boutons ne passent pas à la ligne, le ruban défile et se cale sur chaque bouton." } } },
};
