import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  SidebarLayout,
  UserMenu,
  Breadcrumbs,
  StatCard,
  Heading,
  Text,
  Badge,
  HomeIcon,
  FileIcon,
  UserIcon,
  BarChartIcon,
  SettingsIcon,
  LogoutIcon,
  type SidebarLayoutProps,
  type SidebarNavItem,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { REVENUE_TREND, SIGNUPS_TREND, CHURN_TREND } from "../../showcase/demoData";

const pct = (n: number) => `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;

/** La marque de démonstration, en texte : sur la barre sombre, `--lq-color-text` est blanc. */
const LOGO = (
  <span style={{ fontSize: "1.375rem", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.04em", color: "var(--lq-color-text)" }}>resume</span>
);

/** Le menu de démonstration : des entrées simples, deux groupes, des seconds libellés (`details`) et
 *  une vignette imposée (`abbr`) pour le rail. */
const NAV: SidebarNavItem[] = [
  { id: "tableau", label: "Tableau de bord", icon: <HomeIcon size={18} />, details: "3 alertes" },
  { id: "factures", label: "Factures", icon: <FileIcon size={18} />, details: "17 ouvertes" },
  { id: "clients", label: "Clients", icon: <UserIcon size={18} /> },
  {
    id: "rapports",
    label: "Rapports",
    icon: <BarChartIcon size={18} />,
    children: [
      { id: "ventes", label: "Ventes" },
      { id: "tresorerie", label: "Trésorerie" },
      { id: "tva", label: "Déclarations de TVA", abbr: "tv" },
    ],
  },
  {
    id: "reglages",
    label: "Réglages",
    icon: <SettingsIcon size={18} />,
    children: [
      { id: "equipe", label: "Équipe" },
      { id: "facturation", label: "Facturation" },
    ],
  },
];

/** Marque l'entrée courante et branche la navigation — ce que ferait un routeur. */
function withActive(items: SidebarNavItem[], current: string, go: (id: string) => void): SidebarNavItem[] {
  return items.map((item) => ({
    ...item,
    active: item.id === current,
    onClick: () => go(item.id),
    children: item.children && withActive(item.children, current, go),
  }));
}

function labelOf(items: SidebarNavItem[], id: string): string {
  for (const item of items) {
    if (item.id === id) return item.label;
    const nested = item.children && labelOf(item.children, id);
    if (nested) return nested;
  }
  return "";
}

const ACCOUNT = [
  { id: "profil", label: "Mon profil", icon: <UserIcon size={16} /> },
  { id: "sortie", label: "Se déconnecter", icon: <LogoutIcon size={16} />, danger: true },
];

/** Le contenu de la page : assez pour voir où elle commence, et de quoi défiler avec `long`. */
function PageContent({ title, long = false }: { title: string; long?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <Heading level={3}>{title}</Heading>
        <Text muted size="sm">
          Le contenu de la page se rend ici.
        </Text>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
        <StatCard label="Revenu mensuel" value={"80 000 €"} delta={12.4} deltaFormat={pct} sparklineData={REVENUE_TREND} />
        <StatCard label="Nouveaux clients" value="31" delta={-6.1} deltaFormat={pct} sparklineData={SIGNUPS_TREND} />
        <StatCard label="Attrition" value="4,0 %" delta={-1.2} deltaFormat={pct} sparklineData={CHURN_TREND} />
      </div>
      {long &&
        Array.from({ length: 30 }, (_, i) => (
          <Text key={i}>
            Ligne {i + 1} — faites défiler : l'en-tête reste en haut de la fenêtre, sur un fond opaque.
          </Text>
        ))}
    </div>
  );
}

/** Une coquille qui tient la page courante, ouverte sur `initial`. */
function shell(initial: string) {
  return function Render(args: SidebarLayoutProps) {
    const [current, setCurrent] = useState(initial);
    const label = labelOf(args.navItems, current);
    return (
      <SidebarLayout
        {...args}
        navItems={withActive(args.navItems, current, setCurrent)}
        header={
          args.header ?? (
            <Breadcrumbs
              items={[
                { id: "accueil", label: "Accueil", onClick: () => setCurrent("tableau") },
                { id: current, label },
              ]}
            />
          )
        }
      >
        <PageContent title={label} long={args.stickyHeader} />
      </SidebarLayout>
    );
  };
}

/**
 * La coquille d'application à barre latérale — celle de la vitrine, en variante `rail`.
 */
const meta = {
  title: "Layouts/SidebarLayout",
  component: SidebarLayout,
  parameters: {
    layout: "fullscreen", rdkPadding: 0,
    // Une coquille occupe toute la fenêtre, et le rail est fixé à la fenêtre : chaque story a son cadre.
    docs: {
      story: { inline: false, iframeHeight: "560px" },
      description: {
        component: [
          "**Coquille d'application** à barre latérale : la marque et le menu à gauche, un en-tête optionnel au-dessus du contenu, et la page dessous. C'est la coquille de la vitrine elle-même, en variante `rail`.",
          "",
          "**Quand l'utiliser** — une application à plus de cinq ou six sections, ou à sections imbriquées : le menu vertical en tient beaucoup et accepte les sous-menus. Pour trois ou quatre sections de premier niveau, `HeaderLayout` (menu horizontal) laisse toute la largeur au contenu.",
          "",
          "### Les deux variantes (`variant`)",
          "",
          "- **`default`** — la barre (248 px) est **dans le flux** de la page, toujours dépliée : icône et libellé côte à côte. `details` et `abbr` n'y sont pas affichés.",
          "- **Hauteur** — par défaut (`fullHeight`), la coquille occupe au moins toute la hauteur de la fenêtre, tiroir et rail sont fixés à la fenêtre et la bascule en tiroir suit la largeur de la fenêtre. Avec `fullHeight={false}`, elle remplit son conteneur (`min-height: 100%`), tiroir et rail se placent par rapport à elle, et la bascule suit **sa** largeur (stories « Dans un cadre »).",
          "- **`rail`** — la barre est **fixée à la fenêtre** (elle ne défile pas avec la page) et **réduite à une colonne d'icônes** de 70 px. Elle s'ouvre **par-dessus** le contenu (280 px) au survol ou quand le focus clavier y entre. Le bouton rond de son en-tête l'**épingle** ouverte : le contenu se décale alors pour lui faire place. Chaque entrée y montre son libellé à gauche et sa **vignette** dans la colonne de droite — l'`icon`, ou pour une entrée sans icône (les sous-entrées) `abbr`, à défaut la première lettre du libellé en minuscule. `details` ajoute une seconde ligne, plus petite et plus pâle, sous le libellé (« 3 alertes »).",
          "",
          "Sous **900 px** de large, les deux variantes deviennent le même **tiroir** : une barre avec un bouton menu et la marque, et la barre latérale qui glisse par-dessus la page, sur un voile ; un choix ou un clic sur le voile la referme.",
          "",
          "### Menu (`navItems`)",
          "",
          "Chaque entrée : `{ id, label, icon?, href?, onClick?, active?, children?, details?, abbr? }`. Les entrées sont de vrais liens `<a>` (`href`, ou `#` à défaut ; avec `onClick`, le lien ne suit pas son `href` et c'est votre routeur qui navigue). `active` marque la page courante (`aria-current=\"page\"`) — c'est à vous de le calculer. Une entrée avec `children` devient un **groupe repliable** (bouton `aria-expanded`) : il s'ouvre de lui-même quand l'une de ses entrées devient active, mais reste repliable ; son propre `href` / `onClick` est ignoré.",
          "",
          "### Emplacements",
          "",
          "`logo` en tête de la barre (et dans la barre du tiroir sur mobile), `footer` épinglé au pied de la barre — typiquement un `UserMenu` avec `placement=\"top\"` —, `header` au-dessus du contenu (fil d'Ariane, titre, actions). `stickyHeader` garde cet en-tête en haut de la fenêtre pendant le défilement, sur un fond opaque légèrement flouté, et sur mobile la barre du tiroir aussi.",
          "",
          "### Épingle (`rail`)",
          "",
          "Non contrôlée par défaut : `defaultPinned` donne l'état initial. Contrôlée : passez `pinned` et mettez-le à jour dans `onPinnedChange`. Le bouton porte `aria-pressed` et le libellé « Épingler le menu » / « Détacher le menu ».",
          "",
          "### Thème",
          "",
          "La couche « resume » fait de la barre **la colonne bleue pleine du CV** : elle redéfinit les couleurs sous `[data-lq-region=\"sidebar\"]` (fond `#3a41e2`, texte blanc, libellés au repos à 78 % de blanc ; en sombre, le bleu nuit `#1c1f5c`), avec `--lq-sidebar-head-bg` (en-tête du rail), `--lq-sidebar-head-border` et `--lq-sidebar-sub-bg` (fond des sous-menus dépliés). Le kit lit aussi `--lq-sidebar-rail-width` (70 px), `--lq-sidebar-open-width` (280 px), `--lq-sidebar-head-height` (60 px), `--lq-sidebar-font-size`, `--lq-sidebar-sub-font-size` et `--lq-sidebar-tree` (traits des sous-menus en variante par défaut). La page : `--lq-color-bg`, `--lq-space-6`.",
        ].join("\n"),
      },
    },
  },
  args: {
    logo: LOGO,
    navItems: NAV,
    children: null,
    variant: "default",
    stickyHeader: false,
    defaultPinned: false,
    onPinnedChange: fn(),
  },
  argTypes: {
    logo: { control: false },
    navItems: { control: false },
    footer: { control: false },
    header: { control: false },
    children: { control: false },
    variant: { control: "inline-radio", options: ["default", "rail"], table: { defaultValue: { summary: '"default"' } } },
    pinned: { control: "boolean", if: { arg: "variant", eq: "rail" } },
    defaultPinned: { control: "boolean", if: { arg: "variant", eq: "rail" } },
  },
  render: shell("tableau"),
} satisfies Meta<typeof SidebarLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  args: { footer: <UserMenu name="Claire Lemoine" subtitle="Administratrice" items={ACCOUNT} placement="top" /> },
  parameters: { docs: { description: { story: "La barre dans le flux de la page, un `UserMenu` à son pied, un fil d'Ariane en en-tête. Cliquez les entrées : « Rapports » et « Réglages » sont des groupes repliables." } } },
};

export const OpenSubmenu: Story = {
  name: "Sous-menu ouvert",
  args: { footer: <UserMenu name="Claire Lemoine" subtitle="Administratrice" items={ACCOUNT} placement="top" /> },
  render: shell("tresorerie"),
  parameters: { docs: { description: { story: "La page courante est une sous-entrée : son groupe s'ouvre de lui-même. Un trait relie les sous-entrées ; celui de la page courante prend la couleur d'accent — blanche sur la colonne bleue de la couche." } } },
};

export const Rail: Story = {
  name: "Rail",
  args: { variant: "rail", stickyHeader: true },
  render: shell("tresorerie"),
  parameters: {
    docs: {
      description: {
        story:
          "Le rail réduit : les icônes des entrées, et pour les sous-entrées du groupe ouvert leur vignette — `v` et `t` (première lettre), `tv` (`abbr`). **Survolez** la barre ou entrez-y au clavier : elle s'ouvre par-dessus la page, avec les libellés et leurs `details`. Le rond en haut à droite l'épingle.",
      },
    },
  },
};

export const RailPinned: Story = {
  name: "Rail épinglé (contrôlé)",
  args: { variant: "rail", stickyHeader: true },
  render: function Render(args) {
    const [pinned, setPinned] = useState(true);
    const [current, setCurrent] = useState("factures");
    return (
      <SidebarLayout
        {...args}
        pinned={pinned}
        onPinnedChange={(next) => {
          setPinned(next);
          args.onPinnedChange?.(next);
        }}
        navItems={withActive(args.navItems, current, setCurrent)}
        header={
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Breadcrumbs items={[{ id: "accueil", label: "Accueil", onClick: () => setCurrent("tableau") }, { id: current, label: labelOf(NAV, current) }]} />
            <Badge tone={pinned ? "info" : "neutral"}>{pinned ? "épinglé" : "détaché"}</Badge>
          </div>
        }
      >
        <PageContent title={labelOf(NAV, current)} />
      </SidebarLayout>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "`pinned` est tenu par la story et mis à jour dans `onPinnedChange` : la barre reste ouverte, le contenu est décalé de 280 px, et les `details` (« 3 alertes », « 17 ouvertes ») se lisent sous les libellés. Cliquez le rond plein pour détacher.",
      },
    },
  },
};

export const StickyHeader: Story = {
  name: "En-tête fixe",
  args: { stickyHeader: true, footer: <UserMenu name="Claire Lemoine" subtitle="Administratrice" items={ACCOUNT} placement="top" /> },
  parameters: { docs: { description: { story: "`stickyHeader` : faites défiler le cadre, le fil d'Ariane reste en haut, sur un fond opaque et une ombre légère." } } },
};

export const InFrame: Story = {
  name: "Dans un cadre",
  args: { fullHeight: false },
  decorators: [
    (Story) => (
      <div style={{ padding: 30 }}>
        <div style={{ width: 720, height: 460, border: "1px solid var(--lq-color-border)", overflow: "auto" }}>
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "`fullHeight={false}` dans un cadre de 720 px : sous 900 px de **sa** largeur, la barre devient un tiroir ; le bouton menu l'ouvre dans le cadre, voile compris, et non sur toute la fenêtre.",
      },
    },
  },
};

export const RailInFrame: Story = {
  name: "Rail dans un cadre",
  args: { fullHeight: false, variant: "rail", stickyHeader: true },
  decorators: [
    (Story) => (
      <div style={{ padding: 30 }}>
        <div style={{ width: 1000, height: 460, border: "1px solid var(--lq-color-border)", overflow: "auto" }}>
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: "Le rail dans un cadre de 1 000 px : fixé à la coquille et non à la fenêtre, il s'ouvre au survol par-dessus le contenu du cadre.",
      },
    },
  },
};

export const NestedInRail: Story = {
  name: "Coquille imbriquée dans un rail",
  args: { variant: "rail", stickyHeader: true },
  render: (args) => (
    <SidebarLayout {...args} header={<Breadcrumbs items={[{ id: "accueil", label: "Accueil" }, { id: "apercu", label: "Aperçu d'écran" }]} />}>
      <div style={{ width: 960, height: 420, border: "1px solid var(--lq-color-border)", overflow: "auto" }}>
        <SidebarLayout fullHeight={false} logo={LOGO} navItems={NAV} header={<Breadcrumbs items={[{ id: "accueil", label: "Accueil" }, { id: "tableau", label: "Tableau de bord" }]} />}>
          <PageContent title="Tableau de bord" />
        </SidebarLayout>
      </div>
    </SidebarLayout>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Une coquille `default` dans le contenu d'une coquille `rail` — la maquette d'un écran dans une application qui a déjà son rail. Les règles du rail sont bornées à **leur** coquille (enfants directs, `:where()` pour ne pas changer la spécificité) : la barre imbriquée garde son logo, ses marges, ses libellés et son en-tête ordinaires.",
      },
    },
  },
};
