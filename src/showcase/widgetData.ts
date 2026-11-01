import {
  HOUR,
  MINUTE,
  type EqualizerBand,
  type GlobeFlow,
  type GlobeNode,
  type KanbanCard,
  type KanbanColumn,
  type KnowledgeEntry,
  type LightEntry,
  type SchedulerResource,
  type SchedulerTask,
  type ShutterEntry,
  type TileMapMarker,
  type TileMapRoute,
} from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * Les données de démonstration des planches de widgets (maison, outils, cartes et planning).
 *
 * Toutes fixes : pas de date du jour, pas de tirage au hasard. Une planche de vitrine sert à
 * comparer le thème d'une version à l'autre, et une capture qui change à chaque chargement ne se
 * compare à rien. Les icônes restent dans les écrans — ce fichier ne porte que des données.
 */

/* ---------------------------------------------------------------- maison */

export const SHUTTERS: ShutterEntry[] = [
  { id: "salle-a-manger", label: "Salle à manger", on: true, level: 100, statusText: "ouvert" },
  { id: "salon", label: "Salon", on: true, level: 55, statusText: "55 %" },
  { id: "bureau", label: "Bureau", on: true, level: 30, statusText: "30 %" },
  { id: "chambre-amis", label: "Chambre d'amis", on: false, level: 0, statusText: "fermé" },
  { id: "garage", label: "Porte du garage", on: false, level: 0, statusText: "fermé" },
];

export const LIGHTS: LightEntry[] = [
  { id: "cuisine", label: "Cuisine", on: true, level: 75, statusText: "75 %" },
  { id: "sejour", label: "Séjour", on: true, level: 40, statusText: "40 %" },
  { id: "bureau", label: "Bureau", on: false, level: 0, statusText: "éteint" },
  { id: "entree", label: "Entrée", on: true, level: 100, statusText: "100 %" },
];

export const WHITE_BALANCES = [
  { id: "chaud", label: "Blanc chaud" },
  { id: "doux", label: "Blanc doux" },
  { id: "neutre", label: "Blanc neutre" },
  { id: "froid", label: "Blanc froid" },
  { id: "jour", label: "Lumière du jour" },
];

/** La teinte réelle d'une ampoule : une donnée, pas un choix de thème — d'où les valeurs en dur. */
export const LIGHT_COLORS = [
  { id: "rouge", label: "Rouge", color: "#e5484d" },
  { id: "ambre", label: "Ambre", color: "#f5a524" },
  { id: "vert", label: "Vert", color: "#30a46c" },
  { id: "bleu", label: "Bleu", color: "#3e63dd" },
  { id: "violet", label: "Violet", color: "#8e4ec6" },
];

export const INDOOR_TEMPERATURES = [
  { id: "salon", label: "Salon", value: "20,5 °C" },
  { id: "cuisine", label: "Cuisine", value: "21,2 °C" },
  { id: "bureau", label: "Bureau", value: "19,8 °C" },
  { id: "chambre", label: "Chambre parentale", value: "18,6 °C" },
  { id: "sdb", label: "Salle de bain", value: "22,4 °C" },
];

/** Prévision sur cinq jours ; `sky` choisit l'icône dans l'écran. */
export const FORECAST: { id: string; label: string; sky: "sun" | "partly" | "cloud" | "rain"; max: string; min: string }[] = [
  { id: "ven", label: "Ven.", sky: "partly", max: "14", min: "7" },
  { id: "sam", label: "Sam.", sky: "rain", max: "12", min: "8" },
  { id: "dim", label: "Dim.", sky: "cloud", max: "11", min: "6" },
  { id: "lun", label: "Lun.", sky: "sun", max: "13", min: "4" },
  { id: "mar", label: "Mar.", sky: "sun", max: "15", min: "5" },
];

/** La charge d'une petite infrastructure : la fraction de la capacité demandée, au-delà de 1 = débordement. */
export const DEMAND: { id: string; label: string; value: number; detail: string }[] = [
  { id: "cpu", label: "Calcul", value: 0.58, detail: "Processeurs : 58 % de la capacité réservée" },
  { id: "memoire", label: "Mémoire", value: 0.84, detail: "Mémoire vive : 84 %, alerte à 80 %" },
  { id: "stockage", label: "Stockage", value: 0.31, detail: "Disques : 3,1 To sur 10 To" },
  { id: "reseau", label: "Réseau", value: 1.12, detail: "Bande passante : 112 % du forfait, surfacturation en cours" },
  { id: "froid", label: "Froid", value: 0.46, detail: "Salle serveurs : 46 % de la puissance froide" },
];

/* ---------------------------------------------------------------- outils */

export const SERVICES = [
  { id: "api", label: "API publique", value: "99,98 %" },
  { id: "web", label: "Application web", value: "99,95 %" },
  { id: "paiement", label: "Paiements", value: "100 %" },
  { id: "mail", label: "Envoi d'e-mails", value: "99,41 %" },
  { id: "recherche", label: "Recherche", value: "99,87 %" },
];

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: "todo", title: "À faire", hint: "Demandes qualifiées", tone: "info" },
  { id: "doing", title: "En cours", hint: "En développement", tone: "warning" },
  { id: "done", title: "Livré", hint: "Le plus récent d'abord", tone: "success", sortable: false },
];

export const KANBAN_CARDS: KanbanCard[] = [
  { id: 1, columnId: "todo", title: "Export comptable au format FEC", tag: "Facturation", description: "Le cabinet comptable veut le fichier des écritures en fin de mois." },
  { id: 2, columnId: "todo", title: "Rôle « lecteur » pour les auditeurs", tag: "Droits", badges: [{ label: "Client", tone: "info" }] },
  { id: 3, columnId: "doing", title: "Pagination du tableau des commandes", tag: "Tableaux", badges: [{ label: "Prioritaire", tone: "down" }] },
  { id: 4, columnId: "doing", title: "Relance automatique des impayés", tag: "Facturation" },
  { id: 5, columnId: "doing", title: "Double authentification par application", tag: "Sécurité", meta: "en recette" },
  { id: 6, columnId: "done", title: "Thème sombre", tag: "Interface", meta: "livré le 29 oct. 2026", group: "jeudi 29 octobre 2026" },
  { id: 7, columnId: "done", title: "Import de clients depuis un CSV", tag: "Données", meta: "livré le 27 oct. 2026", group: "mardi 27 octobre 2026" },
];

export const KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "factures",
    title: "Émettre une facture",
    category: "Facturation",
    keywords: ["facture", "devis", "avoir", "TVA"],
    summary: "Une facture part d'un devis accepté ou se crée à la main depuis la fiche client.",
    paragraphs: [
      "Le numéro est attribué à la validation, jamais avant : une facture brouillon n'a pas de numéro et peut être supprimée.",
      "Une facture validée ne se modifie plus. Pour la corriger, on émet un avoir puis une nouvelle facture.",
    ],
    tips: ["Le taux de TVA par défaut se règle dans Paramètres → Facturation."],
    related: ["relances", "export"],
  },
  {
    id: "relances",
    title: "Relancer un impayé",
    category: "Facturation",
    keywords: ["impayé", "relance", "retard", "rappel"],
    summary: "Trois relances automatiques à J+7, J+15 et J+30, désactivables client par client.",
    paragraphs: ["Le texte de chaque relance se modifie dans les modèles d'e-mails. La troisième propose un échéancier."],
    related: ["factures"],
  },
  {
    id: "export",
    title: "Exporter les données",
    category: "Données",
    keywords: ["export", "csv", "excel", "comptable", "FEC"],
    summary: "Chaque tableau s'exporte en CSV ; le grand livre s'exporte au format FEC pour le comptable.",
    paragraphs: ["Les exports respectent les filtres en cours : filtrez d'abord, exportez ensuite."],
    tips: ["Un export de plus de 50 000 lignes est envoyé par e-mail plutôt que téléchargé."],
    related: ["factures"],
  },
  {
    id: "roles",
    title: "Rôles et permissions",
    category: "Comptes",
    keywords: ["rôle", "droit", "permission", "administrateur", "invité"],
    summary: "Quatre rôles : propriétaire, administrateur, membre et invité.",
    paragraphs: ["Seul le propriétaire peut supprimer l'espace ou changer d'abonnement. Un invité ne voit que les projets où on l'a ajouté."],
    related: ["securite"],
  },
  {
    id: "securite",
    title: "Double authentification",
    category: "Comptes",
    keywords: ["2fa", "sécurité", "connexion", "code"],
    summary: "Un code à six chiffres demandé à la connexion, depuis une application d'authentification.",
    paragraphs: ["L'administrateur peut l'imposer à tout l'espace. Les codes de secours se téléchargent une seule fois."],
    related: ["roles"],
  },
];

export const ONBOARDING_STEPS = [
  { id: "profil", title: "Compléter le profil de l'entreprise", description: "Raison sociale, SIRET et adresse de facturation." },
  { id: "equipe", title: "Inviter l'équipe", description: "Ajoutez vos collaborateurs et choisissez leur rôle.", hint: "Un invité ne voit que les projets où on l'ajoute." },
  { id: "banque", title: "Connecter un compte bancaire", description: "Pour rapprocher automatiquement les paiements." },
  { id: "facture", title: "Émettre une première facture", description: "Depuis un devis accepté ou à partir de zéro." },
];

/** Le programme de montée en compétence d'une équipe support. `branch` renvoie aux trois branches de l'écran. */
export const SKILLS = [
  { id: "s1", label: "Prise en main", branch: "support", tier: 0, points: 1, effect: "Accès au tableau de bord", description: "Les bases : naviguer, chercher un client, lire une commande." },
  { id: "s2", label: "Tickets niveau 1", branch: "support", tier: 1, points: 2, requires: ["s1"], effect: "Répondre aux tickets simples" },
  { id: "s3", label: "Tickets niveau 2", branch: "support", tier: 2, points: 3, requires: ["s2"], effect: "Escalades et remboursements" },
  { id: "f1", label: "Facturation", branch: "finance", tier: 0, points: 1, effect: "Lire et renvoyer une facture" },
  { id: "f2", label: "Avoirs", branch: "finance", tier: 1, points: 2, requires: ["f1"], effect: "Émettre un avoir" },
  { id: "f3", label: "Rapprochement", branch: "finance", tier: 2, points: 3, requires: ["f2", "s2"], effect: "Rapprocher les paiements" },
  { id: "t1", label: "Journaux", branch: "technique", tier: 0, points: 1, effect: "Consulter les journaux d'activité" },
  { id: "t2", label: "API", branch: "technique", tier: 1, points: 2, requires: ["t1"], effect: "Diagnostiquer une intégration" },
  { id: "t3", label: "Astreinte", branch: "technique", tier: 2, points: 4, requires: ["t2"], effect: "Rejoindre la rotation d'astreinte" },
] as const;

export const ALLOCATION_TEAMS = [
  { id: "produit", label: "Produit" },
  { id: "support", label: "Support client" },
  { id: "dette", label: "Dette technique" },
];

/* ---------------------------------------------------------------- cartes, audio, planning */

export const GLOBE_NODES: GlobeNode[] = [
  { id: "par", lon: 2.35, lat: 48.86, label: "Paris", weight: 10, size: 7 },
  { id: "lon", lon: -0.13, lat: 51.51, label: "Londres", weight: 8, size: 6 },
  { id: "ber", lon: 13.4, lat: 52.52, label: "Berlin", weight: 7, size: 6 },
  { id: "nyc", lon: -74.0, lat: 40.71, label: "New York", weight: 9, size: 7 },
  { id: "mtl", lon: -73.57, lat: 45.5, label: "Montréal", weight: 6, size: 5 },
  { id: "dkr", lon: -17.47, lat: 14.72, label: "Dakar", weight: 5, size: 5 },
  { id: "sgp", lon: 103.82, lat: 1.35, label: "Singapour", weight: 7, size: 6 },
  { id: "tyo", lon: 139.69, lat: 35.69, label: "Tokyo", weight: 7, size: 6 },
  { id: "sao", lon: -46.63, lat: -23.55, label: "São Paulo", weight: 5, size: 5, minLod: "regional" },
  { id: "dxb", lon: 55.27, lat: 25.2, label: "Dubaï", weight: 5, size: 5, minLod: "regional" },
];

export const GLOBE_FLOWS: GlobeFlow[] = [
  { id: "par-nyc", from: "par", to: "nyc", intensity: 0.9, bidirectional: true },
  { id: "par-mtl", from: "par", to: "mtl", intensity: 0.7 },
  { id: "par-dkr", from: "par", to: "dkr", intensity: 0.55 },
  { id: "par-sgp", from: "par", to: "sgp", intensity: 0.6 },
  { id: "lon-nyc", from: "lon", to: "nyc", intensity: 0.75 },
  { id: "ber-tyo", from: "ber", to: "tyo", intensity: 0.5, style: "dashed" },
  { id: "dxb-sgp", from: "dxb", to: "sgp", intensity: 0.45 },
  { id: "nyc-sao", from: "nyc", to: "sao", intensity: 0.4, style: "dashed" },
];

export const MAP_HUBS: TileMapMarker[] = [
  { id: "par", lon: 2.35, lat: 48.86, label: "Paris" },
  { id: "lyo", lon: 4.84, lat: 45.76, label: "Lyon" },
];

/** Trois itinéraires Paris → Lyon, grossiers à dessein : quelques points suffisent à les séparer. */
export const MAP_ROUTES: TileMapRoute[] = [
  {
    id: "a6",
    label: "4 h 35",
    via: "465 km · A6",
    path: [
      { lon: 2.35, lat: 48.86 }, { lon: 2.44, lat: 48.63 }, { lon: 2.7, lat: 48.4 }, { lon: 3.29, lat: 48.0 },
      { lon: 3.57, lat: 47.8 }, { lon: 3.99, lat: 47.32 }, { lon: 4.33, lat: 47.05 }, { lon: 4.78, lat: 46.78 },
      { lon: 4.84, lat: 46.31 }, { lon: 4.72, lat: 45.99 }, { lon: 4.84, lat: 45.76 },
    ],
  },
  {
    id: "n7",
    label: "5 h 10",
    via: "470 km · A77 et N7",
    path: [
      { lon: 2.35, lat: 48.86 }, { lon: 2.44, lat: 48.63 }, { lon: 2.7, lat: 48.27 }, { lon: 2.73, lat: 48.0 },
      { lon: 2.93, lat: 47.41 }, { lon: 3.16, lat: 46.99 }, { lon: 3.33, lat: 46.57 }, { lon: 4.07, lat: 46.04 },
      { lon: 4.43, lat: 45.9 }, { lon: 4.84, lat: 45.76 },
    ],
  },
  {
    id: "a5",
    label: "5 h 00",
    via: "505 km · A5 et A31",
    path: [
      { lon: 2.35, lat: 48.86 }, { lon: 2.66, lat: 48.62 }, { lon: 3.3, lat: 48.45 }, { lon: 4.08, lat: 48.3 },
      { lon: 4.9, lat: 47.86 }, { lon: 5.04, lat: 47.32 }, { lon: 4.84, lat: 47.02 }, { lon: 4.85, lat: 46.6 },
      { lon: 4.84, lat: 46.31 }, { lon: 4.84, lat: 45.76 },
    ],
  },
];

export const EQ_BANDS: EqualizerBand[] = [
  { id: "31", label: "31", gain: 1 },
  { id: "62", label: "62", gain: 3 },
  { id: "125", label: "125", gain: 4 },
  { id: "250", label: "250", gain: 1.5 },
  { id: "500", label: "500", gain: -1 },
  { id: "1k", label: "1 k", gain: -2.5 },
  { id: "2k", label: "2 k", gain: 0 },
  { id: "4k", label: "4 k", gain: 2 },
  { id: "8k", label: "8 k", gain: 3.5 },
  { id: "16k", label: "16 k", gain: 2 },
];

/** Une journée d'atelier ancrée à une date fixe : le repère « maintenant » ne bouge pas d'une capture à l'autre. */
export const SCHEDULE_DAY = new Date("2026-10-30T06:00:00").getTime();
const at = (hours: number) => SCHEDULE_DAY + hours * HOUR;
export const SCHEDULE_NOW = at(5) + 20 * MINUTE;

export const SCHEDULE_RESOURCES: SchedulerResource[] = [
  { id: "l1", label: "Ligne 1", meta: "Assemblage" },
  { id: "l2", label: "Ligne 2", meta: "Assemblage" },
  { id: "cnc", label: "CNC-04", meta: "Usinage" },
  { id: "peinture", label: "Cabine peinture", meta: "Finition" },
  { id: "qualite", label: "Contrôle qualité", meta: "2 opérateurs" },
  { id: "quai", label: "Expédition", meta: "Quai A" },
];

export const SCHEDULE_TASKS: SchedulerTask[] = [
  { id: "t1", resourceId: "l1", label: "Série A — 400 pièces", start: at(0), end: at(3.5), status: "done" },
  { id: "t2", resourceId: "l1", label: "Changement d'outil", start: at(3.5), end: at(4), status: "done", locked: true },
  {
    id: "t3",
    resourceId: "l1",
    label: "Série B — 250 pièces",
    start: at(4),
    end: at(8),
    status: "running",
    description: "Lot client Martin & fils. Contrôle dimensionnel toutes les 50 pièces.",
    subtasks: [
      { id: "t3-s1", label: "Réglage", minutes: 45, status: "done" },
      { id: "t3-s2", label: "Production", minutes: 150, status: "running" },
      { id: "t3-s3", label: "Contrôle", minutes: 45, status: "planned" },
    ],
  },
  { id: "t4", resourceId: "l2", label: "Série C", start: at(1), end: at(5), status: "running" },
  { id: "t5", resourceId: "l2", label: "Reprise urgente", start: at(4), end: at(6.5), status: "late" },
  { id: "t6", resourceId: "l2", label: "Série D", start: at(7), end: at(11), status: "planned", pattern: "striped" },
  { id: "t7", resourceId: "cnc", label: "Lot 118", start: at(0.5), end: at(2), status: "done" },
  { id: "t8", resourceId: "cnc", label: "Lot 119", start: at(2.25), end: at(5.75), status: "running" },
  { id: "t9", resourceId: "cnc", label: "Maintenance préventive", start: at(6), end: at(7.5), status: "blocked", locked: true },
  { id: "t10", resourceId: "peinture", label: "Apprêt série A", start: at(3.5), end: at(5), status: "done" },
  { id: "t11", resourceId: "peinture", label: "Laque série A", start: at(5.25), end: at(7.25), status: "running" },
  { id: "t12", resourceId: "qualite", label: "Contrôle série A", start: at(7.5), end: at(9), status: "planned" },
  { id: "t13", resourceId: "qualite", label: "Audit client", start: at(9.5), end: at(11), status: "planned", pattern: "hatched" },
  { id: "t14", resourceId: "quai", label: "Chargement camion 1", start: at(9), end: at(10.5), status: "planned" },
  { id: "t15", resourceId: "quai", label: "Chargement camion 2", start: at(11), end: at(12), status: "planned" },
];
