import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { SegmentedControl, Input, SearchIcon } from "@michaelthomasjach/liseuse-dashboard-kit";

const PERIODS = [
  { value: "7j", label: "7 j" },
  { value: "30j", label: "30 j" },
  { value: "trim", label: "Trimestre" },
  { value: "12m", label: "12 mois" },
];

const DENSITIES = [
  { value: "compacte", label: "Compacte" },
  { value: "normale", label: "Normale" },
  { value: "aeree", label: "Aérée" },
];

/**
 * La rangée d'options exclusives. L'option active prend le plein de l'accent, les autres restent
 * sur le fond de la carte, le tout dans un seul filet.
 */
const meta = {
  title: "Primitives/SegmentedControl",
  component: SegmentedControl,
  parameters: {
    docs: {
      description: {
        component: [
          "Rangée de boutons accolés dont un seul est actif : la période d'un graphique, la densité d'un tableau, HT ou TTC.",
          "",
          "**Quand l'utiliser** — deux à cinq options **courtes**, exclusives, toutes visibles, dont l'effet est immédiat. Au-delà de cinq, ou pour des libellés longs, préférez `Select`. Pour passer d'une vue à une autre (et non régler la vue courante), `Tabs`. Il ne remplace pas un groupe radio de formulaire, qui porte des libellés longs et s'empile verticalement — un manque connu du kit.",
          "",
          "**Toujours contrôlé** — `value` et `onChange` sont obligatoires ; le composant est générique, `onChange` reçoit la valeur de l'option, typée comme les `value` de `options`.",
          "",
          "**Deux dispositions** — `labelPosition=\"inline\"` (défaut) pose un petit intitulé en capitales à gauche, pour un réglage d'écran ; `labelPosition=\"top\"` le pose au-dessus, comme celui d'un champ, et donne aux options une hauteur de champ, pour une barre de filtres. `label` est facultatif.",
          "",
          "**Accessibilité** — `role=\"radiogroup\"` nommé par `label`, chaque option en `role=\"radio\"` avec `aria-checked`. Un seul arrêt de tabulation, l'option choisie ; les quatre flèches choisissent l'option voisine (en bouclant), Début et Fin les extrémités — comme un groupe radio natif.",
          "",
          "**Thème** — `--lq-color-fill` et `--lq-color-accent-contrast` (option active), `--lq-color-panel`, `--lq-color-border`, `--lq-control-border-width`, `--lq-radius-md`, `--lq-space-2`, `--lq-space-4` ; l'intitulé en ligne suit `--lq-label-font`, `--lq-label-size`, `--lq-label-weight`, `--lq-label-tracking`.",
        ].join("\n"),
      },
    },
  },
  args: { label: "Période", options: PERIODS, value: "30j", onChange: fn() },
  argTypes: { options: { control: false } },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return (
      <SegmentedControl
        {...args}
        value={value}
        onChange={(next) => {
          setValue(next);
          args.onChange(next);
        }}
      />
    );
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const LabelTop: Story = {
  name: "Libellé au-dessus",
  args: { label: "Densité des tableaux", labelPosition: "top", options: DENSITIES, value: "normale" },
};

export const WithoutLabel: Story = {
  name: "Sans libellé",
  args: {
    label: undefined,
    options: [
      { value: "ht", label: "HT" },
      { value: "ttc", label: "TTC" },
    ],
    value: "ht",
  },
  parameters: { docs: { description: { story: "Deux options qui se lisent seules : l'intitulé serait redondant." } } },
};

export const InFilterBar: Story = {
  name: "Dans une barre de filtres",
  render: function Render() {
    const [period, setPeriod] = useState("30j");
    const [query, setQuery] = useState("");
    return (
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
        <div style={{ width: 260 }}>
          <Input label="Client" placeholder="Rechercher…" leadingIcon={<SearchIcon size={16} />} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <SegmentedControl label="Période" labelPosition="top" options={PERIODS} value={period} onChange={setPeriod} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "En `labelPosition=\"top\"`, l'intitulé passe au-dessus comme celui de l'`Input` voisin, avec ses variables (`--lq-field-label-size`, `--lq-field-label-weight`), et les options prennent la hauteur des champs (`--lq-control-height`) : les deux s'alignent.",
      },
    },
  },
};
