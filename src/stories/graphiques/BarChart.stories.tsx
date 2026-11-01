import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart, Card, type BarDatum } from "@michaelthomasjach/liseuse-dashboard-kit";
import { CA_CHARGES, ECART_BUDGET, TOP_CLIENTS, VENTES_CANAL, VENTES_SERIES } from "../../showcase/chartData";
import { CODE_LISIBLE, SOURCE_ABREGEE, kEuros, kEurosSigne, moisAnnee } from "./communs";

/** Les mêmes exercices, couleurs imposées par variable du thème. */
const VENTES_SERIES_COLOREES = [
  { id: "n1", label: "2025", color: "var(--lq-color-sky)" },
  { id: "n", label: "2026", color: "var(--lq-color-amber)" },
];

/** Vingt-quatre mois de chiffre d'affaires : assez de barres pour que le zoom serve. */
const CA_MENSUEL: BarDatum[] = CA_CHARGES[0].data.map((p, i) => ({ id: `m${i}`, label: moisAnnee(p.x), value: p.y }));

/** Une prévision par trimestre et sa fourchette basse–haute, en k€. */
const PREVISION_TRIMESTRES: BarDatum[] = [
  { id: "t1", label: "T1 2027", value: 268, error: [251, 284] },
  { id: "t2", label: "T2 2027", value: 281, error: [258, 305] },
  { id: "t3", label: "T3 2027", value: 246, error: [214, 279] },
  { id: "t4", label: "T4 2027", value: 302, error: [259, 348] },
];

/**
 * Barres par catégorie — une série, ou plusieurs groupées côte à côte.
 */
const meta = {
  title: "Charts/BarChart",
  component: BarChart,
  parameters: {
    ...CODE_LISIBLE,
    docs: {
      source: SOURCE_ABREGEE,
      description: {
        component: [
          "Un graphique en barres sur un axe de catégories. Chaque `BarDatum` porte `id` et `label` ; sa hauteur vient de `value` (une seule série) ou, quand le graphique reçoit `series`, de `values[serie.id]` — plusieurs barres groupées par catégorie, avec une légende. Une catégorie sans entrée pour une série ne dessine **aucune** barre pour elle, plutôt qu'une barre à zéro qui mentirait.",
          "",
          "**Quand l'utiliser** — comparer des catégories : canaux de vente, clients, mois, régions. Pour une grandeur continue dans le temps, préférez `LineAreaChart` ; pour les parts d'un tout, `DonutChart` ; pour expliquer comment un total devient un autre, `DeltaChart`.",
          "",
          "**Anatomie et variantes** — `orientation` vertical (défaut) ou horizontal (libellés longs : pensez à élargir `margin.left`) ; `colorByValue` colore chaque barre selon son signe ; `showValueLabels` écrit la valeur au bout de la barre ; `error` / `errors` dessinent une barre d'incertitude ; `showValueAxis={false}` ne garde que la grille. Les options d'axe (`showYAxisLine`, `hideYAxisLine`, `extendXAxisLine`) sont celles de `LineAreaChart`. `formatValue` met en forme l'axe, la bulle et les libellés. Toute la largeur du conteneur ; `height` vaut 320 px par défaut.",
          "",
          "**Interactions** — l'axe des catégories est zoomable comme celui d'un graphique de cours : molette pour zoomer vers le pointeur, glisser pour se déplacer, glisser sur l'axe des valeurs pour le dilater (double-clic pour le rétablir), bouton « Réinitialiser le zoom ». `zoomable={false}` fige la vue — le bon choix tant que toutes les barres tiennent. Survoler une barre ouvre sa bulle ; cliquer une entrée de légende masque sa série ; le bouton plein écran agrandit le graphique (Échap pour sortir).",
          "",
          "**Thème** — une série unique prend `--lq-color-accent` ; plusieurs séries tournent sur la palette `--lq-color-accent`, `--lq-color-green`, `--lq-color-amber`, `--lq-color-sky`, `--lq-color-rose`, `--lq-color-violet`, sauf `color` imposée par série (`BarSeriesDef.color`) ou par barre (`BarDatum.color`). `colorByValue` lit `--lq-color-up` et `--lq-color-down`. Axes et grille : `--lq-color-text-muted`, `--lq-color-border-subtle` ; pas de cadre propre, le graphique se pose à plat sur son conteneur.",
        ].join("\n"),
      },
    },
  },
  args: { data: TOP_CLIENTS, height: 300, formatValue: kEuros },
  argTypes: {
    data: { control: false },
    series: { control: false },
    formatValue: { control: false },
    margin: { control: false },
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Une série : les huit premiers clients de l'année, en k€ facturés." } } },
};

export const Grouped: Story = {
  name: "Barres groupées",
  args: { data: VENTES_CANAL, series: VENTES_SERIES, zoomable: false },
  parameters: {
    docs: {
      description: {
        story: "`series` active le mode groupé : une barre par exercice et par canal, lue dans `values`. La légende apparaît dès deux séries ; cliquer « 2025 » la masque.",
      },
    },
  },
};

export const Horizontal: Story = {
  name: "Horizontal, valeurs écrites",
  args: { orientation: "horizontal", showValueLabels: true, zoomable: false, margin: { left: 130, right: 64 } },
  parameters: {
    docs: {
      description: {
        story: "À l'horizontale, les libellés longs se lisent sans rotation. La marge gauche s'élargit pour eux, la droite pour les valeurs que `showValueLabels` écrit au bout des barres.",
      },
    },
  },
};

export const GroupedHorizontal: Story = {
  name: "Groupées à l'horizontale",
  args: { data: VENTES_CANAL, series: VENTES_SERIES, orientation: "horizontal", zoomable: false, margin: { left: 120 } },
};

export const ColorByValue: Story = {
  name: "Couleur selon le signe",
  args: { data: ECART_BUDGET, formatValue: kEurosSigne, colorByValue: true, zoomable: false, height: 240 },
  parameters: {
    docs: {
      description: {
        story: "`colorByValue` : l'écart mensuel au budget prend `--lq-color-up` quand le mois a fait mieux que prévu, `--lq-color-down` sinon. Une série seulement — en mode groupé, la couleur appartient à la série.",
      },
    },
  },
};

export const SeriesColors: Story = {
  name: "Couleurs imposées",
  args: { data: VENTES_CANAL, series: VENTES_SERIES_COLOREES, zoomable: false },
  parameters: {
    docs: {
      description: {
        story: "`BarSeriesDef.color` fixe la teinte d'une série — par variable du thème (`var(--lq-color-sky)`, `var(--lq-color-amber)`), pour suivre le passage en sombre.",
      },
    },
  },
};

export const ErrorBars: Story = {
  name: "Fourchettes d'incertitude",
  args: { data: PREVISION_TRIMESTRES, showValueLabels: true, zoomable: false, height: 280 },
  parameters: {
    docs: {
      description: {
        story: "`error: [bas, haut]` dessine une moustache sur la barre — ici la prévision de chiffre d'affaires de chaque trimestre et sa fourchette. En mode groupé, `errors` en donne une par série.",
      },
    },
  },
};

export const WithoutValueAxis: Story = {
  name: "Sans axe des valeurs",
  args: { data: VENTES_CANAL, series: VENTES_SERIES, showValueAxis: false, showValueLabels: true, zoomable: false, margin: { left: 16 } },
  parameters: {
    docs: {
      description: {
        story: "`showValueAxis={false}` ne garde que la grille : les valeurs écrites au bout des barres suffisent, et la marge gauche se resserre.",
      },
    },
  },
};

export const ManyBars: Story = {
  name: "Beaucoup de barres",
  args: { data: CA_MENSUEL, height: 260 },
  parameters: {
    docs: {
      description: {
        story: "Vingt-quatre mois : la molette resserre l'axe sur quelques mois, glisser fait défiler les autres, le bouton de la barre d'outils rétablit la vue entière.",
      },
    },
  },
};

export const Embedded: Story = {
  name: "Dans une carte",
  render: (args) => (
    <Card title="Ventes par canal" meta="2025 CONTRE 2026">
      <BarChart {...args} />
    </Card>
  ),
  args: { data: VENTES_CANAL, series: VENTES_SERIES, embedded: true, zoomable: false, fullscreenToggle: false, height: 260 },
  parameters: {
    docs: {
      description: {
        story: "Dans une `Card` : `fullscreenToggle={false}` retire le bouton plein écran d'une petite carte. `embedded` est prévu pour un conteneur qui a déjà son cadre. Dans la version actuelle du kit, les graphiques ne dessinent plus de cadre propre (`.lq-chart` est sans bordure ni fond) : la prop n'a donc plus d'effet visible, sa JSDoc est en retard sur le CSS. Elle reste sans risque et dit l'intention.",
      },
    },
  },
};
