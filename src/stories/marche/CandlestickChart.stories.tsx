import { useMemo, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  AlertsPanel,
  CandlestickChart,
  Text,
  type Candle,
  type CandlestickChartProps,
  type ChartAlert,
  type ChartAlertDraft,
  type FundamentalDataPoint,
  type Indicator,
  type TimeframeEntry,
  type TrendLineDrawing,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { ALERTES_NOVA, BOUGIES_KAPA, BOUGIES_NOVA, EVENEMENTS_NOVA } from "../../showcase/chartData";
import { CODE_LISIBLE, SOURCE_ABREGEE, assistantDeDemo, dateCourte, euros } from "../graphiques/communs";

// ---- Données dérivées ------------------------------------------------------------------------------

/** La dernière année de NOVA (environ 260 séances) : assez pour lire, assez léger pour une page de doc. */
const UN_AN = BOUGIES_NOVA.slice(-260);
const DERNIERE = UN_AN[UN_AN.length - 1];
const a = (i: number) => UN_AN[i];

/** Regroupe des bougies quotidiennes en bougies plus longues — c'est le travail de l'application, pas du kit. */
function regrouper(bougies: Candle[], periode: (d: Date) => number): Candle[] {
  const sortie: Candle[] = [];
  let cle = Number.NaN;
  for (const b of bougies) {
    const k = periode(b.date);
    const courante = sortie[sortie.length - 1];
    if (!courante || k !== cle) {
      sortie.push({ ...b });
      cle = k;
    } else {
      courante.high = Math.max(courante.high, b.high);
      courante.low = Math.min(courante.low, b.low);
      courante.close = b.close;
      courante.volume = (courante.volume ?? 0) + (b.volume ?? 0);
    }
  }
  return sortie;
}
const PAR_UNITE: Record<string, Candle[]> = {
  "1j": BOUGIES_NOVA,
  // Le 1er janvier 1970 était un jeudi : décaler de quatre jours fait commencer les semaines le lundi.
  "1s": regrouper(BOUGIES_NOVA, (d) => Math.floor((d.getTime() - 4 * 86_400_000) / (7 * 86_400_000))),
  "1m": regrouper(BOUGIES_NOVA, (d) => d.getUTCFullYear() * 12 + d.getUTCMonth()),
};
const UNITES: TimeframeEntry[] = [
  { label: "1 jour", value: "1j" },
  { label: "1 semaine", value: "1s" },
  { label: "1 mois", value: "1m" },
];

/** Moyennes mobiles et Bollinger sur le prix, RSI et MACD dans leurs propres volets. */
const INDICATEURS: Indicator[] = [
  { id: "ema20", kind: "ema", period: 20 },
  { id: "sma50", kind: "sma", period: 50 },
  { id: "bb", kind: "bollinger", period: 20, stdDev: 2 },
  { id: "rsi", kind: "rsi", period: 14 },
  { id: "macd", kind: "macd", period: 26, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
];

/** L'indice de la bougie au plus bas (ou au plus haut) entre deux indices de l'année. */
const extreme = (debut: number, fin: number, sens: "bas" | "haut") => {
  let k = debut;
  for (let i = debut; i < fin; i++) if (sens === "bas" ? a(i).low < a(k).low : a(i).high > a(k).high) k = i;
  return k;
};
const creux1 = extreme(150, 200, "bas");
const creux2 = extreme(235, 258, "bas");
const sommet = extreme(150, 230, "haut");

/** Une ligne de tendance, une résistance horizontale, une zone : posées par l'utilisateur, modifiables. */
const TRACES: TrendLineDrawing[] = [
  { id: "tendance", x1: a(creux1).date, y1: a(creux1).low, x2: a(creux2).date, y2: a(creux2).low, extend: "right", text: "Support" },
  { id: "resistance", lineType: "horizontal", x1: a(sommet).date, y1: a(sommet).high, x2: a(sommet).date, y2: a(sommet).high, text: "Résistance" },
  { id: "zone", lineType: "rectangle", x1: a(215).date, y1: a(215).high * 1.02, x2: a(245).date, y2: a(215).low * 0.98, text: "Consolidation" },
];

/** Des niveaux calculés par l'application : objectif, stop et une projection dans le futur. */
const NIVEAUX: TrendLineDrawing[] = [
  { id: "objectif", lineType: "horizontal", x1: a(0).date, y1: DERNIERE.close * 1.08, x2: a(0).date, y2: DERNIERE.close * 1.08, color: "#2e9e5b", text: "Objectif" },
  { id: "stop", lineType: "horizontal", x1: a(0).date, y1: DERNIERE.close * 0.975, x2: a(0).date, y2: DERNIERE.close * 0.975, color: "#c4213a", text: "Stop" },
  {
    id: "projection",
    x1: DERNIERE.date,
    y1: DERNIERE.close,
    x2: new Date(DERNIERE.date.getTime() + 28 * 86_400_000),
    y2: DERNIERE.close * 1.05,
    color: "#3a41e2",
    arrowRight: true,
    text: "Projection",
  },
];

/** Huit trimestres de comptes fictifs, publiés sur les dates des bougies de NOVA. */
const FONDAMENTAUX: FundamentalDataPoint[] = Array.from({ length: 8 }, (_, i) => {
  const b = BOUGIES_NOVA[BOUGIES_NOVA.length - 1 - (7 - i) * 63];
  const ca = 240e6 + i * 7.5e6;
  const resultat = ca * (0.12 + (i % 3) * 0.008);
  return {
    date: b.date,
    totalRevenue: ca,
    netIncome: resultat,
    netMargin: Math.round((resultat / ca) * 1000) / 10,
    freeCashFlow: resultat * 0.86,
    eps: Math.round((resultat / 120e6) * 100) / 100,
    peRatio: Math.round((b.close / ((resultat * 4) / 120e6)) * 10) / 10,
  };
});

/** Le catalogue de la recherche de symbole — l'application le fournit et le filtre. */
type ResultatRecherche = NonNullable<CandlestickChartProps["symbolSearchResults"]>[number];
// La fenêtre de recherche est du DOM, pas du canevas : ici les variables du thème fonctionnent.
const CATALOGUE: ResultatRecherche[] = [
  { id: "nova", ticker: "NOVA", name: "Novaterra SA", category: "stocks", source: "EURONEXT", logoColor: "var(--lq-color-violet)" },
  { id: "kapa", ticker: "KAPA", name: "Kapalia", category: "stocks", source: "EURONEXT", logoColor: "var(--lq-color-green)" },
];
const DONNEES_PAR_SYMBOLE: Record<string, Candle[]> = { NOVA: UN_AN, KAPA: BOUGIES_KAPA.slice(-260) };

const volumeCompact = (v: number) => v.toLocaleString("fr-FR", { notation: "compact", maximumFractionDigits: 1 });

// ---- Méta ------------------------------------------------------------------------------------------

/**
 * Le graphique de cours du kit : chandeliers, volume, indicateurs, tracés, évènements, alertes,
 * saisonnalité, replay.
 */
const meta = {
  title: "Charts/CandlestickChart",
  component: CandlestickChart,
  parameters: {
    ...CODE_LISIBLE,
    docs: {
      source: SOURCE_ABREGEE,
      description: {
        component: [
          "Le graphique de cours en chandeliers japonais, et le composant le plus riche du kit. Une bougie par période (`Candle` : `date`, `open`, `high`, `low`, `close`, `volume` facultatif, de la plus ancienne à la plus récente) ; autour d'elle, tout ce qu'attend une plateforme de marché — volume, indicateurs techniques, outils de tracé, repères d'évènements, alertes, saisonnalité, replay, unités de temps, recherche de symbole.",
          "",
          "**Le kit n'a aucune source de données.** L'application fournit les bougies et les tient à jour ; il en va de même de `events`, `fundamentals`, `alerts`, des résultats de recherche et des bougies de chaque unité de temps : le graphique affiche et rapporte les gestes, il ne recalcule ni ne télécharge rien.",
          "",
          "**Quand l'utiliser** — le cours d'un instrument, à explorer. Pour une simple évolution, `LineAreaChart` suffit ; pour une tendance dans une cellule, `Sparkline` ; pour plusieurs graphiques synchronisés, avec liste de surveillance, éditeur de scripts et assistant, `ChartWorkspace` les assemble.",
          "",
          "**Anatomie** — en haut, l'en-tête : « symbole · type de graphique » (un double-clic ouvre les paramètres), puis selon les props l'unité de temps (`timeframes`), le mode d'affichage, les indicateurs (`showIndicators`), la saisonnalité (`seasonality`), le replay (`replay`), les boutons de l'application (`headerActions`), les modèles (`showTemplates`), le lien (`linkable`) et le plein écran (`fullscreenToggle`). À gauche, le rail des outils de tracé (`drawingTools`). Au centre, les bougies sur un axe des prix à droite ; dessous, le volet du volume (`showVolume`) et ceux des indicateurs, redimensionnables ; au pied du tracé, les repères d'évènements ; tout en bas, l'axe des dates. À droite, un panneau latéral optionnel (`sidePanel`).",
          "",
          "**Les props, par famille** —",
          "- *Taille et vue* : `height` (380 px), `width` (toute la largeur par défaut), `fillHeight`, `margin`, `initialVisibleCandles` (les 500 dernières par défaut), `viewResetKey`, `futureBars` (des cases vides à droite pour une projection), `YAutoScaling` (l'axe des prix suit les bougies visibles), `defaultPaneHeightFraction`.",
          "- *Affichage* : `defaultChartDisplayMode` — bougies, barres OHLC, ligne de clôture, Heikin Ashi, Renko (`renkoAtrPeriod`), Line Break ; `livePrice` (ligne du dernier cours et compte à rebours jusqu'à la prochaine bougie) ; `formatPrice`, `formatDate` (par défaut « 01 juin 2026 » dans la langue de `locale`, `\"fr-FR\"`), `formatVolume`. `layout` (`\"auto\"`, `\"desktop\"`, `\"mobile\"`) épingle la disposition bureau ou tactile, quelle que soit la largeur de la fenêtre.",
          "- *Indicateurs* : `showIndicators`, `defaultIndicators` (SMA, EMA, Bollinger, RSI, MACD, ATR, Supertrend, Ichimoku, points pivots, supports et résistances…), `customIndicators`, `fundamentals`, `showTemplates` / `defaultTemplates`.",
          "- *Tracés* : `drawingTools`, `defaultDrawings` (lignes, canaux, Fibonacci, rectangles, flèches, textes… modifiables par l'utilisateur), `drawingsHidden`, `overlayDrawings` (niveaux de l'application, intouchables), `overlayInteractions`, `customTools`.",
          "- *Évènements et alertes* : `events`, `alerts` avec `onCreateAlert` / `onUpdateAlert` / `onDeleteAlert`, `alertSoundOptions`, `onPlaySound`.",
          "- *Navigation* : `timeframes` / `timeframe`, `symbolSearch` et ses résultats, `onAddSymbolOverlay` (comparer un second titre), `seasonality`, `replay`.",
          "- *Intégration* : `sidePanel`, `headerActions`, `isFullscreen` / `settingsOpen` pilotés de l'extérieur, `syncedHoverDate` / `syncedHoverPrice` et `linkable` pour synchroniser plusieurs graphiques, `scripts` et `ai` — que `ChartWorkspace` câble pour vous.",
          "",
          "Les props `default…` sont **non contrôlées** : elles amorcent l'état au montage, et les `on…Change` correspondants rapportent ensuite chaque changement.",
          "",
          "**Interactions** — avec `zoomable` : molette ou pincement pour zoomer, glisser pour se déplacer, glisser l'axe des prix pour le dilater (l'ajustement automatique se coupe ; « Réinitialiser le zoom » le rétablit). Double-clic sur le libellé du symbole : paramètres (couleurs de hausse et de baisse, ajustement automatique, évènements à afficher par type). Clic sur un repère d'évènement : sa carte (`ChartEventTooltip`). Clavier : Ctrl+Espace ouvre la liste des indicateurs, Ctrl+Z / Ctrl+Y annulent et rétablissent un tracé, Ctrl+C / Ctrl+V le copient, Suppr l'efface, Maj bloque son angle à 0, 45 ou 90°, Échap abandonne l'outil en cours ou quitte le plein écran ; en replay, ← et → avancent d'une bougie.",
          "",
          "**Thème** — le tracé est peint sur un canevas, qui relit à chaque dessin `--lq-color-up` et `--lq-color-down` (bougies, volume), `--lq-color-accent` (tracés et sélection par défaut), `--lq-color-text`, `--lq-color-text-muted`, `--lq-color-border-subtle` (grille), `--lq-color-bg` et `--lq-font-family`. L'en-tête, les menus et les fenêtres suivent `--lq-color-panel`, `--lq-color-border`, `--lq-color-hover`, `--lq-shadow-modal`, `--lq-radius-sm` / `--lq-radius-md`, `--lq-space-*` et `--lq-text-xs` / `--lq-text-sm`.",
          "",
          "**Limite du kit** — parce que le tracé est un canevas, la `color` d'un tracé, d'un niveau ou d'un indicateur personnalisé est passée telle quelle au contexte 2D : une `var(--lq-color-…)` n'y est pas comprise. Il faut une couleur littérale (`#2e9e5b`), qui ne suit donc pas le passage en sombre ; un tracé sans `color` prend l'accent du thème, lui bien résolu.",
        ].join("\n"),
      },
    },
  },
  // Les props « default… » ne s'appliquent qu'au montage : la clé fait remonter le graphique quand
  // un contrôle les change, pour que le panneau Controls reste fidèle.
  render: (args) => (
    <CandlestickChart
      key={[args.defaultChartDisplayMode, args.initialVisibleCandles, args.defaultPaneHeightFraction, args.YAutoScaling, args.data.length].join("|")}
      {...args}
    />
  ),
  args: {
    data: BOUGIES_NOVA,
    symbol: "NOVA",
    height: 460,
    zoomable: true,
    showVolume: true,
    initialVisibleCandles: 180,
    formatPrice: euros,
    formatDate: dateCourte,
    onIndicatorsChange: fn(),
    onDrawingsChange: fn(),
    onChartDisplayModeChange: fn(),
    onFullscreenChange: fn(),
    onYAutoScalingChange: fn(),
  },
  argTypes: Object.fromEntries(
    [
      "data", "events", "fundamentals", "alerts", "defaultDrawings", "defaultIndicators", "customIndicators", "customTools",
      "overlayDrawings", "overlayInteractions", "headerActions", "defaultTemplates", "timeframes", "symbolSearchResults",
      "defaultFavoriteSymbolIds", "depth", "tape", "sidePanel", "scripts", "quantData", "ai", "margin", "alertSoundOptions",
      "syncedHoverDate", "syncedHoverPrice", "formatDate", "formatPrice", "formatVolume",
    ].map((p) => [p, { control: false }]),
  ),
} satisfies Meta<typeof CandlestickChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---- Stories ---------------------------------------------------------------------------------------

export const Default: Story = {
  name: "Défaut",
  parameters: {
    docs: {
      description: {
        story: "Sept ans de séances fictives de NOVA, les 180 dernières à l'écran, volume dessous. Molette pour zoomer, glisser pour remonter le temps. Les contrôles activent un à un les outils de l'en-tête.",
      },
    },
  },
};

export const Thumbnail: Story = {
  name: "Vignette",
  args: { data: UN_AN, height: 240, zoomable: false, showVolume: false, fullscreenToggle: false, initialVisibleCandles: 90 },
  parameters: {
    docs: {
      description: {
        story: "Sans `zoomable` (c'est le défaut), le graphique ne se déplace pas : le bon choix pour une vignette ou un aperçu, où il n'y a rien à explorer. `fullscreenToggle={false}` retire le bouton plein écran.",
      },
    },
  },
};

export const Volume: Story = {
  name: "Volume",
  args: { data: UN_AN, defaultPaneHeightFraction: 0.3, formatVolume: volumeCompact },
  parameters: {
    docs: {
      description: {
        story: "`showVolume` ouvre le volet du volume, coloré comme les bougies. `defaultPaneHeightFraction` règle sa hauteur de départ (22 % du tracé par défaut, ici 30 %) ; on le redimensionne ensuite à la souris. `formatVolume` met en forme son axe.",
      },
    },
  },
};

export const DisplayModes: Story = {
  name: "Modes d'affichage",
  args: { data: UN_AN, defaultChartDisplayMode: "heikinAshi" },
  parameters: {
    docs: {
      description: {
        story: "`defaultChartDisplayMode` choisit le rendu de départ — ici Heikin Ashi, des bougies lissées qui font ressortir la tendance. Le bouton de l'en-tête propose les six modes : bougies, barres OHLC, ligne de clôture, Heikin Ashi, Renko, Line Break. Changez-le dans les contrôles.",
      },
    },
  },
};

export const ClosingLine: Story = {
  name: "Ligne de clôture",
  args: { data: UN_AN, defaultChartDisplayMode: "line", showVolume: false, height: 340 },
  parameters: { docs: { description: { story: "Le mode ligne : un trait par les clôtures, la lecture la plus simple d'un cours." } } },
};

export const Indicators: Story = {
  name: "Indicateurs",
  args: { data: UN_AN, showIndicators: true, showTemplates: true, defaultIndicators: INDICATEURS, defaultPaneHeightFraction: 0.16, height: 620, onTemplatesChange: fn() },
  parameters: {
    docs: {
      description: {
        story: "`showIndicators` ajoute le sélecteur « Indicateurs » (ou Ctrl+Espace) et la légende des indicateurs actifs en haut à gauche du tracé. `defaultIndicators` en pose d'emblée : moyennes mobiles et bandes de Bollinger sur le prix, RSI et MACD dans leurs volets. `showTemplates` permet d'enregistrer cette disposition comme modèle et de la recharger.",
      },
    },
  },
};

export const Fundamentals: Story = {
  name: "Fondamentaux",
  args: {
    showIndicators: true,
    showVolume: false,
    fundamentals: FONDAMENTAUX,
    defaultIndicators: [
      { id: "ca", kind: "totalRevenue", period: 1 },
      { id: "marge", kind: "netMargin", period: 1 },
    ],
    initialVisibleCandles: 520,
    height: 560,
  },
  parameters: {
    docs: {
      description: {
        story: "`fundamentals` : chaque mesure présente (chiffre d'affaires, résultat, marge, BPA, PER…) devient un indicateur de la catégorie « Fondamentaux » du sélecteur, qui s'affiche dans son volet, d'une publication à l'autre. Ici le chiffre d'affaires et la marge nette sont posés d'emblée par `defaultIndicators` (`kind: \"totalRevenue\"`, `\"netMargin\"`). Défaut du kit : ces volets s'intitulent en anglais (« Revenue », « Net Margin ») et affichent des dollars (« $292.50M ») quelle que soit la devise, et l'axe du chiffre d'affaires rogne ses libellés.",
      },
    },
  },
};

export const Events: Story = {
  name: "Évènements",
  args: { data: UN_AN, events: EVENEMENTS_NOVA, initialVisibleCandles: 215 },
  parameters: {
    docs: {
      description: {
        story: "`events` pose des repères au pied du tracé — R pour résultats, D pour dividende, AG pour l'assemblée (`symbol`). Survolez-en un pour son résumé, cliquez-le pour sa carte détaillée. Un double-clic sur « NOVA » ouvre les paramètres, où chaque type d'évènement se masque à part.",
      },
    },
  },
};

export const DrawingTools: Story = {
  name: "Outils de tracé",
  args: { data: UN_AN, drawingTools: true, defaultDrawings: TRACES },
  parameters: {
    docs: {
      description: {
        story: "`drawingTools` ouvre le rail de gauche : lignes, canaux, Fibonacci, formes, flèches, textes, positions… `defaultDrawings` en pose trois au départ. Cliquez-en un pour le sélectionner (barre flottante : style, verrou, alerte, suppression), glissez ses poignées ; Ctrl+Z annule, Suppr efface. Chaque changement passe par `onDrawingsChange`.",
      },
    },
  },
};

export const AppLevels: Story = {
  name: "Niveaux de l'application",
  args: { data: UN_AN, overlayDrawings: NIVEAUX, futureBars: 25, initialVisibleCandles: 120 },
  parameters: {
    docs: {
      description: {
        story: "`overlayDrawings` : des niveaux que l'application calcule et possède — objectif, stop, projection. Ils suivent la prop à chaque rendu, n'apparaissent pas dans `onDrawingsChange` et ne réagissent pas au pointeur (voyez `overlayInteractions` pour les rendre déplaçables). `futureBars` garde des cases vides à droite pour la projection. Couleurs littérales : le canevas ne lit pas les `var()`.",
      },
    },
  },
};

export const CustomTools: Story = {
  name: "Outils de l'application",
  render: function Render(args) {
    const [niveaux, setNiveaux] = useState<Record<string, number>>({});
    const outil = (id: string, label: string, lettre: string) => ({
      id,
      label,
      description: "puis cliquez sur le graphique",
      icon: <span style={{ font: "700 10px/1 var(--lq-font-family)" }}>{lettre}</span>,
      onPlace: ({ price }: { price: number }) => setNiveaux((n) => ({ ...n, [label]: price })),
    });
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Text size="sm" muted>
          {Object.keys(niveaux).length
            ? Object.entries(niveaux).map(([k, v]) => `${k} : ${euros(v)} €`).join(" · ")
            : "Choisissez un outil E, S ou O dans le rail de gauche, puis cliquez sur le graphique."}
        </Text>
        <CandlestickChart {...args} customTools={[outil("entree", "Entrée", "E"), outil("stop", "Stop", "S"), outil("objectif", "Objectif", "O")]} />
      </div>
    );
  },
  args: { data: UN_AN, drawingTools: true, showVolume: false, height: 420 },
  parameters: {
    docs: {
      description: {
        story: "`customTools` ajoute au rail des outils propres à l'application : un clic arme l'outil, le clic suivant sur le graphique lui rapporte le prix et la date (`onPlace`), puis il se désarme. Pour saisir un prix d'entrée, un stop, un objectif sans le taper.",
      },
    },
  },
};

export const Alerts: Story = {
  name: "Alertes et panneau latéral",
  render: function Render(args) {
    const [alertes, setAlertes] = useState<ChartAlert[]>(ALERTES_NOVA);
    const suivant = useRef(1);
    const creer = (brouillon: ChartAlertDraft) => setAlertes((l) => [...l, { ...brouillon, id: `nouvelle-${suivant.current++}` }]);
    const modifier = (id: string, brouillon: ChartAlertDraft) => setAlertes((l) => l.map((x) => (x.id === id ? { ...brouillon, id } : x)));
    const supprimer = (id: string) => setAlertes((l) => l.filter((x) => x.id !== id));
    return (
      <CandlestickChart
        {...args}
        alerts={alertes}
        onCreateAlert={creer}
        onUpdateAlert={modifier}
        onDeleteAlert={supprimer}
        sidePanel={<AlertsPanel alerts={alertes} onDeleteAlert={supprimer} />}
      />
    );
  },
  args: { data: UN_AN, drawingTools: true, showIndicators: true },
  parameters: {
    docs: {
      description: {
        story: "Les alertes appartiennent à l'application : le graphique ouvre la fenêtre de création (cloche de la barre flottante d'un tracé, ou d'un indicateur) et rapporte `onCreateAlert`, `onUpdateAlert`, `onDeleteAlert` ; l'application tient la liste et la lui rend par `alerts`. Ici la liste s'affiche aussi dans `sidePanel`, un panneau ancré à droite, redimensionnable et repliable depuis l'en-tête.",
      },
    },
  },
};

export const Seasonality: Story = {
  name: "Saisonnalité",
  args: { seasonality: true },
  parameters: {
    docs: {
      description: {
        story: "`seasonality` ajoute un bouton d'en-tête qui remplace le tracé par la `SeasonalityView` : l'année en cours contre la moyenne des précédentes. Un bouton retour ramène aux bougies. Il faut plusieurs années de données — d'où les sept ans de NOVA.",
      },
    },
  },
};

export const Replay: Story = {
  name: "Replay",
  render: function Render(args) {
    const [coupure, setCoupure] = useState<Date | null>(null);
    const visibles = coupure ? args.data.filter((c) => c.date.getTime() <= coupure.getTime()) : [];
    const derniere = visibles.length ? visibles[visibles.length - 1] : null;
    const suivreLeReplay = (date: Date | null) => setCoupure(date);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Text size="sm" muted>
          {derniere
            ? `Replay au ${dateCourte(derniere.date)} — dernière clôture visible : ${euros(derniere.close)} €`
            : "Bouton Replay de l'en-tête : survolez le graphique, cliquez pour fixer l'instant, puis Lecture ou ← →."}
        </Text>
        <CandlestickChart {...args} onReplayChange={suivreLeReplay} />
      </div>
    );
  },
  args: { data: UN_AN, replay: true },
  parameters: {
    docs: {
      description: {
        story: "`replay` arme la relecture : le pointeur assombrit tout ce qui est à sa droite, un clic fige l'instant et masque l'avenir (bougies, volume, indicateurs), puis Lecture, Pause, Vitesse ou les flèches avancent bougie par bougie. `onReplayChange` remonte la date de la dernière bougie visible, pour recalculer ce qui s'affiche hors du graphique.",
      },
    },
  },
};

export const Timeframes: Story = {
  name: "Unités de temps",
  render: function Render(args) {
    const [unite, setUnite] = useState("1j");
    // Le kit ne rééchantillonne rien : c'est l'application qui fournit les bougies de chaque unité.
    const changerDUnite = (valeur: string) => setUnite(valeur);
    return (
      <CandlestickChart
        {...args}
        data={PAR_UNITE[unite]}
        timeframes={UNITES}
        timeframe={unite}
        onTimeframeChange={changerDUnite}
        viewResetKey={unite}
        initialVisibleCandles={unite === "1j" ? 180 : unite === "1s" ? 104 : 60}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "`timeframes` affiche le sélecteur d'unité de temps (à plat ou par groupes), `timeframe` l'unité courante. Le kit ne rééchantillonne rien : sur `onTimeframeChange`, l'application fournit les bougies de la nouvelle unité — ici des semaines et des mois regroupés à partir des jours — et `viewResetKey` recadre la vue sans démonter le graphique.",
      },
    },
  },
};

export const SymbolSearch: Story = {
  name: "Recherche de symbole",
  render: function Render(args) {
    const [symbole, setSymbole] = useState("NOVA");
    const [resultats, setResultats] = useState<ResultatRecherche[]>(CATALOGUE);
    // La recherche est celle de l'application : le graphique ne fait que transmettre la saisie.
    const filtrerLeCatalogue = (requete: string, categorie: string) =>
      setResultats(
        CATALOGUE.filter(
          (r) => (categorie === "all" || categorie === r.category) && `${r.ticker} ${r.name}`.toLowerCase().includes(requete.trim().toLowerCase()),
        ),
      );
    const chargerLeTitre = (r: ResultatRecherche) => setSymbole(r.ticker);
    return (
      <CandlestickChart
        {...args}
        data={DONNEES_PAR_SYMBOLE[symbole] ?? UN_AN}
        symbol={symbole}
        symbolSearch
        symbolSearchResults={resultats}
        onSymbolSearchChange={filtrerLeCatalogue}
        onSymbolSelect={chargerLeTitre}
        viewResetKey={symbole}
      />
    );
  },
  args: { initialVisibleCandles: 180 },
  parameters: {
    docs: {
      description: {
        story: "`symbolSearch` rend le symbole cliquable : il ouvre une fenêtre de recherche (champ, filtres par catégorie, résultats). L'application filtre son catalogue sur `onSymbolSearchChange` et le rend par `symbolSearchResults` ; `onSymbolSelect` lui dit quel titre charger. Essayez « KAPA ».",
      },
    },
  },
};

export const LivePrice: Story = {
  name: "Dernier cours",
  args: { data: UN_AN, livePrice: true, initialVisibleCandles: 90 },
  parameters: {
    docs: {
      description: {
        story: "`livePrice` trace une ligne pointillée au dernier cours, sa pastille sur l'axe (colorée selon la veille) et, dessous, le compte à rebours jusqu'à la bougie suivante. Fait pour des données qui arrivent en direct ; sur un historique figé, le compte à rebours s'arrête à 00:00.",
      },
    },
  },
};

export const HeaderActions: Story = {
  name: "Boutons de l'application",
  render: function Render(args) {
    const [actif, setActif] = useState<string | null>(null);
    const [enCours, setEnCours] = useState<string | null>(null);
    const lancer = (id: string) => {
      setEnCours(id);
      setTimeout(() => {
        setEnCours(null);
        setActif((x) => (x === id ? null : id));
      }, 900);
    };
    return (
      <CandlestickChart
        {...args}
        headerActions={["Tendance", "Volatilité"].map((id) => ({
          id,
          label: id,
          title: `Lancer le modèle « ${id} »`,
          active: actif === id,
          busy: enCours === id,
          onClick: () => lancer(id),
        }))}
      />
    );
  },
  args: { data: UN_AN, showVolume: false },
  parameters: {
    docs: {
      description: {
        story: "`headerActions` ajoute à l'en-tête des boutons de l'application — un modèle de prévision par bouton, par exemple. Le graphique appelle `onClick` ; l'application fait le travail et reflète son état par `busy` (calcul en cours) puis `active`.",
      },
    },
  },
};

export const SyncedHover: Story = {
  name: "Survol synchronisé",
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(null);
    const [prix, setPrix] = useState<number | null>(null);
    const kapa = useMemo(() => BOUGIES_KAPA.slice(-260), []);
    const suivreLaDate = (d: Date | null) => setDate(d);
    const suivreLePrix = (p: number | null) => setPrix(p);
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 16 }}>
        <CandlestickChart {...args} symbol="NOVA" syncedHoverDate={date} onHoverDateChange={suivreLaDate} syncedHoverPrice={prix} onHoverPriceChange={suivreLePrix} />
        <CandlestickChart {...args} data={kapa} symbol="KAPA" syncedHoverDate={date} onHoverDateChange={suivreLaDate} syncedHoverPrice={prix} onHoverPriceChange={suivreLePrix} />
      </div>
    );
  },
  args: { data: UN_AN, height: 340, showVolume: false, initialVisibleCandles: 120 },
  parameters: {
    docs: {
      description: {
        story: "Deux titres côte à côte : `onHoverDateChange` / `onHoverPriceChange` de l'un alimentent `syncedHoverDate` / `syncedHoverPrice` de l'autre, et le réticule suit la même séance sur les deux, chacun dans sa propre échelle. `ChartWorkspace` fait ce câblage pour les panneaux que l'utilisateur lie.",
      },
    },
  },
};

export const Assistant: Story = {
  name: "Assistant",
  args: { data: UN_AN, drawingTools: true, showIndicators: true, ai: { send: assistantDeDemo } },
  parameters: {
    docs: {
      description: {
        story: "`ai` ajoute au rail un bouton d'assistant et un panneau qui lit le graphique et agit dessus. Il lui faut **un** moyen de joindre un modèle : `send`, une fonction qui relaie la conversation vers votre serveur (ce que fait toute application publique), ou `apiKey` pour un usage local. Ici `send` répond une phrase fixe, sans réseau ni clé.",
      },
    },
  },
};
