import type { Meta, StoryObj } from "@storybook/react-vite";
import { PriceChangeTag } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * L'écart signé du kit : flèche, signe et valeur, en vert ou en rouge. C'est lui qu'on retrouve
 * dans `StatCard`, `HoldingCard`, `ComparisonCard` et les widgets de portefeuille.
 */
const meta = {
  title: "Finance/PriceChangeTag",
  component: PriceChangeTag,
  parameters: {
    docs: {
      description: {
        component: [
          "Affiche un **écart signé** — variation d'un cours, résultat, dérive d'une allocation — avec une flèche, le signe et la valeur, colorés selon le sens.",
          "",
          "**Quand l'utiliser** — partout où un chiffre dit « combien ça a bougé ». Pour un statut qui n'est pas un nombre (payée, annulée), prenez `Badge`. Pour un écart sous une grande valeur, `StatCard` l'intègre déjà via `delta`.",
          "",
          "**Comportement** — `value` est signé (`2.4`, `-1.1`). Le composant choisit seul la flèche, la couleur et le signe (`+`, ou le vrai signe moins `−`), puis passe la **valeur absolue** à `format`. Zéro compte comme une hausse : il s'affiche en vert, `+0,00 %`.",
          "",
          "**Format** — sans `format`, deux décimales et « % » dans la `locale` donnée, `fr-FR` par défaut : `2,37 %`, virgule décimale. `locale=\"en-US\"` rend `2.37 %`. `format` reprend la main pour changer d'unité (points, euros) ; il l'emporte sur `locale`.",
          "",
          "**Thème** — `--lq-color-up` et `--lq-color-down` (vert `#2e9e5b` et rouge `#c4213a` en clair, `#4cc38a` et `#ef6b7b` en sombre), `--lq-font-weight-bold`.",
        ].join("\n"),
      },
    },
  },
  args: { value: 2.37, locale: "fr-FR", showIcon: true },
  argTypes: {
    value: { control: { type: "number", step: 0.1 } },
    locale: { control: "text", table: { defaultValue: { summary: '"fr-FR"' } } },
    format: { control: false, table: { defaultValue: { summary: "deux décimales et « % » dans `locale`" } } },
    showIcon: { table: { defaultValue: { summary: "true" } } },
  },
} satisfies Meta<typeof PriceChangeTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Down: Story = {
  name: "Baisse",
  args: { value: -1.46 },
};

export const Zero: Story = {
  name: "Écart nul",
  args: { value: 0 },
  parameters: { docs: { description: { story: "Un écart nul est rendu comme une hausse — vert, flèche montante, `+0,00 %`." } } },
};

export const OtherUnits: Story = {
  name: "Autres unités",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
      <PriceChangeTag value={35} format={(v) => `${v} pts`} />
      <PriceChangeTag value={-1240} format={(v) => v.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} />
      <PriceChangeTag value={0.8} format={(v) => `${v.toLocaleString("fr-FR")} pt de base`} />
    </div>
  ),
  parameters: { docs: { description: { story: "`format` reçoit la valeur absolue : le signe et la flèche restent l'affaire du composant." } } },
};

export const WithoutIcon: Story = {
  name: "Sans flèche",
  args: { value: -1.2, showIcon: false },
  parameters: { docs: { description: { story: "Pour une colonne dense où la flèche se répète à chaque ligne : la couleur et le signe suffisent." } } },
};

export const KitDefaultFormat: Story = {
  name: "Format par défaut du kit",
  args: { value: 2.37, format: undefined },
  parameters: {
    docs: {
      description: { story: "Sans `format` ni `locale` : `+2,37 %`, au format français, avec le vrai signe moins en baisse. C'est le rendu qu'on obtient dans les composants qui n'exposent pas le format." },
    },
  },
};

export const Locale: Story = {
  name: "Autre locale",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
      <PriceChangeTag value={2.4} />
      <PriceChangeTag value={-1.1} />
      <PriceChangeTag value={2.4} locale="en-US" />
      <PriceChangeTag value={-1.1} locale="en-US" />
    </div>
  ),
  parameters: { docs: { description: { story: "`locale` ne change que le séparateur décimal du format par défaut : `+2,40 %` en `fr-FR`, `+2.40 %` en `en-US`. Le signe reste le vrai moins `−` (U+2212)." } } },
};
