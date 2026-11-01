import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertList, Button, Text, type AlertListItem } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ORDERS } from "../../showcase/demoData";

const enAttente = ORDERS.filter((o) => o.statut === "en attente");

const ALERTES: AlertListItem[] = [
  { id: "stock", level: "warning", message: "Stock bas sur « Câble USB-C 2 m » : 14 unités, seuil 50.", action: <Button>Commander</Button> },
  { id: "synchro", level: "info", message: "La synchronisation comptable de cette nuit s'est terminée à 03:12." },
  {
    id: "impayes",
    level: "critical",
    message: `${enAttente.length} commandes attendent leur paiement (${enAttente.map((o) => o.id).join(", ")}).`,
    action: <Button>Relancer</Button>,
  },
  { id: "certificat", level: "warning", message: "Le certificat de signature expire dans 9 jours." },
];

/**
 * La liste des alertes en cours, triée par gravité.
 */
const meta = {
  title: "Feedback/AlertList",
  component: AlertList,
  parameters: {
    docs: {
      description: {
        component: [
          "Une liste d'**alertes persistantes** : ce qui reste affiché tant que la situation dure — un stock bas, des impayés, un certificat qui expire. Chaque ligne porte une icône de gravité, un message, et au besoin une action en bout de ligne (« Commander », « Relancer »).",
          "",
          "**Trois niveaux** — `critical` (rouge, icône d'erreur), `warning` (moutarde, triangle), `info` (bleu, i). Par défaut les critiques passent devant, puis les avertissements, puis les informations ; à gravité égale, l'ordre d'arrivée est gardé. `sort={false}` respecte l'ordre donné.",
          "",
          "**Quand l'utiliser** — un panneau « À traiter » sur un tableau de bord, l'en-tête d'une fiche. Pour un événement ponctuel qui disparaît de lui-même (« Facture envoyée »), une `Notification` ; pour un message unique en tête de page, une seule ligne de cette liste suffit.",
          "",
          "**Données** — `alerts` est un tableau de `{ level, message, action?, id? }` ; `message` et `action` sont des nœuds. Donnez un `id` stable dès que la liste change (une alerte résolue, un nouveau tri) : React garde alors chaque ligne à sa place. La liste n'a pas d'état : pour résoudre une alerte, l'appelant la retire du tableau.",
          "",
          "**Vide** — sans alerte, rien n'est rendu, sauf `emptyText` s'il est fourni (« Aucune alerte en cours »). `compact` resserre les lignes pour une colonne étroite.",
          "",
          "**Accessibilité** — les lignes critiques sont annoncées aux lecteurs d'écran (`role=\"alert\"`), les autres non : une liste relue à chaque rafraîchissement ne doit pas bavarder. Chaque icône porte un nom (« Critique », « Avertissement », « Information »).",
          "",
          "**Thème** — chaque ligne est un cadre `--lq-color-border-subtle` sur `--lq-color-panel`, marqué à gauche d'un trait de son ton : `--lq-color-danger`, `--lq-color-warning` ou `--lq-color-info` (la ligne critique prend en plus un voile de ce ton). Angles `--lq-radius-md`, texte en `--lq-text-sm`, écarts `--lq-space-1` à `--lq-space-3`.",
        ].join("\n"),
      },
    },
  },
  args: { alerts: ALERTES, emptyText: "Aucune alerte en cours." },
  argTypes: {
    alerts: { control: false },
    emptyText: { control: "text" },
  },
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <AlertList {...args} />
    </div>
  ),
} satisfies Meta<typeof AlertList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Données en désordre, rendues triées : la critique d'abord, puis les deux avertissements dans leur ordre d'arrivée, puis l'information." } } },
};

export const Unsorted: Story = {
  name: "Ordre donné",
  args: { sort: false },
  parameters: { docs: { description: { story: "`sort={false}` : l'ordre du tableau est respecté — pour un fil chronologique." } } },
};

export const Compact: Story = {
  name: "Compacte",
  args: {
    compact: true,
    alerts: [
      { id: "quai", level: "critical", message: "Quai 3 saturé." },
      { id: "retard", level: "warning", message: "2 livraisons en retard." },
      { id: "maj", level: "info", message: "Mise à jour prévue dimanche." },
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 300 }}>
      <AlertList {...args} />
    </div>
  ),
};

export const Resolve: Story = {
  name: "Résoudre les alertes",
  parameters: { docs: { description: { story: "La liste n'a pas d'état : « Résoudre » retire la première alerte du tableau de l'appelant. Une fois tout résolu, `emptyText` prend la place." } } },
  render: function Render(args) {
    const [alertes, setAlertes] = useState(ALERTES);
    return (
      <div style={{ maxWidth: 640, display: "flex", flexDirection: "column", gap: 12 }}>
        <AlertList {...args} alerts={alertes} emptyText={<Text size="sm" muted>Aucune alerte en cours.</Text>} />
        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={() => setAlertes((a) => a.slice(1))} disabled={alertes.length === 0}>
            Résoudre la première
          </Button>
          <Button onClick={() => setAlertes(ALERTES)}>Rétablir</Button>
        </div>
      </div>
    );
  },
};

export const Empty: Story = {
  name: "Vide",
  args: { alerts: [], emptyText: "Aucune alerte en cours. Tout est à jour." },
  parameters: { docs: { description: { story: "Sans `emptyText`, une liste vide ne rend rien du tout." } } },
};
