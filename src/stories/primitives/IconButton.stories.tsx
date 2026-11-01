import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  IconButton,
  Tooltip,
  SettingsIcon,
  RefreshIcon,
  SaveIcon,
  TrashIcon,
  PencilIcon,
  CopyIcon,
  MoreHorizontalIcon,
} from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * Le bouton carré à une seule icône. Dans le thème « resume », il prend le filet de 1,5 px et les
 * angles droits des autres contrôles.
 */
const meta = {
  title: "Primitives/IconButton",
  component: IconButton,
  parameters: {
    docs: {
      description: {
        component: [
          "Bouton carré à filet qui ne porte qu'une icône : paramètres, actualiser, fermer, actions en bout de ligne. Il transmet tous les attributs d'un `<button>` (`onClick`, `disabled`, `type`, `title`…).",
          "",
          "**Accessibilité** — sans texte visible, le bouton tire son nom de `ariaLabel`, obligatoire. Dès que l'icône n'est pas universelle, doublez-le d'un `Tooltip` : le lecteur d'écran a le nom, la souris aussi.",
          "",
          "**Quand l'utiliser** — une action répétée et reconnue d'un coup d'œil, dans un espace compté : barre d'outils, en-tête de carte, fin de ligne de tableau. Pour une action qui mérite un mot (Exporter, Valider), préférez `Button`, au besoin avec son `icon`.",
          "",
          "**Tailles** — `md` (défaut) fait 40 × 40 px, `sm` 28 × 28 px. La feuille du kit ramène l'icône à 55 % du côté du bouton : la `size` passée à l'icône n'y change rien.",
          "",
          "**États** — au survol, une légère transparence ; à l'appui, le bouton se tasse ; désactivé, 40 % d'opacité et curseur interdit.",
          "",
          "**Thème** — `--lq-control-border-width`, `--lq-color-border`, `--lq-radius-md`, `--lq-color-panel`, `--lq-color-text`, `--lq-transition-fast`. En `md`, le carré prend la hauteur des contrôles, `--lq-control-height` (40 px par défaut), pour s'aligner sur un `Button` ou un champ voisin ; `--lq-icon-button-size` (optionnelle) l'en détache. L'icône occupe 55 % du carré.",
        ].join("\n"),
      },
    },
  },
  args: { icon: <SettingsIcon size={18} />, ariaLabel: "Paramètres", onClick: fn() },
  argTypes: {
    icon: { control: false },
    children: { control: false },
    style: { control: false },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Small: Story = {
  name: "Petit",
  args: { size: "sm", icon: <PencilIcon size={14} />, ariaLabel: "Modifier" },
  parameters: { docs: { description: { story: "28 px de côté : la taille d'une action posée dans une ligne de tableau ou un en-tête dense." } } },
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { icon: <TrashIcon size={18} />, ariaLabel: "Supprimer", disabled: true },
};

export const WithTooltip: Story = {
  name: "Avec infobulle",
  render: (args) => (
    <div style={{ display: "flex", gap: 8, paddingTop: 40 }}>
      <Tooltip content="Actualiser les données">
        <IconButton {...args} icon={<RefreshIcon size={18} />} ariaLabel="Actualiser" />
      </Tooltip>
      <Tooltip content="Enregistrer la vue">
        <IconButton {...args} icon={<SaveIcon size={18} />} ariaLabel="Enregistrer" />
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: { description: { story: "Survolez ou tabulez jusqu'au bouton : l'infobulle reprend le nom que `ariaLabel` donne au lecteur d'écran." } },
  },
};

export const Toolbar: Story = {
  name: "Barre d'outils",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <IconButton icon={<SettingsIcon size={18} />} ariaLabel="Paramètres" />
        <IconButton icon={<RefreshIcon size={18} />} ariaLabel="Actualiser" />
        <IconButton icon={<SaveIcon size={18} />} ariaLabel="Enregistrer" />
        <IconButton icon={<TrashIcon size={18} />} ariaLabel="Supprimer" disabled />
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <IconButton size="sm" icon={<PencilIcon size={14} />} ariaLabel="Modifier" />
        <IconButton size="sm" icon={<CopyIcon size={14} />} ariaLabel="Dupliquer" />
        <IconButton size="sm" icon={<MoreHorizontalIcon size={14} />} ariaLabel="Plus d'actions" />
      </div>
    </div>
  ),
  parameters: { docs: { description: { story: "Les deux tailles en rangée : `md` pour la barre d'un écran, `sm` pour les actions d'une ligne." } } },
};
