import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, within } from "storybook/test";
import { DateTimePicker, Text } from "@michaelthomasjach/liseuse-dashboard-kit";

const AUJOURD_HUI = new Date(2026, 9, 31);

const instant = (d: Date | null) =>
  d ? `${d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à ${d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}` : "—";

/**
 * Un jour et une heure : le calendrier de `DatePicker`, plus une colonne d'heures.
 */
const meta = {
  title: "Forms/DateTimePicker",
  component: DateTimePicker,
  parameters: {
    docs: {
      description: {
        component: [
          "Champ d'**horodatage** : le calendrier de `DatePicker`, flanqué d'une colonne « Heure » — un champ où taper l'heure (`8h30`, `08:30`), une liste qui défile par pas de `minuteStep` minutes (15 par défaut), et un bouton **Valider**. Le déclencheur affiche « 03 novembre 2026 à 08:30 ».",
          "",
          "**Quand l'utiliser** — un instant précis : l'envoi programmé d'une campagne, une fenêtre de maintenance, un rendez-vous. Si l'heure n'a pas de sens, `DatePicker` ; pour une durée, deux de ces champs ou un `DateRangePicker` plus une heure de début.",
          "",
          "**Valeur et validation** — composant **contrôlé** : `value` est une `Date` ou `null`, `onChange(date)` reçoit le jour et l'heure combinés. À la différence de `DatePicker`, choisir un jour **ne ferme pas** le panneau : rien n'est transmis tant qu'on n'a pas cliqué **Valider**. Un clic dehors ou Échap ferme sans rien changer. Une heure hors de la grille peut être tapée (08:07 avec un pas de 15) ; elle est prise en compte à Entrée ou en quittant le champ.",
          "",
          "**Bornes** — `minDate` et `maxDate` grisent des **jours**, pas des heures : le même jour, une heure déjà passée reste choisissable — à vérifier côté appelant. Le reste est celui de `DatePicker` : en-tête qui remonte aux mois et aux années, `Popover` en portail, `formatDate` pour l'affichage, pas d'effacement, pas de `helperText`.",
          "",
          "**Thème** — les variables des champs pour le déclencheur et le champ d'heure ; `--lq-color-fill` / `--lq-color-accent-contrast` pour le jour et l'heure choisis, `--lq-color-hover`, `--lq-color-border-subtle` ; l'ombre `--lq-shadow-modal` du panneau.",
        ].join("\n"),
      },
    },
  },
  args: {
    label: "Envoi de la campagne",
    value: new Date(2026, 10, 3, 8, 30),
    minDate: AUJOURD_HUI,
    minuteStep: 30,
    onChange: fn(),
  },
  argTypes: {
    value: { control: false },
    onChange: { control: false },
    formatDate: { control: false },
    minDate: { control: false },
    maxDate: { control: false },
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ maxWidth: 340, display: "flex", flexDirection: "column", gap: 8 }}>
        <DateTimePicker
          {...args}
          value={value}
          onChange={(d) => {
            setValue(d);
            args.onChange(d);
          }}
        />
        <Text size="sm" muted>
          Programmé {instant(value)}
        </Text>
      </div>
    );
  },
} satisfies Meta<typeof DateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Pas de 30 minutes ; choisissez un jour puis une heure, et validez." } } },
};

export const Open: Story = {
  name: "Panneau ouvert",
  parameters: { docs: { description: { story: "Ouvert au chargement par la fonction `play` : le calendrier et la colonne d'heures côte à côte." } } },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button"));
  },
};

export const FiveMinutes: Story = {
  name: "Pas de 5 minutes",
  args: { label: "Début de la maintenance", value: new Date(2026, 10, 8, 22, 15), minuteStep: 5 },
};

export const Placeholder: Story = {
  name: "Sans valeur",
  args: { label: "Rappel client", value: null, placeholder: "Choisir le jour et l'heure" },
  parameters: { docs: { description: { story: "Sans valeur, le panneau s'ouvre sur l'instant présent : **Valider** sans rien toucher enregistre « maintenant »." } } },
};

export const WithError: Story = {
  name: "En erreur",
  args: { label: "Envoi de la relance", value: new Date(2026, 10, 1, 3, 0) },
  parameters: { docs: { description: { story: "Une règle de l'appelant : pas d'envoi entre 21 h et 8 h." } } },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    const h = value?.getHours() ?? 12;
    return (
      <div style={{ maxWidth: 340 }}>
        <DateTimePicker
          {...args}
          value={value}
          onChange={(d) => {
            setValue(d);
            args.onChange(d);
          }}
          error={h < 8 || h >= 21 ? "Les relances partent entre 8 h et 21 h." : undefined}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { label: "Envoyée le", value: new Date(2026, 9, 28, 9, 0), minDate: undefined, disabled: true, size: "small" },
};
