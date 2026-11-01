import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip, Button, IconButton, RefreshIcon, SettingsIcon, TrashIcon } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * L'infobulle : une courte bulle en couleurs inversées (fond du texte, texte du fond) qui décrit
 * l'élément survolé ou focalisé.
 */
const meta = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component: [
          "Bulle d'aide attachée à un élément : un libellé pour un bouton-icône, une unité, un raccourci clavier. On enveloppe l'ancre : `<Tooltip content=\"…\"><IconButton … /></Tooltip>`.",
          "",
          "**Quand elle apparaît** — au survol d'une souris ou d'un stylet, après `delay` (250 ms par défaut, pour qu'un regard qui balaie une barre d'outils ne fasse pas clignoter une bulle par bouton) ; tout de suite à la prise de focus clavier. Elle disparaît quand le pointeur s'en va, quand le focus part, à Échap, et dès qu'on appuie sur l'ancre. Le tactile est volontairement ignoré.",
          "",
          "**Placement** — `placement` (`top` par défaut) est un souhait : sans la place de ce côté, la bulle passe du côté opposé, puis elle est ramenée dans l'écran. Elle suit le défilement de n'importe quel conteneur.",
          "",
          "**Dans un portail** — la bulle est rendue dans `document.body` en `position: fixed` : une carte en `overflow: hidden` ou une barre qui défile ne la rognent jamais. Elle reprend le thème courant, classe `rdk` comprise.",
          "",
          "**Accessibilité** — la bulle porte `role=\"tooltip\"` ; tant qu'elle est visible, l'ancre la désigne par `aria-describedby` (l'élément enfant lui-même s'il est unique, sinon l'enveloppe). Elle ignore le pointeur et ne vole jamais un clic.",
          "",
          "**Quand ne pas l'utiliser** — pour une information indispensable : elle n'existe ni au toucher ni à l'impression. Mettez-la dans le texte, ou dans le `helperText` d'un champ. Pour un contenu interactif (liens, boutons), `Popover`.",
          "",
          "`content` vide (`null`, `\"\"`) ou `disabled` : pas de bulle, l'ancre reste montée.",
          "",
          "**Thème** — couleurs inversées : fond `--lq-color-text`, texte `--lq-color-panel` ; `--lq-font-family`, `--lq-text-xs`, `--lq-font-weight-semibold`.",
        ].join("\n"),
      },
    },
  },
  args: { content: "Montant hors taxes, avant remise", placement: "top", delay: 250, children: <Button>Total HT</Button> },
  argTypes: { children: { control: false }, content: { control: "text" } },
  // De la place autour de l'ancre, pour que la bulle tienne du côté demandé.
  decorators: [
    (Story) => (
      <div style={{ padding: "56px 140px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  // Sur le canevas seul, l'ancre prend le focus : la bulle s'affiche sans survol.
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLElement>(".lq-tooltip-anchor button")?.focus();
  },
};

export const Placements: Story = {
  name: "Les quatre côtés",
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Tooltip content="Montant hors taxes" placement="top">
        <Button>En haut</Button>
      </Tooltip>
      <Tooltip content="Dernière synchronisation : il y a 4 min" placement="bottom">
        <Button>En bas</Button>
      </Tooltip>
      <Tooltip content="Visible des seuls administrateurs" placement="left">
        <Button>À gauche</Button>
      </Tooltip>
      <Tooltip content="Raccourci : Ctrl+E" placement="right">
        <Button>À droite</Button>
      </Tooltip>
    </div>
  ),
};

export const OnIconButtons: Story = {
  name: "Sur des boutons-icônes",
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Tooltip content="Actualiser">
        <IconButton icon={<RefreshIcon size={18} />} ariaLabel="Actualiser" />
      </Tooltip>
      <Tooltip content="Paramètres du tableau">
        <IconButton icon={<SettingsIcon size={18} />} ariaLabel="Paramètres du tableau" />
      </Tooltip>
      <Tooltip content="Supprimer la sélection">
        <IconButton icon={<TrashIcon size={18} />} ariaLabel="Supprimer la sélection" />
      </Tooltip>
    </div>
  ),
  parameters: { docs: { description: { story: "L'usage le plus fréquent : donner à la souris le nom que `ariaLabel` donne au lecteur d'écran." } } },
};

export const Clipped: Story = {
  name: "Dans un conteneur qui rogne",
  render: () => (
    <div style={{ width: 220, height: 60, overflow: "hidden", border: "1px dashed var(--lq-color-border)", padding: 12, boxSizing: "border-box" }}>
      <Tooltip content="Cette bulle sort du cadre sans être coupée : elle vit dans un portail." placement="top">
        <Button>Survolez-moi</Button>
      </Tooltip>
    </div>
  ),
  parameters: { docs: { description: { story: "Le cadre pointillé est en `overflow: hidden` ; la bulle le déborde quand même." } } },
};

export const Disabled: Story = {
  name: "Coupée",
  args: { disabled: true, content: "Vous ne verrez jamais cette bulle", children: <Button>Sans infobulle</Button> },
  parameters: { docs: { description: { story: "`disabled` coupe la bulle sans démonter l'ancre — pratique quand l'aide n'a plus lieu d'être." } } },
};
