import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  SkillTree,
  Badge,
  Button,
  Text,
  BarChartIcon,
  SettingsIcon,
  UserIcon,
  type SkillTreeBranch,
  type SkillTreeNode,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { SKILLS } from "../../showcase/widgetData";

type Base = Omit<SkillTreeNode, "state">;

/** Les couleurs de branche passent en variable CSS dans le kit : un jeton du thème y est accepté tel quel. */
const BRANCHES: SkillTreeBranch[] = [
  { id: "support", label: "Support", icon: <UserIcon size={16} />, color: "var(--lq-color-accent)", angle: -50 },
  { id: "finance", label: "Finance", icon: <BarChartIcon size={16} />, color: "var(--lq-color-green)", angle: 0 },
  { id: "technique", label: "Technique", icon: <SettingsIcon size={16} />, color: "var(--lq-color-amber)", angle: 50 },
];

/** Les états, dits en français dans le détail de l'application. */
const STATE_LABEL: Record<SkillTreeNode["state"], string> = {
  locked: "verrouillé",
  available: "disponible",
  researching: "en cours",
  unlocked: "acquis",
  closed: "écarté",
};

const BASE: Base[] = SKILLS.map((n) => ({ ...n, requires: "requires" in n ? [...n.requires] : undefined }));

/** Pour la disposition en arbre : un tronc — l'intégration, puis un premier choix exclusif — d'où partent les trois branches. */
const TREE_BASE: Base[] = [
  { id: "int", label: "Intégration", branch: "tronc", trunk: true, tier: 0, points: 1, effect: "Un compte et un parrain", description: "La première semaine : outils, équipe, premiers clients." },
  { id: "gen", label: "Parcours polyvalent", branch: "tronc", trunk: true, tier: 1, points: 1, requires: ["int"], exclusiveGroup: "parcours", effect: "Un peu de tout" },
  { id: "spe", label: "Parcours expert", branch: "tronc", trunk: true, tier: 1, points: 1, requires: ["int"], exclusiveGroup: "parcours", effect: "Une seule branche, plus loin" },
  ...BASE.map((n) => (n.tier === 0 ? { ...n, requires: ["int"] } : n)),
];

/**
 * L'état de chaque nœud, déduit de ce qui est acquis : un choix exclusif pris ferme ses voisins,
 * un nœud dont tous les prérequis sont acquis devient disponible.
 */
function statesOf(base: Base[], owned: string[], researching: string | null): SkillTreeNode[] {
  const closed = new Set(
    base
      .filter((n) => n.exclusiveGroup && !owned.includes(n.id) && base.some((m) => m.exclusiveGroup === n.exclusiveGroup && owned.includes(m.id)))
      .map((n) => n.id)
  );
  return base.map((n) => ({
    ...n,
    state: owned.includes(n.id)
      ? "unlocked"
      : closed.has(n.id)
        ? "closed"
        : n.id === researching
          ? "researching"
          : (n.requires ?? []).every((r) => owned.includes(r))
            ? "available"
            : "locked",
    progress: n.id === researching ? 0.6 : undefined,
  }));
}

/** Un arbre vivant : des points à dépenser, des nœuds qu'on débloque. */
function useSkillGame(base: Base[], initialOwned: string[], initialPoints: number, researching: string | null) {
  const [owned, setOwned] = useState(initialOwned);
  const [points, setPoints] = useState(initialPoints);
  const nodes = useMemo(() => statesOf(base, owned, owned.includes(researching ?? "") ? null : researching), [base, owned, researching]);
  const unlock = (id: string) => {
    setPoints((p) => p - (base.find((n) => n.id === id)?.points ?? 0));
    setOwned((o) => [...o, id]);
  };
  const reset = () => {
    setOwned(initialOwned);
    setPoints(initialPoints);
  };
  return { nodes, points, unlock, reset };
}

/**
 * L'arbre de compétences : des branches, des nœuds par rang, des points à dépenser. Ici, le
 * programme de montée en compétence d'une équipe support.
 */
const meta = {
  title: "Widgets/SkillTree",
  component: SkillTree,
  parameters: {
    docs: {
      description: {
        component: [
          "Un **arbre de compétences** : des **branches** côte à côte, des **nœuds** posés par rang, des liens de prérequis entre eux. Il vient d'un jeu de gestion, mais il sert tout aussi bien un parcours de formation, un plan de montée en charge, une feuille de route à étapes.",
          "",
          "**Quand l'utiliser** — quand des étapes se débloquent les unes les autres et que le chemin compte autant que l'étape. Pour une suite linéaire d'étapes, `Stepper` ou `ObjectiveTracker` ; pour une hiérarchie qu'on déplie, `TreeView`.",
          "",
          "**Données** — chaque nœud (`SkillTreeNode`) porte `id`, `label`, `branch` (l'`id` d'une entrée de `branches`), `tier` (son rang à partir de 0) et `state`, puis au besoin `requires` (prérequis, de sa branche ou d'une autre — un lien qui croise deux branches se dessine en pointillé), `points` (pastille « 2 pts »), `effect`, `description`, `progress`, `icon`, `exclusiveGroup`, `trunk`. Une branche (`SkillTreeBranch`) a un `label`, une `icon` et une `color` — un jeton du thème comme `var(--lq-color-green)` convient.",
          "",
          "**États** — `locked` (prérequis manquants), `available` (son bord bat doucement : c'est là que l'œil doit aller), `researching` (une jauge dit où il en est, `progress` de 0 à 1), `unlocked` (plein, coché), `closed` (un choix écarté d'un carrefour exclusif). **C'est l'application qui calcule les états** : l'arbre les dessine, il ne déduit rien.",
          "",
          "**Sélection et déblocage** — cliquer un nœud le sélectionne et montre son détail : celui de l'application (`renderDetail`) ou, par défaut, sa description et un bouton « Débloquer (n pts) » si le nœud est disponible et que `onUnlock` est fourni ; `canUnlock` grise ce bouton (pas assez de points). `selectedId` rend la sélection contrôlée ; sans lui, l'arbre retient le dernier nœud cliqué. `header` se pose au-dessus des colonnes (« Points disponibles : 5 »).",
          "",
          "**Dispositions** — `layout=\"columns\"` (défaut) : une colonne par branche, un rang par ligne. `layout=\"tree\"` : un vrai arbre — un tronc pour les nœuds `trunk`, des branches qui partent en éventail (`angle` de −80° à +80°), les prérequis croisés en lianes, et un « ou » entre les nœuds d'un même `exclusiveGroup`.",
          "",
          "**Cadre étroit** — sous 640 px de large (la largeur du composant, pas de l'écran), le cadre défile dans les deux sens et trois boutons de zoom apparaissent ; `zoomControls` les force (`true`) ou les retire (`false`). Au clavier, les nœuds sont des boutons atteints par Tab, et `+`, `-`, `0` zooment.",
          "",
          "**Thème** — la couleur de chaque branche (`--lq-color-accent` pour une branche qui n'en donne pas), `--lq-color-accent-contrast` (coches), `--lq-color-panel`, `--lq-color-border`, `--lq-color-border-subtle`, `--lq-color-text`, `--lq-color-text-muted`, `--lq-color-fill-track` (jauge de recherche), `--lq-radius-sm`, `--lq-radius-md`, `--lq-space-1` à `--lq-space-5`.",
        ].join("\n"),
      },
    },
  },
  args: {
    nodes: statesOf(BASE, ["s1", "f1", "t1"], "t2"),
    branches: BRANCHES,
    layout: "columns",
    zoomControls: "auto",
    onSelect: fn(),
    onUnlock: fn(),
  },
  argTypes: {
    layout: { control: "inline-radio", options: ["columns", "tree"] },
    zoomControls: { control: "inline-radio", options: ["auto", true, false] },
    nodes: { control: false },
    branches: { control: false },
    header: { control: false },
    selectedId: { control: false },
    onSelect: { control: false },
    onUnlock: { control: false },
    canUnlock: { control: false },
    renderDetail: { control: false },
  },
  // La story tient les compétences acquises, les points et la sélection ; les contrôles règlent la disposition.
  render: function Render(args) {
    const game = useSkillGame(BASE, ["s1", "f1", "t1"], 5, "t2");
    const [selected, setSelected] = useState<string | null>("s2");
    return (
      <SkillTree
        {...args}
        nodes={game.nodes}
        selectedId={selected}
        onSelect={(id) => {
          setSelected(id);
          args.onSelect?.(id);
        }}
        header={
          <span>
            Points disponibles : <strong>{game.points}</strong>
          </span>
        }
        canUnlock={(n) => (n.points ?? 0) <= game.points}
        onUnlock={(id) => {
          game.unlock(id);
          args.onUnlock?.(id);
        }}
      />
    );
  },
} satisfies Meta<typeof SkillTree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Trois branches, cinq points à dépenser. « Rapprochement » demande les « Avoirs » et les « Tickets niveau 1 » : son lien croise deux branches." } } },
};

export const Tree: Story = {
  name: "En arbre",
  args: { layout: "tree" },
  render: function Render(args) {
    const game = useSkillGame(TREE_BASE, ["int", "gen", "s1", "f1", "t1"], 6, "t2");
    const [selected, setSelected] = useState<string | null>("f2");
    return (
      <SkillTree
        {...args}
        nodes={game.nodes}
        selectedId={selected}
        onSelect={setSelected}
        header={
          <span style={{ display: "inline-flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <span>
              Points disponibles : <strong>{game.points}</strong>
            </span>
            <Button onClick={game.reset}>Tout réinitialiser</Button>
          </span>
        }
        canUnlock={(n) => (n.points ?? 0) <= game.points}
        onUnlock={game.unlock}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "`layout=\"tree\"` : le tronc porte l'intégration puis le choix du parcours — le « polyvalent » est pris, l'« expert » s'est fermé. Les branches partent en éventail selon leur `angle`.",
      },
    },
  },
};

export const CustomDetail: Story = {
  name: "Détail de l'application",
  render: function Render(args) {
    const [selected, setSelected] = useState<string | null>("f3");
    return (
      <SkillTree
        {...args}
        selectedId={selected}
        onSelect={setSelected}
        renderDetail={(n) => (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <strong>{n.label}</strong>
            <Text size="sm" muted>
              {n.description ?? "Pas de description."}
            </Text>
            <Text size="sm">Effet : {n.effect}</Text>
            <span>
              <Badge tone={n.state === "unlocked" ? "up" : n.state === "available" ? "info" : "neutral"}>{STATE_LABEL[n.state]}</Badge>
            </span>
          </div>
        )}
      />
    );
  },
  parameters: { docs: { description: { story: "`renderDetail` remplace le détail par défaut — et avec lui le bouton « Débloquer »." } } },
};

export const Narrow: Story = {
  name: "Cadre étroit",
  render: function Render(args) {
    const [selected, setSelected] = useState<string | null>("s2");
    return (
      <div style={{ maxWidth: 420 }}>
        <SkillTree {...args} selectedId={selected} onSelect={setSelected} />
      </div>
    );
  },
  parameters: { docs: { description: { story: "Dans 420 px, l'arbre défile dans son cadre et les boutons de zoom apparaissent d'eux-mêmes (`zoomControls=\"auto\"`)." } } },
};
