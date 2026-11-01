import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Chip, StarIcon, UserIcon } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * La puce de filtre : une pastille arrondie qu'on allume et qu'on éteint.
 */
const meta = {
  title: "Forms/Chip",
  component: Chip,
  parameters: {
    docs: {
      description: {
        component: [
          "Une **puce de filtre** : une pastille ronde et légère, éteinte (fond de panneau, filet discret) ou allumée (`selected` : texte, filet et voile de l'accent). Elle peut porter une icône en tête et un compte en queue (`count`), en petit, dans une pastille grise.",
          "",
          "**Quand l'utiliser** — une rangée de filtres au-dessus d'une liste : un statut, une période, « mes dossiers ». Une puce pèse moins qu'un bouton, on en aligne une dizaine sans qu'elles écrasent la liste. Pour une rangée qui gère elle-même le choix unique ou multiple (et les flèches du clavier), prenez `ChipGroup` ; pour un filtre à l'allure de bouton, `CheckboxButton` ; pour un choix exclusif soudé en un bloc, `SegmentedControl` ; pour une étiquette qu'on retire, `Tag`.",
          "",
          "**Comportement** — c'est un vrai `<button>` (`aria-pressed` suit `selected`) : Tab y mène, Espace et Entrée le basculent, et il accepte tous les attributs d'un bouton (`onClick`, `disabled`, `title`…). La puce ne tient pas d'état : l'appelant inverse `selected` dans `onClick`.",
          "",
          "**Thème** — `--lq-color-accent` pour l'état allumé et le survol, `--lq-color-border-subtle` pour le filet éteint, `--lq-color-panel`, `--lq-text-xs` pour la taille du texte, `--lq-color-focus-ring` pour l'anneau de focus. La puce reste **ronde** quel que soit le thème : c'est voulu par le kit, son rayon n'est pas une variable.",
        ].join("\n"),
      },
    },
  },
  args: { children: "Mes dossiers", selected: false, onClick: fn() },
  argTypes: {
    children: { control: "text" },
    count: { control: "text" },
    icon: { control: false },
  },
  render: function Render(args) {
    const [selected, setSelected] = useState(args.selected ?? false);
    return (
      <Chip
        {...args}
        selected={selected}
        onClick={(e) => {
          setSelected((s) => !s);
          args.onClick?.(e);
        }}
      />
    );
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Selected: Story = {
  name: "Allumée",
  args: { selected: true, children: "En retard" },
};

export const WithCount: Story = {
  name: "Avec compte",
  args: { children: "En attente", count: 14 },
  parameters: { docs: { description: { story: "`count` accepte un nombre ou n'importe quel nœud ; il s'affiche en chiffres tabulaires." } } },
};

export const WithIcon: Story = {
  name: "Avec icône",
  args: { children: "Favoris", icon: <StarIcon size={12} />, selected: true },
};

export const Disabled: Story = {
  name: "Désactivée",
  args: { children: "Archivés", disabled: true, count: 0 },
};

export const FilterRow: Story = {
  name: "Rangée de filtres",
  parameters: { docs: { description: { story: "Deux puces tenues à la main, en choix exclusif. Dès que la rangée grandit, `ChipGroup` fait ce travail." } } },
  render: function Render() {
    const [vue, setVue] = useState<"toutes" | "miennes">("toutes");
    return (
      <div style={{ display: "flex", gap: 4 }}>
        <Chip selected={vue === "toutes"} onClick={() => setVue("toutes")}>
          Toutes les factures
        </Chip>
        <Chip selected={vue === "miennes"} onClick={() => setVue("miennes")} icon={<UserIcon size={12} />} count={23}>
          Mes dossiers
        </Chip>
      </div>
    );
  },
};
