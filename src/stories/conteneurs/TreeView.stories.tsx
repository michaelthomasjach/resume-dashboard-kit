import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TreeView, moveTreeNode, Text, Input, SearchIcon, FolderIcon, FileIcon, type TreeNode } from "@michaelthomasjach/liseuse-dashboard-kit";

const DOCUMENTS: TreeNode[] = [
  {
    id: "clients",
    label: "Clients",
    icon: <FolderIcon size={16} />,
    children: [
      {
        id: "lemoine",
        label: "Lemoine SAS",
        icon: <FolderIcon size={16} />,
        children: [
          { id: "lemoine-contrat", label: "Contrat-cadre 2026.pdf", icon: <FileIcon size={16} /> },
          { id: "lemoine-factures", label: "Factures T3.zip", icon: <FileIcon size={16} /> },
        ],
      },
      {
        id: "vallee",
        label: "Groupe Vallée",
        icon: <FolderIcon size={16} />,
        children: [{ id: "vallee-devis", label: "Devis D-0193.pdf", icon: <FileIcon size={16} /> }],
      },
    ],
  },
  {
    id: "compta",
    label: "Comptabilité",
    icon: <FolderIcon size={16} />,
    children: [
      { id: "compta-grand-livre", label: "Grand livre 2026.xlsx", icon: <FileIcon size={16} /> },
      { id: "compta-archives", label: "Archives 2024", icon: <FolderIcon size={16} />, disabled: true },
    ],
  },
  { id: "cgv", label: "CGV en vigueur.pdf", icon: <FileIcon size={16} /> },
];

/** Les mêmes documents sans icône propre, pour les variantes qui dessinent les leurs (`showIcons`). */
const DOSSIERS: TreeNode[] = [
  {
    id: "clients",
    label: "Clients",
    children: [
      {
        id: "lemoine",
        label: "Lemoine SAS",
        children: [
          { id: "lemoine-contrat", label: "Contrat-cadre 2026.pdf" },
          { id: "lemoine-factures", label: "Factures T3.zip" },
          { id: "lemoine-avenant", label: "Avenant n°2.pdf" },
        ],
      },
      {
        id: "vallee",
        label: "Groupe Vallée",
        children: [
          { id: "vallee-devis", label: "Devis D-0193.pdf" },
          { id: "vallee-bon", label: "Bon de commande.pdf" },
        ],
      },
    ],
  },
  {
    id: "compta",
    label: "Comptabilité",
    children: [
      { id: "compta-grand-livre", label: "Grand livre 2026.xlsx" },
      { id: "compta-tva", label: "Déclarations TVA", children: [{ id: "tva-t2", label: "TVA T2.pdf" }, { id: "tva-t3", label: "TVA T3.pdf" }] },
      { id: "compta-archives", label: "Archives 2024", disabled: true },
    ],
  },
  { id: "cgv", label: "CGV en vigueur.pdf" },
];

const CATEGORIES: TreeNode[] = [
  {
    id: "logiciels",
    label: "Logiciels",
    children: [
      { id: "abonnements", label: "Abonnements", children: [{ id: "annuels", label: "Annuels" }, { id: "mensuels", label: "Mensuels" }] },
      { id: "licences", label: "Licences poste" },
    ],
  },
  { id: "services", label: "Services", children: [{ id: "formation", label: "Formation" }, { id: "support", label: "Support premium" }] },
];

/** Retrouve un nœud par son identifiant, pour afficher son libellé sous l'arbre. */
function find(nodes: TreeNode[], id: string | null): TreeNode | undefined {
  for (const n of nodes) {
    if (n.id === id) return n;
    const inChild = n.children && find(n.children, id);
    if (inChild) return inChild;
  }
  return undefined;
}

/** Un faux serveur : chaque dossier contient deux sous-dossiers et deux fichiers, servis en 900 ms.
 *  « Archives » échoue, pour montrer l'état d'erreur. */
function chargerDossier(node: TreeNode): Promise<TreeNode[]> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (node.id === "archives") reject(new Error("Serveur indisponible"));
      else
        resolve([
          { id: `${node.id}/a`, label: `${node.label} · 2025`, hasChildren: true },
          { id: `${node.id}/b`, label: `${node.label} · 2026`, hasChildren: true },
          { id: `${node.id}/1`, label: "Synthèse.pdf" },
          { id: `${node.id}/2`, label: "Budget.xlsx" },
        ]);
    }, 900),
  );
}

const frame = { maxWidth: 340, display: "flex", flexDirection: "column", gap: 10 } as const;

/**
 * L'arborescence : des nœuds qui se déplient, une sélection, et en option cases à cocher, icônes,
 * menu contextuel, filtre, lignes de guidage, densité compacte, chargement paresseux et glisser-déposer.
 */
const meta = {
  title: "Primitives/TreeView",
  component: TreeView,
  parameters: {
    docs: {
      description: {
        component: [
          "Arbre récursif à déplier : explorateur de documents, arbre de catégories, organigramme, droits par dossier. Chaque nœud (`TreeNode`) a un `id`, un `label`, une `icon` facultative, des `children` facultatifs, peut être `disabled`, et porte `hasChildren` quand ses enfants seront chargés plus tard.",
          "",
          "**Quand l'utiliser** — une hiérarchie de profondeur variable. Pour des chiffres hiérarchisés par période, `PeriodTable` ; pour un fil d'Ariane, `Breadcrumbs` ; pour deux niveaux fixes, une liste groupée suffit.",
          "",
          "**Déplier** — le chevron devant un nœud parent le déplie ou le replie ; un clic sur le libellé d'un parent le **sélectionne** et, du même coup, le déplie ou le replie. Non contrôlé par défaut (`defaultExpandedIds`) ; contrôlé avec `expandedIds` et `onExpandedChange(ids)`.",
          "",
          "**Sélection** — un seul nœud à la fois, toujours contrôlée : `selectedId` et `onSelect(id)`. Le nœud choisi prend le fond de survol et passe en gras. Un nœud `disabled` est atténué et n'est pas sélectionnable.",
          "",
          "**Cases à cocher** — `checkable` pose une `Checkbox` du kit devant chaque nœud. Cocher un parent coche tout son sous-arbre ; un parent dont les enfants ne sont cochés qu'en partie passe à l'état **indéterminé**, et se coche seul quand tous le sont. Les nœuds `disabled` restent hors de la cascade. Contrôlé avec `checkedIds` + `onCheckedChange(ids)` (tous les identifiants cochés, parents compris), libre avec `defaultCheckedIds`.",
          "",
          "**Icônes** — `showIcons` dessine une icône par défaut là où le nœud n'a pas d'`icon` : dossier fermé ou ouvert selon l'état pour un parent, fichier pour une feuille. Une `icon` posée sur le nœud garde la priorité.",
          "",
          "**Menu contextuel** — `contextMenu(node)` renvoie les entrées d'un `ContextMenu` (libellé, raccourci, icône, `disabled`, séparateurs) ; il s'ouvre au clic droit ou, au clavier, avec la touche Menu ou Maj+F10. Un tableau vide laisse le nœud sans menu (et le clic droit au navigateur). À la fermeture, le focus revient au nœud.",
          "",
          "**Filtre** — `filter` ne garde que les nœuds dont le libellé contient le texte (casse et accents ignorés) et leurs ancêtres, déplie ces ancêtres et **surligne** la partie trouvée. Un parent trouvé garde tout son contenu, replié. Sans résultat, `filterEmptyMessage` remplace l'arbre. Les enfants pas encore chargés ne sont pas cherchés.",
          "",
          "**Apparence** — `showGuides` trace un filet vertical sous chaque parent ouvert, de son premier à son dernier enfant ; `density=\"compact\"` resserre les lignes (24 px au lieu de 30) et la police.",
          "",
          "**Chargement paresseux** — `loadChildren(node)` renvoie une promesse d'enfants ; elle est appelée à la première ouverture d'un nœud `hasChildren` sans `children`. Un indicateur remplace le chevron pendant le chargement (`aria-busy` sur le nœud). En cas d'échec, une ligne « Impossible de charger le contenu » s'affiche ; replier puis déplier réessaie. Des enfants qui arrivent sous un parent coché naissent cochés.",
          "",
          "**Glisser-déposer** — avec `onMove(draggedId, targetId, position)`, les nœuds se déplacent à la souris : déposé sur le haut d'une ligne, avant elle ; sur le bas, après ; au centre, dedans. `moveTreeNode(nodes, draggedId, targetId, position)`, exporté par le kit, applique le déplacement sans muter l'arbre.",
          "",
          "**Clavier et accessibilité** — motif ARIA *treeview* : un seul arrêt de tabulation (tabindex mobile), ↑ ↓ parcourent les nœuds visibles, → déplie puis descend au premier enfant, ← replie puis remonte au parent, Début / Fin, Entrée sélectionne (et déplie un parent), Espace coche (avec `checkable`) ou sélectionne, `*` déplie tous les frères, une lettre saute au prochain nœud qui commence par elle. `role=\"tree\"` (nom avec `ariaLabel`), `treeitem` avec `aria-level`, `aria-expanded`, `aria-selected`, `aria-checked` (`mixed` pour l'indéterminé) et `aria-busy`, `group` pour les enfants. Le focus se voit en anneau `--lq-color-focus-ring` sur la ligne.",
          "",
          "**Thème** — `--lq-color-text`, `--lq-color-text-muted` (chevrons, icônes), `--lq-color-hover` (survol et sélection), `--lq-font-weight-bold` (sélection, partie trouvée), `--lq-color-accent` (repères de dépôt, surlignage), `--lq-color-focus-ring`, `--lq-color-border-subtle` (lignes de guidage), `--lq-color-danger` (erreur de chargement), `--lq-radius-sm`, `--lq-radius-pill`, `--lq-transition-fast`. Variables optionnelles : `--lq-tree-row-height` (30 px), `--lq-tree-indent` (18 px par niveau), `--lq-tree-font-size`, `--lq-tree-compact-row-height` (24 px), `--lq-tree-compact-font-size`, `--lq-tree-icon-color`, `--lq-tree-folder-color`, `--lq-tree-guide-color`, `--lq-tree-match-bg`.",
        ].join("\n"),
      },
    },
  },
  args: {
    nodes: DOCUMENTS,
    defaultExpandedIds: ["clients", "lemoine", "compta"],
    selectedId: "lemoine-contrat",
    onSelect: fn(),
    onExpandedChange: fn(),
    onCheckedChange: fn(),
    checkable: false,
    showIcons: false,
    showGuides: false,
    density: "normal",
    filter: "",
  },
  argTypes: {
    nodes: { control: false },
    selectedId: { control: false },
    expandedIds: { control: false },
    checkedIds: { control: false },
    // Lus au premier rendu seulement : les changer ensuite ne ferait rien.
    defaultExpandedIds: { control: false },
    defaultCheckedIds: { control: false },
    checkable: { control: "boolean" },
    showIcons: { control: "boolean" },
    showGuides: { control: "boolean" },
    density: { control: "inline-radio", options: ["normal", "compact"], table: { defaultValue: { summary: '"normal"' } } },
    filter: { control: "text" },
    filterEmptyMessage: { control: "text", table: { defaultValue: { summary: '"Aucun élément ne correspond"' } } },
    ariaLabel: { control: "text" },
    contextMenu: { control: false },
    loadChildren: { control: false },
    onMove: { control: false },
  },
  render: function Render(args) {
    const [selected, setSelected] = useState<string | null>(args.selectedId ?? null);
    return (
      <div style={frame}>
        <TreeView
          {...args}
          selectedId={selected}
          onSelect={(id) => {
            setSelected(id);
            args.onSelect?.(id);
          }}
        />
        <Text size="sm" muted>
          Sélection : {find(args.nodes, selected)?.label ?? "aucune"}
        </Text>
      </div>
    );
  },
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Collapsed: Story = {
  name: "Replié",
  args: { defaultExpandedIds: [], selectedId: null },
};

export const WithoutIcons: Story = {
  name: "Sans icônes",
  args: { nodes: CATEGORIES, defaultExpandedIds: ["logiciels", "abonnements"], selectedId: "annuels" },
  parameters: { docs: { description: { story: "Un arbre de catégories : l'indentation et les chevrons suffisent." } } },
};

export const ControlledExpansion: Story = {
  name: "Dépliage contrôlé",
  render: function Render(args) {
    const [expanded, setExpanded] = useState<string[]>(["clients"]);
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div style={frame}>
        <TreeView
          nodes={args.nodes}
          expandedIds={expanded}
          onExpandedChange={setExpanded}
          selectedId={selected}
          onSelect={setSelected}
        />
        <Text size="sm" muted>
          Dépliés : {expanded.length ? expanded.join(", ") : "aucun"}
        </Text>
      </div>
    );
  },
  parameters: { docs: { description: { story: "Avec `expandedIds` et `onExpandedChange`, le parent connaît (et peut imposer) les nœuds dépliés." } } },
};

export const DragAndDrop: Story = {
  name: "Glisser-déposer",
  render: function Render(args) {
    const [nodes, setNodes] = useState<TreeNode[]>(args.nodes);
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div style={frame}>
        <Text size="sm" muted>
          Glissez un document : sur le haut d'une ligne pour le placer avant, sur le bas pour après, au centre pour le ranger dedans.
        </Text>
        <TreeView
          nodes={nodes}
          selectedId={selected}
          onSelect={setSelected}
          defaultExpandedIds={["clients", "lemoine", "vallee", "compta"]}
          onMove={(draggedId, targetId, position) => setNodes((prev) => moveTreeNode(prev, draggedId, targetId, position))}
        />
      </div>
    );
  },
  parameters: { docs: { description: { story: "`onMove` active le glisser-déposer ; `moveTreeNode` calcule le nouvel arbre." } } },
};

export const Checkable: Story = {
  name: "Cases à cocher",
  render: function Render(args) {
    const [checked, setChecked] = useState<string[]>(["lemoine-contrat", "lemoine-factures"]);
    return (
      <div style={frame}>
        <TreeView
          nodes={DOSSIERS}
          checkable
          showIcons
          checkedIds={checked}
          onCheckedChange={(ids) => {
            setChecked(ids);
            args.onCheckedChange?.(ids);
          }}
          defaultExpandedIds={["clients", "lemoine", "compta"]}
          ariaLabel="Dossiers partagés"
        />
        <Text size="sm" muted>
          {checked.length} élément{checked.length > 1 ? "s" : ""} coché{checked.length > 1 ? "s" : ""}
        </Text>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Le partage d'un dossier client : cocher « Clients » coche tout son contenu ; « Lemoine SAS », dont deux fichiers sur trois sont cochés, est indéterminé. « Archives 2024 », désactivé, reste en dehors de la cascade.",
      },
    },
  },
};

export const DefaultIcons: Story = {
  name: "Icônes de dossier et de fichier",
  args: { nodes: DOSSIERS, showIcons: true, defaultExpandedIds: ["clients", "lemoine"], selectedId: "lemoine-avenant" },
  parameters: { docs: { description: { story: "`showIcons` sans une seule `icon` dans les données : dossier ouvert ou fermé selon l'état, fichier pour une feuille." } } },
};

export const WithContextMenu: Story = {
  name: "Menu contextuel",
  render: function Render() {
    const [nodes, setNodes] = useState<TreeNode[]>(DOSSIERS);
    const [log, setLog] = useState("Clic droit sur un nœud, ou touche Menu / Maj+F10 au clavier.");
    const supprimer = (id: string) => {
      const sans = (list: TreeNode[]): TreeNode[] =>
        list.filter((n) => n.id !== id).map((n) => (n.children ? { ...n, children: sans(n.children) } : n));
      setNodes(sans);
    };
    return (
      <div style={frame}>
        <TreeView
          nodes={nodes}
          showIcons
          defaultExpandedIds={["clients", "lemoine"]}
          contextMenu={(node) => [
            { label: "Ouvrir", hint: "Entrée", onSelect: () => setLog(`Ouvrir « ${node.label} »`) },
            { label: "Renommer", hint: "F2", onSelect: () => setLog(`Renommer « ${node.label} »`) },
            { label: "Télécharger", onSelect: () => setLog(`Télécharger « ${node.label} »`), disabled: Boolean(node.children) },
            { separator: true },
            { label: "Supprimer", onSelect: () => supprimer(node.id) },
          ]}
        />
        <Text size="sm" muted>
          {log}
        </Text>
      </div>
    );
  },
  parameters: { docs: { description: { story: "« Télécharger » est grisé sur un dossier, pour que le menu garde la même forme d'un nœud à l'autre. « Supprimer » retire vraiment le nœud." } } },
};

export const Filter: Story = {
  name: "Filtre",
  render: function Render() {
    const [query, setQuery] = useState("pdf");
    return (
      <div style={frame}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filtrer les documents"
          aria-label="Filtrer les documents"
          leadingIcon={<SearchIcon size={16} />}
        />
        <TreeView nodes={DOSSIERS} showIcons filter={query} ariaLabel="Documents" />
      </div>
    );
  },
  parameters: { docs: { description: { story: "Tapez « vallee » (sans accent) ou « tva » : les ancêtres des nœuds trouvés se déplient seuls, la partie trouvée est surlignée. Videz le champ pour retrouver l'arbre." } } },
};

export const Guides: Story = {
  name: "Lignes de guidage",
  args: { nodes: DOSSIERS, showIcons: true, showGuides: true, defaultExpandedIds: ["clients", "lemoine", "vallee", "compta", "compta-tva"], selectedId: null },
  parameters: { docs: { description: { story: "`showGuides` relie chaque parent ouvert à ses enfants : utile dès trois niveaux." } } },
};

export const Compact: Story = {
  name: "Densité compacte",
  args: {
    nodes: DOSSIERS,
    showIcons: true,
    showGuides: true,
    checkable: true,
    density: "compact",
    defaultExpandedIds: ["clients", "lemoine", "vallee", "compta", "compta-tva"],
    selectedId: null,
  },
  parameters: { docs: { description: { story: "`density=\"compact\"` : lignes de 24 px, police un cran plus petite, cases réduites — pour un panneau latéral." } } },
};

export const LazyLoading: Story = {
  name: "Chargement paresseux",
  render: function Render() {
    return (
      <div style={frame}>
        <Text size="sm" muted>
          Chaque dossier charge son contenu à la première ouverture ; « Archives » échoue.
        </Text>
        <TreeView
          nodes={[
            { id: "projets", label: "Projets", hasChildren: true },
            { id: "archives", label: "Archives", hasChildren: true },
            { id: "lisez-moi", label: "Lisez-moi.txt" },
          ]}
          showIcons
          checkable
          loadChildren={chargerDossier}
          ariaLabel="Serveur de fichiers"
        />
      </div>
    );
  },
  parameters: { docs: { description: { story: "`loadChildren` est appelée à la première ouverture d'un nœud `hasChildren` ; l'indicateur remplace le chevron le temps du chargement. Replier puis déplier « Archives » relance la requête." } } },
};

export const KeyboardNavigation: Story = {
  name: "Navigation au clavier",
  render: function Render() {
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div style={frame}>
        <Text size="sm" muted>
          Tab pour entrer dans l'arbre, ↑ ↓ pour parcourir, → ← pour déplier, replier ou remonter, Début / Fin, Entrée pour choisir, * pour
          déplier tous les frères, une lettre pour sauter au nœud suivant qui commence par elle.
        </Text>
        <TreeView nodes={DOSSIERS} showIcons selectedId={selected} onSelect={setSelected} ariaLabel="Documents" />
        <Text size="sm" muted>
          Sélection : {find(DOSSIERS, selected)?.label ?? "aucune"}
        </Text>
      </div>
    );
  },
  parameters: { docs: { description: { story: "Un seul arrêt de tabulation pour tout l'arbre, puis le motif ARIA *treeview* au clavier." } } },
};
