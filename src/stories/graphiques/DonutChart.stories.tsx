import type { Meta, StoryObj } from "@storybook/react-vite";
import { DonutChart, type DonutDatum } from "@michaelthomasjach/liseuse-dashboard-kit";
import { CA_PAR_GAMME, MOYENS_PAIEMENT } from "../../showcase/chartData";
import { CODE_LISIBLE, SOURCE_ABREGEE, kEuros, nombre } from "./communs";

/** Les gammes, couleurs imposées par variable du thème. */
const CA_PAR_GAMME_COLORE: DonutDatum[] = [
  { ...CA_PAR_GAMME[0], color: "var(--lq-color-violet)" },
  { ...CA_PAR_GAMME[1], color: "var(--lq-color-sky)" },
  { ...CA_PAR_GAMME[2], color: "var(--lq-color-green)" },
  { ...CA_PAR_GAMME[3], color: "var(--lq-color-amber)" },
];

const entier = (v: number) => nombre(v);

/**
 * L'anneau de répartition : les parts d'un tout, et le total au centre.
 */
const meta = {
  title: "Charts/DonutChart",
  component: DonutChart,
  parameters: {
    ...CODE_LISIBLE,
    docs: {
      source: SOURCE_ABREGEE,
      description: {
        component: [
          "Un anneau découpé en parts proportionnelles à `value`, le total au centre, une légende qui donne le pourcentage de chaque part. Chaque `DonutDatum` porte `id`, `label`, `value` et, au besoin, `color`.",
          "",
          "**Quand l'utiliser** — la composition d'un tout, en **peu de parts** (deux à six) : chiffre d'affaires par gamme, moyens de paiement, allocation d'un portefeuille. Au-delà, ou pour comparer des montants entre eux plutôt qu'à leur somme, un `BarChart` horizontal se lit mieux. Pour une seule proportion face à un objectif, `GaugeChart` ou une barre de progression.",
          "",
          "**Anatomie et variantes** — `size` fixe le diamètre (220 px par défaut ; le composant ne s'étire pas), `innerRadiusRatio` l'épaisseur de l'anneau (0,65 par défaut). Le centre affiche la somme des parts sous la légende « Total » ; `centerValue` et `centerCaption` les remplacent — un nombre d'éléments plutôt qu'une somme, par exemple. `legendPosition` place la légende en bas (défaut), à gauche ou à droite ; `showLegend={false}` la retire. `shape=\"square\"` borde les parts d'un carré au lieu d'un cercle, sur la même emprise.",
          "",
          "**Interactions** — survoler une part (ou la presser longuement au doigt) la fait saillir et remplace le centre par sa valeur et son libellé ; survoler une entrée de légende fait de même. `formatValue` met en forme le centre.",
          "",
          "**Thème** — les parts tournent sur la palette `--lq-color-accent`, `--lq-color-green`, `--lq-color-amber`, `--lq-color-sky`, `--lq-color-rose`, `--lq-color-violet` (l'accent du thème étant le violet, une sixième part reprend la teinte de la première : imposez `color` si vous en avez six). Le centre et la légende lisent `--lq-color-text` et `--lq-color-text-muted` ; le liseré entre les parts, `--lq-color-panel`.",
        ].join("\n"),
      },
    },
  },
  args: { data: CA_PAR_GAMME, size: 200, formatValue: kEuros, legendPosition: "right", centerCaption: "CA annuel" },
  argTypes: {
    data: { control: false },
    formatValue: { control: false },
    centerValue: { control: "text" },
    innerRadiusRatio: { control: { type: "range", min: 0.3, max: 0.9, step: 0.05 } },
  },
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Le chiffre d'affaires annuel par gamme, légende à droite. Survolez une part : le centre passe de la somme à sa valeur." } } },
};

export const LegendBottom: Story = {
  name: "Légende dessous",
  args: { legendPosition: "bottom" },
  parameters: { docs: { description: { story: "La position par défaut, pour une colonne étroite." } } },
};

export const LegendLeft: Story = {
  name: "Légende à gauche",
  args: { legendPosition: "left" },
};

export const CustomCenter: Story = {
  name: "Centre imposé",
  args: { data: MOYENS_PAIEMENT, centerValue: "833", centerCaption: "Factures", formatValue: entier },
  parameters: {
    docs: {
      description: {
        story: "`centerValue` et `centerCaption` remplacent la somme et « Total » quand le centre doit dire autre chose — ici le nombre de factures encaissées. Le survol d'une part reprend la main comme d'habitude.",
      },
    },
  },
};

export const Square: Story = {
  name: "Forme carrée",
  args: { data: MOYENS_PAIEMENT, shape: "square", centerValue: "833", centerCaption: "Factures", formatValue: entier },
  parameters: {
    docs: {
      description: {
        story: "`shape=\"square\"` : le bord extérieur des parts suit un carré. L'emprise ne change pas — les coins du carré atteignent le bord qu'aurait le cercle.",
      },
    },
  },
};

export const ThinRing: Story = {
  name: "Anneau fin",
  args: { innerRadiusRatio: 0.82 },
  parameters: { docs: { description: { story: "Un `innerRadiusRatio` élevé affine l'anneau et laisse plus de place au centre." } } },
};

export const CustomColors: Story = {
  name: "Couleurs imposées",
  args: { data: CA_PAR_GAMME_COLORE },
  parameters: {
    docs: {
      description: {
        story: "`DonutDatum.color` fixe la teinte d'une part, toujours par variable du thème (`var(--lq-color-violet)`, `var(--lq-color-sky)`…) pour suivre la surface sombre.",
      },
    },
  },
};

export const Compact: Story = {
  name: "Compact, sans légende",
  args: { size: 120, showLegend: false, centerCaption: undefined },
  parameters: {
    docs: {
      description: {
        story: "Pour une tuile d'indicateur : petit diamètre, pas de légende — les libellés restent lisibles au survol, dans le centre.",
      },
    },
  },
};
