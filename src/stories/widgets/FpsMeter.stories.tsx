import { useEffect, useMemo } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FpsMeter, Text, createFpsSource, useFps } from "@michaelthomasjach/liseuse-dashboard-kit";
import { Stage } from "./_Stage";

/**
 * Une scène qui tourne à environ 24 images par seconde, sans hasard : des durées d'image fixes
 * poussées dans une source de `createFpsSource`. C'est ce qu'une application branche sur sa propre
 * boucle de rendu quand elle veut mesurer sa scène plutôt que la page.
 */
function useSlowScene() {
  const source = useMemo(() => createFpsSource(), []);
  useEffect(() => {
    const frames = [38, 44, 40, 47, 41];
    let i = 0;
    const id = window.setInterval(() => source.emit(frames[i++ % frames.length]), 42);
    return () => window.clearInterval(id);
  }, [source]);
  return source;
}

/**
 * Le compteur d'images par seconde, en pastille dans un coin. Par défaut il mesure la page ; on
 * peut lui brancher sa propre horloge.
 */
const meta = {
  title: "Widgets/FpsMeter",
  component: FpsMeter,
  parameters: {
    docs: {
      description: {
        component: [
          "Le **compteur d'images** : une petite pastille en surimpression qui dit la cadence (images par seconde), la plus basse de la fenêtre et la durée moyenne d'une image, avec une courbe des derniers relevés.",
          "",
          "**Quand l'utiliser** — pendant le développement ou dans un mode « diagnostic » d'une vue animée : un globe, une carte, une scène de jeu, un graphique en temps réel. Ce n'est pas un indicateur pour l'utilisateur final.",
          "",
          "**La mesure** — par défaut, la cadence de la **page** : une boucle `requestAnimationFrame` note l'écart entre deux images. Pour mesurer **sa** scène, passez une `source` : `createFpsSource()` en crée une qu'on alimente avec `emit(ms)` à chaque image réellement dessinée. L'intérêt : une scène au repos ne redessine rien, et le compteur le dit (« au repos ») au lieu d'afficher 60 i/s qui ne mesureraient que le navigateur. Le crochet `useFps({ source })` donne les mêmes chiffres sans pastille, pour les afficher ailleurs.",
          "",
          "**La lecture** — toutes les `sampleMs` (500 ms par défaut), le compteur résume la fenêtre écoulée. **Vert** au-dessus de 50 i/s, **ambre** au-dessus de 30, **rouge** en dessous. `showGraph` (vrai par défaut) garde les 60 derniers résumés ; `compact` n'affiche que la cadence ; `label` pose un mot devant (« Scène », « Page ») ; `locale` (`\"fr-FR\"` par défaut) écrit la durée d'image (« 16,7 ms »). Rien n'est rendu par React entre deux résumés : la mesure ne coûte presque rien.",
          "",
          "**Placement** — `position` (`bottom-right` par défaut, ou l'un des trois autres coins) et `offset` (8 px et 8 px). **Le conteneur doit être positionné.** La pastille ne capte aucun geste (`pointer-events: none`) : on clique à travers.",
          "",
          "**Thème** — `--lq-color-up` / `--lq-color-green`, `--lq-color-warning`, `--lq-color-danger` (les trois paliers), `--lq-color-panel`, `--lq-color-border`, `--lq-color-text`, `--lq-color-text-muted`, `--lq-radius-sm`.",
        ].join("\n"),
      },
    },
  },
  args: { position: "bottom-right", label: "Page", showGraph: true, compact: false, sampleMs: 500 },
  argTypes: {
    position: { control: "select", options: ["bottom-right", "bottom-left", "top-right", "top-left"] },
    sampleMs: { control: { type: "range", min: 100, max: 2000, step: 100 } },
    source: { control: false },
    offset: { control: "object" },
    locale: { control: "text", table: { defaultValue: { summary: '"fr-FR"' } } },
  },
  render: (args) => (
    <Stage height={240}>
      <FpsMeter {...args} />
    </Stage>
  ),
} satisfies Meta<typeof FpsMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Il mesure la page, dont la boucle d'images tourne en continu : le chiffre dit ce que le navigateur tient." } } },
};

export const Corners: Story = {
  name: "Dans les quatre coins",
  render: () => (
    <Stage height={240}>
      <FpsMeter label="Page" />
      <FpsMeter position="top-left" compact />
      <FpsMeter position="top-right" showGraph={false} label="Sans courbe" />
      <FpsMeter position="bottom-left" compact showGraph={false} />
    </Stage>
  ),
  parameters: { docs: { description: { story: "Complet, compact, sans courbe, et compact sans courbe." } } },
};

export const OwnSource: Story = {
  name: "Une scène à soi",
  render: function Render(args) {
    const scene = useSlowScene();
    const reading = useFps({ source: scene });
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Stage height={240}>
          <FpsMeter {...args} source={scene} label="Scène" position="top-right" />
        </Stage>
        <Text size="sm" muted>
          useFps sur la même source : {Math.round(reading.fps)} i/s, au plus lent {Math.round(reading.min)} i/s, {reading.ms.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ms par image.
        </Text>
      </div>
    );
  },
  parameters: { docs: { description: { story: "Une boucle de rendu à environ 24 i/s alimente `createFpsSource()` : la pastille passe au rouge, et `useFps` lit les mêmes chiffres." } } },
};
