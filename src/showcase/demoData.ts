/** Les données de démonstration, toutes ici plutôt que dispersées dans les écrans : un écran de
 *  vitrine doit se lire comme une mise en page, pas comme un tableau de chiffres inventés. */

export interface Order {
  id: string;
  client: string;
  produit: string;
  quantite: number;
  montant: number;
  statut: "payée" | "en attente" | "annulée";
  date: string;
}

export const ORDERS: Order[] = [
  { id: "C-4821", client: "Lemoine SAS", produit: "Abonnement annuel", quantite: 12, montant: 14400, statut: "payée", date: "2026-10-28" },
  { id: "C-4822", client: "Atelier Nord", produit: "Licence poste", quantite: 3, montant: 1080, statut: "payée", date: "2026-10-28" },
  { id: "C-4823", client: "Groupe Vallée", produit: "Abonnement annuel", quantite: 40, montant: 48000, statut: "en attente", date: "2026-10-27" },
  { id: "C-4824", client: "Mercier & Fils", produit: "Module analytique", quantite: 1, montant: 2400, statut: "payée", date: "2026-10-27" },
  { id: "C-4825", client: "Studio Bélier", produit: "Licence poste", quantite: 8, montant: 2880, statut: "annulée", date: "2026-10-26" },
  { id: "C-4826", client: "Cabinet Roux", produit: "Abonnement annuel", quantite: 5, montant: 6000, statut: "payée", date: "2026-10-26" },
  { id: "C-4827", client: "Transports Hary", produit: "Module analytique", quantite: 2, montant: 4800, statut: "en attente", date: "2026-10-25" },
  { id: "C-4828", client: "Ferme du Pré", produit: "Licence poste", quantite: 2, montant: 720, statut: "payée", date: "2026-10-25" },
];

/** 57 commandes, pour ce qui a besoin de volume — pagination, recherche, en-tête figé. Mêmes valeurs
 *  que `ORDERS_LONG` dans les données de stories du kit : les deux Storybook montrent le même tableau. */
export const ORDERS_LONG: Order[] = Array.from({ length: 57 }, (_, i) => {
  const base = ORDERS[(i * 5) % ORDERS.length];
  const quantite = 1 + ((i * 7) % 24);
  const unit = base.montant / base.quantite;
  const day = 28 - Math.floor(i / 3);
  return {
    ...base,
    id: `C-${4821 + i}`,
    quantite,
    montant: Math.round(quantite * unit),
    statut: i % 7 === 3 ? "annulée" : i % 4 === 1 ? "en attente" : "payée",
    date: `2026-10-${String(day).padStart(2, "0")}`,
  };
});

/** Le ton de `Badge` qui dit un statut de commande. Ici et non dans chaque écran : deux écrans
 *  montrent la même colonne, et deux correspondances écrites séparément finissent par ne plus
 *  dire la même chose. */
export function statutTone(statut: Order["statut"]): "up" | "down" | "warning" {
  return statut === "payée" ? "up" : statut === "annulée" ? "down" : "warning";
}

/** Douze points, un par mois — de quoi nourrir les sparklines des tuiles. */
export const REVENUE_TREND = [38, 41, 39, 46, 52, 49, 58, 61, 57, 66, 71, 80];
export const SIGNUPS_TREND = [12, 15, 14, 19, 17, 22, 21, 26, 24, 29, 33, 31];
export const CHURN_TREND = [6, 5, 7, 6, 8, 7, 6, 5, 6, 4, 5, 4];

/* ---- la planche Finance ---- */

/** Une ligne de portefeuille de trésorerie : de quoi nourrir `HoldingCard` et `WatchlistWidget`,
 *  qui partagent la même forme (`WatchlistItem` n'est qu'une `HoldingCard` avec un `id`). */
export interface Holding {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  change: number;
  sparklineData: number[];
}

export const HOLDINGS: Holding[] = [
  { id: "mc", symbol: "MC", name: "LVMH", quantity: 40, price: 642.3, change: 1.84, sparklineData: [612, 618, 615, 624, 630, 627, 635, 642] },
  { id: "air", symbol: "AIR", name: "Airbus", quantity: 120, price: 151.62, change: -0.92, sparklineData: [156, 155, 157, 154, 153, 154, 152, 151.6] },
  { id: "su", symbol: "SU", name: "Schneider Electric", quantity: 85, price: 238.4, change: 2.37, sparklineData: [224, 226, 229, 228, 231, 233, 236, 238.4] },
  { id: "san", symbol: "SAN", name: "Sanofi", quantity: 150, price: 96.18, change: -1.46, sparklineData: [100, 99.4, 98.8, 99.1, 98, 97.5, 97.6, 96.2] },
  { id: "or", symbol: "OR", name: "L'Oréal", quantity: 30, price: 371.9, change: 0.12, sparklineData: [370, 372, 369, 371, 373, 370, 371, 371.9] },
];

/** Les plus fortes variations de la séance, pour `MarketMoversWidget`. */
export const GAINERS = [
  { id: "g1", symbol: "STMPA", name: "STMicroelectronics", change: 6.42 },
  { id: "g2", symbol: "CAP", name: "Capgemini", change: 4.18 },
  { id: "g3", symbol: "SU", name: "Schneider Electric", change: 2.37 },
  { id: "g4", symbol: "MC", name: "LVMH", change: 1.84 },
];

export const LOSERS = [
  { id: "l1", symbol: "WLN", name: "Worldline", change: -7.85 },
  { id: "l2", symbol: "KER", name: "Kering", change: -3.21 },
  { id: "l3", symbol: "SAN", name: "Sanofi", change: -1.46 },
  { id: "l4", symbol: "AIR", name: "Airbus", change: -0.92 },
];

/** Quatre-vingt-dix jours de valeur de portefeuille. Une suite calculée plutôt qu'aléatoire : la
 *  vitrine doit rendre la même courbe à chaque chargement, sinon une capture ne prouve rien. */
export const PORTFOLIO_HISTORY = Array.from({ length: 90 }, (_, i) => ({
  x: new Date(Date.UTC(2026, 7, 2) + i * 86_400_000),
  y: Math.round(118_000 + i * 120 + Math.sin(i / 6) * 2_400 + Math.sin(i / 2.3) * 700),
}));
