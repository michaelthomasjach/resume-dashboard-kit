import { useState } from "react";
import { Badge, Button, Card, DataTable, PlusIcon, Text, type DataTableColumn } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ScreenHead } from "../Specimen";
import { ORDERS, ORDERS_LONG, statutTone, type Order } from "../demoData";

const euro = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const date = (iso: string) => new Date(iso).toLocaleDateString("fr-FR");

const COLUMNS: DataTableColumn<Order>[] = [
  { id: "id", header: "Commande", accessor: (o) => o.id, sortValue: (o) => o.id, width: "7rem", hideable: false },
  { id: "date", header: "Date", accessor: (o) => date(o.date), sortValue: (o) => o.date, textValue: (o) => date(o.date), width: "8rem" },
  { id: "client", header: "Client", accessor: (o) => o.client, sortValue: (o) => o.client },
  { id: "produit", header: "Produit", accessor: (o) => o.produit, sortValue: (o) => o.produit },
  { id: "quantite", header: "Qté", accessor: (o) => o.quantite, sortValue: (o) => o.quantite, align: "right", width: "5rem" },
  { id: "montant", header: "Montant", accessor: (o) => euro(o.montant), sortValue: (o) => o.montant, textValue: (o) => String(o.montant), align: "right", width: "8rem" },
  {
    id: "statut",
    header: "Statut",
    accessor: (o) => <Badge tone={statutTone(o.statut)}>{o.statut}</Badge>,
    sortValue: (o) => o.statut,
    width: "8rem",
  },
];

/** Les colonnes d'un tableau étroit, pour les cartes en demi-largeur. */
const NARROW = COLUMNS.filter((c) => ["id", "client", "montant", "statut"].includes(c.id));

const rowKey = (o: Order) => o.id;

const detail = (o: Order) => (
  <span>
    {o.quantite} × {o.produit} pour {o.client}, commandé le {date(o.date)} — {euro(Math.round(o.montant / o.quantite))} l'unité.
  </span>
);

/** Le tableau à lignes ajoutées : chaque clic sur « Ajouter » pousse une commande en tête. */
function DynamicRows() {
  const [rows, setRows] = useState(ORDERS.slice(0, 4));
  const add = () => {
    const n = 4900 + rows.length;
    const base = ORDERS_LONG[rows.length % ORDERS_LONG.length];
    setRows([{ ...base, id: `C-${n}`, statut: "en attente" }, ...rows]);
  };
  return (
    <DataTable
      columns={NARROW}
      rows={rows}
      rowKey={rowKey}
      hover
      toolbar={
        <Button icon={<PlusIcon size={14} />} onClick={add}>
          Ajouter une ligne
        </Button>
      }
    />
  );
}

/**
 * L'écran des tableaux : toutes les variantes d'un tableau de données d'administration, toutes
 * tenues par le seul `DataTable` du kit — densité, rayures, survol, bordures, lignes dépliables,
 * recherche, pagination, sélection, choix des colonnes, export, en-tête figé.
 *
 * Rien n'est contourné ici : quand une variante manquait, elle a été ajoutée au composant du kit
 * (v0.185.0), et ce sont ses variables `--lq-table-*` que `resume.css` règle au style du CV (en-têtes
 * en bleu, pagination en carrés).
 */
export function Tables() {
  const [selection, setSelection] = useState<string[]>([]);
  return (
    <div className="rdk-screen">
      <ScreenHead
        title="Tableaux"
        intro="Le DataTable du kit dans toutes ses variantes. Cliquer un en-tête trie, un second clic inverse, un troisième rend l'ordre d'origine."
      />

      <Card
        title="Tableau de données"
        meta={`${ORDERS_LONG.length} commandes`}
      >
        <DataTable
          columns={COLUMNS}
          rows={ORDERS_LONG}
          rowKey={rowKey}
          searchable
          columnPicker
          exportable={{ filename: "commandes.csv" }}
          selectable
          selectedKeys={selection}
          onSelectionChange={setSelection}
          hover
          pageSize={10}
          emptyMessage="Aucune commande ne correspond à la recherche"
        />
      </Card>

      <div className="rdk-grid rdk-grid--tables">
        <Card title="Survol">
          <DataTable columns={NARROW} rows={ORDERS.slice(0, 5)} rowKey={rowKey} hover />
        </Card>
        <Card title="Rayé">
          <DataTable columns={NARROW} rows={ORDERS.slice(0, 5)} rowKey={rowKey} striped />
        </Card>
        <Card title="Condensé">
          <DataTable columns={NARROW} rows={ORDERS} rowKey={rowKey} density="condensed" hover />
        </Card>
        <Card title="Détaillé">
          <DataTable
            columns={NARROW}
            rows={ORDERS}
            rowKey={rowKey}
            density="condensed"
            hover
            renderExpanded={detail}
            defaultExpandedKeys={["C-4821"]}
          />
        </Card>
        <Card title="Lignes ajoutées">
          <DynamicRows />
        </Card>
        <Card title="Bordé">
          <DataTable columns={NARROW} rows={ORDERS.slice(0, 5)} rowKey={rowKey} bordered />
        </Card>
      </div>

      <Card title="En-tête figé" meta="le corps défile, l'en-tête reste">
        <DataTable columns={COLUMNS} rows={ORDERS_LONG} rowKey={rowKey} maxHeight={360} striped density="condensed" />
      </Card>

      <Card title="Vide" bare>
        <Text size="sm" muted>
          Sans ligne, le tableau garde ses en-têtes et porte son message sur toute la largeur.
        </Text>
        <DataTable columns={NARROW} rows={[]} rowKey={rowKey} emptyMessage="Aucune commande ce mois-ci" />
      </Card>
    </div>
  );
}
