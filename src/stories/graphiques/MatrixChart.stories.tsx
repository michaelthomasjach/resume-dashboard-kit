import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { MatrixChart, Text, type MatrixAxisEntry, type MatrixCell } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ACTIFS, CORRELATIONS } from "../../showcase/chartData";
import { CODE_LISIBLE, SOURCE_ABREGEE, nombre } from "./communs";

/** Les mêmes corrélations, avec le nombre de séances en seconde ligne de chaque case. */
const CORRELATIONS_ANNOTEES: MatrixCell[] = CORRELATIONS.map((c) => (c.value === null ? c : { ...c, note: "252 s." }));

/** Une grille de scores, de −100 à +100 : quatre filiales notées sur quatre critères. */
const FILIALES: MatrixAxisEntry[] = [
  { id: "nord", label: "Nord" },
  { id: "ouest", label: "Ouest" },
  { id: "sud", label: "Sud" },
  { id: "est", label: "Est" },
];
const CRITERES: MatrixAxisEntry[] = [
  { id: "croissance", label: "Croissance" },
  { id: "marge", label: "Marge" },
  { id: "dette", label: "Dette" },
  { id: "tresorerie", label: "Trésorerie" },
];
const SCORES: Record<string, number> = {
  "nord croissance": 68, "nord marge": 82, "nord dette": 41, "nord tresorerie": 90,
  "ouest croissance": 34, "ouest marge": 74, "ouest dette": -22, "ouest tresorerie": 61,
  "sud croissance": 96, "sud marge": 58, "sud dette": 12, "sud tresorerie": -35,
  "est croissance": -48, "est marge": 27, "est dette": -64, "est tresorerie": 18,
};
const CELLULES_SCORES: MatrixCell[] = FILIALES.flatMap((f) =>
  CRITERES.map((k) => ({
    row: f.id,
    column: k.id,
    value: SCORES[`${f.id} ${k.id}`],
    details: [{ label: "Score", value: `${SCORES[`${f.id} ${k.id}`]} / 100` }],
  })),
);

/** Des scores d'audit par site et trimestre ; la couleur suit les seuils de l'application (`colorMode="manual"`). */
const SITES: MatrixAxisEntry[] = [
  { id: "rennes", label: "Rennes" },
  { id: "lyon", label: "Lyon" },
  { id: "lille", label: "Lille" },
];
const TRIMESTRES: MatrixAxisEntry[] = [
  { id: "t1", label: "T1" },
  { id: "t2", label: "T2" },
  { id: "t3", label: "T3" },
  { id: "t4", label: "T4" },
];
const SCORES_AUDIT: (number | null)[][] = [
  [92, 88, 64, null],
  [95, 90, 86, null],
  [81, 58, null, null],
];
const verdict = (score: number): [string, string] =>
  score >= 85 ? ["Conforme", "var(--lq-color-green)"] : score >= 70 ? ["À suivre", "var(--lq-color-amber)"] : ["Non conforme", "var(--lq-color-rose)"];
const CELLULES_AUDITS: MatrixCell[] = SITES.flatMap((site, i) =>
  TRIMESTRES.map((t, j) => {
    const score = SCORES_AUDIT[i][j];
    if (score === null) return { row: site.id, column: t.id, value: null };
    const [libelle, couleur] = verdict(score);
    return {
      row: site.id,
      column: t.id,
      value: score,
      note: libelle,
      color: `color-mix(in srgb, ${couleur} 45%, transparent)`,
      details: [
        { label: "Score", value: `${score} / 100` },
        { label: "Verdict", value: libelle },
      ],
    };
  }),
);

/** Le dégradé lui-même : une ligne positive, une négative, de 0 à 1 par dixième. */
const PALIERS: MatrixAxisEntry[] = Array.from({ length: 11 }, (_, i) => ({ id: String(i), label: `${i * 10} %` }));
const CELLULES_DEGRADE: MatrixCell[] = PALIERS.flatMap((p, i) => [
  { row: "pos", column: p.id, value: i / 10 },
  { row: "neg", column: p.id, value: -i / 10 },
]);

const deuxDecimales = (v: number) => nombre(v, 2);
const uneDecimale = (v: number) => nombre(v, 1);
const entier = (v: number) => String(Math.round(v));

/**
 * La matrice de cases notées — une matrice de corrélation, d'abord.
 */
const meta = {
  title: "Charts/MatrixChart",
  component: MatrixChart,
  parameters: {
    ...CODE_LISIBLE,
    docs: {
      source: SOURCE_ABREGEE,
      description: {
        component: [
          "Une grille `rows` × `columns` dont chaque case (`MatrixCell` : `row`, `column`, `value`) est colorée par sa valeur. La couleur porte deux faits séparés : la **teinte** dit le signe, l'**opacité** l'intensité — une case à +1 est la couleur positive pleine, une case à 0 est transparente, une case à −1 la couleur négative pleine. L'œil lit « combien » à la force d'une case et « dans quel sens » à sa teinte, sans légende.",
          "",
          "**Quand l'utiliser** — une mesure par couple : corrélations entre actifs, scores de filiales par critère, un planning de statuts. Pour des éléments hiérarchisés pesés par une mesure, `Heatmap` ; pour une seule mesure par élément, `BarChart`.",
          "",
          "**Anatomie et variantes** — `domain` ([−1, 1] par défaut) fixe les valeurs qui atteignent les teintes pleines ; `positiveColor` et `negativeColor` changent ces teintes ; `colorMode=\"manual\"` abandonne le dégradé et peint chaque case de sa propre `color`. `showValues` écrit la valeur dans la case (mise en forme par `formatValue`), `note` y ajoute une seconde ligne (avec `showValues` seulement). `value: null` dessine une case vide — la diagonale, une paire sans mesure — plutôt qu'un zéro qui affirmerait une absence de lien. Toute la largeur du conteneur ; 360 px de haut par défaut.",
          "",
          "**Interactions** — cliquer une case ouvre son détail **sous** la grille (les lignes `details` de la case), plutôt que dans une bulle qu'il faudrait garder survolée ; `renderDetail` remplace ce panneau, `onCellClick` signale le clic. `zoomable` active molette, glisser et double-clic pour revenir — à laisser éteint quand la grille tient, car une grille qui bouge sous un défilement accidentel est pire qu'une grille fixe.",
          "",
          "**Colonne des libellés** — sa largeur suit le plus long libellé de ligne, mesuré dans la police du thème (au plus 40 % de la largeur) ; `rowLabelWidth` la fixe en pixels.",
          "",
          "**Thème** — teintes par défaut `--lq-color-up` et `--lq-color-down` ; la couleur du texte de chaque case est choisie pour contraster avec son fond, mesuré sur `--lq-color-bg`. En-têtes en `--lq-color-text-muted` et `--lq-text-xs`, filets `--lq-color-border-subtle`, détail sur `--lq-color-panel`.",
        ].join("\n"),
      },
    },
  },
  args: { rows: ACTIFS, columns: ACTIFS, cells: CORRELATIONS, showValues: true, formatValue: deuxDecimales, height: 380 },
  argTypes: {
    rows: { control: false },
    columns: { control: false },
    cells: { control: false },
    domain: { control: false },
    formatValue: { control: false },
    renderDetail: { control: false },
    onCellClick: { control: false },
    rowLabelWidth: { control: { type: "number", min: 40, max: 240, step: 2 }, table: { defaultValue: { summary: "mesurée sur le plus long libellé" } } },
    positiveColor: { control: "text" },
    negativeColor: { control: "text" },
  },
} satisfies Meta<typeof MatrixChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: {
    docs: {
      description: {
        story: "Les corrélations des rendements quotidiens de sept actifs sur un an. Cliquez une case : sa période, son nombre de séances et sa lecture s'affichent sous la grille.",
      },
    },
  },
};

export const ColorsOnly: Story = {
  name: "Couleurs seules",
  args: { showValues: false, height: 340 },
  parameters: { docs: { description: { story: "Sans `showValues`, la grille se lit à la couleur ; les valeurs restent dans le détail d'une case." } } },
};

export const WithNotes: Story = {
  name: "Avec une seconde ligne",
  args: { cells: CORRELATIONS_ANNOTEES },
  parameters: { docs: { description: { story: "`MatrixCell.note` écrit une seconde ligne sous la valeur : un effectif, une période, une p-valeur." } } },
};

export const CustomPalette: Story = {
  name: "Palette et domaine sur mesure",
  args: {
    rows: FILIALES,
    columns: CRITERES,
    cells: CELLULES_SCORES,
    domain: [-100, 100],
    positiveColor: "var(--lq-color-sky)",
    negativeColor: "var(--lq-color-amber)",
    formatValue: entier,
    height: 240,
  },
  parameters: {
    docs: {
      description: {
        story: "Des scores de −100 à +100 (`domain`), en bleu et ambre plutôt qu'en hausse et baisse : la grille se lit de la même façon, car le dégradé n'a besoin que du côté du zéro et de la distance à lui.",
      },
    },
  },
};

export const ManualColors: Story = {
  name: "Couleurs posées case par case",
  args: { rows: SITES, columns: TRIMESTRES, cells: CELLULES_AUDITS, colorMode: "manual", formatValue: entier, height: 220 },
  parameters: {
    docs: {
      description: {
        story: "`colorMode=\"manual\"` : chaque case prend sa propre `color`, calculée par l'application — ici des scores d'audit coloriés selon des seuils (85 et 70) plutôt que selon un dégradé, la `note` nommant le verdict. Les audits à venir (`value: null`) restent vides.",
      },
    },
  },
};

export const Ramp: Story = {
  name: "Le dégradé",
  args: {
    rows: [
      { id: "pos", label: "Positif" },
      { id: "neg", label: "Négatif" },
    ],
    columns: PALIERS,
    cells: CELLULES_DEGRADE,
    formatValue: uneDecimale,
    height: 140,
  },
  parameters: { docs: { description: { story: "Le dégradé automatique mis à nu : une ligne par signe, de 0 à 1 par dixième." } } },
};

export const OwnDetail: Story = {
  name: "Détail rendu par l'appelant",
  args: {
    onCellClick: fn(),
    renderDetail: (cell, row, column) => (
      <Text size="sm">
        <strong>
          {row.label} contre {column.label}
        </strong>{" "}
        — {cell.value === null ? "–" : nombre(cell.value, 2)} sur un an de séances.
      </Text>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "`renderDetail(cell, row, column)` remplace le panneau de détail ; `onCellClick` remonte la case cliquée à l'application.",
      },
    },
  },
};

export const Zoomable: Story = {
  name: "Zoomable",
  args: { zoomable: true },
  parameters: {
    docs: {
      description: {
        story: "`zoomable` : molette pour zoomer, glisser pour se déplacer, double-clic pour revenir. Utile pour une grande grille ; à éviter quand elle tient à l'écran.",
      },
    },
  },
};
