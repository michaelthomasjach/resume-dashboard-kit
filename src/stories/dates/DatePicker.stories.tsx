import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, within } from "storybook/test";
import { DatePicker, Text } from "@michaelthomasjach/liseuse-dashboard-kit";

/** Le « jour présent » de la démo, fixé pour que les bornes donnent toujours le même calendrier. */
const AUJOURD_HUI = new Date(2026, 9, 31);

const jour = (d: Date | null) => (d ? d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "—");

/**
 * Un jour choisi au calendrier.
 */
const meta = {
  title: "Forms/DatePicker",
  component: DatePicker,
  parameters: {
    docs: {
      description: {
        component: [
          "Champ de date à **calendrier**. Fermé, c'est un déclencheur à la taille d'un champ qui affiche la date en toutes lettres (« 15 novembre 2026 ») ; ouvert, un calendrier du mois, semaines en lignes, où le jour choisi est plein de l'accent et le jour présent repéré.",
          "",
          "**Quand l'utiliser** — une date proche, qu'on choisit en voyant le jour de la semaine : une échéance, une date de livraison, un rendez-vous. Pour une date lointaine qu'on connaît par cœur (une naissance), `DateInput` est plus rapide ; pour une période, `DateRangePicker` ; pour un jour **et** une heure, `DateTimePicker`.",
          "",
          "**Navigation** — les flèches de l'en-tête changent de mois. Cliquer l'intitulé « mois année » remonte à la grille des douze mois, puis à une grille d'années : changer d'année se fait en trois clics plutôt qu'en douze pages. Le calendrier s'ouvre sur le mois de la valeur, ou sur le mois courant.",
          "",
          "**Valeur** — composant **contrôlé** : `value` est une `Date` ou `null` (le `placeholder` s'affiche alors), `onChange(date)` est appelé au clic sur un jour et le calendrier se ferme. Il n'y a pas d'effacement : une fois choisie, une date se remplace mais ne se vide pas. `minDate` et `maxDate` grisent les jours hors bornes. `formatDate` change l'affichage du déclencheur.",
          "",
          "**Portail** — le calendrier est un `Popover` sous `document.body` : il s'ouvre sous le champ (ou au-dessus, `placement=\"top\"`), se retourne si la place manque, se ferme au clic dehors ou à Échap. Les jours ne se parcourent pas aux flèches du clavier : le calendrier se pilote à la souris ou au doigt.",
          "",
          "**Ce qui manque** — `helperText`, que les autres champs ont : seule `error` s'affiche sous le déclencheur.",
          "",
          "**Thème** — le déclencheur lit les variables des champs (`--lq-control-*`, `--lq-field-*`) ; le calendrier, `--lq-color-fill` et `--lq-color-accent-contrast` pour le jour choisi, `--lq-color-hover`, `--lq-color-border-subtle`, `--lq-radius-sm`, et l'ombre `--lq-shadow-modal` du panneau.",
        ].join("\n"),
      },
    },
  },
  args: { label: "Échéance de paiement", value: new Date(2026, 10, 15), minDate: AUJOURD_HUI, onChange: fn() },
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
      <div style={{ maxWidth: 320, display: "flex", flexDirection: "column", gap: 8 }}>
        <DatePicker
          {...args}
          value={value}
          onChange={(d) => {
            setValue(d);
            args.onChange(d);
          }}
        />
        <Text size="sm" muted>
          Valeur : {jour(value)}
        </Text>
      </div>
    );
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Bornée au 31 octobre 2026 (`minDate`) : les jours d'avant sont grisés." } } },
};

export const Open: Story = {
  name: "Calendrier ouvert",
  parameters: { docs: { description: { story: "La même, ouverte d'un clic au chargement de la story (fonction `play`) pour voir le calendrier dans le thème." } } },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button"));
  },
};

export const Placeholder: Story = {
  name: "Sans valeur",
  args: { label: "Date de clôture", value: null, minDate: undefined, placeholder: "Choisir une date" },
};

export const WithError: Story = {
  name: "En erreur",
  args: { label: "Date de clôture", value: null, minDate: undefined, placeholder: "Choisir une date" },
  parameters: { docs: { description: { story: "L'erreur disparaît dès qu'une date est choisie : elle est calculée par l'appelant." } } },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ maxWidth: 320 }}>
        <DatePicker
          {...args}
          value={value}
          onChange={(d) => {
            setValue(d);
            args.onChange(d);
          }}
          error={value ? undefined : "Requise pour archiver le dossier."}
        />
      </div>
    );
  },
};

export const CustomFormat: Story = {
  name: "Format personnalisé",
  args: {
    label: "Livraison prévue",
    value: new Date(2026, 10, 3),
    formatDate: (d: Date) => d.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" }),
  },
  parameters: { docs: { description: { story: "`formatDate` ne change que l'affichage du déclencheur, pas la valeur." } } },
};

export const Small: Story = {
  name: "Petit",
  args: { label: "Créé le", size: "small", value: new Date(2024, 2, 12), minDate: undefined },
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { label: "Date d'émission", value: new Date(2026, 9, 2), minDate: undefined, disabled: true },
};
