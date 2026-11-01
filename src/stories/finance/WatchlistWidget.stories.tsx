import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { WatchlistWidget, Badge, type WatchlistItem } from "@michaelthomasjach/liseuse-dashboard-kit";
import { HOLDINGS } from "../../showcase/demoData";

const price = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });

/** `WatchlistItem` n'est qu'une `HoldingCard` avec un `id` : les positions de démonstration s'y versent telles quelles. */
const ITEMS: WatchlistItem[] = HOLDINGS.map((h) => ({ ...h, formatPrice: price }));

/**
 * La liste de surveillance prête à poser : une carte titrée qui empile des `HoldingCard`.
 */
const meta = {
  title: "Finance Widgets/WatchlistWidget",
  component: WatchlistWidget,
  parameters: {
    docs: {
      description: {
        component: [
          "Widget **prêt à poser** : une carte titrée qui empile une `HoldingCard` par valeur suivie, avec le décompte des valeurs en en-tête.",
          "",
          "**Quand l'utiliser** — une colonne latérale de tableau de bord, une liste courte (une dizaine de lignes au plus) qu'on parcourt d'un coup d'œil. Au-delà, ou pour trier et comparer, prenez un `DataTable` ; pour les plus fortes variations de la séance, `MarketMoversWidget`.",
          "",
          "**Anatomie** — une `Panel` avec `title` et, à droite, un `meta` **calculé** par le widget (« 5 actifs », « 1 actif ») ; puis les lignes. Chaque élément de `items` a la forme d'une `HoldingCard` plus un `id` : `symbol`, `name`, `price`, `change`, et au choix `quantity`, `sparklineData`, `locale`, `formatPrice`, `formatChange`, `formatQuantity`.",
          "",
          "**Sélection** — avec `onSelect`, chaque ligne devient cliquable et le widget renvoie l'`id` de la ligne choisie ; sans lui, les lignes sont inertes. Comme pour `HoldingCard`, les lignes cliquables se focalisent à Tab et se déclenchent au clic, à Entrée ou à Espace.",
          "",
          "**Liste vide** — sans élément, la carte affiche `emptyMessage` (« Aucun actif suivi » par défaut).",
          "",
          "**Libellés du kit** — le titre par défaut est « Liste de surveillance » et le décompte dit « actifs ». Chaque ligne sort en français (`642,30 €`, `+1,84 %`) ; les formats se règlent ligne par ligne (`formatPrice`, `formatChange`, `formatQuantity`, ou `locale`).",
          "",
          "**Thème** — les variables de `Panel` et de `HoldingCard` : `--lq-color-panel`, `--lq-shadow-panel`, `--lq-color-hover`, `--lq-color-up` / `--lq-color-down`, `--lq-space-2`, `--lq-space-4`.",
        ].join("\n"),
      },
    },
  },
  args: {
    title: "Liste de surveillance",
    items: ITEMS,
    onSelect: fn(),
    emptyMessage: "Aucune valeur suivie pour l'instant.",
  },
  argTypes: {
    title: { control: "text", table: { defaultValue: { summary: '"Liste de surveillance"' } } },
    items: { control: false },
    emptyMessage: { control: "text", table: { defaultValue: { summary: '"Aucun actif suivi"' } } },
  },
  render: (args) => (
    <div style={{ maxWidth: 460 }}>
      <WatchlistWidget {...args} />
    </div>
  ),
} satisfies Meta<typeof WatchlistWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Empty: Story = {
  name: "Vide",
  args: { title: "Valeurs suivies par l'équipe", items: [] },
};

export const ReadOnly: Story = {
  name: "Lecture seule",
  args: { title: "Positions du fonds", items: ITEMS.slice(0, 3), onSelect: undefined },
  parameters: { docs: { description: { story: "Sans `onSelect`, ni survol ni curseur : une liste d'information." } } },
};

export const Selection: Story = {
  name: "Sélection d'une ligne",
  render: function Render(args) {
    const [selected, setSelected] = useState<string | null>(null);
    const item = ITEMS.find((i) => i.id === selected);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 460 }}>
        <WatchlistWidget {...args} onSelect={setSelected} />
        <div>{item ? <Badge tone="info">Fiche ouverte : {item.name}</Badge> : <Badge>Cliquez une valeur</Badge>}</div>
      </div>
    );
  },
  parameters: { docs: { description: { story: "`onSelect` reçoit l'`id` de la ligne : de quoi ouvrir la fiche de la valeur." } } },
};

export const KitDefaults: Story = {
  name: "Libellés par défaut du kit",
  args: { title: undefined, items: ITEMS.slice(0, 2).map((item) => ({ ...item, formatPrice: undefined })), emptyMessage: undefined },
  parameters: {
    docs: {
      description: { story: "Sans `title` ni `formatPrice` : le titre « Liste de surveillance » et les cours au format du kit, en français (`642,30 €`)." },
    },
  },
};
