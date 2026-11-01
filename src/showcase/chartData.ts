import type {
  BarDatum,
  Candle,
  ChartAlert,
  ChartEvent,
  ChartSeries,
  ChartWorkspaceWatchlist,
  DeltaChartItem,
  DonutDatum,
  HeatmapGroup,
  MatrixAxisEntry,
  MatrixCell,
  SankeyLinkDatum,
  SankeyNodeDatum,
  WorldExposureDatum,
} from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * Les données des planches de graphiques — celles de « Graphiques » et de « Graphiques de marché ».
 *
 * Tout est tiré d'un générateur à graine fixe et daté par rapport à un jour fixe : la vitrine doit
 * rendre exactement la même image à chaque chargement, sans quoi une capture d'écran ne prouverait
 * rien d'un jour à l'autre. Les sociétés et les montants sont fictifs, ou illustratifs quand un nom
 * réel aide à lire (les secteurs de la carte de chaleur, les actifs de la matrice).
 */

/** Le « aujourd'hui » de la vitrine. */
const AUJOURDHUI = Date.UTC(2026, 9, 30);

/** mulberry32 : petit générateur à graine, assez bon pour des données de démonstration. */
function graine(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Une variable à peu près normale centrée réduite (somme de trois uniformes). */
const normale = (rand: () => number) => (rand() + rand() + rand() - 1.5) * 2;

const arrondi = (n: number, pas = 1) => Math.round(n / pas) * pas;

/** Le premier jour de chacun des `n` derniers mois, le plus ancien d'abord. */
function mois(n: number): Date[] {
  const fin = new Date(AUJOURDHUI);
  return Array.from({ length: n }, (_, i) => new Date(Date.UTC(fin.getUTCFullYear(), fin.getUTCMonth() - (n - 1 - i), 1)));
}

export const MOIS_COURTS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

// ---- Graphiques ----------------------------------------------------------------------------------

/** Chiffre d'affaires et charges mensuels, en k€, sur deux ans — creux d'août compris. */
export const CA_CHARGES: ChartSeries[] = (() => {
  const rand = graine(7);
  const dates = mois(24);
  const ca = dates.map((x, i) => {
    const saison = x.getUTCMonth() === 7 ? -14 : x.getUTCMonth() === 11 ? 8 : 0;
    return { x, y: arrondi(62 + i * 1.35 + saison + normale(rand) * 2.5, 0.1) };
  });
  const charges = ca.map((p) => ({ x: p.x, y: arrondi(p.y * 0.71 + 6 + normale(rand) * 2, 0.1) }));
  return [
    { id: "ca", label: "Chiffre d'affaires", data: ca },
    { id: "charges", label: "Charges", data: charges },
  ];
})();

/** Trésorerie réalisée sur douze mois, puis une prévision à six mois et son éventail de scénarios. */
export const TRESORERIE: ChartSeries[] = (() => {
  const rand = graine(19);
  const passe = mois(12);
  let solde = 210;
  const realise = passe.map((x) => {
    solde += normale(rand) * 14 + (x.getUTCMonth() === 6 ? -38 : 2);
    return { x, y: arrondi(solde, 0.1) };
  });
  const depart = realise[realise.length - 1];
  const futur = Array.from({ length: 7 }, (_, i) => new Date(Date.UTC(2026, 9 + i, 1)));
  const centre = futur.map((x, i) => ({ x, y: arrondi(depart.y - i * 9 + (i === 3 ? -22 : 0), 0.1) }));
  return [
    { id: "realise", label: "Trésorerie réalisée", area: true, data: realise },
    {
      id: "prevision",
      label: "Prévision centrale",
      dashed: true,
      data: centre,
      band: centre.map((p, i) => ({ x: p.x, low: arrondi(p.y - i * 11, 0.1), high: arrondi(p.y + i * 8, 0.1) })),
    },
  ];
})();

/** Le seuil de trésorerie sous lequel la direction financière veut être prévenue, en k€. */
export const SEUIL_TRESORERIE = 120;

export const VENTES_SERIES = [
  { id: "n1", label: "2025" },
  { id: "n", label: "2026" },
];

/** Ventes par canal, en k€, cette année contre l'an dernier. */
export const VENTES_CANAL: BarDatum[] = [
  { id: "web", label: "Site web", values: { n1: 312, n: 388 } },
  { id: "revendeurs", label: "Revendeurs", values: { n1: 246, n: 231 } },
  { id: "grands-comptes", label: "Grands comptes", values: { n1: 198, n: 264 } },
  { id: "marketplace", label: "Marketplace", values: { n1: 87, n: 129 } },
  { id: "salons", label: "Salons", values: { n1: 64, n: 68 } },
];

/** Les huit premiers clients de l'année, en k€ facturés. */
export const TOP_CLIENTS: BarDatum[] = [
  { id: "c1", label: "Groupe Delmas", value: 142 },
  { id: "c2", label: "Arvel Santé", value: 118 },
  { id: "c3", label: "Transports Moreau", value: 96 },
  { id: "c4", label: "Lemoine SAS", value: 81 },
  { id: "c5", label: "Ville de Rennes", value: 74 },
  { id: "c6", label: "Céramiques Faure", value: 58 },
  { id: "c7", label: "Brasserie Kervel", value: 43 },
  { id: "c8", label: "Atelier Ponsard", value: 31 },
];

/** Écart mensuel au budget, en k€ — positif quand le mois a fait mieux que prévu. */
export const ECART_BUDGET: BarDatum[] = (() => {
  const rand = graine(31);
  return mois(12).map((d, i) => ({
    id: `m${i}`,
    label: MOIS_COURTS[d.getUTCMonth()],
    value: arrondi(normale(rand) * 9 + 1.5, 0.1),
  }));
})();

/** Répartition du chiffre d'affaires par gamme, en k€. */
export const CA_PAR_GAMME: DonutDatum[] = [
  { id: "abonnements", label: "Abonnements", value: 620 },
  { id: "licences", label: "Licences", value: 260 },
  { id: "services", label: "Services", value: 140 },
  { id: "formation", label: "Formation", value: 60 },
];

/** Les moyens de paiement des factures encaissées ce trimestre, en nombre. */
export const MOYENS_PAIEMENT: DonutDatum[] = [
  { id: "virement", label: "Virement", value: 412 },
  { id: "prelevement", label: "Prélèvement", value: 268 },
  { id: "carte", label: "Carte", value: 131 },
  { id: "cheque", label: "Chèque", value: 22 },
];

/** Des indicateurs suivis sur trente jours, pour les lignes de tendance. */
export const KPI_TENDANCES: { id: string; label: string; value: string; data: number[] }[] = (() => {
  const rand = graine(53);
  const marche = (n: number, depart: number, pente: number, bruit: number) => {
    let v = depart;
    return Array.from({ length: n }, () => (v = Math.max(0, v + pente + normale(rand) * bruit)));
  };
  return [
    { id: "mrr", label: "Revenu récurrent", value: "91,4 k€", data: marche(30, 84, 0.25, 0.6) },
    { id: "conv", label: "Taux de conversion", value: "3,2 %", data: marche(30, 3.6, -0.015, 0.12) },
    { id: "tickets", label: "Tickets ouverts", value: "37", data: marche(30, 58, -0.7, 2.4) },
    { id: "encours", label: "Encours clients", value: "184 k€", data: marche(30, 170, 0.45, 3) },
  ];
})();

/** Du chiffre d'affaires au résultat net de l'exercice, en k€ — chaque sous-total retombe juste. */
export const PONT_RESULTAT: DeltaChartItem[] = [
  { id: "ca", label: "CA", value: 1080, isTotal: true },
  { id: "cdv", label: "Coût des ventes", value: -324 },
  { id: "mb", label: "Marge brute", value: 756, isTotal: true },
  { id: "personnel", label: "Personnel", value: -388 },
  { id: "marketing", label: "Marketing", value: -96 },
  { id: "locaux", label: "Locaux", value: -54 },
  { id: "autres", label: "Autres produits", value: 22 },
  { id: "ebitda", label: "EBITDA", value: 240, isTotal: true },
  { id: "amort", label: "Amortissements", value: -46 },
  { id: "impots", label: "Impôts", value: -48 },
  { id: "net", label: "Résultat net", value: 146, isTotal: true },
];

/** Un portefeuille d'actions européennes par secteur : taille = poids en k€, couleur = séance du jour. */
export const PORTEFEUILLE_SECTEURS: HeatmapGroup[] = (() => {
  const rand = graine(71);
  const secteurs: [string, string, [string, string, number][]][] = [
    ["luxe", "Luxe", [["MC", "LVMH", 182], ["RMS", "Hermès", 121], ["KER", "Kering", 38], ["CDI", "Christian Dior", 44]]],
    ["finance", "Finance", [["BNP", "BNP Paribas", 96], ["CS", "AXA", 88], ["GLE", "Société Générale", 41], ["ACA", "Crédit Agricole", 47]]],
    ["industrie", "Industrie", [["AIR", "Airbus", 118], ["SAF", "Safran", 92], ["HO", "Thales", 46], ["SU", "Schneider Electric", 104]]],
    ["sante", "Santé", [["SAN", "Sanofi", 109], ["EL", "EssilorLuxottica", 77]]],
    ["energie", "Énergie", [["TTE", "TotalEnergies", 128], ["ENGI", "Engie", 52]]],
    ["tech", "Technologie", [["CAP", "Capgemini", 34], ["DSY", "Dassault Systèmes", 39], ["STMPA", "STMicroelectronics", 29]]],
  ];
  return secteurs.map(([id, label, titres]) => ({
    id,
    label,
    tiles: titres.map(([ticker, nom, poids]) => {
      const variation = arrondi(normale(rand) * 1.6, 0.01);
      return {
        id: ticker,
        label: ticker,
        value: poids,
        colorValue: variation,
        formattedValue: `${variation >= 0 ? "+" : ""}${variation.toFixed(2).replace(".", ",")} %`,
        details: [nom, `${poids} k€ en portefeuille`],
      };
    }),
  }));
})();

/** Les actifs de la matrice de corrélation. */
export const ACTIFS: MatrixAxisEntry[] = [
  { id: "cac", label: "CAC 40" },
  { id: "sx5e", label: "Euro Stoxx 50" },
  { id: "spx", label: "S&P 500" },
  { id: "or", label: "Or" },
  { id: "bund", label: "Bund 10 ans" },
  { id: "eurusd", label: "EUR/USD" },
  { id: "brent", label: "Brent" },
];

/** Corrélations des rendements quotidiens sur un an (valeurs illustratives). */
export const CORRELATIONS: MatrixCell[] = (() => {
  const paires: Record<string, number> = {
    "cac|sx5e": 0.96, "cac|spx": 0.78, "cac|or": 0.08, "cac|bund": -0.34, "cac|eurusd": 0.21, "cac|brent": 0.37,
    "sx5e|spx": 0.8, "sx5e|or": 0.05, "sx5e|bund": -0.36, "sx5e|eurusd": 0.24, "sx5e|brent": 0.35,
    "spx|or": 0.12, "spx|bund": -0.28, "spx|eurusd": 0.15, "spx|brent": 0.3,
    "or|bund": 0.22, "or|eurusd": 0.41, "or|brent": 0.18,
    "bund|eurusd": 0.1, "bund|brent": -0.25,
    "eurusd|brent": 0.27,
  };
  const lecture = (v: number) =>
    Math.abs(v) >= 0.7 ? "forte" : Math.abs(v) >= 0.3 ? "modérée" : "faible";
  const cells: MatrixCell[] = [];
  for (const r of ACTIFS) {
    for (const c of ACTIFS) {
      if (r.id === c.id) {
        cells.push({ row: r.id, column: c.id, value: null });
        continue;
      }
      const v = paires[`${r.id}|${c.id}`] ?? paires[`${c.id}|${r.id}`];
      cells.push({
        row: r.id,
        column: c.id,
        value: v,
        details: [
          { label: "Période", value: "nov. 2025 – oct. 2026" },
          { label: "Séances", value: "252" },
          { label: "Lecture", value: `Corrélation ${lecture(v)}, ${v >= 0 ? "dans le même sens" : "en sens contraire"}` },
        ],
      });
    }
  }
  return cells;
})();

/** Le budget de l'exercice, des produits jusqu'à leur emploi, en k€ — chaque niveau s'équilibre. */
export const BUDGET_NODES: SankeyNodeDatum[] = [
  { id: "abonnements", label: "Abonnements" },
  { id: "licences", label: "Licences" },
  { id: "services", label: "Services" },
  { id: "formation", label: "Formation" },
  { id: "autres", label: "Autres produits" },
  { id: "produits", label: "Produits" },
  { id: "cdv", label: "Coût des ventes" },
  { id: "personnel", label: "Personnel" },
  { id: "marketing", label: "Marketing" },
  { id: "locaux", label: "Locaux" },
  { id: "amort", label: "Amortissements" },
  { id: "impots", label: "Impôts" },
  { id: "net", label: "Résultat net" },
  { id: "cloud", label: "Hébergement cloud" },
  { id: "soustraitance", label: "Sous-traitance" },
  { id: "licences-tierces", label: "Licences tierces" },
  { id: "rd", label: "R&D" },
  { id: "commercial", label: "Commercial" },
  { id: "support", label: "Support" },
  { id: "admin", label: "Administration" },
  { id: "acquisition", label: "Acquisition payante" },
  { id: "evenements", label: "Événements" },
  { id: "contenu", label: "Contenu" },
  { id: "reinvesti", label: "Réinvesti" },
  { id: "dividendes", label: "Dividendes" },
];

export const BUDGET_LINKS: SankeyLinkDatum[] = [
  { source: "abonnements", target: "produits", value: 620 },
  { source: "licences", target: "produits", value: 260 },
  { source: "services", target: "produits", value: 140 },
  { source: "formation", target: "produits", value: 60 },
  { source: "autres", target: "produits", value: 22 },
  { source: "produits", target: "cdv", value: 324 },
  { source: "produits", target: "personnel", value: 388 },
  { source: "produits", target: "marketing", value: 96 },
  { source: "produits", target: "locaux", value: 54 },
  { source: "produits", target: "amort", value: 46 },
  { source: "produits", target: "impots", value: 48 },
  { source: "produits", target: "net", value: 146 },
  { source: "cdv", target: "cloud", value: 168 },
  { source: "cdv", target: "soustraitance", value: 104 },
  { source: "cdv", target: "licences-tierces", value: 52 },
  { source: "personnel", target: "rd", value: 170 },
  { source: "personnel", target: "commercial", value: 104 },
  { source: "personnel", target: "support", value: 62 },
  { source: "personnel", target: "admin", value: 52 },
  { source: "marketing", target: "acquisition", value: 48 },
  { source: "marketing", target: "evenements", value: 28 },
  { source: "marketing", target: "contenu", value: 20 },
  { source: "net", target: "reinvesti", value: 96 },
  { source: "net", target: "dividendes", value: 50 },
];

/** Montant facturé (k€) et délai moyen de paiement (jours) par client — pour le nuage composé à la main. */
export const DELAIS_CLIENTS: { client: string; montant: number; delai: number }[] = (() => {
  const rand = graine(97);
  const noms = [
    "Groupe Delmas", "Arvel Santé", "Transports Moreau", "Lemoine SAS", "Ville de Rennes", "Céramiques Faure",
    "Brasserie Kervel", "Atelier Ponsard", "Optique Garnier", "Cabinet Royer", "Menuiserie Blanc", "Hôtel des Lices",
    "Studio Vasseur", "Pharmacie Leroux", "Imprimerie Caron", "Domaine Aubert",
  ];
  return noms.map((client, i) => ({
    client,
    montant: arrondi(150 - i * 8.5 + normale(rand) * 6, 1),
    delai: arrondi(Math.max(12, 28 + i * 2.2 + normale(rand) * 9), 1),
  }));
})();

// ---- Graphiques de marché ------------------------------------------------------------------------

/**
 * Des bougies quotidiennes fictives, jours ouvrés seulement, jusqu'au jour fixe de la vitrine.
 *
 * Une marche géométrique avec une légère saisonnalité (meilleure de novembre à avril, molle l'été) :
 * sans elle, la vue de saisonnalité n'aurait rien à montrer que du bruit.
 */
function bougies(annees: number, depart: number, seed: number): Candle[] {
  const rand = graine(seed);
  const fin = new Date(AUJOURDHUI);
  const debut = Date.UTC(fin.getUTCFullYear() - annees, 0, 2);
  const derive = [0.0011, 0.0008, 0.0006, 0.0005, -0.0004, -0.0006, -0.0002, -0.0007, -0.0009, 0.0003, 0.001, 0.0012];
  const out: Candle[] = [];
  let close = depart;
  for (let t = debut; t <= AUJOURDHUI; t += 86_400_000) {
    const d = new Date(t);
    const jour = d.getUTCDay();
    if (jour === 0 || jour === 6) continue;
    const open = close * (1 + normale(rand) * 0.003);
    close = open * Math.exp(derive[d.getUTCMonth()] + normale(rand) * 0.013);
    const high = Math.max(open, close) * (1 + rand() * 0.008);
    const low = Math.min(open, close) * (1 - rand() * 0.008);
    out.push({
      date: d,
      open: arrondi(open, 0.01),
      high: arrondi(high, 0.01),
      low: arrondi(low, 0.01),
      close: arrondi(close, 0.01),
      volume: Math.round(180_000 + rand() * 420_000 + Math.abs(close - open) * 40_000),
    });
  }
  return out;
}

/** Novaterra SA — fictive — sur sept ans : assez d'années pour une saisonnalité qui se lise. */
export const BOUGIES_NOVA = bougies(7, 42, 2026);
/** Kapalia — fictive — sur trois ans, pour le second panneau de l'espace de travail. */
export const BOUGIES_KAPA = bougies(3, 118, 404);

const jourOuvre = (y: number, m: number, d: number) => {
  const date = new Date(Date.UTC(y, m, d));
  while (date.getUTCDay() === 0 || date.getUTCDay() === 6) date.setUTCDate(date.getUTCDate() + 1);
  return date;
};

/** Publications, dividendes et assemblée de Novaterra, posés sur les dates de ses bougies. */
export const EVENEMENTS_NOVA: ChartEvent[] = [
  {
    date: jourOuvre(2026, 1, 18),
    kind: "Résultats",
    symbol: "R",
    label: "Résultats annuels 2025",
    details: ["Chiffre d'affaires : 1,08 Md€ (+9 %)", "Marge opérationnelle : 22,2 %", "Réaction du titre : +4,1 %"],
  },
  {
    date: jourOuvre(2026, 4, 12),
    kind: "Dividende",
    symbol: "D",
    label: "Détachement du dividende",
    details: ["0,85 € par action", "Rendement : 2,1 %"],
  },
  {
    date: jourOuvre(2026, 5, 4),
    kind: "Assemblée",
    symbol: "AG",
    label: "Assemblée générale",
    details: ["Toutes les résolutions adoptées", "Programme de rachat d'actions reconduit"],
  },
  {
    date: jourOuvre(2026, 6, 28),
    kind: "Résultats",
    symbol: "R",
    label: "Résultats semestriels",
    details: ["Chiffre d'affaires : 562 M€ (+7 %)", "Prévisions annuelles confirmées", "Réaction du titre : −2,3 %"],
  },
  {
    date: jourOuvre(2026, 9, 22),
    kind: "Résultats",
    symbol: "R",
    label: "Chiffre d'affaires du troisième trimestre",
    details: ["283 M€ (+6 %)", "Carnet de commandes record"],
  },
];

/** Deux évènements tombés sur le même repère — ce qu'une infobulle d'évènement doit savoir lister. */
export const EVENEMENTS_EMPILES: ChartEvent[] = [EVENEMENTS_NOVA[1], EVENEMENTS_NOVA[2]];

const dernierCours = BOUGIES_NOVA[BOUGIES_NOVA.length - 1].close;
const prix = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Les alertes posées sur Novaterra. */
export const ALERTES_NOVA: ChartAlert[] = [
  {
    id: "al-1",
    drawingId: null,
    conditionIndicatorId: "price",
    crossing: { kind: "crossingUp" },
    trigger: "onlyOnce",
    sound: "aucun",
    message: `NOVA franchit ${prix(dernierCours * 1.05)} € à la hausse`,
    expiresAt: null,
  },
  {
    id: "al-2",
    drawingId: null,
    conditionIndicatorId: "price",
    crossing: { kind: "crossingDown" },
    trigger: "oncePerBarClose",
    sound: "aucun",
    message: `NOVA clôture sous ${prix(dernierCours * 0.92)} € (seuil de couverture)`,
    expiresAt: null,
  },
  {
    id: "al-3",
    drawingId: null,
    conditionIndicatorId: "price",
    crossing: { kind: "greaterThan" },
    trigger: "oncePerBar",
    sound: "aucun",
    message: "Volume du jour supérieur à deux fois la moyenne",
    expiresAt: null,
  },
];

/** Exposition géographique d'un portefeuille, en % du total. */
export const EXPOSITION_MONDE: WorldExposureDatum[] = [
  { id: "eu", label: "Europe", value: 46 },
  { id: "na", label: "Amérique du Nord", value: 31 },
  { id: "asia", label: "Asie", value: 13 },
  { id: "latam", label: "Amérique du Sud", value: 4 },
  { id: "me", label: "Moyen-Orient", value: 2 },
  { id: "africa", label: "Afrique", value: 1 },
  { id: "global", label: "Global", value: 3 },
];

const variation = (data: Candle[]) => {
  const [a, b] = data.slice(-2);
  return ((b.close - a.close) / a.close) * 100;
};

const ligne = (id: string, ticker: string, data: Candle[], couleur: string, secteur: string) => {
  const v = variation(data);
  const close = data[data.length - 1].close;
  return {
    id,
    ticker,
    logoColor: couleur,
    sector: secteur,
    region: "Europe",
    assetType: "Action",
    price: close,
    values: { prix: prix(close), variation: `${v >= 0 ? "+" : ""}${v.toFixed(2).replace(".", ",")} %` },
  };
};

/** La liste de surveillance de l'espace de travail. */
export const LISTES_SURVEILLANCE: ChartWorkspaceWatchlist[] = [
  {
    id: "favoris",
    name: "Mes valeurs",
    columns: [
      { id: "prix", label: "Prix", sortValue: (r) => r.price ?? 0 },
      { id: "variation", label: "Var." },
    ],
    rows: [
      ligne("r-nova", "NOVA", BOUGIES_NOVA, "var(--lq-color-accent)", "Industrie"),
      ligne("r-kapa", "KAPA", BOUGIES_KAPA, "var(--lq-color-green)", "Santé"),
      ligne("r-orel", "OREL", bougies(1, 64, 77), "var(--lq-color-amber)", "Énergie"),
      ligne("r-velo", "VELO", bougies(1, 23, 88), "var(--lq-color-sky)", "Consommation"),
    ],
  },
];
