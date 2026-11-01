import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Timeline,
  AlertTriangleIcon,
  CheckIcon,
  CommentIcon,
  LockIcon,
  RefreshIcon,
  UploadCloudIcon,
  UserIcon,
  type TimelineEntry,
} from "@michaelthomasjach/liseuse-dashboard-kit";

/** Une semaine d'équipe : un déploiement en cours, une revue, un incident, une arrivée. */
const ENTRIES: TimelineEntry[] = [
  {
    id: "deploy",
    day: "Aujourd'hui",
    date: "14:32",
    dateTime: "2026-11-01T14:32",
    title: "Mise en production de la v2.4",
    content: "Le déploiement progressif est à 40 % des serveurs. Aucune alerte pour l'instant.",
    icon: <UploadCloudIcon />,
    tone: "info",
    author: { name: "Claire Moreau" },
    current: true,
  },
  {
    id: "review",
    day: "Aujourd'hui",
    date: "11:05",
    dateTime: "2026-11-01T11:05",
    title: "Revue de code approuvée",
    content: "« Pagination côté serveur » — 3 approbations, 12 commentaires résolus.",
    icon: <CheckIcon />,
    tone: "success",
    author: { name: "Julien Petit" },
  },
  {
    id: "comment",
    day: "Aujourd'hui",
    date: "09:48",
    dateTime: "2026-11-01T09:48",
    title: "Nouveau commentaire sur le ticket #482",
    author: { name: "Inès Garnier" },
  },
  {
    id: "incident",
    day: "Hier",
    date: "22:17",
    dateTime: "2026-10-31T22:17",
    title: "Incident : latence de l'API de paiement",
    content: "Temps de réponse médian à 1,8 s pendant 14 minutes. Résolu par un redémarrage du pool de connexions.",
    icon: <AlertTriangleIcon />,
    tone: "danger",
  },
  {
    id: "rotate",
    day: "Hier",
    date: "16:40",
    dateTime: "2026-10-31T16:40",
    title: "Rotation des clés d'accès",
    icon: <LockIcon />,
    author: { name: "Paul Lefèvre" },
  },
  {
    id: "member",
    day: "29 octobre",
    date: "10:12",
    dateTime: "2026-10-29T10:12",
    title: "Sophie Laurent a rejoint l'équipe Produit",
    icon: <UserIcon />,
    tone: "accent",
  },
  {
    id: "sync",
    day: "29 octobre",
    date: "08:00",
    dateTime: "2026-10-29T08:00",
    title: "Synchronisation nocturne terminée",
    content: "18 432 enregistrements, 0 rejet.",
    tone: "success",
  },
];

/**
 * Frise chronologique d'activité : ce qui s'est passé, dans l'ordre, jalonné.
 */
const meta = {
  title: "Widgets/Timeline",
  component: Timeline,
  parameters: {
    docs: {
      description: {
        component: [
          "Une **frise chronologique verticale** : un fil, un jalon par entrée, et pour chacune une date, un titre, un auteur et un contenu libre. Les entrées se regroupent par jour sous un intitulé ; l'entrée en cours se distingue par un anneau qui respire et une étiquette.",
          "",
          "**Quand l'utiliser** — l'historique d'un objet (une commande, un ticket, un déploiement), le journal d'activité d'une équipe, les étapes passées d'un dossier. Pour une rangée de scénarios à déclencher, c'est `DayTimelineWidget` ; pour des étapes à venir avec un état (faite, en cours, à faire), `Stepper` ou `ObjectiveTracker` ; pour un fil de publications avec réactions et commentaires, `ActivityFeed`.",
          "",
          "**Entrées** — `entries` décrit chaque jalon : `id`, `date` (le texte affiché, que le composant ne formate pas), `dateTime` (la même date en ISO, posée sur `<time>`), `day` (l'intitulé du groupe), `title`, `content` (n'importe quel `ReactNode` : un paragraphe, une image, des boutons), `icon` (une pastille ronde avec l'icône ; sans icône, un simple point), `tone` (`accent`, `success`, `info`, `danger`, `warning`, `dark` — les tons pleins du kit), `author` (`name`, `avatarSrc` : un petit `Avatar` et le nom à côté de la date), `current`.",
          "",
          "**Variantes** — `variant=\"left\"` (défaut) : le fil à gauche. `\"alternate\"` : le fil au milieu, les entrées de part et d'autre, la date passée en face ; c'est une **requête de conteneur** qui décide : sous 640 px de large, la frise se replie d'elle-même en une colonne, quelle que soit la fenêtre. `\"compact\"` : petits points, date et titre sur une ligne, contenu atténué, nom de l'auteur sans avatar — pour une colonne latérale. `boxed` pose chaque entrée sur une surface de carte. `groupByDay={false}` ignore `day`.",
          "",
          "**Accessibilité** — une `<section>` nommée (`ariaLabel`, « Chronologie » par défaut), une liste ordonnée par jour, étiquetée par son intitulé (`<h3>`). Chaque date est un `<time>`. L'entrée en cours porte `aria-current=\"step\"`. Les jalons sont décoratifs (`aria-hidden`) : la couleur d'un ton ne porte aucune information que le titre ne dise pas. Rien n'est focalisable : un contenu interactif posé dans `content` garde son propre ordre de tabulation. L'anneau de l'entrée en cours ne bouge plus sous `prefers-reduced-motion`.",
          "",
          "**Thème** — `--lq-color-border-subtle` (le fil), `--lq-color-text-muted` (dates, points sans ton), `--lq-color-panel` (liseré des jalons, cartes), `--lq-label-*` (intitulés de jour), `--lq-shadow-panel`, `--lq-color-panel-border`, et les tons `--lq-tone-*`. Réglages propres, optionnels : `--lq-timeline-line`, `--lq-timeline-line-width` (2 px), `--lq-timeline-marker-size` (32 px), `--lq-timeline-dot-size` (12 px), `--lq-timeline-compact-dot-size` (8 px), `--lq-timeline-dot-color`, `--lq-timeline-marker-border` (2 px du fond de panneau), `--lq-timeline-gap`, `--lq-timeline-item-gap`, `--lq-timeline-date-size`. Ce thème tire le filet bleu de 4 px du CV (`#3a41e2`, `#7c82ff` en sombre), des pastilles de 36 px cerclées de 3 px du fond de page.",
        ].join("\n"),
      },
    },
  },
  args: {
    entries: ENTRIES,
    variant: "left",
    groupByDay: true,
    boxed: false,
    currentLabel: "En cours",
    emptyMessage: "Aucune activité",
    ariaLabel: "Chronologie",
  },
  argTypes: {
    entries: { control: "object" },
    variant: { control: "inline-radio", options: ["left", "alternate", "compact"], table: { defaultValue: { summary: '"left"' } } },
    groupByDay: { control: "boolean", table: { defaultValue: { summary: "true" } } },
    boxed: { control: "boolean", table: { defaultValue: { summary: "false" } } },
    currentLabel: { control: "text", table: { defaultValue: { summary: '"En cours"' } } },
    emptyMessage: { control: "text", table: { defaultValue: { summary: '"Aucune activité"' } } },
    ariaLabel: { control: "text", table: { defaultValue: { summary: '"Chronologie"' } } },
    className: { control: false },
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <Timeline {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Alignée à gauche, regroupée par jour. Les entrées marquantes ont une pastille à icône colorée par ton, les mineures un simple point ; la première est en cours.",
      },
    },
  },
};

export const Alternate: Story = {
  name: "Alternée",
  args: { variant: "alternate" },
  parameters: {
    docs: {
      description: {
        story: "`variant=\"alternate\"` : le fil au milieu, une entrée sur deux de chaque côté, la date passée en face. À gauche du fil, le texte s'aligne sur lui.",
      },
    },
  },
};

export const Boxed: Story = {
  name: "En cartes",
  args: { variant: "alternate", boxed: true },
  parameters: {
    docs: {
      description: {
        story: "`boxed` : chaque entrée sur une surface de carte — fond de panneau, ombre et rayon du thème. Dans ce thème, des cartes à angles droits posées sur le papier du CV.",
      },
    },
  },
};

export const Compact: Story = {
  name: "Compacte",
  args: { variant: "compact" },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Timeline {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "`variant=\"compact\"` dans une colonne de 360 px : points de 8 px, date et titre sur une ligne, l'auteur réduit à son nom. Les icônes sont ignorées, le ton colore le point.",
      },
    },
  },
};

export const AlternateNarrow: Story = {
  name: "Alternée, conteneur étroit",
  args: { entries: ENTRIES.slice(0, 4), variant: "alternate", boxed: true },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <Timeline {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "La même variante alternée dans un conteneur de 420 px : sous 640 px, elle se replie en une colonne, le fil à gauche. C'est la largeur du conteneur qui compte, pas celle de la fenêtre — une frise posée dans une colonne latérale se replie même sur un grand écran.",
      },
    },
  },
};

export const Ungrouped: Story = {
  name: "Sans regroupement",
  args: {
    groupByDay: false,
    entries: [
      { id: "a", date: "1 nov., 14:32", title: "Sauvegarde restaurée", icon: <RefreshIcon />, tone: "warning" },
      { id: "b", date: "31 oct., 18:10", title: "Commentaire ajouté", content: "« Peut-on décaler la livraison à jeudi ? »", icon: <CommentIcon /> },
      { id: "c", date: "30 oct., 09:00", title: "Commande créée" },
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Timeline {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "`groupByDay={false}`, ou des entrées sans `day` : une seule liste, chaque date complète. Une pastille sans ton reste neutre — fond de panneau, filet, icône atténuée.",
      },
    },
  },
};

export const Empty: Story = {
  name: "Vide",
  args: { entries: [], emptyMessage: "Aucune activité cette semaine" },
  parameters: { docs: { description: { story: "Sans entrée, le fil reste tiré et `emptyMessage` s'affiche à sa droite." } } },
};
