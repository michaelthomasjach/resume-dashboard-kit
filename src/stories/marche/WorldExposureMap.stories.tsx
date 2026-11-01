import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorldExposureMap, type WorldExposureDatum } from "@michaelthomasjach/liseuse-dashboard-kit";
import { EXPOSITION_MONDE } from "../../showcase/chartData";
import { CODE_LISIBLE, SOURCE_ABREGEE } from "../graphiques/communs";

/** Deux régions seulement, sous des libellés courts que la carte sait reconnaître. */
const CONCENTREE: WorldExposureDatum[] = [
  { id: "us", label: "US", value: 82 },
  { id: "eu", label: "Europe", value: 18 },
];

/** Un fonds largement « Global » : une part qui ne se pose sur aucune région. */
const NON_LOCALISABLE: WorldExposureDatum[] = [
  { id: "na", label: "Amérique du Nord", value: 40 },
  { id: "eu", label: "Europe", value: 25 },
  { id: "global", label: "Global", value: 20 },
  { id: "autre", label: "Autre", value: 15 },
];

/** Un chiffre d'affaires par zone, en M€ — la carte n'exige pas des pourcentages. */
const CA_PAR_ZONE: WorldExposureDatum[] = [
  { id: "eu", label: "Europe", value: 412 },
  { id: "na", label: "Amérique du Nord", value: 268 },
  { id: "asia", label: "Asie", value: 155 },
  { id: "me", label: "Moyen-Orient", value: 41 },
  { id: "oc", label: "Océanie", value: 22 },
];

const pourcentEntier = (v: number) => `${v} %`;
const millionsDEuros = (v: number) => `${v} M€`;

/**
 * La carte du monde par région : une exposition, un chiffre d'affaires, une répartition.
 */
const meta = {
  title: "Map/World Exposure Map",
  component: WorldExposureMap,
  parameters: {
    ...CODE_LISIBLE,
    docs: {
      source: SOURCE_ABREGEE,
      description: {
        component: [
          "Une carte du monde en aplats (choroplèthe) découpée en **huit régions** — Amérique du Nord, Amérique du Sud, Europe, Eurasie, Asie, Moyen-Orient, Afrique, Océanie — chacune teintée selon sa part du total : plus la part est grande, plus la teinte est soutenue. Une légende sous la carte reprend chaque région présente et sa valeur.",
          "",
          "**Quand l'utiliser** — une répartition géographique : l'exposition d'un portefeuille, un chiffre d'affaires par zone, des effectifs par continent. Pour comparer finement des montants, un `BarChart` horizontal reste plus précis ; la carte dit surtout **où**.",
          "",
          "**Les données** — chaque `WorldExposureDatum` porte `id`, `label` et `value`. C'est la carte qui traduit le libellé en région : « US », « USA », « Amérique du Nord », « Europe », « EU », « LATAM », « Asie »… sont reconnus, accents et casse ignorés ; plusieurs entrées tombant sur la même région s'additionnent. Un libellé qui ne se rattache à aucune région (« Global », « Autre ») n'est pas perdu : il s'additionne dans une ligne « Non localisable » sous la légende. `formatValue` met en forme la légende et la bulle.",
          "",
          "**Anatomie** — la carte (projection Natural Earth), à `width` × `height` px (480 × 260 par défaut — la largeur ne s'adapte pas d'elle-même), puis la légende.",
          "",
          "**Interactions** — survoler une région (ou la toucher au doigt) la cerne et ouvre une bulle : son nom, sa valeur et sa part du total. Survoler une entrée de légende cerne la région correspondante sur la carte.",
          "",
          "**Thème** — les régions mélangent `--lq-color-accent` à `--lq-color-panel`, de 30 à 90 % sur une rampe en racine carrée — les petites parts restent nettement teintées, y compris sur la surface sombre ; une région sans valeur reste en `--lq-color-panel`. Frontières en `--lq-color-border-subtle`, région survolée cernée de `--lq-color-text` ; bulle sur `--lq-color-panel`, `--lq-color-border`, `--lq-radius-sm` ; ligne « Non localisable » en `--lq-color-text-muted`.",

        ].join("\n"),
      },
    },
  },
  args: { data: EXPOSITION_MONDE, width: 560, height: 300, formatValue: pourcentEntier },
  argTypes: {
    data: { control: false },
    formatValue: { control: false },
    width: { control: { type: "range", min: 280, max: 1000, step: 10 } },
    height: { control: { type: "range", min: 160, max: 560, step: 10 } },
  },
} satisfies Meta<typeof WorldExposureMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: {
    docs: {
      description: {
        story: "L'exposition géographique d'un portefeuille, en % du total. « Global » ne se pose sur aucune région : il part dans la ligne « Non localisable ». Survolez l'Europe.",
      },
    },
  },
};

export const Concentrated: Story = {
  name: "Deux régions",
  args: { data: CONCENTREE },
  parameters: {
    docs: {
      description: {
        story: "« US » et « Europe » suffisent : la carte reconnaît les libellés courts. Les régions absentes restent à la couleur du panneau.",
      },
    },
  },
};

export const Unlocatable: Story = {
  name: "Parts non localisables",
  args: { data: NON_LOCALISABLE },
  parameters: {
    docs: {
      description: {
        story: "« Global » et « Autre » ne correspondent à aucune région : leurs 35 % s'additionnent dans la ligne « Non localisable » plutôt que de disparaître sans un mot.",
      },
    },
  },
};

export const Amounts: Story = {
  name: "Des montants plutôt que des parts",
  args: { data: CA_PAR_ZONE, formatValue: millionsDEuros },
  parameters: {
    docs: {
      description: {
        story: "Les valeurs n'ont pas à faire 100 : un chiffre d'affaires par zone, en M€. La bulle calcule elle-même la part de chaque région.",
      },
    },
  },
};

export const Large: Story = {
  name: "Grand format",
  args: { width: 900, height: 460 },
};

export const Small: Story = {
  name: "Vignette",
  args: { width: 320, height: 170 },
  parameters: { docs: { description: { story: "Dans une tuile de tableau de bord : la carte se lit encore, la légende passe à la ligne." } } },
};
