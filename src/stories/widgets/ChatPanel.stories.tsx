import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ChatPanel, type ChatContact, type ChatMessage } from "@michaelthomasjach/liseuse-dashboard-kit";
import { CHAT_CONTACTS, CHAT_MESSAGES, CHAT_NOW } from "../_data/chatPanel";

/**
 * Une messagerie : la liste des conversations, le fil de la conversation ouverte, la saisie.
 */
const meta = {
  title: "Widgets/ChatPanel",
  component: ChatPanel,
  parameters: {
    docs: {
      description: {
        component: [
          "Une **messagerie** en deux colonnes : la liste des conversations à gauche, le fil de la conversation ouverte à droite, la zone de saisie dessous.",
          "",
          "**Quand l'utiliser** — pour une discussion en direct entre personnes : support, équipe, client. Pour un historique d'événements que personne n'écrit, `ActivityFeed` ou `Timeline` ; pour du courrier avec objet et pièces jointes, `MailPanel`.",
          "",
          "**La liste** — chaque contact (`contacts`) : avatar (`avatarSrc`, sinon les initiales), pastille de présence (`status` : `online` pleine, `away` en anneau, `offline` sans pastille), nom, aperçu du dernier message et son heure (`lastMessage` / `lastMessageAt`, sinon tirés de `messages`), nombre de non-lus (`unread`). Le champ du haut filtre par nom, sans tenir compte des accents.",
          "",
          "**Le fil** — bulles envoyées (`from: \"me\"`) à droite, reçues à gauche. Les messages qui se suivent du même expéditeur à moins de cinq minutes forment un **groupe** : une seule heure et un seul avatar, à la fin. Un séparateur marque chaque jour (« Aujourd'hui », « Hier », puis la date, dans la langue de `locale`). Sous le dernier envoi d'un groupe, son état (`status`) : `sending` (horloge), `sent` (une coche), `delivered` (deux coches), `read` (deux coches à l'accent). Un contact `typing` fait apparaître trois points au bas du fil et « écrit… » dans la liste.",
          "",
          "**Défilement** — le fil descend tout seul au dernier message à l'ouverture d'une conversation et à chaque envoi ; pour un message reçu, seulement si l'on était déjà en bas, pour ne pas perdre la lecture de l'historique.",
          "",
          "**Contrôlé ou libre** — donnez `onSend(text, contactId)` et l'application tient `messages` : à elle d'y ajouter le message. Sans `onSend`, le composant garde sa copie et y ajoute ce qu'on envoie. `activeContactId` + `onSelectContact` tiennent la conversation ouverte (sinon `defaultActiveContactId`, puis le premier contact) ; en mode libre, ouvrir une conversation efface ses non-lus. `now` fixe l'heure de référence (« Aujourd'hui », heure des envois en mode libre) — utile en démo et en test.",
          "",
          "**Taille** — le composant **remplit son conteneur** : donnez une hauteur au parent, ou `height`. Sous 640 px de large (la sienne, mesurée par un `ResizeObserver`), une colonne à la fois : la liste, puis la conversation, avec « Retour » (`backLabel`).",
          "",
          "**Clavier et accessibilité** — la liste est un `listbox` : flèches haut/bas, Début, Fin. Le fil est un `log` à annonce polie, focalisable pour défiler au clavier. Dans la saisie, **Entrée** envoie, **Maj+Entrée** va à la ligne, une composition d'éditeur de méthode d'entrée n'envoie rien ; le champ grandit jusqu'à six lignes. L'état, la présence et l'heure de chaque bulle sont lus aux lecteurs d'écran.",
          "",
          "**Thème** — bulles : `--lq-chat-bubble-mine-bg` / `-color` / `-border` (repli : `--lq-color-accent` et `--lq-color-accent-contrast`), `--lq-chat-bubble-theirs-bg` / `-color` / `-border` (repli : le texte à 5 % sur `--lq-color-panel`, `--lq-color-border-subtle`), `--lq-chat-bubble-radius` (repli `--lq-radius-lg`), `--lq-chat-bubble-padding`, `--lq-chat-bubble-font-size`. Ailleurs : `--lq-label-*` (titre, séparateurs de jour), `--lq-color-green` / `--lq-color-amber` (présence), `--lq-color-accent` (conversation ouverte, non-lus, « lu »), `--lq-control-*` (saisie), `--lq-color-panel-border`, `--lq-shadow-panel`, et celles d'`Input`, `Avatar` et `IconButton`.",
        ].join("\n"),
      },
    },
  },
  args: {
    contacts: CHAT_CONTACTS,
    messages: CHAT_MESSAGES,
    now: CHAT_NOW,
    title: "Messages",
    searchPlaceholder: "Rechercher un contact…",
    placeholder: "Écrire un message…",
    sendLabel: "Envoyer",
    backLabel: "Retour",
    emptyThreadText: "Aucun message pour l'instant. Écrivez le premier.",
    emptyListText: "Personne ne correspond.",
    locale: "fr-FR",
  },
  argTypes: {
    contacts: { control: false },
    messages: { control: false },
    activeContactId: { control: false },
    defaultActiveContactId: { control: "select", options: CHAT_CONTACTS.map((c) => c.id) },
    onSelectContact: { control: false },
    onSend: { control: false },
    title: { control: "text" },
    emptyThreadText: { control: "text" },
    emptyListText: { control: "text" },
    locale: { control: "select", options: ["fr-FR", "en-GB", "de-DE"] },
    now: { control: "text" },
    height: { control: "text" },
  },
  render: (args) => (
    <div style={{ height: 560 }}>
      <ChatPanel {...args} />
    </div>
  ),
} satisfies Meta<typeof ChatPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Messagerie",
  parameters: {
    docs: { description: { story: "En mode libre : écrivez et envoyez avec Entrée, changez de conversation, cherchez « eq » dans les contacts." } },
  },
};

export const Controlled: Story = {
  name: "Pilotée par l'application",
  args: { onSelectContact: fn(), onSend: fn() },
  render: function Render(args) {
    const [messages, setMessages] = useState<ChatMessage[]>(CHAT_MESSAGES);
    const [contacts, setContacts] = useState<ChatContact[]>(CHAT_CONTACTS);
    const [active, setActive] = useState<string | null>("bella");
    const [count, setCount] = useState(0);
    return (
      <div style={{ height: 560 }}>
        <ChatPanel
          {...args}
          contacts={contacts}
          messages={messages}
          activeContactId={active}
          onSelectContact={(id) => {
            setActive(id);
            setContacts((cs) => cs.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
            args.onSelectContact?.(id);
          }}
          onSend={(text, contactId) => {
            const n = count + 1;
            const minute = String(30 + n).padStart(2, "0");
            setCount(n);
            setMessages((ms) => [...ms, { id: `m${n}`, contactId, from: "me", text, sentAt: `2026-10-31T14:${minute}:00`, status: "sent" }]);
            setContacts((cs) => cs.map((c) => (c.id === contactId ? { ...c, typing: true } : c)));
            window.setTimeout(() => {
              setContacts((cs) => cs.map((c) => (c.id === contactId ? { ...c, typing: false } : c)));
              setMessages((ms) => [
                ...ms.map((m) => (m.id === `m${n}` ? { ...m, status: "read" as const } : m)),
                { id: `r${n}`, contactId, from: "them", text: "Bien reçu, merci !", sentAt: `2026-10-31T14:${minute}:30` },
              ]);
            }, 1200);
            args.onSend?.(text, contactId);
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "L'application tient les messages, la conversation ouverte et les non-lus. Chaque envoi passe par `onSend` ; une réponse arrive un peu plus tard, annoncée par « écrit… », et l'envoi passe à « lu ».",
      },
    },
  },
};

export const Typing: Story = {
  name: "En train d'écrire",
  args: { contacts: CHAT_CONTACTS.map((c) => (c.id === "bella" ? { ...c, typing: true } : c)), defaultActiveContactId: "bella" },
  parameters: { docs: { description: { story: "Un contact `typing` : trois points au bas du fil, « écrit… » dans la liste et dans l'en-tête." } } },
};

export const Empty: Story = {
  name: "Conversation vide",
  args: { contacts: [...CHAT_CONTACTS, { id: "nadia", name: "Nadia Petit", status: "online" }], defaultActiveContactId: "nadia" },
  parameters: { docs: { description: { story: "Une conversation sans message affiche `emptyThreadText` ; une recherche sans résultat, `emptyListText`." } } },
};

export const Narrow: Story = {
  name: "Cadre étroit",
  render: (args) => (
    <div style={{ width: 380, height: 560 }}>
      <ChatPanel {...args} />
    </div>
  ),
  parameters: { docs: { description: { story: "Dans 380 px, une colonne à la fois : touchez une conversation, puis « Retour »." } } },
};
