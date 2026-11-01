import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, DeltaChart, type DeltaChartItem } from "@michaelthomasjach/liseuse-dashboard-kit";
import { PONT_RESULTAT } from "../../showcase/chartData";
import { CODE_LISIBLE, SOURCE_ABREGEE, kEuros } from "./communs";

/** De la trésorerie d'ouverture à celle de clôture du trimestre, en k€ : un seul total à chaque bout. */
const PONT_TRESORERIE: DeltaChartItem[] = [
  { id: "ouverture", label: "Ouverture", value: 214, isTotal: true },
  { id: "encaissements", label: "Encaissements", value: 386 },
  { id: "salaires", label: "Salaires", value: -241 },
  { id: "fournisseurs", label: "Fournisseurs", value: -97 },
  { id: "tva", label: "TVA", value: -38 },
  { id: "emprunt", label: "Emprunt", value: 60 },
  { id: "cloture", label: "Clôture", value: 284, isTotal: true },
];

/** Le même pont, l'emprunt distingué par sa propre couleur. */
const PONT_TRESORERIE_COLORE: DeltaChartItem[] = PONT_TRESORERIE.map((i) =>
  i.id === "emprunt" ? { ...i, color: "var(--lq-color-sky)" } : i,
);

/**
 * La cascade : comment une suite d'ajouts et de retraits mène d'un total à un autre.
 */
const meta = {
  title: "Charts/DeltaChart",
  component: DeltaChart,
  parameters: {
    ...CODE_LISIBLE,
    docs: {
      source: SOURCE_ABREGEE,
      description: {
        component: [
          "Un graphique en cascade (« pont ») : chaque `DeltaChartItem` est un montant signé qui monte ou descend depuis le niveau atteint par le précédent ; un élément `isTotal` est un sous-total, dessiné depuis zéro, et le cumul repart de sa valeur. Des pointillés relient le haut d'une marche au pied de la suivante.",
          "",
          "**Quand l'utiliser** — expliquer un écart : du chiffre d'affaires au résultat net, de la trésorerie d'ouverture à celle de clôture, du budget au réalisé. Pour comparer des catégories indépendantes, `BarChart` ; pour une évolution dans le temps, `LineAreaChart`.",
          "",
          "**Anatomie et variantes** — barres flottantes colorées selon leur signe, barres de total pleines, connecteurs (`showConnectors`, actifs par défaut), légende Ajout / Retrait / Total (`showLegend`), axe des valeurs (`showValueAxis`) et ses options de trait (`showYAxisLine`, `hideYAxisLine`, `extendXAxisLine`). `formatValue` met en forme l'axe et la bulle. Une `color` par élément l'emporte sur la couleur de son signe. Un libellé de catégorie trop long pour sa place est raccourci d'une ellipse, le nom complet restant dans son infobulle (`<title>`) et dans la bulle de survol — ils ne se chevauchent plus. Toute la largeur du conteneur ; 340 px de haut par défaut. Les sous-totaux ne sont **pas** recalculés : la valeur d'un `isTotal` doit retomber juste.",
          "",
          "**Interactions** — survol d'une marche : sa bulle donne le montant. Le zoom de l'axe des catégories suit les conventions de `BarChart` (molette, glisser, double-clic sur l'axe des valeurs pour le rétablir) ; `zoomable={false}` le coupe. Bouton plein écran, Échap pour sortir.",
          "",
          "**Thème** — hausses en `--lq-color-up`, baisses en `--lq-color-down`, totaux en `--lq-color-accent` ; connecteurs en `--lq-color-text-muted`, ligne du zéro en `--lq-color-border` ; axes et grille comme les autres graphiques (`--lq-color-text-muted`, `--lq-color-border-subtle`).",
        ].join("\n"),
      },
    },
  },
  args: { items: PONT_RESULTAT, height: 300, formatValue: kEuros, zoomable: false },
  argTypes: {
    items: { control: false },
    formatValue: { control: false },
    margin: { control: false },
  },
} satisfies Meta<typeof DeltaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: {
    docs: {
      description: {
        story: "Du chiffre d'affaires au résultat net de l'exercice : la marge brute et l'EBITDA sont des sous-totaux (`isTotal`) qui repartent de zéro.",
      },
    },
  },
};

export const SingleBridge: Story = {
  name: "Pont simple",
  args: { items: PONT_TRESORERIE, height: 280 },
  parameters: { docs: { description: { story: "Un total à chaque bout : la trésorerie du trimestre, de l'ouverture à la clôture." } } },
};

export const WithoutConnectors: Story = {
  name: "Sans connecteurs",
  args: { items: PONT_TRESORERIE, showConnectors: false, height: 280 },
};

export const CustomColor: Story = {
  name: "Une marche distinguée",
  args: { items: PONT_TRESORERIE_COLORE, height: 280 },
  parameters: {
    docs: {
      description: {
        story: "`color` sur un élément l'emporte sur la couleur de son signe — ici l'emprunt, une entrée de trésorerie qui n'est pas une recette.",
      },
    },
  },
};

export const LightAxes: Story = {
  name: "Axes allégés, sans légende",
  args: { showLegend: false, showValueAxis: false, margin: { left: 16 } },
  parameters: {
    docs: {
      description: {
        story: "`showValueAxis={false}` ne garde que la grille (les montants restent dans la bulle) ; `showLegend={false}` retire la légende quand le code couleur est connu du lecteur.",
      },
    },
  },
};

export const Zoomable: Story = {
  name: "Zoomable",
  args: { zoomable: true },
  parameters: { docs: { description: { story: "Avec `zoomable`, la molette resserre l'axe sur quelques marches et le glisser fait défiler les autres." } } },
};

export const Embedded: Story = {
  name: "Dans une carte",
  render: (args) => (
    <Card title="Trésorerie du trimestre" meta="T3 2026">
      <DeltaChart {...args} />
    </Card>
  ),
  args: { items: PONT_TRESORERIE, embedded: true, fullscreenToggle: false, height: 260 },
  parameters: { docs: { description: { story: "Dans une `Card`. `embedded` est prévu pour un conteneur qui a déjà son cadre. Dans la version actuelle du kit, les graphiques ne dessinent plus de cadre propre (`.lq-chart` est sans bordure ni fond) : la prop n'a donc plus d'effet visible, sa JSDoc est en retard sur le CSS. Elle reste sans risque et dit l'intention." } } },
};
