import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { HoldingCard, Badge } from "@michaelthomasjach/liseuse-dashboard-kit";
import { HOLDINGS } from "../../showcase/demoData";

const price = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });

const [LVMH, AIRBUS] = HOLDINGS;

/**
 * Une position sur une ligne : le titre, son cours, son écart de la séance. La brique des listes de
 * surveillance (`WatchlistWidget` n'est qu'une pile de `HoldingCard`).
 */
const meta = {
  title: "Finance/HoldingCard",
  component: HoldingCard,
  parameters: {
    docs: {
      description: {
        component: [
          "Carte-ligne compacte pour **une position** : une pastille à la lettre du symbole, le symbole et le nom de la société, une petite courbe, le cours et l'écart, et au choix la quantité détenue.",
          "",
          "**Quand l'utiliser** — une liste courte de titres, empilée verticalement (portefeuille, valeurs suivies). Sous un titre et dans une carte, préférez directement `WatchlistWidget`. Pour comparer beaucoup de positions colonne par colonne (tri, quantités, valorisation), prenez `DataTable`.",
          "",
          "**Anatomie** — `Avatar` de `symbol` (sa première lettre : un symbole est un seul mot), `symbol` et `name`, `sparklineData` (au moins deux points, 64 × 28 px, verte ou rouge selon sa pente), `price` passé à `formatPrice`, `change` (pourcentage signé) rendu par un `PriceChangeTag`, et `quantity` passé à `formatQuantity` (« 120 parts »).",
          "",
          "**Formats** — tous en français par défaut, dans la langue de `locale` (`\"fr-FR\"`) : le cours en `642,30 €`, l'écart en `+1,84 %`, la quantité en « 120 parts » (« 1 part » au singulier). `formatPrice` reçoit le cours brut, `formatChange` l'écart **en valeur absolue** (le signe et la flèche sont posés autour), `formatQuantity` la quantité — pour dire « actions » ou « lots ». Empilées, les cartes gardent leurs colonnes alignées : les chiffres et la quantité ont une largeur minimale commune (`--lq-holding-figures-width`, 6,5 rem ; `--lq-holding-quantity-width`, 4,5 rem).",
          "",
          "**Comportement** — sans `onClick`, la carte est inerte. Avec `onClick`, elle reçoit `role=\"button\"`, devient focalisable (Tab), prend un fond au survol et un contour au focus clavier ; le clic, **Entrée** et **Espace** la déclenchent.",
          "",
          "**Thème** — `--lq-color-panel`, `--lq-color-border-subtle`, `--lq-radius-lg`, `--lq-color-hover` (survol), `--lq-color-focus-ring` (focus), `--lq-color-up` / `--lq-color-down`, `--lq-space-2`, `--lq-space-3` ; en option `--lq-holding-figures-width` et `--lq-holding-quantity-width`.",
        ].join("\n"),
      },
    },
  },
  args: {
    symbol: LVMH.symbol,
    name: LVMH.name,
    quantity: LVMH.quantity,
    price: LVMH.price,
    change: LVMH.change,
    sparklineData: LVMH.sparklineData,
    formatPrice: price,
    onClick: fn(),
  },
  argTypes: {
    price: { control: { type: "number", step: 0.01 } },
    change: { control: { type: "number", step: 0.01 } },
    locale: { control: "text", table: { defaultValue: { summary: '"fr-FR"' } } },
    formatPrice: { control: false, table: { defaultValue: { summary: "deux décimales dans `locale` + « € »" } } },
    formatChange: { control: false, table: { defaultValue: { summary: "deux décimales dans `locale` + « % »" } } },
    formatQuantity: { control: false, table: { defaultValue: { summary: "« 120 parts » / « 1 part »" } } },
  },
  render: (args) => (
    <div style={{ maxWidth: 460 }}>
      <HoldingCard {...args} />
    </div>
  ),
} satisfies Meta<typeof HoldingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Down: Story = {
  name: "En baisse",
  args: {
    symbol: AIRBUS.symbol,
    name: AIRBUS.name,
    quantity: AIRBUS.quantity,
    price: AIRBUS.price,
    change: AIRBUS.change,
    sparklineData: AIRBUS.sparklineData,
  },
};

export const Static: Story = {
  name: "Non cliquable, sans quantité",
  args: { symbol: "OR", name: "L'Oréal", price: 371.9, change: 0.12, quantity: undefined, sparklineData: undefined, onClick: undefined },
  parameters: { docs: { description: { story: "Sans `onClick`, ni survol ni curseur : une simple ligne d'information." } } },
};

export const List: Story = {
  name: "Liste de positions",
  render: function Render() {
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 460 }}>
        {HOLDINGS.map(({ id, ...holding }) => (
          <HoldingCard key={id} {...holding} formatPrice={price} onClick={() => setSelected(id)} />
        ))}
        <div>{selected ? <Badge tone="info">Position ouverte : {HOLDINGS.find((h) => h.id === selected)?.name}</Badge> : <Badge>Cliquez une ligne</Badge>}</div>
      </div>
    );
  },
  parameters: { docs: { description: { story: "Les cartes s'empilent ; un clic ouvre le détail de la position (ici, la pastille du bas)." } } },
};
