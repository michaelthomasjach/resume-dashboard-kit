import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { InputNumber, Text } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * La saisie d'un nombre : bornes, pas, préfixe ou suffixe, et les deux séparateurs décimaux.
 */
const meta = {
  title: "Forms/Input/InputNumber",
  component: InputNumber,
  parameters: {
    docs: {
      description: {
        component: [
          "Champ numérique : une quantité, un pourcentage, un montant. Sous le capot, c'est un champ **texte** (`inputMode=\"decimal\"`), pas un `type=\"number\"` : le navigateur français réécrirait le point en virgule et refuserait l'autre séparateur. Ici, `12,5` et `12.5` donnent tous deux `12.5`.",
          "",
          "**Quand l'utiliser** — un nombre sur lequel l'application calcule. Pour un identifiant fait de chiffres (code postal, SIRET), prenez `MaskedInput`, qui garde les zéros de tête ; pour un intervalle, `RangeSlider`.",
          "",
          "**Valeur** — composant **contrôlé**. `value` est un `number`, ou la chaîne vide `\"\"` quand le champ est vide ; `onChange` reçoit l'un ou l'autre. Toute valeur produite — tapée, collée ou au bouton — est arrondie à 4 décimales et ramenée entre `min` et `max` **avant** d'atteindre `onChange` : la valeur rapportée ne sort jamais des bornes, même en cours de frappe. Le texte tapé reste affiché tel quel jusqu'à la perte du focus, puis se recale sur la valeur bornée. Une saisie illisible (`-` seul, une lettre) n'appelle pas `onChange`.",
          "",
          "**Anatomie** — sans `suffix` ni `trailingIcon`, deux petits boutons `+` / `−` en queue avancent de `step` (1 par défaut). Ils sont faits pour la souris et le doigt : hors de l'ordre de tabulation, et les flèches du clavier n'incrémentent pas. `prefix` remplace l'icône de tête, `suffix` remplace les boutons — un champ suffixé n'a donc pas de boutons. Le reste est celui d'`Input` : libellé, aide, erreur, `size`, `labelPosition`.",
          "",
          "**Thème** — les variables des champs (`--lq-control-height`, `--lq-control-padding-x`, `--lq-control-font-size`, `--lq-control-color`, `--lq-field-*`) ; préfixe, suffixe et boutons sont en `--lq-color-text-muted`.",
        ].join("\n"),
      },
    },
  },
  args: { label: "Quantité", value: 12, min: 1, max: 999, step: 1, onChange: fn() },
  argTypes: {
    value: { control: false },
    onChange: { control: false },
    leadingIcon: { control: false },
    trailingIcon: { control: false },
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ maxWidth: 280, display: "flex", flexDirection: "column", gap: 8 }}>
        <InputNumber
          {...args}
          value={value}
          onChange={(v) => {
            setValue(v);
            args.onChange(v);
          }}
        />
        <Text size="sm" muted>
          Valeur reçue : {value === "" ? "« » (vide)" : String(value)}
        </Text>
      </div>
    );
  },
} satisfies Meta<typeof InputNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Bornes de 1 à 999 : tapez `5000`, la valeur reçue reste à 999 ; le texte se recale en quittant le champ." } } },
};

export const Percentage: Story = {
  name: "Pourcentage",
  args: { label: "Remise", value: 7.5, min: 0, max: 100, step: 0.5, suffix: "%" },
  parameters: { docs: { description: { story: "Avec un suffixe, plus de boutons. Essayez `12,25` : la virgule est acceptée." } } },
};

export const Currency: Story = {
  name: "Montant avec erreur",
  args: { label: "Budget mensuel", value: 6200, min: 0, step: 100, suffix: "€", helperText: "Plafond sans validation : 5 000 €." },
  parameters: { docs: { description: { story: "L'erreur est calculée par l'appelant sur la valeur reçue ; elle prend la place du texte d'aide." } } },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ maxWidth: 280 }}>
        <InputNumber
          {...args}
          value={value}
          onChange={(v) => {
            setValue(v);
            args.onChange(v);
          }}
          error={value !== "" && value > 5000 ? "Au-delà de 5 000 €, une validation est requise." : undefined}
        />
      </div>
    );
  },
};

export const WithPrefix: Story = {
  name: "Préfixe",
  args: { label: "Coefficient de marge", value: 1.35, min: 1, max: 5, step: 0.05, prefix: "×" },
  parameters: { docs: { description: { story: "Le préfixe prend la place de l'icône de tête ; les boutons restent, puisqu'il n'y a pas de suffixe." } } },
};

export const Empty: Story = {
  name: "Vide",
  args: { label: "Seuil d'alerte de stock", value: "", min: 0, placeholder: "Aucun seuil" },
  parameters: { docs: { description: { story: "La valeur vide est la chaîne `\"\"`, distincte de `0`." } } },
};

export const Small: Story = {
  name: "Petit",
  args: { label: "Lignes par page", value: 25, min: 10, max: 100, step: 5, size: "small" },
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { label: "Postes inclus", value: 3, disabled: true, helperText: "Fixé par le contrat." },
};
