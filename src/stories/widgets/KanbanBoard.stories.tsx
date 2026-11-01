import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { KanbanBoard, Text, type KanbanCard, type KanbanMove } from "@michaelthomasjach/liseuse-dashboard-kit";
import { KANBAN_CARDS, KANBAN_COLUMNS } from "../../showcase/widgetData";

/** Applique un déplacement : la carte change de colonne et prend la place visée (« Livré » est rangé par date). */
function applyMove(cards: KanbanCard[], m: KanbanMove): KanbanCard[] {
  const moved: KanbanCard = {
    ...m.card,
    columnId: m.toColumnId,
    ...(m.toColumnId === "done" ? { meta: "livré aujourd'hui", group: "samedi 31 octobre 2026" } : { meta: undefined, group: undefined }),
  };
  const rest = cards.filter((c) => c.id !== m.card.id);
  const target = rest.filter((c) => c.columnId === m.toColumnId);
  // Une colonne non triable range ses cartes elle-même : la plus récente en tête.
  const anchor = m.toColumnId === "done" ? target[0] : target[m.index];
  const at = anchor ? rest.indexOf(anchor) : rest.length;
  return [...rest.slice(0, at), moved, ...rest.slice(at)];
}

const columnTitle = (id: string) => KANBAN_COLUMNS.find((c) => c.id === id)?.title ?? id;

/**
 * Un tableau Kanban : des colonnes, des cartes qu'on fait glisser de l'une à l'autre. Le composant
 * dessine et signale ; l'application range.
 */
const meta = {
  title: "Widgets/KanbanBoard",
  component: KanbanBoard,
  parameters: {
    docs: {
      description: {
        component: [
          "Un **tableau Kanban** : des colonnes (« À faire », « En cours », « Livré »…) et des cartes qu'on fait avancer de l'une à l'autre.",
          "",
          "**Quand l'utiliser** — pour suivre des éléments qui passent par des étapes : demandes, commandes, tickets, recrutements. Pour une liste à trier ou filtrer sur plusieurs champs, `DataTable` ; pour des tâches dans le temps, `Scheduler`.",
          "",
          "**Ce que fait le composant, et ce qu'il laisse à l'application** — il dessine les colonnes et les cartes, gère le **glisser-déposer** (avec un repère d'insertion entre deux cartes) et des boutons ← → sur chaque carte pour la passer à la colonne voisine, utilisables au clavier. Il ne garde **aucun état métier** : il reçoit les cartes déjà ordonnées, signale chaque déplacement par `onMove` (`card`, `fromColumnId`, `toColumnId`, `index` dans la colonne d'arrivée) et c'est à l'application d'enregistrer le changement et de renvoyer la liste.",
          "",
          "**Colonnes** — chacune a un `title`, au besoin un `hint` sous le titre et un `tone` (`neutral`, `info`, `warning`, `success`) pour le trait de tête. Une colonne `sortable: false` (typiquement « Livré », rangée par date) accepte les cartes mais ignore la place visée : pas de repère, `index` vaut 0.",
          "",
          "**Cartes** — `title`, et au besoin `description`, `tag` (rubrique), `badges` (pastilles avec infobulle), `meta` (texte discret en haut à droite) et `group` : un intertitre est posé à chaque changement de groupe dans la colonne (« jeudi 29 octobre 2026 »).",
          "",
          "**Actions** — sans `onMove`, rien ne se glisse et les flèches disparaissent : le tableau est en lecture seule. `onEdit` et `onDelete` ajoutent les boutons ✎ et ✕ ; la confirmation d'une suppression revient à l'application. `emptyLabel` remplit une colonne vide (« Glissez une carte ici. » par défaut).",
          "",
          "**Thème** — `--lq-color-info`, `--lq-color-warning`, `--lq-color-green` (traits de tête), `--lq-color-accent` (repère d'insertion), `--lq-color-danger` (✕), `--lq-color-panel`, `--lq-color-bg`, `--lq-color-border`, `--lq-color-border-subtle`, `--lq-radius-sm`, `--lq-space-1` à `--lq-space-3`, `--lq-label-*` (titres de colonnes).",
        ].join("\n"),
      },
    },
  },
  args: {
    columns: KANBAN_COLUMNS,
    cards: KANBAN_CARDS,
    ariaLabel: "Évolutions du produit",
    emptyLabel: "Glissez une carte ici.",
    onMove: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
  argTypes: {
    columns: { control: false },
    cards: { control: false },
    onMove: { control: false },
    onEdit: { control: false },
    onDelete: { control: false },
  },
  // La story tient les cartes : un déplacement ou une suppression les met à jour, et la ligne du bas le dit.
  render: function Render(args) {
    const [cards, setCards] = useState(args.cards);
    const [log, setLog] = useState("Glissez une carte, ou utilisez ses flèches.");
    useEffect(() => setCards(args.cards), [args.cards]);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <KanbanBoard
          {...args}
          cards={cards}
          onMove={
            args.onMove &&
            ((m) => {
              setCards((list) => applyMove(list, m));
              setLog(`« ${m.card.title} » → ${columnTitle(m.toColumnId)}`);
              args.onMove?.(m);
            })
          }
          onEdit={
            args.onEdit &&
            ((c) => {
              setLog(`Modifier « ${c.title} »`);
              args.onEdit?.(c);
            })
          }
          onDelete={
            args.onDelete &&
            ((c) => {
              setCards((list) => list.filter((x) => x.id !== c.id));
              setLog(`« ${c.title} » supprimée`);
              args.onDelete?.(c);
            })
          }
        />
        <Text size="sm" muted>
          {log}
        </Text>
      </div>
    );
  },
} satisfies Meta<typeof KanbanBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const ReadOnly: Story = {
  name: "Lecture seule",
  args: { onMove: undefined, onEdit: undefined, onDelete: undefined },
  parameters: { docs: { description: { story: "Sans `onMove`, `onEdit` ni `onDelete` : rien ne se glisse, les cartes n'ont plus de boutons." } } },
};

export const MoveOnly: Story = {
  name: "Déplacement seul",
  args: { onEdit: undefined, onDelete: undefined },
  parameters: { docs: { description: { story: "Seul `onMove` est fourni : les flèches restent, ✎ et ✕ disparaissent." } } },
};

export const Empty: Story = {
  name: "Colonnes vides",
  args: { cards: [], emptyLabel: "Aucune demande ici." },
};
