import { useState } from "react";
import { Text } from "@michaelthomasjach/liseuse-dashboard-kit";
import {
  DateInput,
  DatePicker,
  DateRangePicker,
  DateTimePicker,
  RangeSlider,
  Slider,
  type DateRange,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { Specimen, SpecimenGrid, SpecimenScreen } from "../../Specimen";

const jour = (d: Date | null) => (d ? d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "—");
const euro = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const signe = (n: number) => `${n > 0 ? "+" : ""}${n} %`;
const pourcent = (n: number) => `${n} %`;
const decibels = (n: number) => `${n > 0 ? "+" : ""}${n} dB`;

const AUJOURD_HUI = new Date(2026, 9, 31);

/**
 * La planche des dates et des curseurs : saisir un jour, une période, un instant, ou un intervalle
 * de valeurs.
 *
 * Les sélecteurs à calendrier s'ouvrent dans le même panneau flottant que `Select` ; ils sont
 * montrés ici sur des cas de tableau de bord — une échéance, une période de rapport, un envoi
 * programmé — avec, sous chacun, la valeur que l'application reçoit réellement.
 */
export function DatesSliders() {
  const [naissance, setNaissance] = useState("14031987");
  const [echeance, setEcheance] = useState<Date | null>(new Date(2026, 10, 15));
  const [cloture, setCloture] = useState<Date | null>(null);
  const [periode, setPeriode] = useState<DateRange>({ start: new Date(2026, 9, 1), end: new Date(2026, 9, 31) });
  const [envoi, setEnvoi] = useState<Date | null>(new Date(2026, 10, 3, 8, 30));
  const [montant, setMontant] = useState<[number, number]>([500, 4500]);
  const [variation, setVariation] = useState<[number, number]>([-15, 25]);
  const [anciennete, setAnciennete] = useState<[number, number]>([2, 8]);
  const [volume, setVolume] = useState(60);
  const [remise, setRemise] = useState(15);
  const [seuil, setSeuil] = useState(80);
  const [aigus, setAigus] = useState(4);
  const [graves, setGraves] = useState(-2);
  const [actions, setActions] = useState<[number, number]>([25, 75]);
  const [budget, setBudget] = useState<[number, number]>([1200, 3400]);
  const [plage, setPlage] = useState<[number, number]>([30, 60]);

  return (
    <SpecimenScreen
      title="Dates et curseurs"
      intro="Saisie de dates au clavier ou au calendrier, périodes, horodatages, et curseurs à une ou deux poignées."
    >
      <SpecimenGrid>
        <Specimen name="DateInput" description="La date tapée au clavier, au format jj/mm/aaaa — sans calendrier.">
          <DateInput
            label="Date de naissance du gérant"
            value={naissance}
            onChange={setNaissance}
            error={naissance.length > 0 && naissance.length < 8 ? "Date incomplète." : undefined}
            helperText="Chiffres seulement : les barres se placent seules."
          />
          <Text size="sm" muted>
            Valeur stockée : {naissance || "—"}
          </Text>
        </Specimen>

        <Specimen name="DatePicker" description="Un jour au calendrier, bornable ; l'en-tête du mois remonte aux mois puis aux années.">
          <DatePicker label="Échéance de paiement" value={echeance} onChange={setEcheance} minDate={AUJOURD_HUI} />
          <DatePicker
            label="Date de clôture"
            value={cloture}
            onChange={setCloture}
            placeholder="Choisir une date"
            error={cloture ? undefined : "Requise pour archiver le dossier."}
          />
          <DatePicker label="Créé le" value={new Date(2024, 2, 12)} onChange={() => {}} disabled size="small" />
          <Text size="sm" muted>
            Échéance : {jour(echeance)}
          </Text>
        </Specimen>

        <Specimen name="DateRangePicker" description="Une période en deux clics : le début, puis la fin, avec l'aperçu au survol.">
          <DateRangePicker label="Période du rapport" value={periode} onChange={setPeriode} maxDate={AUJOURD_HUI} />
          <Text size="sm" muted>
            Du {jour(periode.start)} au {jour(periode.end)}
          </Text>
        </Specimen>

        <Specimen name="DateTimePicker" description="Un jour et une heure — un envoi programmé, une maintenance.">
          <DateTimePicker label="Envoi de la campagne" value={envoi} onChange={setEnvoi} minDate={AUJOURD_HUI} minuteStep={30} />
          <Text size="sm" muted>
            Programmé le {jour(envoi)} à{" "}
            {envoi ? envoi.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "—"}
          </Text>
        </Specimen>

        <Specimen name="RangeSlider" description="Un intervalle à deux poignées — on tire une poignée, ou la bande entière." wide>
          <div className="rdk-grid rdk-grid--sliders">
            <RangeSlider
              label="Montant de commande"
              min={0}
              max={10000}
              step={100}
              value={montant}
              onChange={setMontant}
              formatValue={euro}
            />
            <RangeSlider
              label="Variation sur 30 jours"
              min={-50}
              max={50}
              step={1}
              value={variation}
              onChange={setVariation}
              formatValue={signe}
              centerZero
            />
            <RangeSlider
              label="Ancienneté du client (ans)"
              min={0}
              max={20}
              value={anciennete}
              onChange={setAnciennete}
              disabled
            />
          </div>
        </Specimen>

        <Specimen name="Slider" description="Une valeur à une poignée : bulle au survol, graduations nommées, tons, et la même chose à la verticale.">
          <Slider label="Volume des alertes" value={volume} onChange={setVolume} formatValue={pourcent} />
          <Slider
            label="Remise accordée"
            min={0}
            max={30}
            step={5}
            value={remise}
            onChange={setRemise}
            marks={[0, 10, 20, 30].map((v) => ({ value: v, label: pourcent(v) }))}
            showValue="always"
            formatValue={pourcent}
            tone="success"
          />
          <Slider label="Seuil d'alerte de stock" value={seuil} onChange={setSeuil} step={10} marks tone="danger" formatValue={pourcent} />
          <Slider label="Ancienneté minimale (ans)" min={0} max={10} defaultValue={3} disabled />
          <div className="rdk-wrap rdk-wrap--sliders">
            <Slider orientation="vertical" height={140} label="Aigus" min={-12} max={12} value={aigus} onChange={setAigus} formatValue={decibels} tone="info" />
            <Slider orientation="vertical" height={140} label="Graves" min={-12} max={12} value={graves} onChange={setGraves} formatValue={decibels} tone="warning" />
          </div>
        </Specimen>

        <Specimen name="RangeSlider" description="Les options partagées avec Slider : graduations nommées, bulles permanentes ou au survol, tons, orientation verticale.">
          <RangeSlider
            label="Part en actions"
            min={0}
            max={100}
            step={5}
            value={actions}
            onChange={setActions}
            formatValue={pourcent}
            marks={[0, 25, 50, 75, 100].map((v) => ({ value: v, label: pourcent(v) }))}
          />
          <RangeSlider label="Budget" min={0} max={5000} step={100} value={budget} onChange={setBudget} showValue="always" formatValue={euro} tone="info" />
          <div className="rdk-wrap rdk-wrap--sliders">
            <RangeSlider
              orientation="vertical"
              height={140}
              label="Heures creuses"
              min={0}
              max={100}
              value={plage}
              onChange={setPlage}
              showValue="auto"
              formatValue={pourcent}
              tone="success"
            />
          </div>
        </Specimen>
      </SpecimenGrid>
    </SpecimenScreen>
  );
}
