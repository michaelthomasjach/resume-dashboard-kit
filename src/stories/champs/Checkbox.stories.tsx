import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Checkbox } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * La case à cocher, avec son état intermédiaire.
 */
const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: [
          "Case à cocher avec son libellé. La coche se dessine d'un trait quand on coche ; `indeterminate` remplace la coche par un tiret, pour la case parente d'un groupe partiellement coché.",
          "",
          "**Quand l'utiliser** — une option indépendante qu'on active ou non (« Inclure les archives »), ou plusieurs options cumulables posées en liste. Pour un réglage qui prend effet **immédiatement**, un `Toggle` se lit mieux ; pour un filtre à l'allure de bouton, `CheckboxButton` ; pour un choix exclusif, `RadioGroup`, `SegmentedControl` ou `Select`.",
          "",
          "**Valeur** — composant **contrôlé** : `checked` est obligatoire et `onChange` reçoit directement le booléen (pas d'événement). `indeterminate` est purement visuel et ne touche pas à `checked` : c'est l'appelant qui calcule l'état partiel d'un groupe et ce que fait un clic sur la case parente.",
          "",
          "**Accessibilité** — la vraie case native reste dans le document, visuellement masquée : Tab y mène, Espace la coche, l'anneau de focus et la sémantique de formulaire fonctionnent, et `indeterminate` est reporté sur l'élément natif. Tout le libellé est cliquable. Le `label` accepte un nœud (texte en gras, lien…).",
          "",
          "**Thème** — case de 18 px : filet `--lq-control-border-width` en `--lq-color-border`, angles `--lq-radius-sm`, fond `--lq-color-panel` ; cochée, plein `--lq-color-fill` et coche `--lq-color-accent-contrast` ; écart avec le libellé `--lq-space-2` ; anneau `--lq-color-focus-ring`.",
        ].join("\n"),
      },
    },
  },
  args: { label: "Inclure les clients archivés", checked: false, onChange: fn() },
  argTypes: {
    label: { control: "text" },
    checked: { control: false },
    onChange: { control: false },
  },
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked);
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(c) => {
          setChecked(c);
          args.onChange?.(c);
        }}
      />
    );
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Checked: Story = {
  name: "Cochée",
  args: { checked: true, label: "Envoyer la facture par courriel" },
};

export const Indeterminate: Story = {
  name: "Groupe partiel",
  parameters: {
    docs: {
      description: {
        story: "La case parente est cochée quand toutes les filles le sont, intermédiaire quand certaines seulement le sont ; un clic dessus coche ou décoche tout le groupe. Toute cette logique est écrite par l'appelant.",
      },
    },
  },
  render: function Render() {
    const [notifs, setNotifs] = useState({ factures: true, relances: true, rapports: false });
    const values = Object.values(notifs);
    const all = values.every(Boolean);
    const some = !all && values.some(Boolean);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Checkbox
          checked={all}
          indeterminate={some}
          onChange={(c) => setNotifs({ factures: c, relances: c, rapports: c })}
          label={<strong>Toutes les notifications</strong>}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 26 }}>
          <Checkbox checked={notifs.factures} onChange={(c) => setNotifs((n) => ({ ...n, factures: c }))} label="Factures émises" />
          <Checkbox checked={notifs.relances} onChange={(c) => setNotifs((n) => ({ ...n, relances: c }))} label="Relances automatiques" />
          <Checkbox checked={notifs.rapports} onChange={(c) => setNotifs((n) => ({ ...n, rapports: c }))} label="Rapport hebdomadaire" />
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  name: "Désactivée",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Checkbox checked onChange={() => {}} disabled label="Journal d'audit (imposé par l'administrateur)" />
      <Checkbox checked={false} onChange={() => {}} disabled label="Export vers l'ERP (module non souscrit)" />
    </div>
  ),
};

export const WithoutLabel: Story = {
  name: "Sans libellé",
  args: { label: undefined, checked: true, ariaLabel: "Sélectionner la facture F-2026-118" },
  parameters: { docs: { description: { story: "La case seule, pour une colonne de sélection de tableau. Sans libellé visible, `ariaLabel` lui donne son nom accessible (« Sélectionner la facture F-2026-118 »)." } } },
};
