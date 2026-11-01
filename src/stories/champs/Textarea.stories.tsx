import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Textarea } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * La zone de texte sur plusieurs lignes, de la même famille qu'`Input`.
 */
const meta = {
  title: "Forms/Input/Textarea",
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component: [
          "Zone de saisie **sur plusieurs lignes** : une description, un commentaire, un message. Elle partage tout avec `Input` — les mêmes classes `lq-field*`, donc le même filet, le même libellé, la même aide, les mêmes états — et transmet tous les attributs d'un `<textarea>` (`value`, `onChange` natif, `required`, `maxLength`, `name`…). La `ref` pointe sur le `<textarea>`.",
          "",
          "**Quand l'utiliser** — dès qu'une réponse peut dépasser une ligne. Pour une valeur courte (un nom, un e-mail), `Input` ; pour du texte mis en forme (gras, listes, liens), `WysiwygEditor`.",
          "",
          "**Hauteur** — `rows` fixe la hauteur de départ (3 par défaut) ; `resize` choisit la poignée : `\"vertical\"` (défaut) ou `\"none\"`. Avec `autoResize`, le champ **grandit avec son contenu** de `minRows` (défaut `rows`, sinon 1) à `maxRows` lignes (défaut 8), puis défile ; la poignée disparaît.",
          "",
          "**Compteur** — `showCount` affiche le nombre de caractères sous le champ, à droite de l'aide ; avec `maxLength`, « 42 / 280 », en couleur d'alerte à partir de 90 %. `maxLength` est l'attribut natif : la saisie s'arrête à la limite. Le compteur est relié au champ par `aria-describedby`, sans région live : il n'est pas annoncé à chaque frappe.",
          "",
          "**Libellé et états** — `labelPosition=\"above\"` (défaut) ou `\"inside\"` (dans la boîte, réduit au focus ou dès qu'il y a une valeur ; `required` ajoute l'astérisque). `error` passe le filet en `--lq-color-danger` avec `aria-invalid` ; `success` en est le pendant en `--lq-color-up` ; l'un ou l'autre remplace `helperText`. `disabled` pâlit le champ.",
          "",
          "**Thème** — celui d'`Input` : `--lq-control-padding-x`, `--lq-control-font-size`, `--lq-control-color`, `--lq-control-border-width`, `--lq-field-label-size`, `--lq-field-label-weight`, `--lq-field-gap`, `--lq-field-helper-offset`. Réglages propres, optionnels : `--lq-textarea-padding-y` (8 px), `--lq-textarea-line-height` (1,5), `--lq-textarea-count-size` (0,75 rem).",
        ].join("\n"),
      },
    },
  },
  args: {
    label: "Description",
    placeholder: "Décrivez la demande…",
    rows: 3,
    resize: "vertical",
    autoResize: false,
    showCount: false,
    labelPosition: "above",
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    helperText: { control: "text" },
    error: { control: "text" },
    success: { control: "text" },
    rows: { control: { type: "number", min: 1, max: 20 }, table: { defaultValue: { summary: "3" } } },
    autoResize: { control: "boolean", table: { defaultValue: { summary: "false" } } },
    minRows: { control: { type: "number", min: 1, max: 20 } },
    maxRows: { control: { type: "number", min: 1, max: 30 }, table: { defaultValue: { summary: "8" } } },
    showCount: { control: "boolean", table: { defaultValue: { summary: "false" } } },
    maxLength: { control: "number" },
    resize: { control: "inline-radio", options: ["vertical", "none"], table: { defaultValue: { summary: '"vertical"' } } },
    labelPosition: { control: "inline-radio", options: ["above", "inside"], table: { defaultValue: { summary: '"above"' } } },
    disabled: { control: "boolean" },
    containerClassName: { control: false },
    onChange: { control: false },
  },
  // Un champ contrôlé : la story tient la valeur, les contrôles règlent le reste.
  render: function Render(args) {
    const [value, setValue] = useState(typeof args.defaultValue === "string" ? args.defaultValue : "");
    return (
      <div style={{ maxWidth: 420 }}>
        <Textarea
          {...args}
          defaultValue={undefined}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            args.onChange?.(e);
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const WithHelper: Story = {
  name: "Avec aide",
  args: { label: "Notes internes", helperText: "Visibles par l'équipe seulement.", rows: 4, placeholder: undefined },
  parameters: { docs: { description: { story: "`helperText` sous le champ, relié par `aria-describedby`." } } },
};

export const WithError: Story = {
  name: "Erreur",
  args: { label: "Motif du refus", defaultValue: "Trop court", error: "Au moins 20 caractères" },
  parameters: { docs: { description: { story: "`error` : filet rouge, message et icône sous le champ, `aria-invalid`." } } },
};

export const Success: Story = {
  name: "Succès",
  args: { label: "Message", defaultValue: "Merci pour votre retour, nous revenons vers vous sous 48 h.", success: "Message prêt à l'envoi" },
  parameters: { docs: { description: { story: "`success` : le pendant de l'erreur, en vert." } } },
};

export const WithCount: Story = {
  name: "Compteur",
  args: {
    label: "Publication",
    maxLength: 280,
    showCount: true,
    defaultValue: "La v2.4 part en production cet après-midi. Merci à tous pour la semaine de recette.",
    helperText: "Les mentions @ notifient les personnes citées.",
  },
  parameters: { docs: { description: { story: "`showCount` avec `maxLength={280}` : le compteur à droite de l'aide, en rouge à partir de 252 caractères." } } },
};

export const AutoResize: Story = {
  name: "Hauteur automatique",
  args: { label: "Commentaire", autoResize: true, minRows: 1, maxRows: 6, defaultValue: "Tapez plusieurs lignes :\nle champ grandit avec son contenu," },
  parameters: { docs: { description: { story: "`autoResize` de 1 à 6 lignes : au-delà, le champ défile. C'est la zone de commentaire d'`ActivityFeed`." } } },
};

export const NoResize: Story = {
  name: "Sans poignée",
  args: { label: "Adresse de livraison", resize: "none", placeholder: "12 rue des Lilas\n75011 Paris" },
  parameters: { docs: { description: { story: "`resize=\"none\"` : hauteur fixe, sans poignée de redimensionnement." } } },
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { label: "Conditions", disabled: true, defaultValue: "Ce texte ne peut pas être modifié." },
};

export const LabelInside: Story = {
  name: "Libellé dans la boîte",
  args: { label: "Votre message", labelPosition: "inside", required: true, rows: 4, placeholder: undefined },
  parameters: { docs: { description: { story: "`labelPosition=\"inside\"` : le libellé se réduit au focus ou dès qu'il y a une valeur ; `required` ajoute l'astérisque." } } },
};
