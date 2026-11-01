import type { Meta, StoryObj } from "@storybook/react-vite";
import { PortfolioSummaryWidget } from "@michaelthomasjach/liseuse-dashboard-kit";
import { PORTFOLIO_HISTORY } from "../../showcase/demoData";

const euro = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const kEuro = (v: number) => `${Math.round(v / 1000)} k€`;
const day = (d: Date | number) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

const LAST = PORTFOLIO_HISTORY[PORTFOLIO_HISTORY.length - 1].y;

/** La même période, en repli : une suite calculée elle aussi, pour un rendu identique à chaque chargement. */
const FALLING = PORTFOLIO_HISTORY.map((p, i) => ({ x: p.x, y: Math.round(131_000 - i * 140 + Math.sin(i / 5) * 1_800) }));

/** Douze mois numérotés, pour l'axe linéaire. */
const MONTHLY = Array.from({ length: 12 }, (_, i) => ({ x: i + 1, y: 96_000 + i * 2_600 + (i % 3) * 1_400 }));

/**
 * La vue d'ensemble d'un portefeuille, prête à poser : la valeur, son écart, et l'historique en
 * courbe zoomable.
 */
const meta = {
  title: "Finance Widgets/PortfolioSummaryWidget",
  component: PortfolioSummaryWidget,
  parameters: {
    docs: {
      description: {
        component: [
          "Widget **prêt à poser** : une carte titrée qui donne la valeur actuelle d'un portefeuille (ou d'une trésorerie, d'un encours), son écart, et son historique en courbe d'aire.",
          "",
          "**Quand l'utiliser** — en tête d'une page de trésorerie ou de placements, quand la valeur **et** son évolution comptent. Pour la valeur seule avec une petite tendance, `StatCard` ; pour un graphique complet (plusieurs séries, légende, annotations), `LineAreaChart` dans une `Panel`.",
          "",
          "**Anatomie** — une `Panel` avec `title` (« Valeur du portefeuille » par défaut) et `meta` (la période, par exemple) ; la ligne de tête : `value` en grand (`ReactNode`, à formater vous-même) suivie de `delta` en `PriceChangeTag` ; dessous, une `LineAreaChart` de 160 px de haut, sans légende.",
          "",
          "**Courbe** — `series` est une liste de points `{ x, y }`. `xType=\"time\"` (défaut) attend des dates en `x` ; `\"linear\"` des nombres. Les graduations sont en français par défaut, dans la langue de `locale` (`\"fr-FR\"`) : « 12 500 » sur l'axe des valeurs, « juin », « 3 juin » ou « 2026 » sur l'axe du temps, « 01 juin 2026 » au survol ; `formatX` et `formatY` les remplacent. La courbe est celle de `LineAreaChart`, avec ses interactions : **molette** pour zoomer, **glisser** pour se déplacer, glisser un axe pour le réétirer, survol pour lire un point, et un bouton **plein écran** en haut à droite. Le widget n'expose aucune de ces options : pour les régler, composez `Panel` et `LineAreaChart` vous-même.",
          "",
          "**Format de l'écart** — `delta` sort en français (`+8,90 %`) ; `formatDelta` le remplace (il reçoit l'écart **en valeur absolue**, le signe et la flèche sont posés autour).",
          "",
          "**Thème** — la carte : `--lq-color-panel`, `--lq-shadow-panel`, `--lq-radius-lg` ; la valeur : `--lq-color-text`, `--lq-font-weight-bold` ; la courbe : `--lq-color-accent` ; l'écart : `--lq-color-up` / `--lq-color-down` ; `--lq-space-3`, `--lq-space-4`.",
        ].join("\n"),
      },
    },
  },
  args: {
    title: "Portefeuille de trésorerie",
    meta: "90 derniers jours",
    value: euro(LAST),
    delta: 8.9,
    series: PORTFOLIO_HISTORY,
    formatY: kEuro,
    formatX: day,
    xType: "time",
  },
  argTypes: {
    title: { control: "text", table: { defaultValue: { summary: '"Valeur du portefeuille"' } } },
    meta: { control: "text" },
    value: { control: "text" },
    delta: { control: { type: "number", step: 0.1 } },
    series: { control: false },
    formatX: { control: false },
    formatY: { control: false },
    formatDelta: { control: false },
    locale: { control: "text", table: { defaultValue: { summary: '"fr-FR"' } } },
    xType: { control: "inline-radio", options: ["time", "linear"], table: { defaultValue: { summary: '"time"' } } },
  },
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <PortfolioSummaryWidget {...args} />
    </div>
  ),
} satisfies Meta<typeof PortfolioSummaryWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Falling: Story = {
  name: "En repli",
  args: { title: "Portefeuille actions", value: euro(FALLING[FALLING.length - 1].y), delta: -9.4, series: FALLING },
  parameters: { docs: { description: { story: "L'écart passe au rouge ; la courbe, elle, garde la couleur d'accent quel que soit le sens." } } },
};

export const WithoutDelta: Story = {
  name: "Sans écart",
  args: { title: "Encours clients", meta: "au jour le jour", delta: undefined },
};

export const LinearAxis: Story = {
  name: "Axe numérique",
  args: {
    title: "Trésorerie de fin de mois",
    meta: "exercice 2026",
    value: euro(MONTHLY[MONTHLY.length - 1].y),
    delta: 31.4,
    series: MONTHLY,
    xType: "linear",
    formatX: (m: Date | number) => `M${m}`,
  },
  parameters: { docs: { description: { story: "Avec `xType=\"linear\"`, `x` est un nombre — ici le numéro du mois, écrit par `formatX`." } } },
};

export const DefaultTitle: Story = {
  name: "Titre par défaut",
  args: { title: undefined, meta: undefined },
  parameters: { docs: { description: { story: "Sans `title`, le widget s'intitule « Valeur du portefeuille »." } } },
};
