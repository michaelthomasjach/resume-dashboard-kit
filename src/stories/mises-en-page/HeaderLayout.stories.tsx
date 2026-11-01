import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HeaderLayout,
  UserMenu,
  Button,
  StatCard,
  Heading,
  Text,
  BellIcon,
  SearchIcon,
  UserIcon,
  LogoutIcon,
  type HeaderLayoutProps,
  type HeaderNavItem,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { REVENUE_TREND, SIGNUPS_TREND } from "../../showcase/demoData";

const pct = (n: number) => `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;

const LOGO = (
  <span style={{ fontSize: "1.375rem", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.04em", color: "var(--lq-color-text)" }}>resume</span>
);

const NAV: HeaderNavItem[] = [
  { id: "apercu", label: "Aperçu" },
  { id: "ventes", label: "Ventes" },
  { id: "factures", label: "Factures" },
  { id: "rapports", label: "Rapports" },
];

const ACCOUNT = [
  { id: "profil", label: "Mon profil", icon: <UserIcon size={16} /> },
  { id: "sortie", label: "Se déconnecter", icon: <LogoutIcon size={16} />, danger: true },
];

const ACTIONS = (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <Button icon={<SearchIcon size={16} />}>Rechercher</Button>
    <Button icon={<BellIcon size={16} />}>3</Button>
    <UserMenu name="Claire Lemoine" subtitle="Administratrice" items={ACCOUNT} />
  </div>
);

function PageContent({ title, long = false }: { title: string; long?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <Heading level={3}>{title}</Heading>
        <Text muted size="sm">
          Le contenu de la page se rend ici.
        </Text>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
        <StatCard label="Revenu mensuel" value={"80 000 €"} delta={12.4} deltaFormat={pct} sparklineData={REVENUE_TREND} />
        <StatCard label="Nouveaux clients" value="31" delta={-6.1} deltaFormat={pct} sparklineData={SIGNUPS_TREND} />
      </div>
      {long &&
        Array.from({ length: 30 }, (_, i) => (
          <Text key={i}>Ligne {i + 1} — faites défiler : la barre reste collée en haut de la fenêtre.</Text>
        ))}
    </div>
  );
}

/** Une coquille qui tient l'onglet courant. */
function shell(long: boolean) {
  return function Render(args: HeaderLayoutProps) {
    const [current, setCurrent] = useState("apercu");
    const navItems = args.navItems?.map((item) => ({ ...item, active: item.id === current, onClick: () => setCurrent(item.id) }));
    return (
      <HeaderLayout {...args} navItems={navItems}>
        <PageContent title={navItems?.find((i) => i.active)?.label ?? "Tableau de bord"} long={long} />
      </HeaderLayout>
    );
  };
}

/**
 * La coquille d'application à barre haute : la marque, le menu horizontal, les actions.
 */
const meta = {
  title: "Layouts/HeaderLayout",
  component: HeaderLayout,
  parameters: {
    layout: "fullscreen", rdkPadding: 0,
    docs: {
      story: { inline: false, iframeHeight: "480px" },
      description: {
        component: [
          "**Coquille d'application** à navigation horizontale : une barre haute collante — marque, menu, actions — et la page dessous.",
          "",
          "**Quand l'utiliser** — une application à trois ou quatre sections de premier niveau, sans sous-menus, où l'on veut toute la largeur pour le contenu (tableaux larges, graphiques). Au-delà, ou avec des sections imbriquées, prenez `SidebarLayout`.",
          "",
          "**Anatomie** — une barre de 60 px qui **reste collée en haut** de la fenêtre pendant le défilement : `logo` à gauche, puis `navItems` en liens horizontaux, puis `actions` poussées à droite (recherche, notifications, `UserMenu`). Le contenu (`children`) vient dessous, avec une marge de `--lq-space-6`.",
          "",
          "**Menu (`navItems`)** — chaque entrée `{ id, label, href?, onClick?, active? }` est un vrai lien `<a>` (`href`, ou `#` à défaut ; avec `onClick`, le lien ne suit pas son `href`). `active` marque la page courante — en couleur de texte et en gras, et `aria-current=\"page\"` pour les lecteurs d'écran. Pas de sous-menus.",
          "",
          "**Écran étroit** — sous **860 px**, le menu disparaît de la barre au profit d'un bouton menu (à droite des actions, `aria-expanded`) qui déplie les entrées en liste verticale sous la barre ; un choix la referme. Sans `navItems`, pas de bouton. Le seuil se mesure sur la fenêtre ; avec `fullHeight={false}`, la coquille remplit son conteneur (`min-height: 100%`) et le seuil se mesure sur **sa** largeur (story « Dans un cadre »).",
          "",
          "**Thème** — la barre : `--lq-color-panel`, filet `--lq-color-border-subtle` ; les liens : `--lq-color-text-muted`, `--lq-color-text` (survol, page active), `--lq-font-weight-medium` / `--lq-font-weight-bold` ; la page : `--lq-color-bg`, `--lq-space-6`. Contrairement à la barre latérale, la couche ne la passe pas en bleu plein : elle garde le fond des panneaux.",
        ].join("\n"),
      },
    },
  },
  args: { logo: LOGO, navItems: NAV, actions: ACTIONS, children: null },
  argTypes: {
    logo: { control: false },
    navItems: { control: "object", table: { defaultValue: { summary: "[]" } } },
    actions: { control: false },
    children: { control: false },
  },
  render: shell(false),
} satisfies Meta<typeof HeaderLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Cliquez les entrées du menu : la page change de titre. À droite, deux boutons et le menu du compte." } } },
};

export const WithoutNav: Story = {
  name: "Sans menu",
  args: { navItems: undefined },
  parameters: { docs: { description: { story: "Une application d'une seule page : la marque et les actions, sans menu ni bouton de tiroir." } } },
};

export const StickyBar: Story = {
  name: "Barre collante",
  render: shell(true),
  parameters: { docs: { description: { story: "Faites défiler le cadre : la barre reste en haut, au-dessus du contenu." } } },
};

export const InFrame: Story = {
  name: "Dans un cadre",
  args: { fullHeight: false },
  decorators: [
    (Story) => (
      <div style={{ padding: 30 }}>
        <div style={{ width: 640, height: 420, border: "1px solid var(--lq-color-border)", overflow: "auto" }}>
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "`fullHeight={false}` dans un cadre de 640 px : la coquille remplit le cadre et replie son menu derrière le bouton, parce que **sa** largeur passe sous 860 px — quelle que soit celle de la fenêtre.",
      },
    },
  },
};
