import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Select, type SelectOption } from "@michaelthomasjach/liseuse-dashboard-kit";

const ROLES: SelectOption[] = [
  { value: "admin", label: "Administrateur" },
  { value: "editeur", label: "Éditeur" },
  { value: "lecteur", label: "Lecteur" },
  { value: "facturation", label: "Facturation seule", disabled: true },
];

const PAYS: SelectOption[] = [
  { value: "fr", label: "France" },
  { value: "be", label: "Belgique" },
  { value: "ch", label: "Suisse" },
  { value: "lu", label: "Luxembourg" },
];

/**
 * La liste déroulante fermée : un déclencheur qui montre le choix, une liste qui s'ouvre dessous.
 */
const meta = {
  title: "Forms/Input/Select",
  component: Select,
  parameters: {
    docs: {
      description: {
        component: [
          "Liste déroulante. Fermée, c'est un bouton à la taille d'un champ qui affiche le libellé de l'option choisie (ou `placeholder`) et un chevron ; ouverte, une liste à la largeur exacte du déclencheur, où l'option en place porte une coche et où les options `disabled` restent visibles mais inertes.",
          "",
          "**Quand l'utiliser** — un choix unique parmi une liste courte et connue d'avance, de deux à une dizaine d'options : un rôle, un pays, une devise. Au-delà, ou quand on cherche plutôt qu'on ne parcourt, `InputDropdown` ; pour deux à quatre options qu'on veut voir toutes en permanence, `SegmentedControl` ou `ChipGroup` ; pour plusieurs valeurs, `TagInput` ou un `ChipGroup` en `multiple`.",
          "",
          "**Valeur** — composant **contrôlé**. `value` vaut la valeur choisie ou `null` (le `placeholder` s'affiche alors), `onChange(valeur)` est appelé au clic sur une option, et la liste se ferme. Il n'y a pas d'effacement : si « aucun » est un choix valable, faites-en une option.",
          "",
          "**Portail et placement** — la liste est un `Popover` rendu sous `document.body`. Elle s'ouvre sous le champ, ou au-dessus avec `placement=\"top\"`, et se retourne d'elle-même quand la place manque ; un clic au-dehors ou Échap la ferme.",
          "",
          "**Clavier** — le déclencheur est un vrai bouton : Tab y mène ; Entrée, Espace, ↓ ou ↑ ouvrent la liste et y posent le focus, sur l'option choisie (la première sinon). Dans la liste, ↑ ↓ circulent en sautant les options désactivées, Début / Fin vont aux extrémités, une lettre tapée saute à l'option suivante qui commence ainsi (plusieurs lettres à la suite affinent), Entrée ou Espace choisissent, Échap et Tab referment, et le focus revient au déclencheur. Échap ne ferme que la liste : une `Modal` autour reste ouverte.",
          "",
          "**Thème** — le déclencheur lit les variables des champs (`--lq-control-height`, `--lq-control-padding-x`, `--lq-control-font-size`, `--lq-control-color`, `--lq-field-*`) ; la liste, `--lq-shadow-modal`, `--lq-radius-md`, `--lq-color-hover` et `--lq-color-accent` pour la coche.",
        ].join("\n"),
      },
    },
  },
  args: { label: "Rôle", options: ROLES, value: "editeur", onChange: fn() },
  argTypes: {
    options: { control: false },
    value: { control: false },
    onChange: { control: false },
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ maxWidth: 320 }}>
        <Select
          {...args}
          value={value}
          onChange={(v) => {
            setValue(v);
            args.onChange(v);
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "« Facturation seule » est désactivée : on la voit, on ne peut pas la choisir." } } },
};

export const Placeholder: Story = {
  name: "Sans valeur",
  args: { label: "Pays de facturation", options: PAYS, value: null, placeholder: "Choisir un pays", helperText: "Sert au calcul de la TVA." },
};

export const WithError: Story = {
  name: "En erreur",
  args: { label: "Pays de facturation", options: PAYS, value: null, placeholder: "Choisir un pays" },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ maxWidth: 320 }}>
        <Select
          {...args}
          value={value}
          onChange={(v) => {
            setValue(v);
            args.onChange(v);
          }}
          error={value ? undefined : "Requis pour calculer la TVA."}
        />
      </div>
    );
  },
  parameters: { docs: { description: { story: "L'erreur disparaît dès qu'un pays est choisi : elle est calculée par l'appelant sur la valeur." } } },
};

export const OpensUpward: Story = {
  name: "Ouverture vers le haut",
  args: { label: "Devise", options: [{ value: "eur", label: "Euro (€)" }, { value: "chf", label: "Franc suisse (CHF)" }, { value: "gbp", label: "Livre sterling (£)" }], value: "eur", placement: "top" },
  parameters: { docs: { description: { story: "`placement=\"top\"` pour un champ posé en bas d'un panneau ; sans place au-dessus, la liste se retourne quand même vers le bas." } } },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ maxWidth: 320, paddingTop: 140 }}>
        <Select
          {...args}
          value={value}
          onChange={(v) => {
            setValue(v);
            args.onChange(v);
          }}
        />
      </div>
    );
  },
};

export const Small: Story = {
  name: "Petit",
  args: { label: "Afficher", options: [{ value: "25", label: "25 lignes" }, { value: "50", label: "50 lignes" }, { value: "100", label: "100 lignes" }], value: "25", size: "small" },
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { label: "Devise", options: [{ value: "eur", label: "Euro (€)" }], value: "eur", disabled: true, helperText: "Fixée par l'entité de facturation." },
};
