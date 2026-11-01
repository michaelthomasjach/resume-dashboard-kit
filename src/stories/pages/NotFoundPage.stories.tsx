import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { NotFoundPage, FileIcon, SearchIcon } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * La page introuvable : un grand code, un message, et le chemin du retour.
 */
const meta = {
  title: "Pages/NotFoundPage",
  component: NotFoundPage,
  parameters: {
    layout: "fullscreen", rdkPadding: 0,
    docs: {
      story: { inline: false, iframeHeight: "480px" },
      description: {
        component: [
          "**Page d'erreur** centrée — 404 le plus souvent : un grand code, une phrase d'explication, une action pour repartir, et au choix une illustration au-dessus.",
          "",
          "**Quand l'utiliser** — la route inconnue d'un routeur, ou un enregistrement introuvable (facture supprimée, lien expiré). Par défaut elle occupe au moins toute la hauteur de la fenêtre : rendez-la seule. Dans la zone de contenu d'une coquille ou dans un cadre, passez `fullHeight={false}` : elle remplit son conteneur et s'y centre (story « Dans un cadre »). Pour une liste simplement vide, un message dans la liste suffit.",
          "",
          "**Anatomie** — `illustration` (n'importe quel `ReactNode`, en couleur pâle), `title` (le code, « 404 » par défaut, en très grand et en chiffres tabulaires), `message` (« Cette page n'existe pas ou a été déplacée. » par défaut), puis l'action, libellée `actionLabel` (« Retour à l'accueil » par défaut).",
          "",
          "**L'action** — avec `onAction`, c'est un `Button` qui l'appelle (votre routeur navigue). Sans `onAction`, c'est un **lien** `<a>` vers `actionHref` (`/` par défaut), stylé en bouton : il recharge la page, ce qui convient à une application sans routeur côté client.",
          "",
          "**Accessibilité** — le code (`title`) est le `<h1>` de la page : un lecteur d'écran qui parcourt les titres sait d'emblée où il est tombé.",
          "",
          "**Thème** — `--lq-color-bg`, `--lq-color-text` (code), `--lq-color-text-muted` (message, illustration), `--lq-font-weight-bold`, `--lq-space-3`, `--lq-space-6`, et les variables du bouton.",
        ].join("\n"),
      },
    },
  },
  args: { onAction: fn() },
  argTypes: {
    title: { control: "text", table: { defaultValue: { summary: '"404"' } } },
    message: { control: "text", table: { defaultValue: { summary: "\"Cette page n'existe pas ou a été déplacée.\"" } } },
    actionLabel: { control: "text", table: { defaultValue: { summary: "\"Retour à l'accueil\"" } } },
    actionHref: { control: "text", table: { defaultValue: { summary: '"/"' } } },
    illustration: { control: false },
  },
} satisfies Meta<typeof NotFoundPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Les textes par défaut du kit, déjà en français ; seul `onAction` est fourni." } } },
};

export const MissingRecord: Story = {
  name: "Enregistrement introuvable",
  args: {
    message: "Cette facture n'existe pas, ou a été archivée.",
    actionLabel: "Retour aux factures",
    illustration: <FileIcon size={48} />,
  },
  parameters: { docs: { description: { story: "Le cas le plus utile : dire **ce qui** manque, et ramener à la liste d'où l'on vient." } } },
};

export const OtherCode: Story = {
  name: "Autre code",
  args: {
    title: "410",
    message: "Ce lien de partage a expiré. Demandez-en un nouveau à son auteur.",
    actionLabel: "Rechercher un document",
    illustration: <SearchIcon size={48} />,
  },
  parameters: { docs: { description: { story: "`title` porte n'importe quel code : 403, 410, 500…" } } },
};

export const AsLink: Story = {
  name: "Lien plutôt que bouton",
  args: { onAction: undefined, actionHref: "#accueil", actionLabel: "Retour à l'accueil" },
  parameters: { docs: { description: { story: "Sans `onAction`, l'action est un lien `<a href>` à l'apparence d'un bouton." } } },
};

export const InFrame: Story = {
  name: "Dans un cadre",
  args: { fullHeight: false },
  decorators: [
    (Story) => (
      <div style={{ padding: 30 }}>
        <div style={{ width: 420, height: 380, border: "1px solid var(--lq-color-border)", overflow: "auto" }}>
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: "`fullHeight={false}` : la page prend la hauteur de son cadre (420 × 380) et s'y centre, au lieu d'imposer celle de la fenêtre ; la taille du code suit la largeur du cadre.",
      },
    },
  },
};
