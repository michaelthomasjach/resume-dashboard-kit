import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button, Text, TileMap, type TileMapMarker } from "@michaelthomasjach/liseuse-dashboard-kit";
import { MAP_HUBS, MAP_ROUTES } from "../../showcase/widgetData";

const AGENCIES: TileMapMarker[] = [
  { id: "par", lon: 2.35, lat: 48.86, label: "Paris" },
  { id: "lil", lon: 3.06, lat: 50.63, label: "Lille" },
  { id: "str", lon: 7.75, lat: 48.58, label: "Strasbourg" },
  { id: "lyo", lon: 4.84, lat: 45.76, label: "Lyon" },
  { id: "bdx", lon: -0.58, lat: 44.84, label: "Bordeaux" },
  // Une couleur de donnée (l'agence est fermée), donc littérale : la carte est un canevas, qui ne
  // résout pas les `var(--lq-…)`.
  { id: "mrs", lon: 5.37, lat: 43.3, label: "Marseille (fermée)", color: "#e5484d" },
];

const FRAME = { border: "1px solid var(--lq-color-border-subtle)", borderRadius: "var(--lq-radius-md)", overflow: "hidden" } as const;

/**
 * Une carte à tuiles : on la fait glisser, on la zoome, on y pose des repères et des itinéraires.
 * Le fond vient d'OpenStreetMap ; tracés et repères sont dessinés par-dessus, aux couleurs du thème.
 */
const meta = {
  title: "Map/Tile Map",
  component: TileMap,
  parameters: {
    docs: {
      description: {
        component: [
          "Une **carte à tuiles** navigable — glisser pour se déplacer, molette ou boutons pour zoomer — avec des **repères** (`markers`) et des **itinéraires** (`routes`) dessinés par-dessus le fond.",
          "",
          "**Quand l'utiliser** — pour situer des lieux à l'échelle d'un pays ou d'une ville, et montrer un trajet et ses variantes. Pour des flux entre continents, `InteractiveGlobe`. Ce n'est pas une bibliothèque cartographique : pas de style vectoriel, pas de rotation, pas de couches GeoJSON, pas de géocodage. Quand il en faut plus, une vraie bibliothèque de carte est la bonne réponse.",
          "",
          "**Itinéraires** — chaque route est une liste de points (`path`), dessinée telle quelle, sans lissage, avec une étiquette (`label`, une durée ; `via`, la distance et la route). La route choisie (`selectedRouteId`) passe **au-dessus**, à la couleur de l'accent ; les autres sont des variantes, plus fines, atténuées, dessous. Chaque tracé a un liseré de la couleur de la surface : sans lui, une ligne colorée disparaît là où elle croise une teinte voisine du fond. `onRouteSelect` part d'un clic sur une ligne ou son étiquette.",
          "",
          "**Repères** — `lon`, `lat`, `label` et `color` ; `onMarkerClick` au clic. `color`, comme celle d'un itinéraire, accepte toute couleur CSS, `var(--lq-…)` compris : la carte la résout contre la page avant de la passer au canevas. Sans `color`, repères et itinéraire choisi prennent l'accent du thème. Les étiquettes sont écrites dans la police du thème.",
          "",
          "**Caméra** — `center` et `zoom` ne servent qu'au départ : la carte tient ensuite sa caméra elle-même, et `onViewChange` la signale après chaque déplacement. `minZoom` et `maxZoom` la bornent.",
          "",
          "**Taille** — `width` et `height` en pixels ; omis, la carte **mesure son conteneur** et le remplit, en suivant ses changements — ce qui demande que le parent ait une taille propre.",
          "",
          "**Fond** — par défaut les tuiles d'openstreetmap.org, sans clé, très bien pour le développement et les faibles volumes ; leur politique d'usage interdit l'usage intensif ou commercial : en production, passez votre propre `tileUrl` (`{z}`, `{x}`, `{y}`, `{s}`). La mention de source (`attribution`) est affichée par le composant et ne peut pas être vidée : les données OSM sont sous ODbL. `tileFilter` remplace le filtre CSS que la palette choisirait pour les tuiles ; tracés et repères ne sont jamais filtrés. La palette e-ink passe le fond en niveaux de gris ; **en surface sombre**, il est inversé en carte sombre (filtre `--lq-tilemap-dark-filter` s'il est posé, sinon `invert(1) hue-rotate(180deg) brightness(0.92) contrast(0.88) saturate(0.6)`) — pour un vrai style sombre, passez son `tileUrl` et `tileFilter=\"none\"`.",
          "",
          "**Thème** — le canevas lit les variables au moment de dessiner, et suit donc la surface claire ou sombre : `--lq-color-accent` (route choisie, son étiquette, repères sans `color`), `--lq-font-family` (étiquettes, par la police héritée), `--lq-color-text-muted` (variantes), `--lq-color-panel` (liseré des tracés, étiquettes, boutons de zoom), `--lq-color-accent-contrast`, `--lq-color-text`, `--lq-color-bg`, `--lq-color-border`, `--lq-space-2`.",
        ].join("\n"),
      },
    },
  },
  args: {
    center: { lon: 3.6, lat: 47.3 },
    zoom: 6.4,
    height: 420,
    routes: MAP_ROUTES,
    selectedRouteId: MAP_ROUTES[0].id,
    markers: MAP_HUBS,
    ariaLabel: "Itinéraires de Paris à Lyon",
    onRouteSelect: fn(),
    onMarkerClick: fn(),
  },
  argTypes: {
    center: { control: false },
    routes: { control: false },
    markers: { control: false },
    subdomains: { control: false },
    selectedRouteId: { control: "select", options: MAP_ROUTES.map((r) => r.id) },
    zoom: { control: { type: "range", min: 2, max: 12, step: 0.1 } },
    onRouteSelect: { control: false },
    onMarkerClick: { control: false },
    onViewChange: { control: false },
  },
  // La story tient l'itinéraire choisi : la liste à gauche et un clic sur la carte le changent.
  render: function Render(args) {
    const [route, setRoute] = useState(args.selectedRouteId);
    useEffect(() => setRoute(args.selectedRouteId), [args.selectedRouteId]);
    return (
      <div style={{ ...FRAME, display: "grid", gridTemplateColumns: "260px minmax(0, 1fr)" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--lq-space-2)",
            padding: "var(--lq-space-3)",
            borderRight: "1px solid var(--lq-color-border-subtle)",
            background: "var(--lq-color-panel)",
          }}
        >
          <Text size="sm" muted>
            Paris → Lyon
          </Text>
          {(args.routes ?? []).map((r) => (
            <Button key={r.id} block selected={r.id === route} onClick={() => setRoute(r.id)}>
              {r.label} · {r.via}
            </Button>
          ))}
        </div>
        <TileMap
          {...args}
          selectedRouteId={route}
          onRouteSelect={(r) => {
            setRoute(r.id);
            args.onRouteSelect?.(r);
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof TileMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Trois itinéraires de Paris à Lyon : la liste et la carte partagent la même sélection." } } },
};

export const Markers: Story = {
  name: "Repères",
  args: { center: { lon: 2.6, lat: 46.6 }, zoom: 5.4, routes: undefined, markers: AGENCIES, ariaLabel: "Agences" },
  render: function Render(args) {
    const [picked, setPicked] = useState<TileMapMarker | null>(null);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={FRAME}>
          <TileMap
            {...args}
            onMarkerClick={(m) => {
              setPicked(m);
              args.onMarkerClick?.(m);
            }}
          />
        </div>
        <Text size="sm" muted>
          {picked ? `Agence sélectionnée : ${picked.label}` : "Cliquez un repère."}
        </Text>
      </div>
    );
  },
  parameters: { docs: { description: { story: "Six agences ; Marseille, fermée, porte sa propre couleur (`color`, littérale). Les autres gardent le bleu par défaut du kit." } } },
};

export const Plain: Story = {
  name: "Carte seule",
  args: { center: { lon: 2.35, lat: 48.86 }, zoom: 11, routes: undefined, markers: undefined, ariaLabel: "Paris", height: 360 },
  render: (args) => (
    <div style={FRAME}>
      <TileMap {...args} />
    </div>
  ),
  parameters: { docs: { description: { story: "Ni repère ni tracé : la carte navigable, centrée sur Paris." } } },
};

export const Filtered: Story = {
  name: "Fond atténué",
  args: { tileFilter: "grayscale(1) contrast(0.9) brightness(1.05)" },
  parameters: { docs: { description: { story: "`tileFilter` passe le fond en gris ; les tracés gardent leurs couleurs, ils ne sont jamais filtrés." } } },
};
