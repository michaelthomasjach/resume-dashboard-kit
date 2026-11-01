import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button, KnowledgeBase, Text } from "@michaelthomasjach/liseuse-dashboard-kit";
import { KNOWLEDGE } from "../../showcase/widgetData";

/**
 * Un centre d'aide : une recherche qui pardonne les fautes, des catégories, des entrées qui
 * renvoient les unes aux autres.
 */
const meta = {
  title: "Widgets/KnowledgeBase",
  component: KnowledgeBase,
  parameters: {
    docs: {
      description: {
        component: [
          "Une **base de connaissances** : un centre d'aide, un glossaire, le guide d'une application — des entrées qu'on cherche, qu'on lit, et qui renvoient les unes aux autres.",
          "",
          "**Quand l'utiliser** — pour une aide intégrée de quelques dizaines d'entrées, sans serveur de recherche. Pour une recherche globale qui mène à des pages, `SearchOverlay` ; pour un texte long à lire d'un bloc, une simple page.",
          "",
          "**Anatomie** — deux colonnes. À gauche : le champ de recherche, les catégories en puces (avec « Tout » en tête), puis la liste des entrées trouvées — titre, résumé, catégorie. À droite : l'entrée ouverte — son résumé, ses paragraphes, ses astuces dans un encadré, et « Voir aussi », des boutons vers les entrées liées. Les mots cherchés sont surlignés partout où ils apparaissent.",
          "",
          "**Une recherche qui pardonne** — accents et casse ignorés, **début de mot** reconnu (« rel » trouve « relance »), **une faute de frappe** tolérée dans les mots de cinq lettres et plus (« facure »). Chaque mot de la requête doit se trouver quelque part ; le titre compte plus que les mots-clés (`keywords`, pour les synonymes et les fautes courantes), qui comptent plus que le texte.",
          "",
          "**Cadre étroit** — sous 640 px de large (celle du composant, mesurée par un `ResizeObserver`, pas celle de l'écran), une vue à la fois : la liste, puis l'entrée touchée avec un bouton « Retour » (`backLabel`) qui y ramène et rend le focus à l'entrée qu'on vient de lire.",
          "",
          "**Contrôlé ou non** — par défaut, la base tient elle-même l'entrée ouverte et la requête. `selectedId` + `onSelect` et `query` + `onQueryChange` les confient à l'application — pour ouvrir l'aide sur l'entrée qui explique l'écran en cours. Si l'entrée ouverte sort des résultats d'une recherche, la première trouvée s'affiche.",
          "",
          "**Thème** — `--lq-color-accent` (entrée ouverte, catégorie d'une entrée, encadré des astuces), `--lq-color-amber` (surlignage des mots cherchés), `--lq-color-panel`, `--lq-color-border-subtle`, `--lq-color-text`, `--lq-color-text-muted`, `--lq-radius-md`, `--lq-text-sm`, `--lq-text-xs`, `--lq-space-1` à `--lq-space-4`, et celles d'`Input` (le champ) et de `ChipGroup` (les catégories).",
        ].join("\n"),
      },
    },
  },
  args: {
    entries: KNOWLEDGE,
    placeholder: "Rechercher : facture, export, rôle…",
    emptyText: "Aucune entrée ne correspond.",
    allLabel: "Tout",
    backLabel: "Retour",
  },
  argTypes: {
    entries: { control: false },
    categories: { control: false },
    emptyText: { control: "text" },
    selectedId: { control: false },
    onSelect: { control: false },
    query: { control: false },
    onQueryChange: { control: false },
  },
  render: (args) => (
    <div style={{ height: 520 }}>
      <KnowledgeBase {...args} />
    </div>
  ),
} satisfies Meta<typeof KnowledgeBase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Non contrôlée : tapez « facure » ou « rel », cliquez une catégorie, suivez un « Voir aussi »." } } },
};

export const Controlled: Story = {
  name: "Pilotée par l'application",
  args: { onSelect: fn(), onQueryChange: fn() },
  render: function Render(args) {
    const [id, setId] = useState<string | null>("export");
    const [query, setQuery] = useState("");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <Button onClick={() => setId("securite")}>Ouvrir « Double authentification »</Button>
          <Button onClick={() => setQuery("facure")}>Chercher « facure »</Button>
          <Button onClick={() => setQuery("")}>Effacer</Button>
          <Text size="sm" muted>
            Ouverte : {id ?? "aucune"}
          </Text>
        </div>
        <div style={{ height: 480 }}>
          <KnowledgeBase
            {...args}
            selectedId={id}
            onSelect={(next) => {
              setId(next);
              args.onSelect?.(next);
            }}
            query={query}
            onQueryChange={(next) => {
              setQuery(next);
              args.onQueryChange?.(next);
            }}
          />
        </div>
      </div>
    );
  },
  parameters: { docs: { description: { story: "L'application tient l'entrée ouverte et la requête : des boutons extérieurs les changent." } } },
};

export const Narrow: Story = {
  name: "Cadre étroit",
  render: (args) => (
    <div style={{ width: 380, height: 520 }}>
      <KnowledgeBase {...args} />
    </div>
  ),
  parameters: { docs: { description: { story: "Dans 380 px, une vue à la fois : touchez une entrée, puis « Retour »." } } },
};

export const CategoriesOrder: Story = {
  name: "Catégories imposées",
  args: { categories: ["Comptes", "Facturation", "Données"], allLabel: "Toutes", emptyText: "Rien trouvé : essayez un autre mot." },
  parameters: { docs: { description: { story: "`categories` fixe les puces et leur ordre ; `allLabel` renomme la première." } } },
};
