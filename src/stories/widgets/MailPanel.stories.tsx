import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { MailPanel, Text, type MailMessage } from "@michaelthomasjach/liseuse-dashboard-kit";
import { MAIL_FOLDERS, MAIL_MESSAGES, MAIL_NOW } from "../_data/mailPanel";

/** Le cadre des stories : le composant remplit son conteneur, il lui faut une hauteur. */
function Frame({ width, height = 620, children }: { width?: number; height?: number; children: ReactNode }) {
  return <div style={{ height, width, maxWidth: "100%", boxShadow: "var(--lq-shadow-panel)" }}>{children}</div>;
}

/**
 * La boîte mail : dossiers, liste des messages, panneau de lecture.
 */
const meta = {
  title: "Widgets/MailPanel",
  component: MailPanel,
  parameters: {
    docs: {
      description: {
        component: [
          "Une **boîte mail** en trois colonnes : les **dossiers** (Réception, Envoyés, Brouillons, Corbeille… avec leurs compteurs, et le bouton « Nouveau message »), la **liste** des messages du dossier ouvert (expéditeur, objet, extrait, date, non-lu en gras, étoile, trombone pour une pièce jointe, case à cocher, recherche), et le **panneau de lecture** (objet, expéditeur, destinataires, date, corps, pièces jointes, Répondre / Transférer / Supprimer).",
          "",
          "**Quand l'utiliser** — une messagerie, une file de tickets ou de demandes qu'on lit une à une, une boîte de notifications détaillées. Pour un fil de discussion, `ChatPanel` ; pour une simple liste d'événements, `ActivityFeed` ou `Timeline`.",
          "",
          "**Remplit son conteneur** — `height: 100%` : posez-le dans un bloc qui a une hauteur. Chaque colonne défile seule. Sous **860 px de large** (une requête de **conteneur**, pas de fenêtre : il suffit que *son* bloc soit étroit), une seule colonne à la fois : la liste, le message ouvert avec « Retour », ou les dossiers derrière le bouton ☰. Sous 520 px, Répondre et Transférer ne gardent que leur icône.",
          "",
          "**Dossiers** — `folders` : `id`, `label`, `role` (`inbox`, `sent`, `drafts`, `trash`, `spam`, `archive`, `custom` — donne l'icône par défaut), `icon` pour la remplacer, `count` pour imposer le compteur (sinon : les non-lus du dossier, le total pour les brouillons ; 0 le masque), `group` pour un intertitre (« Libellés ») — les dossiers sans groupe viennent en tête.",
          "",
          "**Messages** — `id`, `folderId`, `from` (`name`, `email`, `avatarSrc`), `to`, `cc`, `subject`, `preview` (sinon le début de `body` s'il est textuel), `body` (un texte garde ses retours à la ligne ; un nœud React est rendu tel quel), `date` (ISO ou `Date`), `unread`, `starred`, `attachments` (`name`, `size` déjà formatée, `href` pour un lien de téléchargement).",
          "",
          "**Contrôlé ou libre** — chaque état a sa prop contrôlée et sa valeur de départ : `folderId` / `defaultFolderId`, `selectedId` / `defaultSelectedId`, `checkedIds` / `defaultCheckedIds`, `query` / `defaultQuery`, avec leurs rappels `onFolderChange`, `onSelect`, `onCheckedChange`, `onQueryChange`. Les messages aussi : avec `messages`, le composant ne touche à rien et signale chaque action (`onMarkRead(ids, read)`, `onToggleStar(id, starred)`, `onDelete(ids)`) ; avec `defaultMessages` (démos), il applique lui-même lu / non lu, étoile et suppression — vers le dossier `role: \"trash\"`, ou définitivement depuis la corbeille — et appelle quand même les rappels. Ouvrir un message non lu le marque comme lu.",
          "",
          "**Boutons** — en mode contrôlé, l'étoile, lu / non lu et la corbeille n'apparaissent que si leur rappel est fourni. « Nouveau message », « Répondre » et « Transférer » n'apparaissent qu'avec `onCompose`, `onReply`, `onForward` : écrire un message reste l'affaire de l'application.",
          "",
          "**Actions groupées** — la case de tête coche ou décoche tous les messages affichés (état intermédiaire quand une partie l'est) ; dès qu'un message est coché, « Marquer comme lu », « Marquer comme non lu » et « Supprimer » s'affichent à côté du compteur. Changer de dossier vide la sélection.",
          "",
          "**Recherche** — sur l'expéditeur (nom et adresse), l'objet et l'extrait, dans le dossier ouvert, sans tenir compte des accents ni de la casse.",
          "",
          "**Dates** — l'heure pour un message du jour, « 27 oct. » dans l'année, « 30/11/2025 » au-delà ; dans le panneau de lecture, « jeudi 29 octobre 2026 à 10:42 ». `now` fixe l'instant de référence (indispensable pour un rendu reproductible), `formatDate(date, where)` remplace le tout.",
          "",
          "**Clavier et accessibilité** — la racine est une région nommée (`ariaLabel`, « Messagerie »), les dossiers une `nav` dont l'entrée ouverte porte `aria-current`. Dans la liste, ↑ / ↓ / Début / Fin passent d'un message à l'autre, Entrée l'ouvre. Chaque case est nommée par l'objet du message, l'étoile est un bouton à bascule (`aria-pressed`), un message non lu l'annonce. Le message ouvert est un `article` nommé par son objet. `labels` traduit chaque texte.",
          "",
          "**Thème** — `--lq-color-panel`, `--lq-color-text`, `--lq-color-text-muted`, `--lq-color-border-subtle` (filets), `--lq-color-hover` (survol, message ouvert, coché), `--lq-color-accent` (dossier ouvert, pastille non-lu, filet du message ouvert), `--lq-tone-info` (« Nouveau message » est un `Button tone=\"info\"`), `--lq-color-warning` (étoile), `--lq-color-focus-ring`, `--lq-label-*` (intertitres), `--lq-text-*`, `--lq-space-*`, `--lq-radius-*`. Et les variables propres, optionnelles : `--lq-mail-folders-width` (220 px), `--lq-mail-list-width` (340 px), `--lq-mail-folders-bg`, `--lq-mail-list-bg`, `--lq-mail-reader-bg`, `--lq-mail-folder-size`, `--lq-mail-folder-radius`, `--lq-mail-folder-active-bg`, `--lq-mail-folder-active-color`, `--lq-mail-open-bg`, `--lq-mail-checked-bg`, `--lq-mail-star-color`. Ce thème met la lecture sur un panneau blanc (`#181b36` en sombre), le dossier ouvert en bleu `#3a41e2` sur `#eef0fb` (`#9ba0ff` sur `#1b1e3d` en sombre), à angle droit (`--lq-mail-folder-radius: 0`).",
        ].join("\n"),
      },
    },
  },
  args: {
    folders: MAIL_FOLDERS,
    defaultMessages: MAIL_MESSAGES,
    defaultSelectedId: "m1",
    now: MAIL_NOW,
    ariaLabel: "Messagerie",
    onFolderChange: fn(),
    onSelect: fn(),
    onCheckedChange: fn(),
    onQueryChange: fn(),
    onMarkRead: fn(),
    onToggleStar: fn(),
    onDelete: fn(),
    onCompose: fn(),
    onReply: fn(),
    onForward: fn(),
  },
  argTypes: {
    folders: { control: "object" },
    messages: { control: false },
    defaultMessages: { control: false },
    folderId: { control: "text" },
    defaultFolderId: { control: "inline-radio", options: MAIL_FOLDERS.map((f) => f.id) },
    selectedId: { control: "text" },
    defaultSelectedId: { control: "text" },
    checkedIds: { control: "object" },
    defaultCheckedIds: { control: "object" },
    query: { control: "text" },
    defaultQuery: { control: "text" },
    now: { control: "date" },
    formatDate: { control: false },
    labels: { control: "object" },
    ariaLabel: { control: "text", table: { defaultValue: { summary: '"Messagerie"' } } },
  },
  render: (args) => (
    <Frame>
      {/* La clé remonte le composant quand une valeur de départ change dans le panneau Controls. */}
      <MailPanel key={`${args.defaultFolderId}-${args.defaultSelectedId}-${args.defaultQuery}`} {...args} now={args.now ? new Date(args.now) : undefined} />
    </Frame>
  ),
} satisfies Meta<typeof MailPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Mode libre",
  parameters: {
    docs: {
      description: {
        story:
          "`defaultMessages` : le composant applique lui-même les actions. Ouvrez, cochez, suivez, supprimez (le message passe à la corbeille), cherchez « léa » — et chaque geste est aussi journalisé dans l'onglet Actions.",
      },
    },
  },
};

export const Controlled: Story = {
  name: "Contrôlé",
  render: function Render(args) {
    const [messages, setMessages] = useState<MailMessage[]>(MAIL_MESSAGES);
    const [folderId, setFolderId] = useState("inbox");
    const [selectedId, setSelectedId] = useState<string | null>("m4");
    const [checkedIds, setCheckedIds] = useState<string[]>(["m2", "m3"]);
    const [query, setQuery] = useState("");
    const [log, setLog] = useState("Les actions s'affichent ici.");
    const update = (ids: string[], change: (m: MailMessage) => MailMessage | null) =>
      setMessages((list) => list.flatMap((m) => (ids.includes(m.id) ? [change(m)].filter((x): x is MailMessage => x !== null) : [m])));
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Frame>
          <MailPanel
            folders={args.folders}
            messages={messages}
            folderId={folderId}
            onFolderChange={setFolderId}
            selectedId={selectedId}
            onSelect={setSelectedId}
            checkedIds={checkedIds}
            onCheckedChange={setCheckedIds}
            query={query}
            onQueryChange={setQuery}
            now={MAIL_NOW}
            onMarkRead={(ids, read) => {
              update(ids, (m) => ({ ...m, unread: !read }));
              setLog(`${ids.length} message(s) marqué(s) ${read ? "lu(s)" : "non lu(s)"}`);
            }}
            onToggleStar={(id, starred) => {
              update([id], (m) => ({ ...m, starred }));
              setLog(starred ? `Suivi : ${id}` : `Plus suivi : ${id}`);
            }}
            onDelete={(ids) => {
              update(ids, (m) => (m.folderId === "trash" ? null : { ...m, folderId: "trash" }));
              setLog(`${ids.length} message(s) supprimé(s)`);
            }}
            onCompose={() => setLog("Nouveau message")}
            onReply={(m) => setLog(`Répondre à « ${m.subject} »`)}
            onForward={(m) => setLog(`Transférer « ${m.subject} »`)}
          />
        </Frame>
        <Text size="sm" muted>
          {log}
        </Text>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tout est tenu par l'appelant : `messages`, `folderId`, `selectedId`, `checkedIds`, `query`. Le composant ne fait que signaler ; la story applique et écrit sous le cadre ce qu'elle a reçu. Deux messages sont cochés au départ : la barre d'actions groupées est visible.",
      },
    },
  },
};

export const Narrow: Story = {
  name: "Étroit",
  render: (args) => (
    <Frame width={400}>
      <MailPanel {...args} now={args.now ? new Date(args.now) : undefined} />
    </Frame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Dans un conteneur de 400 px : une colonne à la fois. Le message ouvert a un bouton « Retour » vers la liste ; la liste, un bouton ☰ vers les dossiers ; Répondre et Transférer ne gardent que leur icône (leur nom reste en infobulle et pour les lecteurs d'écran).",
      },
    },
  },
};

export const ReadOnly: Story = {
  name: "Lecture seule",
  args: {
    messages: MAIL_MESSAGES,
    defaultMessages: undefined,
    defaultSelectedId: "m4",
    onMarkRead: undefined,
    onToggleStar: undefined,
    onDelete: undefined,
    onCompose: undefined,
    onReply: undefined,
    onForward: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Messages contrôlés et aucun rappel d'action : ni « Nouveau message », ni étoile cliquable (les messages suivis gardent leur étoile pleine), ni lu / non lu, ni corbeille, ni Répondre / Transférer. On navigue, on coche, on cherche, on lit.",
      },
    },
  },
};

export const Empty: Story = {
  name: "Vide",
  args: { defaultMessages: [], defaultSelectedId: null },
  render: (args) => (
    <Frame height={420}>
      <MailPanel {...args} now={args.now ? new Date(args.now) : undefined} />
    </Frame>
  ),
  parameters: {
    docs: {
      description: {
        story: "Un dossier vide (« Aucun message dans ce dossier. »), aucun message ouvert. Une recherche sans résultat affiche « Aucun message ne correspond à la recherche. » — `labels` en change les textes.",
      },
    },
  },
};
