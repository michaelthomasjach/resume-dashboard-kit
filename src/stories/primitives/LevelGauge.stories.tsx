import type { Meta, StoryObj } from "@storybook/react-vite";
import { LevelGauge, Panel, PanelRow, Text } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * La jauge à segments : une rangée de petites barres qui se remplissent, et une étiquette.
 */
const meta = {
  title: "Primitives/LevelGauge",
  component: LevelGauge,
  parameters: {
    docs: {
      description: {
        component: [
          "Indicateur de niveau en barres discrètes, à la manière d'un indicateur de batterie ou de volume : `value` de 0 à 100 remplit `segments` barres (10 par défaut), arrondi au segment le plus proche. Une `label` facultative suit la jauge (« 72 % », « plein », « ouvert »).",
          "",
          "**Quand l'utiliser** — un niveau qu'on lit d'un coup d'œil dans une ligne dense, où la précision au point près n'importe pas : un quota, un stockage, l'ouverture d'un volet. Pour une progression précise ou une tâche en cours, `ProgressBar` ; pour une valeur à régler, `RangeSlider` ; pour un niveau mis en scène sur un cadran, `GaugeChart`.",
          "",
          "**Tailles** — `md` (défaut) : barres de 4 × 16 px ; `sm` : 3 × 12 px, pour une ligne de tableau. Plus de `segments` donne une lecture plus fine.",
          "",
          "**Accessibilité** — `role=\"meter\"` avec `aria-valuenow` (la valeur, bornée entre 0 et 100), `aria-valuemin` et `aria-valuemax`. Donnez-lui un nom par `ariaLabel` : les barres seules ne disent pas ce qu'elles mesurent.",
          "",
          "**Thème** — `--lq-color-fill` (segments pleins), `--lq-color-fill-track` (segments vides), `--lq-color-border`, `--lq-space-2` ; l'étiquette en `--lq-color-text-muted`.",
        ].join("\n"),
      },
    },
  },
  args: { value: 72, label: "72 %", ariaLabel: "Quota d'utilisateurs" },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    segments: { control: { type: "number", min: 2, max: 40 } },
    label: { control: "text" },
  },
} satisfies Meta<typeof LevelGauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Full: Story = {
  name: "Plein",
  args: { value: 100, label: "plein", ariaLabel: "Stockage" },
};

export const Empty: Story = {
  name: "Vide",
  args: { value: 0, label: "aucun", ariaLabel: "Incidents ouverts" },
};

export const SmallFine: Story = {
  name: "Petite et fine",
  args: { value: 35, segments: 16, size: "sm", label: "35 %", ariaLabel: "Objectif trimestriel" },
  parameters: { docs: { description: { story: "`size=\"sm\"` et seize segments : une lecture plus fine, assez petite pour une ligne de tableau." } } },
};

export const WithoutLabel: Story = {
  name: "Sans étiquette",
  args: { value: 60, label: null, ariaLabel: "Ouverture du volet" },
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Text size="sm">Volet du salon</Text>
      <LevelGauge {...args} />
    </div>
  ),
  parameters: { docs: { description: { story: "`label={null}` : la jauge seule, quand l'intitulé voisin suffit. `ariaLabel` reste indispensable." } } },
};

export const InPanel: Story = {
  name: "Dans un panneau",
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Panel title="Ressources" meta="formule Équipe">
        <PanelRow label="Utilisateurs">
          <LevelGauge value={75} label="9 / 12" ariaLabel="Utilisateurs" />
        </PanelRow>
        <PanelRow label="Stockage">
          <LevelGauge value={42} label="42 %" ariaLabel="Stockage" />
        </PanelRow>
        <PanelRow label="Appels d'API">
          <LevelGauge value={96} label="96 %" ariaLabel="Appels d'API" />
        </PanelRow>
      </Panel>
    </div>
  ),
  parameters: { docs: { description: { story: "Une jauge par ligne de `PanelRow` : les barres s'alignent d'une ligne à l'autre." } } },
};
