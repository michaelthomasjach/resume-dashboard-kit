import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TabbedCard, PanelRow, Text, Badge, SettingsIcon, UserIcon, BellIcon, type TabbedCardTab } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ORDERS, statutTone } from "../../showcase/demoData";

const euros = (n: number) => `${n.toLocaleString("fr-FR")} €`;
const LEMOINE = ORDERS.filter((o) => o.client === "Lemoine SAS" || o.client === "Atelier Nord");

const CLIENT_TABS: TabbedCardTab[] = [
  {
    id: "commandes",
    label: "Commandes",
    content: (
      <>
        {LEMOINE.map((o) => (
          <PanelRow key={o.id} label={`${o.id} — ${o.produit}`} value={euros(o.montant)} />
        ))}
      </>
    ),
  },
  {
    id: "factures",
    label: "Factures",
    content: (
      <>
        {LEMOINE.map((o) => (
          <PanelRow key={o.id} label={`F-${o.id.slice(2)}`} value={<Badge tone={statutTone(o.statut)}>{o.statut}</Badge>} />
        ))}
      </>
    ),
  },
  { id: "notes", label: "Notes", content: <Text size="sm">Client historique, renouvelle chaque année en décembre.</Text> },
];

const SETTINGS_TABS: TabbedCardTab[] = [
  {
    id: "general",
    label: "Général",
    icon: <SettingsIcon size={16} />,
    content: (
      <>
        <PanelRow label="Langue" value="Français" />
        <PanelRow label="Fuseau" value="Europe/Paris" />
        <PanelRow label="Devise" value="EUR" />
      </>
    ),
  },
  { id: "equipe", label: "Équipe", icon: <UserIcon size={16} />, content: <PanelRow label="Membres" value="12" /> },
  { id: "alertes", label: "Alertes", icon: <BellIcon size={16} />, content: <PanelRow label="Canal" value="Courriel" /> },
];

/**
 * La carte à onglets : une barre d'onglets en tête (ou sur le côté) et le contenu de l'onglet actif
 * dessous.
 */
const meta = {
  title: "Primitives/TabbedCard",
  component: TabbedCard,
  parameters: {
    docs: {
      description: {
        component: [
          "Une carte dont le corps est réparti en onglets. Chaque entrée de `tabs` porte, en plus de celles d'un onglet de `Tabs` (`id`, `label`, `icon`, `disabled`), son `content` : la carte affiche celui de l'onglet actif.",
          "",
          "**Quand l'utiliser** — plusieurs facettes d'un même objet dans une seule carte : les commandes, factures et notes d'un client ; les rubriques de réglages. Si le contenu des onglets occupe tout l'écran, ou doit vivre ailleurs que dans la carte, utilisez `Tabs` seul et affichez le contenu vous-même.",
          "",
          "**Orientation** — `horizontal` (défaut) : les onglets en rangée sous le titre ; `vertical` : une colonne à gauche, le contenu à droite, pour des rubriques de réglages.",
          "",
          "**État** — non contrôlé par défaut : le premier onglet, ou `defaultTabId` ; contrôlé avec `value` et `onChange(id)`.",
          "",
          "**Accessibilité** — la barre est un `Tabs` : `role=\"tablist\"`, onglets en `role=\"tab\"`, Tab pour passer de l'un à l'autre, Entrée ou Espace pour activer.",
          "",
          "**Thème** — la coquille de `Card` (`--lq-color-panel`, `--lq-color-panel-border`, `--lq-radius-lg`, `--lq-shadow-panel`, `--lq-space-3` à `--lq-space-5`) et la barre de `Tabs` (`--lq-color-accent`, `--lq-caption-*`).",
        ].join("\n"),
      },
    },
  },
  args: { title: "Lemoine SAS", tabs: CLIENT_TABS, onChange: fn() },
  argTypes: {
    title: { control: "text" },
    tabs: { control: false },
    value: { control: false },
    // Lu au premier rendu seulement : le changer ensuite ne ferait rien.
    defaultTabId: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 520 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TabbedCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Vertical: Story = {
  name: "Verticale",
  args: { title: "Paramètres", tabs: SETTINGS_TABS, orientation: "vertical" },
};

export const DefaultTab: Story = {
  name: "Onglet de départ",
  args: { defaultTabId: "notes" },
  parameters: { docs: { description: { story: "`defaultTabId` choisit l'onglet ouvert au premier rendu." } } },
};

export const Controlled: Story = {
  name: "Contrôlée",
  render: function Render(args) {
    const [tab, setTab] = useState("factures");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <TabbedCard
          {...args}
          value={tab}
          onChange={(id) => {
            setTab(id);
            args.onChange?.(id);
          }}
        />
        <Text size="sm" muted>
          Onglet tenu par le parent : {tab}
        </Text>
      </div>
    );
  },
};
