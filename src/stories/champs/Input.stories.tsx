import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, SearchIcon, UserIcon } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * Le champ texte de base. Tous les champs du kit (Select, MaskedInput, DatePicker…) en partagent
 * l'apparence : filet, hauteur, état d'erreur.
 */
const meta = {
  title: "Forms/Input/Input",
  component: Input,
  parameters: {
    docs: {
      description: {
        component: [
          "Champ de saisie avec libellé, icônes de tête et de queue, texte d'aide et état d'erreur. Il transmet tous les attributs d'un `<input>` (`value`, `onChange`, `type`, `required`…).",
          "",
          "**Deux dispositions** — `labelPosition=\"above\"` (défaut) pose le libellé au-dessus, le champ « traditionnel » ; `labelPosition=\"inside\"` le pose **dans la boîte** : il rétrécit dès que le champ prend le focus ou une valeur, et `required` ajoute un astérisque dans le coin.",
          "",
          "**États** — `error` (chaîne) passe le filet en `--lq-color-danger` et affiche le message sous le champ, relié par `aria-describedby` et `aria-invalid`. `success` en est le pendant en `--lq-color-up` : une chaîne affiche un message avec une coche cerclée, `true` ne colore que le filet. L'erreur l'emporte sur le succès, et l'un comme l'autre remplace `helperText` quand il porte un message.",
          "",
          "**Thème** — `--lq-control-height` (36 px dans ce thème), `--lq-control-padding-x`, `--lq-control-font-size`, `--lq-control-color`, `--lq-field-label-size`, `--lq-field-label-weight`, `--lq-field-gap`, `--lq-field-helper-offset`.",
        ].join("\n"),
      },
    },
  },
  args: { label: "Raison sociale", placeholder: "Lemoine SAS" },
  argTypes: { leadingIcon: { control: false }, trailingIcon: { control: false }, error: { control: "text" }, success: { control: "text" } },
  // Un champ contrôlé : la story tient sa valeur, et les contrôles règlent tout le reste.
  render: function Render(args) {
    const [value, setValue] = useState("");
    return (
      <div style={{ maxWidth: 420 }}>
        <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
    );
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const WithHelper: Story = {
  name: "Avec aide",
  args: { label: "Courriel de facturation", placeholder: "compta@exemple.fr", helperText: "Sert uniquement à l'envoi des factures." },
};

export const WithError: Story = {
  name: "En erreur",
  args: { label: "SIRET", error: "Le SIRET compte 14 chiffres." },
};

export const Success: Story = {
  name: "Succès",
  args: { label: "Identifiant", success: "Identifiant disponible" },
  parameters: {
    docs: {
      description: {
        story:
          "Le pendant exact de l'erreur : filet, anneau de focus, message et icône en `--lq-color-up` (le vert « succès » du thème, `#2e9e5b`). Avec `success` à `true`, seul le filet se colore et `helperText` reste affiché. Si `error` est aussi posé, l'erreur l'emporte.",
      },
    },
  },
};

export const WithIcon: Story = {
  name: "Avec icône",
  args: { label: "Client", leadingIcon: <UserIcon size={16} /> },
};

export const Small: Story = {
  name: "Petit",
  args: { label: "Recherche rapide", size: "small", leadingIcon: <SearchIcon size={14} />, placeholder: "Filtrer…" },
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { label: "Identifiant interne", disabled: true, placeholder: "CLI-00418" },
};

export const LabelInside: Story = {
  name: "Libellé intégré",
  args: { label: "Projet", labelPosition: "inside", required: true, placeholder: undefined },
  parameters: { docs: { description: { story: "Cliquez dans le champ : le libellé rétrécit, le filet prend l'accent. Il reste petit une fois le champ rempli." } } },
};

export const InsideForm: Story = {
  name: "Formulaire à libellés intégrés",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 520 }}>
      <Input labelPosition="inside" label="Projet" required />
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Input labelPosition="inside" label="Prénom" required />
        </div>
        <div style={{ flex: 1 }}>
          <Input labelPosition="inside" label="Nom" />
        </div>
      </div>
      <Input labelPosition="inside" label="Courriel" placeholder="ex. : nom@exemple.fr" required />
      <Input labelPosition="inside" label="Désactivé" placeholder="Rien à saisir ici" disabled />
    </div>
  ),
};
