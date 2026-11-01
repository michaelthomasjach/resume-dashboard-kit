import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { MonthCalendar, Text, type CalendarEvent, type MonthCalendarProps } from "@michaelthomasjach/liseuse-dashboard-kit";
import { CALENDAR_BUSY_EVENTS, CALENDAR_COLOR_EVENTS, CALENDAR_EVENTS, CALENDAR_TODAY } from "../_data/monthCalendar";

/**
 * Le calendrier mensuel d'événements : la grille du mois, les événements en pastilles, ceux de
 * plusieurs jours en barres continues.
 */
const meta = {
  title: "Scheduler/MonthCalendar",
  component: MonthCalendar,
  parameters: {
    docs: {
      description: {
        component: [
          "Un **calendrier mensuel d'événements** : la grille du mois du **lundi au dimanche**, les événements en **pastilles colorées**, ceux de plusieurs jours en **barres continues** d'une case à l'autre (et d'une semaine à l'autre), un lien **« +N autres »** quand une case déborde. Une vue `week` reprend la semaine en **agenda**, jour par jour.",
          "",
          "**Quand l'utiliser** — pour situer des rendez-vous, congés, livraisons ou échéances dans le mois. Pour affecter des tâches à l'heure près à des machines ou à des personnes, `Scheduler` (planning de ressources) ; pour choisir une date dans un champ, `DatePicker`.",
          "",
          "**Événements (`events`)** — chaque `CalendarEvent` porte `id`, `title`, `start` et, au besoin, `end` (**inclus** : un congé du 3 au 5 se donne `end: \"2026-11-05\"`). Les dates s'écrivent en `Date`, en millisecondes ou en chaîne ISO : `\"2026-11-03\"` est lu comme ce jour-là **en heure locale**, `\"2026-11-03T09:30\"` comme cette heure-là. Une date sans heure fait un événement « journée entière » (`allDay` le force). `tone` choisit la couleur du thème (`accent`, `success`, `info`, `danger`, `warning`, `neutral`), `color` une couleur libre qui l'emporte ; `description` s'affiche dans l'agenda et dans la liste d'un jour.",
          "",
          "**Rangement** — dans une semaine, les barres de plusieurs jours passent d'abord, puis les événements par heure de début ; chacun prend le premier couloir libre sur toute sa largeur, pour qu'une barre reste d'un seul tenant. `maxEventsPerDay` (3) borne les lignes d'une case : au-delà, la dernière cède la place à « +N autres », qui ouvre la **liste du jour** dans un `Popover`.",
          "",
          "**Aujourd'hui** — `today` fixe le jour marqué (pastille ronde sur le numéro) et la cible du bouton « Aujourd'hui ». Sans lui, c'est la date du système : passez-le pour des rendus déterministes, comme ici (12 novembre 2026).",
          "",
          "**Navigation** — flèches précédent / suivant (un mois, ou une semaine en vue `week`) et « Aujourd'hui ». Le jour affiché se contrôle avec `date` + `onDateChange`, ou se laisse libre avec `defaultDate`. La vue se contrôle avec `view` + `onViewChange` (`defaultView`), et `showViewSwitch={false}` retire le sélecteur Mois / Semaine. `actions` ajoute un contenu libre à droite de la barre.",
          "",
          "**Sélection et création** — un clic sur une case la sélectionne (`selectedDate` + `onSelectedDateChange`, ou `defaultSelectedDate`) et appelle `onDayClick`. **Un clic sur un événement ouvre sa fiche** dans une modale : titre, date (ou « Du … au … » sur plusieurs jours), horaire ou « Toute la journée », description ; `renderEventDetails(event)` y ajoute un contenu libre, et avec `onEventDelete` elle porte un bouton « Supprimer l'événement ». `onEventClick` reçoit aussi l'événement cliqué ; `showEventDetails={false}` retire la fiche pour laisser l'application afficher la sienne. Un clic ne supprime jamais rien de lui-même. Avec `onCreate`, un **double-clic** sur un jour, le **« + »** qui apparaît au survol d'une case et le bouton « Nouvel événement » de la liste du jour appellent `onCreate(date)` ; sans lui, rien de tout cela n'est proposé.",
          "",
          "**Clavier et accessibilité** — la grille est un `role=\"grid\"` à **tabindex itinérant** : une seule case dans l'ordre de tabulation. **Flèches** d'un jour ou d'une semaine, **Origine / Fin** au lundi / dimanche, **Page préc. / suiv.** d'un mois — la grille change de mois quand le focus en sort. **Entrée** ou **Espace** sélectionne le jour et, s'il a des événements (ou si `onCreate` est fourni), ouvre sa liste, focus sur le premier événement ; **Échap** la ferme et rend le focus à la case. Aujourd'hui porte `aria-current=\"date\"`, la case sélectionnée `aria-selected`, et chaque case lit sa date complète. Le titre du mois est annoncé (`aria-live`) quand on navigue.",
          "",
          "**Étroit** — la grille remplit sa largeur ; sous 640 px de **calendrier** (une requête de conteneur, pas de fenêtre), les heures s'effacent devant les titres.",
          "",
          "**Libellés** — `labels` remplace les textes (`previous`, `next`, `today`, `month`, `week`, `more(n)`, `create`, `noEvents`, `allDay`) ; `locale` (`fr-FR`) règle les noms de mois, de jours et les heures.",
          "",
          "**Thème** — `--lq-color-panel`, `--lq-color-bg` (jours hors du mois), `--lq-color-border-subtle` (filets), `--lq-color-hover`, `--lq-color-text` / `-muted`, `--lq-color-focus-ring`, `--lq-label-*` (jours de la semaine, titre de la liste), `--lq-radius-md` (cadre). Tons : `--lq-color-accent`, `-green`, `-info`, `-danger`, `-warning`, `-text-muted`. Variables optionnelles du calendrier : `--lq-calendar-line`, `--lq-calendar-cell-padding`, `--lq-calendar-lane-height` (22 px), `--lq-calendar-event-radius`, `--lq-calendar-event-mix` (part de la couleur dans le fond d'une pastille, 18 %), `--lq-calendar-event-bar` (liseré à gauche, 3 px), `--lq-calendar-event-font-size`, `--lq-calendar-today-bg`, `--lq-calendar-today-marker` / `-text`, `--lq-calendar-selected-bg`, `--lq-calendar-outside-bg`. Le thème « resume » met les pastilles à angle droit (`--lq-calendar-event-radius: 0`) avec le filet bleu de 4 px du CV en liseré (`--lq-calendar-event-bar`), le jour courant sur `#eef0fb`, son numéro en blanc dans un carré bleu `#3a41e2` (`#7c82ff` en sombre).",
        ].join("\n"),
      },
    },
  },
  args: {
    events: CALENDAR_EVENTS,
    today: CALENDAR_TODAY,
    maxEventsPerDay: 3,
    showViewSwitch: true,
    defaultView: "month",
    locale: "fr-FR",
    onEventClick: fn(),
    onDayClick: fn(),
    onDateChange: fn(),
    onViewChange: fn(),
  },
  argTypes: {
    events: { control: "object" },
    today: { control: "text" },
    date: { control: "text" },
    defaultDate: { control: "text" },
    view: { control: "inline-radio", options: ["month", "week"] },
    defaultView: { control: "inline-radio", options: ["month", "week"], table: { defaultValue: { summary: '"month"' } } },
    showViewSwitch: { control: "boolean", table: { defaultValue: { summary: "true" } } },
    selectedDate: { control: "text" },
    defaultSelectedDate: { control: "text" },
    maxEventsPerDay: { control: { type: "number", min: 1, max: 6 }, table: { defaultValue: { summary: "3" } } },
    locale: { control: "text", table: { defaultValue: { summary: '"fr-FR"' } } },
    labels: { control: "object" },
    actions: { control: false },
    onCreate: { control: false },
  },
} satisfies Meta<typeof MonthCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: {
    docs: {
      description: {
        story:
          "Novembre : réunions à l'heure (l'heure précède le titre), un salon et des congés en barres continues, une clôture qui enjambe la fin du mois. Le 12 est « aujourd'hui » ; il a quatre événements pour trois lignes, d'où « +2 autres ».",
      },
    },
  },
};

export const WeekAgenda: Story = {
  name: "Agenda de la semaine",
  args: { defaultView: "week" },
  parameters: {
    docs: {
      description: {
        story:
          "`view=\"week\"` : la semaine du jour affiché, jour par jour, avec l'heure de début et de fin, la description, et « Aucun événement » pour les jours vides. Les flèches avancent d'une semaine.",
      },
    },
  },
};

export const BusyDays: Story = {
  name: "Jours chargés",
  args: { events: CALENDAR_BUSY_EVENTS },
  parameters: {
    docs: {
      description: {
        story:
          "Deux jours débordent : la troisième ligne cède la place à « +N autres ». Cliquez-le — ou mettez le focus sur la case et appuyez sur Entrée — pour la liste complète du jour.",
      },
    },
  },
};

export const CreateEvents: Story = {
  name: "Créer, sélectionner",
  render: function Render(args: MonthCalendarProps) {
    const [events, setEvents] = useState<CalendarEvent[]>(CALENDAR_EVENTS.slice(0, 6));
    const [selected, setSelected] = useState<Date | null>(null);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <MonthCalendar
          {...args}
          events={events}
          selectedDate={selected}
          onSelectedDateChange={setSelected}
          onCreate={(d) =>
            setEvents((list) => [...list, { id: `n${list.length}-${d.getTime()}`, title: "Nouvel événement", start: d, allDay: true, tone: "success" }])
          }
          onEventDelete={(ev) => setEvents((list) => list.filter((e) => e.id !== ev.id))}
        />
        <Text muted size="sm">
          {selected ? `Jour sélectionné : ${selected.toLocaleDateString("fr-FR", { dateStyle: "full" })}.` : "Cliquez un jour."} Double-clic ou « + » pour
          créer, clic sur un événement pour voir sa fiche (et l’y supprimer).
        </Text>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Avec `onCreate`, un double-clic sur une case ou le « + » de son coin ajoute un événement ; ici, un clic sur un événement ouvre sa fiche, et son bouton « Supprimer l'événement » le retire (`onEventDelete`). La sélection est contrôlée (`selectedDate` + `onSelectedDateChange`).",
      },
    },
  },
};

export const CustomColors: Story = {
  name: "Couleurs libres",
  args: { events: CALENDAR_COLOR_EVENTS, showViewSwitch: false },
  parameters: {
    docs: {
      description: {
        story:
          "`color` à la place de `tone` : une couleur par agenda. Le fond de la pastille est cette couleur à `--lq-calendar-event-mix` sur le panneau, le liseré la couleur pure ; sans sélecteur de vue (`showViewSwitch={false}`).",
      },
    },
  },
};

export const Narrow: Story = {
  name: "Colonne étroite",
  args: { maxEventsPerDay: 2, showViewSwitch: false },
  render: (args: MonthCalendarProps) => (
    <div style={{ maxWidth: 480 }}>
      <MonthCalendar {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Dans 480 px, deux lignes par case : la grille remplit sa colonne, les titres s'abrègent, les heures disparaissent (requête de conteneur sur la largeur du calendrier).",
      },
    },
  },
};
