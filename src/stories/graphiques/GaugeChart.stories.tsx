import type { Meta, StoryObj } from "@storybook/react-vite";
import { GaugeChart, type GaugeThreshold } from "@michaelthomasjach/liseuse-dashboard-kit";
import { CODE_LISIBLE } from "./communs";

const SEUILS_OBJECTIF: GaugeThreshold[] = [
  { upTo: 50, color: "var(--lq-color-down)", label: "Retard" },
  { upTo: 80, color: "var(--lq-color-warning)", label: "À suivre" },
  { upTo: 100, color: "var(--lq-color-up)", label: "Atteint" },
];

const SEUILS_RECOMMANDATION: GaugeThreshold[] = [
  { upTo: 20, color: "var(--lq-color-down)", label: "Vente forte" },
  { upTo: 40, color: "color-mix(in srgb, var(--lq-color-down) 50%, var(--lq-color-warning))", label: "Vente" },
  { upTo: 60, color: "var(--lq-color-warning)", label: "Neutre" },
  { upTo: 80, color: "color-mix(in srgb, var(--lq-color-warning) 50%, var(--lq-color-up))", label: "Achat" },
  { upTo: 100, color: "var(--lq-color-up)", label: "Achat fort" },
];

const pourcentEntier = (v: number) => `${v} %`;
const verdictDesAnalystes = () => "Achat";
const signe = (v: number) => `${v > 0 ? "+" : ""}${v}`;

/**
 * Le demi-cadran à aiguille : une valeur lue contre une échelle bornée.
 */
const meta = {
  title: "Charts/GaugeChart",
  component: GaugeChart,
  parameters: {
    ...CODE_LISIBLE,
    docs: {
      description: {
        component: [
          "Un demi-cercle gradué de `min` à `max` (0 à 100 par défaut), une aiguille sur `value`, la valeur en gros sous l'arc et `label` dessous. Sans seuils, la portion parcourue se remplit de l'accent sur une piste neutre ; avec `thresholds`, la piste se découpe en bandes colorées et l'aiguille dit dans laquelle on tombe.",
          "",
          "**Quand l'utiliser** — une seule grandeur bornée qu'on juge contre des zones : avancement d'un objectif, charge d'un serveur, score de risque, recommandation d'analystes. Pour plusieurs proportions à comparer, une barre de progression par ligne ou un `BarChart` horizontal ; pour les parts d'un tout, `DonutChart`.",
          "",
          "**Anatomie et variantes** — `size` est la largeur de l'arc (220 px par défaut, le composant ne s'étire pas) ; `formatValue` met en forme la valeur centrale. Chaque `GaugeThreshold` donne la borne haute de sa bande (`upTo`, dans l'unité de `value`), sa `color` et un `label` facultatif que `showBandLabels` écrit autour de l'arc — la jauge s'élargit alors d'elle-même pour leur faire place.",
          "",
          "**Interactions** — aucune : c'est une lecture, pas un contrôle. Pour saisir une valeur, prenez un curseur.",
          "",
          "**Thème** — l'arc rempli prend `--lq-color-accent`, la piste `--lq-color-fill-track`, l'aiguille et la valeur `--lq-color-text`, le libellé et les graduations `--lq-color-text-muted`. Les bandes de seuil se colorent par variable : `--lq-color-up`, `--lq-color-warning`, `--lq-color-down` pour une échelle de jugement, `color-mix()` entre deux d'entre elles pour les paliers intermédiaires.",
        ].join("\n"),
      },
    },
  },
  args: { value: 64, label: "Charge des serveurs", size: 200, formatValue: pourcentEntier },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    formatValue: { control: false },
    thresholds: { control: false },
  },
} satisfies Meta<typeof GaugeChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "La piste seule : la portion parcourue prend l'accent. Faites glisser `value` dans les contrôles." } } },
};

export const Thresholds: Story = {
  name: "Bandes de seuil",
  args: { value: 78, label: "Objectif annuel", thresholds: SEUILS_OBJECTIF },
  parameters: {
    docs: {
      description: {
        story: "`thresholds` découpe la piste : retard sous 50 %, à suivre jusqu'à 80 %, atteint au-delà. L'aiguille se lit contre les bandes.",
      },
    },
  },
};

export const BandLabels: Story = {
  name: "Bandes nommées",
  args: { value: 78, label: "Objectif annuel", thresholds: SEUILS_OBJECTIF, showBandLabels: true },
  parameters: { docs: { description: { story: "`showBandLabels` écrit le `label` de chaque bande à l'extérieur de l'arc." } } },
};

export const AnalystRating: Story = {
  name: "Recommandation d'analystes",
  args: {
    value: 72,
    label: "Consensus de 18 analystes",
    thresholds: SEUILS_RECOMMANDATION,
    showBandLabels: true,
    formatValue: verdictDesAnalystes,
  },
  parameters: {
    docs: {
      description: {
        story: "Cinq paliers, dont deux intermédiaires obtenus par `color-mix()` entre deux variables du thème. `formatValue` peut rendre un mot plutôt qu'un nombre.",
      },
    },
  },
};

export const CustomRange: Story = {
  name: "Échelle sur mesure",
  args: {
    value: 42,
    min: -100,
    max: 100,
    label: "Net Promoter Score",
    formatValue: signe,
    thresholds: [
      { upTo: 0, color: "var(--lq-color-down)" },
      { upTo: 30, color: "var(--lq-color-warning)" },
      { upTo: 100, color: "var(--lq-color-up)" },
    ],
  },
  argTypes: { value: { control: { type: "range", min: -100, max: 100, step: 1 } } },
  parameters: { docs: { description: { story: "`min` et `max` bornent l'échelle — ici de −100 à +100 ; les `upTo` des seuils s'expriment dans la même unité." } } },
};

export const Sizes: Story = {
  name: "Tailles",
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 24 }}>
      <GaugeChart {...args} size={120} label="120 px" />
      <GaugeChart {...args} size={170} label="170 px" />
      <GaugeChart {...args} size={240} label="240 px" />
    </div>
  ),
  args: { thresholds: SEUILS_OBJECTIF },
  parameters: { docs: { description: { story: "La jauge garde sa taille : `size` fixe la largeur de l'arc, la hauteur en découle." } } },
};
