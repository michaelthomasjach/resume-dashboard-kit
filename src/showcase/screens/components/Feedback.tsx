import { useState } from "react";
import { Button, Text } from "@michaelthomasjach/liseuse-dashboard-kit";
import {
  Spinner,
  Skeleton,
  ProgressBar,
  ProgressCircle,
  Stepper,
  GuidedTour,
  AlertList,
  SparkleIcon,
  type AlertListItem,
  type GuidedTourStep,
  type StepperStep,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { Specimen, SpecimenGrid, SpecimenScreen } from "../../Specimen";

const ETAPES_IMPORT: StepperStep[] = [
  { id: "fichier", label: "Fichier" },
  { id: "colonnes", label: "Colonnes" },
  { id: "controle", label: "Contrôle" },
  { id: "import", label: "Import" },
];

const ETAPES_COMMANDE: StepperStep[] = [
  { id: "recue", label: <Text size="sm">Commande reçue · 28 oct.</Text> },
  { id: "preparee", label: <Text size="sm">Préparée · 29 oct.</Text> },
  { id: "expediee", label: <Text size="sm">Expédiée · 30 oct.</Text> },
  { id: "livree", label: <Text size="sm">Livraison prévue · 2 nov.</Text> },
];

const ALERTES: AlertListItem[] = [
  { id: "stock", level: "warning", message: "Stock bas sur « Câble USB-C 2 m » : 14 unités, seuil 50.", action: <Button>Commander</Button> },
  { id: "info", level: "info", message: "La synchronisation comptable de cette nuit s'est terminée à 03:12." },
  { id: "paiement", level: "critical", message: "3 factures sont impayées depuis plus de 60 jours.", action: <Button>Relancer</Button> },
  { id: "certif", level: "warning", message: "Le certificat de signature expire dans 9 jours." },
];

const VISITE: GuidedTourStep[] = [
  {
    id: "accueil",
    title: "Bienvenue sur la planche « Retours »",
    body: "Une visite en quatre étapes des indicateurs que le kit fournit pour dire à l'utilisateur ce qui se passe.",
    media: <SparkleIcon size={22} />,
  },
  { id: "chargement", selector: "[data-tour='retours-chargement']", title: "Le chargement", body: "Un anneau quand on ignore la durée, des blocs pulsés quand on connaît déjà la forme du contenu." },
  { id: "progression", selector: "[data-tour='retours-progression']", title: "La progression", body: "Une barre déterminée, indéterminée, ou découpée en parts d'un tout." },
  { id: "alertes", selector: "[data-tour='retours-alertes']", title: "Les alertes", body: "Ce qui reste tant que la situation dure — les critiques d'abord.", placement: "above" },
];

/**
 * La planche des retours : tout ce qui dit à l'utilisateur où en est l'application.
 *
 * Chargement indéfini ou à forme connue, progression, étapes d'un parcours, alertes persistantes —
 * et la visite guidée, qu'un bouton lance sur cette planche même pour la montrer en situation : sa
 * carte se pose à côté des spécimens qu'elle présente.
 */
export function Feedback() {
  const [chargement, setChargement] = useState(true);
  const [avancement, setAvancement] = useState(64);
  const [etape, setEtape] = useState(2);
  const [visite, setVisite] = useState(false);
  const [alertes, setAlertes] = useState(ALERTES);

  return (
    <SpecimenScreen
      title="Retours"
      intro="Chargements, progression, étapes, alertes et visite guidée — ce qui dit où en est l'application."
    >
      <div className="rdk-row">
        <Button onClick={() => setVisite(true)} icon={<SparkleIcon size={16} />}>
          Lancer la visite guidée
        </Button>
      </div>

      <SpecimenGrid>
        <Specimen name="Spinner" description="L'anneau indéterminé, à plusieurs tailles, avec ou sans libellé.">
          <div className="rdk-wrap" data-tour="retours-chargement">
            <Spinner size={16} label="Chargement" />
            <Spinner size={24} label="Chargement" />
            <Spinner size={40} label="Chargement des commandes" />
            <div className="rdk-row">
              <Spinner size={16} />
              <Text size="sm" muted>
                Synchronisation en cours…
              </Text>
            </div>
          </div>
        </Specimen>

        <Specimen name="Skeleton" description="La forme du contenu à venir, le temps qu'il arrive.">
          {chargement ? (
            <div className="rdk-stack">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rdk-row">
                  <Skeleton circle width={36} height={36} />
                  <div className="rdk-stack rdk-stack--tight rdk-grow">
                    <Skeleton width="60%" height={12} />
                    <Skeleton width="35%" height={10} />
                  </div>
                  <Skeleton width={64} height={20} />
                </div>
              ))}
            </div>
          ) : (
            <Text size="sm">Lemoine SAS · Atelier Roux · Berthier &amp; Fils — chargés.</Text>
          )}
          <div className="rdk-row">
            <Button onClick={() => setChargement((c) => !c)}>{chargement ? "Terminer le chargement" : "Recharger"}</Button>
          </div>
        </Specimen>

        <Specimen name="ProgressBar" description="Déterminée, indéterminée, ou découpée en parts — le libellé et la valeur se placent librement.">
          <div className="rdk-stack" data-tour="retours-progression">
            <ProgressBar value={avancement} label="Import des contacts" showValue formatValue={(v) => `${v} %`} />
            <ProgressBar
              value={82}
              label="Stockage utilisé"
              labelPosition="left"
              showValue
              valuePosition="right"
              formatValue={(v) => `${Math.round((v / 100) * 50)} Go / 50 Go`}
            />
            <ProgressBar value={avancement} label={`${avancement} %`} labelPosition="inside" thickness={18} />
            <ProgressBar label="Préparation de l'export…" />
            <ProgressBar
              label="Répartition du chiffre d'affaires par canal"
              thickness={10}
              segments={[
                { id: "web", value: 54, label: "Site", color: "var(--lq-color-accent)" },
                { id: "mobile", value: 26, label: "Application", color: "var(--lq-color-sky)" },
                { id: "revendeur", value: 14, label: "Revendeurs", color: "var(--lq-color-violet)" },
                { id: "autre", value: 6, label: "Autres", color: "var(--lq-color-text-muted)" },
              ]}
            />
            <div className="rdk-row">
              <Button onClick={() => setAvancement((v) => Math.max(0, v - 10))}>− 10 %</Button>
              <Button onClick={() => setAvancement((v) => Math.min(100, v + 10))}>+ 10 %</Button>
            </div>
          </div>
        </Specimen>

        <Specimen name="ProgressCircle" description="La progression en anneau : trois tailles nommées ou des pixels, la valeur au centre, les tons ; sans valeur, il tourne.">
          <div className="rdk-wrap rdk-wrap--baseline">
            <ProgressCircle value={avancement} size="lg" showValue label="Import des contacts" />
            <ProgressCircle value={82} size="md" tone="success" showValue label="Objectif trimestriel" />
            <ProgressCircle value={35} size="md" tone="warning" showValue label="Quota d'envoi" />
            <ProgressCircle value={92} size="md" tone="danger" showValue label="Stockage" />
            <ProgressCircle value={58} size="sm" tone="info" label="Synchronisation" />
            <ProgressCircle size="sm" label="Chargement" />
          </div>
          <div className="rdk-wrap rdk-wrap--baseline">
            <ProgressCircle
              value={avancement}
              size={120}
              thickness={10}
              showValue
              formatValue={(v) => `${Math.round((v / 100) * 340)}`}
              label="Fiches importées sur 340"
            />
            <ProgressCircle value={avancement} size={72} tone="dark" showValue label="Avancement" />
          </div>
        </Specimen>

        <Specimen name="Stepper"description="Les étapes d'un parcours : l'étape courante pleine, le passé atténué, l'avenir plus encore.">
          <Stepper steps={ETAPES_IMPORT} active={etape} />
          <div className="rdk-row">
            <Button onClick={() => setEtape((e) => Math.max(0, e - 1))} disabled={etape === 0}>
              Précédente
            </Button>
            <Button onClick={() => setEtape((e) => Math.min(ETAPES_IMPORT.length, e + 1))} disabled={etape === ETAPES_IMPORT.length}>
              {etape >= ETAPES_IMPORT.length - 1 ? "Terminer" : "Suivante"}
            </Button>
          </div>
          <Stepper steps={ETAPES_COMMANDE} active={2} orientation="vertical" stepSize={40} />
        </Specimen>

        <Specimen name="GuidedTour" description="Une carte qui se déplace d'un élément à l'autre de l'écran pour le présenter.">
          <Text size="sm">
            La visite se lance depuis le bouton en tête de planche. Elle commence au centre, puis se pose à côté des
            spécimens Spinner, ProgressBar et AlertList. Échap la ferme, les flèches passent d'une étape à l'autre.
          </Text>
          <div className="rdk-row">
            <Button onClick={() => setVisite(true)}>Lancer la visite</Button>
          </div>
          <GuidedTour
            open={visite}
            steps={VISITE}
            onClose={() => setVisite(false)}
            labels={{ next: "Suivant", previous: "Précédent", finish: "Terminer", skip: "Passer la visite", close: "Fermer" }}
          />
        </Specimen>

        <Specimen name="AlertList" description="Des alertes dans la page, triées par gravité — normale, compacte, et vide." wide>
          <div className="rdk-grid rdk-grid--alerts" data-tour="retours-alertes">
            <div className="rdk-stack">
              <AlertList alerts={alertes} emptyText={<Text size="sm" muted>Aucune alerte en cours.</Text>} />
              <div className="rdk-row">
                <Button onClick={() => setAlertes((a) => a.slice(1))} disabled={alertes.length === 0}>
                  Résoudre la première
                </Button>
                <Button onClick={() => setAlertes(ALERTES)}>Rétablir</Button>
              </div>
            </div>
            <AlertList
              compact
              alerts={[
                { id: "quai", level: "critical", message: "Quai 3 saturé." },
                { id: "retard", level: "warning", message: "2 livraisons en retard." },
                { id: "maj", level: "info", message: "Mise à jour prévue dimanche." },
              ]}
            />
          </div>
        </Specimen>
      </SpecimenGrid>
    </SpecimenScreen>
  );
}
