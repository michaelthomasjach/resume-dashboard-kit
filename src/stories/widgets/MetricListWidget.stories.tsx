import type { Meta, StoryObj } from "@storybook/react-vite";
import { MetricListWidget, Badge } from "@michaelthomasjach/liseuse-dashboard-kit";
import { INDOOR_TEMPERATURES, SERVICES } from "../../showcase/widgetData";

/**
 * Le plus simple des widgets, et le plus réutilisé : un panneau titré, une liste de libellés et
 * de valeurs.
 */
const meta = {
  title: "Widgets/MetricListWidget",
  component: MetricListWidget,
  parameters: {
    docs: {
      description: {
        component: [
          "Un **panneau libellé / valeur** : un titre, une méta à droite du titre, puis une rangée par mesure — le libellé à gauche, la valeur en gras à droite, un filet entre deux rangées.",
          "",
          "**Quand l'utiliser** — dès qu'on a une poignée de valeurs de même nature à lister : températures par pièce, disponibilité par service, chiffres d'un compte. Pour des lignes de natures mêlées (détails, jauge), prenez `EnergyWidget` ; pour une commande par ligne, `LightsWidget` ou `ShuttersWidget` ; pour plus de colonnes, un `DataTable`.",
          "",
          "**Données** — `rows` est une liste de `{ id, label, value }`. `value` est un `ReactNode` : un texte déjà formaté le plus souvent, mais aussi une pastille (`Badge`), une tendance, un lien. Le widget n'aligne pas les décimales et ne formate rien : la locale reste à l'application.",
          "",
          "**Comportement** — affichage seul, sans tri ni clic. `title` est requis ; `meta` dit la période ou le compte (« 30 derniers jours », « 5 pièces »).",
          "",
          "**Thème** — celles de `Panel` et `PanelRow` : `--lq-color-panel`, `--lq-color-panel-border`, `--lq-radius-lg`, `--lq-shadow-panel`, `--lq-row-font-size`, `--lq-color-border-subtle` (filets), `--lq-label-*` (titre), `--lq-space-1` à `--lq-space-5`.",
        ].join("\n"),
      },
    },
  },
  args: { title: "Disponibilité", meta: "30 derniers jours", rows: SERVICES },
  argTypes: {
    title: { control: "text" },
    meta: { control: "text" },
    rows: { control: false },
  },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <MetricListWidget {...args} />
    </div>
  ),
} satisfies Meta<typeof MetricListWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Temperatures: Story = {
  name: "Températures par pièce",
  args: { title: "Intérieur", meta: `${INDOOR_TEMPERATURES.length} pièces`, rows: INDOOR_TEMPERATURES },
};

export const RichValues: Story = {
  name: "Valeurs enrichies",
  args: {
    title: "Services",
    meta: "état en direct",
    rows: [
      { id: "api", label: "API publique", value: <Badge tone="up">Opérationnel</Badge> },
      { id: "paiement", label: "Paiements", value: <Badge tone="up">Opérationnel</Badge> },
      { id: "mail", label: "Envoi d'e-mails", value: <Badge tone="warning">Dégradé</Badge> },
      { id: "recherche", label: "Recherche", value: <Badge tone="down">Interrompu</Badge> },
    ],
  },
  parameters: { docs: { description: { story: "`value` accepte n'importe quel contenu : ici une pastille d'état." } } },
};

export const NoMeta: Story = {
  name: "Sans méta",
  args: { title: "Compte", meta: undefined, rows: [{ id: "plan", label: "Abonnement", value: "Équipe" }, { id: "sieges", label: "Sièges", value: "12 / 15" }, { id: "renouv", label: "Renouvellement", value: "1er déc. 2026" }] },
};
