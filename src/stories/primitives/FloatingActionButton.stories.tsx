import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  FloatingActionButton,
  type FloatingAction,
  CalendarIcon,
  FileIcon,
  PencilIcon,
  UploadCloudIcon,
  UserIcon,
  CommentIcon,
} from "@michaelthomasjach/liseuse-dashboard-kit";

/** Un cadre qui tient lieu d'écran : `position: relative` pour `position="absolute"`, et un
 *  `transform` pour que `position="fixed"` s'y accroche au lieu de la page de documentation. */
function Frame({ children, height = 340 }: { children: ReactNode; height?: number }) {
  return (
    <div
      style={{
        position: "relative",
        transform: "translateZ(0)",
        height,
        maxWidth: 560,
        border: "1px dashed var(--lq-color-border-subtle)",
        background: "var(--lq-color-bg)",
        overflow: "hidden",
      }}
    >
      <p style={{ margin: 16, color: "var(--lq-color-text-muted)", fontSize: "0.85rem" }}>Contenu de l'écran…</p>
      {children}
    </div>
  );
}

const ACTIONS: FloatingAction[] = [
  { id: "doc", label: "Nouveau document", icon: <FileIcon /> },
  { id: "event", label: "Planifier un rendez-vous", icon: <CalendarIcon /> },
  { id: "contact", label: "Ajouter un contact", icon: <UserIcon /> },
  { id: "import", label: "Importer", icon: <UploadCloudIcon />, disabled: true },
];

/**
 * Le bouton rond flottant de l'action principale d'un écran, et son « speed dial ».
 */
const meta = {
  title: "Primitives/FloatingActionButton",
  component: FloatingActionButton,
  parameters: {
    docs: {
      description: {
        component: [
          "Bouton **rond flottant** qui porte l'action principale d'un écran — « Nouvelle commande », « Écrire un message » — accroché à un coin, au-dessus du contenu. Avec `actions`, il devient un **speed dial** : un clic déplie une colonne d'actions secondaires, chacune avec son icône et son libellé.",
          "",
          "**Quand l'utiliser** — une action dominante, toujours à portée, sur un écran long qui défile ou sur mobile. Pas plus d'un par écran. Pour une action parmi d'autres, un `Button` dans l'en-tête ; pour plus de cinq ou six actions secondaires, un menu (`ContextMenu`, `DropdownPanel`).",
          "",
          "**Position** — `position=\"fixed\"` (défaut) l'accroche à la fenêtre, `\"absolute\"` au premier ancêtre positionné (une carte, un panneau), `\"static\"` le laisse dans le flux. `placement` choisit le coin (`bottom-right` par défaut) et `offset` la distance au coin (24 px). Les actions se déplient toujours vers l'intérieur, leurs libellés du côté opposé au bord.",
          "",
          "**Apparence** — `tone` reprend les tons pleins du kit (`accent` par défaut, `success`, `info`, `danger`, `warning`, `dark`, ou `default` : le fond des panneaux cerclé d'un filet). `size` : `md` (56 px, actions à 40) ou `sm` (40 px, actions à 32). `icon` remplace le « + » ; sans `openIcon`, l'icône pivote d'un quart de tour à l'ouverture (le « + » devient « × »).",
          "",
          "**Ouverture** — libre (`defaultOpen`) ou contrôlée (`open` + `onOpenChange`). Sans `actions`, un clic appelle `onClick`. Chaque action appelle son `onSelect` puis referme le menu ; une action `disabled` reste visible mais inerte.",
          "",
          "**Clavier et accessibilité** — le bouton principal n'a pas de texte : `ariaLabel` le nomme (« Actions » ou « Ajouter » par défaut). Avec des actions, il porte `aria-haspopup=\"menu\"`, `aria-expanded` et `aria-controls`. Entrée, Espace ou ↑ / ↓ ouvrent le menu et posent le focus sur la première action ; ↑ / ↓ circulent entre elles ; **Échap** referme et rend le focus au bouton. Un clic ailleurs ou un Tab hors du composant referment aussi. Les actions sont des `menuitem` nommés par leur libellé.",
          "",
          "**Thème** — remplissage par `--lq-tone-*` (voir `Card`), ombre `--lq-shadow-modal`, étiquettes en `--lq-color-panel` / `--lq-shadow-panel`, et les variables optionnelles `--lq-fab-size`, `--lq-fab-action-size`, `--lq-fab-radius` (50 %), `--lq-fab-shadow`, `--lq-fab-z-index` (50), `--lq-fab-label-bg`, `--lq-fab-label-color`. En e-ink, il est carré, sans ombre ni mouvement.",
        ].join("\n"),
      },
    },
  },
  args: {
    ariaLabel: "Nouvelle commande",
    tone: "accent",
    size: "md",
    position: "absolute",
    placement: "bottom-right",
    offset: 24,
    disabled: false,
    onClick: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    ariaLabel: { control: "text" },
    tone: { control: "select", options: ["accent", "success", "info", "danger", "warning", "dark", "default"], table: { defaultValue: { summary: '"accent"' } } },
    size: { control: "inline-radio", options: ["sm", "md"], table: { defaultValue: { summary: '"md"' } } },
    position: { control: "inline-radio", options: ["fixed", "absolute", "static"], table: { defaultValue: { summary: '"fixed"' } } },
    placement: { control: "select", options: ["bottom-right", "bottom-left", "top-right", "top-left"], table: { defaultValue: { summary: '"bottom-right"' } } },
    offset: { control: "number", table: { defaultValue: { summary: "24" } } },
    disabled: { control: "boolean" },
    open: { control: "boolean" },
    defaultOpen: { control: false },
    icon: { control: false },
    openIcon: { control: false },
    actions: { control: false },
  },
  render: (args) => (
    <Frame>
      <FloatingActionButton {...args} />
    </Frame>
  ),
} satisfies Meta<typeof FloatingActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Le bouton seul, collé au coin bas-droit de son conteneur (`position=\"absolute\"`). Un clic appelle `onClick`." } } },
};

export const SpeedDial: Story = {
  name: "Speed dial",
  args: { ariaLabel: "Créer" },
  render: function Render(args) {
    const [last, setLast] = useState<string | null>(null);
    const actions = ACTIONS.map((a) => ({ ...a, onSelect: () => setLast(a.label) }));
    return (
      <Frame>
        <p style={{ margin: 16 }}>{last ? `Dernière action : ${last}` : "Aucune action choisie"}</p>
        <FloatingActionButton {...args} actions={actions} defaultOpen />
      </Frame>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ouvert d'emblée : quatre actions, la dernière désactivée. Choisissez-en une, rouvrez au clavier (Entrée ou ↑), circulez aux flèches, refermez par Échap.",
      },
    },
  },
};

export const Placements: Story = {
  name: "Les quatre coins",
  render: () => (
    <Frame height={460}>
      {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map((placement) => (
        <FloatingActionButton
          key={placement}
          position="absolute"
          placement={placement}
          size="sm"
          offset={16}
          ariaLabel={`Actions ${placement}`}
          actions={ACTIONS.slice(0, 2)}
          defaultOpen={placement === "top-left" || placement === "bottom-right"}
        />
      ))}
    </Frame>
  ),
  parameters: { docs: { description: { story: "`placement` : en haut, les actions se déplient vers le bas ; à gauche, les libellés passent à droite. En `size=\"sm\"`, avec `offset={16}`." } } },
};

export const Tones: Story = {
  name: "Tons et tailles",
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center", padding: 8, flexWrap: "wrap" }}>
      {(["accent", "success", "info", "danger", "warning", "dark", "default"] as const).map((tone) => (
        <FloatingActionButton key={tone} position="static" tone={tone} ariaLabel={`Ton ${tone}`} />
      ))}
      <FloatingActionButton position="static" size="sm" icon={<PencilIcon />} ariaLabel="Modifier" />
      <FloatingActionButton position="static" disabled icon={<CommentIcon />} ariaLabel="Commenter" />
    </div>
  ),
  parameters: { docs: { description: { story: "Les sept `tone`, puis un `size=\"sm\"` à icône propre et un bouton désactivé — en `position=\"static\"`, dans le flux." } } },
};

export const Fixed: Story = {
  name: "Fixe",
  args: { position: "fixed", tone: "info", ariaLabel: "Ouvrir la messagerie", icon: <CommentIcon /> },
  parameters: {
    docs: {
      description: {
        story:
          "`position=\"fixed\"`, la valeur par défaut : accroché au coin de la fenêtre, il ne défile pas avec la page. Ici le cadre porte un `transform`, qui en fait le repère du bouton à la place de la fenêtre.",
      },
    },
  },
};
