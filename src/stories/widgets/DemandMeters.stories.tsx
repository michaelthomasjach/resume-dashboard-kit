import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DemandMeters, BoltIcon, BoxesIcon, GaugeIcon, LayersIcon, SnowflakeIcon, type DemandMeter } from "@michaelthomasjach/liseuse-dashboard-kit";
import { DEMAND } from "../../showcase/widgetData";

const ICONS: Record<string, ReactNode> = {
  cpu: <GaugeIcon />,
  memoire: <LayersIcon />,
  stockage: <BoxesIcon />,
  reseau: <BoltIcon />,
  froid: <SnowflakeIcon />,
};

/** Le ton qu'on donne à une demande : ça va, ça tire, ça déborde. */
const toneOf = (v: number): DemandMeter["tone"] => (v > 1 ? "critical" : v > 0.8 ? "warning" : v < 0.35 ? "good" : "neutral");

const METERS: DemandMeter[] = DEMAND.map((d) => ({ ...d, icon: ICONS[d.id], tone: toneOf(d.value) }));

/**
 * Des jauges de demande face à la capacité, poste par poste. Au-delà de 100 %, la barre déborde en
 * chevrons : c'est le moment d'agir.
 */
const meta = {
  title: "Widgets/DemandMeters",
  component: DemandMeters,
  parameters: {
    docs: {
      description: {
        component: [
          "Une rangée de **jauges de demande** : pour chaque poste (calcul, mémoire, réseau…), la part de la capacité qui est demandée. Une valeur **au-delà de 1** déborde : la barre se remplit et des **chevrons** battent au bout — la demande excède ce qu'on peut offrir.",
          "",
          "**Quand l'utiliser** — pour comparer plusieurs charges à leur capacité d'un coup d'œil : l'infrastructure d'un service, les postes d'un entrepôt, les équipes d'un plateau. Pour une seule valeur bornée, `ProgressBar` ou `GaugeChart` ; pour un partage entre postes qui somme à 100 %, `AllocationSlider`.",
          "",
          "**Données** — chaque jauge (`DemandMeter`) porte `id`, `label` (nom court, aussi nom accessible), `value` (fraction : 0 à 1, au-delà = débordement), et au besoin `icon`, `tone` et `detail`. Le **ton** colore le remplissage : `good` en vert, `warning` en ambre, `critical` au rouge de danger, `neutral` (défaut) à l'accent. C'est à l'application de choisir le ton selon ses seuils.",
          "",
          "**Variantes** — `orientation=\"horizontal\"` (défaut) : des barres couchées, qui passent à la ligne quand la place manque ; `\"vertical\"` : des colonnes, pour un coin de tableau de bord. `compact` masque les noms (il faut alors une icône), resserre les barres et en tient cinq ou six sur 360 px.",
          "",
          "**Comportement** — chaque jauge est atteignable au clavier ; au survol et au focus, une infobulle montre `detail`, ou à défaut le nom et le pourcentage. Accessibilité : `role=\"meter\"` exprimé en pourcentage, qui peut dépasser 100 — on ne ment pas sur la demande. Les chevrons se figent si le système demande moins d'animations.",
          "",
          "**Thème** — `--lq-color-accent`, `--lq-color-green`, `--lq-color-amber`, `--lq-color-danger` (tons), `--lq-color-panel`, `--lq-color-border`, `--lq-color-text`, `--lq-color-text-muted`, `--lq-text-xs`, `--lq-transition-base`.",
        ].join("\n"),
      },
    },
  },
  args: { meters: METERS, orientation: "horizontal", compact: false },
  argTypes: { meters: { control: false } },
} satisfies Meta<typeof DemandMeters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Vertical: Story = {
  name: "Vertical",
  args: { orientation: "vertical" },
};

export const Compact: Story = {
  name: "Compact",
  args: { compact: true },
  parameters: { docs: { description: { story: "Les noms disparaissent derrière les icônes ; ils restent dans l'infobulle et pour les lecteurs d'écran." } } },
};

export const VerticalCompact: Story = {
  name: "Vertical et compact",
  args: { orientation: "vertical", compact: true },
};

export const Tones: Story = {
  name: "Tons et débordement",
  args: {
    meters: [
      { id: "a", label: "Bon", value: 0.25, tone: "good", detail: "25 % : large marge" },
      { id: "b", label: "Neutre", value: 0.6, tone: "neutral", detail: "60 % : charge normale" },
      { id: "c", label: "Tendu", value: 0.9, tone: "warning", detail: "90 % : à surveiller" },
      { id: "d", label: "Critique", value: 0.98, tone: "critical", detail: "98 % : au bord" },
      { id: "e", label: "Débordé", value: 1.35, tone: "critical", detail: "135 % : la demande dépasse la capacité" },
    ],
  },
  parameters: { docs: { description: { story: "Les quatre tons, et une valeur à 1,35 : la barre pleine et ses chevrons." } } },
};
