import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ActivityFeed, type ActivityFeedProps, type ActivityPost } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ACTIVITY_POSTS } from "../_data/activityFeed";

const ME = { name: "Michaël Thomas" };

/**
 * Un fil vivant : le composant ne retient pas les réactions, c'est cet état-ci qui les tient, comme
 * le ferait l'application. Les rappels reçus en `args` sont aussi appelés, pour le panneau Actions.
 */
function LiveFeed(props: ActivityFeedProps) {
  const [posts, setPosts] = useState<ActivityPost[]>(props.posts);
  const update = (id: string, f: (p: ActivityPost) => ActivityPost) => setPosts((all) => all.map((p) => (p.id === id ? f(p) : p)));
  return (
    <ActivityFeed
      {...props}
      posts={posts}
      onLike={(id, liked) => {
        props.onLike?.(id, liked);
        update(id, (p) => ({ ...p, liked, likes: (p.likes ?? 0) + (liked ? 1 : -1) }));
      }}
      onShare={(id) => {
        props.onShare?.(id);
        update(id, (p) => ({ ...p, shares: (p.shares ?? 0) + 1 }));
      }}
      onComment={(id, text) => {
        props.onComment?.(id, text);
        update(id, (p) => ({
          ...p,
          commentCount: (p.commentCount ?? p.comments?.length ?? 0) + 1,
          comments: [...(p.comments ?? []), { id: `new-${id}-${p.comments?.length ?? 0}`, author: ME, text, time: "à l'instant" }],
        }));
      }}
    />
  );
}

/**
 * Le fil de publications d'un réseau social interne.
 */
const meta = {
  title: "Widgets/ActivityFeed",
  component: ActivityFeed,
  parameters: {
    docs: {
      description: {
        component: [
          "Un **fil de publications** façon réseau social d'entreprise : qui a fait quoi et quand, le texte, une image, puis les réactions — **j'aime** avec son compteur, **commentaires** repliables avec une zone « Écrire un commentaire », **partage**.",
          "",
          "**Quand l'utiliser** — le mur d'une équipe, l'actualité d'un intranet, les échanges autour d'un objet. Pour un simple historique daté, sans réaction, préférez `Timeline` ; pour une conversation à deux, `ChatPanel` ; pour une liste de notifications, `NotificationCenter`.",
          "",
          "**Publications** — `posts` décrit chacune : `author` (`name`, `avatarSrc` — sans image, l'`Avatar` affiche les initiales), `action` (« a publié », « a commenté »), `target` (ce sur quoi porte l'action), `time` (l'horodatage relatif **déjà écrit** par l'appelant : le composant ne calcule rien, il ne connaît pas l'heure), `dateTime` (la même date en ISO, sur `<time>`), `text`, `image` (`src`, `alt`), `likes`, `liked`, `shares`, `comments` (`id`, `author`, `text`, `time`) et `commentCount` quand il y en a plus que de chargés.",
          "",
          "**Réactions** — le composant est **contrôlé** : il n'incrémente rien lui-même. `onLike(id, liked)` reçoit l'état voulu, à l'appelant de mettre à jour `liked` et `likes` ; sans ce rappel, le bouton est désactivé. `onShare(id)` : sans lui, pas de bouton Partager. `onComment(id, texte)` : sans lui, pas de zone de saisie ; Entrée ou « Publier » l'envoie, le champ se vide. Le dépliage des commentaires, lui, est interne (`defaultOpenComments` pour en ouvrir au départ). Les compteurs sont abrégés à la française (« 23 k », « 5,3 k ») ; `locale` en change la langue. `currentUser` place l'avatar du lecteur devant la zone de saisie, `labels` change tous les textes.",
          "",
          "**Variantes** — `variant=\"cards\"` (défaut) : une carte par publication, l'image à fond perdu en 16:9. `\"list\"` : des lignes séparées d'un filet, le texte coupé à deux lignes, l'image en vignette carrée à droite, les réactions réduites à leurs icônes et compteurs (les libellés restent pour les lecteurs d'écran).",
          "",
          "**Clavier et accessibilité** — le fil est un `role=\"feed\"` ; chaque publication est un `<article>` focalisable, étiqueté par son en-tête, avec `aria-posinset` / `aria-setsize`. **Page suivante** et **Page précédente** passent d'une publication à l'autre. « J'aime » porte `aria-pressed` ; « Commenter » porte `aria-expanded` et `aria-controls` sur la zone des commentaires. Le champ de saisie est nommé par son texte d'invite.",
          "",
          "**Thème** — `--lq-color-panel`, `--lq-color-panel-border`, `--lq-shadow-panel`, `--lq-radius-md` (cartes), `--lq-color-text-muted` (action, heure, boutons au repos), `--lq-color-hover` (survol des boutons), `--lq-color-rose` (cœur enfoncé), `--lq-color-border-subtle` (filets). Réglages propres, optionnels : `--lq-activity-gap`, `--lq-activity-padding` (16 px), `--lq-activity-liked`, `--lq-activity-comments-bg`, `--lq-activity-bubble-bg`, `--lq-activity-name-weight` (600), `--lq-activity-media-ratio` (16 / 9). Ce thème met le nom de l'auteur en gras (`--lq-activity-name-weight: 700`) et le cœur « aimé » en rouge `#c4213a` (`#ef6b7b` en sombre), sur des cartes à angles droits.",
        ].join("\n"),
      },
    },
  },
  args: {
    posts: ACTIVITY_POSTS,
    variant: "cards",
    currentUser: ME,
    locale: "fr-FR",
    emptyMessage: "Aucune publication",
    onLike: fn(),
    onShare: fn(),
    onComment: fn(),
  },
  argTypes: {
    posts: { control: "object" },
    variant: { control: "inline-radio", options: ["cards", "list"], table: { defaultValue: { summary: '"cards"' } } },
    currentUser: { control: "object" },
    defaultOpenComments: { control: "object" },
    locale: { control: "text", table: { defaultValue: { summary: '"fr-FR"' } } },
    labels: { control: "object" },
    emptyMessage: { control: "text", table: { defaultValue: { summary: '"Aucune publication"' } } },
    onLike: { control: false },
    onShare: { control: false },
    onComment: { control: false },
    className: { control: false },
  },
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <LiveFeed {...args} />
    </div>
  ),
} satisfies Meta<typeof ActivityFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: {
    docs: {
      description: {
        story: "En cartes. Essayez « J'aime » (le cœur se remplit, le compteur suit), « Partager », et « Commenter » pour déplier les commentaires.",
      },
    },
  },
};

export const CommentsOpen: Story = {
  name: "Commentaires dépliés",
  args: { defaultOpenComments: ["p1"] },
  parameters: {
    docs: {
      description: {
        story: "`defaultOpenComments` ouvre les commentaires de la première publication : des bulles, puis la zone « Écrire un commentaire » précédée de l'avatar de `currentUser`. Un commentaire envoyé s'ajoute en bas de la liste.",
      },
    },
  },
};

export const List: Story = {
  name: "Liste compacte",
  args: { variant: "list" },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <LiveFeed {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "`variant=\"list\"` : une ligne par publication, le texte coupé à deux lignes, l'image en vignette. Pour une colonne latérale ou un widget de tableau de bord.",
      },
    },
  },
};

export const ReadOnly: Story = {
  name: "Lecture seule",
  args: { posts: ACTIVITY_POSTS.slice(0, 3), onLike: undefined, onShare: undefined, onComment: undefined },
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <ActivityFeed {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Sans rappels : « J'aime » est désactivé mais garde son compteur, « Partager » disparaît, et les commentaires se déplient sans zone de saisie.",
      },
    },
  },
};

export const Empty: Story = {
  name: "Vide",
  args: { posts: [], emptyMessage: "Personne n'a encore rien publié." },
  parameters: { docs: { description: { story: "Sans publication, `emptyMessage` à la place du fil." } } },
};
