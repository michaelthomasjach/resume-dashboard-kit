import type { Meta, StoryObj } from "@storybook/react-vite";
import { PeriodTable, Card, type PeriodTableColumn, type PeriodTableRow } from "@michaelthomasjach/liseuse-dashboard-kit";
import { REVENUE_TREND, SIGNUPS_TREND, CHURN_TREND } from "../../showcase/demoData";
import { MOIS_COURTS } from "../../showcase/chartData";

/** Les quatre derniers trimestres, le plus récent à droite, comme se lit un compte de résultat. */
const QUARTERS: PeriodTableColumn[] = [
  { key: "label", label: "", sticky: true, align: "left", width: 220 },
  { key: "t4-25", label: "T4 2025", sublabel: "oct.–déc." },
  { key: "t1-26", label: "T1 2026", sublabel: "janv.–mars" },
  { key: "t2-26", label: "T2 2026", sublabel: "avr.–juin" },
  { key: "t3-26", label: "T3 2026", sublabel: "juil.–sept." },
];
const QUARTER_KEYS = ["t4-25", "t1-26", "t2-26", "t3-26"];

const keur = (n: number) => `${n.toLocaleString("fr-FR")} k€`;
const pct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1).replace(".", ",")} %`;

/** Une ligne de montants trimestriels, chaque cellule portant sa variation sur le trimestre
 *  précédent. `cost` inverse le ton : une charge qui monte est une mauvaise nouvelle. */
function quarterCells(values: number[], cost = false) {
  return Object.fromEntries(
    QUARTER_KEYS.map((k, i) => {
      const prev = values[i - 1];
      if (prev === undefined) return [k, { value: keur(values[i]) }];
      const change = ((values[i] - prev) / Math.abs(prev)) * 100;
      return [k, { value: keur(values[i]), note: pct(change), tone: change >= 0 !== cost ? ("up" as const) : ("down" as const) }];
    })
  );
}

const INCOME_ROWS: PeriodTableRow[] = [
  {
    key: "ca",
    label: "Chiffre d'affaires",
    emphasis: true,
    cells: quarterCells([212, 228, 241, 263]),
    children: [
      {
        key: "abonnements",
        label: "Abonnements",
        cells: quarterCells([158, 171, 184, 199]),
        children: [
          { key: "annuels", label: "Annuels", cells: quarterCells([121, 133, 145, 158]) },
          { key: "mensuels", label: "Mensuels", cells: quarterCells([37, 38, 39, 41]) },
        ],
      },
      { key: "licences", label: "Licences poste", cells: quarterCells([34, 33, 31, 35]) },
      { key: "modules", label: "Modules analytiques", cells: quarterCells([20, 24, 26, 29]) },
    ],
  },
  {
    key: "charges",
    label: "Charges d'exploitation",
    emphasis: true,
    cells: quarterCells([176, 181, 187, 192], true),
    children: [
      { key: "salaires", label: "Masse salariale", cells: quarterCells([118, 121, 124, 126], true) },
      { key: "hebergement", label: "Hébergement", cells: quarterCells([22, 23, 25, 26], true) },
      { key: "marketing", label: "Marketing", cells: quarterCells([36, 37, 38, 40], true) },
    ],
  },
  { key: "resultat", label: "Résultat d'exploitation", emphasis: true, cells: quarterCells([36, 47, 54, 71]) },
];

const SEGMENT_ROWS: PeriodTableRow[] = [
  { key: "abonnements", label: "Abonnements", accent: "var(--lq-color-accent)", cells: quarterCells([158, 171, 184, 199]) },
  { key: "licences", label: "Licences poste", accent: "var(--lq-color-sky)", cells: quarterCells([34, 33, 31, 35]) },
  { key: "modules", label: "Modules analytiques", accent: "var(--lq-color-amber)", cells: quarterCells([20, 24, 26, 29]) },
];

/** Les douze derniers mois, de novembre 2025 à octobre 2026 : de quoi faire défiler. */
const MONTHS: PeriodTableColumn[] = [
  { key: "label", label: "", sticky: true, align: "left", width: 180 },
  ...REVENUE_TREND.map((_, i) => {
    const m = (10 + i) % 12;
    return { key: `m${i}`, label: MOIS_COURTS[m], sublabel: m >= 10 ? "2025" : "2026" };
  }),
];
const monthCells = (values: number[], format: (n: number) => string) => Object.fromEntries(values.map((v, i) => [`m${i}`, format(v)]));

const MONTHLY_ROWS: PeriodTableRow[] = [
  { key: "revenu", label: "Revenu mensuel", emphasis: true, cells: monthCells(REVENUE_TREND, (n) => keur(n)) },
  { key: "inscriptions", label: "Inscriptions", cells: monthCells(SIGNUPS_TREND, String) },
  { key: "resiliations", label: "Résiliations", cells: monthCells(CHURN_TREND, String) },
];

const KPI_COLUMNS: PeriodTableColumn[] = [
  { key: "label", label: "Indicateur", sticky: true, align: "left", width: 220 },
  { key: "actuel", label: "Actuel", sublabel: "oct. 2026" },
  { key: "objectif", label: "Objectif" },
  { key: "ecart", label: "Écart" },
];

const KPI_ROWS: PeriodTableRow[] = [
  {
    key: "acquisition",
    label: "Acquisition",
    emphasis: true,
    cells: {},
    children: [
      { key: "cac", label: "Coût d'acquisition", cells: { actuel: "412 €", objectif: "450 €", ecart: { value: "−38 €", tone: "up" } } },
      { key: "conversion", label: "Taux de conversion", cells: { actuel: "3,1 %", objectif: "3,5 %", ecart: { value: "−0,4 pt", tone: "down" } } },
    ],
  },
  {
    key: "retention",
    label: "Rétention",
    emphasis: true,
    cells: {},
    children: [
      { key: "churn", label: "Résiliation mensuelle", cells: { actuel: "1,2 %", objectif: "1,5 %", ecart: { value: "−0,3 pt", tone: "up" } } },
      { key: "nps", label: "NPS", cells: { actuel: "47", objectif: null, ecart: { value: "non suivi", tone: "muted" } } },
    ],
  },
];

/**
 * Le tableau par période : une colonne d'intitulés figée, une colonne par période, des lignes qui
 * s'imbriquent et se replient, et une variation sous chaque montant.
 */
const meta = {
  title: "Primitives/PeriodTable",
  component: PeriodTable,
  parameters: {
    docs: {
      description: {
        component: [
          "Tableau de chiffres à travers des périodes — compte de résultat, bilan, indicateurs mois par mois. Un seul composant pour toutes les vues financières, pour qu'elles partagent l'alignement, la colonne figée et la façon de montrer une donnée absente.",
          "",
          "**Colonnes** (`columns`) — une `key`, un `label` et un `sublabel` facultatif (« oct.–déc. » sous « T4 2025 ») ; `align` à droite par défaut, puisque l'essentiel est fait de nombres ; `sticky` fige la colonne contre le bord gauche pendant que les autres défilent — elle a alors besoin d'une `width`.",
          "",
          "**Lignes** (`rows`) — une `key`, un `label`, et `cells` indexées par clé de colonne. Une cellule est une valeur simple, ou `{ value, note, tone }` : `note` est la petite ligne dessous (la variation), `tone` colore valeur et note (`up`, `down`, `muted`). Une cellule `null`, `undefined` ou absente s'affiche « — », annoncé « Donnée indisponible ». `emphasis` dessine une ligne de total (fond, graisse) ; `accent` met une pastille de couleur devant l'intitulé, pour relier la ligne à sa série dans un graphique voisin.",
          "",
          "**Imbrication** — `children` imbrique des lignes, à toute profondeur ; chaque parent porte un bouton qui replie ses enfants (« Replier / Déplier … »). `defaultExpandedDepth` choisit jusqu'où tout part ouvert : 0 n'affiche que le premier niveau, `Infinity` (défaut) ouvre tout.",
          "",
          "**Quand l'utiliser** — des montants par période, lus en ligne. Pour une liste d'enregistrements à trier, filtrer, paginer, `DataTable` ; pour une hiérarchie sans chiffres, `TreeView`.",
          "",
          "**Fond** — le tableau a son propre fond, `--lq-color-panel`, comme sa colonne figée et son en-tête (qui masquent ce qui défile dessous) : il se lit d'un seul ton, posé dans une `Card` comme à même le fond de page.",
          "",
          "Donnez toujours un `caption` : c'est le nom du tableau pour les lecteurs d'écran.",
          "",
          "**Thème** — `--lq-color-panel` (en-tête et colonne figés), `--lq-color-border-subtle`, `--lq-color-hover` (lignes de total, ligne survolée), `--lq-font-weight-semibold`, `--lq-font-weight-bold`, `--lq-color-text-muted` (sous-titres, notes), `--lq-color-up` et `--lq-color-down` (tons).",
        ].join("\n"),
      },
    },
  },
  args: { columns: QUARTERS, rows: INCOME_ROWS, defaultExpandedDepth: 1, caption: "Compte de résultat simplifié par trimestre" },
  argTypes: {
    columns: { control: false },
    rows: { control: false },
    defaultExpandedDepth: { control: { type: "number", min: 0, max: 3 } },
  },
  // `defaultExpandedDepth` n'est lu qu'au premier rendu : la clé remonte le tableau quand le contrôle change.
  render: (args) => <PeriodTable key={args.defaultExpandedDepth} {...args} />,
  // Sur une carte, comme dans un écran : la colonne figée prend le fond des cartes.
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 900 }}>
        <Card>
          <Story />
        </Card>
      </div>
    ),
  ],
} satisfies Meta<typeof PeriodTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const FullyExpanded: Story = {
  name: "Tout déplié",
  args: { defaultExpandedDepth: Infinity },
};

export const Collapsed: Story = {
  name: "Replié",
  args: { defaultExpandedDepth: 0 },
  parameters: { docs: { description: { story: "Seules les lignes de premier niveau : les totaux. Les boutons devant chaque intitulé déplient le détail." } } },
};

export const Segments: Story = {
  name: "Segments à pastille",
  args: { rows: SEGMENT_ROWS, caption: "Chiffre d'affaires par segment" },
  parameters: { docs: { description: { story: "`accent` relie chaque ligne à la couleur de sa série dans un graphique posé au-dessus." } } },
};

export const ManyPeriods: Story = {
  name: "Douze mois (défilement)",
  args: { columns: MONTHS, rows: MONTHLY_ROWS, caption: "Indicateurs mensuels, novembre 2025 à octobre 2026" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
  parameters: { docs: { description: { story: "Plus de colonnes que de place : le tableau défile, la colonne d'intitulés reste figée." } } },
};

export const Indicators: Story = {
  name: "Indicateurs et données absentes",
  args: { columns: KPI_COLUMNS, rows: KPI_ROWS, defaultExpandedDepth: Infinity, caption: "Indicateurs du mois face aux objectifs" },
  parameters: {
    docs: { description: { story: "Des colonnes qui ne sont pas des périodes ; un objectif absent (`null`) s'affiche « — », et `tone: \"muted\"` atténue une valeur sans enjeu." } },
  },
};
