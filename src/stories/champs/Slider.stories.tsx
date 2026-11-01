import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button, Slider, Text } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * Le curseur à une valeur : bornes, pas, graduations, bulle de valeur, tons, orientation verticale.
 */
const meta = {
  title: "Forms/Slider",
  component: Slider,
  parameters: {
    docs: {
      description: {
        component: [
          "Curseur à **une** valeur : un volume, un seuil, une luminosité, une consigne. On glisse la poignée, ou on clique n'importe où sur la piste pour l'y amener (et enchaîner sur le glissé).",
          "",
          "**Quand l'utiliser** — une valeur bornée qu'on règle plus qu'on ne la tape, où l'ordre de grandeur compte davantage que le chiffre exact. Pour un intervalle (une fourchette de prix), `RangeSlider` et ses deux poignées ; pour une valeur précise, `InputNumber` ; pour trois ou quatre choix nommés, `SegmentedControl`.",
          "",
          "**Valeur** — contrôlée avec `value` + `onChange`, ou libre avec `defaultValue` (défaut : `min`). `onChange` part à chaque cran franchi, pendant le glissé comme au clavier ; `onChangeEnd` part une fois le geste fini (au lâcher, après chaque touche) — c'est là qu'on branche une requête. Toute valeur est ramenée sur la grille de `step` comptée depuis `min`, et dans les bornes, sans résidu de virgule flottante (`0.1 + 0.2` donne `0.3`). `name` ajoute un `<input type=\"hidden\">` pour un formulaire natif.",
          "",
          "**Bornes et pas** — `min` (0), `max` (100), `step` (1). `pageStep` règle le saut de PageUp / PageDown ; par défaut un dixième de l'étendue, arrondi au pas.",
          "",
          "**Graduations** — `marks` reçoit une liste `{ value, label? }` : un trait sous la piste à chaque position, et le libellé dessous s'il y en a un. Un clic sur un libellé amène exactement à sa valeur. `marks={true}` pose un trait à chaque pas, sans libellé (au-delà de 100 crans, aucun : ils se toucheraient). Les traits déjà franchis prennent la couleur du ton.",
          "",
          "**Bulle de valeur** — `showValue=\"auto\"` (défaut) la montre au survol de la poignée, au focus clavier et pendant le glissé ; `\"always\"` en permanence (le curseur réserve alors sa hauteur au-dessus de la piste, ou sa largeur à gauche en vertical) ; `\"never\"` jamais. Elle affiche `formatValue(value)`, qui sert aussi d'`aria-valuetext`.",
          "",
          "**Orientation** — `orientation=\"vertical\"` dresse la piste, minimum en bas ; `height` en règle la longueur (nombre en px ou toute longueur CSS, 160 par défaut). En horizontal, le curseur prend la largeur de son conteneur.",
          "",
          "**Tons** — `tone` colore le remplissage, la poignée et les traits franchis : `accent` (défaut), `success`, `info`, `danger`, `warning`. En palette e-ink, tous retombent sur l'encre.",
          "",
          "**Clavier et accessibilité** — la poignée porte `role=\"slider\"`, `aria-valuemin` / `max` / `now`, `aria-valuetext` et `aria-orientation`. Elle est dans l'ordre de tabulation (sauf `disabled`). Flèches : un pas (droite et haut augmentent, dans les deux orientations) ; PageUp / PageDown : `pageStep` ; Début / Fin : les bornes. `label` est relié par `aria-labelledby` ; sans libellé visible, passez `aria-label`. Focus visible : un anneau autour de la poignée.",
          "",
          "**Thème** — `--lq-color-fill` (ton accent), `--lq-color-green` / `-info` / `-danger` / `-warning` (autres tons), `--lq-color-fill-track`, `--lq-color-accent-contrast` (fond de poignée), `--lq-color-focus-ring`, `--lq-field-*` (libellé), et les variables optionnelles `--lq-slider-*` : `-track-size`, `-track-bg`, `-track-radius`, `-thumb-size`, `-thumb-bg`, `-thumb-border`, `-thumb-shadow`, `-bubble-bg`, `-bubble-color`, `-bubble-size`, `-bubble-radius`, `-mark-size`, `-mark-color`, `-tick-color`.",
        ].join("\n"),
      },
    },
  },
  args: {
    label: "Volume",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 40,
    orientation: "horizontal",
    showValue: "auto",
    tone: "accent",
    disabled: false,
    onChange: fn(),
    onChangeEnd: fn(),
  },
  argTypes: {
    value: { control: false },
    onChange: { control: false },
    onChangeEnd: { control: false },
    formatValue: { control: false },
    marks: { control: "object" },
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    showValue: { control: "inline-radio", options: ["auto", "always", "never"] },
    tone: { control: "inline-radio", options: ["accent", "success", "info", "danger", "warning"] },
    height: { control: "number" },
    pageStep: { control: "number" },
  },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Slider {...args} />
    </div>
  ),
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut (valeur libre)",
  args: { formatValue: (v: number) => `${v} %` },
  parameters: { docs: { description: { story: "Valeur libre de départ à 40. Survolez la poignée ou prenez-la au clavier (Tab) pour voir la bulle ; essayez PageUp, Début et Fin." } } },
};

export const Controlled: Story = {
  name: "Contrôlé",
  args: { label: "Consigne de température", min: 16, max: 28, step: 0.5 },
  parameters: { docs: { description: { story: "L'appelant tient la valeur : le bouton la remet à 19 °C, le texte suit le glissé. Pas de 0,5 sans résidu de virgule flottante." } } },
  render: function Render(args) {
    const [value, setValue] = useState(21);
    return (
      <div style={{ maxWidth: 360, display: "flex", flexDirection: "column", gap: 12 }}>
        <Slider
          {...args}
          defaultValue={undefined}
          value={value}
          onChange={(v) => {
            setValue(v);
            args.onChange?.(v);
          }}
          formatValue={(v) => `${v.toLocaleString("fr-FR")} °C`}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Text size="sm" muted>
            Valeur : {value.toLocaleString("fr-FR")} °C
          </Text>
          <Button onClick={() => setValue(19)}>Mode éco (19 °C)</Button>
        </div>
      </div>
    );
  },
};

export const WithMarks: Story = {
  name: "Graduations avec libellés",
  args: {
    label: "Exposition au risque",
    defaultValue: 50,
    step: 5,
    marks: [
      { value: 0, label: "Prudent" },
      { value: 50, label: "Équilibré" },
      { value: 100, label: "Dynamique" },
    ],
    formatValue: (v: number) => `${v} %`,
  },
  parameters: { docs: { description: { story: "Trois positions nommées sous la piste ; un clic sur un libellé y amène exactement. Les traits franchis prennent la couleur du ton." } } },
};

export const StepMarks: Story = {
  name: "Un cran par pas (marks={true})",
  args: { label: "Luminosité", defaultValue: 60, step: 10, marks: true, formatValue: (v: number) => `${v} %` },
  parameters: { docs: { description: { story: "`marks={true}` : un trait par pas de 10, sans libellé." } } },
};

export const AlwaysShowValue: Story = {
  name: "Valeur toujours affichée",
  args: {
    label: "Budget mensuel",
    min: 0,
    max: 5000,
    step: 50,
    defaultValue: 1850,
    showValue: "always",
    formatValue: (v: number) => `${v.toLocaleString("fr-FR")} €`,
    marks: [
      { value: 0, label: "0 €" },
      { value: 2500, label: "2 500 €" },
      { value: 5000, label: "5 000 €" },
    ],
  },
  parameters: { docs: { description: { story: "La bulle reste affichée ; le curseur réserve sa hauteur au-dessus de la piste pour qu'elle ne morde pas sur le libellé." } } },
};

export const Tones: Story = {
  name: "Tons",
  parameters: { docs: { description: { story: "Les cinq tons, de l'accent du thème à l'avertissement. En e-ink, tous passent à l'encre." } } },
  render: (args) => (
    <div style={{ maxWidth: 360, display: "flex", flexDirection: "column", gap: 16 }}>
      <Slider {...args} label="Accent" defaultValue={70} tone="accent" />
      <Slider {...args} label="Succès" defaultValue={55} tone="success" />
      <Slider {...args} label="Info" defaultValue={40} tone="info" />
      <Slider {...args} label="Danger" defaultValue={85} tone="danger" />
      <Slider {...args} label="Avertissement" defaultValue={25} tone="warning" />
    </div>
  ),
};

const BANDS = [
  { hz: "60 Hz", value: 4 },
  { hz: "230 Hz", value: 2 },
  { hz: "910 Hz", value: -1 },
  { hz: "3,6 kHz", value: 3 },
  { hz: "14 kHz", value: 5 },
];

export const Vertical: Story = {
  name: "Vertical (égaliseur)",
  args: { orientation: "vertical" },
  parameters: { docs: { description: { story: "Cinq curseurs verticaux de 180 px, de −12 à +12 dB, nommés par `aria-label` ; à droite, un curseur de 120 px avec libellé et graduations à droite de la piste." } } },
  render: (args) => (
    <div style={{ display: "flex", gap: 28, alignItems: "flex-end" }}>
      {BANDS.map((b) => (
        <div key={b.hz} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <Slider
            {...args}
            label={undefined}
            orientation="vertical"
            height={180}
            min={-12}
            max={12}
            defaultValue={b.value}
            aria-label={`Gain ${b.hz}`}
            formatValue={(v) => `${v > 0 ? "+" : ""}${v} dB`}
          />
          <Text size="xs" muted>
            {b.hz}
          </Text>
        </div>
      ))}
      <Slider
        {...args}
        orientation="vertical"
        height={120}
        label="Volume"
        defaultValue={60}
        step={20}
        marks={[0, 20, 40, 60, 80, 100].map((v) => ({ value: v, label: `${v}` }))}
        tone="success"
      />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { disabled: true, marks: [{ value: 0 }, { value: 50 }, { value: 100 }] },
  parameters: { docs: { description: { story: "Atténué, hors de l'ordre de tabulation, insensible au pointeur ; `aria-disabled` sur la poignée." } } },
};
