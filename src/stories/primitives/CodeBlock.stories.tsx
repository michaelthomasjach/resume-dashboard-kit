import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock } from "@michaelthomasjach/liseuse-dashboard-kit";

const EXPORT_SNIPPET = `// Commandes payées du mois
const commandes = await api.get("/commandes", {
  statut: "payée",
  mois: "2026-10",
});
const total = commandes.reduce((s, c) => s + c.montant, 0);
console.log(\`\${commandes.length} commandes\`, total);`;

const WEBHOOK_PAYLOAD = `{
  "evenement": "commande.payee",
  "commande": "C-4821",
  "montant": 14400
}`;

const CURL = `curl -X POST https://api.exemple.fr/v1/relances \\
  -H "Authorization: Bearer $JETON" \\
  -d client=lemoine-sas`;

/**
 * L'extrait de code : police à chasse fixe, en-tête avec le nom du fichier ou du langage, et un
 * bouton pour copier.
 */
const meta = {
  title: "Primitives/CodeBlock",
  component: CodeBlock,
  parameters: {
    docs: {
      description: {
        component: [
          "Bloc de code en lecture seule, avec un bouton **Copier** dans l'en-tête (il affiche « Copié » un instant après la copie dans le presse-papiers).",
          "",
          "**En-tête** — `filename` s'il est donné, sinon `language` (« JSON », « Shell »…). `showLineNumbers` ajoute une gouttière numérotée.",
          "",
          "**Coloration** — désactivée par défaut, activée par `highlight=\"javascript\"`, la seule valeur reconnue : elle réutilise la grammaire JavaScript que le kit embarque déjà pour son éditeur de scripts, sans alourdir le paquet. Un extrait JSON ou shell reste en texte brut. Les couleurs viennent des variables `--lq-code-*` du kit, que ce thème ne redéfinit pas.",
          "",
          "**Quand l'utiliser** — un exemple d'appel d'API, une charge utile de webhook, une commande à copier dans une page d'aide ou de réglages développeur. Pour du code modifiable, l'éditeur de scripts du kit ; pour un identifiant à copier dans une ligne de texte, un simple `<code>`.",
          "",
          "Le code est affiché tel quel (espaces et retours compris) et défile horizontalement s'il est trop large.",
          "",
          "**Thème** — `--lq-color-panel` (en-tête), `--lq-color-bg` (fond du code), `--lq-color-border-subtle`, `--lq-radius-lg`, `--lq-color-text`, `--lq-color-text-muted` (étiquette, numéros), `--lq-space-2` à `--lq-space-4` ; le bouton de copie `--lq-color-border`, `--lq-radius-sm`.",
        ].join("\n"),
      },
    },
  },
  args: { code: EXPORT_SNIPPET, language: "JavaScript", filename: "export-commandes.js", highlight: "javascript", showLineNumbers: true },
  argTypes: {
    highlight: { control: "select", options: [undefined, "javascript"] },
    code: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Plain: Story = {
  name: "Texte brut",
  args: { code: WEBHOOK_PAYLOAD, language: "JSON", filename: "webhook.json", highlight: undefined, showLineNumbers: false },
  parameters: { docs: { description: { story: "Sans `highlight` : le code garde la couleur du texte." } } },
};

export const LanguageHeader: Story = {
  name: "En-tête de langage",
  args: { code: CURL, language: "Shell", filename: undefined, highlight: undefined, showLineNumbers: false },
  parameters: { docs: { description: { story: "Sans `filename`, l'en-tête affiche `language`." } } },
};

export const WithoutLineNumbers: Story = {
  name: "Sans numéros de ligne",
  args: { showLineNumbers: false },
};
