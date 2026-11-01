import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComparisonCard } from "@michaelthomasjach/liseuse-dashboard-kit";

const euro = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

/**
 * Deux chiffres face à face dans une carte, séparés par un filet : un portefeuille et son indice,
 * ce mois-ci et le précédent.
 */
const meta = {
  title: "Finance/ComparisonCard",
  component: ComparisonCard,
  parameters: {
    docs: {
      description: {
        component: [
          "Carte qui met **deux chiffres côte à côte** pour qu'on les compare d'un coup d'œil : une performance et sa référence, une période et la précédente, un objectif et le réalisé.",
          "",
          "**Quand l'utiliser** — exactement deux valeurs de même nature. Pour une seule valeur, `StatCard` ; pour trois ou plus, une rangée de `StatCard` ou un `DataTable` ; pour suivre l'écart dans le temps, un graphique.",
          "",
          "**Anatomie** — une `Panel` avec `title` (en petites capitales) et `meta` (à droite de l'en-tête, par exemple la période). Dessous, `primary` puis `secondary`, chacun de forme `{ label, value, delta? }` : un libellé pâle, la valeur en grand (`ReactNode`, à formater vous-même), et l'écart en `PriceChangeTag` si `delta` est fourni.",
          "",
          "**Format de l'écart** — `delta` sort en français par défaut (`+14,20 %`). `locale` change la langue ; `formatDelta` le format entier — il reçoit l'écart **en valeur absolue**, le signe et la flèche sont posés autour.",
          "",
          "**Thème** — la carte : `--lq-color-panel`, `--lq-shadow-panel`, `--lq-radius-lg` ; le filet : `--lq-color-border-subtle` ; les libellés : `--lq-color-text-muted` ; `--lq-space-4`.",
        ].join("\n"),
      },
    },
  },
  args: {
    title: "Performance",
    meta: "depuis le 1er janvier",
    primary: { label: "Portefeuille", value: euro(132480), delta: 14.2 },
    secondary: { label: "CAC 40", value: "7 512 pts", delta: 6.8 },
  },
  argTypes: {
    title: { control: "text" },
    meta: { control: "text" },
    locale: { control: "text", table: { defaultValue: { summary: '"fr-FR"' } } },
    formatDelta: { control: false },
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <ComparisonCard {...args} />
    </div>
  ),
} satisfies Meta<typeof ComparisonCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const WithoutDelta: Story = {
  name: "Sans écart",
  args: {
    title: "Encaissements",
    meta: "mois clos",
    primary: { label: "Octobre", value: euro(79880) },
    secondary: { label: "Septembre", value: euro(71200) },
  },
  parameters: { docs: { description: { story: "Deux montants bruts : la comparaison se lit dans les valeurs elles-mêmes." } } },
};

export const NegativeDelta: Story = {
  name: "Écart défavorable",
  args: {
    title: "Délai de paiement",
    meta: "moyenne sur 30 jours",
    primary: { label: "Clients grands comptes", value: "41 j", delta: 8.5 },
    secondary: { label: "Autres clients", value: "23 j", delta: -3.1 },
  },
  parameters: {
    docs: {
      description: {
        story: "Comme partout dans le kit, la couleur suit le signe et non le sens métier : un délai qui s'allonge (+8,5 %) s'affiche en vert.",
      },
    },
  },
};

export const WithoutTitle: Story = {
  name: "Sans titre",
  args: { title: undefined, meta: undefined },
  parameters: { docs: { description: { story: "Sans `title` ni `meta`, la carte n'a pas d'en-tête : utile quand elle vit déjà sous un titre de section." } } },
};
