import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { NotesPanel, Text, type Note } from "@michaelthomasjach/liseuse-dashboard-kit";
import { NOTES, NOTES_NOW } from "../_data/notesPanel";

/**
 * Un bloc-notes : la liste des notes, et la note ouverte qu'on écrit sur place.
 */
const meta = {
  title: "Widgets/NotesPanel",
  component: NotesPanel,
  parameters: {
    docs: {
      description: {
        component: [
          "Un **bloc-notes** en deux colonnes : la liste des notes à gauche, la note ouverte à droite, qu'on écrit sur place.",
          "",
          "**Quand l'utiliser** — pour des notes courtes en texte brut, attachées à un client, un dossier, un tableau de bord. Pour du texte mis en forme, `WysiwygEditor` ; pour des fiches qu'on lit plus qu'on n'écrit, `KnowledgeBase`.",
          "",
          "**La liste** — chaque note : titre (`untitledLabel`, « Sans titre », s'il manque), début du texte sur deux lignes, date de dernière modification (l'heure le jour même, « Hier », puis une date courte). Le champ du haut cherche dans les titres et les textes, sans tenir compte des accents. Le bouton **+** (`newLabel`) crée une note vide en tête et l'ouvre, le curseur dans le titre. Une corbeille (`deleteLabel`) sur chaque ligne — au survol, au focus, toujours au doigt — et dans la barre de l'éditeur.",
          "",
          "**L'éditeur** — volontairement minimal : un titre, un texte brut qui garde ses sauts de ligne dans un champ qui **grandit** avec ce qu'on écrit (c'est l'éditeur qui défile, pas le champ), le nombre de mots et « Modifiée aujourd'hui à 11:20 ». Entrée dans le titre passe au texte.",
          "",
          "**Contrôlé ou libre** — donnez `onChange(note)` et l'application tient `notes` : chaque frappe lui rend la note modifiée, `updatedAt` à jour, à elle de la remettre en place ; `onCreate(note)` et `onDelete(id)` lui passent la note créée ou supprimée (sans eux, les boutons correspondants disparaissent). Sans `onChange`, le composant garde sa copie et fait tout lui-même, en appelant quand même les rappels donnés. `activeNoteId` + `onSelectNote` tiennent la note ouverte. `now` fixe l'heure de référence (dates relatives, date des modifications).",
          "",
          "**Taille** — le composant **remplit son conteneur** : donnez une hauteur au parent, ou `height`. Sous 640 px de large (la sienne, mesurée), une colonne à la fois : la liste, puis la note, avec « Retour » (`backLabel`).",
          "",
          "**Clavier et accessibilité** — flèches haut/bas, Début et Fin dans la liste ; la note ouverte porte `aria-current`. Chaque corbeille nomme la note qu'elle supprime. Le compteur de mots est annoncé poliment.",
          "",
          "**Thème** — `--lq-notes-paper` (fond de l'éditeur, repli `--lq-color-panel`), `--lq-notes-body-size` (texte de la note, repli `--lq-text-md`), `--lq-label-*` (titre de la liste), `--lq-font-weight-heading` (titre de la note), `--lq-color-accent` (note ouverte), `--lq-color-panel-border`, `--lq-shadow-panel`, `--lq-color-focus-ring`, et celles d'`Input` et d'`IconButton`.",
        ].join("\n"),
      },
    },
  },
  args: {
    notes: NOTES,
    now: NOTES_NOW,
    title: "Notes",
    searchPlaceholder: "Rechercher dans les notes…",
    newLabel: "Nouvelle note",
    deleteLabel: "Supprimer la note",
    backLabel: "Retour",
    titlePlaceholder: "Titre",
    bodyPlaceholder: "Écrivez ici…",
    untitledLabel: "Sans titre",
    emptyText: "Aucune note.",
    locale: "fr-FR",
  },
  argTypes: {
    notes: { control: false },
    activeNoteId: { control: false },
    defaultActiveNoteId: { control: "select", options: NOTES.map((n) => n.id) },
    onSelectNote: { control: false },
    onChange: { control: false },
    onCreate: { control: false },
    onDelete: { control: false },
    title: { control: "text" },
    emptyText: { control: "text" },
    locale: { control: "select", options: ["fr-FR", "en-GB", "de-DE"] },
    now: { control: "text" },
    height: { control: "text" },
  },
  render: (args) => (
    <div style={{ height: 520 }}>
      <NotesPanel {...args} />
    </div>
  ),
} satisfies Meta<typeof NotesPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Bloc-notes",
  parameters: { docs: { description: { story: "En mode libre : écrivez, créez une note avec +, supprimez-en une, cherchez « export »." } } },
};

export const Controlled: Story = {
  name: "Piloté par l'application",
  args: { onSelectNote: fn(), onChange: fn(), onCreate: fn(), onDelete: fn() },
  render: function Render(args) {
    const [notes, setNotes] = useState<Note[]>(NOTES);
    const [active, setActive] = useState<string | null>("retours");
    const [last, setLast] = useState("—");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ height: 480 }}>
          <NotesPanel
            {...args}
            notes={notes}
            activeNoteId={active}
            onSelectNote={(id) => {
              setActive(id);
              args.onSelectNote?.(id);
            }}
            onChange={(note) => {
              setNotes((ns) => ns.map((n) => (n.id === note.id ? note : n)));
              setLast(`modifiée : ${note.id}`);
              args.onChange?.(note);
            }}
            onCreate={(note) => {
              setNotes((ns) => [note, ...ns]);
              setLast(`créée : ${note.id}`);
              args.onCreate?.(note);
            }}
            onDelete={(id) => {
              setNotes((ns) => ns.filter((n) => n.id !== id));
              setLast(`supprimée : ${id}`);
              args.onDelete?.(id);
            }}
          />
        </div>
        <Text size="sm" muted>
          {notes.length} notes · ouverte : {active ?? "aucune"} · dernier rappel : {last}
        </Text>
      </div>
    );
  },
  parameters: { docs: { description: { story: "L'application tient les notes et la note ouverte ; la ligne du bas montre ce qu'elle reçoit." } } },
};

export const Empty: Story = {
  name: "Vide",
  args: { notes: [], emptyText: "Aucune note. Créez-en une avec « + »." },
  render: (args) => (
    <div style={{ height: 380 }}>
      <NotesPanel {...args} />
    </div>
  ),
  parameters: { docs: { description: { story: "Sans note : la liste le dit, et **+** en crée une, ouverte le curseur dans le titre." } } },
};

export const Narrow: Story = {
  name: "Cadre étroit",
  render: (args) => (
    <div style={{ width: 380, height: 520 }}>
      <NotesPanel {...args} />
    </div>
  ),
  parameters: { docs: { description: { story: "Dans 380 px, une colonne à la fois : touchez une note, puis « Retour »." } } },
};
