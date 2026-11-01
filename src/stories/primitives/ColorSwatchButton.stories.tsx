import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ColorSwatchButton, Text } from "@michaelthomasjach/liseuse-dashboard-kit";

/** Les teintes du thème : des variables, pour que chaque pastille suive la surface sombre. */
const SWATCHES = [
  { id: "accent", label: "Violet", color: "var(--lq-color-accent)" },
  { id: "green", label: "Vert", color: "var(--lq-color-green)" },
  { id: "amber", label: "Ambre", color: "var(--lq-color-amber)" },
  { id: "rose", label: "Rose", color: "var(--lq-color-rose)" },
  { id: "sky", label: "Ciel", color: "var(--lq-color-sky)" },
];

/**
 * La pastille de couleur à libellé : un petit carré de teinte et son nom, dans un bouton à filet
 * qui se coche.
 */
const meta = {
  title: "Primitives/ColorSwatchButton",
  component: ColorSwatchButton,
  parameters: {
    docs: {
      description: {
        component: [
          "Bouton à filet portant une pastille de couleur et son nom. Coché (`selected`), son filet prend l'accent plein.",
          "",
          "**Quand l'utiliser** — un choix parmi quelques teintes nommées : étiqueter un segment client, colorer une série, choisir la lumière d'une pièce. Le nom compte autant que la couleur — il reste lisible pour qui distingue mal les teintes. Pour un choix de libellés sans couleur, `SegmentedControl` ou `Chip`.",
          "",
          "**Comportement** — une pastille **sans état propre** : le parent tient la sélection, passe `selected` et réagit à `onClick`. Par défaut c'est une case à cocher (`role=\"checkbox\"`, `aria-checked`) : choix multiple, le parent garde un ensemble de valeurs. Avec `exclusive`, elle devient un bouton radio (`role=\"radio\"`) : choix d'une seule teinte (story « Choix d'une teinte »), groupe à envelopper dans un conteneur `role=\"radiogroup\"` muni d'un `aria-label`.",
          "",
          "**Couleur** — `color` accepte toute couleur CSS. Préférez les variables du thème (`var(--lq-color-green)`…) : la pastille suivra la surface sombre sans rien faire.",
          "",
          "**Thème** — `--lq-color-panel`, `--lq-color-border`, `--lq-control-border-width`, `--lq-radius-md`, `--lq-color-fill` (filet coché), `--lq-space-2`, `--lq-space-3`, `--lq-font-weight-semibold`.",
        ].join("\n"),
      },
    },
  },
  args: { label: "Violet", color: "var(--lq-color-accent)", selected: false, exclusive: false, onClick: fn() },
  argTypes: { color: { control: "text" } },
} satisfies Meta<typeof ColorSwatchButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Selected: Story = {
  name: "Coché",
  args: { selected: true, label: "Vert", color: "var(--lq-color-green)" },
};

export const ExclusiveChoice: Story = {
  name: "Choix d'une teinte",
  render: function Render(args) {
    const [swatch, setSwatch] = useState("accent");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div role="radiogroup" aria-label="Teinte du segment" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SWATCHES.map((s) => (
            <ColorSwatchButton
              key={s.id}
              label={s.label}
              color={s.color}
              selected={swatch === s.id}
              exclusive
              onClick={() => {
                setSwatch(s.id);
                args.onClick?.();
              }}
            />
          ))}
        </div>
        <Text size="sm" muted>
          Teinte du segment « Grands comptes » : {SWATCHES.find((s) => s.id === swatch)?.label}
        </Text>
      </div>
    );
  },
  parameters: { docs: { description: { story: "`exclusive` : chaque pastille est un bouton radio, dans un `role=\"radiogroup\"`. Le parent ne coche qu'une pastille : un clic en coche une et décoche la précédente." } } },
};

export const MultipleChoice: Story = {
  name: "Choix multiple",
  render: function Render() {
    const [chosen, setChosen] = useState<Set<string>>(new Set(["accent", "sky"]));
    const toggle = (id: string) =>
      setChosen((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SWATCHES.map((s) => (
            <ColorSwatchButton key={s.id} label={s.label} color={s.color} selected={chosen.has(s.id)} onClick={() => toggle(s.id)} />
          ))}
        </div>
        <Text size="sm" muted>
          {chosen.size} série{chosen.size > 1 ? "s" : ""} affichée{chosen.size > 1 ? "s" : ""} sur le graphique
        </Text>
      </div>
    );
  },
  parameters: { docs: { description: { story: "Chaque pastille se coche indépendamment : le parent garde un ensemble." } } },
};
