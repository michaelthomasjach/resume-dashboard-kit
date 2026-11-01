import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, within } from "storybook/test";
import { MarketMoversWidget } from "@michaelthomasjach/liseuse-dashboard-kit";
import { GAINERS, LOSERS } from "../../showcase/demoData";

/**
 * Les plus fortes variations de la séance, en deux onglets : hausses et baisses.
 */
const meta = {
  title: "Finance Widgets/MarketMoversWidget",
  component: MarketMoversWidget,
  parameters: {
    docs: {
      description: {
        component: [
          "Widget **prêt à poser** : une carte titrée qui liste les plus fortes **hausses** et **baisses** de la séance, une liste par onglet.",
          "",
          "**Quand l'utiliser** — une colonne de tableau de bord de marché, pour voir d'un coup d'œil ce qui bouge. Pour suivre des valeurs choisies (cours, quantité, courbe), prenez `WatchlistWidget` ; pour un classement complet et triable, `DataTable`.",
          "",
          "**Anatomie** — une `Panel` avec `title` (« Marché » par défaut), des `Tabs` « Hausses » / « Baisses », puis une `PanelRow` par valeur : « `symbol` · `name` » à gauche, l'écart `change` en `PriceChangeTag` à droite. Chaque élément de `gainers` et `losers` a la forme `{ id, symbol, name, change }`.",
          "",
          "**Comportement** — l'onglet actif est interne au widget (il s'ouvre sur « Hausses ») ; les onglets sont de vrais `role=\"tab\"`. L'**ordre** des listes est celui que vous fournissez : le widget ne trie pas. Une liste vide affiche « Aucune donnée ». Avec `onSelect`, chaque ligne devient un bouton (clic, Entrée, Espace) et le rappel reçoit la valeur et la liste d'où elle vient (`\"gainers\"` ou `\"losers\"`).",
          "",
          "**Libellés et format** — `labels` remplace les noms d'onglets et le message vide (`{ gainers, losers, empty }`, chacun facultatif). L'écart sort en français (`+6,42 %`) ; `locale` change la langue, `formatChange` le format entier (il reçoit l'écart **en valeur absolue**).",
          "",
          "**Thème** — `Panel` (`--lq-color-panel`, `--lq-shadow-panel`), `Tabs` (`--lq-caption-*` : onglets en petites capitales, `--lq-color-accent` pour l'onglet actif), `PanelRow` (`--lq-row-font-size`), `--lq-color-up` / `--lq-color-down`.",
        ].join("\n"),
      },
    },
  },
  args: { title: "Variations du jour", gainers: GAINERS, losers: LOSERS },
  argTypes: {
    title: { control: "text", table: { defaultValue: { summary: '"Marché"' } } },
    gainers: { control: "object" },
    losers: { control: "object" },
    labels: { control: "object" },
    locale: { control: "text", table: { defaultValue: { summary: '"fr-FR"' } } },
    formatChange: { control: false },
    onSelect: { control: false },
  },
  render: (args) => (
    <div style={{ maxWidth: 380 }}>
      <MarketMoversWidget {...args} />
    </div>
  ),
} satisfies Meta<typeof MarketMoversWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const LosersTab: Story = {
  name: "Onglet des baisses",
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("tab", { name: "Baisses" }));
  },
  parameters: { docs: { description: { story: "Après un clic sur « Baisses ». Les valeurs gardent l'ordre fourni : à vous de les classer de la plus forte à la plus faible." } } },
};

export const NoLosers: Story = {
  name: "Séance sans baisse",
  args: { losers: [] },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("tab", { name: "Baisses" }));
  },
  parameters: { docs: { description: { story: "Une liste vide affiche « Aucune donnée » — à remplacer par `labels.empty`." } } },
};

export const CustomLabels: Story = {
  name: "Libellés et sélection",
  args: { labels: { gainers: "En tête", losers: "En queue", empty: "Rien à signaler" }, onSelect: fn() },
  parameters: {
    docs: {
      description: {
        story: "`labels` renomme les onglets ; `onSelect` rend chaque ligne cliquable — le panneau Actions montre la valeur choisie et sa liste.",
      },
    },
  },
};
