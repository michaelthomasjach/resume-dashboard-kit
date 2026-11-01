import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Card, LineAreaChart, type ChartSeries } from "@michaelthomasjach/liseuse-dashboard-kit";
import { CA_CHARGES, KPI_TENDANCES, SEUIL_TRESORERIE, TRESORERIE } from "../../showcase/chartData";
import { CODE_LISIBLE, SOURCE_ABREGEE, kEuros, moisAnnee, nombre } from "./communs";

/** Le chiffre d'affaires seul, pour les variantes à une série. */
const CA_SEUL: ChartSeries[] = [CA_CHARGES[0]];

/** Les mêmes séries, couleurs imposées par variable du thème plutôt que tirées de la palette. */
const CA_CHARGES_COLOREES: ChartSeries[] = [
  { ...CA_CHARGES[0], color: "var(--lq-color-sky)", strokeWidth: 2.5 },
  { ...CA_CHARGES[1], color: "var(--lq-color-amber)", dashed: true },
];

/** Quatre indicateurs sur trente jours, en base 100, sur un axe X numérique (le jour 1 à 30). */
const INDICES_30J: ChartSeries[] = KPI_TENDANCES.map((k) => ({
  id: k.id,
  label: k.label,
  data: k.data.map((y, i) => ({ x: i + 1, y: Math.round((y / k.data[0]) * 1000) / 10 })),
}));

const numeroDeJour = (x: Date | number) => `J${+x}`;
const base100 = (y: number) => nombre(y, 1);

/**
 * Courbes et aires sur un axe continu — le graphique de tendance générique du kit.
 */
const meta = {
  title: "Charts/LineAreaChart",
  component: LineAreaChart,
  parameters: {
    ...CODE_LISIBLE,
    docs: {
      source: SOURCE_ABREGEE,
      description: {
        component: [
          "Une ou plusieurs séries tracées en courbes, avec ou sans aire, sur un axe X **temporel** (`xType=\"time\"`, des `Date`) ou **numérique** (`xType=\"linear\"`). Il occupe toute la largeur de son conteneur ; seule la hauteur se règle (`height`, 320 px par défaut).",
          "",
          "**Quand l'utiliser** — l'évolution d'une grandeur continue : chiffre d'affaires, trésorerie, effectifs, un indice. Pour comparer des catégories entre elles, prenez `BarChart` ; pour une tendance sans axe dans une cellule ou une tuile, `Sparkline` ; pour des cours ouverture-haut-bas-clôture, `CandlestickChart` ; pour expliquer le passage d'un total à un autre, `DeltaChart`.",
          "",
          "**Les séries** — chaque `ChartSeries` porte `id`, `label` (repris par la légende et la bulle) et `data` (`{ x, y }`, triés par `x`). Elle peut aussi imposer `color`, `strokeWidth`, `area`, `dashed` (une prévision, un contrefactuel), `band` (un éventail `low`/`high` autour de la courbe, compté dans l'échelle), `endDot` (un point sur la dernière valeur d'une série qui s'arrête avant les autres) et `fillSignedAtReference` (l'aire entre la courbe et `referenceLineY`, d'une couleur au-dessus et d'une autre en dessous).",
          "",
          "**Anatomie** — une barre d'outils en haut à droite (réinitialiser le zoom, plein écran), le tracé et sa grille, l'axe Y à gauche ou à droite (`yAxisOrientation`), l'axe X, la légende sous le tracé (`showLegend`) et la bulle de survol, un `ChartTooltip`. Les axes s'allègent à volonté : `showYAxis`, `showYAxisLine`, `hideYAxisLine`, `extendXAxisLine`, `xTicks`/`yTicks`, `xTickValues`, `xTickFormat`. `formatX` et `formatY` mettent en forme les graduations **et** la bulle. Sans eux, un axe temporel est en français (`locale`, `\"fr-FR\"` par défaut) : « juin », « 3 juin », « 2026 » sur l'axe, « 01 juin 2026 » dans la bulle.",
          "",
          "**Interactions** — la molette (ou le pincement) zoome l'axe X vers le pointeur, glisser dans le tracé le déplace ; glisser sur un axe le dilate, un double-clic sur cet axe le remet d'aplomb ; le bouton « Réinitialiser le zoom » ramène la vue entière (`zoomable={false}` fige tout, `showZoomReset={false}` masque le bouton pour qui pilote le zoom lui-même via `onZoomChange`). Le bouton plein écran agrandit le graphique à la fenêtre, Échap en sort. Cliquer une entrée de la légende masque ou rétablit sa série. `axisHoverLabels` remplace la bulle par des pastilles sur les axes, `measureActive` transforme le clic en règle de mesure, et `onHoverChange` + `syncedHoverX` synchronisent le survol de plusieurs graphiques.",
          "",
          "**Dates et fuseau** — l'axe temporel gradue en heure **locale** (d3 `scaleTime`) : sa graduation « 1er janvier » est le 1er janvier à minuit chez le lecteur. Des données datées à minuit UTC et un `formatX` qui lit en UTC décalent alors les libellés d'un mois (« déc. » sous le 1er janvier, à Paris). Le kit n'offre pas d'axe UTC ; le `formatX` des stories avance de douze heures avant de lire le mois, ce qui tombe juste dans tous les fuseaux.",
          "",
          "**Thème** — sans `color`, les séries tournent sur la palette catégorielle du kit : `--lq-color-accent`, `--lq-color-green`, `--lq-color-amber`, `--lq-color-sky`, `--lq-color-rose`, `--lq-color-violet` (dans ce thème l'accent et `--lq-color-sky` sont le même bleu du CV : une quatrième série reprend la teinte de la première). Graduations en `--lq-color-text-muted`, grille et trait d'axe en `--lq-color-border-subtle` ; pas de cadre ni de fond propres — le graphique se pose à plat sur son conteneur, une `Card` le cadre au besoin ; la bulle prend `--lq-color-panel`, `--lq-color-border`, `--lq-radius-md` et `--lq-shadow-modal`.",
        ].join("\n"),
      },
    },
  },
  args: {
    series: CA_CHARGES,
    area: true,
    height: 300,
    xType: "time",
    formatX: moisAnnee,
    formatY: kEuros,
  },
  argTypes: {
    series: { control: false },
    formatX: { control: false },
    formatY: { control: false },
    locale: { control: "text", table: { defaultValue: { summary: '"fr-FR"' } } },
    xTickFormat: { control: false },
    xTickValues: { control: false },
    xDomainPadding: { control: false },
    fillBetween: { control: false },
    margin: { control: false },
    onZoomChange: { control: false },
    onHoverChange: { control: false },
    syncedHoverX: { control: false },
  },
} satisfies Meta<typeof LineAreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: {
    docs: {
      description: {
        story: "Chiffre d'affaires et charges mensuels sur deux ans, en aires. Molette pour zoomer, glisser pour se déplacer, cliquer une entrée de la légende pour masquer sa série.",
      },
    },
  },
};

export const Lines: Story = {
  name: "Courbes seules",
  args: { area: false },
};

export const Forecast: Story = {
  name: "Prévision et seuil",
  args: { series: TRESORERIE, area: false, height: 280, referenceLineY: SEUIL_TRESORERIE, zoomable: false },
  parameters: {
    docs: {
      description: {
        story: "La trésorerie réalisée en aire, puis une prévision en tirets (`dashed`) entourée de son éventail de scénarios (`band`). `referenceLineY` trace le seuil d'alerte de 120 k€ ; `zoomable={false}` fige la vue d'un graphique qu'on lit d'un coup d'œil.",
      },
    },
  },
};

export const LinearCurve: Story = {
  name: "Segments droits",
  args: { series: CA_SEUL, area: false, curveType: "linear", showLegend: false, height: 260 },
  parameters: {
    docs: {
      description: {
        story: "`curveType=\"linear\"` relie les points par des segments : chaque cassure est une vraie valeur, rien n'est inventé entre deux mois. Le lissage par défaut (`monotone`) arrondit les pics. Une seule série : la légende n'apporte rien, `showLegend={false}`.",
      },
    },
  },
};

export const CustomColors: Story = {
  name: "Couleurs imposées",
  args: { series: CA_CHARGES_COLOREES, area: false },
  parameters: {
    docs: {
      description: {
        story: "Chaque série peut imposer sa couleur — toujours par variable du thème (`var(--lq-color-sky)`, `var(--lq-color-amber)`…), jamais par valeur en dur, pour suivre la surface claire ou sombre — ainsi que son épaisseur (`strokeWidth`) et un trait en tirets (`dashed`).",
      },
    },
  },
};

export const FillBetween: Story = {
  name: "Aire entre deux courbes",
  args: {
    area: false,
    fillBetween: { seriesIdA: "ca", seriesIdB: "charges", aAboveColor: "var(--lq-color-green)", aBelowColor: "var(--lq-color-rose)" },
  },
  parameters: {
    docs: {
      description: {
        story: "`fillBetween` colore l'écart entre deux séries selon celle qui passe au-dessus : ici la marge, en vert tant que le chiffre d'affaires dépasse les charges. Les deux séries doivent partager les mêmes `x`.",
      },
    },
  },
};

export const LinearAxis: Story = {
  name: "Axe X numérique",
  args: {
    series: INDICES_30J,
    area: false,
    xType: "linear",
    height: 280,
    formatX: numeroDeJour,
    formatY: base100,
    referenceLineY: 100,
  },
  parameters: {
    docs: {
      description: {
        story: "`xType=\"linear\"` : des `x` numériques plutôt que des dates — ici quatre indicateurs ramenés en base 100 sur trente jours, avec la base marquée par `referenceLineY`.",
      },
    },
  },
};

export const RightAxis: Story = {
  name: "Axe Y à droite",
  args: { yAxisOrientation: "right", area: false, margin: { left: 16, right: 64 } },
  parameters: {
    docs: {
      description: {
        story: "La convention des graphiques de cours : l'échelle à droite, près de la dernière valeur. La marge droite s'élargit pour ses libellés, la gauche se resserre.",
      },
    },
  },
};

export const LightAxes: Story = {
  name: "Axes allégés",
  args: { showYAxisLine: false, extendXAxisLine: true, yTicks: 4 },
  parameters: {
    docs: {
      description: {
        story: "Pour une carte sans bordure : `showYAxisLine={false}` retire le trait vertical en gardant valeurs et grille, `extendXAxisLine` prolonge l'axe X sous les libellés jusqu'au bord, `yTicks` éclaircit les graduations.",
      },
    },
  },
};

export const NoYAxis: Story = {
  name: "Sans axe Y",
  args: { showYAxis: false, margin: { left: 12 }, height: 240 },
  parameters: {
    docs: {
      description: {
        story: "`showYAxis={false}` ne garde que la grille : les valeurs se lisent au survol. À associer à une petite marge gauche.",
      },
    },
  },
};

export const AxisHoverLabels: Story = {
  name: "Valeurs sur les axes",
  args: { axisHoverLabels: true, area: false },
  parameters: {
    docs: {
      description: {
        story: "`axisHoverLabels` remplace la bulle par des pastilles épinglées aux axes — la date sous l'axe X, une valeur par série sur l'axe Y. Avec `hoverAverage`, une seule pastille donne la moyenne des séries visibles.",
      },
    },
  },
};

export const Measure: Story = {
  name: "Règle de mesure",
  args: { measureActive: true, area: false, series: CA_SEUL, showLegend: false },
  parameters: {
    docs: {
      description: {
        story: "Avec `measureActive`, un premier clic pose le départ, un second l'arrivée, et l'écart s'affiche entre les deux ; un troisième recommence. La bulle de survol se tait pendant ce temps. L'appelant tient l'état et son propre bouton.",
      },
    },
  },
};

export const ZoomControlledOutside: Story = {
  name: "Zoom suivi par l'application",
  args: { showZoomReset: false, onZoomChange: fn() },
  parameters: {
    docs: {
      description: {
        story: "`showZoomReset={false}` retire le bouton de la barre d'outils ; `onZoomChange` prévient l'application quand la vue quitte (ou retrouve) son étendue d'origine, pour qu'elle affiche son propre bouton — et appelle `resetZoom()` sur la ref du graphique.",
      },
    },
  },
};

export const SyncedHover: Story = {
  name: "Survol synchronisé",
  // Les deux graphiques partagent un même état : la date survolée, d'où qu'elle vienne.
  render: function Render(args) {
    const [dateSurvolee, setDateSurvolee] = useState<Date | number | null>(null);
    const suivreLeSurvol = (x: Date | number | null) => setDateSurvolee(x);
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        <LineAreaChart {...args} series={CA_SEUL} area onHoverChange={suivreLeSurvol} syncedHoverX={dateSurvolee} />
        <LineAreaChart {...args} series={[CA_CHARGES[1]]} area={false} onHoverChange={suivreLeSurvol} syncedHoverX={dateSurvolee} />
      </div>
    );
  },
  args: { height: 220, showLegend: false },
  parameters: {
    docs: {
      description: {
        story: "Deux graphiques côte à côte : `onHoverChange` de l'un alimente `syncedHoverX` de l'autre, et le réticule suit le même mois sur les deux. Le survol propre d'un graphique reprend la main tant que le pointeur est dessus.",
      },
    },
  },
};

export const Embedded: Story = {
  name: "Dans une carte",
  render: (args) => (
    <Card title="Chiffre d'affaires et charges" meta="24 DERNIERS MOIS">
      <LineAreaChart {...args} />
    </Card>
  ),
  args: { embedded: true, height: 260 },
  parameters: {
    docs: {
      description: {
        story: "Dans une `Card`. `embedded` est prévu pour ce cas — un conteneur qui a déjà son cadre. Dans la version actuelle du kit, les graphiques ne dessinent plus de cadre propre (`.lq-chart` est sans bordure ni fond) : la prop n'a donc plus d'effet visible, sa JSDoc est en retard sur le CSS. Elle reste sans risque et dit l'intention.",
      },
    },
  },
};
