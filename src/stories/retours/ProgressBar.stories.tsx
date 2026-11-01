import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ProgressBar } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ORDERS } from "../../showcase/demoData";

/** La répartition du chiffre d'affaires de la démo par produit, calculée sur les commandes payées. */
const PRODUITS = ["Abonnement annuel", "Module analytique", "Licence poste"] as const;
const COULEURS = ["var(--lq-color-accent)", "var(--lq-color-sky)", "var(--lq-color-green)"];
const REPARTITION = PRODUITS.map((p, i) => ({
  id: p,
  label: p,
  color: COULEURS[i],
  value: ORDERS.filter((o) => o.produit === p && o.statut === "payée").reduce((s, o) => s + o.montant, 0),
}));

/**
 * La barre de progression : déterminée, indéterminée, ou découpée en parts.
 */
const meta = {
  title: "Feedback/ProgressBar",
  component: ProgressBar,
  parameters: {
    docs: {
      description: {
        component: [
          "Barre de progression linéaire, sous trois formes. **Déterminée** avec `value` (de 0 à 100) : la barre se remplit d'autant, en glissant d'une valeur à l'autre. **Indéterminée** sans `value` : une bande parcourt la piste en boucle. **Segmentée** avec `segments` : la piste est partagée en parts colorées proportionnelles — une répartition plutôt qu'un avancement.",
          "",
          "**Quand l'utiliser** — un traitement dont on mesure l'avancement (import, export, téléversement), une jauge de consommation (stockage, quota), une répartition simple. Pour une attente sans mesure dans un petit espace, un `Spinner` ; pour un parcours en étapes nommées, un `Stepper` ; pour une répartition qu'il faut lire en détail, un vrai graphique.",
          "",
          "**Libellé et valeur** — `label` (un nœud) et la valeur chiffrée (`showValue`, mise en forme par `formatValue`) se placent **indépendamment** sur l'un des quatre bords de la barre ou dedans : `labelPosition` (défaut `top`) et `valuePosition` (défaut `right`) valent `top`, `bottom`, `left`, `right` ou `inside`. En `inside`, le texte se centre sur la piste dans une couleur qui reste lisible sur la partie pleine comme sur la vide — épaississez alors la barre (`thickness`, 6 px par défaut). La valeur ne s'affiche pas en mode indéterminé.",
          "",
          "**Segments** — chaque segment a un `id`, une `value` (sa largeur est sa part de la **somme** des valeurs, quelle que soit l'échelle), une `color` et un `label` montré dans l'infobulle native au survol. Avec `segments`, `value` et `showValue` sont ignorés. Le composant ne dessine pas de légende : si les parts doivent se lire sans survol, posez-la à côté.",
          "",
          "**Accessibilité** — en mode déterminé, la barre expose `aria-valuemin`, `aria-valuemax` et `aria-valuenow`.",
          "",
          "**Thème** — piste `--lq-color-fill-track`, remplissage `--lq-color-fill`, extrémités `--lq-radius-pill`, texte `--lq-color-text` et `--lq-color-text-muted`. `bordered` ajoute un filet `--lq-color-border` (la palette e-ink l'a d'office, ce thème non). Sous `prefers-reduced-motion`, ni glissement ni bande animée.",
        ].join("\n"),
      },
    },
  },
  args: { value: 64, label: "Import des contacts", showValue: true, formatValue: (v: number) => `${v} %` },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    label: { control: "text" },
    formatValue: { control: false },
    segments: { control: false },
  },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <ProgressBar {...args} />
    </div>
  ),
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Live: Story = {
  name: "Qui avance",
  parameters: { docs: { description: { story: "La barre glisse d'une valeur à la suivante plutôt que de sauter." } } },
  render: function Render(args) {
    const [v, setV] = useState(40);
    return (
      <div style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 12 }}>
        <ProgressBar {...args} value={v} label="Export des factures" />
        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={() => setV((x) => Math.max(0, x - 10))}>− 10 %</Button>
          <Button onClick={() => setV((x) => Math.min(100, x + 10))}>+ 10 %</Button>
        </div>
      </div>
    );
  },
};

export const MetricRow: Story = {
  name: "Ligne de mesure",
  args: {
    value: 82,
    label: "Stockage utilisé",
    labelPosition: "left",
    valuePosition: "right",
    formatValue: (v: number) => `${Math.round((v / 100) * 50)} Go / 50 Go`,
  },
  parameters: { docs: { description: { story: "Libellé à gauche, valeur à droite, la barre entre les deux : une jauge compacte pour un panneau de réglages." } } },
};

export const Inside: Story = {
  name: "Libellé dans la barre",
  args: { value: 64, label: "64 %", labelPosition: "inside", showValue: false, thickness: 18 },
  parameters: { docs: { description: { story: "En `inside`, le texte reste lisible à cheval sur la partie pleine et la partie vide." } } },
};

export const Indeterminate: Story = {
  name: "Indéterminée",
  args: { value: undefined, label: "Préparation de l'export…", showValue: false },
  parameters: { docs: { description: { story: "Sans `value` : on sait que ça avance, pas de combien." } } },
};

export const Segments: Story = {
  name: "Répartition",
  args: { label: "Chiffre d'affaires encaissé, par produit", segments: REPARTITION, thickness: 10, showValue: false },
  parameters: { docs: { description: { story: "Calculée sur les commandes payées de la démo. Survolez un segment : son libellé et sa valeur s'affichent dans l'infobulle native." } } },
};

export const Thick: Story = {
  name: "Épaisse et bordée",
  args: { value: 35, label: "Objectif trimestriel", thickness: 12, bordered: true, labelPosition: "bottom", valuePosition: "bottom" },
};
