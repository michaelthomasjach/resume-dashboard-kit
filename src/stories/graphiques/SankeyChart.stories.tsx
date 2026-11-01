import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Card, SankeyChart, type SankeyLinkDatum, type SankeyNodeDatum } from "@michaelthomasjach/liseuse-dashboard-kit";
import { BUDGET_LINKS, BUDGET_NODES } from "../../showcase/chartData";
import { CODE_LISIBLE, SOURCE_ABREGEE, kEuros } from "./communs";

/** Les deux premiers niveaux seulement : des produits jusqu'aux grands postes. Trois colonnes. */
const POSTES = new Set(["abonnements", "licences", "services", "formation", "autres", "produits", "cdv", "personnel", "marketing", "locaux", "amort", "impots", "net"]);
const COMPTE_NODES: SankeyNodeDatum[] = BUDGET_NODES.filter((n) => POSTES.has(n.id));
const COMPTE_LINKS: SankeyLinkDatum[] = BUDGET_LINKS.filter((l) => POSTES.has(l.source) && POSTES.has(l.target));

/** Le même compte, le résultat en vert et le coût des ventes en ambre — rubans compris. */
const COMPTE_NODES_COLORES: SankeyNodeDatum[] = COMPTE_NODES.map((n) =>
  n.id === "net" ? { ...n, color: "var(--lq-color-green)" } : n.id === "cdv" ? { ...n, color: "var(--lq-color-amber)" } : n,
);
const COMPTE_LINKS_COLORES: SankeyLinkDatum[] = COMPTE_LINKS.map((l) =>
  l.target === "net" ? { ...l, color: "var(--lq-color-green)" } : l.target === "cdv" ? { ...l, color: "var(--lq-color-amber)" } : l,
);

/**
 * Le diagramme de flux : d'où vient une quantité, et où elle va.
 */
const meta = {
  title: "Charts/SankeyChart",
  component: SankeyChart,
  parameters: {
    ...CODE_LISIBLE,
    docs: {
      source: SOURCE_ABREGEE,
      description: {
        component: [
          "Un diagramme de Sankey : des nœuds (`SankeyNodeDatum` : `id`, `label`) rangés en colonnes, reliés par des rubans (`SankeyLinkDatum` : `source`, `target`, `value`) dont l'épaisseur **est** la quantité. Le placement est celui du kit, pas celui de `d3-sankey`.",
          "",
          "**Quand l'utiliser** — suivre une quantité qui se répartit puis se recompose : un budget des produits jusqu'à leur emploi, un compte de résultat, des flux de clients entre étapes. Pour une décomposition en une seule étape, `DonutChart` ; pour un passage d'un total à un autre, `DeltaChart`. Chaque niveau doit s'équilibrer : ce qui entre dans un nœud en ressort.",
          "",
          "**Anatomie et variantes** — `align=\"justify\"` (défaut) aligne tous les nœuds terminaux sur le bord droit, ce que veut un budget ; `\"left\"` laisse chaque nœud dans la colonne que lui donne son plus long chemin. `nodeWidth` (12 px) et `nodePadding` (14 px, un plafond que la mise en page réduit quand une colonne est très peuplée) règlent les barres. `formatValue` met en forme les montants. Un nœud peut imposer sa `color`, que ses rubans sortants héritent ; un ruban peut imposer la sienne. Toute la largeur du conteneur ; 420 px de haut par défaut. Tant que le bouton plein écran est affiché, la marge haute par défaut lui laisse sa rangée (40 px) : il ne se pose plus sur le libellé du premier nœud de droite. Un `margin` passé explicitement remplace ces marges.",
          "",
          "**Interactions** — la molette ajoute du **détail**, pas seulement de la taille : les libellés apparaissent quand leur nœud devient assez haut, puis gagnent leur montant, puis leur part de ce qui les alimente — le texte reste à sa taille. Cliquer un nœud cadre sa branche : tout ce qui en descend est mis en valeur, le reste s'estompe, et le fil des clics reste dans la barre d'outils pour remonter ; recliquer le nœud courant remonte d'un cran, un double-clic sur le fond réinitialise. `onNodeClick` s'ajoute à ce comportement sans le remplacer. Survoler un ruban donne sa valeur et sa part du nœud qu'il quitte. `zoomable={false}` fige tout ; `scaleExtent` ([1, 14]) borne le zoom ; bouton plein écran, Échap pour sortir.",
          "",
          "**Thème** — nœuds sur la palette `--lq-color-accent`, `--lq-color-green`, `--lq-color-amber`, `--lq-color-sky`, `--lq-color-rose`, `--lq-color-violet` ; rubans à l'opacité de `--lq-sankey-ribbon-opacity` (`--lq-sankey-ribbon-hover-opacity` au survol, `--lq-sankey-dim-opacity` hors de la branche cadrée) ; libellés en `--lq-sankey-label-color`, `--lq-color-text` et `--lq-color-text-muted` ; barre d'outils sur `--lq-color-panel`, `--lq-radius-sm`.",
        ].join("\n"),
      },
    },
  },
  args: { nodes: BUDGET_NODES, links: BUDGET_LINKS, height: 460, formatValue: kEuros },
  argTypes: {
    nodes: { control: false },
    links: { control: false },
    formatValue: { control: false },
    scaleExtent: { control: false },
    margin: { control: false },
    onNodeClick: { control: false },
  },
} satisfies Meta<typeof SankeyChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: {
    docs: {
      description: {
        story: "Le budget de l'exercice, des produits jusqu'à leur emploi. Zoomez à la molette : les libellés des petits postes apparaissent. Cliquez « Personnel » pour cadrer sa branche.",
      },
    },
  },
};

export const AlignLeft: Story = {
  name: "Alignement à gauche",
  args: { align: "left" },
  parameters: {
    docs: {
      description: {
        story: "`align=\"left\"` : chaque nœud reste dans la colonne de son plus long chemin. Le résultat net et ses deux emplois ne sont plus repoussés au bord droit.",
      },
    },
  },
};

export const ThreeColumns: Story = {
  name: "Trois colonnes",
  args: { nodes: COMPTE_NODES, links: COMPTE_LINKS, height: 360, nodeWidth: 16, nodePadding: 20 },
  parameters: {
    docs: {
      description: {
        story: "Un compte de résultat condensé : produits, total, grands postes. Avec peu de nœuds, des barres plus larges (`nodeWidth`) et plus espacées (`nodePadding`) se lisent mieux.",
      },
    },
  },
};

export const CustomColors: Story = {
  name: "Couleurs imposées",
  args: { nodes: COMPTE_NODES_COLORES, links: COMPTE_LINKS_COLORES, height: 360 },
  parameters: {
    docs: {
      description: {
        story: "`SankeyNodeDatum.color` et `SankeyLinkDatum.color` distinguent un poste : le résultat en vert, le coût des ventes en ambre — toujours par variable du thème.",
      },
    },
  },
};

export const NodeClick: Story = {
  name: "Clic sur un nœud",
  args: { onNodeClick: fn() },
  parameters: {
    docs: {
      description: {
        story: "`onNodeClick` est appelé en plus du cadrage de la branche — pour synchroniser un tableau voisin, par exemple. Voyez l'onglet Actions.",
      },
    },
  },
};

export const Static: Story = {
  name: "Figé",
  args: { nodes: COMPTE_NODES, links: COMPTE_LINKS, height: 340, zoomable: false, fullscreenToggle: false },
  parameters: { docs: { description: { story: "`zoomable={false}` : ni molette ni cadrage, pour un diagramme qui tient d'un coup d'œil." } } },
};

export const Embedded: Story = {
  name: "Dans une carte",
  render: (args) => (
    <Card title="Où part le chiffre d'affaires" meta="EXERCICE 2026">
      <SankeyChart {...args} />
    </Card>
  ),
  args: { nodes: COMPTE_NODES, links: COMPTE_LINKS, height: 340, embedded: true },
  parameters: { docs: { description: { story: "Dans une `Card`. `embedded` est prévu pour un conteneur qui a déjà son cadre. Dans la version actuelle du kit, les graphiques ne dessinent plus de cadre propre (`.lq-chart` est sans bordure ni fond) : la prop n'a donc plus d'effet visible, sa JSDoc est en retard sur le CSS. Elle reste sans risque et dit l'intention." } } },
};
