import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TagInput, Text, type TagInputSuggestion } from "@michaelthomasjach/liseuse-dashboard-kit";

const SEGMENTS: TagInputSuggestion[] = [
  { value: "grand-compte", label: "Grand compte", description: "Plus de 50 000 € par an" },
  { value: "pme", label: "PME", description: "De 10 à 250 salariés" },
  { value: "public", label: "Secteur public" },
  { value: "export", label: "Export", description: "Facturé hors zone euro" },
  { value: "partenaire", label: "Partenaire", description: "Revendeur ou intégrateur agréé" },
];

const VILLES: TagInputSuggestion[] = [
  { value: "lyon", label: "Lyon" },
  { value: "lille", label: "Lille" },
  { value: "nantes", label: "Nantes" },
  { value: "bordeaux", label: "Bordeaux" },
  { value: "marseille", label: "Marseille" },
];

/**
 * La saisie d'étiquettes : plusieurs valeurs courtes dans un seul champ.
 */
const meta = {
  title: "Forms/Input/TagInput",
  component: TagInput,
  parameters: {
    docs: {
      description: {
        component: [
          "Un champ qui collecte une **liste** de valeurs courtes, rendues en `Tag` dans la boîte même, avant la zone de saisie. On tape, puis virgule ou Entrée ajoute l'étiquette ; le × d'une étiquette la retire ; Retour arrière dans un champ vide retire la dernière. Quitter le champ valide aussi ce qui est en cours de frappe.",
          "",
          "**Deux usages** — en saisie **libre**, des mots-clés, des destinataires, des références. Avec `suggestions`, un choix **multiple dans une liste connue** : une liste filtrée s'ouvre sous le champ tant qu'il a le focus (filtre sur le libellé et la seconde ligne), ↑ / ↓ s'y déplacent, Entrée ou le clic choisit. `restrictToSuggestions` interdit alors tout ce qui n'est pas dans la liste ; sinon, une dernière ligne propose d'ajouter le texte tapé (`createLabel`, « Ajouter « … » » par défaut).",
          "",
          "**Quand l'utiliser** — dès qu'un champ attend plusieurs valeurs. Pour une seule valeur dans une liste longue, `InputDropdown` ; pour quelques options à voir toutes d'un coup, un `ChipGroup` en `multiple` ou des `CheckboxButton`.",
          "",
          "**Valeur** — composant **contrôlé** : `value` est un tableau de chaînes, `onChange` reçoit le nouveau tableau. Avec des suggestions, c'est la `value` de chaque suggestion qui est stockée, et son `label` qui s'affiche. `preventDuplicates` (actif par défaut) ignore une étiquette déjà présente — la comparaison est sensible à la casse. `maxTags` bloque la saisie une fois le plafond atteint.",
          "",
          "**Thème** — la boîte lit les variables des champs (`--lq-control-*`, `--lq-field-*`) ; les étiquettes, celles de `Tag` (`--lq-color-border-subtle`, `--lq-radius-sm`) ; la liste, celles du `Popover` (`--lq-shadow-modal`, `--lq-color-hover`).",
        ].join("\n"),
      },
    },
  },
  args: { label: "Mots-clés", value: ["relance", "prioritaire"], placeholder: "Ajouter…", helperText: "Virgule ou Entrée pour valider.", onChange: fn() },
  argTypes: {
    value: { control: false },
    onChange: { control: false },
    suggestions: { control: false },
    createLabel: { control: false },
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ maxWidth: 460, display: "flex", flexDirection: "column", gap: 8 }}>
        <TagInput
          {...args}
          value={value}
          onChange={(tags) => {
            setValue(tags);
            args.onChange(tags);
          }}
        />
        <Text size="sm" muted>
          Valeur : [{value.map((v) => `"${v}"`).join(", ")}]
        </Text>
      </div>
    );
  },
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const WithSuggestions: Story = {
  name: "Liste fermée",
  args: {
    label: "Segments",
    value: ["grand-compte"],
    suggestions: SEGMENTS,
    restrictToSuggestions: true,
    placeholder: "Choisir un segment…",
    helperText: "Seuls les segments du référentiel sont acceptés.",
  },
  parameters: { docs: { description: { story: "`restrictToSuggestions` : le texte libre est ignoré. La valeur stockée est la `value` des suggestions (`grand-compte`), l'étiquette montre leur `label`." } } },
};

export const SuggestionsAndFreeText: Story = {
  name: "Suggestions et saisie libre",
  args: { label: "Villes de livraison", value: ["lyon"], suggestions: VILLES, placeholder: "Une ville…", helperText: "Tapez « Rouen » : la dernière ligne propose de l'ajouter." },
};

export const MaxTags: Story = {
  name: "Plafond",
  args: { label: "Destinataires en copie", value: ["compta@lemoine.fr", "direction@lemoine.fr", "achats@lemoine.fr"], maxTags: 3, helperText: "Trois au maximum : la saisie se bloque une fois le plafond atteint." },
};

export const WithError: Story = {
  name: "En erreur",
  args: { label: "Étiquettes du dossier", value: [], placeholder: "Au moins une étiquette", helperText: undefined, error: "Ajoutez au moins une étiquette." },
};

export const Small: Story = {
  name: "Petit",
  args: { size: "small", label: "Filtrer par étiquette", helperText: undefined },
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { disabled: true, label: "Étiquettes système", value: ["import", "2026"], helperText: "Posées automatiquement à l'import." },
};
