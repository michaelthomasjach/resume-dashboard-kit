import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  WeatherWidget,
  CloudIcon,
  CloudRainIcon,
  PartlyCloudyIcon,
  SnowflakeIcon,
  SunIcon,
  WindIcon,
  type WeatherForecastDay,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { FORECAST } from "../../showcase/widgetData";

const SKY: Record<(typeof FORECAST)[number]["sky"], ReactNode> = {
  sun: <SunIcon size={20} />,
  partly: <PartlyCloudyIcon size={20} />,
  cloud: <CloudIcon size={20} />,
  rain: <CloudRainIcon size={20} />,
};

const DAYS: WeatherForecastDay[] = FORECAST.map((f) => ({ id: f.id, label: f.label, icon: SKY[f.sky], max: f.max, min: f.min }));

/**
 * La météo du moment, une vigilance et la prévision à quelques jours. Le widget ne va chercher
 * aucune donnée : il met en page des chaînes déjà formatées.
 */
const meta = {
  title: "Widgets/WeatherWidget",
  component: WeatherWidget,
  parameters: {
    docs: {
      description: {
        component: [
          "Panneau météo en trois étages : les **conditions du moment** (grande icône, température, libellé, minimum / maximum, risque de pluie), un **bandeau de vigilance** facultatif, puis une **bande de prévision** sur plusieurs jours.",
          "",
          "**Quand l'utiliser** — sur un écran domotique, un tableau de bord de site (chantier, entrepôt, événement) où le temps qu'il fait change ce qu'on décide. Pour une simple valeur (« 12 ° »), un `StatCard` ou une ligne de `MetricListWidget` suffit.",
          "",
          "**Données** — tout arrive formaté, sans unité de degré : le widget ajoute lui-même « ° » après `temperature`, `min`, `max` et les valeurs de la prévision. `precipitation` est un texte libre (« 20 % »), précédé de `precipitationIcon` si on en donne une. Aucun appel réseau : la source (Météo-France, Open-Meteo…) et son rafraîchissement restent à l'application, qui peut la citer dans `forecastTitle`.",
          "",
          "**Anatomie** — un panneau sans cadre (`Panel bare`) : il se pose dans une carte ou une cellule de grille sans doubler les bordures. `alert` dessine un bandeau à filet avec son icône ; `forecast` une rangée de jours (libellé, icône, maximum, minimum), absente si la liste est vide.",
          "",
          "**Icônes** — celles du kit : `SunIcon`, `PartlyCloudyIcon`, `CloudIcon`, `CloudRainIcon`, `SnowflakeIcon`, `WindIcon`. La plupart acceptent `animated` pour une boucle discrète, à garder pour la grande icône.",
          "",
          "**Thème** — `--lq-color-text`, `--lq-color-text-muted`, `--lq-space-1` à `--lq-space-4`, `--lq-radius-md`, `--lq-control-border-width` (le filet du bandeau), la famille `--lq-label-*` pour le titre de la prévision.",
        ].join("\n"),
      },
    },
  },
  args: {
    icon: <PartlyCloudyIcon animated />,
    temperature: "12",
    condition: "Partiellement nuageux",
    min: "7",
    max: "14",
    precipitation: "20 %",
    alert: { icon: <WindIcon size={16} />, label: "Vigilance jaune — Vent" },
    forecastTitle: "Prévision 5 jours",
    forecast: DAYS,
  },
  argTypes: {
    icon: { control: false },
    precipitationIcon: { control: false },
    alert: { control: false },
    forecast: { control: false },
    forecastTitle: { control: "text" },
  },
  render: (args) => (
    <div style={{ maxWidth: 380 }}>
      <WeatherWidget {...args} />
    </div>
  ),
} satisfies Meta<typeof WeatherWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const NoAlert: Story = {
  name: "Sans vigilance",
  args: { alert: undefined, icon: <SunIcon animated />, temperature: "15", condition: "Ensoleillé", min: "5", max: "15", precipitation: "0 %" },
};

export const CurrentOnly: Story = {
  name: "Conditions seules",
  args: { alert: undefined, forecast: undefined, forecastTitle: undefined },
  parameters: { docs: { description: { story: "Sans `forecast`, la bande de prévision disparaît : il reste le moment présent, pour une colonne étroite." } } },
};

export const Snow: Story = {
  name: "Neige et vigilance orange",
  parameters: { docs: { description: { story: "Des valeurs négatives : écrivez le vrai signe moins (−), le widget n'ajoute que le degré." } } },
  args: {
    icon: <SnowflakeIcon animated />,
    temperature: "−3",
    condition: "Chutes de neige",
    min: "−6",
    max: "−1",
    precipitation: "90 %",
    precipitationIcon: <CloudRainIcon size={14} />,
    alert: { icon: <SnowflakeIcon size={16} />, label: "Vigilance orange — Neige et verglas" },
    forecastTitle: "Prévision 3 jours",
    forecast: [
      { id: "sam", label: "Sam.", icon: <SnowflakeIcon size={20} />, max: "0", min: "−5" },
      { id: "dim", label: "Dim.", icon: <CloudIcon size={20} />, max: "2", min: "−3" },
      { id: "lun", label: "Lun.", icon: <SunIcon size={20} />, max: "4", min: "−4" },
    ],
  },
};
