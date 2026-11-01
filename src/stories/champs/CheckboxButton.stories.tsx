import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { CheckboxButton, Text } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * Une case à cocher qui a l'allure d'un bouton.
 */
const meta = {
  title: "Forms/CheckboxButton",
  component: CheckboxButton,
  parameters: {
    docs: {
      description: {
        component: [
          "Une case à cocher habillée en `Button`. Décochée, c'est un bouton à filet ordinaire, sans icône ; cochée, il passe au plein de l'accent et une coche apparaît devant le libellé avec un petit effet de rebond.",
          "",
          "**Quand l'utiliser** — des filtres de catégorie cumulables (« Actions », « Obligations », « Fonds ») là où une rangée de cases à cocher ferait trop formulaire. Pour des filtres plus légers, en pastilles, `ChipGroup` en `multiple` ; pour une option isolée dans un formulaire, `Checkbox` ; pour une action qui reste enfoncée (gras, épingler), un `Button` en `selected`.",
          "",
          "**Valeur** — composant **contrôlé** : `checked` est obligatoire, `onChange` reçoit le nouveau booléen. Un groupe de ces boutons se tient à la main, un état par bouton.",
          "",
          "**Accessibilité** — c'est un `<button>` qui porte la sémantique d'une case (`role=\"checkbox\"`, `aria-checked`), et non celle d'un bouton bascule : un lecteur d'écran annonce « case à cocher, cochée ». Tab y mène, Espace et Entrée le basculent.",
          "",
          "**Thème** — celui de `Button` : `--lq-button-padding-y`, `--lq-button-padding-x`, `--lq-button-font-size`, `--lq-control-border-width`, `--lq-radius-md`, et `--lq-color-accent` / `--lq-color-accent-contrast` pour l'état coché.",
        ].join("\n"),
      },
    },
  },
  args: { children: "Actions", checked: true, onChange: fn() },
  argTypes: {
    children: { control: "text" },
    checked: { control: false },
    onChange: { control: false },
  },
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked);
    return (
      <CheckboxButton
        {...args}
        checked={checked}
        onChange={(c) => {
          setChecked(c);
          args.onChange?.(c);
        }}
      />
    );
  },
} satisfies Meta<typeof CheckboxButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Unchecked: Story = {
  name: "Décoché",
  args: { checked: false, children: "Obligations" },
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { checked: false, disabled: true, children: "Produits dérivés" },
};

export const FilterGroup: Story = {
  name: "Groupe de filtres",
  parameters: { docs: { description: { story: "L'usage type : une rangée de catégories cumulables, chacune avec son propre état." } } },
  render: function Render() {
    const [filtres, setFiltres] = useState({ actions: true, obligations: false, fonds: true });
    const actifs = Object.entries(filtres)
      .filter(([, v]) => v)
      .map(([k]) => k);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <CheckboxButton checked={filtres.actions} onChange={(c) => setFiltres((f) => ({ ...f, actions: c }))}>
            Actions
          </CheckboxButton>
          <CheckboxButton checked={filtres.obligations} onChange={(c) => setFiltres((f) => ({ ...f, obligations: c }))}>
            Obligations
          </CheckboxButton>
          <CheckboxButton checked={filtres.fonds} onChange={(c) => setFiltres((f) => ({ ...f, fonds: c }))}>
            Fonds
          </CheckboxButton>
          <CheckboxButton checked={false} disabled>
            Produits dérivés
          </CheckboxButton>
        </div>
        <Text size="sm" muted>
          Catégories affichées : {actifs.join(", ") || "aucune"}
        </Text>
      </div>
    );
  },
};
