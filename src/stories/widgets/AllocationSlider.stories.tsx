import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { AllocationSlider, BriefcaseIcon, SettingsIcon, UserIcon } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ALLOCATION_TEAMS } from "../../showcase/widgetData";

/**
 * Partager un tout entre plusieurs postes : une barre d'ensemble, un curseur par poste, et ce qui
 * reste libre.
 */
const meta = {
  title: "Widgets/AllocationSlider",
  component: AllocationSlider,
  parameters: {
    docs: {
      description: {
        component: [
          "Un **curseur de répartition** : partager un total — le temps d'une équipe, un budget, des jours de sprint — entre plusieurs postes, sans jamais dépasser ce total.",
          "",
          "**Quand l'utiliser** — dès que des valeurs doivent tenir ensemble dans une enveloppe fixe. Pour borner un intervalle (un minimum et un maximum), `RangeSlider` ; pour lire une charge face à une capacité sans la régler, `DemandMeters`.",
          "",
          "**Anatomie** — en haut, **une barre** qui fait au plus `max` : un segment par poste dans sa couleur, puis ce qui reste (`unallocatedLabel`, « Libre » par défaut). Dessous, **une ligne par poste** : son nom (et son `icon`), un curseur, sa valeur suivie de `unit`. La barre dit l'ensemble d'un coup d'œil, les lignes se règlent une à une.",
          "",
          "**La règle** — monter un poste prend d'abord sur ce qui est libre. Au-delà : `mode=\"cap\"` (défaut) arrête le poste à ce qui était libre, rien n'est pris aux autres ; `mode=\"steal\"` prend aux autres, à proportion de ce qu'ils ont. Baisser un poste rend sa part à « Libre ». Les valeurs vont de `step` en `step` (5 par défaut). La fonction `allocate` du kit applique la même règle hors du composant.",
          "",
          "**Contrôlé** — `values` (une part par `id`, de 0 à `max`) et `onChange`, qui reçoit toutes les valeurs d'un coup. **Clavier** — chaque curseur est un vrai curseur du navigateur : flèches (± `step`), Page haut / bas (± 10 × `step`), Début / Fin ; il annonce sa valeur et ce qui reste. Au doigt, la zone de prise fait 44 px.",
          "",
          "**Thème** — la couleur de chaque poste (`color`, sinon une teinte du thème par rang), `--lq-color-fill-track` (le libre), `--lq-color-accent`, `--lq-color-panel`, `--lq-color-border`, `--lq-color-text`, `--lq-color-text-muted`, `--lq-radius-sm`, `--lq-text-sm`, `--lq-space-1` à `--lq-space-3`.",
        ].join("\n"),
      },
    },
  },
  args: {
    items: ALLOCATION_TEAMS,
    values: { produit: 50, support: 25, dette: 10 },
    onChange: fn(),
    max: 100,
    step: 5,
    mode: "cap",
    unit: " %",
    unallocatedLabel: "Libre",
    disabled: false,
    ariaLabel: "Temps de l'équipe",
  },
  argTypes: {
    items: { control: false },
    values: { control: "object" },
    onChange: { control: false },
    mode: { control: "inline-radio", options: ["cap", "steal"] },
    unallocatedLabel: { control: "text" },
  },
  // Les valeurs sont tenues par la story ; le contrôle `values` les remet à une répartition choisie.
  render: function Render(args) {
    const [values, setValues] = useState(args.values);
    useEffect(() => setValues(args.values), [args.values]);
    return (
      <div style={{ maxWidth: 480 }}>
        <AllocationSlider
          {...args}
          values={values}
          onChange={(next) => {
            setValues(next);
            args.onChange(next);
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof AllocationSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Plafonné : 15 % sont libres ; montez « Produit », il s'arrête à 65 %." } } },
};

export const Steal: Story = {
  name: "Prendre aux autres",
  args: { mode: "steal", values: { produit: 60, support: 25, dette: 15 } },
  parameters: { docs: { description: { story: "`mode=\"steal\"` : tout est réparti, et monter un poste prend aux autres à proportion de leur part." } } },
};

export const Days: Story = {
  name: "Des jours, au pas de 1",
  args: { max: 20, step: 1, unit: " j", values: { produit: 9, support: 5, dette: 3 }, ariaLabel: "Jours du sprint", unallocatedLabel: "Non planifié" },
  parameters: { docs: { description: { story: "Vingt jours de sprint à répartir, jour par jour : `max`, `step`, `unit` et `unallocatedLabel` changent l'unité du partage." } } },
};

export const WithIcons: Story = {
  name: "Icônes et couleurs",
  args: {
    items: [
      { id: "produit", label: "Produit", icon: <BriefcaseIcon size={12} />, color: "var(--lq-color-accent)" },
      { id: "support", label: "Support client", icon: <UserIcon size={12} />, color: "var(--lq-color-green)" },
      { id: "dette", label: "Dette technique", icon: <SettingsIcon size={12} />, color: "var(--lq-color-amber)" },
    ],
  },
  parameters: { docs: { description: { story: "Chaque poste peut porter une icône et une couleur — ici des jetons du thème." } } },
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { disabled: true },
};
