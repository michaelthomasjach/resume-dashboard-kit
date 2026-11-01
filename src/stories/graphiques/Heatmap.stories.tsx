import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Heatmap, Text, type HeatmapGroup, type HeatmapTile } from "@michaelthomasjach/liseuse-dashboard-kit";
import { PORTEFEUILLE_SECTEURS } from "../../showcase/chartData";
import { CODE_LISIBLE, SOURCE_ABREGEE } from "./communs";

/** Le portefeuille, chaque secteur relié par un trait de couleur à sa courbe dans un graphique voisin. */
const SECTEURS_COLORES: HeatmapGroup[] = PORTEFEUILLE_SECTEURS.map((g, i) => ({
  ...g,
  color: ["var(--lq-color-violet)", "var(--lq-color-sky)", "var(--lq-color-green)", "var(--lq-color-amber)", "var(--lq-color-rose)", undefined][i],
}));

/** Saison de résultats : une société sur trois n'a pas encore publié (`colorValue: null`). */
const SAISON_RESULTATS: HeatmapGroup[] = PORTEFEUILLE_SECTEURS.map((g, gi) => ({
  ...g,
  tiles: g.tiles.map((t, ti) =>
    (gi + ti) % 3 === 0
      ? { ...t, colorValue: null, formattedValue: "à venir" }
      : { ...t, colorValue: (t.colorValue ?? 0) * 5, formattedValue: `${(t.colorValue ?? 0) >= 0 ? "+" : ""}${((t.colorValue ?? 0) * 5).toFixed(1).replace(".", ",")} % vs consensus` },
  ),
}));

/** Les mêmes tuiles, avec une bulle de survol composée par l'appelant. */
const AVEC_BULLES: HeatmapGroup[] = PORTEFEUILLE_SECTEURS.map((g) => ({
  ...g,
  tiles: g.tiles.map((t) => ({
    ...t,
    tooltip: (
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <strong>{t.details?.[0] ?? t.label}</strong>
        <span>{t.details?.[1]}</span>
        <span>Séance : {t.formattedValue}</span>
      </div>
    ),
  })),
}));

/**
 * La carte de chaleur en tuiles : un portefeuille par secteur, la surface pour le poids, la couleur
 * pour la variation.
 */
const meta = {
  title: "Charts/Heatmap",
  component: Heatmap,
  parameters: {
    ...CODE_LISIBLE,
    docs: {
      source: SOURCE_ABREGEE,
      description: {
        component: [
          "Une carte de chaleur en tuiles (*treemap* « squarifié ») : des tuiles regroupées par `HeatmapGroup` (un secteur), chacune dimensionnée par une mesure (`value` — un poids, une capitalisation) et colorée par une autre (`colorValue` — la variation du jour, une surprise de résultats). Sous le libellé, `formattedValue` (à défaut, `colorValue` à deux décimales) ; plus bas, les lignes de `details` dès que la tuile est assez grande **à l'écran**.",
          "",
          "**Quand l'utiliser** — deux mesures sur beaucoup d'éléments hiérarchisés : un portefeuille, un indice, des magasins par région. Pour une mesure par élément, un `BarChart` horizontal trié se lit plus juste ; pour une grille ligne × colonne (corrélations, scores), `MatrixChart`.",
          "",
          "**Anatomie** — un en-tête par groupe (son libellé, précédé d'un trait de `color` si le groupe en porte une, pour le relier à la même série dans un graphique voisin), puis ses tuiles. `colorDomain` ([−3, 3] par défaut, une échelle de variation en %) fixe la valeur qui atteint la couleur pleine — au-delà, la teinte plafonne. `colorValue: null` peint la tuile d'un gris neutre : « pas encore de mesure » ne doit pas se lire « légèrement positif ». `logoUrl` (ou `logoColor`) pose un disque au-dessus du libellé. Sans `width`, la carte **remplit la largeur de son conteneur** et la suit quand il change ; `width` la fixe en pixels. `height` est fixe (560 par défaut).",
          "",
          "**Interactions** — cliquer l'en-tête d'un groupe zoome sur lui seul, avec un fil d'Ariane pour revenir à « Tout » ; la molette zoome vers le pointeur, glisser déplace la vue. Survoler une tuile ouvre sa bulle (`tooltip`, un ReactNode libre, ou à défaut libellé et valeur). Cliquer une tuile ne zoome pas — elle n'a rien en dessous — mais la signale par `onTileClick` : à l'application de décider ce qu'« ouvrir une valeur » veut dire.",
          "",
          "**Thème** — la couleur d'une tuile mélange `--lq-color-up` ou `--lq-color-down` à `--lq-color-panel`, de 15 à 85 % selon l'intensité ; le gris neutre mêle `--lq-color-text-muted` au panneau. La couleur du texte de chaque tuile est calculée pour contraster avec son fond. En-têtes en `--lq-color-text` et `--lq-color-text-muted`, filets en `--lq-color-border`, angles en `--lq-radius-sm`. La fonction exportée `heatmapTileColor(colorValue, domain)` rend exactement la même teinte, pour colorer un tableau voisin.",
        ].join("\n"),
      },
    },
  },
  args: { groups: PORTEFEUILLE_SECTEURS, width: 900, height: 460 },
  argTypes: {
    groups: { control: false },
    colorDomain: { control: false },
    onTileClick: { control: false },
    width: { control: { type: "range", min: 360, max: 1200, step: 10 }, table: { defaultValue: { summary: "largeur du conteneur" } } },
    height: { control: { type: "range", min: 240, max: 800, step: 10 } },
  },
} satisfies Meta<typeof Heatmap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: {
    docs: {
      description: {
        story: "Un portefeuille d'actions européennes : la surface d'une tuile est son poids en k€, sa couleur la séance du jour. Cliquez « Luxe » pour zoomer sur le secteur.",
      },
    },
  },
};

export const FullWidth: Story = {
  name: "Pleine largeur",
  args: { width: undefined },
  parameters: {
    docs: {
      description: {
        story: "Sans `width`, `Heatmap` mesure son conteneur et en prend toute la largeur — redimensionnez la fenêtre : les tuiles se recomposent.",
      },
    },
  },
};

export const ColorDomain: Story = {
  name: "Échelle de couleur resserrée",
  args: { colorDomain: [-1, 1] },
  parameters: {
    docs: {
      description: {
        story: "`colorDomain={[-1, 1]}` : la couleur pleine est atteinte dès ±1 %, et une séance calme paraît plus contrastée. L'échelle se règle sur la dispersion réelle de `colorValue`.",
      },
    },
  },
};

export const PendingValues: Story = {
  name: "Valeurs en attente",
  args: { groups: SAISON_RESULTATS, colorDomain: [-8, 8] },
  parameters: {
    docs: {
      description: {
        story: "En saison de résultats, tant qu'une société n'a pas publié, `colorValue: null` la garde en gris neutre ; les autres se colorent selon leur surprise face au consensus.",
      },
    },
  },
};

export const GroupColors: Story = {
  name: "Groupes repérés par couleur",
  args: { groups: SECTEURS_COLORES },
  parameters: {
    docs: {
      description: {
        story: "`HeatmapGroup.color` trace un trait avant le nom du secteur — pour le relier à sa courbe dans un `LineAreaChart` voisin. Toujours par variable du thème.",
      },
    },
  },
};

export const CustomTooltip: Story = {
  name: "Bulle composée",
  args: { groups: AVEC_BULLES },
  parameters: {
    docs: {
      description: {
        story: "`HeatmapTile.tooltip` est rendu tel quel dans la bulle de survol : nom complet, ligne de portefeuille, variation.",
      },
    },
  },
};

export const TileClick: Story = {
  name: "Clic sur une tuile",
  render: function Render(args) {
    const [tuile, setTuile] = useState<HeatmapTile | null>(null);
    const ouvrirLaValeur = (t: HeatmapTile) => {
      setTuile(t);
      args.onTileClick?.(t);
    };
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Heatmap {...args} onTileClick={ouvrirLaValeur} />
        <Text size="sm" muted>
          {tuile ? `onTileClick : ${tuile.details?.[0] ?? tuile.label} (${tuile.formattedValue})` : "Cliquez une tuile : onTileClick la reçoit."}
        </Text>
      </div>
    );
  },
  args: { onTileClick: fn(), height: 400 },
  parameters: {
    docs: {
      description: {
        story: "Un clic sur une tuile ne change pas la vue : `onTileClick` la remonte à l'application, qui l'ouvre où elle veut — dans un graphique de cours, une fiche valeur.",
      },
    },
  },
};

export const Compact: Story = {
  name: "Compact",
  args: { width: 560, height: 320 },
  parameters: {
    docs: {
      description: {
        story: "À petite taille, les tuiles étroites ne gardent que leur libellé ; les détails reviennent en zoomant sur un secteur.",
      },
    },
  },
};
