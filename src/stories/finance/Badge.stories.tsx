import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ORDERS, statutTone } from "../../showcase/demoData";

/**
 * La pastille de statut. Dans le thème « resume », elle perd son arrondi (`--lq-radius-pill` à 0,
 * comme tout le CV) et prend les couleurs d'état du thème.
 */
const meta = {
  title: "Primitives/Badge",
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: [
          "Petite pastille qui **nomme un état** : le statut d'une commande, d'un dossier, d'une position, la gravité d'une alerte. Elle porte un mot, jamais une action — elle n'est ni cliquable ni focalisable.",
          "",
          "**Quand l'utiliser** — un statut court dans une cellule de tableau, au bout d'une ligne de liste, à côté d'un titre. Pour un **écart chiffré** (+2,4 %), prenez `PriceChangeTag` ; pour une étiquette **amovible** (filtre actif), `Tag` ; pour un filtre qu'on allume et éteint, `Chip` ; pour **prévenir** l'utilisateur d'un événement, `Notification`.",
          "",
          "**Anatomie et tons** — un `<span>` (arrondi dans le kit, à angle droit dans ce thème) qui contient `children` (texte court, en minuscules : les statuts ne passent pas en capitales). Cinq tons : `neutral` (défaut, gris), `up` (réussi, payé, actif), `down` (annulé, rejeté, en échec), `warning` (en attente, à relancer), `info` (information neutre mais notable).",
          "",
          "**Accessibilité** — la couleur n'est jamais le seul signal : c'est le mot qui porte le sens. Évitez une pastille sans texte.",
          "",
          "**Thème** — `--lq-color-up`, `--lq-color-down`, `--lq-color-warning`, `--lq-color-info` pour les tons, `--lq-color-hover` pour le fond du ton neutre, `--lq-radius-pill`, `--lq-font-weight-bold`.",
        ].join("\n"),
      },
    },
  },
  args: { children: "payée", tone: "up" },
  argTypes: {
    children: { control: "text" },
    tone: { control: "inline-radio", options: ["neutral", "up", "down", "warning", "info"], table: { defaultValue: { summary: '"neutral"' } } },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Tones: Story = {
  name: "Les cinq tons",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
      <Badge>brouillon</Badge>
      <Badge tone="up">payée</Badge>
      <Badge tone="down">annulée</Badge>
      <Badge tone="warning">en attente</Badge>
      <Badge tone="info">relancée</Badge>
    </div>
  ),
  parameters: { docs: { description: { story: "Sans `tone`, la pastille est neutre : un état sans jugement (brouillon, archivé)." } } },
};

export const OrderStatuses: Story = {
  name: "Statuts de commande",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 420 }}>
      {ORDERS.slice(0, 5).map((order) => (
        <div key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <span>
            {order.id} · {order.client}
          </span>
          <Badge tone={statutTone(order.statut)}>{order.statut}</Badge>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "L'usage le plus courant : un statut métier traduit en ton par **une seule** fonction de correspondance (ici `statutTone`), partagée par tous les écrans qui affichent la même colonne.",
      },
    },
  },
};
