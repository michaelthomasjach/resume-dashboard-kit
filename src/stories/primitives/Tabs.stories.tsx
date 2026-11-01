import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Tabs, Panel, PanelRow, UserIcon, CreditCardIcon, BellIcon, LockIcon } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ORDERS } from "../../showcase/demoData";

const ACCOUNT_TABS = [
  { id: "profil", label: "Profil", icon: <UserIcon size={16} /> },
  { id: "facturation", label: "Facturation", icon: <CreditCardIcon size={16} /> },
  { id: "alertes", label: "Alertes", icon: <BellIcon size={16} /> },
  { id: "securite", label: "Sécurité", icon: <LockIcon size={16} />, disabled: true },
];

const REPORT_TABS = [
  { id: "ventes", label: "Ventes" },
  { id: "clients", label: "Clients" },
  { id: "stocks", label: "Stocks" },
];

const euros = (n: number) => `${n.toLocaleString("fr-FR")} €`;

/**
 * La barre d'onglets soulignée. L'onglet actif porte un trait d'accent qui glisse de l'un à
 * l'autre ; les intitulés suivent le style des petites capitales du thème.
 */
const meta = {
  title: "Primitives/Tabs",
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: [
          "Barre d'onglets pour passer d'une vue à l'autre au sein d'un même écran : Profil / Facturation / Alertes, Positions / Ordres / Historique. L'indicateur de l'onglet actif **glisse** jusqu'au nouvel onglet au lieu de sauter.",
          "",
          "**Le composant ne rend que la barre** — le contenu reste à la charge du parent, qui l'affiche d'après `value`. Pour une carte dont le corps change avec l'onglet, `TabbedCard` fait les deux d'un coup. Pour régler la vue courante (une période, une densité) plutôt que d'en changer, `SegmentedControl`.",
          "",
          "**Toujours contrôlé** — `value` (l'`id` de l'onglet actif) et `onChange(id)` sont obligatoires.",
          "",
          "**Onglets** — chaque entrée de `items` porte un `id`, un `label`, une `icon` facultative et peut être `disabled` (grisé, inactif).",
          "",
          "**Orientation** — `horizontal` (défaut) : une rangée soulignée d'un filet ; `vertical` : une colonne, l'indicateur sur le bord, pour une navigation latérale de réglages.",
          "",
          "**Accessibilité** — `role=\"tablist\"` avec `aria-orientation`, chaque onglet en `role=\"tab\"` avec `aria-selected`. Un seul arrêt de tabulation, l'onglet actif ; ← → (↑ ↓ en vertical) passent à l'onglet voisin et l'activent, Début et Fin aux extrémités, en sautant les onglets désactivés et en bouclant.",
          "",
          "**Thème** — `--lq-color-accent` (indicateur), `--lq-color-border-subtle` (filet), `--lq-color-text`, `--lq-color-text-muted`, `--lq-color-hover`, et les intitulés : `--lq-caption-font`, `--lq-caption-size`, `--lq-caption-weight`, `--lq-caption-tracking`, `--lq-caption-transform`.",
        ].join("\n"),
      },
    },
  },
  args: { items: ACCOUNT_TABS, value: "profil", onChange: fn() },
  argTypes: { items: { control: false }, value: { control: "text" } },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return (
      <Tabs
        {...args}
        value={value}
        onChange={(id) => {
          setValue(id);
          args.onChange(id);
        }}
      />
    );
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const TextOnly: Story = {
  name: "Texte seul",
  args: { items: REPORT_TABS, value: "ventes" },
};

export const Vertical: Story = {
  name: "Vertical",
  args: { items: REPORT_TABS, value: "clients", orientation: "vertical" },
  parameters: { docs: { description: { story: "Une colonne d'onglets, pour une navigation latérale." } } },
};

export const WithContent: Story = {
  name: "Avec son contenu",
  render: function Render() {
    const [tab, setTab] = useState("payee");
    const tabs = [
      { id: "payee", label: "Payées" },
      { id: "en-attente", label: "En attente" },
      { id: "annulee", label: "Annulées" },
    ];
    const statut = { payee: "payée", "en-attente": "en attente", annulee: "annulée" }[tab];
    const rows = ORDERS.filter((o) => o.statut === statut);
    return (
      <div style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 12 }}>
        <Tabs items={tabs} value={tab} onChange={setTab} />
        <Panel title="Commandes" meta={`${rows.length}`}>
          {rows.map((o) => (
            <PanelRow key={o.id} label={`${o.id} — ${o.client}`} value={euros(o.montant)} />
          ))}
        </Panel>
      </div>
    );
  },
  parameters: { docs: { description: { story: "Le parent tient l'onglet actif et choisit lui-même ce qu'il affiche dessous." } } },
};
