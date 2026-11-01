import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button, CheckIcon, PlusIcon, ArrowRightIcon, type ButtonProps } from "@michaelthomasjach/liseuse-dashboard-kit";

const TONES: NonNullable<ButtonProps["tone"]>[] = ["default", "primary", "success", "info", "danger", "warning"];
const VARIANTS: NonNullable<ButtonProps["variant"]>[] = ["solid", "outline", "ghost", "link"];

/**
 * Le bouton d'action du kit. Dans le thème « resume », il prend la mesure des boutons du site du CV :
 * 36 px de haut, texte 13 px en Space Mono, filet de 1,5 px, angles droits. Sélectionné, il passe au
 * plein du bleu de l'accent.
 */
const meta = {
  title: "Primitives/Button",
  component: Button,
  parameters: {
    docs: {
      description: {
        component: [
          "Bouton à filet pour une action ou un choix. Avec `selected`, il devient un **bouton bascule** : plein de l'accent, et `selectedIcon` remplace alors `icon` avec une petite animation.",
          "",
          "**Quand l'utiliser** — une action secondaire (Annuler, Exporter), un choix parmi d'autres posés côte à côte, ou l'action principale d'un formulaire en `selected`. Pour une action sans libellé, préférez `IconButton`.",
          "",
          "**Tons** — `tone` (`default`, `primary`, `success`, `info`, `danger`, `warning`) colore une action : `primary` est l'accent, les autres la couleur du thème du même nom, lues dans les variables `--lq-tone-*` qui teignent déjà les surfaces pleines de `Card`. Le thème y a mis le bleu du CV et une famille sobre qui ne le concurrence pas : primary `#3a41e2`, info `#1c1f5c` (le bleu nuit), success `#2e9e5b`, danger `#c4213a`, warning `#f2b705` sur texte `#1b1d3a`. Un ton n'est pas un état : il ne pose **pas** `aria-pressed`, seul `selected` en pose un. En e-ink, tous les tons sont pleins et noirs.",
          "",
          "**Formes** — `variant` : `solid` (défaut, le rendu historique), `outline` (fond transparent, bordure et texte du ton), `ghost` (ni fond ni bordure, fond léger au survol), `link` (un lien, souligné au survol). `selected` l'emporte sur le ton et la forme.",
          "",
          "**Occupé** — `loading` remplace l'icône par un `Spinner` aux couleurs du bouton ; sans icône, le spinner se pose au centre et le libellé, masqué, garde sa place : la largeur ne bouge pas. Le bouton reçoit `aria-busy` et `aria-disabled`, ignore les clics et reste focalisable. `loadingLabel` nomme le spinner (« Chargement… »).",
          "",
          "**Clavier** — un `<button>` natif ; anneau `--lq-color-focus-ring` au focus clavier.",
          "",
          "**Thème** — `--lq-button-padding-y`, `--lq-button-padding-x`, `--lq-button-font-size`, `--lq-control-border-width`, `--lq-radius-md`, `--lq-color-accent`, `--lq-color-fill` (sélectionné), `--lq-color-hover` (fantôme), `--lq-tone-accent` · `-success` · `-info` · `-danger` · `-warning` et leurs `--lq-tone-<ton>-text` ou `--lq-tone-text` (encre des tons).",
        ].join("\n"),
      },
    },
  },
  args: { children: "Enregistrer", onClick: fn() },
  argTypes: {
    children: { control: "text" },
    icon: { control: false },
    selectedIcon: { control: false },
    tone: { control: "inline-radio", options: TONES, table: { defaultValue: { summary: '"default"' } } },
    variant: { control: "inline-radio", options: VARIANTS, table: { defaultValue: { summary: '"solid"' } } },
    loading: { control: "boolean" },
    loadingLabel: { control: "text" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Selected: Story = {
  name: "Sélectionné",
  args: { selected: true, children: "Valider la facture" },
  parameters: { docs: { description: { story: "L'action principale : plein de l'accent." } } },
};

export const WithIcon: Story = {
  name: "Avec icône",
  args: { icon: <PlusIcon size={16} />, children: "Nouveau client" },
};

export const TrailingIcon: Story = {
  name: "Icône en queue",
  args: { icon: <ArrowRightIcon size={16} />, iconPosition: "trailing", children: "Continuer" },
};

export const Toggle: Story = {
  name: "Bascule",
  args: { selected: true, selectedIcon: <CheckIcon size={16} />, children: "Abonné" },
  parameters: { docs: { description: { story: "En bouton bascule, `selectedIcon` s'affiche tant que `selected` est vrai." } } },
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { disabled: true, children: "Exporter" },
};

export const Block: Story = {
  name: "Pleine largeur",
  args: { block: true, selected: true, children: "Fermer" },
};

export const Tones: Story = {
  name: "Tons",
  render: (args) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {TONES.map((t) => (
        <Button key={t} {...args} tone={t}>
          {t}
        </Button>
      ))}
    </div>
  ),
  parameters: { docs: { description: { story: "Les six tons en plein — le bleu du CV pour `primary`, puis les tons d'état du thème. Changez `variant` dans les Controls pour les voir sous une autre forme." } } },
};

export const Variants: Story = {
  name: "Formes",
  render: () => (
    <div style={{ display: "grid", gap: 8 }}>
      {VARIANTS.map((v) => (
        <div key={v} style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <code style={{ width: 64 }}>{v}</code>
          {TONES.map((t) => (
            <Button key={t} tone={t} variant={v}>
              {t}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
  parameters: { docs: { description: { story: "Chaque forme croisée avec chaque ton : plein, bordé, fantôme, lien." } } },
};

export const Loading: Story = {
  name: "Occupé",
  render: function Render() {
    const [busy, setBusy] = useState(true);
    return (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <Button tone="primary" loading={busy}>
          Enregistrer
        </Button>
        <Button icon={<PlusIcon size={16} />} loading={busy}>
          Nouveau client
        </Button>
        <Button tone="danger" variant="outline" loading={busy}>
          Supprimer
        </Button>
        <Button variant="ghost" onClick={() => setBusy((b) => !b)}>
          {busy ? "Arrêter" : "Relancer"}
        </Button>
      </div>
    );
  },
  parameters: { docs: { description: { story: "`loading` : le spinner prend la place de l'icône, ou se pose au centre d'un bouton sans icône — la largeur ne change pas, les clics sont ignorés. Le dernier bouton bascule l'état." } } },
};
