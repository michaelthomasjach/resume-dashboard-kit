import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { InputPassword, CodeIcon } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * Le mot de passe : masqué par défaut, avec l'œil qui l'affiche.
 */
const meta = {
  title: "Forms/Input/InputPassword",
  component: InputPassword,
  parameters: {
    docs: {
      description: {
        component: [
          "Un `Input` préréglé pour les secrets : la saisie est masquée, une icône de cadenas se pose en tête (remplaçable par `leadingIcon`), et un bouton en forme d'œil, en queue, bascule entre masqué et lisible.",
          "",
          "**Quand l'utiliser** — un mot de passe, une clé d'API, un code d'accès. Pour un code court à chiffres fixes (un code PIN), un `MaskedInput` dit mieux combien de chiffres sont attendus.",
          "",
          "**Valeur** — exactement celle d'un `<input>` : contrôlé avec `value` et `onChange(event)`, ou libre avec `defaultValue`. Toutes les props d'`Input` sont acceptées, sauf `type` et `trailingIcon`, qui appartiennent au bouton. Pensez à `autoComplete` (`current-password` à la connexion, `new-password` à la création) : c'est ce qui permet aux gestionnaires de mots de passe de remplir le champ.",
          "",
          "**Comportement** — le clic sur l'œil ne prend pas le focus : le curseur reste où il était et, sur mobile, le clavier ne se ferme pas. Le bouton porte un libellé accessible qui suit son état (« Afficher le mot de passe » / « Masquer le mot de passe »). Le composant ne juge pas la robustesse du mot de passe : la règle et son message passent par `error` ou `helperText`.",
          "",
          "**Thème** — celui des champs : `--lq-control-height`, `--lq-control-padding-x`, `--lq-control-font-size`, `--lq-control-color`, `--lq-field-label-size`, `--lq-field-helper-offset`, `--lq-color-danger`.",
        ].join("\n"),
      },
    },
  },
  args: { label: "Mot de passe", placeholder: "Votre mot de passe", autoComplete: "current-password", onChange: fn() },
  argTypes: {
    value: { control: false },
    onChange: { control: false },
    leadingIcon: { control: false },
  },
  render: function Render(args) {
    const [value, setValue] = useState(typeof args.value === "string" ? args.value : "");
    return (
      <div style={{ maxWidth: 360 }}>
        <InputPassword
          {...args}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            args.onChange?.(e);
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof InputPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Filled: Story = {
  name: "Rempli",
  args: { value: "correct-cheval-pile-agrafe" },
  parameters: { docs: { description: { story: "Cliquez sur l'œil pour lire la saisie, une seconde fois pour la masquer à nouveau." } } },
};

export const WithRule: Story = {
  name: "Avec règle de robustesse",
  args: { label: "Nouveau mot de passe", autoComplete: "new-password", value: "motdepasse", placeholder: undefined },
  parameters: { docs: { description: { story: "La règle est écrite par l'appelant : tant qu'elle n'est pas remplie, le message passe en erreur ; ensuite, il redevient une simple aide." } } },
  render: function Render(args) {
    const [value, setValue] = useState(typeof args.value === "string" ? args.value : "");
    const tooShort = value.length < 12;
    return (
      <div style={{ maxWidth: 360 }}>
        <InputPassword
          {...args}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            args.onChange?.(e);
          }}
          error={tooShort ? `12 caractères au minimum (${value.length} saisis).` : undefined}
          helperText={tooShort ? undefined : "Robustesse suffisante."}
        />
      </div>
    );
  },
};

export const ApiKey: Story = {
  name: "Clé d'API",
  args: {
    label: "Clé d'API",
    value: "sk_live_51Hc2kqLemoineSAS",
    leadingIcon: <CodeIcon size={16} />,
    readOnly: true,
    helperText: "Régénérée le 2 octobre. Lecture seule : l'œil permet de la recopier.",
  },
};

export const Small: Story = {
  name: "Petit",
  args: { label: "Code d'accès", size: "small", placeholder: "••••" },
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { label: "Mot de passe SMTP", value: "relais-smtp-2026", disabled: true, helperText: "Géré par l'hébergeur." },
};
