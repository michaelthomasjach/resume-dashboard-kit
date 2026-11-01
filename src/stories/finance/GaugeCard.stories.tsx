import type { Meta, StoryObj } from "@storybook/react-vite";
import { GaugeCard } from "@michaelthomasjach/liseuse-dashboard-kit";

/** Trois bandes de seuil, du vert au rouge, lues dans les variables du thème. */
const RISK_BANDS = [
  { upTo: 33, color: "var(--lq-color-up)", label: "Faible" },
  { upTo: 66, color: "var(--lq-color-warning)", label: "Modéré" },
  { upTo: 100, color: "var(--lq-color-down)", label: "Élevé" },
];

/** Les mêmes, à l'envers et sur une autre échelle : pour un délai, peu c'est bien. */
const DELAY_BANDS = [
  { upTo: 30, color: "var(--lq-color-up)" },
  { upTo: 45, color: "var(--lq-color-warning)" },
  { upTo: 60, color: "var(--lq-color-down)" },
];

/**
 * Une jauge en demi-cercle dans une carte titrée : un score, une progression vers un objectif, une
 * dérive.
 */
const meta = {
  title: "Finance/GaugeCard",
  component: GaugeCard,
  parameters: {
    docs: {
      description: {
        component: [
          "Carte qui place une **valeur sur une échelle bornée** avec une jauge en demi-cercle et son aiguille : score de risque, avancement d'un objectif, taux d'utilisation.",
          "",
          "**Quand l'utiliser** — quand la position de la valeur entre un minimum et un maximum compte plus que la valeur elle-même, et qu'il y a des seuils à lire (vert, orange, rouge). Pour une simple progression linéaire, `ProgressBar` est plus sobre ; pour la jauge seule, sans carte, `GaugeChart`.",
          "",
          "**Anatomie** — une `Panel` avec `title` et `meta` (à droite de l'en-tête — idéal pour le verdict en un mot), une `GaugeChart` de 180 px, et `description` dessous. L'aiguille pointe la valeur, et la valeur s'écrit en chiffres sous l'arc, passée à `formatValue` si fourni.",
          "",
          "**Échelle et seuils** — `min` et `max` bornent l'échelle (0 et 100 par défaut). `thresholds` découpe la piste en bandes `{ upTo, color }`, dans l'unité de `value` et dans l'ordre croissant. Passez des couleurs du thème (`var(--lq-color-up)`…) pour qu'elles suivent la surface claire ou sombre. Avec des seuils, ce sont les bandes qui forment la piste, et seule l'aiguille bouge ; sans `thresholds`, la piste est grise et un arc d'accent la remplit jusqu'à la valeur.",
          "",
          "**Libellés des bandes** — `showBandLabels` écrit le `label` de chaque seuil autour de l'arc (option transmise à `GaugeChart`) ; désactivé par défaut.",
          "",
          "**Thème** — `--lq-color-accent` et `--lq-color-fill-track` (jauge sans seuils), `--lq-color-text` (aiguille et valeur), `--lq-color-up`, `--lq-color-warning`, `--lq-color-down` (bandes de l'exemple), `--lq-color-text-muted` (description), et les variables de `Panel`.",
        ].join("\n"),
      },
    },
  },
  args: {
    title: "Score de risque",
    meta: "Modéré",
    description: "Volatilité et concentration du portefeuille.",
    value: 58,
    min: 0,
    max: 100,
    thresholds: RISK_BANDS,
  },
  argTypes: {
    title: { control: "text" },
    meta: { control: "text" },
    description: { control: "text" },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    min: { table: { defaultValue: { summary: "0" } } },
    max: { table: { defaultValue: { summary: "100" } } },
    thresholds: { control: false },
    showBandLabels: { control: "boolean", table: { defaultValue: { summary: "false" } } },
    formatValue: { control: false },
  },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <GaugeCard {...args} />
    </div>
  ),
} satisfies Meta<typeof GaugeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Progress: Story = {
  name: "Objectif, sans seuils",
  args: {
    title: "Objectif trimestriel",
    meta: undefined,
    value: 72,
    thresholds: undefined,
    formatValue: (v: number) => `${v} %`,
    description: "72 % des 300 k€ visés, à cinq semaines de la clôture.",
  },
  parameters: { docs: { description: { story: "Sans `thresholds`, un arc de la couleur d'accent remplit la piste grise jusqu'à la valeur." } } },
};

export const OtherScale: Story = {
  name: "Autre échelle",
  args: {
    title: "Délai moyen de paiement",
    meta: "À surveiller",
    value: 38,
    min: 0,
    max: 60,
    thresholds: DELAY_BANDS,
    formatValue: (v: number) => `${v} j`,
    description: "Objectif : sous 30 jours. Au-delà de 45, relance systématique.",
  },
  argTypes: { value: { control: { type: "range", min: 0, max: 60, step: 1 } } },
  parameters: { docs: { description: { story: "`min`, `max` et les bornes `upTo` sont dans l'unité de la valeur — ici des jours, de 0 à 60." } } },
};

export const Pair: Story = {
  name: "Deux jauges côte à côte",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
      <GaugeCard title="Score de risque" meta="Faible" value={24} thresholds={RISK_BANDS} description="Portefeuille diversifié sur 14 lignes." />
      <GaugeCard title="Score de risque" meta="Élevé" value={81} thresholds={RISK_BANDS} description="Deux lignes pèsent 60 % de l'encours." />
    </div>
  ),
};

export const BandLabels: Story = {
  name: "Libellés des bandes",
  args: { showBandLabels: true },
  parameters: { docs: { description: { story: "`showBandLabels` : « Faible », « Modéré », « Élevé » s'écrivent au bord de leur bande." } } },
};
