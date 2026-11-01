import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatCard, BellIcon } from "@michaelthomasjach/liseuse-dashboard-kit";
import { REVENUE_TREND, SIGNUPS_TREND, CHURN_TREND } from "../../showcase/demoData";

const euro = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const pct = (n: number) => `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;

/**
 * La tuile d'indicateur. Dans le thème « resume », c'est une carte blanche à angles droits, sans
 * bordure, détachée par un souffle d'ombre, au libellé en capitales League Spartan.
 */
const meta = {
  title: "Finance/StatCard",
  component: StatCard,
  parameters: {
    docs: {
      description: {
        component: [
          "Tuile d'**indicateur clé** : un libellé, une grande valeur, et au choix un écart, une légende, une icône et une petite courbe de tendance.",
          "",
          "**Quand l'utiliser** — en rangée en haut d'un tableau de bord, une tuile par chiffre à surveiller. Pour un chiffre isolé qu'on veut mettre en avant sans cadre (un record, un plus haut), prenez `HighlightStatCard` ; pour deux chiffres face à face, `ComparisonCard` ; pour une valeur suivie d'un historique détaillé, `PortfolioSummaryWidget`.",
          "",
          "**Anatomie** — dans une `Panel` : `label` en haut, `value` en grand (c'est le plus gros texte de l'écran, voulu), puis `caption` (une ligne pâle qui dit de quoi la valeur est faite), puis `delta` rendu par un `PriceChangeTag`. `icon` se pose à droite du bloc. `sparklineData` (au moins deux points) ajoute une courbe de 120 × 32 px sous le tout.",
          "",
          "**Comportement** — `value` est un `ReactNode` : formatez-la vous-même (`toLocaleString(\"fr-FR\")`). `deltaFormat` reçoit la valeur absolue de l'écart et sert à l'écrire à la française. La courbe se colore selon sa **propre** pente (premier point contre dernier), indépendamment de `delta`. Ni l'écart ni la courbe ne savent si une baisse est une bonne nouvelle : une attrition qui baisse s'affiche en rouge.",
          "",
          "**Thème** — la carte : `--lq-color-panel`, `--lq-shadow-panel`, `--lq-radius-lg`, `--lq-space-5` ; le libellé : `--lq-caption-font`, `--lq-caption-size`, `--lq-caption-tracking`, `--lq-caption-transform` ; l'écart : `--lq-color-up`, `--lq-color-down`.",
        ].join("\n"),
      },
    },
  },
  args: {
    label: "Revenu mensuel",
    value: euro(80000),
    delta: 12.4,
    deltaFormat: pct,
    caption: "vs. mois précédent",
    sparklineData: REVENUE_TREND,
  },
  argTypes: {
    value: { control: "text" },
    caption: { control: "text" },
    delta: { control: { type: "number", step: 0.1 } },
    deltaFormat: { control: false },
    icon: { control: false },
  },
  render: (args) => (
    <div style={{ maxWidth: 300 }}>
      <StatCard {...args} />
    </div>
  ),
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Negative: Story = {
  name: "Écart négatif",
  args: { label: "Nouveaux clients", value: "31", delta: -6.1, sparklineData: SIGNUPS_TREND },
};

export const WithIcon: Story = {
  name: "Avec icône, sans courbe",
  args: {
    label: "Factures ouvertes",
    value: "17",
    caption: "dont 4 échues",
    delta: undefined,
    sparklineData: undefined,
    icon: <BellIcon size={18} />,
  },
};

export const ValueOnly: Story = {
  name: "Valeur seule",
  args: { label: "Clients actifs", value: "1 284", caption: undefined, delta: undefined, sparklineData: undefined },
  parameters: { docs: { description: { story: "Le minimum : un libellé et une valeur." } } },
};

export const GoodNewsInRed: Story = {
  name: "Une baisse qui est une bonne nouvelle",
  args: { label: "Attrition", value: "4,0 %", delta: -1.2, caption: "sur 30 jours glissants", sparklineData: CHURN_TREND },
  parameters: {
    docs: {
      description: {
        story: "L'attrition baisse, c'est bien — mais l'écart et la courbe s'affichent en rouge : le composant colore le **sens** du chiffre, pas sa signification. Le kit n'a pas de prop pour inverser la lecture.",
      },
    },
  },
};

export const Row: Story = {
  name: "Rangée d'indicateurs",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
      <StatCard label="Revenu mensuel" value={euro(80000)} delta={12.4} deltaFormat={pct} caption="vs. mois précédent" sparklineData={REVENUE_TREND} />
      <StatCard label="Nouveaux clients" value="31" delta={-6.1} deltaFormat={pct} caption="vs. mois précédent" sparklineData={SIGNUPS_TREND} />
      <StatCard label="Attrition" value="4,0 %" delta={-1.2} deltaFormat={pct} sparklineData={CHURN_TREND} />
      <StatCard label="Factures ouvertes" value="17" icon={<BellIcon size={18} />} caption="dont 4 échues" />
    </div>
  ),
  parameters: { docs: { description: { story: "L'usage type : une grille de tuiles en tête de page. La tuile prend toute la largeur de sa cellule." } } },
};
