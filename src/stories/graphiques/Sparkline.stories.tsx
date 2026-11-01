import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkline, Text } from "@michaelthomasjach/liseuse-dashboard-kit";
import { KPI_TENDANCES } from "../../showcase/chartData";
import { CODE_LISIBLE, SOURCE_ABREGEE } from "./communs";

const [MRR, CONVERSION] = KPI_TENDANCES;

/**
 * La ligne de tendance sans axe, pour une cellule, une tuile, une liste.
 */
const meta = {
  title: "Charts/Sparkline",
  component: Sparkline,
  parameters: {
    ...CODE_LISIBLE,
    docs: {
      source: SOURCE_ABREGEE,
      description: {
        component: [
          "Une courbe minimale — ni axe, ni grille, ni légende, ni survol — tracée d'une suite de nombres (`data`, le plus ancien d'abord). Elle dit **dans quel sens** va une grandeur, pas combien elle vaut : la valeur s'écrit à côté.",
          "",
          "**Quand l'utiliser** — à côté d'un chiffre : une ligne de tableau, une tuile d'indicateur, une liste de surveillance. Dès qu'il faut lire une valeur à une date, comparer des séries ou zoomer, passez à `LineAreaChart`.",
          "",
          "**Anatomie et variantes** — une taille fixe (`width` × `height`, 96 × 28 px par défaut), `strokeWidth` (1,5 px), `area` pour remplir sous la courbe, `colorByTrend` pour la colorer selon que la dernière valeur dépasse la première ou non, `color` pour imposer une teinte. Elle se rend en bloc, sans marge : on la pose dans une cellule ou une grille, à côté de la valeur.",
          "",
          "**Interactions** — aucune.",
          "",
          "**Thème** — `--lq-color-accent` par défaut ; `--lq-color-up` et `--lq-color-down` avec `colorByTrend`. Une `color` imposée passe par une variable (`var(--lq-color-sky)`…) pour suivre la surface sombre.",
        ].join("\n"),
      },
    },
  },
  args: { data: MRR.data, width: 140, height: 32 },
  argTypes: {
    data: { control: false },
    color: { control: "color" },
    strokeWidth: { control: { type: "range", min: 1, max: 4, step: 0.5 } },
  },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Le revenu récurrent sur trente jours." } } },
};

export const Area: Story = {
  name: "Avec aire",
  args: { area: true },
};

export const ColorByTrend: Story = {
  name: "Couleur selon la tendance",
  render: (args) => (
    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
      <Sparkline {...args} data={MRR.data} />
      <Sparkline {...args} data={CONVERSION.data} />
    </div>
  ),
  args: { colorByTrend: true, area: true },
  parameters: {
    docs: {
      description: {
        story: "`colorByTrend` compare la dernière valeur à la première : le revenu récurrent monte (`--lq-color-up`), le taux de conversion baisse (`--lq-color-down`). Attention au sens : pour un nombre de tickets ouverts, baisser est une bonne nouvelle, et la couleur dirait l'inverse.",
      },
    },
  },
};

export const CustomColor: Story = {
  name: "Couleur imposée",
  args: { color: "var(--lq-color-sky)", strokeWidth: 2, area: true },
};

export const KpiList: Story = {
  name: "Dans une liste d'indicateurs",
  render: (args) => (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(160px, max-content) 80px auto", alignItems: "center", gap: "10px 24px", maxWidth: 480 }}>
      {KPI_TENDANCES.map((k, i) => (
        <div key={k.id} style={{ display: "contents" }}>
          <Text size="sm" muted>
            {k.label}
          </Text>
          <Text size="sm">{k.value}</Text>
          <Sparkline {...args} data={k.data} area={i % 2 === 1} colorByTrend={i < 2} />
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "L'usage type : libellé, valeur, tendance. La couleur selon la tendance est réservée aux indicateurs où monter est bon ; les autres restent à l'accent.",
      },
    },
  },
};
