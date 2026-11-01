import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ServerErrorPage, AlertTriangleIcon, PlugIcon } from "@michaelthomasjach/liseuse-dashboard-kit";

/** Une nouvelle tentative qui prend une seconde, pour voir l'état occupé du bouton. */
const slowRetry = () => new Promise<void>((resolve) => setTimeout(resolve, 1000));

/**
 * La page d'erreur serveur : un grand code, un titre, une explication, de quoi réessayer ou repartir.
 */
const meta = {
  title: "Pages/ServerErrorPage",
  component: ServerErrorPage,
  parameters: {
    layout: "fullscreen",
    rdkPadding: 0,
    docs: {
      story: { inline: false, iframeHeight: "560px" },
      description: {
        component: [
          "**Page d'erreur serveur** centrée — 500 par défaut, 502, 503 ou 504 aussi : un grand code, un titre, une phrase d'explication, les actions « Réessayer » et « Retour à l'accueil », et l'identifiant d'incident à transmettre au support. Même famille que `NotFoundPage`.",
          "",
          "**Quand l'utiliser** — la frontière d'erreur (`ErrorBoundary`) d'une route, une réponse 5xx de l'API qui empêche tout l'écran de s'afficher, une maintenance planifiée. Pour une seule carte en échec, un message dans la carte suffit ; pour une route inconnue, `NotFoundPage`.",
          "",
          "**Hauteur** — la page **remplit son conteneur** (`min-height: 100%`) au lieu d'imposer la hauteur de la fenêtre : elle tient dans la zone de contenu d'une coquille, dans un cadre, dans une vitrine. Rendue seule, passez `fullHeight` : elle prend alors au moins `100dvh`. Les stories l'utilisent ; « Dans un cadre » montre l'autre cas.",
          "",
          "**Anatomie** — `illustration` (facultative, en couleur atténuée), `code` (« 500 »), `title` (un vrai `<h1>`, « Erreur interne du serveur »), `message`, puis les actions, l'identifiant d'incident et `footer` (un lien vers la page d'état, l'adresse du support).",
          "",
          "**Actions** — `onRetry` ajoute « Réessayer » (`retryLabel`), bouton principal. S'il rend une **promesse**, le bouton reste occupé (`aria-busy`) jusqu'à ce qu'elle soit tenue ou rompue, et ne relance rien entre-temps. L'action « accueil » (`homeLabel`) est un **bouton** qui appelle `onHome` quand il est fourni, sinon un **lien** vers `homeHref` (`/` par défaut) ; `homeHref={null}` la retire.",
          "",
          "**Identifiant d'incident** — `incidentId` l'affiche en police à chasse fixe (un clic le sélectionne entier) avec un bouton qui le copie dans le presse-papiers ; l'icône devient une coche deux secondes et « Copié » est annoncé aux lecteurs d'écran. Libellés : `incidentLabel`, `copyLabel`, `copiedLabel`.",
          "",
          "**Clavier et accessibilité** — tout se fait à la tabulation : Réessayer, accueil, copier. Le bouton occupé garde le focus (`aria-disabled` plutôt que `disabled`). La page porte un `<h1>`, contrairement à `NotFoundPage`.",
          "",
          "**Thème** — `--lq-color-bg`, `--lq-color-text`, `--lq-color-text-muted`, `--lq-color-border` (cadre en tirets de l'incident), `--lq-font-mono`, `--lq-text-h3`, `--lq-text-sm`, `--lq-space-2` à `--lq-space-6`, les variables du bouton. Variables optionnelles : `--lq-error-code-size` / `-weight` / `-tracking` et `--lq-error-title-size` / `-weight` — ce thème met le code à 86 px (5,4 rem), serré de −0,01 em, et le titre à 27 px, tous deux en 700, comme le nom et les intitulés du CV.",
        ].join("\n"),
      },
    },
  },
  args: { fullHeight: true, onRetry: slowRetry },
  argTypes: {
    code: { control: "text", table: { defaultValue: { summary: '"500"' } } },
    title: { control: "text", table: { defaultValue: { summary: '"Erreur interne du serveur"' } } },
    message: { control: "text" },
    retryLabel: { control: "text", table: { defaultValue: { summary: '"Réessayer"' } } },
    homeLabel: { control: "text", table: { defaultValue: { summary: "\"Retour à l'accueil\"" } } },
    homeHref: { control: "text", table: { defaultValue: { summary: '"/"' } } },
    incidentId: { control: "text" },
    incidentLabel: { control: "text", table: { defaultValue: { summary: "\"Identifiant d'incident\"" } } },
    fullHeight: { control: "boolean", table: { defaultValue: { summary: "false" } } },
    illustration: { control: false },
    footer: { control: false },
    onRetry: { control: false },
    onHome: { control: false },
  },
} satisfies Meta<typeof ServerErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Les textes par défaut, en français ; « Réessayer » met une seconde à répondre — cliquez pour voir l'état occupé. L'accueil est un lien vers `/`." } } },
};

export const WithIncident: Story = {
  name: "Avec identifiant d'incident",
  args: {
    illustration: <AlertTriangleIcon size={48} />,
    incidentId: "INC-7F3A-20261101-0942",
    footer: (
      <>
        Le problème persiste ? Écrivez à <a href="mailto:support@exemple.fr">support@exemple.fr</a> en citant l'identifiant.
      </>
    ),
  },
  parameters: { docs: { description: { story: "Le cas utile en production : l'identifiant que le support retrouvera dans ses journaux, copiable d'un clic, et le chemin vers lui en pied de page." } } },
};

export const ServiceUnavailable: Story = {
  name: "Maintenance (503)",
  args: {
    code: "503",
    title: "Service en maintenance",
    message: "Nous mettons à jour la plateforme. Elle sera de retour vers 6 h ; vos données ne sont pas affectées.",
    illustration: <PlugIcon size={48} />,
    onRetry: undefined,
    onHome: fn(),
    homeLabel: "Voir la page d'état",
  },
  parameters: { docs: { description: { story: "Sans `onRetry`, pas de bouton « Réessayer » ; avec `onHome`, l'action restante est un bouton que votre routeur prend en main." } } },
};

export const InFrame: Story = {
  name: "Dans un cadre",
  args: { fullHeight: false, incidentId: "INC-7F3A" },
  render: (args) => (
    <div style={{ padding: 30 }}>
      <div style={{ width: 380, height: 480, border: "1px solid var(--lq-color-border)" }}>
        <ServerErrorPage {...args} />
      </div>
    </div>
  ),
  parameters: { docs: { description: { story: "Sans `fullHeight`, la page prend la hauteur de son conteneur — ici un cadre de 380 × 480 — et s'y centre, au lieu de déborder sur la hauteur de la fenêtre." } } },
};
