import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, within } from "storybook/test";
import { DateRangePicker, Text, type DateRange } from "@michaelthomasjach/liseuse-dashboard-kit";

const AUJOURD_HUI = new Date(2026, 9, 31);

const jour = (d: Date | null) => (d ? d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "…");

/** Le nombre de jours d'une période, bornes comprises. */
const duree = (r: DateRange) => (r.start && r.end ? Math.round((r.end.getTime() - r.start.getTime()) / 86_400_000) + 1 : null);

/**
 * Une période choisie en deux clics sur le même calendrier.
 */
const meta = {
  title: "Forms/DateRangePicker",
  component: DateRangePicker,
  parameters: {
    docs: {
      description: {
        component: [
          "Le calendrier de `DatePicker`, pour choisir une **période** : un début et une fin. Le premier clic pose le début ; en survolant ensuite, la bande s'étend jusqu'au jour sous le pointeur ; le second clic pose la fin et ferme le calendrier. Une fin cliquée avant le début est remise dans l'ordre. Recliquer après une période complète en commence une nouvelle.",
          "",
          "**Quand l'utiliser** — la période d'un rapport, d'un export, d'un filtre de tableau, d'une réservation. Pour des périodes toutes faites (7 jours, ce mois-ci), posez des `Chip` ou un `SegmentedControl` à côté : ce sélecteur reste pour le cas particulier.",
          "",
          "**Valeur** — composant **contrôlé**. `value` est un objet `{ start, end }`, chaque borne une `Date` ou `null` : `{ start: null, end: null }` pour rien, une fin `null` pendant le choix. `onChange` est appelé aux **deux** clics — après le premier avec une fin encore nulle : n'interrogez pas le serveur avant que les deux bornes soient posées. Le déclencheur affiche « 01 oct. 2026 – 31 oct. 2026 », ou « 01 oct. 2026 – … » à mi-chemin.",
          "",
          "**Bornes et affichage** — `minDate` et `maxDate` grisent les jours hors limites (une période de rapport ne va pas au-delà d'aujourd'hui). `formatDate` met en forme chaque borne. Comme `DatePicker`, l'en-tête remonte aux mois puis aux années, le panneau est un `Popover` en portail (Échap ou clic dehors le ferme), et le calendrier ne se parcourt pas au clavier.",
          "",
          "**Ce qui manque** — un seul mois est affiché à la fois (une période à cheval sur deux mois se choisit en tournant la page entre les deux clics), pas de `helperText`, pas d'effacement.",
          "",
          "**Thème** — le déclencheur lit `--lq-control-*` et `--lq-field-*` ; la bande, `--lq-color-fill` aux bornes et `--lq-color-hover` entre elles, en cases jointives ; le jour présent, un filet `--lq-color-border` ; le panneau, `--lq-shadow-modal`.",
        ].join("\n"),
      },
    },
  },
  args: {
    label: "Période du rapport",
    value: { start: new Date(2026, 9, 1), end: new Date(2026, 9, 31) },
    maxDate: AUJOURD_HUI,
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
    const [value, setValue] = useState<DateRange>(args.value);
    const n = duree(value);
    return (
      <div style={{ maxWidth: 360, display: "flex", flexDirection: "column", gap: 8 }}>
        <DateRangePicker
          {...args}
          value={value}
          onChange={(r) => {
            setValue(r);
            args.onChange(r);
          }}
        />
        <Text size="sm" muted>
          Du {jour(value.start)} au {jour(value.end)}
          {n ? ` · ${n} jours` : ""}
        </Text>
      </div>
    );
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Bornée à aujourd'hui (`maxDate`) : une période de rapport ne déborde pas sur l'avenir." } } },
};

export const Open: Story = {
  name: "Calendrier ouvert",
  parameters: { docs: { description: { story: "Ouverte au chargement par la fonction `play`, pour voir la bande de la période dans le thème." } } },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button"));
  },
};

export const Empty: Story = {
  name: "Sans période",
  args: { label: "Période d'export", value: { start: null, end: null }, placeholder: "Choisir une période" },
};

export const HalfPicked: Story = {
  name: "Début seul",
  args: { label: "Période d'export", value: { start: new Date(2026, 9, 12), end: null } },
  parameters: { docs: { description: { story: "L'état intermédiaire, entre les deux clics : la fin est encore `null`." } } },
};

export const WithError: Story = {
  name: "En erreur",
  args: { label: "Période de comparaison", value: { start: new Date(2026, 8, 1), end: new Date(2026, 9, 31) } },
  parameters: { docs: { description: { story: "Une règle de l'appelant : la période ne dépasse pas 31 jours." } } },
  render: function Render(args) {
    const [value, setValue] = useState<DateRange>(args.value);
    const n = duree(value);
    return (
      <div style={{ maxWidth: 360 }}>
        <DateRangePicker
          {...args}
          value={value}
          onChange={(r) => {
            setValue(r);
            args.onChange(r);
          }}
          error={n && n > 31 ? `31 jours au plus (${n} choisis).` : undefined}
        />
      </div>
    );
  },
};

export const Small: Story = {
  name: "Petit",
  args: { size: "small", label: "Filtrer par date" },
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { label: "Exercice clos", value: { start: new Date(2025, 0, 1), end: new Date(2025, 11, 31) }, disabled: true },
};
