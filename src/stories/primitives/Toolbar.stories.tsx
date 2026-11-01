import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Toolbar,
  type ToolbarProps,
  Button,
  IconButton,
  ButtonGroup,
  Input,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  BulletListIcon,
  OrderedListIcon,
  LinkIcon,
  UndoIcon,
  RedoIcon,
  SaveIcon,
  SearchIcon,
  RefreshIcon,
  TrashIcon,
  PlusIcon,
  CursorArrowIcon,
  TrendLineIcon,
  HorizontalLineIcon,
  RectangleShapeIcon,
  TextIcon,
  MeasureIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@michaelthomasjach/liseuse-dashboard-kit";

/** La barre d'un éditeur de texte : quatre groupes à gauche, l'enregistrement à droite. */
function editorGroups(compact: boolean, marks: string[], setMarks: (v: string[]) => void, align: string, setAlign: (v: string) => void) {
  return [
    <>
      <IconButton icon={<UndoIcon />} ariaLabel="Annuler" />
      <IconButton icon={<RedoIcon />} ariaLabel="Rétablir" />
    </>,
    <ButtonGroup
      ariaLabel="Style"
      selection="multiple"
      size={compact ? "sm" : "md"}
      items={[
        { value: "bold", icon: <BoldIcon />, ariaLabel: "Gras" },
        { value: "italic", icon: <ItalicIcon />, ariaLabel: "Italique" },
        { value: "underline", icon: <UnderlineIcon />, ariaLabel: "Souligné" },
      ]}
      value={marks}
      onChange={setMarks}
    />,
    <ButtonGroup
      ariaLabel="Alignement"
      size={compact ? "sm" : "md"}
      items={[
        { value: "left", icon: <AlignLeftIcon />, ariaLabel: "Aligner à gauche" },
        { value: "center", icon: <AlignCenterIcon />, ariaLabel: "Centrer" },
        { value: "right", icon: <AlignRightIcon />, ariaLabel: "Aligner à droite" },
      ]}
      value={align}
      onChange={setAlign}
    />,
    <>
      <IconButton icon={<BulletListIcon />} ariaLabel="Liste à puces" />
      <IconButton icon={<OrderedListIcon />} ariaLabel="Liste numérotée" />
      <IconButton icon={<LinkIcon />} ariaLabel="Insérer un lien" />
    </>,
  ];
}

/**
 * Les barres des stories sont rendues par des composants à elles, et non directement par `render` :
 * le décorateur de source de Storybook sérialise l'élément rendu, et un tableau de groupes dans
 * `start` (des fragments d'éléments à icônes) le fait tourner sans fin — la page se fige.
 */
function EditorBar(props: ToolbarProps) {
  const [marks, setMarks] = useState<string[]>(["bold"]);
  const [align, setAlign] = useState("left");
  return (
    <Toolbar
      {...props}
      start={editorGroups(props.density === "compact", marks, setMarks, align, setAlign)}
      end={<Button icon={<SaveIcon size={14} />}>Enregistrer</Button>}
    />
  );
}

function SearchBar(props: ToolbarProps) {
  return (
    <Toolbar
      {...props}
      start={[
        <div style={{ width: 240 }}>
          <Input size="small" placeholder="Rechercher une commande" leadingIcon={<SearchIcon size={14} />} aria-label="Rechercher" />
        </div>,
        <>
          <IconButton icon={<RefreshIcon />} ariaLabel="Actualiser" />
          <IconButton icon={<TrashIcon />} ariaLabel="Supprimer la sélection" disabled />
        </>,
      ]}
      end={[
        <Button>Exporter</Button>,
        <Button selected icon={<PlusIcon size={14} />}>
          Nouvelle commande
        </Button>,
      ]}
    />
  );
}

function DrawingBar(props: ToolbarProps) {
  const [tool, setTool] = useState("cursor");
  return (
    <Toolbar
      {...props}
      start={[
        <ButtonGroup
          orientation="vertical"
          ariaLabel="Outil"
          items={[
            { value: "cursor", icon: <CursorArrowIcon />, ariaLabel: "Curseur" },
            { value: "trend", icon: <TrendLineIcon />, ariaLabel: "Ligne de tendance" },
            { value: "hline", icon: <HorizontalLineIcon />, ariaLabel: "Ligne horizontale" },
            { value: "rect", icon: <RectangleShapeIcon />, ariaLabel: "Rectangle" },
            { value: "text", icon: <TextIcon />, ariaLabel: "Texte" },
          ]}
          value={tool}
          onChange={setTool}
        />,
        <IconButton icon={<MeasureIcon />} ariaLabel="Mesurer" />,
      ]}
      end={
        <>
          <IconButton icon={<ZoomInIcon />} ariaLabel="Zoom avant" />
          <IconButton icon={<ZoomOutIcon />} ariaLabel="Zoom arrière" />
        </>
      }
    />
  );
}

/**
 * Une barre d'outils au sens ARIA : un seul arrêt de tabulation, des flèches pour circuler.
 */
const meta = {
  title: "Primitives/Toolbar",
  component: Toolbar,
  parameters: {
    docs: {
      description: {
        component: [
          "Barre d'outils `role=\"toolbar\"` : des contrôles rangés en **groupes séparés d'un filet**, une zone à gauche et une zone à droite, et une navigation au clavier de barre d'outils.",
          "",
          "**Quand l'utiliser** — au-dessus d'un éditeur, d'un tableau, d'un graphique : une rangée d'actions sur le même objet, qu'on veut traverser d'un seul arrêt de tabulation. Pour deux ou trois boutons isolés, une simple rangée suffit ; pour souder des boutons sœurs, `ButtonGroup` (qu'on pose volontiers dans une `Toolbar`).",
          "",
          "**Contenu** — libre : `Button`, `IconButton`, `ButtonGroup`, un `Input` de recherche, un déclencheur de menu. `start` (ou `children`) se range à gauche, `end` est poussé à droite. **Un tableau** de nœuds dans `start` ou `end` en fait des groupes, séparés par un filet vertical (`role=\"separator\"`).",
          "",
          "**Disposition** — `orientation=\"vertical\"` en fait une palette d'outils au flanc d'un graphique : `start` en haut, `end` en bas. `density=\"compact\"` resserre la marge, les écarts et les boutons du kit posés dedans (les `IconButton` passent à 32 px, la marge des `Button` à 4 / 12 px). `plain` retire cadre et fond, pour une barre posée dans un en-tête de carte.",
          "",
          "**Clavier** — la barre ne compte que **pour un** dans l'ordre de tabulation (tabindex itinérant). Dedans, ← / → (↑ / ↓ en vertical) passent d'un contrôle au suivant en bouclant, Origine et Fin vont aux extrémités ; en retabulant, on revient sur le dernier contrôle quitté. Un champ de saisie garde ses flèches pour son curseur : on en sort par Tab. Les contrôles désactivés sont sautés.",
          "",
          "**Accessibilité** — `ariaLabel`, obligatoire, nomme la barre : une page en porte souvent plusieurs. `aria-orientation` suit `orientation`. Chaque contrôle garde son propre nom (`ariaLabel` des `IconButton`).",
          "",
          "**Thème** — `--lq-color-panel`, `--lq-color-border-subtle` (cadre et filets), `--lq-control-border-width`, `--lq-radius-md`, `--lq-space-1`, `--lq-space-2`, `--lq-color-focus-ring`, et les variables optionnelles `--lq-toolbar-bg`, `--lq-toolbar-border`, `--lq-toolbar-padding`, `--lq-toolbar-gap`, `--lq-toolbar-separator`, `--lq-toolbar-compact-button-padding-y` / `-x`, `--lq-toolbar-compact-icon-size`.",
        ].join("\n"),
      },
    },
  },
  args: { ariaLabel: "Mise en forme", orientation: "horizontal", density: "normal", plain: false },
  argTypes: {
    ariaLabel: { control: "text" },
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"], table: { defaultValue: { summary: '"horizontal"' } } },
    density: { control: "inline-radio", options: ["normal", "compact"], table: { defaultValue: { summary: '"normal"' } } },
    plain: { control: "boolean" },
    start: { control: false },
    end: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  render: (args) => <EditorBar {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "La barre d'un éditeur : quatre groupes en tableau dans `start`, l'action principale dans `end`. Tabulez jusqu'à la barre, puis circulez aux flèches : Tab suivant sort de la barre d'un coup.",
      },
    },
  },
};

export const Compact: Story = {
  name: "Compacte",
  args: { density: "compact" },
  render: (args) => <EditorBar {...args} />,
  parameters: { docs: { description: { story: "`density=\"compact\"` : la même barre, resserrée — `IconButton` à 32 px, groupes en `sm`, `Button` à marge réduite." } } },
};

export const WithSearch: Story = {
  name: "Avec un champ",
  args: { ariaLabel: "Actions du tableau" },
  render: (args) => <SearchBar {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Au-dessus d'un tableau : un champ de recherche, des actions, deux groupes à droite. Dans le champ, ← / → déplacent le curseur et non le focus ; le bouton désactivé est sauté par les flèches.",
      },
    },
  },
};

export const Vertical: Story = {
  name: "Verticale",
  args: { ariaLabel: "Outils de dessin", orientation: "vertical", density: "compact" },
  render: (args) => <DrawingBar {...args} />,
  parameters: { docs: { description: { story: "`orientation=\"vertical\"` : la palette d'outils d'un graphique. ↑ / ↓ circulent, le filet devient horizontal, `end` descend en bas." } } },
};

export const Plain: Story = {
  name: "Sans cadre",
  args: { ariaLabel: "Filtres", plain: true },
  render: (args) => (
    <Toolbar
      {...args}
      start={
        <ButtonGroup
          size="sm"
          ariaLabel="Statut"
          items={[
            { value: "toutes", label: "Toutes" },
            { value: "ouvertes", label: "Ouvertes" },
            { value: "closes", label: "Closes" },
          ]}
          defaultValue="toutes"
        />
      }
      end={<IconButton size="sm" icon={<RefreshIcon />} ariaLabel="Actualiser" />}
    />
  ),
  parameters: { docs: { description: { story: "`plain` : ni cadre ni fond — la barre se fond dans l'en-tête d'une carte. La navigation au clavier reste la même." } } },
};
