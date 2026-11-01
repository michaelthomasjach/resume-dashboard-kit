import type { ChatContact, ChatMessage } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * Les données de démonstration de `ChatPanel` : l'équipe d'un éditeur de logiciel, un samedi.
 * L'heure de référence est fixe, pour que « Aujourd'hui » et « Hier » tombent toujours au même endroit.
 */
export const CHAT_NOW = "2026-10-31T14:30:00";

export const CHAT_CONTACTS: ChatContact[] = [
  { id: "ava", name: "Ava Lefèvre", status: "online" },
  { id: "bella", name: "Bella Martin", status: "online", unread: 2 },
  { id: "camille", name: "Camille Roux", status: "away" },
  { id: "support", name: "Équipe support", status: "offline", unread: 5 },
  { id: "david", name: "David Simon", status: "offline" },
  { id: "elaine", name: "Elaine Garnier", status: "online" },
];

export const CHAT_MESSAGES: ChatMessage[] = [
  { id: "a1", contactId: "ava", from: "them", text: "Salut ! La mise en production est toujours prévue lundi ?", sentAt: "2026-10-30T16:02:00" },
  { id: "a2", contactId: "ava", from: "me", text: "Oui, lundi 9 h.", sentAt: "2026-10-30T16:05:00", status: "read" },
  { id: "a3", contactId: "ava", from: "me", text: "Je t'envoie la note de version ce soir.", sentAt: "2026-10-30T16:05:40", status: "read" },
  { id: "a4", contactId: "ava", from: "them", text: "Parfait, merci.", sentAt: "2026-10-30T16:06:00" },
  { id: "a5", contactId: "ava", from: "them", text: "J'ai relu la note. Il manque la migration des factures.", sentAt: "2026-10-31T09:12:00" },
  { id: "a6", contactId: "ava", from: "me", text: "Bien vu, je l'ajoute.\nElle passera en premier, avant le déploiement.", sentAt: "2026-10-31T09:14:00", status: "read" },
  { id: "a7", contactId: "ava", from: "them", text: "Super. Pense à prévenir le support : l'export CSV change de format.", sentAt: "2026-10-31T09:15:00" },
  { id: "a8", contactId: "ava", from: "them", text: "Ils auront des questions des clients mardi.", sentAt: "2026-10-31T09:15:30" },
  { id: "a9", contactId: "ava", from: "me", text: "C'est noté.", sentAt: "2026-10-31T14:21:00", status: "delivered" },
  { id: "b1", contactId: "bella", from: "me", text: "Tu as la facture du client Atelier Nord ?", sentAt: "2026-10-31T11:40:00", status: "read" },
  { id: "b2", contactId: "bella", from: "them", text: "Je la cherche.", sentAt: "2026-10-31T13:58:00" },
  { id: "b3", contactId: "bella", from: "them", text: "Trouvée, je te l'envoie.", sentAt: "2026-10-31T14:02:00" },
  { id: "c1", contactId: "camille", from: "them", text: "Je suis en réunion jusqu'à 16 h.", sentAt: "2026-10-28T10:00:00" },
  { id: "s1", contactId: "support", from: "them", text: "Trois tickets urgents ouverts sur l'export.", sentAt: "2026-10-31T08:01:00" },
  { id: "e1", contactId: "elaine", from: "me", text: "Le tableau de bord se charge en 2 s maintenant.", sentAt: "2026-10-29T18:20:00", status: "read" },
];
