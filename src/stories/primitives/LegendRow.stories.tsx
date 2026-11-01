import type { Meta, StoryObj } from "@storybook/react-vite";
import { LegendRow, DonutChart, Card } from "@michaelthomasjach/liseuse-dashboard-kit";
import { CA_PAR_GAMME } from "../../showcase/chartData";

/** Les parts du graphique, chacune avec la couleur de série que reprend sa ligne de légende. */
const SERIES_COLORS = ["var(--lq-color-accent)", "var(--lq-color-sky)", "var(--lq-color-amber)", "var(--lq-color-green)"];
const GAMMES = CA_PAR_GAMME.map((d, i) => ({ ...d, color: SERIES_COLORS[i % SERIES_COLORS.length] }));
const TOTAL_GAMMES = GAMMES.reduce((s, d) => s + d.value, 0);

const CHANNELS = [
  { label: "Vente directe", value: "48,2 %", color: "var(--lq-color-accent)" },
  { label: "Partenaires", value: "27,5 %", color: "var(--lq-color-sky)" },
  { label: "Place de marché", value: "16,1 %", color: "var(--lq-color-amber)" },
  { label: "Autres", value: "8,2 %", color: "var(--lq-color-text-muted)" },
];

/**
 * La ligne de légende : une pastille, un intitulé, une valeur, un filet dessous.
 */
const meta = {
  title: "Primitives/LegendRow",
  component: LegendRow,
  parameters: {
    docs: {
      description: {
        component: [
          "Une ligne de répartition : pastille de couleur, intitulé, valeur alignée à droite, filet fin dessous. Les lignes s'empilent directement l'une sous l'autre ; le filet de la dernière disparaît tout seul, comme celui d'une `PanelRow`.",
          "",
          "**Quand l'utiliser** — la légende chiffrée d'un graphique en anneau ou en barres empilées, une répartition par canal, par secteur, par gamme. La pastille relie la ligne à sa série : donnez-lui **la même couleur** que dans le graphique. Pour une ligne libellé / valeur sans série, `PanelRow` ; pour la légende cliquable d'un graphique à courbes, celle qu'il intègre.",
          "",
          "**Couleur** — `color` accepte toute couleur CSS ; préférez les variables de série du thème (`--lq-color-sky`, `--lq-color-amber`…) pour suivre la surface sombre.",
          "",
          "`label` et `value` acceptent des nœuds React : un lien, un `Badge`, une variation colorée.",
          "",
          "**Thème** — `--lq-row-font-size`, `--lq-font-weight-semibold`, `--lq-color-text`, `--lq-color-border-subtle` (filet), `--lq-space-3`.",
        ].join("\n"),
      },
    },
  },
  args: { color: "var(--lq-color-accent)", label: "Vente directe", value: "48,2 %" },
  argTypes: { color: { control: "text" }, label: { control: "text" }, value: { control: "text" } },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LegendRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Breakdown: Story = {
  name: "Répartition",
  render: () => (
    <div>
      {CHANNELS.map((c) => (
        <LegendRow key={c.label} color={c.color} label={c.label} value={c.value} />
      ))}
    </div>
  ),
  parameters: { docs: { description: { story: "Les lignes empilées : le filet de la dernière disparaît." } } },
};

export const WithChart: Story = {
  name: "Sous un graphique en anneau",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Card title="Chiffre d'affaires par gamme" meta="oct. 2026">
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <DonutChart data={GAMMES} size={180} showLegend={false} />
      </div>
      {GAMMES.map((d) => (
        <LegendRow key={d.id} color={d.color} label={d.label} value={`${((d.value / TOTAL_GAMMES) * 100).toFixed(1).replace(".", ",")} %`} />
      ))}
    </Card>
  ),
  parameters: { docs: { description: { story: "L'usage d'origine : la légende chiffrée d'un anneau, chaque pastille de la couleur de sa part." } } },
};
