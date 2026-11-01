import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  ButtonGroup,
  Button,
  IconButton,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  PencilIcon,
  CopyIcon,
  TrashIcon,
  SaveIcon,
  RefreshIcon,
} from "@michaelthomasjach/liseuse-dashboard-kit";

const PERIODS = [
  { value: "jour", label: "Jour" },
  { value: "semaine", label: "Semaine" },
  { value: "mois", label: "Mois" },
];

const ALIGN_ITEMS = [
  { value: "left", icon: <AlignLeftIcon />, ariaLabel: "Aligner à gauche" },
  { value: "center", icon: <AlignCenterIcon />, ariaLabel: "Centrer" },
  { value: "right", icon: <AlignRightIcon />, ariaLabel: "Aligner à droite" },
  { value: "justify", icon: <AlignJustifyIcon />, ariaLabel: "Justifier" },
];

const MARK_ITEMS = [
  { value: "bold", icon: <BoldIcon />, ariaLabel: "Gras" },
  { value: "italic", icon: <ItalicIcon />, ariaLabel: "Italique" },
  { value: "underline", icon: <UnderlineIcon />, ariaLabel: "Souligné" },
  { value: "strike", icon: <StrikethroughIcon />, ariaLabel: "Barré" },
];

/**
 * Des boutons accolés, dans un seul cadre, les coins aux deux bouts.
 */
const meta = {
  title: "Primitives/ButtonGroup",
  component: ButtonGroup,
  parameters: {
    docs: {
      description: {
        component: [
          "Boutons **accolés** : les bordures voisines se fondent en un seul filet, les coins ne s'arrondissent qu'aux deux extrémités. Horizontal ou vertical.",
          "",
          "**Quand l'utiliser** — des actions sœurs qu'on veut lire comme un bloc (Modifier · Dupliquer · Supprimer), ou un réglage à plusieurs valeurs posé dans une barre : vue jour / semaine / mois, alignement, gras / italique / souligné. Pour un réglage exclusif dans un formulaire ou un panneau de préférences, `SegmentedControl` dit la même chose avec un intitulé ; pour passer d'une vue à une autre, `Tabs`.",
          "",
          "**Deux usages** — en **juxtaposition**, `children` reçoit des `Button` et `IconButton` quelconques, avec leurs `onClick` à eux : le groupe ne fait que les souder. En **sélection**, `items` décrit les boutons (`value`, `label`, `icon`, `ariaLabel`, `disabled`) et le groupe les rend lui-même : un item sans `label` devient un bouton carré à icône seule, nommé par son `ariaLabel`.",
          "",
          "**Sélection** — `selection=\"single\"` (défaut) : un seul bouton enfoncé, un clic sur le bouton déjà enfoncé ne le relâche pas. `selection=\"multiple\"` : chaque bouton s'enfonce et se relâche seul, `value` est alors un tableau. Contrôlé avec `value` + `onChange`, libre avec `defaultValue`.",
          "",
          "**Disposition** — `orientation=\"vertical\"` empile les boutons à la largeur du plus large, libellés à gauche. `size=\"sm\"` resserre marges et texte (en-tête de carte, barre compacte). `block` étire le groupe sur toute la largeur et partage la place à parts égales.",
          "",
          "**Taille** — en `md`, un bouton à libellé a la hauteur d'un `Button` ; un bouton à icône seule est un carré d'au moins `--lq-control-height` de côté (36 px dans ce thème, 12 de moins en `sm`) et s'étire à la hauteur de ses voisins à libellé.",
          "",
          "**Accessibilité** — le groupe porte `role=\"group\"`, nommé par `ariaLabel`. En sélection, chaque bouton porte `aria-pressed` : un lecteur d'écran annonce « bouton bascule, enfoncé ». Chaque bouton reste un arrêt de tabulation ; Espace ou Entrée l'actionne. Le bouton focalisé passe au-dessus de ses voisins, son anneau de focus n'est pas rogné.",
          "",
          "**Thème** — les boutons gardent leurs variables (`--lq-button-*`, `--lq-control-border-width`, `--lq-color-border`, `--lq-color-panel`) ; le groupe lit `--lq-radius-md` pour les coins extérieurs, `--lq-control-height` pour le côté des boutons à icône et, pour le bouton enfoncé, les variables optionnelles `--lq-button-group-selected-bg`, `--lq-button-group-selected-color` et `--lq-button-group-selected-border` (à défaut, le plein de l'accent : `--lq-color-fill`, `--lq-color-accent-contrast`). Ce thème les enfonce dans le plein du bleu du CV : `#3a41e2`, texte blanc (`#7c82ff`, texte `#0d0f22` en sombre).",
        ].join("\n"),
      },
    },
  },
  args: { ariaLabel: "Période", orientation: "horizontal", size: "md", block: false },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"], table: { defaultValue: { summary: '"horizontal"' } } },
    size: { control: "inline-radio", options: ["sm", "md"], table: { defaultValue: { summary: '"md"' } } },
    block: { control: "boolean" },
    ariaLabel: { control: "text" },
    selection: { control: "inline-radio", options: ["single", "multiple"], table: { defaultValue: { summary: '"single"' } } },
    items: { control: false },
    children: { control: false },
    value: { control: false },
    defaultValue: { control: false },
    onChange: { control: false },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  render: (args) => (
    <ButtonGroup orientation={args.orientation} size={args.size} block={args.block} ariaLabel={args.ariaLabel}>
      <Button>Jour</Button>
      <Button>Semaine</Button>
      <Button>Mois</Button>
      <Button>Année</Button>
    </ButtonGroup>
  ),
  parameters: { docs: { description: { story: "En juxtaposition : quatre `Button` ordinaires, soudés. Jouez sur `orientation`, `size` et `block` dans le panneau Controls." } } },
};

export const IconOnly: Story = {
  name: "Icônes seules",
  render: (args) => (
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      <ButtonGroup orientation={args.orientation} size={args.size} ariaLabel="Actions sur la ligne">
        <IconButton icon={<PencilIcon />} ariaLabel="Modifier" />
        <IconButton icon={<CopyIcon />} ariaLabel="Dupliquer" />
        <IconButton icon={<TrashIcon />} ariaLabel="Supprimer" />
      </ButtonGroup>
      <ButtonGroup orientation={args.orientation} size={args.size} ariaLabel="Enregistrement">
        <Button icon={<SaveIcon size={14} />}>Enregistrer</Button>
        <IconButton icon={<RefreshIcon />} ariaLabel="Recharger" />
      </ButtonGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Des `IconButton` dans un groupe perdent leur taille fixe pour un minimum : seuls, ils restent carrés ; accolés à un `Button` à libellé (à droite), ils prennent sa hauteur. Le cas classique du bouton « action + menu ».",
      },
    },
  },
};

export const SingleSelection: Story = {
  name: "Sélection exclusive",
  args: { selection: "single", value: "semaine", onChange: fn() },
  render: function Render(args) {
    const [view, setView] = useState(typeof args.value === "string" ? args.value : "semaine");
    const [align, setAlign] = useState("left");
    useEffect(() => {
      if (typeof args.value === "string") setView(args.value);
    }, [args.value]);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
        <ButtonGroup
          ariaLabel="Vue"
          size={args.size}
          orientation={args.orientation}
          items={PERIODS}
          value={view}
          onChange={(next) => {
            setView(next);
            (args.onChange as ((v: string) => void) | undefined)?.(next);
          }}
        />
        <ButtonGroup ariaLabel="Alignement" size={args.size} orientation={args.orientation} items={ALIGN_ITEMS} value={align} onChange={setAlign} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "`items` + `value` + `onChange` : un seul bouton enfoncé, porteur de `aria-pressed=\"true\"`. En haut des libellés, en bas des icônes seules nommées par `ariaLabel`.",
      },
    },
  },
};

export const MultipleSelection: Story = {
  name: "Sélection multiple",
  render: function Render(args) {
    const [marks, setMarks] = useState<string[]>(["bold"]);
    return (
      <ButtonGroup
        ariaLabel="Mise en forme"
        size={args.size}
        orientation={args.orientation}
        selection="multiple"
        items={MARK_ITEMS}
        value={marks}
        onChange={setMarks}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "`selection=\"multiple\"` : chaque bouton bascule seul, `value` et `onChange` passent par un tableau — ici gras, italique, souligné, barré.",
      },
    },
  },
};

export const Vertical: Story = {
  name: "Vertical",
  render: () => (
    <ButtonGroup
      orientation="vertical"
      ariaLabel="Section"
      items={[
        { value: "profil", label: "Profil" },
        { value: "securite", label: "Sécurité" },
        { value: "notifications", label: "Notifications" },
      ]}
      defaultValue="securite"
    />
  ),
  parameters: { docs: { description: { story: "`orientation=\"vertical\"` : empilés à la largeur du plus large, coins en haut et en bas. Non contrôlé, avec `defaultValue`." } } },
};

export const Small: Story = {
  name: "Petit",
  render: () => (
    <ButtonGroup
      size="sm"
      ariaLabel="Période"
      items={[
        { value: "1j", label: "1 J" },
        { value: "1s", label: "1 S" },
        { value: "1m", label: "1 M" },
        { value: "1a", label: "1 A" },
      ]}
      defaultValue="1m"
    />
  ),
  parameters: { docs: { description: { story: "`size=\"sm\"` : la période d'un graphique dans l'en-tête de sa carte." } } },
};

export const Block: Story = {
  name: "Pleine largeur",
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <ButtonGroup
        block
        ariaLabel="Livraison"
        items={[
          { value: "standard", label: "Standard" },
          { value: "express", label: "Express" },
          { value: "relais", label: "Point relais", disabled: true },
        ]}
        defaultValue="standard"
      />
    </div>
  ),
  parameters: { docs: { description: { story: "`block` : le groupe remplit son conteneur, la place se partage à parts égales. Le troisième bouton est désactivé." } } },
};
