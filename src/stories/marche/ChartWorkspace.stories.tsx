import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { AlertsPanel, CandlestickChart, ChartWorkspace, type ChartAlert } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ALERTES_NOVA, BOUGIES_KAPA, BOUGIES_NOVA, LISTES_SURVEILLANCE } from "../../showcase/chartData";
import { CODE_LISIBLE, SOURCE_ABREGEE, assistantDeDemo, dateCourte, euros } from "../graphiques/communs";

/** Les deux titres de démonstration, configurés une fois : chaque panneau en reçoit sa propre instance. */
const NOVA = (
  <CandlestickChart
    key="nova"
    data={BOUGIES_NOVA}
    symbol="NOVA"
    zoomable
    showVolume
    drawingTools
    showIndicators
    initialVisibleCandles={120}
    formatPrice={euros}
    formatDate={dateCourte}
  />
);
const KAPA = (
  <CandlestickChart
    key="kapa"
    data={BOUGIES_KAPA}
    symbol="KAPA"
    zoomable
    showVolume
    drawingTools
    showIndicators
    initialVisibleCandles={120}
    formatPrice={euros}
    formatDate={dateCourte}
  />
);

/**
 * L'espace de travail de marché : plusieurs graphiques de cours, liés, avec liste de surveillance,
 * alertes, éditeur de scripts et assistant.
 */
const meta = {
  title: "Charts/ChartWorkspace",
  component: ChartWorkspace,
  parameters: {
    ...CODE_LISIBLE,
    docs: {
      source: SOURCE_ABREGEE,
      description: {
        component: [
          "Une grille de `CandlestickChart` — 1, 2, 4, 6 ou 8 panneaux — et tout ce qui se partage entre eux : la synchronisation du réticule, une liste de surveillance, un onglet d'alertes, un éditeur de scripts, un assistant, la connexion à un courtier. C'est l'écran d'une plateforme de marché, prêt à monter.",
          "",
          "**Quand l'utiliser** — comme contenu principal d'une page d'analyse de marché, ou pour comparer plusieurs titres côte à côte. Pour un seul graphique dans une page, `CandlestickChart` seul suffit.",
          "",
          "**Composer, pas configurer** — `children` est **un** `<CandlestickChart>` réglé une fois (données, outils, formats) : chaque panneau en reçoit sa propre instance complète, avec ses tracés, ses indicateurs et son zoom. Pour des titres différents par panneau, passez un tableau, un graphique par panneau dans l'ordre. `defaultPanels` (1 par défaut) fixe le nombre de départ ; l'utilisateur le change ensuite depuis le rail de droite (« Écran divisé »), ce que rapporte `onPanelsChange`. `panelHeight` impose une hauteur à chaque panneau ; sans lui, la grille remplit la hauteur de la fenêtre — toujours le cas à partir de deux rangées (4, 6, 8 panneaux). **Sous 1 500 px de largeur de fenêtre**, avec `layout=\"auto\"`, la disposition tactile s'engage : les panneaux s'empilent en une seule colonne, chaque graphique passe à sa barre d'outils en bas et l'assistant s'ouvre en feuille plein écran. `layout=\"desktop\"` garde la disposition bureau quelle que soit la fenêtre — colonnes, rail d'outils à gauche, assistant ancré — et la transmet à chaque panneau (un `layout` posé sur le `CandlestickChart` modèle l'emporte).",
          "",
          "**Lier des panneaux** — le bouton chaîne de chaque en-tête ouvre « Graphiques liés » : les panneaux d'un même groupe partagent le réticule, chacun traduit dans sa propre échelle (la séance la plus proche par date, le même prix reprojeté), si bien que des titres, des zooms ou des périodes différents restent alignés. `defaultLinkGroups` pose des groupes au départ (des indices de panneaux), `onLinkGroupsChange` rapporte les changements.",
          "",
          "**Le rail de droite** — ses boutons ouvrent un panneau ancré, redimensionnable et repliable (`defaultSidePanelOpen`, `defaultSidePanelTab`) : la liste de surveillance (`watchlists` — des listes nommées, des colonnes optionnelles triables, des sections ; les gestes d'édition `onAddWatchlistSymbol`, `onRemoveWatchlistSymbol`, `onMoveWatchlistRow`… ne s'affichent que si leur callback est fourni, l'application gardant la main sur les données), les alertes (`alerts`, un ReactNode — en général un `AlertsPanel`), l'éditeur de scripts partagé par tous les panneaux (`scripting`), l'assistant (`ai`) et les courtiers (`brokers`). `layout` force la disposition bureau ou mobile quand la largeur de la fenêtre ne dit rien de celle du cadre. La visite guidée (au premier passage, puis par le bouton « Aide ») ne cherche ses cibles que dans son propre espace de travail.",
          "",
          "**L'assistant** — `ai` lui donne **un** moyen de joindre un modèle : `send`, une fonction qui relaie la conversation vers une route de votre serveur (celui qui garde la clé — le seul choix pour une page publique), ou `apiKey` pour un usage local. Les stories utilisent un `send` qui répond une phrase fixe, sans réseau.",
          "",
          "**Interactions** — celles de chaque `CandlestickChart` ; en plus, le plein écran d'un panneau (un seul à la fois), le clic sur une ligne de la liste (l'espace de travail renomme le panneau visé et appelle `onWatchlistRowClick`, à l'application d'en fournir les bougies), le tri par colonne, le glisser des lignes et des sections.",
          "",
          "**Thème** — la grille et ses séparations en `--lq-color-border-subtle`, panneaux et rail sur `--lq-color-panel` et `--lq-color-bg`, survols `--lq-color-hover`, sélection `--lq-color-accent` ; chaque graphique suit les variables de `CandlestickChart`.",
        ].join("\n"),
      },
    },
  },
  // Les props « default… » ne s'appliquent qu'au montage : la clé fait remonter l'espace de travail
  // quand un contrôle les change.
  render: (args) => (
    <ChartWorkspace key={[args.defaultPanels, args.layout, args.defaultSidePanelOpen, args.defaultSidePanelTab].join("|")} {...args} />
  ),
  args: {
    children: NOVA,
    defaultPanels: 1,
    panelHeight: 460,
    layout: "desktop",
    watchlists: LISTES_SURVEILLANCE,
    onPanelsChange: fn(),
    onLinkGroupsChange: fn(),
    onWatchlistRowClick: fn(),
    onActiveWatchlistChange: fn(),
    onSidePanelOpenChange: fn(),
    onSidePanelTabChange: fn(),
  },
  argTypes: Object.fromEntries(
    [
      "children", "watchlists", "alerts", "ai", "brokers", "defaultScripts", "defaultLinkGroups", "defaultVisibleColumnIds",
      "watchlistSymbolSearchResults", "watchlistEarnings", "watchlistDividends", "watchlistNews", "symbolProfiles",
    ].map((p) => [p, { control: false }]),
  ),
} satisfies Meta<typeof ChartWorkspace>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: {
    docs: {
      description: {
        story: "Un panneau ; la liste de surveillance s'ouvre depuis le premier bouton du rail de droite (défaut du kit constaté : malgré `defaultSidePanelOpen` à `true` par défaut, le panneau démarre fermé). Le rail de droite change le nombre de panneaux (« Écran divisé ») et replie le panneau latéral ; un clic sur une ligne de la liste appelle `onWatchlistRowClick`.",
      },
    },
  },
};

export const TwoLinkedPanels: Story = {
  name: "Deux titres liés",
  args: { defaultPanels: 2, children: [NOVA, KAPA], defaultLinkGroups: [[0, 1]] },
  parameters: {
    docs: {
      description: {
        story: "Un tableau d'enfants : NOVA puis KAPA — côte à côte au-delà de 1 500 px de fenêtre, l'un sous l'autre en deçà. `defaultLinkGroups={[[0, 1]]}` les lie d'emblée : survolez l'un, le réticule suit la même séance sur l'autre.",
      },
    },
  },
};

export const SameTemplate: Story = {
  name: "Quatre panneaux, un modèle",
  args: { defaultPanels: 4, defaultSidePanelOpen: false },
  parameters: {
    docs: {
      description: {
        story: "Un seul enfant et `defaultPanels={4}` : chaque panneau reçoit sa propre instance du même graphique, outils compris — chacun peut ensuite changer de titre, de zoom ou d'indicateurs. Sur deux rangées, la grille remplit la hauteur de la fenêtre, `panelHeight` ne s'applique plus.",
      },
    },
  },
};

export const AlertsTab: Story = {
  name: "Onglet des alertes",
  render: function Render(args) {
    const [alertes, setAlertes] = useState<ChartAlert[]>(ALERTES_NOVA);
    const supprimer = (id: string) => setAlertes((l) => l.filter((x) => x.id !== id));
    return (
      <ChartWorkspace
        {...args}
        alerts={<AlertsPanel alerts={alertes} onDeleteAlert={supprimer} emptyMessage="Plus aucune alerte." />}
      />
    );
  },
  args: { defaultSidePanelTab: "alerts" },
  parameters: {
    docs: {
      description: {
        story: "`alerts` ajoute au rail l'onglet « Alertes », ouvert ici d'emblée (`defaultSidePanelTab=\"alerts\"`). Son contenu est libre : un `AlertsPanel` sur la liste que tient l'application.",
      },
    },
  },
};

export const Scripting: Story = {
  name: "Éditeur de scripts",
  args: { scripting: true, onScriptsChange: fn() },
  parameters: {
    docs: {
      description: {
        story: "`scripting` ajoute au rail le bouton « </> » : un éditeur et une liste de scripts **partagés** par tous les panneaux, chaque script visant le panneau qu'on lui choisit. Ses indicateurs et stratégies s'ajoutent au graphique visé ; `onScriptsChange` rapporte la liste.",
      },
    },
  },
};

export const Assistant: Story = {
  name: "Assistant",
  args: { ai: { send: assistantDeDemo } },
  parameters: {
    docs: {
      description: {
        story: "`ai={{ send }}` ajoute l'assistant au rail ; son panneau s'ancre à côté du panneau au premier plan. Posez-lui une question : le `send` de démonstration répond mot à mot une phrase fixe, sans réseau ni clé.",
      },
    },
  },
};

export const SidePanelClosed: Story = {
  name: "Panneau latéral replié",
  args: { defaultSidePanelOpen: false },
  parameters: {
    docs: {
      description: {
        story: "`defaultSidePanelOpen={false}` rend toute la largeur aux graphiques ; l'icône de la liste, sur le rail, rouvre le panneau.",
      },
    },
  },
};

export const Mobile: Story = {
  name: "Disposition mobile",
  args: { layout: "mobile", panelHeight: 520 },
  render: (args) => (
    <div style={{ maxWidth: 390 }}>
      <ChartWorkspace key="mobile" {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "`layout=\"mobile\"` impose la disposition téléphone — barre d'outils en bas, réglages par bouton plutôt que par double-clic — dans un cadre étroit que la largeur de la fenêtre ne révélerait pas. En usage réel, laissez `\"auto\"`.",
      },
    },
  },
};

export const Complete: Story = {
  name: "Tout ensemble",
  render: function Render(args) {
    const [alertes, setAlertes] = useState<ChartAlert[]>(ALERTES_NOVA);
    const supprimer = (id: string) => setAlertes((l) => l.filter((x) => x.id !== id));
    return (
      <ChartWorkspace
        {...args}
        alerts={<AlertsPanel alerts={alertes} onDeleteAlert={supprimer} />}
      />
    );
  },
  args: { defaultPanels: 2, children: [NOVA, KAPA], scripting: true, ai: { send: assistantDeDemo } },
  parameters: {
    docs: {
      description: {
        story: "La configuration de la vitrine : deux panneaux, liste de surveillance, alertes, éditeur de scripts et assistant sur le rail.",
      },
    },
  },
};
