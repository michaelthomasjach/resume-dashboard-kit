import { useMemo, useState } from "react";
import {
  CandlestickChart,
  SeasonalityView,
  computeSeasonality,
  WorldExposureMap,
  AlertsPanel,
  ChartEventTooltip,
  ChartWorkspace,
  BarChart,
  Button,
  type AiSend,
  type ChartAlert,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { Specimen, SpecimenGrid, SpecimenScreen } from "../../Specimen";
import {
  BOUGIES_NOVA,
  BOUGIES_KAPA,
  EVENEMENTS_NOVA,
  EVENEMENTS_EMPILES,
  ALERTES_NOVA,
  EXPOSITION_MONDE,
  LISTES_SURVEILLANCE,
  MOIS_COURTS,
} from "../../chartData";

const euros = (v: number) => v.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pourcent = (v: number) => `${v > 0 ? "+" : ""}${v.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;
const dateCourte = (d: Date) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

/**
 * Le transport de l'assistant, en version vitrine : il ne contacte aucun modèle et répond toujours
 * la même chose, mot à mot, pour que le panneau se voie vivre. Le vrai se branche sur `ai.send` —
 * une route de son propre serveur qui tient la clé —, ou sur `anthropicSend` avec une clé, ce
 * qu'une page publique ne doit pas faire.
 */
const assistantDeDemo: AiSend = async function* (_request, signal) {
  const reponse =
    "Ceci est une réponse de démonstration : la vitrine ne contacte aucun modèle et n'a aucune clé. " +
    "Dans une application, ce panneau est branché sur votre propre serveur (`ai.send`) et l'assistant " +
    "peut alors ajouter des indicateurs, tracer, écrire un script ou lire un backtest sur le graphique au premier plan.";
  for (const mot of reponse.split(/(?<= )/)) {
    if (signal.aborted) return;
    await new Promise((r) => setTimeout(r, 18));
    yield { type: "text_delta", text: mot };
  }
  yield { type: "done", stopReason: "end_turn" };
};

/**
 * La planche des graphiques de marché : le graphique en chandeliers et tout ce qui gravite autour —
 * saisonnalité, alertes, évènements, exposition, et l'espace de travail multi-panneaux.
 *
 * Les cours sont fictifs (Novaterra, Kapalia) mais tirés d'une graine : sept ans de séances pour que
 * la saisonnalité ait des années à comparer. Aucun appel réseau : l'assistant de l'espace de
 * travail répond depuis la page elle-même, sans clé.
 */
export function MarketCharts() {
  const [alertes, setAlertes] = useState<ChartAlert[]>(ALERTES_NOVA);
  const supprimer = (id: string) => setAlertes((a) => a.filter((x) => x.id !== id));
  const [infobulle, setInfobulle] = useState<"popover" | "modal" | null>("popover");

  const saisonMensuelle = useMemo(
    () =>
      computeSeasonality(BOUGIES_NOVA, "month", [2026]).buckets
        .filter((b) => b.index >= 0)
        .map((b) => ({ id: `m${b.index}`, label: MOIS_COURTS[b.index], value: Math.round(b.average * 10) / 10 })),
    [],
  );

  return (
    <SpecimenScreen
      title="Graphiques de marché"
      intro="Chandeliers, saisonnalité, alertes, évènements, exposition géographique et espace de travail — sur des cours fictifs générés de façon reproductible."
    >
      <SpecimenGrid>
        <Specimen
          name="CandlestickChart"
          wide
          description="Chandeliers avec volume, évènements en pied de graphique (R, D, AG — cliquer pour le détail), outils de tracé, indicateurs et bouton de saisonnalité. Molette pour zoomer."
        >
          <CandlestickChart
            data={BOUGIES_NOVA}
            symbol="NOVA"
            height={460}
            showVolume
            zoomable
            drawingTools
            showIndicators
            seasonality
            events={EVENEMENTS_NOVA}
            initialVisibleCandles={180}
            formatPrice={euros}
            formatDate={dateCourte}
            fullscreenToggle
          />
        </Specimen>

        <Specimen
          name="SeasonalityView"
          wide
          description="La saisonnalité de NOVA sur sept ans : le parcours de l'année en cours contre la moyenne des précédentes. Le rail de gauche choisit la granularité et les années."
        >
          <SeasonalityView data={BOUGIES_NOVA} symbol="NOVA" height={320} onBack={() => undefined} />
        </Specimen>

        <Specimen
          name="computeSeasonality"
          description="Le calcul seul, sans la vue : parcours moyen cumulé de NOVA à la fin de chaque mois, années 2019 à 2025 (l'année en cours exclue), rendu ici par un BarChart."
        >
          <BarChart data={saisonMensuelle} height={240} formatValue={pourcent} colorByValue zoomable={false} />
        </Specimen>

        <Specimen
          name="WorldExposureMap"
          description="Exposition géographique d'un portefeuille : chaque région teintée selon sa part. « Global » ne se localise pas et part dans la note sous la légende."
        >
          <WorldExposureMap data={EXPOSITION_MONDE} width={520} height={280} formatValue={(v) => `${v} %`} />
        </Specimen>

        <Specimen name="AlertsPanel" description="La liste des alertes posées sur le graphique ; la corbeille en supprime une.">
          <AlertsPanel alerts={alertes} onDeleteAlert={supprimer} emptyMessage="Plus aucune alerte sur NOVA." />
          {alertes.length < ALERTES_NOVA.length ? (
            <div>
              <Button onClick={() => setAlertes(ALERTES_NOVA)}>
                Rétablir les alertes
              </Button>
            </div>
          ) : null}
        </Specimen>

        <Specimen
          name="ChartEventTooltip"
          description="L'infobulle d'un repère d'évènement, montrée seule : deux évènements sur le même repère. Cliquer une carte l'agrandit à tout le cadre."
        >
          <div className="rdk-chart-host rdk-chart-host--events">
            {infobulle ? (
              <ChartEventTooltip
                events={EVENEMENTS_EMPILES}
                mode={infobulle}
                left={16}
                bottom={16}
                formatDate={dateCourte}
                onExpand={() => setInfobulle("modal")}
                onClose={() => setInfobulle(null)}
              />
            ) : (
              <Button onClick={() => setInfobulle("popover")}>
                Rouvrir l'infobulle
              </Button>
            )}
          </div>
        </Specimen>

        <Specimen
          name="ChartWorkspace"
          wide
          description="Deux panneaux synchronisables, la liste de surveillance et les alertes à droite, l'éditeur de scripts et l'assistant sur le rail. L'assistant répond ici une phrase de démonstration, sans clé ni réseau."
        >
          <ChartWorkspace
            defaultPanels={2}
            panelHeight={440}
            layout="desktop"
            watchlists={LISTES_SURVEILLANCE}
            alerts={<AlertsPanel alerts={alertes} onDeleteAlert={supprimer} />}
            scripting
            ai={{ send: assistantDeDemo }}
          >
            {[
              <CandlestickChart key="nova" data={BOUGIES_NOVA} symbol="NOVA" zoomable initialVisibleCandles={120} formatPrice={euros} formatDate={dateCourte} />,
              <CandlestickChart key="kapa" data={BOUGIES_KAPA} symbol="KAPA" zoomable initialVisibleCandles={120} formatPrice={euros} formatDate={dateCourte} />,
            ]}
          </ChartWorkspace>
        </Specimen>
      </SpecimenGrid>
    </SpecimenScreen>
  );
}
