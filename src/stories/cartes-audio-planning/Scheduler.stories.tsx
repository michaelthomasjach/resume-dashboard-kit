import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { HOUR, Scheduler, Text, formatDuration, type SchedulerTask } from "@michaelthomasjach/liseuse-dashboard-kit";
import { SCHEDULE_DAY, SCHEDULE_NOW, SCHEDULE_RESOURCES, SCHEDULE_TASKS } from "../../showcase/widgetData";

const DAY = 24 * HOUR;

/** Trois tâches qui se chevauchent sur la même ligne, et une ligne sans conflit. */
const CONFLICTS: SchedulerTask[] = [
  { id: "a", resourceId: "l1", label: "Série A", start: SCHEDULE_DAY, end: SCHEDULE_DAY + 4 * HOUR, status: "running" },
  { id: "b", resourceId: "l1", label: "Série B", start: SCHEDULE_DAY + 2 * HOUR, end: SCHEDULE_DAY + 6 * HOUR, status: "late" },
  { id: "c", resourceId: "l1", label: "Série C", start: SCHEDULE_DAY + 3 * HOUR, end: SCHEDULE_DAY + 5 * HOUR, status: "planned" },
  { id: "d", resourceId: "l2", label: "Sans conflit", start: SCHEDULE_DAY + HOUR, end: SCHEDULE_DAY + 5 * HOUR },
];

/** La même journée répétée sur une semaine, décalée d'un jour sur cinq. */
const WEEK: SchedulerTask[] = SCHEDULE_TASKS.map((task, i) => ({ ...task, start: task.start + (i % 5) * DAY, end: task.end + (i % 5) * DAY }));

/**
 * Le planning de ressources : une ligne par machine ou par personne, le temps en travers, et les
 * tâches en blocs qu'on glisse, qu'on dépose sur une autre ligne et qu'on tire par un bord.
 */
const meta = {
  title: "Scheduler/Planning de ressources",
  component: Scheduler,
  parameters: {
    docs: {
      description: {
        component: [
          "Un **planning de ressources** : une ligne par machine, poste ou personne (`resources`), le temps en travers, et les tâches (`tasks`) en blocs qu'on **glisse** dans le temps, qu'on **dépose sur une autre ligne** et qu'on **tire par un bord** pour les allonger.",
          "",
          "**Quand l'utiliser** — pour affecter des tâches datées à des ressources et voir les conflits : un atelier, une équipe d'intervention, des salles. Pour des étapes sans dates, `KanbanBoard` ; pour choisir une date, `DatePicker`.",
          "",
          "**Les chevauchements agrandissent la ligne** — deux tâches sur la même ressource au même moment ne sont jamais dessinées l'une sur l'autre : la ligne se dédouble en couloirs (`laneHeight`, 34 px chacun) et le conflit se voit, marqué. C'est précisément ce qu'on ouvre un planning pour trouver.",
          "",
          "**La molette zoome l'axe du temps**, ancrée sous le pointeur, comme sur les autres canevas du kit ; on fait défiler les lignes avec `Maj` + molette, la barre de défilement ou un glisser. `wheelZoom={false}` rend à la molette son rôle de défilement (`Ctrl` zoome alors) — pour une longue liste de ressources. `pxPerHour` est le zoom de départ (60 px pour une heure) ; les graduations choisissent seules leur pas et tombent sur des heures rondes **locales** (minuit, midi), la date s'écrivant à chaque minuit — en vue semaine aussi. La barre d'outils rappelle le geste en vigueur (« Molette pour zoomer · Maj + molette pour défiler », ou « Ctrl + molette pour zoomer » avec `wheelZoom={false}`).",
          "",
          "**Cliquer une tâche l'ouvre** — le bloc ne porte que son nom et, si le nom entier tient à côté, sa durée (mesurée dans la police du thème : un bloc étroit garde son nom plutôt qu'une lettre suivie d'une durée) ; le reste (description, heures exactes, motif, étapes) vit dans sa fiche, `SchedulerTaskModal`. `taskDialog={false}` coupe cette ouverture.",
          "",
          "**Contrôlé** — `onTasksChange` reçoit **toute la liste** suivante. **Sans lui, le planning est en lecture seule** : rien ne se saisit, aucune poignée n'apparaît. Tout ce qu'un glisser produit est arrondi à `snapMinutes` (15 par défaut). `selectedTaskId` / `onSelectedTaskIdChange` tiennent la sélection. Une tâche `locked` ne se déplace ni ne se redimensionne, ni sur le planning ni depuis sa fiche ; une tâche dont la ressource n'existe pas n'est pas dessinée.",
          "",
          "**Tâches** — `start` et `end` en millisecondes depuis l'époque ; `status` (`planned`, `running`, `done`, `late`, `blocked`) colore le bloc, `pattern` (`solid`, `striped`, `hatched`) en est un second axe — provisoire contre confirmé, interne contre sous-traité. `from`, `to` et `now` (le repère « maintenant ») acceptent un nombre ou une `Date`. `locale` règle le format des heures.",
          "",
          "**Thème** — les blocs mélangent une couleur à `--lq-color-panel` : `--lq-color-accent` (prévue, sélection, ligne visée par un dépôt), `--lq-color-green` (en cours), `--lq-color-text-muted` (terminée), `--lq-color-amber` (en retard), `--lq-color-danger` (bloquée, repère « maintenant »). Puis `--lq-color-panel`, `--lq-color-bg`, `--lq-color-border`, `--lq-color-border-subtle`, `--lq-color-hover`, `--lq-radius-sm`, `--lq-label-*` (colonne des ressources).",
        ].join("\n"),
      },
    },
  },
  args: {
    resources: SCHEDULE_RESOURCES,
    tasks: SCHEDULE_TASKS,
    from: SCHEDULE_DAY,
    to: SCHEDULE_DAY + 14 * HOUR,
    now: SCHEDULE_NOW,
    snapMinutes: 15,
    pxPerHour: 60,
    laneHeight: 34,
    resourceWidth: 168,
    wheelZoom: true,
    taskDialog: true,
    height: 380,
    locale: "fr-FR",
    onTasksChange: fn(),
    onSelectedTaskIdChange: fn(),
  },
  argTypes: {
    resources: { control: false },
    tasks: { control: false },
    from: { control: false },
    to: { control: false },
    now: { control: false },
    selectedTaskId: { control: false },
    onTasksChange: { control: false },
    onSelectedTaskIdChange: { control: false },
    snapMinutes: { control: "select", options: [5, 10, 15, 30, 60] },
    pxPerHour: { control: { type: "range", min: 8, max: 200, step: 4 } },
    laneHeight: { control: { type: "range", min: 24, max: 60, step: 2 } },
    resourceWidth: { control: { type: "range", min: 100, max: 260, step: 4 } },
  },
  // Les tâches et la sélection sont tenues par la story ; la ligne du bas dit la tâche choisie.
  render: function Render(args) {
    const [tasks, setTasks] = useState(args.tasks);
    const [selected, setSelected] = useState<string | null>(null);
    useEffect(() => setTasks(args.tasks), [args.tasks]);
    const picked = tasks.find((t) => t.id === selected);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Scheduler
          {...args}
          tasks={tasks}
          onTasksChange={
            args.onTasksChange &&
            ((next) => {
              setTasks(next);
              args.onTasksChange?.(next);
            })
          }
          selectedTaskId={selected}
          onSelectedTaskIdChange={(id) => {
            setSelected(id);
            args.onSelectedTaskIdChange?.(id);
          }}
        />
        <Text size="sm" muted>
          {picked ? `Sélection : ${picked.label} · ${formatDuration(picked.end - picked.start)}` : "Cliquez un bloc pour ouvrir sa fiche."}
        </Text>
      </div>
    );
  },
} satisfies Meta<typeof Scheduler>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: {
    docs: {
      description: {
        story: "Une journée d'atelier : glissez un bloc dans le temps ou sur une autre ligne, tirez un bord, cliquez pour ouvrir la tâche. La ligne 2 a un conflit : elle se dédouble. Les blocs verrouillés ne bougent pas.",
      },
    },
  },
};

export const ReadOnly: Story = {
  name: "Lecture seule",
  args: { onTasksChange: undefined },
  parameters: { docs: { description: { story: "Sans `onTasksChange` : un tableau d'affichage, rien ne se saisit." } } },
};

export const Conflicts: Story = {
  name: "Conflits",
  args: { resources: SCHEDULE_RESOURCES.slice(0, 2), tasks: CONFLICTS, to: SCHEDULE_DAY + 8 * HOUR, now: undefined, height: 240 },
  parameters: { docs: { description: { story: "Trois tâches au même moment sur la ligne 1 : trois couloirs, et le chevauchement marqué. Sans `now`, pas de repère « maintenant »." } } },
};

export const Week: Story = {
  name: "Une semaine",
  args: { tasks: WEEK, to: SCHEDULE_DAY + 7 * DAY, now: SCHEDULE_NOW + 2 * DAY, pxPerHour: 8, snapMinutes: 30, height: 400 },
  parameters: { docs: { description: { story: "Sept jours à 8 px l'heure : le pas des graduations s'élargit avec le zoom (ici 12 h), et tout ce qu'un glisser produit s'accroche à la demi-heure." } } },
};
