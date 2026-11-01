import type { Meta, StoryObj } from "@storybook/react-vite";
import { HighlightStatCard, StatCard } from "@michaelthomasjach/liseuse-dashboard-kit";
import { REVENUE_TREND } from "../../showcase/demoData";

const euro = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const pct = (n: number) => `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;

/** Une tendance qui descend, pour le « plus bas » : le miroir de `REVENUE_TREND`. */
const LOW_TREND = [...REVENUE_TREND].reverse();

/**
 * Le chiffre mis en avant sans carte : un épais filet en tête, un libellé en petites capitales, la
 * valeur, une ligne d'explication.
 */
const meta = {
  title: "Finance/HighlightStatCard",
  component: HighlightStatCard,
  parameters: {
    docs: {
      description: {
        component: [
          "Tuile **sans cadre** pour un chiffre qui se suffit à lui-même : un plus haut sur un an, un record, un délai moyen. Elle est faite d'un filet épais en tête, d'un libellé pâle en capitales, de la valeur, d'une ligne de texte et, au choix, d'une courbe.",
          "",
          "**Quand l'utiliser** — un ou deux chiffres de contexte posés à côté d'un graphique ou en marge d'une page, là où une carte de plus alourdirait l'écran. Pour un indicateur suivi avec son écart, prenez `StatCard` (carte, écart en pastille, icône). Elle s'appuie sur la primitive `Highlight`.",
          "",
          "**Anatomie** — `label` (écrivez-le en casse normale : la feuille le passe en capitales), `value` (un `ReactNode`, à formater vous-même), `subtext` (une phrase courte, par exemple l'écart en toutes lettres), `sparklineData` (au moins deux points ; courbe de 220 × 36 px en aire, de la couleur de l'accent).",
          "",
          "**Pas d'écart chiffré** — contrairement à `StatCard`, il n'y a pas de `delta` : si l'écart compte, écrivez-le dans `subtext`.",
          "",
          "**Thème** — `--lq-color-text` pour le filet et la valeur, `--lq-color-text-muted` pour le libellé et la ligne de texte, `--lq-color-accent` pour la courbe, `--lq-font-weight-bold`, `--lq-space-3`.",
        ].join("\n"),
      },
    },
  },
  args: {
    label: "Plus haut sur 12 mois",
    value: euro(80000),
    subtext: "atteint en octobre",
    sparklineData: REVENUE_TREND,
  },
  argTypes: {
    value: { control: "text" },
    subtext: { control: "text" },
  },
  render: (args) => (
    <div style={{ maxWidth: 300 }}>
      <HighlightStatCard {...args} />
    </div>
  ),
} satisfies Meta<typeof HighlightStatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const WithoutSparkline: Story = {
  name: "Sans courbe",
  args: { label: "Délai moyen de paiement", value: "23 j", subtext: "3 jours de moins qu'en septembre", sparklineData: undefined },
};

export const HighAndLow: Story = {
  name: "Plus haut et plus bas",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 30 }}>
      <HighlightStatCard label="Plus haut sur 12 mois" value={euro(80000)} subtext="atteint en octobre" sparklineData={REVENUE_TREND} />
      <HighlightStatCard label="Plus bas sur 12 mois" value={euro(38000)} subtext="atteint en novembre 2025" sparklineData={LOW_TREND} />
    </div>
  ),
  parameters: { docs: { description: { story: "Le couple le plus fréquent : la courbe garde la couleur de l'accent, elle ne se colore pas selon sa pente." } } },
};

export const NextToStatCard: Story = {
  name: "À côté d'une StatCard",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20, alignItems: "start" }}>
      <StatCard label="Revenu mensuel" value={euro(80000)} delta={12.4} deltaFormat={pct} caption="vs. mois précédent" sparklineData={REVENUE_TREND} />
      <HighlightStatCard label="Plus haut sur 12 mois" value={euro(80000)} subtext="atteint en octobre" />
    </div>
  ),
  parameters: { docs: { description: { story: "La différence de poids entre les deux : la carte encadre un indicateur suivi, le filet souligne un chiffre de contexte." } } },
};
