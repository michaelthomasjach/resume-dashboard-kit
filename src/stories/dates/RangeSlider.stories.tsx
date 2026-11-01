import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { RangeSlider } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ORDERS } from "../../showcase/demoData";

const euro = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const signe = (n: number) => `${n > 0 ? "+" : ""}${n} %`;

/** Les montants de commande de la démo bornent le curseur « Montant » : le filtre couvre les vraies données. */
const MONTANT_MAX = Math.ceil(Math.max(...ORDERS.map((o) => o.montant)) / 1000) * 1000;

/**
 * Un intervalle de valeurs à deux poignées.
 */
const meta = {
  title: "Forms/RangeSlider",
  component: RangeSlider,
  parameters: {
    docs: {
      description: {
        component: [
          "Curseur à **deux poignées** qui délimite un intervalle `[bas, haut]` sur une piste. Les deux bornes s'affichent au-dessus de la piste, mises en forme par `formatValue` (devise, pourcentage, unité). On tire une poignée pour étirer l'intervalle, ou la **bande** pleine entre elles pour le déplacer d'un bloc en gardant sa largeur.",
          "",
          "**Quand l'utiliser** — filtrer une liste sur une plage numérique dont l'ordre de grandeur compte plus que la valeur exacte : un montant, une variation, une ancienneté. Pour des bornes à saisir précisément, deux `InputNumber` ; pour une période calendaire, `DateRangePicker`.",
          "",
          "**Valeur** — composant **contrôlé** : `value` est un couple `[bas, haut]`, `onChange` reçoit le nouveau couple **à chaque mouvement** — pendant un glisser, plusieurs dizaines de fois par seconde. Pour interroger un serveur, temporisez côté appelant. Les valeurs sont arrondies au `step` (1 par défaut) et une poignée ne franchit jamais l'autre.",
          "",
          "**Centré sur zéro** — avec `centerZero` (et `min < 0 < max`), un repère marque le zéro et la bande se colore en rouge à gauche, en vert à droite : pour une variation, un écart. La bande n'est alors plus saisissable d'un bloc — seules les poignées bougent.",
          "",
          "**Clavier et pointeur** — chaque poignée est focalisable (`role=\"slider\"`, libellée d'après `label` : « Montant de commande — minimum » / « — maximum », `aria-valuetext` = la valeur formatée, `aria-orientation`). Flèches : un pas (droite et haut augmentent) ; PageUp / PageDown : `pageStep` (par défaut un dixième de l'étendue, arrondi au pas) ; Début / Fin : la borne atteignable (`min` ou l'autre poignée pour la basse, l'autre poignée ou `max` pour la haute). Un clic sur la piste y amène la poignée **la plus proche** et enchaîne sur le glissé ; un clic sur un libellé de graduation amène exactement à sa valeur. Deux poignées superposées : le premier mouvement choisit laquelle on tire. Toute valeur est ramenée sur le pas, sans résidu de virgule flottante. `onChangeEnd` part une fois le geste fini — c'est là qu'on branche une requête.",
          "",
          "**Options partagées avec `Slider`** — `orientation=\"vertical\"` (minimum en bas, longueur réglée par `height`, 160 par défaut ; les deux valeurs se lisent alors d'un bloc au-dessus) ; `marks` (liste `{ value, label? }`, ou `true` pour un trait par pas ; les traits compris dans l'intervalle prennent la couleur du ton) ; `showValue` — `\"never\"` par défaut, puisque la rangée du haut porte déjà les deux valeurs, `\"auto\"` (bulle au survol, au focus clavier, pendant le glissé) ou `\"always\"` (les bulles remplacent la rangée du haut) ; `tone` (`accent`, `success`, `info`, `danger`, `warning` — sans effet sur la bande de `centerZero`).",
          "",
          "**Thème** — la même anatomie et les mêmes variables que `Slider` : piste `--lq-color-fill-track`, bande et cercle des poignées `--lq-color-fill` (ou la couleur du ton ; `--lq-color-down` / `--lq-color-up` centrée sur zéro), fond des poignées `--lq-color-accent-contrast`, anneau `--lq-color-focus-ring`, rangée des valeurs en `--lq-color-text`, et les variables optionnelles `--lq-slider-*` (`-track-size`, `-track-bg`, `-track-radius`, `-thumb-size`, `-thumb-bg`, `-thumb-border`, `-thumb-shadow`, `-bubble-*`, `-mark-*`, `-tick-color`).",
        ].join("\n"),
      },
    },
  },
  args: {
    label: "Montant de commande",
    min: 0,
    max: MONTANT_MAX,
    step: 500,
    value: [1000, 15000],
    formatValue: euro,
    onChange: fn(),
  },
  argTypes: {
    value: { control: false },
    onChangeEnd: { control: false },
    marks: { control: "object" },
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    showValue: { control: "inline-radio", options: ["never", "auto", "always"] },
    tone: { control: "inline-radio", options: ["accent", "success", "info", "danger", "warning"] },
    height: { control: "number" },
    pageStep: { control: "number" },
    onChange: { control: false },
    formatValue: { control: false },
  },
  render: function Render(args) {
    const [value, setValue] = useState<[number, number]>(args.value);
    return (
      <div style={{ maxWidth: 420 }}>
        <RangeSlider
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
} satisfies Meta<typeof RangeSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Pas de 500 € ; tirez la bande pour déplacer l'intervalle sans changer sa largeur." } } },
};

export const CenterZero: Story = {
  name: "Centré sur zéro",
  args: { label: "Variation sur 30 jours", min: -50, max: 50, step: 1, value: [-15, 25], formatValue: signe, centerZero: true },
  parameters: { docs: { description: { story: "Rouge sous zéro, vert au-dessus, et un repère sur le zéro. Seules les poignées bougent." } } },
};

export const Years: Story = {
  name: "Ancienneté",
  args: { label: "Ancienneté du client (ans)", min: 0, max: 20, step: 1, value: [2, 8], formatValue: (n: number) => `${n} an${n > 1 ? "s" : ""}` },
};

export const Narrow: Story = {
  name: "Intervalle étroit",
  args: { label: "Remise accordée", min: 0, max: 30, step: 0.5, value: [10, 12.5], formatValue: (n: number) => `${n.toLocaleString("fr-FR")} %` },
  parameters: { docs: { description: { story: "Un pas décimal ; les deux poignées presque collées restent saisissables chacune." } } },
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { label: "Plage de prix imposée", disabled: true },
};

export const WithMarks: Story = {
  name: "Graduations avec libellés",
  args: {
    label: "Part en actions",
    min: 0,
    max: 100,
    step: 5,
    value: [25, 75],
    formatValue: (v: number) => `${v} %`,
    marks: [0, 25, 50, 75, 100].map((v) => ({ value: v, label: `${v} %` })),
  },
  parameters: { docs: { description: { story: "Les traits compris dans l'intervalle prennent la couleur du ton ; un clic sur un libellé y amène la poignée la plus proche." } } },
};

export const ValueBubbles: Story = {
  name: "Bulles de valeur (showValue)",
  parameters: { docs: { description: { story: "En haut, `showValue=\"always\"` : les bulles remplacent la rangée des valeurs. En bas, `\"auto\"` : la rangée reste, une bulle apparaît au survol, au focus clavier et pendant le glissé." } } },
  render: function Render(args) {
    const [a, setA] = useState<[number, number]>([1200, 3400]);
    const [b, setB] = useState<[number, number]>([30, 60]);
    return (
      <div style={{ maxWidth: 420, display: "flex", flexDirection: "column", gap: 24 }}>
        <RangeSlider {...args} label="Budget (bulles permanentes)" min={0} max={5000} step={100} value={a} onChange={setA} showValue="always" formatValue={euro} />
        <RangeSlider {...args} label="Heures creuses (bulles au survol)" min={0} max={100} step={1} value={b} onChange={setB} showValue="auto" formatValue={(v) => `${v} %`} />
      </div>
    );
  },
};

const TONES = ["accent", "success", "info", "danger", "warning"] as const;

export const Tones: Story = {
  name: "Tons",
  parameters: { docs: { description: { story: "Les cinq tons. En e-ink, tous passent à l'encre." } } },
  render: function Render(args) {
    const [values, setValues] = useState<[number, number][]>(TONES.map((_, i) => [10 + i * 8, 60 + i * 6]));
    return (
      <div style={{ maxWidth: 420, display: "flex", flexDirection: "column", gap: 16 }}>
        {TONES.map((tone, i) => (
          <RangeSlider
            {...args}
            key={tone}
            label={tone}
            min={0}
            max={100}
            step={1}
            formatValue={undefined}
            tone={tone}
            value={values[i]}
            onChange={(v) => setValues((prev) => prev.map((p, j) => (j === i ? v : p)))}
          />
        ))}
      </div>
    );
  },
};

export const Vertical: Story = {
  name: "Vertical",
  parameters: { docs: { description: { story: "Deux curseurs verticaux de 200 px : une plage de confort graduée en ton `info`, et une variation centrée sur zéro. Les deux valeurs se lisent d'un bloc au-dessus." } } },
  render: function Render(args) {
    const [temp, setTemp] = useState<[number, number]>([18, 22]);
    const [delta, setDelta] = useState<[number, number]>([-20, 30]);
    return (
      <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
        <RangeSlider
          {...args}
          label="Plage de confort"
          orientation="vertical"
          height={200}
          min={12}
          max={30}
          step={0.5}
          value={temp}
          onChange={setTemp}
          formatValue={(v) => `${v.toLocaleString("fr-FR")} °C`}
          marks={[12, 18, 24, 30].map((v) => ({ value: v, label: `${v} °C` }))}
          tone="info"
        />
        <RangeSlider {...args} label="Variation" orientation="vertical" height={200} min={-50} max={50} step={1} value={delta} onChange={setDelta} formatValue={signe} centerZero />
      </div>
    );
  },
};
