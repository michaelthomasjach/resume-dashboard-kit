import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { DataTable, Badge, PriceChangeTag, Sparkline, type DataTableColumn } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ORDERS, ORDERS_LONG, HOLDINGS, statutTone, type Order, type Holding } from "../../showcase/demoData";

const euro = (n: number, digits = 0) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: digits, maximumFractionDigits: digits });
const pct = (n: number) => `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;
const date = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

/** Les colonnes d'une liste de commandes : toutes triables, montants et quantités à droite. */
const ORDER_COLUMNS: DataTableColumn<Order>[] = [
  { id: "id", header: "N°", accessor: (o) => o.id, sortValue: (o) => o.id, width: "6rem" },
  { id: "client", header: "Client", accessor: (o) => o.client, sortValue: (o) => o.client },
  { id: "produit", header: "Produit", accessor: (o) => o.produit, sortValue: (o) => o.produit },
  { id: "quantite", header: "Qté", accessor: (o) => o.quantite, sortValue: (o) => o.quantite, align: "right", width: "5rem" },
  { id: "montant", header: "Montant", accessor: (o) => euro(o.montant), sortValue: (o) => o.montant, align: "right" },
  { id: "statut", header: "Statut", accessor: (o) => <Badge tone={statutTone(o.statut)}>{o.statut}</Badge>, sortValue: (o) => o.statut },
  { id: "date", header: "Date", accessor: (o) => date(o.date), sortValue: (o) => o.date, align: "right" },
];

/**
 * Le tableau de données du kit : triable, défilant à l'horizontale quand il manque de place.
 */
const meta = {
  title: "Finance/DataTable",
  component: DataTable<Order>,
  parameters: {
    docs: {
      description: {
        component: [
          "Tableau de données **triable** et **défilant à l'horizontale** quand l'écran est étroit : commandes, transactions, positions. Tout le reste est optionnel et se combine : densité, rayures, survol, bordures, en-tête figé, sélection, lignes dépliables, recherche, pagination, export CSV, choix des colonnes.",
          "",
          "**Quand l'utiliser** — une liste d'enregistrements de même forme, à lire ou comparer colonne par colonne. Pour quelques lignes de chiffres sous un titre, une `Panel` avec des `PanelRow` est plus légère ; pour des valeurs par période (mois en colonnes), `PeriodTable` ; pour une liste de positions en cartes, `WatchlistWidget`.",
          "",
          "**Colonnes** — `columns` décrit chaque colonne : `id`, `header` (le titre, passé en petites capitales par le thème), `accessor` (ce que la cellule affiche, n'importe quel `ReactNode` : une pastille, un écart, une courbe), `align` (`left` par défaut, `right` pour les nombres), `width`. `rowKey` donne la clé React de chaque ligne.",
          "",
          "**Tri** — une colonne est triable dès qu'elle a un `sortValue`, qui renvoie la valeur à comparer (nombre ou texte — pas la cellule formatée). Un clic sur l'en-tête trie en **croissant**, un deuxième en **décroissant**, un troisième **rend l'ordre d'origine**. Deux nombres se comparent numériquement, le reste par `localeCompare`. L'en-tête trié porte `aria-sort`. Le tri est interne au composant : il n'est ni contrôlable ni notifié.",
          "",
          "**Lignes** — avec `onRowClick`, chaque ligne prend un fond au survol et un clic la renvoie entière. Sans ligne, le tableau affiche `emptyMessage` (« Aucune donnée » par défaut).",
          "",
          "**Clavier** — chaque en-tête triable porte un vrai bouton (dans le `<th>`, qui garde `aria-sort`) : Tab y mène, Entrée ou Espace trient. Avec `onRowClick`, chaque ligne est focalisable et Entrée ou Espace l'activent, comme un clic.",
          "",
          "**Alignement** — dans une colonne triable alignée à droite, la flèche de tri passe à gauche du libellé : l'en-tête tombe au droit des chiffres de la colonne (voyez « Montant » et « Date »).",
          "",
          "**Apparence** — `density=\"condensed\"` resserre les cellules, `striped` teinte une ligne sur deux, `hover` surligne la ligne survolée sans la rendre cliquable, `bordered` ajoute un cadre et des filets de colonnes. `maxHeight` borne la hauteur : le corps défile et l'en-tête reste figé.",
          "",
          "**Sélection** — `selectable` ajoute une case par ligne et une case **tri-état** dans l'en-tête, qui agit sur toutes les lignes filtrées, toutes pages confondues. Contrôlée avec `selectedKeys` + `onSelectionChange`, ou libre avec `defaultSelectedKeys`.",
          "",
          "**Lignes dépliables** — `renderExpanded` rend le détail d'une ligne sur toute la largeur, sous un chevron ; `isExpandable` en exclut certaines, `defaultExpandedKeys` en ouvre au départ.",
          "",
          "**Recherche, pagination, export, colonnes** — `searchable` filtre sur le texte des colonnes visibles ; `pageSize` pagine ; `exportable` télécharge un CSV (séparateur « ; » et BOM, pour Excel) des lignes filtrées et triées ; `columnPicker` laisse masquer des colonnes (`defaultHidden`, `hideable: false`). Le texte d'une cellule vient de `textValue`, sinon de `sortValue`, sinon du rendu quand c'est une chaîne. Ordre d'application : recherche, tri, pagination. `toolbar` place un contenu libre à gauche de la barre d'outils, `labels` en change les textes.",
          "",
          "**Thème** — `--lq-row-font-size` (12 px, un cran sous le corps), `--lq-label-font`, `--lq-label-size`, `--lq-label-tracking` (en-têtes), `--lq-color-border` (filet sous l'en-tête), `--lq-color-border-subtle` (filets de lignes), `--lq-color-hover` (survol), `--lq-space-2`, `--lq-space-3`. Et les variables `--lq-table-*`, réglées ici au style du CV : cellules à 12 / 14 px (7 en condensé), en-têtes à 10 / 14 px dans le bleu de l'accent, comme les « Skills: » du CV, rayure `#f4f5fb`, survol `#eef0fb`, pagination en carrés de 12 px, page courante en gras.",
        ].join("\n"),
      },
    },
  },
  args: {
    columns: ORDER_COLUMNS,
    rows: ORDERS,
    rowKey: (o: Order) => o.id,
    onRowClick: fn(),
    emptyMessage: "Aucune commande",
  },
  argTypes: {
    columns: { control: false },
    rows: { control: "object" },
    rowKey: { control: false },
    emptyMessage: { control: "text", table: { defaultValue: { summary: '"Aucune donnée"' } } },
    density: { control: "inline-radio", options: ["normal", "condensed"] },
    striped: { control: "boolean" },
    hover: { control: "boolean" },
    bordered: { control: "boolean" },
    maxHeight: { control: "number" },
    selectable: { control: "boolean" },
    searchable: { control: "boolean" },
    columnPicker: { control: "boolean" },
    exportable: { control: "boolean" },
    pageSize: { control: "number" },
    renderExpanded: { control: false },
    isExpandable: { control: false },
    toolbar: { control: false },
    labels: { control: "object" },
  },
} satisfies Meta<typeof DataTable<Order>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Empty: Story = {
  name: "Vide",
  args: { rows: [] },
  parameters: { docs: { description: { story: "Sans ligne, une cellule pleine largeur porte `emptyMessage`. Écrivez-le pour le contexte : « Aucune commande ce mois-ci » vaut mieux que « Aucune donnée »." } } },
};

const POSITION_COLUMNS: DataTableColumn<Holding>[] = [
  { id: "symbol", header: "Titre", accessor: (h) => h.symbol, sortValue: (h) => h.symbol, width: "6rem" },
  { id: "name", header: "Société", accessor: (h) => h.name, sortValue: (h) => h.name },
  { id: "trend", header: "Tendance", accessor: (h) => <Sparkline data={h.sparklineData} width={80} height={24} colorByTrend /> },
  { id: "quantity", header: "Quantité", accessor: (h) => h.quantity, sortValue: (h) => h.quantity, align: "right" },
  { id: "price", header: "Cours", accessor: (h) => euro(h.price, 2), sortValue: (h) => h.price, align: "right" },
  { id: "value", header: "Valorisation", accessor: (h) => euro(h.price * h.quantity), sortValue: (h) => h.price * h.quantity, align: "right" },
  { id: "change", header: "Séance", accessor: (h) => <PriceChangeTag value={h.change} format={pct} />, sortValue: (h) => h.change, align: "right", width: "7rem" },
];

export const Positions: Story = {
  name: "Positions, avec cellules riches",
  render: () => <DataTable columns={POSITION_COLUMNS} rows={HOLDINGS} rowKey={(h) => h.id} />,
  parameters: {
    docs: {
      description: {
        story:
          "Une cellule peut contenir n'importe quel composant — ici une `Sparkline` et un `PriceChangeTag`. La colonne « Valorisation » trie sur un calcul (`price × quantity`), « Tendance » n'a pas de `sortValue` et ne se trie pas. Sans `onRowClick`, les lignes sont inertes.",
      },
    },
  },
};

export const RowClick: Story = {
  name: "Ligne cliquable",
  render: function Render() {
    const [selected, setSelected] = useState<Order | null>(null);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <DataTable columns={ORDER_COLUMNS} rows={ORDERS} rowKey={(o) => o.id} onRowClick={setSelected} />
        <div>
          {selected ? (
            <Badge tone="info">
              {selected.id} · {selected.client} · {euro(selected.montant)}
            </Badge>
          ) : (
            <Badge>Cliquez une ligne</Badge>
          )}
        </div>
      </div>
    );
  },
  parameters: { docs: { description: { story: "`onRowClick` reçoit l'enregistrement entier, pas son index : le tri ne fausse donc pas la sélection." } } },
};

export const NotSortable: Story = {
  name: "Sans tri",
  args: {
    columns: ORDER_COLUMNS.filter((c) => ["id", "client", "montant", "statut"].includes(c.id)).map((column) => ({ ...column, sortValue: undefined })),
    onRowClick: undefined,
  },
  parameters: { docs: { description: { story: "Aucune colonne n'a de `sortValue` : les en-têtes ne réagissent pas au clic, les lignes gardent l'ordre fourni." } } },
};

/* ---- variantes ---- */

const long = { rows: ORDERS_LONG, onRowClick: undefined };

export const Condensed: Story = {
  name: "Condensé",
  args: { density: "condensed", onRowClick: undefined },
  parameters: { docs: { description: { story: "`density=\"condensed\"` : 12 px au-dessus et au-dessous de chaque cellule au lieu de 20, pour une liste longue ou un tableau d'appoint." } } },
};

export const Striped: Story = {
  name: "Rayé",
  args: { striped: true, onRowClick: undefined },
  parameters: { docs: { description: { story: "`striped` : une ligne sur deux prend le gris du fond de page. La rayure suit les lignes de données : une ligne dépliée ne la décale pas." } } },
};

export const HoverRows: Story = {
  name: "Survol",
  args: { hover: true, onRowClick: undefined },
  parameters: { docs: { description: { story: "`hover` : la ligne survolée prend le bleu pâle du thème (`#eef0fb`), sans devenir cliquable." } } },
};

export const Bordered: Story = {
  name: "Bordé",
  args: { bordered: true, onRowClick: undefined },
  parameters: { docs: { description: { story: "`bordered` : un cadre autour du tableau et des filets entre les colonnes." } } },
};

export const Paginated: Story = {
  name: "Pagination",
  args: { ...long, pageSize: 10, hover: true },
  parameters: { docs: { description: { story: "`pageSize` : dix lignes par page sur 57. L'intervalle s'affiche à gauche ; à droite les pages, abrégées par une ellipse au-delà de sept." } } },
};

export const Searchable: Story = {
  name: "Recherche",
  args: { ...long, searchable: true, pageSize: 8, emptyMessage: "Aucune commande ne correspond" },
  parameters: { docs: { description: { story: "`searchable` : essayez « attente » ou « Roux ». La recherche revient à la première page et la pagination suit le nombre de lignes trouvées." } } },
};

export const Selectable: Story = {
  name: "Sélection de lignes",
  render: function Render(args) {
    const [keys, setKeys] = useState<string[]>(["C-4822"]);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <DataTable {...args} onRowClick={undefined} selectable selectedKeys={keys} onSelectionChange={setKeys} hover />
        <div>{keys.length ? <Badge tone="info">{keys.join(", ")}</Badge> : <Badge>Aucune sélection</Badge>}</div>
      </div>
    );
  },
  parameters: { docs: { description: { story: "`selectable`, ici contrôlé : la case d'en-tête passe à l'état indéterminé dès qu'une partie seulement des lignes est cochée." } } },
};

export const Expandable: Story = {
  name: "Lignes dépliables",
  args: {
    onRowClick: undefined,
    hover: true,
    defaultExpandedKeys: ["C-4821"],
    isExpandable: (o: Order) => o.statut !== "annulée",
    renderExpanded: (o: Order) => (
      <span>
        {o.quantite} × {o.produit} pour {o.client}, commandé le {date(o.date)} — {euro(Math.round(o.montant / o.quantite))} l'unité.
      </span>
    ),
  },
  parameters: { docs: { description: { story: "`renderExpanded` : un chevron en tête de ligne déplie le détail. `isExpandable` en exclut ici les commandes annulées, qui n'ont pas de chevron." } } },
};

export const StickyHeader: Story = {
  name: "En-tête figé",
  args: { ...long, maxHeight: 360, striped: true, density: "condensed" },
  parameters: { docs: { description: { story: "`maxHeight` : au-delà de 360 px le corps défile, l'en-tête reste en place sur le fond du panneau." } } },
};

export const ColumnsAndExport: Story = {
  name: "Choix des colonnes et export",
  args: {
    onRowClick: undefined,
    columns: ORDER_COLUMNS.map((c) => (c.id === "quantite" || c.id === "date" ? { ...c, defaultHidden: true } : c.id === "id" ? { ...c, hideable: false } : c)),
    columnPicker: true,
    exportable: { filename: "commandes.csv" },
  },
  parameters: { docs: { description: { story: "`columnPicker` : « Qté » et « Date » sont masquées au départ (`defaultHidden`), « N° » ne peut pas l'être (`hideable: false`). `exportable` télécharge les colonnes visibles, lignes filtrées et triées." } } },
};

export const Complete: Story = {
  name: "Tout ensemble",
  args: {
    ...long,
    toolbar: <strong>Commandes</strong>,
    searchable: true,
    columnPicker: true,
    exportable: { filename: "commandes.csv" },
    selectable: true,
    hover: true,
    density: "condensed",
    pageSize: 10,
    renderExpanded: (o: Order) => (
      <span>
        {o.quantite} × {o.produit} — {o.client}
      </span>
    ),
  },
  parameters: { docs: { description: { story: "Barre d'outils, recherche, choix des colonnes, export, sélection, détail et pagination ensemble." } } },
};
