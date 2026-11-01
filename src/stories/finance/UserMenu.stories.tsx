import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, within } from "storybook/test";
import {
  UserMenu,
  UserIcon,
  SettingsIcon,
  BellIcon,
  LogoutIcon,
  CreditCardIcon,
  LockIcon,
  type UserMenuItem,
} from "@michaelthomasjach/liseuse-dashboard-kit";

/** Un portrait de démonstration, local et sans réseau. */
const PORTRAIT =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
      <rect width="96" height="96" fill="#1c1f5c"/>
      <circle cx="48" cy="38" r="18" fill="#7c82ff"/>
      <path d="M14 96c4-22 18-32 34-32s30 10 34 32z" fill="#3a41e2"/>
    </svg>
  `);

const ITEMS: UserMenuItem[] = [
  { id: "profil", label: "Mon profil", icon: <UserIcon size={16} />, onClick: fn() },
  { id: "alertes", label: "Alertes", icon: <BellIcon size={16} />, onClick: fn() },
  { id: "reglages", label: "Réglages", icon: <SettingsIcon size={16} />, onClick: fn() },
  { id: "sortie", label: "Se déconnecter", icon: <LogoutIcon size={16} />, danger: true, onClick: fn() },
];

const NESTED_ITEMS: UserMenuItem[] = [
  { id: "profil", label: "Mon profil", icon: <UserIcon size={16} /> },
  {
    id: "reglages",
    label: "Réglages",
    icon: <SettingsIcon size={16} />,
    children: [
      { id: "notifications", label: "Notifications", icon: <BellIcon size={16} /> },
      { id: "facturation", label: "Facturation", icon: <CreditCardIcon size={16} /> },
      {
        id: "securite",
        label: "Sécurité",
        icon: <LockIcon size={16} />,
        children: [
          { id: "mdp", label: "Mot de passe" },
          { id: "2fa", label: "Double authentification" },
        ],
      },
    ],
  },
  { id: "sortie", label: "Se déconnecter", icon: <LogoutIcon size={16} />, danger: true },
];

/** Ouvre le menu : le déclencheur est le seul bouton de la story. */
const openMenu: Story["play"] = async ({ canvasElement }) => {
  await userEvent.click(within(canvasElement).getByRole("button", { expanded: false }));
};

/**
 * Le sélecteur de compte : avatar, nom, et un menu qui s'ouvre au clic.
 */
const meta = {
  title: "Layouts/UserMenu",
  component: UserMenu,
  parameters: {
    docs: {
      description: {
        component: [
          "Le **menu du compte connecté** : un déclencheur fait de l'avatar, du nom et d'un sous-titre, qui ouvre une liste d'actions — profil, réglages, déconnexion.",
          "",
          "**Quand l'utiliser** — une fois par application, en haut à droite d'une `HeaderLayout` (`actions`) ou au pied d'une `SidebarLayout` (`footer`, avec `placement=\"top\"`). Pour un menu d'actions sur un élément de la page, prenez `ContextMenu` ; pour un choix de valeur, `Select`.",
          "",
          "**Anatomie** — le déclencheur : `Avatar` de 32 px (photo `avatarSrc`, sinon initiales de `name`), `name`, `subtitle` (rôle, société, offre) et un chevron. Le menu : une liste d'entrées `{ id, label, icon?, onClick?, danger?, children? }`. `danger` passe l'entrée en rouge (déconnexion, suppression). `children` en fait un **sous-menu** qui s'ouvre sur le côté — à droite, ou à gauche s'il n'y a pas 200 px de place — et peut s'imbriquer.",
          "",
          "**Comportement** — le menu s'ouvre et se ferme au clic sur le déclencheur (un vrai `<button>`, donc aussi Entrée et Espace), se ferme sur Échap, sur un clic au dehors, et après le choix d'une entrée (son `onClick` est appelé d'abord). Un sous-menu s'ouvre au survol ou au clic, avec un délai de fermeture qui laisse le temps d'y glisser le pointeur en diagonale. Les entrées sont des boutons `role=\"menuitem\"`. **Clavier** : ↓, Entrée ou Espace sur le déclencheur ouvrent le menu et y posent le focus ; ↑ ↓ circulent en bouclant, Début / Fin vont aux extrémités ; → (ou Entrée) ouvre un sous-menu et entre dedans, ← ou Échap en ressortent ; Échap au premier niveau et Tab referment le menu, et le focus revient au déclencheur — Tab repart donc de lui, et non de la fin du document où vit le portail.",
          "",
          "**Placement** — `placement=\"bottom\"` (défaut) ouvre sous le déclencheur, `\"top\"` au-dessus ; le moteur de `Popover` corrige si la place manque. Le menu est rendu dans un **portail**, ré-enveloppé dans le thème englobant : il garde le style de la couche.",
          "",
          "**Thème** — `--lq-color-panel`, `--lq-color-border`, `--lq-radius-md`, `--lq-shadow-modal` (le menu flottant), `--lq-color-hover` (survol), `--lq-color-down` (entrée `danger`), `--lq-color-text-muted` (sous-titre), `--lq-font-weight-semibold` (nom).",
        ].join("\n"),
      },
    },
  },
  args: {
    name: "Claire Lemoine",
    subtitle: "Directrice financière",
    items: ITEMS,
    placement: "bottom",
  },
  argTypes: {
    items: { control: false },
    avatarSrc: { control: "text" },
    placement: { control: "inline-radio", options: ["bottom", "top"], table: { defaultValue: { summary: '"bottom"' } } },
  },
  render: (args) => (
    <div style={{ minHeight: 260 }}>
      <UserMenu {...args} />
    </div>
  ),
} satisfies Meta<typeof UserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Open: Story = {
  name: "Menu ouvert",
  play: openMenu,
  parameters: { docs: { description: { story: "Ouvert par un clic sur le déclencheur. La dernière entrée est en `danger`." } } },
};

export const WithSubmenu: Story = {
  name: "Sous-menus imbriqués",
  args: { items: NESTED_ITEMS },
  play: async (context) => {
    await openMenu?.(context);
    // Le menu est rendu dans un portail : on le cherche dans tout le document, pas dans la story.
    const body = within(context.canvasElement.ownerDocument.body);
    await userEvent.hover(await body.findByRole("menuitem", { name: "Réglages" }));
    await userEvent.hover(await body.findByRole("menuitem", { name: "Sécurité" }));
  },
  parameters: { docs: { description: { story: "« Réglages » ouvre un sous-menu au survol, et « Sécurité » un troisième niveau. Le chevron signale une entrée qui mène à un sous-menu." } } },
};

export const WithPhoto: Story = {
  name: "Avec photo",
  args: { avatarSrc: PORTRAIT, subtitle: "Lemoine SAS · offre Croissance" },
};

export const PlacementTop: Story = {
  name: "Ouverture vers le haut",
  args: { placement: "top" },
  render: (args) => (
    <div style={{ minHeight: 260, display: "flex", alignItems: "flex-end" }}>
      <div style={{ width: 248, paddingTop: 12, borderTop: "1px solid var(--lq-color-border-subtle)" }}>
        <UserMenu {...args} />
      </div>
    </div>
  ),
  play: openMenu,
  parameters: { docs: { description: { story: "Au pied d'une barre latérale, le menu s'ouvre au-dessus du déclencheur." } } },
};
