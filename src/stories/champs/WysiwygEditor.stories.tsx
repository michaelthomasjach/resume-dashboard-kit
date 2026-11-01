import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Card, CodeBlock, WysiwygEditor } from "@michaelthomasjach/liseuse-dashboard-kit";

const NOTE =
  "<h3>Relance trimestrielle</h3><p>Le client a demandé un <strong>report d'échéance</strong> pour la facture F-2041. " +
  "Accord de principe, sous réserve de :</p><ul><li>un premier versement avant le 15 ;</li><li>la mise à jour du RIB.</li></ul>" +
  "<blockquote>Aucune pénalité tant que l'échéancier est tenu.</blockquote>";

/**
 * L'éditeur de texte riche : une barre d'outils au-dessus d'un document modifiable, qui produit du HTML.
 */
const meta = {
  title: "Forms/WysiwygEditor",
  component: WysiwygEditor,
  parameters: {
    docs: {
      description: {
        component: [
          "Éditeur de texte riche, habillé comme les autres champs du kit : libellé, cadre, aide, erreur. Une barre d'outils (type de bloc, gras, italique, souligné, barré, listes, lien, code, effacement de la mise en forme, annuler / rétablir) agit sur la sélection d'un document modifiable, qui grandit avec son contenu.",
          "",
          "**Quand l'utiliser** — une note de dossier, la description d'un produit, un commentaire sous un graphique : un texte court mis en forme, saisi dans l'application. Pour du texte brut, un `Input` ou un `<textarea>` ; pour un vrai traitement de texte (tableaux, images, collaboration), ce n'est pas l'outil.",
          "",
          "**Valeur** — du **HTML ordinaire**, pas un format propriétaire. Contrôlé avec `value` + `onChange(html)` — mais contrôlé **souplement** : réécrire le document à chaque frappe ferait sauter le curseur, si bien qu'une `value` entrante n'est appliquée que lorsqu'elle diffère de ce que l'éditeur vient lui-même d'émettre. Libre avec `defaultValue`. La valeur est posée telle quelle en `innerHTML` : **nettoyez** tout HTML qui vient d'ailleurs avant de le passer.",
          "",
          "**Barre d'outils** — `toolbar` choisit et groupe les commandes (un tableau par groupe, séparés d'un filet ; voir `WYSIWYG_DEFAULT_TOOLBAR`). L'alignement (`alignLeft`…`alignJustify`) n'y est pas par défaut. Un tableau vide supprime la barre. La barre ne prend jamais le focus : la sélection reste dans le texte. Le lien s'édite dans une petite barre qui s'ouvre sous celle des outils : Entrée valide, Échap annule ; sur un lien existant, le bouton devient « Retirer le lien ».",
          "",
          "**Variantes** — `readOnly` rend le document sans barre ni édition (une visionneuse) ; `disabled` le grise ; `minHeight` (180 px par défaut) et `maxHeight` bornent la zone d'écriture, qui défile au-delà. Le collage est **nettoyé** par défaut (`pasteAsPlainText`) : un texte copié depuis une page web n'importe ni sa police ni ses couleurs.",
          "",
          "**Moteur** — le composant repose sur `document.execCommand`, officiellement déprécié mais implémenté par tous les navigateurs : c'est le prix d'un éditeur sans dépendance.",
          "",
          "**Thème** — le cadre lit `--lq-control-border-width`, `--lq-color-border`, `--lq-radius-md`, `--lq-color-focus-ring` ; la barre, `--lq-color-hover` et `--lq-color-accent` pour l'outil actif ; le document, `--lq-line-height-body` et l'échelle des titres `--lq-text-h4` à `--lq-text-h6`.",
        ].join("\n"),
      },
    },
  },
  args: {
    label: "Note interne",
    value: NOTE,
    minHeight: 140,
    helperText: "Visible par l'équipe de recouvrement.",
    onChange: fn(),
  },
  argTypes: {
    value: { control: false },
    defaultValue: { control: false },
    onChange: { control: false },
    toolbar: { control: false },
  },
  render: function Render(args) {
    const [html, setHtml] = useState(args.value);
    return (
      <div style={{ maxWidth: 680 }}>
        <WysiwygEditor
          {...args}
          value={html}
          onChange={(next) => {
            setHtml(next);
            args.onChange?.(next);
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof WysiwygEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Output: Story = {
  name: "Le HTML produit",
  parameters: { docs: { description: { story: "Tapez ou mettez en forme : le HTML émis par `onChange` s'affiche dessous, tel que l'application le stockerait." } } },
  render: function Render(args) {
    const [html, setHtml] = useState("<p>Le client rappelle <strong>lundi</strong>.</p>");
    return (
      <div style={{ display: "grid", gap: 16, maxWidth: 680 }}>
        <WysiwygEditor
          {...args}
          label="Compte rendu d'appel"
          helperText={undefined}
          value={html}
          onChange={(next) => {
            setHtml(next);
            args.onChange?.(next);
          }}
          minHeight={100}
        />
        <Card title="Valeur" meta="onChange">
          <CodeBlock language="markup" code={html} />
        </Card>
      </div>
    );
  },
};

export const Empty: Story = {
  name: "Vide",
  args: { label: "Description du produit", value: "", placeholder: "Décrivez le produit en quelques lignes…", helperText: undefined },
};

export const CustomToolbar: Story = {
  name: "Barre d'outils réduite",
  args: {
    label: "Commentaire",
    value: "",
    toolbar: [["bold", "italic"], ["bulletList"], ["link"]],
    minHeight: 80,
    placeholder: "Un commentaire court…",
    helperText: undefined,
  },
  parameters: { docs: { description: { story: "`toolbar` ne garde que l'essentiel pour un commentaire : quatre outils en trois groupes." } } },
};

export const WithAlignment: Story = {
  name: "Avec alignement",
  args: {
    label: "Conditions particulières",
    value: "<p>Sélectionnez ce paragraphe et essayez les quatre alignements.</p>",
    toolbar: [["block"], ["bold", "italic", "underline"], ["alignLeft", "alignCenter", "alignRight", "alignJustify"], ["undo", "redo"]],
    helperText: undefined,
  },
};

export const WithError: Story = {
  name: "En erreur",
  args: { label: "Motif du litige", value: "", error: "Le motif est obligatoire pour ouvrir un litige.", minHeight: 100, helperText: undefined },
};

export const ReadOnly: Story = {
  name: "Lecture seule",
  args: { label: "Note archivée", readOnly: true, helperText: "Clôturée le 28 octobre 2026." },
  parameters: { docs: { description: { story: "`readOnly` : ni barre ni édition, le document seul — une visionneuse de texte riche." } } },
};

export const MaxHeight: Story = {
  name: "Hauteur bornée",
  args: { label: "Historique des échanges", value: NOTE + NOTE + NOTE, minHeight: 100, maxHeight: 200, helperText: "Au-delà de 200 px, la zone défile." },
};
