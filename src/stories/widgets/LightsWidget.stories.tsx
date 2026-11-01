import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LightDetailModal, LightsWidget, Text, type LightEntry } from "@michaelthomasjach/liseuse-dashboard-kit";
import { LIGHT_COLORS, LIGHTS, WHITE_BALANCES } from "../../showcase/widgetData";

/** Allumer reprend au moins 60 % ; éteindre met à zéro. Le mot d'état suit ; une lampe sans variateur reste sans jauge. */
function setLight(list: LightEntry[], id: string, on: boolean): LightEntry[] {
  return list.map((l) => {
    if (l.id !== id) return l;
    if (l.level === undefined) return { ...l, on, statusText: on ? "allumé" : "éteint" };
    const level = on ? Math.max(l.level, 60) : 0;
    return { ...l, on, level, statusText: on ? `${level} %` : "éteint" };
  });
}

const onCount = (list: LightEntry[]) => {
  const n = list.filter((l) => l.on).length;
  return `${n} allumée${n > 1 ? "s" : ""}`;
};

/**
 * Le panneau « Lumières » : interrupteur, intensité et état par lampe. Une rangée peut ouvrir la
 * fiche de la lampe (`LightDetailModal`).
 */
const meta = {
  title: "Widgets/LightsWidget",
  component: LightsWidget,
  parameters: {
    docs: {
      description: {
        component: [
          "Panneau **« Lumières »** : une rangée par lampe ou par pièce, avec un **interrupteur**, une **jauge d'intensité** en dix segments et un **mot d'état** (« 75 % », « éteint »).",
          "",
          "**Quand l'utiliser** — pour une liste d'éclairages qu'on allume et éteint d'un geste, en voyant leur intensité. Même anatomie que `ShuttersWidget` (seul le titre par défaut change) ; pour des valeurs sans commande, `MetricListWidget`.",
          "",
          "**Ouvrir une fiche** — donnez à une entrée un `onClick` : toute la rangée devient cliquable, **indépendamment de l'interrupteur** (cliquer l'interrupteur bascule sans ouvrir). C'est ainsi qu'on ouvre `LightDetailModal` pour régler température de blanc et couleur.",
          "",
          "**Contrôlé** — rien n'est gardé dans le widget : `onToggle(on)` est appelé et l'application renvoie la liste à jour, intensité et mot d'état compris. Chaque entrée (`LightEntry`) porte `id`, `label`, `on`, et au besoin `level` (0 à 100 ; absent, pas de jauge), `statusText`, `onToggle`, `onClick`, `disabled`. `title` vaut « Lumières » par défaut ; `meta` s'affiche à droite du titre.",
          "",
          "**Thème** — celles du panneau et de ses rangées (`--lq-color-panel`, `--lq-color-panel-border`, `--lq-radius-lg`, `--lq-shadow-panel`, `--lq-row-font-size`, `--lq-color-border-subtle` entre les rangées), de `Toggle` et de `LevelGauge` (`--lq-color-fill`, `--lq-color-fill-track`, `--lq-radius-pill`).",
        ].join("\n"),
      },
    },
  },
  args: { title: "Lumières", lights: LIGHTS },
  argTypes: {
    title: { control: "text" },
    meta: { control: "text" },
    lights: { control: false },
  },
  // Les lampes sont tenues par la story ; tant que `meta` est laissé vide, le compte suit.
  render: function Render(args) {
    const [lights, setLights] = useState(args.lights);
    useEffect(() => setLights(args.lights), [args.lights]);
    return (
      <div style={{ maxWidth: 380 }}>
        <LightsWidget
          {...args}
          meta={args.meta ?? onCount(lights)}
          lights={lights.map((l) => ({ ...l, onToggle: (on: boolean) => setLights((list) => setLight(list, l.id, on)) }))}
        />
      </div>
    );
  },
} satisfies Meta<typeof LightsWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const WithDetail: Story = {
  name: "Avec la fiche de la lampe",
  render: function Render(args) {
    const [lights, setLights] = useState(args.lights);
    const [openId, setOpenId] = useState<string | null>(null);
    const [whiteBalance, setWhiteBalance] = useState("chaud");
    const [color, setColor] = useState<string | undefined>(undefined);
    const active = lights.find((l) => l.id === openId) ?? null;
    return (
      <div style={{ maxWidth: 380, display: "flex", flexDirection: "column", gap: 12 }}>
        <LightsWidget
          {...args}
          meta={onCount(lights)}
          lights={lights.map((l) => ({
            ...l,
            onToggle: (on: boolean) => setLights((list) => setLight(list, l.id, on)),
            onClick: () => setOpenId(l.id),
          }))}
        />
        <Text size="sm" muted>
          Cliquez une rangée, hors interrupteur, pour ouvrir la fiche de la lampe.
        </Text>
        {active ? (
          <LightDetailModal
            open
            onClose={() => setOpenId(null)}
            roomName={active.label}
            on={active.on}
            onPowerChange={(on) => setLights((list) => setLight(list, active.id, on))}
            whiteBalanceOptions={WHITE_BALANCES}
            whiteBalance={whiteBalance}
            onWhiteBalanceChange={setWhiteBalance}
            colorOptions={LIGHT_COLORS}
            color={color}
            onColorChange={setColor}
          />
        ) : null}
      </div>
    );
  },
  parameters: { docs: { description: { story: "Chaque rangée a un `onClick` qui ouvre `LightDetailModal` ; l'interrupteur, lui, bascule sans ouvrir." } } },
};

export const OnOffOnly: Story = {
  name: "Sans intensité",
  args: {
    title: "Extérieur",
    lights: [
      { id: "terrasse", label: "Terrasse", on: true, statusText: "allumé" },
      { id: "allee", label: "Allée", on: true, statusText: "allumé" },
      { id: "portail", label: "Portail", on: false, statusText: "éteint" },
      { id: "abri", label: "Abri de jardin", on: false, statusText: "éteint" },
    ],
  },
  parameters: { docs: { description: { story: "Des lampes sans variateur : pas de `level`, donc pas de jauge — l'interrupteur et le mot d'état suffisent." } } },
};
