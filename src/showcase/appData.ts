import type {
  ActivityPost,
  CalendarEvent,
  ChatContact,
  ChatMessage,
  GalleryImage,
  InvoiceLine,
  MailFolder,
  MailMessage,
  Note,
  TimelineEntry,
} from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * Les données de démonstration des écrans d'application (messagerie, boîte mail, calendrier,
 * galerie, frise, profil, facture) et des planches qui montrent les mêmes composants.
 *
 * Toutes fixes, comme celles des autres planches : une heure de référence écrite en dur pour chaque
 * composant qui parle en « aujourd'hui » ou « il y a 5 min », et des images SVG générées ici à partir
 * d'une graine — aucune image téléchargée, et la même graine redonne toujours le même dessin. Les
 * personnes, sociétés et adresses sont fictives. Les icônes restent dans les écrans.
 */

/* ---------------------------------------------------------------- images */

const svg = (body: string, w: number, h: number) =>
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`);

/** Générateur pseudo-aléatoire de Park-Miller : une graine, toujours la même suite. */
function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

type ArtKind = "paysage" | "vagues" | "formes";

/** Une illustration : trois plans de collines sous un soleil, des vagues, ou des formes posées. */
function artwork(kind: ArtKind, seed: number, c: string[], w: number, h: number): string {
  const rand = rng(seed);
  if (kind === "paysage") {
    const [sky1, sky2, sun, ...hills] = c;
    const layers = hills
      .map((fill, li) => {
        const base = h * (0.45 + li * 0.14);
        const amp = h * (0.16 - li * 0.03);
        const steps = 6 + li * 2;
        let d = `M0 ${h} L0 ${r1(base)}`;
        for (let i = 1; i <= steps; i++) d += ` L${r1((w / steps) * i)} ${r1(base - rand() * amp + (i % 2 ? amp * 0.3 : 0))}`;
        return `<path d="${d} L${w} ${h} Z" fill="${fill}"/>`;
      })
      .join("");
    return svg(
      `<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky1}"/><stop offset="1" stop-color="${sky2}"/></linearGradient></defs>` +
        `<rect width="${w}" height="${h}" fill="url(#s)"/>` +
        `<circle cx="${r1(w * (0.2 + rand() * 0.6))}" cy="${r1(h * (0.18 + rand() * 0.12))}" r="${r1(Math.min(w, h) * 0.08)}" fill="${sun}"/>` +
        layers,
      w,
      h,
    );
  }
  if (kind === "vagues") {
    const [bg, ...fills] = c;
    let out = `<rect width="${w}" height="${h}" fill="${bg}"/>`;
    fills.forEach((fill, i) => {
      const base = h * (0.3 + (i * 0.6) / fills.length);
      const amp = h * (0.04 + rand() * 0.05);
      const period = w / (1.2 + rand() * 1.6);
      const phase = rand() * Math.PI * 2;
      let d = `M0 ${h} L0 ${r1(base)}`;
      for (let x = 0; x <= w; x += w / 40) d += ` L${r1(x)} ${r1(base + Math.sin((x / period) * Math.PI * 2 + phase) * amp)}`;
      out += `<path d="${d} L${w} ${h} Z" fill="${fill}"/>`;
    });
    return svg(out, w, h);
  }
  const [bg, ...fills] = c;
  let out = `<rect width="${w}" height="${h}" fill="${bg}"/>`;
  for (let i = 0; i < 9; i++) {
    const fill = fills[i % fills.length];
    const x = rand() * w;
    const y = rand() * h;
    const s = Math.min(w, h) * (0.1 + rand() * 0.2);
    out +=
      i % 2
        ? `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(s / 2)}" fill="${fill}" fill-opacity="0.85"/>`
        : `<rect x="${r1(x - s / 2)}" y="${r1(y - s / 2)}" width="${r1(s)}" height="${r1(s)}" fill="${fill}" fill-opacity="0.85" transform="rotate(${Math.round(rand() * 90)} ${r1(x)} ${r1(y)})"/>`;
  }
  return svg(out, w, h);
}

const FORMATS = { paysage: [1200, 800], portrait: [800, 1200], carre: [1000, 1000], panorama: [1600, 700] } as const;

const CATEGORY: Record<ArtKind, string> = { paysage: "Paysages", vagues: "Marées", formes: "Géométries" };

const GALLERY_SPECS: {
  id: string;
  kind: ArtKind;
  seed: number;
  colors: string[];
  format: keyof typeof FORMATS;
  title: string;
  author: string;
  price: string;
  span?: GalleryImage["span"];
}[] = [
  { id: "aube", kind: "paysage", seed: 11, colors: ["#f6c99b", "#fbe6cf", "#fff4e0", "#c98f7a", "#8c5d63", "#4b3a4f"], format: "paysage", title: "Aube sur les crêtes", author: "Lucie Ferrand", price: "48 €" },
  { id: "lagon", kind: "vagues", seed: 23, colors: ["#e8f6f7", "#9fd8dc", "#5cb8c2", "#2f8f9e", "#1d5e6d"], format: "portrait", title: "Lagon", author: "Théo Marchal", price: "32 €" },
  { id: "bauhaus", kind: "formes", seed: 37, colors: ["#f3ede2", "#d8432f", "#1f4fa3", "#f2b632", "#1d1d1d"], format: "carre", title: "Bauhaus", author: "Anaïs Perrin", price: "40 €", span: "large" },
  { id: "vallee", kind: "paysage", seed: 53, colors: ["#9fd0f0", "#e6f4fb", "#ffffff", "#8db7a3", "#4f8a6c", "#24503f"], format: "panorama", title: "La vallée verte", author: "Lucie Ferrand", price: "55 €", span: "wide" },
  { id: "houle", kind: "vagues", seed: 61, colors: ["#fdf3e1", "#f5c27a", "#ec8f4e", "#c95b3b", "#7d2f2a"], format: "paysage", title: "Houle orange", author: "Théo Marchal", price: "29 €" },
  { id: "constellation", kind: "formes", seed: 73, colors: ["#1b2340", "#f2d16b", "#e8eefc", "#8fa3e6"], format: "portrait", title: "Constellation", author: "Anaïs Perrin", price: "42 €", span: "tall" },
  { id: "crepuscule", kind: "paysage", seed: 97, colors: ["#3b2a5c", "#d9787a", "#ffd9a0", "#6b4a7a", "#45305a", "#21172f"], format: "portrait", title: "Crépuscule", author: "Lucie Ferrand", price: "48 €" },
  { id: "abysses", kind: "vagues", seed: 101, colors: ["#0e2a3f", "#1b4a6b", "#236a8f", "#2f8bb0", "#55b3d1"], format: "carre", title: "Abysses", author: "Théo Marchal", price: "34 €" },
  { id: "mosaique", kind: "formes", seed: 113, colors: ["#e9f3ec", "#2e8b57", "#f4a259", "#5b8e7d", "#bc4b51"], format: "paysage", title: "Mosaïque", author: "Anaïs Perrin", price: "38 €" },
  { id: "desert", kind: "paysage", seed: 131, colors: ["#f7d9a8", "#fff1d6", "#fff8ea", "#e3b278", "#c98b4f", "#8f5a2e"], format: "paysage", title: "Désert", author: "Lucie Ferrand", price: "44 €" },
  { id: "estran", kind: "vagues", seed: 139, colors: ["#f4efe6", "#d9cbb3", "#b5a58a", "#7f9c96", "#4b6f6b"], format: "panorama", title: "Estran", author: "Théo Marchal", price: "52 €" },
  { id: "prisme", kind: "formes", seed: 149, colors: ["#fafafa", "#3a41e2", "#1c1f5c", "#7c82ff", "#cfd2e3"], format: "portrait", title: "Prisme", author: "Anaïs Perrin", price: "36 €" },
];

/** Douze œuvres, trois catégories, tous les formats ; trois portent un `span` pour la grille. */
export const GALLERY_IMAGES: GalleryImage[] = GALLERY_SPECS.map((s) => {
  const [w, h] = FORMATS[s.format];
  return {
    id: s.id,
    src: artwork(s.kind, s.seed, s.colors, w, h),
    width: w,
    height: h,
    alt: `${s.title}, illustration (${CATEGORY[s.kind].toLowerCase()})`,
    title: s.title,
    subtitle: s.author,
    meta: s.price,
    caption: `${s.author} · ${CATEGORY[s.kind]} · ${w} × ${h}`,
    category: CATEGORY[s.kind],
    span: s.span,
  };
});

/** Les mêmes sans `span`, pour une grille régulière ou la maçonnerie. */
export const GALLERY_IMAGES_PLAIN: GalleryImage[] = GALLERY_IMAGES.map(({ span: _span, ...rest }) => rest);

/** Le portrait du profil : tête et épaules sur fond uni. Une image ne lit pas les variables CSS :
 *  ses teintes reprennent à la main le bleu du CV et le gris de ses filets. */
export const PROFILE_AVATAR = svg(
  `<rect width="120" height="120" fill="#e3e5f0"/><circle cx="60" cy="48" r="22" fill="#4b3a2e"/><circle cx="60" cy="52" r="19" fill="#ecc8aa"/>` +
    `<path d="M41 46 Q60 22 79 46 Q72 36 60 36 Q48 36 41 46Z" fill="#4b3a2e"/><path d="M18 120 Q22 82 60 80 Q98 82 102 120Z" fill="#3a41e2"/>`,
  120,
  120,
);

/** La bannière du profil : ciel du bleu nuit vers le bleu du CV, deux lignes de collines. */
export const PROFILE_BANNER = svg(
  `<defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c1f5c"/><stop offset="1" stop-color="#3a41e2"/></linearGradient></defs>` +
    `<rect width="1200" height="300" fill="url(#b)"/><circle cx="880" cy="170" r="46" fill="#ebebeb" opacity="0.85"/>` +
    `<path d="M0 220 L180 150 L320 200 L520 120 L700 210 L900 140 L1200 210 V300 H0Z" fill="#2c32c0"/>` +
    `<path d="M0 260 L220 210 L430 250 L640 200 L860 255 L1040 220 L1200 250 V300 H0Z" fill="#1b1d3a"/>`,
  1200,
  300,
);

/* ---------------------------------------------------------------- messagerie */

/** L'heure de référence de la messagerie : « Aujourd'hui » et « Hier » tombent toujours au même endroit. */
export const CHAT_NOW = "2026-10-31T14:30:00";

export const CHAT_CONTACTS: ChatContact[] = [
  { id: "ava", name: "Ava Lefèvre", status: "online" },
  { id: "bastien", name: "Bastien Morel", status: "online", unread: 2, typing: true },
  { id: "camille", name: "Camille Roux", status: "away" },
  { id: "support", name: "Équipe support", status: "offline", unread: 5 },
  { id: "david", name: "David Simon", status: "offline" },
  { id: "elise", name: "Élise Garnier", status: "online" },
  { id: "farid", name: "Farid Benali", status: "away" },
  { id: "gaelle", name: "Gaëlle Perrin", status: "offline" },
];

export const CHAT_MESSAGES: ChatMessage[] = [
  { id: "a1", contactId: "ava", from: "them", text: "Bonjour ! La mise en production est toujours prévue lundi ?", sentAt: "2026-10-30T16:02:00" },
  { id: "a2", contactId: "ava", from: "me", text: "Oui, lundi 9 h.", sentAt: "2026-10-30T16:05:00", status: "read" },
  { id: "a3", contactId: "ava", from: "me", text: "Je t'envoie la note de version ce soir.", sentAt: "2026-10-30T16:05:40", status: "read" },
  { id: "a4", contactId: "ava", from: "them", text: "Parfait, merci.", sentAt: "2026-10-30T16:06:00" },
  { id: "a5", contactId: "ava", from: "them", text: "J'ai relu la note. Il manque la migration des factures.", sentAt: "2026-10-31T09:12:00" },
  { id: "a6", contactId: "ava", from: "me", text: "Bien vu, je l'ajoute.\nElle passera en premier, avant le déploiement.", sentAt: "2026-10-31T09:14:00", status: "read" },
  { id: "a7", contactId: "ava", from: "them", text: "Pense à prévenir le support : l'export CSV change de format.", sentAt: "2026-10-31T09:15:00" },
  { id: "a8", contactId: "ava", from: "them", text: "Ils auront des questions des clients mardi.", sentAt: "2026-10-31T09:15:30" },
  { id: "a9", contactId: "ava", from: "me", text: "C'est noté, je leur écris tout de suite.", sentAt: "2026-10-31T14:21:00", status: "delivered" },
  { id: "b1", contactId: "bastien", from: "me", text: "Tu as la facture de l'Atelier Nord ?", sentAt: "2026-10-31T11:40:00", status: "read" },
  { id: "b2", contactId: "bastien", from: "them", text: "Je la cherche.", sentAt: "2026-10-31T13:58:00" },
  { id: "b3", contactId: "bastien", from: "them", text: "Trouvée, je te l'envoie dans la foulée.", sentAt: "2026-10-31T14:02:00" },
  { id: "c1", contactId: "camille", from: "them", text: "Je suis en réunion jusqu'à 16 h.", sentAt: "2026-10-28T10:00:00" },
  { id: "s1", contactId: "support", from: "them", text: "Trois tickets urgents ouverts sur l'export.", sentAt: "2026-10-31T08:01:00" },
  { id: "e1", contactId: "elise", from: "me", text: "Le tableau de bord se charge en 2 s maintenant.", sentAt: "2026-10-29T18:20:00", status: "read" },
  { id: "e2", contactId: "elise", from: "them", text: "Enfin ! Merci pour le cache.", sentAt: "2026-10-29T18:24:00" },
  { id: "f1", contactId: "farid", from: "them", text: "On décale le point budget à jeudi ?", sentAt: "2026-10-27T15:10:00" },
];

/* ---------------------------------------------------------------- boîte mail */

export const MAIL_NOW = new Date("2026-10-29T16:00:00");

export const MAIL_FOLDERS: MailFolder[] = [
  { id: "inbox", label: "Réception", role: "inbox" },
  { id: "sent", label: "Envoyés", role: "sent" },
  { id: "drafts", label: "Brouillons", role: "drafts" },
  { id: "archive", label: "Archives", role: "archive" },
  { id: "spam", label: "Indésirables", role: "spam" },
  { id: "trash", label: "Corbeille", role: "trash" },
  { id: "clients", label: "Clients", group: "Libellés" },
  { id: "factures", label: "Factures", group: "Libellés" },
];

const ME = { name: "Claire Lemoine", email: "claire@exemple.fr" };

export const MAIL_MESSAGES: MailMessage[] = [
  {
    id: "m1",
    folderId: "inbox",
    from: { name: "Camille Roux", email: "camille.roux@atelier-roux.fr" },
    to: [ME],
    cc: [{ name: "Hugo Lambert", email: "hugo@atelier-roux.fr" }],
    subject: "Devis pour la refonte du tableau de bord",
    body:
      "Bonjour Claire,\n\nVous trouverez ci-joint le devis pour la refonte du tableau de bord, avec le détail des trois lots : maquettes, intégration et recette.\n\nLe premier lot peut démarrer dès la semaine prochaine si le devis vous convient. Je reste disponible jeudi après-midi pour en parler.\n\nBien à vous,\nCamille",
    date: "2026-10-29T10:42:00",
    unread: true,
    starred: true,
    attachments: [
      { name: "devis-refonte-2026-114.pdf", size: "184 Ko" },
      { name: "planning-lots.xlsx", size: "32 Ko" },
    ],
  },
  {
    id: "m2",
    folderId: "inbox",
    from: { name: "Banque du Centre", email: "ne-pas-repondre@banque.exemple" },
    to: [ME],
    subject: "Votre relevé de compte d'octobre est disponible",
    body: "Votre relevé de compte du mois d'octobre est disponible dans votre espace client, rubrique « Documents ».",
    date: "2026-10-29T08:15:00",
    unread: true,
  },
  {
    id: "m3",
    folderId: "inbox",
    from: { name: "Inès Morel", email: "ines.morel@exemple.fr" },
    to: [ME],
    subject: "Re: Point d'étape mardi",
    body: "Mardi 14 h me va très bien. Je réserve la salle du deuxième et j'apporte les chiffres du trimestre.\n\nÀ mardi,\nInès",
    date: "2026-10-28T17:03:00",
  },
  {
    id: "m4",
    folderId: "inbox",
    from: { name: "Hugo Lambert", email: "hugo@atelier-roux.fr" },
    to: [ME],
    subject: "Maquettes v2 : écran des commandes",
    body: "Bonjour,\n\nVoici la deuxième version des maquettes de l'écran des commandes. J'ai repris vos remarques sur la densité du tableau et ajouté la pagination en bas.\n\nDites-moi si la barre d'outils vous convient.\n\nHugo",
    date: "2026-10-27T11:20:00",
    starred: true,
    attachments: [{ name: "commandes-v2.png", size: "1,2 Mo" }],
  },
  {
    id: "m5",
    folderId: "inbox",
    from: { name: "Léa Fontaine", email: "lea.fontaine@exemple.fr" },
    to: [ME, { name: "Équipe produit", email: "produit@exemple.fr" }],
    subject: "Compte rendu de l'atelier utilisateurs",
    body: "Bonjour à tous,\n\nVoici le compte rendu de l'atelier de lundi. Trois points reviennent chez presque tous les participants : la recherche, l'export et la lisibilité sur tablette.\n\nJe propose qu'on en fasse le sujet du prochain point produit.\n\nLéa",
    date: "2026-10-26T09:05:00",
    unread: true,
  },
  {
    id: "m6",
    folderId: "inbox",
    from: { name: "Nathan Girard", email: "nathan.girard@exemple.fr" },
    to: [ME],
    subject: "Accès à l'environnement de recette",
    body: "Bonjour,\n\nJe n'arrive plus à me connecter à l'environnement de recette depuis ce matin. Les identifiants ont-ils changé ?\n\nMerci,\nNathan",
    date: "2026-10-22T15:48:00",
  },
  {
    id: "m7",
    folderId: "inbox",
    from: { name: "Chloé Bernard", email: "chloe@studio-bernard.fr" },
    to: [ME],
    subject: "Photos du salon",
    body: "Comme promis, les photos du stand. Il y en a une vingtaine, j'ai gardé les meilleures.",
    date: "2026-10-15T18:30:00",
    attachments: [
      { name: "salon-01.jpg", size: "2,4 Mo" },
      { name: "salon-02.jpg", size: "2,1 Mo" },
    ],
  },
  {
    id: "m8",
    folderId: "inbox",
    from: { name: "Service client", email: "support@hebergeur.exemple" },
    to: [ME],
    subject: "Renouvellement de votre nom de domaine",
    body: "Votre nom de domaine arrive à échéance le 30 novembre 2026. Le renouvellement automatique est activé : aucune action n'est nécessaire.",
    date: "2025-11-30T07:00:00",
  },
  {
    id: "s1",
    folderId: "sent",
    from: ME,
    to: [{ name: "Inès Morel", email: "ines.morel@exemple.fr" }],
    subject: "Point d'étape mardi",
    body: "Bonjour Inès,\n\nEst-ce que mardi 14 h te convient pour faire le point sur le trimestre ?\n\nClaire",
    date: "2026-10-28T09:12:00",
  },
  {
    id: "d1",
    folderId: "drafts",
    from: ME,
    to: [{ name: "Nathan Girard", email: "nathan.girard@exemple.fr" }],
    subject: "Re: Accès à l'environnement de recette",
    body: "Bonjour Nathan,\n\nLes identifiants ont été renouvelés vendredi. Je t'envoie les nouveaux",
    date: "2026-10-29T12:05:00",
  },
  {
    id: "c1",
    folderId: "clients",
    from: { name: "Camille Roux", email: "camille.roux@atelier-roux.fr" },
    to: [ME],
    subject: "Bon de commande signé",
    body: "Bonjour,\n\nVoici le bon de commande signé pour le lot 1.\n\nCamille",
    date: "2026-10-29T13:40:00",
    unread: true,
    attachments: [{ name: "bon-de-commande-lot-1.pdf", size: "96 Ko" }],
  },
];

/* ---------------------------------------------------------------- notes */

export const NOTES_NOW = "2026-10-31T14:30:00";

export const NOTES: Note[] = [
  {
    id: "release",
    title: "Mise en production de lundi",
    body: "Ordre de passage : migration des factures, puis déploiement, puis purge des caches.\n\nPrévenir le support : l'export CSV change de format (séparateur point-virgule).",
    updatedAt: "2026-10-31T11:20:00",
  },
  {
    id: "retours",
    title: "Retours clients d'octobre",
    body: "Trois demandes de filtre par date sur les tableaux. Deux plaintes sur la lenteur de l'export. Une demande de mode sombre.",
    updatedAt: "2026-10-30T17:45:00",
  },
  {
    id: "recrutement",
    title: "Recrutement front-end",
    body: "Entretiens mardi et jeudi. Exercice : une table paginée accessible au clavier, en deux heures.",
    updatedAt: "2026-10-12T09:00:00",
  },
];

/* ---------------------------------------------------------------- calendrier */

/** Le « aujourd'hui » du calendrier : fixé, pour que les captures ne bougent pas d'un jour à l'autre. */
export const CALENDAR_TODAY = "2026-11-12";

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: "e1", title: "Revue mensuelle", start: "2026-11-02T09:30", end: "2026-11-02T11:00", tone: "accent", description: "Salle Garonne : budget et indicateurs" },
  { id: "e2", title: "Salon des artisans", start: "2026-11-03", end: "2026-11-05", tone: "info", description: "Stand B12, parc des expositions" },
  { id: "e3", title: "Point produit", start: "2026-11-04T14:00", end: "2026-11-04T15:00", tone: "neutral" },
  { id: "e4", title: "Livraison v2.4", start: "2026-11-06", tone: "success", description: "Mise en production à 18 h" },
  { id: "e5", title: "Congés de Claire", start: "2026-11-09", end: "2026-11-13", tone: "warning" },
  { id: "e6", title: "Comité de direction", start: "2026-11-10T08:30", end: "2026-11-10T10:00", tone: "accent" },
  { id: "e9", title: "Entretiens annuels", start: "2026-11-12T10:00", end: "2026-11-12T12:00", tone: "neutral" },
  { id: "e7", title: "Déjeuner client Arvel", start: "2026-11-12T12:30", end: "2026-11-12T14:00", tone: "success" },
  { id: "e8", title: "Incident facturation", start: "2026-11-12T16:00", end: "2026-11-12T17:00", tone: "danger", description: "Post-mortem avec l'équipe paiement" },
  { id: "e10", title: "Formation sécurité", start: "2026-11-16", end: "2026-11-17", tone: "info" },
  { id: "b4", title: "Atelier UX", start: "2026-11-18T10:00", end: "2026-11-18T12:00", tone: "accent" },
  { id: "b5", title: "Démo client", start: "2026-11-18T14:00", end: "2026-11-18T15:00", tone: "success" },
  { id: "b6", title: "Recrutement", start: "2026-11-18T16:00", end: "2026-11-18T17:00", tone: "neutral" },
  { id: "b7", title: "Afterwork", start: "2026-11-18T18:30", end: "2026-11-18T21:00", tone: "danger" },
  { id: "e12", title: "Séminaire équipe", start: "2026-11-19", end: "2026-11-20", tone: "accent" },
  { id: "e13", title: "Webinaire partenaires", start: "2026-11-24T17:00", end: "2026-11-24T18:00", tone: "success" },
  { id: "e14", title: "Bilan trimestriel", start: "2026-11-25T09:00", end: "2026-11-25T10:30", tone: "warning" },
  { id: "e11", title: "Clôture comptable", start: "2026-11-27", end: "2026-12-02", tone: "danger", description: "Arrêté des comptes de novembre" },
];

/* ---------------------------------------------------------------- frise et fil */

/** La frise d'une équipe produit. Les icônes sont posées par l'écran, d'après l'identifiant. */
export const TIMELINE_ENTRIES: TimelineEntry[] = [
  { id: "deploy", day: "Aujourd'hui", date: "14:32", dateTime: "2026-11-01T14:32", title: "Mise en production de la v2.4", content: "Le déploiement progressif est à 40 % des serveurs. Aucune alerte pour l'instant.", tone: "info", author: { name: "Claire Moreau" }, current: true },
  { id: "review", day: "Aujourd'hui", date: "11:05", dateTime: "2026-11-01T11:05", title: "Revue de code approuvée", content: "« Pagination côté serveur » : 3 approbations, 12 commentaires résolus.", tone: "success", author: { name: "Julien Petit" } },
  { id: "comment", day: "Aujourd'hui", date: "09:48", dateTime: "2026-11-01T09:48", title: "Nouveau commentaire sur le ticket #482", author: { name: "Inès Garnier" } },
  { id: "incident", day: "Hier", date: "22:17", dateTime: "2026-10-31T22:17", title: "Incident : latence de l'API de paiement", content: "Temps de réponse médian à 1,8 s pendant 14 minutes. Résolu par un redémarrage du pool de connexions.", tone: "danger" },
  { id: "rotate", day: "Hier", date: "16:40", dateTime: "2026-10-31T16:40", title: "Rotation des clés d'accès", author: { name: "Paul Lefèvre" } },
  { id: "member", day: "29 octobre", date: "10:12", dateTime: "2026-10-29T10:12", title: "Sophie Laurent a rejoint l'équipe Produit", tone: "accent" },
  { id: "sync", day: "29 octobre", date: "08:00", dateTime: "2026-10-29T08:00", title: "Synchronisation nocturne terminée", content: "18 432 enregistrements, 0 rejet.", tone: "success" },
];

export const ACTIVITY_POSTS: ActivityPost[] = [
  {
    id: "p1",
    author: { name: "Claire Moreau" },
    action: "a publié",
    target: "dans Équipe produit",
    time: "il y a 5 min",
    dateTime: "2026-11-01T14:27",
    text: "La v2.4 part en production cet après-midi. Merci à tous pour la semaine de recette : 37 tickets fermés, zéro régression ouverte.",
    likes: 24,
    liked: true,
    shares: 3,
    commentCount: 2,
    comments: [
      { id: "c1", author: { name: "Julien Petit" }, text: "Bravo à l'équipe ! On surveille les métriques de paiement ce soir.", time: "il y a 3 min" },
      { id: "c2", author: { name: "Inès Garnier" }, text: "Les notes de version sont en ligne.", time: "il y a 1 min" },
    ],
  },
  {
    id: "p2",
    author: { name: "Paul Lefèvre" },
    action: "a partagé une photo",
    time: "il y a 2 h",
    dateTime: "2026-11-01T12:30",
    text: "Le séminaire d'automne, vu du belvédère.",
    image: { src: GALLERY_IMAGES[0].src, alt: "Collines en trois plans sous un soleil pâle" },
    likes: 87,
    shares: 4,
    commentCount: 1,
    comments: [{ id: "c3", author: { name: "Sophie Laurent" }, text: "Superbe lumière.", time: "il y a 1 h" }],
  },
  {
    id: "p3",
    author: { name: "Inès Garnier" },
    action: "a commenté",
    target: "le ticket #482",
    time: "hier à 18:04",
    dateTime: "2026-10-31T18:04",
    text: "Le correctif de l'export CSV est prêt pour relecture : séparateur « ; » et BOM pour Excel.",
    likes: 4,
  },
];

/* ---------------------------------------------------------------- profil et facture */

export const INVOICE_ISSUER = {
  name: "Atelier Nord SAS",
  details: ["12 rue des Tanneurs, 69002 Lyon", "contact@ateliernord.exemple · 04 00 00 00 00", "SIRET 000 000 000 00000 · TVA FR00 000000000"],
};

export const INVOICE_CLIENT = {
  name: "Lemoine & Associés",
  details: ["À l'attention de Claire Lemoine", "48 quai Saint-Vincent", "69001 Lyon"],
};

export const INVOICE_LINES: InvoiceLine[] = [
  { id: "l1", description: "Atelier de cadrage", detail: "Deux demi-journées avec l'équipe produit, restitution écrite.", quantity: 1, unit: "j", unitPrice: 1200 },
  { id: "l2", description: "Maquettes de l'espace client", detail: "Douze écrans, version claire et sombre.", quantity: 6, unit: "j", unitPrice: 650 },
  { id: "l3", description: "Intégration du tableau de bord", detail: "Composants, routes et données de démonstration.", quantity: 38.5, unit: "h", unitPrice: 85 },
  { id: "l4", description: "Hébergement, 12 mois", quantity: 12, unit: "mois", unitPrice: 29.9 },
];

export const INVOICE_TERMS =
  "Paiement à 30 jours par virement. Pénalités de retard : trois fois le taux d'intérêt légal. Indemnité forfaitaire pour frais de recouvrement : 40 €. Pas d'escompte pour paiement anticipé.";

export const PROFILE_STATS = [
  { label: "Abonnés", value: "1 284" },
  { label: "Projets", value: 37 },
  { label: "Ancienneté", value: "6 ans" },
];

export const PROFILE_INFO = [
  { label: "E-mail", value: "claire.lemoine@exemple.fr" },
  { label: "Téléphone", value: "06 00 00 00 00" },
  { label: "Équipe", value: "Produit" },
  { label: "Arrivée", value: "mars 2019" },
];

export const PROFILE_ACTIVITY = [
  { when: "Aujourd'hui, 9 h 12", what: "a publié la feuille de route du quatrième trimestre" },
  { when: "Hier, 17 h 40", what: "a commenté « Refonte de l'écran des virements »" },
  { when: "28 octobre", what: "a fermé 14 tickets du lot « Exports »" },
];

export const PROFILE_TEAM = ["Hugo Martin", "Inès Benali", "Paul Roux"];
