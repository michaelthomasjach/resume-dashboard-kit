import { useRef, useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button, Card, InteractiveGlobe, Text, type InteractiveGlobeHandle } from "@michaelthomasjach/liseuse-dashboard-kit";
import { GLOBE_FLOWS, GLOBE_NODES } from "../../showcase/widgetData";

/** Le globe remplit son parent : il lui faut un cadre d'une hauteur fixe. */
const Frame = ({ children, height = 440 }: { children: ReactNode; height?: number }) => (
  <div
    style={{
      position: "relative",
      height,
      overflow: "hidden",
      border: "1px solid var(--lq-color-border-subtle)",
      borderRadius: "var(--lq-radius-md)",
      background: "var(--lq-color-bg)",
    }}
  >
    {children}
  </div>
);

const NO_WEBGL = <Text muted>Ce navigateur n'a pas WebGL : le globe ne peut pas s'afficher.</Text>;

/** Une carte d'information posée en haut à droite du globe, au-dessus des canevas. */
const Overlay = ({ children }: { children: ReactNode }) => (
  <div style={{ position: "absolute", top: "var(--lq-space-4)", right: "var(--lq-space-4)", width: 240, pointerEvents: "auto" }}>{children}</div>
);

/**
 * Un globe en WebGL qui tourne, se zoome, et dessine des points, des flux en arc de grand cercle et
 * des particules qui y circulent. Ses couleurs viennent des variables du thème.
 */
const meta = {
  title: "Map/Interactive Globe",
  component: InteractiveGlobe,
  parameters: {
    docs: {
      description: {
        component: [
          "Un **globe 3D** qu'on fait tourner et qu'on zoome, qui dessine des **points** (`nodes`), des **flux** en arc de grand cercle entre eux (`flows`), des **particules** qui circulent sur ces flux, et des repères secondaires (`markers`). Le rendu est en WebGL, entièrement hors de React : un nouveau rendu du composant ne touche jamais la boucle d'images.",
          "",
          "**Quand l'utiliser** — pour montrer des relations entre lieux à l'échelle du monde : échanges entre bureaux, routes logistiques, latences d'un réseau, dépendances entre pays. Pour un itinéraire, des rues ou un zoom fin, `TileMap` ; pour une carte du monde plate où chaque grande région est teintée selon sa part, `WorldExposureMap`.",
          "",
          "**Données** — le globe ne sait rien de ce que signifient ses données : des points avec coordonnées (`lon`, `lat`, et au besoin `label`, `size`, `weight` pour le classement des étiquettes, `minLod` pour n'apparaître qu'à un certain zoom, `pulse` pour un halo), des arcs (`from` / `to` par `id` ou par coordonnées, `intensity` qui règle opacité et nombre de particules, `style` plein ou pointillé, `bidirectional`). Ce qu'un clic doit faire reste à l'application.",
          "",
          "**Interaction** — glisser pour tourner, molette pour zoomer, clic pour sélectionner. `onNodeClick`, `onFlowClick`, `onCountryClick` et `onBackgroundClick` (le « tout désélectionner » habituel) rendent la main avec les `id`. `selectedNodeId` entoure un point d'un anneau et atténue tout ce qu'il ne touche pas ; `highlightedFlowIds` sort des flux de cette atténuation. Une poignée (`ref`, `InteractiveGlobeHandle`) pilote la caméra : `focusNode`, `focusLonLat`, `resetView`, `zoomBy`, `setView`.",
          "",
          "**Réglages** — `autoRotate` fait tourner le globe jusqu'à ce qu'on le touche ; `quality` (`low`, `medium`, `high`) et `maxAnimatedFlows` règlent le budget de rendu ; `animateFlows={false}` arrête les particules ; `labelMode` (`auto`, `all`, `none`) ; `countryHover` souligne le pays sous le pointeur ; `interactive={false}` en fait un fond décoratif. `initialView` ne sert qu'au premier rendu.",
          "",
          "**Mise en page** — le globe **remplit son parent** : donnez-lui un cadre d'une hauteur fixe. `overlay` pose du contenu au-dessus des canevas (légende, fiche), qui laisse passer les clics sauf s'il remet `pointer-events: auto`. `fallback` s'affiche sans WebGL.",
          "",
          "**Thème** — chaque couleur de `theme` (sphère, terres, points, flux, sélection, survol…) prend par défaut un jeton `--lq-*`, lu pour être passé aux shaders : le globe suit la surface claire ou sombre. Autour : `--lq-color-panel`, `--lq-color-border-subtle`, `--lq-color-text-muted`, `--lq-text-sm`.",
        ].join("\n"),
      },
    },
  },
  args: {
    nodes: GLOBE_NODES,
    flows: GLOBE_FLOWS,
    autoRotate: true,
    autoRotateSpeed: 4,
    animateFlows: true,
    quality: "high",
    labelMode: "auto",
    countryHover: true,
    interactive: true,
    initialView: { lon: -10, lat: 30 },
    fallback: NO_WEBGL,
    ariaLabel: "Échanges entre bureaux",
    onNodeClick: fn(),
    onBackgroundClick: fn(),
  },
  argTypes: {
    nodes: { control: false },
    flows: { control: false },
    markers: { control: false },
    theme: { control: false },
    initialView: { control: false },
    overlay: { control: false },
    fallback: { control: false },
    style: { control: false },
    highlightedFlowIds: { control: false },
    autoRotateSpeed: { control: { type: "range", min: 0, max: 30, step: 1 } },
    particleScale: { control: { type: "range", min: 0.5, max: 3, step: 0.1 } },
    quality: { control: "inline-radio", options: ["low", "medium", "high"] },
    labelMode: { control: "inline-radio", options: ["auto", "all", "none"] },
    onNodeClick: { control: false },
    onNodeHover: { control: false },
    onFlowClick: { control: false },
    onFlowHover: { control: false },
    onCountryHover: { control: false },
    onCountryClick: { control: false },
    onBackgroundClick: { control: false },
    onViewChange: { control: false },
    onLodChange: { control: false },
  },
  render: (args) => (
    <Frame>
      <InteractiveGlobe {...args} />
    </Frame>
  ),
} satisfies Meta<typeof InteractiveGlobe>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Dix bureaux et leurs échanges : le globe tourne jusqu'à ce qu'on le saisisse." } } },
};

export const Selection: Story = {
  name: "Sélection et recentrage",
  render: function Render(args) {
    const globe = useRef<InteractiveGlobeHandle>(null);
    const [node, setNode] = useState<string | null>("par");
    const picked = GLOBE_NODES.find((n) => n.id === node);
    return (
      <Frame>
        <InteractiveGlobe
          {...args}
          ref={globe}
          selectedNodeId={node}
          onNodeClick={(event) => {
            setNode(event.node.id);
            globe.current?.focusNode(event.node.id, { zoom: 1.6 });
            args.onNodeClick?.(event);
          }}
          onBackgroundClick={() => setNode(null)}
          overlay={
            picked ? (
              <Overlay>
                <Card title={picked.label} meta={`${picked.lat.toFixed(1)}°, ${picked.lon.toFixed(1)}°`}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Text size="sm" muted>
                      {GLOBE_FLOWS.filter((f) => f.from === picked.id || f.to === picked.id).length} flux reliés
                    </Text>
                    <Button onClick={() => globe.current?.resetView()}>Recentrer</Button>
                  </div>
                </Card>
              </Overlay>
            ) : null
          }
        />
      </Frame>
    );
  },
  parameters: {
    docs: { description: { story: "Cliquez un point : il est entouré, le reste s'atténue, la caméra s'y rend (`focusNode`). Cliquez la mer pour désélectionner ; « Recentrer » appelle `resetView`." } },
  },
};

export const Highlighted: Story = {
  name: "Flux mis en avant",
  args: { autoRotate: false, selectedNodeId: "par", highlightedFlowIds: ["par-nyc", "par-sgp"], initialView: { lon: 20, lat: 35 } },
  parameters: { docs: { description: { story: "Paris sélectionné, et deux de ses flux sortis de l'atténuation par `highlightedFlowIds` — les étapes d'un scénario qu'on rejoue." } } },
};

export const Decorative: Story = {
  name: "Décoratif",
  args: { interactive: false, labelMode: "none", quality: "medium", autoRotateSpeed: 2, countryHover: false },
  render: (args) => (
    <Frame height={300}>
      <InteractiveGlobe {...args} />
    </Frame>
  ),
  parameters: { docs: { description: { story: "Sans interaction ni étiquette, à budget moyen : le globe en fond d'un écran d'accueil." } } },
};
