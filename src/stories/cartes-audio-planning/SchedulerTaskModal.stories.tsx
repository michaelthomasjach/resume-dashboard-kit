import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button, SchedulerTaskModal, Text, formatDuration, type SchedulerTaskStatus } from "@michaelthomasjach/liseuse-dashboard-kit";
import { SCHEDULE_RESOURCES, SCHEDULE_TASKS } from "../../showcase/widgetData";

const task = (id: string) => SCHEDULE_TASKS.find((t) => t.id === id) ?? SCHEDULE_TASKS[0];

/** Les états, tels que la fiche les nomme dans sa liste. */
const STATUS: Record<SchedulerTaskStatus, string> = { planned: "prévue", running: "en cours", done: "terminée", late: "en retard", blocked: "bloquée" };

/**
 * La fiche d'une tâche du planning : ce qu'elle est, quand elle tourne, comment elle est dessinée,
 * et les étapes qui la composent. Celle que `Scheduler` ouvre au clic, utilisable seule.
 */
const meta = {
  title: "Scheduler/SchedulerTaskModal",
  component: SchedulerTaskModal,
  parameters: {
    docs: {
      // Une modale se pose sur toute la page : dans la documentation, chaque exemple vit dans son
      // propre cadre pour qu'elle n'en recouvre pas le reste.
      story: { inline: false, iframeHeight: 680 },
      description: {
        component: [
          "La **fiche d'une tâche** du planning, en modale large : son titre et sa description, son début et sa fin, sa ressource, son état, son motif (« Rayures »), et les **étapes** qui la composent.",
          "",
          "**Quand l'utiliser** — c'est la fiche que `Scheduler` ouvre quand on clique un bloc ; on la monte seule pour éditer une tâche depuis ailleurs — une liste, une recherche, une notification. Pour une fiche d'un autre genre, composez une `Modal`.",
          "",
          "**Tout s'applique à la frappe** — il n'y a pas de bouton « Enregistrer » : le planning est derrière la fiche et bouge avec chaque modification, et un changement qu'on ne voit qu'après l'avoir confirmé est un changement qu'on doit deviner. `onChange` reçoit la tâche entière à chaque modification ; Échap ou « Fermer » appellent `onClose`, et rien n'est en suspens à ce moment-là. « Supprimer » appelle `onDelete` : la confirmation revient à l'application.",
          "",
          "**Les étapes font la durée** — une fois une tâche segmentée (« Segmenter », puis « Ajouter »), la somme des étapes **est** sa durée : modifier une étape déplace la fin de la tâche plutôt que de laisser un écart qu'on découvrirait plus tard. Une étape ajoutée prend un pas de `snapMinutes` à elle seule : ajouter une étape allonge la tâche, elle ne raccourcit pas en silence le travail déjà décrit.",
          "",
          "**Tâche verrouillée** — une tâche `locked` tient ici la même promesse que sur le planning : début, fin, ressource et durées des étapes sont en lecture seule, on ne la segmente pas, on n'ajoute ni ne retire d'étape, et « Supprimer » est désactivé. Ce qu'elle **est** — titre, description, état, rayures, noms des étapes — reste modifiable.",
          "",
          "**Montage** — le composant est toujours ouvert : c'est à l'application de le monter et de le démonter (`{task ? <SchedulerTaskModal … /> : null}`). `resources` remplit la liste des ressources ; `snapMinutes` arrondit les heures saisies ; `locale` (`fr-FR` par défaut) leur format.",
          "",
          "**Thème** — celles de `Modal` (`--lq-color-panel`, `--lq-color-overlay`, `--lq-shadow-modal`, `--lq-radius-lg`), puis `--lq-color-border`, `--lq-color-border-subtle`, `--lq-color-text-muted`, `--lq-color-danger`, `--lq-color-focus-ring`, `--lq-control-border-width`, `--lq-radius-sm`, `--lq-radius-md`, `--lq-space-2`, `--lq-space-3`, et celles des champs, de `Select` et de `SegmentedControl`.",
        ].join("\n"),
      },
    },
  },
  args: {
    task: task("t3"),
    resources: SCHEDULE_RESOURCES,
    snapMinutes: 15,
    locale: "fr-FR",
    onChange: fn(),
    onDelete: fn(),
    onClose: fn(),
  },
  argTypes: {
    task: { control: false },
    resources: { control: false },
    snapMinutes: { control: "select", options: [5, 10, 15, 30, 60] },
    onChange: { control: false },
    onDelete: { control: false },
    onClose: { control: false },
  },
  // La story tient la tâche et l'ouverture : la fiche se rouvre par le bouton, et la ligne du bas
  // montre que chaque modification arrive tout de suite.
  render: function Render(args) {
    const [current, setCurrent] = useState(args.task);
    const [open, setOpen] = useState(true);
    const [deleted, setDeleted] = useState(false);
    useEffect(() => setCurrent(args.task), [args.task]);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
        <Button
          onClick={() => {
            setDeleted(false);
            setOpen(true);
          }}
        >
          Ouvrir « {current.label} »
        </Button>
        <Text size="sm" muted>
          {deleted ? "Tâche supprimée." : `${current.label} · ${formatDuration(current.end - current.start)} · ${current.status ? STATUS[current.status] : "sans état"}`}
        </Text>
        {open && !deleted ? (
          <SchedulerTaskModal
            {...args}
            task={current}
            onChange={(next) => {
              setCurrent(next);
              args.onChange(next);
            }}
            onDelete={() => {
              setDeleted(true);
              args.onDelete();
            }}
            onClose={() => {
              setOpen(false);
              args.onClose();
            }}
          />
        ) : null}
      </div>
    );
  },
} satisfies Meta<typeof SchedulerTaskModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "« Série B » : une description et trois étapes — réglage, production, contrôle — dont la somme fait la durée." } } },
};

export const NoSteps: Story = {
  name: "Sans étapes",
  args: { task: task("t5") },
  parameters: { docs: { description: { story: "Une tâche non segmentée : « Segmenter » la coupe en deux étapes." } } },
};

export const Locked: Story = {
  name: "Tâche verrouillée",
  args: { task: task("t9") },
  parameters: { docs: { description: { story: "« Maintenance préventive » est verrouillée (`locked`) : horaires, ressource et étapes sont figés, la suppression aussi ; titre, description et état restent modifiables." } } },
};

export const HalfHourSnap: Story = {
  name: "Pas de 30 minutes",
  args: { task: task("t13"), snapMinutes: 30 },
  parameters: { docs: { description: { story: "Avec `snapMinutes={30}`, les heures saisies s'arrondissent à la demi-heure." } } },
};
