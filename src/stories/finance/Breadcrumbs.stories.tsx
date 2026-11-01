import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Breadcrumbs, Heading, type BreadcrumbItem } from "@michaelthomasjach/liseuse-dashboard-kit";

/** Un chemin de quatre niveaux, de l'accueil à la fiche d'une position. */
const PATH = [
  { id: "accueil", label: "Accueil" },
  { id: "tresorerie", label: "Trésorerie" },
  { id: "placements", label: "Placements" },
  { id: "mc", label: "LVMH" },
];

/**
 * Le fil d'Ariane : où l'on est, et le chemin pour remonter.
 */
const meta = {
  title: "Layouts/Breadcrumbs",
  component: Breadcrumbs,
  parameters: {
    docs: {
      description: {
        component: [
          "Fil d'Ariane : la suite des pages qui mènent à la page courante, chacune cliquable pour y remonter.",
          "",
          "**Quand l'utiliser** — dès qu'une page vit à deux niveaux ou plus de profondeur (liste → fiche → onglet). Il se pose en tête de page, typiquement dans le `header` de `SidebarLayout`. Pour passer d'une vue à une autre de même niveau, ce n'est pas un fil d'Ariane qu'il faut mais des onglets (`Tabs`).",
          "",
          "**Anatomie** — un `<nav aria-label=\"Fil d'ariane\">` qui contient une liste ordonnée. Chaque élément sauf le dernier est un lien, suivi d'un chevron. Le **dernier** élément est la page courante : un simple texte marqué `aria-current=\"page\"`, jamais cliquable.",
          "",
          "**Navigation** — chaque élément accepte `href`, `onClick`, ou les deux. Avec `onClick`, le lien ne suit pas son `href` (`preventDefault`) et c'est votre routeur qui navigue ; sans `href`, le lien pointe sur `#`. Les liens sont de vrais `<a>` : focalisables à Tab, activés par Entrée.",
          "",
          "**Thème** — `--lq-color-text-muted` (liens et chevrons), `--lq-color-text` (page courante et survol), `--lq-font-weight-semibold`.",
        ].join("\n"),
      },
    },
  },
  args: {
    items: PATH.map((item, i) => (i < PATH.length - 1 ? { ...item, onClick: fn() } : item)),
  },
  argTypes: { items: { control: false } },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Navigation: Story = {
  name: "Remonter le chemin",
  render: function Render() {
    const [depth, setDepth] = useState(PATH.length);
    const items: BreadcrumbItem[] = PATH.slice(0, depth).map((item, i) => ({ ...item, onClick: () => setDepth(i + 1) }));
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Breadcrumbs items={items} />
        <Heading level={4}>{items[items.length - 1].label}</Heading>
        {depth < PATH.length && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setDepth(PATH.length);
            }}
          >
            Revenir à la fiche LVMH
          </a>
        )}
      </div>
    );
  },
  parameters: { docs: { description: { story: "Cliquez un élément : la page « change » et le fil se raccourcit. C'est le schéma habituel avec un routeur : `onClick` appelle `navigate()`." } } },
};

export const TwoLevels: Story = {
  name: "Deux niveaux",
  args: { items: [{ id: "factures", label: "Factures", onClick: fn() }, { id: "f-2026-0412", label: "F-2026-0412" }] },
};

export const WithLinks: Story = {
  name: "Liens classiques",
  args: {
    items: [
      { id: "accueil", label: "Accueil", href: "#accueil" },
      { id: "clients", label: "Clients", href: "#clients" },
      { id: "lemoine", label: "Lemoine SAS" },
    ],
  },
  parameters: { docs: { description: { story: "Avec `href` seul, ce sont des liens ordinaires — ce qu'il faut pour une application sans routeur côté client." } } },
};
