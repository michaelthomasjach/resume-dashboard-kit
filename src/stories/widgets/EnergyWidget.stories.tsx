import type { Meta, StoryObj } from "@storybook/react-vite";
import { EnergyWidget, BatteryIcon, BoltIcon, PlugIcon, SolarPanelIcon, type EnergyMetricRow } from "@michaelthomasjach/liseuse-dashboard-kit";

const ROWS: EnergyMetricRow[] = [
  { id: "solaire", icon: <SolarPanelIcon />, label: "Solaire produit", value: "6,4 kWh", details: ["1 120 W à l'instant", "Hier · 5,9 kWh"] },
  { id: "batterie", icon: <BatteryIcon />, label: "Batterie maison", value: "68 %", gaugePercent: 68 },
  { id: "reseau", icon: <PlugIcon />, label: "Réseau consommé", value: "4,2 kWh" },
  { id: "cout", label: "Coût du jour", value: "0,87 €" },
];

/**
 * Le panneau « Énergie » : production, stockage, consommation et coût, en lignes de natures
 * différentes — une valeur, des détails, ou une jauge.
 */
const meta = {
  title: "Widgets/EnergyWidget",
  component: EnergyWidget,
  parameters: {
    docs: {
      description: {
        component: [
          "Panneau **« Énergie »** : des lignes de mesure hétérogènes dans un même cadre — la production solaire avec ses détails, la batterie en jauge, le réseau et le coût en simple valeur.",
          "",
          "**Quand l'utiliser** — pour le bilan énergétique d'une maison, d'un site ou d'une machine, où certaines lignes méritent une précision (« 1 120 W à l'instant ») et d'autres une jauge. Pour une liste homogène de libellés et de valeurs, `MetricListWidget` est plus simple ; pour la demande face à une capacité, `DemandMeters`.",
          "",
          "**Données** — chaque ligne (`EnergyMetricRow`) a un `id`, un `label`, une `value` déjà formatée, et au choix : une `icon` devant le libellé ; des `details`, lignes atténuées sous le libellé ; un `gaugePercent` (0 à 100) qui **remplace** le texte de `value` par une jauge `LevelGauge` posée sous le libellé, avec son propre pourcentage — c'est la ligne de batterie ; `value` n'est alors plus affiché.",
          "",
          "**Comportement** — affichage seul : aucune ligne n'est cliquable, le widget ne calcule rien et n'arrondit rien. `title` vaut « Énergie » par défaut ; `meta`, à droite du titre, dit la période (« aujourd'hui »).",
          "",
          "**Thème** — `--lq-color-text`, `--lq-color-text-muted` (détails), `--lq-color-border-subtle` (filets entre lignes), `--lq-space-2`, `--lq-space-3`, `--lq-font-weight-bold` (valeurs), celles du panneau et de `LevelGauge` (`--lq-color-fill`, `--lq-color-fill-track`).",
        ].join("\n"),
      },
    },
  },
  args: { title: "Énergie", meta: "aujourd'hui", rows: ROWS },
  argTypes: {
    title: { control: "text" },
    meta: { control: "text" },
    rows: { control: false },
  },
  render: (args) => (
    <div style={{ maxWidth: 380 }}>
      <EnergyWidget {...args} />
    </div>
  ),
} satisfies Meta<typeof EnergyWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const ValuesOnly: Story = {
  name: "Valeurs seules",
  args: {
    meta: "octobre 2026",
    rows: [
      { id: "conso", label: "Consommation", value: "312 kWh" },
      { id: "prod", label: "Production", value: "148 kWh" },
      { id: "autoconso", label: "Autoconsommation", value: "87 %" },
      { id: "facture", label: "Facture estimée", value: "54,20 €" },
    ],
  },
  parameters: { docs: { description: { story: "Sans icône, détail ni jauge : le panneau se lit comme un relevé." } } },
};

export const Gauges: Story = {
  name: "Plusieurs jauges",
  args: {
    title: "Stockage",
    meta: "3 batteries",
    rows: [
      { id: "b1", icon: <BatteryIcon />, label: "Garage", value: "92 %", gaugePercent: 92 },
      { id: "b2", icon: <BatteryIcon />, label: "Atelier", value: "41 %", gaugePercent: 41 },
      { id: "b3", icon: <BoltIcon />, label: "Véhicule", value: "18 %", gaugePercent: 18, details: ["Charge programmée à 22 h"] },
    ],
  },
  parameters: { docs: { description: { story: "`gaugePercent` remplace le texte de la valeur par une jauge ; les détails restent possibles." } } },
};
