import { useLayoutEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  LineAreaChart,
  BarChart,
  DonutChart,
  GaugeChart,
  Sparkline,
  DeltaChart,
  Heatmap,
  MatrixChart,
  SankeyChart,
  ChartAxis,
  ChartTooltip,
  Text,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { Specimen, SpecimenGrid, SpecimenScreen } from "../../Specimen";
import {
  CA_CHARGES,
  TRESORERIE,
  SEUIL_TRESORERIE,
  VENTES_CANAL,
  VENTES_SERIES,
  TOP_CLIENTS,
  ECART_BUDGET,
  CA_PAR_GAMME,
  MOYENS_PAIEMENT,
  KPI_TENDANCES,
  PONT_RESULTAT,
  PORTEFEUILLE_SECTEURS,
  ACTIFS,
  CORRELATIONS,
  BUDGET_NODES,
  BUDGET_LINKS,
  DELAIS_CLIENTS,
  MOIS_COURTS,
} from "../../chartData";

const nombre = (n: number, decimales = 0) =>
  n.toLocaleString("fr-FR", { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
const kEuros = (n: number) => `${nombre(n)} k€`;
const kEurosSigne = (n: number) => `${n > 0 ? "+" : ""}${nombre(n, 1)} k€`;
const moisAnnee = (x: Date | number) => {
  const d = new Date(x);
  return `${MOIS_COURTS[d.getUTCMonth()]} ${String(d.getUTCFullYear()).slice(2)}`;
};

/** La largeur disponible d'un conteneur — ce qu'un graphique composé à la main doit connaître. */
function useLargeur<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [largeur, setLargeur] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setLargeur(Math.floor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, largeur] as const;
}

/**
 * Un nuage de points écrit avec les deux briques que le kit expose pour composer ses propres
 * graphiques : `ChartAxis` pour les axes (d3 garde la main sur les graduations, React sur le reste)
 * et `ChartTooltip` pour la bulle, qui se recale d'elle-même dans le tracé.
 */
function NuageDelais() {
  const [ref, largeur] = useLargeur<HTMLDivElement>();
  const [survol, setSurvol] = useState<number | null>(null);
  const hauteur = 260;
  const marge = { top: 12, right: 16, bottom: 34, left: 44 };
  const w = Math.max(0, largeur - marge.left - marge.right);
  const h = hauteur - marge.top - marge.bottom;
  const x = d3.scaleLinear().domain([0, 170]).range([0, w]).nice();
  const y = d3.scaleLinear().domain([0, 75]).range([h, 0]).nice();
  const point = survol === null ? null : DELAIS_CLIENTS[survol];

  return (
    <div ref={ref} className="rdk-chart-host">
      {largeur > 0 ? (
        <svg width={largeur} height={hauteur} role="img" aria-label="Délai de paiement selon le montant facturé">
          <g transform={`translate(${marge.left},${marge.top})`}>
            <ChartAxis scale={y} orientation="left" ticks={5} grid gridLength={w} tickFormat={(v) => `${v} j`} />
            <ChartAxis scale={x} orientation="bottom" transform={`translate(0,${h})`} ticks={6} tickFormat={(v) => `${v} k€`} />
            {DELAIS_CLIENTS.map((c, i) => (
              <circle
                key={c.client}
                cx={x(c.montant)}
                cy={y(c.delai)}
                r={survol === i ? 6 : 4.5}
                fill={c.delai > 45 ? "var(--lq-color-down)" : "var(--lq-color-accent)"}
                fillOpacity={survol === null || survol === i ? 0.85 : 0.35}
                onPointerEnter={() => setSurvol(i)}
                onPointerLeave={() => setSurvol(null)}
              />
            ))}
          </g>
        </svg>
      ) : null}
      <ChartTooltip
        visible={point !== null}
        x={point ? marge.left + x(point.montant) : 0}
        y={point ? marge.top + y(point.delai) : 0}
      >
        {point ? (
          <div className="rdk-stack rdk-stack--tight">
            <strong>{point.client}</strong>
            <span>{kEuros(point.montant)} facturés</span>
            <span>payé en {point.delai} jours en moyenne</span>
          </div>
        ) : null}
      </ChartTooltip>
    </div>
  );
}

/** `Heatmap` dessine à la largeur qu'on lui donne : on lui passe celle de son spécimen. */
function HeatmapPleineLargeur() {
  const [ref, largeur] = useLargeur<HTMLDivElement>();
  return (
    <div ref={ref} className="rdk-chart-host">
      {largeur > 0 ? <Heatmap groups={PORTEFEUILLE_SECTEURS} width={largeur} height={420} /> : null}
    </div>
  );
}

/**
 * La planche des graphiques : chaque graphique générique du kit, sur des données de pilotage.
 *
 * Aucun ne reçoit de couleur de la vitrine — les séries tournent sur la palette catégorielle du kit,
 * que la couche de thème redéfinit — sauf là où la couleur porte un sens (seuils de jauge, points
 * en retard du nuage), et alors par variable. Si un graphique sort ici avec une teinte étrangère au
 * thème, c'est qu'elle est écrite en dur dans le kit.
 */
export function Charts() {
  return (
    <SpecimenScreen
      title="Graphiques"
      intro="Les graphiques génériques du kit — courbes, barres, anneaux, jauges, cascades, cartes de chaleur, matrices, flux — sur des données de pilotage fictives."
    >
      <SpecimenGrid>
        <Specimen
          name="LineAreaChart"
          wide
          description="Courbes à aires sur un axe temporel : molette pour zoomer, glisser pour se déplacer, la légende masque une série. La bulle de survol est un ChartTooltip."
        >
          <LineAreaChart series={CA_CHARGES} area height={300} xType="time" formatX={moisAnnee} formatY={kEuros} />
        </Specimen>

        <Specimen
          name="LineAreaChart"
          wide
          description="Prévision : une série en tirets avec son éventail de scénarios (band), et une ligne de référence au seuil de trésorerie."
        >
          <LineAreaChart
            series={TRESORERIE}
            height={260}
            xType="time"
            formatX={moisAnnee}
            formatY={kEuros}
            referenceLineY={SEUIL_TRESORERIE}
            zoomable={false}
          />
        </Specimen>

        <Specimen name="BarChart" description="Barres groupées : un canal de vente par catégorie, une barre par exercice.">
          <BarChart data={VENTES_CANAL} series={VENTES_SERIES} height={280} formatValue={kEuros} zoomable={false} />
        </Specimen>

        <Specimen name="BarChart" description="Horizontal, valeurs écrites au bout des barres : les huit premiers clients.">
          <BarChart
            data={TOP_CLIENTS}
            orientation="horizontal"
            height={280}
            formatValue={kEuros}
            showValueLabels
            zoomable={false}
            margin={{ left: 130, right: 64 }}
          />
        </Specimen>

        <Specimen
          name="BarChart"
          wide
          description="colorByValue : l'écart mensuel au budget, en teinte de hausse ou de baisse selon son signe."
        >
          <BarChart data={ECART_BUDGET} height={220} formatValue={kEurosSigne} colorByValue zoomable={false} />
        </Specimen>

        <Specimen name="DonutChart" description="Anneau avec légende à droite ; survoler une part remplace le total du centre.">
          <DonutChart data={CA_PAR_GAMME} size={200} formatValue={kEuros} legendPosition="right" centerCaption="CA annuel" />
        </Specimen>

        <Specimen name="DonutChart" description="La variante carrée, et un centre imposé (nombre de factures plutôt qu'une somme).">
          <DonutChart
            data={MOYENS_PAIEMENT}
            size={200}
            shape="square"
            legendPosition="right"
            centerValue="833"
            centerCaption="Factures"
            formatValue={(v) => nombre(v)}
          />
        </Specimen>

        <Specimen name="GaugeChart" description="Demi-cadran à aiguille ; à gauche des bandes de seuil nommées, à droite la piste seule.">
          <div className="rdk-wrap">
            <GaugeChart
              value={78}
              label="Objectif annuel"
              size={170}
              formatValue={(v) => `${v} %`}
              thresholds={[
                { upTo: 50, color: "var(--lq-color-down)", label: "Retard" },
                { upTo: 80, color: "var(--lq-color-warning)", label: "À suivre" },
                { upTo: 100, color: "var(--lq-color-up)", label: "Atteint" },
              ]}
              showBandLabels
            />
            <GaugeChart value={64} label="Charge des serveurs" size={150} formatValue={(v) => `${v} %`} />
          </div>
        </Specimen>

        <Specimen name="Sparkline" description="Tendance sans axe, pour une cellule ou une tuile : simple, à aire, colorée selon le sens.">
          <div className="rdk-kpi-list">
            {KPI_TENDANCES.map((k, i) => (
              <div key={k.id} className="rdk-kpi-list__row">
                <Text size="sm" muted>
                  {k.label}
                </Text>
                <Text size="sm">{k.value}</Text>
                <Sparkline data={k.data} width={140} height={32} area={i % 2 === 1} colorByTrend={i < 2} />
              </div>
            ))}
          </div>
        </Specimen>

        <Specimen
          name="DeltaChart"
          wide
          description="Cascade : du chiffre d'affaires au résultat net, chaque sous-total repart de zéro, les pointillés relient les marches."
        >
          <DeltaChart items={PONT_RESULTAT} height={300} formatValue={kEuros} zoomable={false} />
        </Specimen>

        <Specimen
          name="Heatmap"
          wide
          description="Carte de chaleur d'un portefeuille : la surface d'une tuile est son poids, sa couleur la séance du jour. Cliquer un secteur zoome dessus."
        >
          <HeatmapPleineLargeur />
        </Specimen>

        <Specimen
          name="MatrixChart"
          wide
          description="Matrice de corrélation : la teinte dit le sens, l'intensité la force. Cliquer une case ouvre son détail sous la grille."
        >
          <MatrixChart rows={ACTIFS} columns={ACTIFS} cells={CORRELATIONS} showValues formatValue={(v) => nombre(v, 2)} height={380} />
        </Specimen>

        <Specimen
          name="SankeyChart"
          wide
          description="Flux du budget, des produits jusqu'à leur emploi. La molette ajoute du détail aux libellés ; cliquer un nœud cadre sa branche."
        >
          <SankeyChart nodes={BUDGET_NODES} links={BUDGET_LINKS} height={440} align="left" formatValue={kEuros} />
        </Specimen>

        <Specimen
          name="ChartAxis · ChartTooltip"
          description="Les deux briques pour composer son propre graphique : axes d3 et bulle qui se recale dans le tracé. Ici, délai de paiement selon le montant facturé."
        >
          <NuageDelais />
        </Specimen>
      </SpecimenGrid>
    </SpecimenScreen>
  );
}
