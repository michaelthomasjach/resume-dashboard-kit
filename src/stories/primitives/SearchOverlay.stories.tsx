import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, within } from "storybook/test";
import {
  SearchOverlay,
  Button,
  Text,
  SearchIcon,
  UserIcon,
  FileIcon,
  type SearchOverlaySection,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { ORDERS } from "../../showcase/demoData";

const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
const euros = (n: number) => `${n.toLocaleString("fr-FR")} €`;
const CLIENTS = [...new Set(ORDERS.map((o) => o.client))];

/** Ce que l'application cherche elle-même : le calque ne filtre rien, il affiche des sections. */
function searchSections(query: string, withIcons: boolean): SearchOverlaySection[] {
  const q = fold(query.trim());
  if (!q) return [];
  const clients = CLIENTS.filter((c) => fold(c).includes(q));
  const orders = ORDERS.filter((o) => fold(`${o.id} ${o.client} ${o.produit}`).includes(q));
  return [
    {
      id: "clients",
      title: `Clients : ${query}`,
      results: clients.map((c) => ({
        id: c,
        label: c,
        details: `${ORDERS.filter((o) => o.client === c).length} commande(s)`,
        avatar: withIcons ? <UserIcon size={16} /> : undefined,
      })),
    },
    {
      id: "commandes",
      title: `Commandes : ${query}`,
      results: orders.map((o) => ({
        id: o.id,
        label: `${o.id} — ${o.client}`,
        details: `${o.produit} · ${euros(o.montant)}`,
        avatar: withIcons ? <FileIcon size={16} /> : undefined,
        avatarColor: withIcons ? "var(--lq-color-sky)" : undefined,
      })),
    },
  ];
}

/**
 * La recherche plein écran : un voile presque opaque, un champ en très grand corps, et les
 * résultats groupés par section.
 */
const meta = {
  title: "Primitives/SearchOverlay",
  component: SearchOverlay,
  parameters: {
    docs: {
      description: {
        component: [
          "Calque de recherche qui recouvre toute la page : la marque de l'application en haut à gauche, un bouton de fermeture en haut à droite, un champ en très grand corps, et dessous les résultats groupés en **sections** sur deux colonnes, chacun avec sa pastille ronde, son libellé et une ligne de détail.",
          "",
          "**L'application cherche, le calque affiche** — `query` est toujours contrôlée (`onQueryChange`), et c'est à l'appelant de calculer `sections` à partir d'elle. Une section vide n'est pas affichée ; si toutes le sont alors que la saisie ne l'est pas, `emptyText` prend leur place. Un résultat avec `onSelect` est un bouton, et `onSelect` est ce qu'il fait au clic — ouvrir la fiche, fermer le calque ; sans lui, c'est une simple ligne d'information, ni focalisable ni annoncée comme activable.",
          "",
          "**Clavier** — le champ prend le focus à l'ouverture ; Entrée appelle `onSubmit(query)` (ouvrir le premier résultat, lancer une recherche complète), Échap appelle `onClose`. Avec `onTypeToOpen`, taper un caractère n'importe où dans la page — hors d'un champ de saisie, sans Ctrl, Alt ni Méta — l'appelle avec ce caractère : l'application ouvre le calque avec cette première lettre déjà saisie.",
          "",
          "**Pastilles** — par défaut, l'initiale du libellé sur l'accent du thème ; `avatar` y met une icône ou une image, `avatarColor` change le fond.",
          "",
          "**Rendu dans un portail**, comme `Modal`, avec `role=\"dialog\"` et `aria-modal` : aucun ancêtre ne peut le recouvrir ni le rogner.",
          "",
          "**Quand l'utiliser** — la recherche globale d'une application, ouverte depuis la barre haute. Pour filtrer une liste sur place, un simple `Input` au-dessus de la liste ; pour choisir une valeur dans un formulaire, `InputDropdown` ou `Select`.",
          "",
          "**Thème** — le voile est `--lq-color-panel` à 95 % d'opacité ; `--lq-color-text`, `--lq-color-text-muted`, `--lq-color-accent` (pastilles, libellé survolé) et `--lq-color-accent-contrast`, `--lq-radius-pill`, `--lq-color-hover`, `--lq-space-2` à `--lq-space-6`, `--lq-font-weight-bold`. Trois variables propres au calque, non redéfinies par ce thème : `--lq-search-overlay-inset` (marge gauche, 100 px), `--lq-search-overlay-font-size` (corps du champ) et `--lq-search-overlay-z-index`.",
        ].join("\n"),
      },
    },
  },
  args: {
    open: false,
    onClose: fn(),
    query: "",
    onQueryChange: fn(),
    onSubmit: fn(),
    brand: <strong>resume</strong>,
    placeholder: "Rechercher un client, une commande…",
    hint: "Entrée ouvre le premier résultat · Échap ferme",
    emptyText: "Aucun client ni commande ne correspond.",
  },
  argTypes: {
    open: { control: false },
    query: { control: false },
    sections: { control: false },
    brand: { control: false },
    hint: { control: "text" },
    emptyText: { control: "text" },
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [last, setLast] = useState<string | null>(null);
    const close = () => {
      setOpen(false);
      setQuery("");
      args.onClose();
    };
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
        <Button icon={<SearchIcon size={16} />} onClick={() => setOpen(true)}>
          Rechercher
        </Button>
        <Text size="sm" muted>
          {last ?? "Ouvrez la recherche, puis tapez « ro » ou « abonnement »."}
        </Text>
        <SearchOverlay
          {...args}
          open={open}
          onClose={close}
          query={query}
          onQueryChange={(q) => {
            setQuery(q);
            args.onQueryChange(q);
          }}
          onSubmit={(q) => {
            setLast(`Recherche lancée : « ${q} »`);
            args.onSubmit?.(q);
            close();
          }}
          sections={searchSections(query, false).map((section) => ({
            ...section,
            results: section.results.map((r) => ({
              ...r,
              onSelect: () => {
                setLast(`Résultat ouvert : ${r.label}`);
                close();
              },
            })),
          }))}
        />
      </div>
    );
  },
} satisfies Meta<typeof SearchOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sur le canevas seul, la story ouvre le calque et saisit une recherche. */
const openAndType = (text: string) =>
  async function play({ canvasElement }: { canvasElement: HTMLElement }) {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /Rechercher/ }));
    const input = document.body.querySelector<HTMLInputElement>(".lq-search-overlay__input");
    if (input && text) await userEvent.type(input, text);
  };

export const Default: Story = {
  name: "Défaut",
  play: openAndType("ro"),
};

export const WithIcons: Story = {
  name: "Pastilles à icône",
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    return (
      <div>
        <Button icon={<SearchIcon size={16} />} onClick={() => setOpen(true)}>
          Rechercher
        </Button>
        <SearchOverlay
          {...args}
          open={open}
          onClose={() => {
            setOpen(false);
            setQuery("");
          }}
          query={query}
          onQueryChange={setQuery}
          sections={searchSections(query, true).map((s) => ({
            ...s,
            results: s.results.map((r) => ({ ...r, onSelect: () => setOpen(false) })),
          }))}
        />
      </div>
    );
  },
  play: openAndType("abonnement"),
  parameters: {
    docs: { description: { story: "`avatar` remplace l'initiale par une icône, `avatarColor` change le fond ; chaque résultat a un `onSelect` qui ferme le calque." } },
  },
};

export const Empty: Story = {
  name: "Aucun résultat",
  play: openAndType("zzz"),
  parameters: { docs: { description: { story: "Toutes les sections sont vides : `emptyText` s'affiche à leur place." } } },
};

export const TypeToOpen: Story = {
  name: "Taper pour ouvrir",
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Text size="sm">Cliquez dans cette zone, puis tapez une lettre — sans viser de champ.</Text>
        <Text size="sm" muted>
          Le calque s'ouvre avec cette lettre déjà saisie.
        </Text>
        <SearchOverlay
          {...args}
          open={open}
          onClose={() => {
            setOpen(false);
            setQuery("");
          }}
          query={query}
          onQueryChange={setQuery}
          onTypeToOpen={(first) => {
            setQuery(first);
            setOpen(true);
          }}
          sections={searchSections(query, false)}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Avec `onTypeToOpen`, une frappe n'importe où ouvre la recherche. Attention : sur cette page de documentation, l'écoute vaut pour toute la page.",
      },
    },
  },
};
