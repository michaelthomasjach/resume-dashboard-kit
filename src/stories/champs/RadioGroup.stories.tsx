import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Radio, RadioGroup, type RadioOption } from "@michaelthomasjach/liseuse-dashboard-kit";

const FREQUENCES: RadioOption[] = [
  { value: "quotidien", label: "Chaque jour, après la clôture" },
  { value: "hebdo", label: "Chaque lundi matin" },
  { value: "mensuel", label: "Le premier jour ouvré du mois" },
];

const FORMULES: RadioOption[] = [
  { value: "essentiel", label: "Essentiel", description: "Un utilisateur, facturation mensuelle, support par courriel." },
  { value: "pro", label: "Pro", description: "Jusqu'à dix utilisateurs, relances automatiques et export comptable." },
  { value: "equipe", label: "Équipe", description: "Utilisateurs illimités, espaces partagés et journal d'audit." },
  { value: "sur-mesure", label: "Sur mesure", description: "Sur devis uniquement — contactez le service commercial.", disabled: true },
];

/**
 * Le groupe de boutons radio : un choix exclusif parmi quelques options aux libellés longs.
 */
const meta = {
  title: "Forms/RadioGroup",
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component: [
          "Un **choix exclusif** parmi quelques options, posées les unes sous les autres, chacune avec un libellé souvent long et une description facultative. Le groupe porte son libellé (`<legend>`), un texte d'aide ou un message d'erreur.",
          "",
          "**Quand l'utiliser** — deux à six options qu'il faut **lire** pour choisir : une formule d'abonnement, une fréquence d'envoi, une règle de facturation. Pour deux à quatre valeurs courtes qui changent une vue (« Jour / Semaine / Mois »), `SegmentedControl` est plus compact ; au-delà de six options, `Select` ; pour des options cumulables, des `Checkbox`.",
          "",
          "**Options** — `options` est une liste de `{ value, label, description?, disabled? }`. `value` est une chaîne (le type est générique : une union littérale `\"hebdo\" | \"mensuel\"` est conservée jusqu'à `onChange`). `label` et `description` acceptent un nœud.",
          "",
          "**Valeur** — **contrôlée** avec `value` (`null` pour aucune) et `onChange`, qui reçoit directement la valeur choisie ; ou **libre** avec `defaultValue`. Sans valeur de départ, aucun bouton n'est coché — c'est voulu quand le choix doit être conscient.",
          "",
          "**Disposition** — `orientation=\"vertical\"` (défaut) empile les options ; `\"horizontal\"` les aligne et passe à la ligne quand la place manque, à réserver aux libellés courts.",
          "",
          "**États** — `disabled` désactive tout le groupe, `disabled` sur une option la seule option. `error` affiche le message sous le groupe et teinte les cercles non choisis en `--lq-color-danger` ; il remplace `helperText`. `required` est reporté sur les radios natives (validation de formulaire) et en `aria-required`.",
          "",
          "**Clavier et accessibilité** — de vraies `<input type=\"radio\">` restent dans le document, visuellement masquées, toutes sous le même `name` (unique par défaut, réglable avec `name`). Tab entre dans le groupe sur l'option choisie, les **flèches** passent d'une option à l'autre en la choisissant et sautent les désactivées, Espace choisit. Le groupe est un `<fieldset role=\"radiogroup\">` : sa légende est annoncée, l'erreur ou l'aide y est reliée par `aria-describedby`, la description de chaque option à son bouton.",
          "",
          "**`Radio` seul** — le bouton isolé est exporté aussi (`value`, `checked` / `defaultChecked`, `onChange(value)`, `name`, `label`, `description`, `disabled`, `invalid`), pour une mise en page que le groupe ne couvre pas. Donnez alors le même `name` à tous et un conteneur `role=\"radiogroup\"` avec un nom accessible.",
          "",
          "**Thème** — cercle `--lq-radio-size` (18 px ; 16 dans ce thème), filet `--lq-control-border-width` en `--lq-radio-border-color` (repli `--lq-color-border` ; `#9a9ec0` dans ce thème, plus marqué que le filet des champs), fond `--lq-color-panel` ; choisi, filet `--lq-color-fill` épaissi à `--lq-radio-checked-border-width` et point central `--lq-radio-dot-size` (8 px ; ce thème dessine plutôt un anneau bleu de 5 px sans point, soit `--lq-radio-checked-border-width: 5px` et `--lq-radio-dot-size: 0`) ; écart cercle / libellé `--lq-radio-label-gap`, entre options `--lq-radio-gap` (vertical) et `--lq-radio-gap-inline` (horizontal) ; libellé `--lq-radio-label-size`, description `--lq-radio-description-size` en `--lq-color-text-muted` ; désactivé `--lq-radio-disabled-opacity`. Légende, aide et erreur reprennent `--lq-field-label-size`, `--lq-field-gap` et la couleur d'erreur des autres champs.",
        ].join("\n"),
      },
    },
  },
  args: {
    label: "Fréquence du relevé",
    options: FREQUENCES,
    defaultValue: "hebdo",
    orientation: "vertical",
    disabled: false,
    required: false,
    onChange: fn(),
  },
  argTypes: {
    options: { control: "object" },
    value: { control: false },
    defaultValue: { control: "inline-radio", options: ["quotidien", "hebdo", "mensuel"] },
    onChange: { control: false },
    label: { control: "text" },
    helperText: { control: "text" },
    error: { control: "text" },
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"], table: { defaultValue: { summary: '"vertical"' } } },
    name: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
  render: function Render(args) {
    // Contrôlé : la story tient la valeur, et `defaultValue` des contrôles en donne le départ.
    const [value, setValue] = useState<string | null>(args.defaultValue ?? null);
    return (
      <div style={{ maxWidth: 460 }}>
        <RadioGroup
          {...args}
          value={value}
          onChange={(v) => {
            setValue(v);
            args.onChange?.(v);
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const WithDescriptions: Story = {
  name: "Avec descriptions",
  args: { label: "Formule", options: FORMULES, defaultValue: "pro", helperText: "Changement possible à tout moment, au prorata." },
  argTypes: { defaultValue: { control: "inline-radio", options: ["essentiel", "pro", "equipe"] } },
  parameters: {
    docs: {
      description: {
        story: "Chaque option porte une ligne d'explication sous son libellé ; le cercle reste calé sur la première ligne. « Sur mesure » est désactivée : les flèches la sautent.",
      },
    },
  },
};

export const Horizontal: Story = {
  name: "Horizontal",
  args: {
    label: "Période",
    orientation: "horizontal",
    defaultValue: "1m",
    options: [
      { value: "1j", label: "1 jour" },
      { value: "1s", label: "1 semaine" },
      { value: "1m", label: "1 mois" },
      { value: "1a", label: "1 an" },
    ],
  },
  argTypes: { defaultValue: { control: "inline-radio", options: ["1j", "1s", "1m", "1a"] } },
  parameters: { docs: { description: { story: "Options en ligne, qui passent à la ligne quand la place manque. À réserver aux libellés courts : au-delà, l'empilement se lit mieux." } } },
};

export const WithError: Story = {
  name: "En erreur",
  args: { defaultValue: undefined, required: true, error: "Choisissez une fréquence." },
  parameters: { docs: { description: { story: "Sans choix, le message s'affiche sous le groupe et les cercles prennent la couleur d'erreur. Le groupe porte `aria-invalid` et relie le message par `aria-describedby`." } } },
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { disabled: true, defaultValue: "quotidien" },
  parameters: { docs: { description: { story: "Tout le groupe est grisé et hors de la tabulation. Pour une seule option, `disabled` sur l'option (voir « Avec descriptions »)." } } },
};

export const StandaloneRadio: Story = {
  name: "Radio seul",
  render: function Render() {
    const [value, setValue] = useState("csv");
    return (
      <div role="radiogroup" aria-label="Format d'export" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Radio name="export" value="csv" label="CSV" checked={value === "csv"} onChange={setValue} />
        <Radio name="export" value="xlsx" label="Excel" checked={value === "xlsx"} onChange={setValue} />
        <Radio name="export" value="pdf" label="PDF" description="Mise en page A4, une page par client." checked={value === "pdf"} onChange={setValue} />
      </div>
    );
  },
  parameters: { docs: { description: { story: "`Radio` exporté seul, pour une mise en page libre. Le `name` partagé rend le choix exclusif et donne les flèches ; le conteneur `role=\"radiogroup\"` porte le nom accessible." } } },
};
