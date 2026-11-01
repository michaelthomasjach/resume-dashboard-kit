import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button, Tag, Text } from "@michaelthomasjach/liseuse-dashboard-kit";

const FILTRES = ["Lyon", "Q4 2026", "Prioritaire", "Payée"];

/**
 * L'étiquette : un petit libellé encadré, retirable ou non.
 */
const meta = {
  title: "Forms/Tag",
  component: Tag,
  parameters: {
    docs: {
      description: {
        component: [
          "Une étiquette : un libellé court dans un cadre discret. Avec `onRemove`, elle porte un petit × qui la retire ; sans, c'est une étiquette en lecture seule. C'est la pièce qu'empile `TagInput`, et elle sert seule pour montrer des filtres actifs ou les catégories d'un élément.",
          "",
          "**Quand l'utiliser** — dire ce qui **est** appliqué ou attaché (un filtre actif, un mot-clé), avec la possibilité de l'enlever. Pour un état qu'on allume et éteint, c'est une `Chip` ; pour un statut coloré (payée, en retard), un `Badge`.",
          "",
          "**Comportement** — le × est un vrai bouton : Tab y mène, Entrée ou Espace retire l'étiquette. Son libellé accessible vaut « Retirer » par défaut ; donnez-lui le nom de l'étiquette par `removeLabel` (« Retirer Lyon »), sinon un lecteur d'écran entend une suite de « Retirer » indistincts. Le clic sur le × ne remonte pas aux parents (`stopPropagation`) : une étiquette posée dans une ligne cliquable ne déclenche pas la ligne.",
          "",
          "**Composant sans état** — il ne se retire pas de lui-même : c'est l'appelant qui l'enlève de sa liste dans `onRemove`.",
          "",
          "**Thème** — fond `--lq-color-hover`, cadre `--lq-color-border-subtle`, texte `--lq-color-text` en `--lq-font-weight-semibold` ; le × est en `--lq-color-text-muted` et passe à `--lq-color-danger` au survol. La taille du texte et les marges intérieures sont écrites en dur dans le kit, et l'étiquette n'a pas de rayon : le thème ne peut pas l'arrondir. Elle apparaît avec un léger effet d'échelle, coupé si l'utilisateur réduit les animations.",
        ].join("\n"),
      },
    },
  },
  args: { children: "Lyon", onRemove: fn(), removeLabel: "Retirer Lyon" },
  argTypes: {
    children: { control: "text" },
    onRemove: { control: false },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const ReadOnly: Story = {
  name: "Lecture seule",
  args: { children: "Grand compte", onRemove: undefined, removeLabel: undefined },
  parameters: { docs: { description: { story: "Sans `onRemove`, pas de × : une étiquette qu'on montre sans pouvoir l'enlever." } } },
};

export const ActiveFilters: Story = {
  name: "Filtres actifs",
  parameters: { docs: { description: { story: "L'usage type : la rangée des filtres appliqués au-dessus d'une liste, chacun retirable, et un lien pour tout rétablir." } } },
  render: function Render(args) {
    const [filtres, setFiltres] = useState(FILTRES);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          <Text size="sm" muted>
            Filtres :
          </Text>
          {filtres.map((f) => (
            <Tag
              key={f}
              removeLabel={`Retirer ${f}`}
              onRemove={() => {
                setFiltres((all) => all.filter((x) => x !== f));
                args.onRemove?.();
              }}
            >
              {f}
            </Tag>
          ))}
          {filtres.length === 0 ? (
            <Text size="sm" muted>
              aucun
            </Text>
          ) : null}
        </div>
        {filtres.length < FILTRES.length ? <Button onClick={() => setFiltres(FILTRES)}>Rétablir les filtres</Button> : null}
      </div>
    );
  },
};

export const Mixed: Story = {
  name: "Étiquettes d'un dossier",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      <Tag>Import automatique</Tag>
      <Tag>2026</Tag>
      <Tag onRemove={() => {}} removeLabel="Retirer Relance">
        Relance
      </Tag>
      <Tag onRemove={() => {}} removeLabel="Retirer Litige">
        Litige
      </Tag>
    </div>
  ),
  parameters: { docs: { description: { story: "Les étiquettes posées par le système restent en lecture seule ; celles de l'utilisateur se retirent." } } },
};
