/** Les données de l'écran « Vue d'ensemble », le tableau de bord de la vitrine.
 *  Toutes fictives, toutes déterministes : l'écran rend pareil à chaque chargement. */

import type { ChartSeries } from "@michaelthomasjach/liseuse-dashboard-kit";

/** Les couleurs de séries viennent du thème ; les graphiques les reçoivent en valeur, parce qu'un
 *  tracé SVG ne lit pas une variable CSS dans ses attributs. */
export const SERIES = { green: "#2e9e5b", blue: "#3a41e2", red: "#c4213a", grey: "#cfd2e3", violet: "#6b70f0" };

/** Une petite suite pseudo-aléatoire à graine fixe. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export const TICKERS = [
  { symbol: "AAPL", delta: 0.95, price: "546,45" },
  { symbol: "YAHW", delta: -0.34, price: "345,34" },
  { symbol: "RSME", delta: 0.95, price: "278,87" },
];

export const QUOTES = [
  { name: "AAPL — Apple", delta: "+0,42 %", price: "217,51", up: true },
  { name: "GOOG — Google", delta: "+0,22 %", price: "-2,28", up: false },
  { name: "MSFT — Microsoft", delta: "+1,10 %", price: "331,20", up: true },
  { name: "AMZN — Amazon", delta: "-0,64 %", price: "129,87", up: false },
];

export const PRODUCT_REVENUE: ChartSeries[] = [
  {
    id: "revenu",
    label: "Revenu",
    color: SERIES.green,
    area: true,
    data: [3, 1.6, 2.8, 2.1, 3.3, 3.6, 2.5, 3.1, 2.6].map((y, x) => ({ x: x + 1, y })),
  },
];

export const TODAY_SALES = [64, 82, 48, 91, 56, 97].map((v, i) => ({ id: `b${i}`, label: "", value: v }));

export const WEEKLY_TREND = [12, 14, 13, 17, 15, 19, 18, 22, 21, 26];

/** Trois séries sur trente points, pour la carte « Tesla ». */
export const TESLA: ChartSeries[] = (() => {
  const r = seeded(7);
  const walk = (start: number, drift: number, vol: number) => {
    let y = start;
    return Array.from({ length: 40 }, (_, x) => {
      y = Math.max(0, y + drift + (r() - 0.5) * vol);
      return { x, y: Math.round(y * 10) / 10 };
    });
  };
  return [
    { id: "tsla", label: "TSLA", color: SERIES.green, data: walk(10, 2.4, 22) },
    { id: "nasdaq", label: "Nasdaq", color: SERIES.blue, data: walk(5, 1.4, 16) },
    { id: "sp", label: "S&P 500", color: SERIES.red, data: walk(2, 0, 6) },
  ];
})();

export const TODAY_TABLE = [
  { id: "t1", produit: "Abonnement annuel — étendu", qte: 1, prix: "1 000 €" },
  { id: "t2", produit: "Support prioritaire n°2", qte: 1, prix: "12 €" },
  { id: "t3", produit: "Licence poste n°2345", qte: 1, prix: "27 €" },
  { id: "t4", produit: "Licence poste n°2346", qte: 1, prix: "27 €" },
  { id: "t5", produit: "Support prioritaire n°3", qte: 1, prix: "12 €" },
  { id: "t6", produit: "Abonnement annuel — étendu", qte: 1, prix: "1 000 €" },
];

export const GEO_MARKERS = [
  { id: "na", lat: 39.5, lon: -98.35, label: "Amérique du Nord", details: "1 284 visites aujourd'hui" },
  { id: "ca", lat: 56, lon: -106, label: "Canada", details: "312 visites" },
  { id: "mx", lat: 23.6, lon: -102.5, label: "Mexique", details: "187 visites" },
];

/** Charge du serveur : deux séries qui glissent d'un point à chaque tic. */
export function serverLoad(tick: number): ChartSeries[] {
  const r = seeded(11 + tick);
  const base = Array.from({ length: 50 }, (_, i) => i + tick);
  const total = base.map((x) => ({ x, y: 14 + Math.sin(x / 3) * 2 + r() * 3 }));
  const used = base.map((x) => ({ x, y: 6 + Math.sin(x / 4) * 1.5 + r() * 2 }));
  return [
    { id: "total", label: "Mémoire", color: SERIES.grey, area: true, data: total },
    { id: "used", label: "Utilisée", color: SERIES.green, area: true, data: used },
  ];
}

export const STOCK_BARS = (() => {
  const r = seeded(3);
  return Array.from({ length: 40 }, (_, i) => ({ id: `s${i}`, label: "", value: Math.round(30 + r() * 40) }));
})();

export const STOCK_TABS = [
  { id: "appl", symbol: "APPL", value: "22,23", delta: "+60,223 %", up: true },
  { id: "fb", symbol: "FB", value: "45,97", delta: "-06,56 %", up: false },
  { id: "goog", symbol: "GOOG", value: "22,23", delta: "+60,223 %", up: true },
];

export const PAGE_VIEWS: ChartSeries[] = [
  { id: "vues", label: "Vues", color: SERIES.green, endDot: true, data: [1.2, 2.4, 2.6, 3.4, 3.1, 1.6].map((y, x) => ({ x, y })) },
];

export const HOURLY = [
  { id: "h1", label: "13:30", temp: "30 °C" },
  { id: "h2", label: "14:00", temp: "30 °C" },
  { id: "h3", label: "14:30", temp: "30 °C" },
  { id: "h4", label: "15:00", temp: "27 °C" },
  { id: "h5", label: "15:30", temp: "16 °C" },
  { id: "h6", label: "16:00", temp: "21 °C" },
];
