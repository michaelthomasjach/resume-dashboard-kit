import { useState, type ReactNode } from "react";
import {
  AnalogClock,
  Button,
  ClockWidget,
  DayTimelineWidget,
  DemandMeters,
  EnergyWidget,
  LightDetailModal,
  LightsWidget,
  MusicPlayerWidget,
  ShuttersWidget,
  WeatherWidget,
  BatteryIcon,
  BedIcon,
  BoltIcon,
  BoxesIcon,
  CloudIcon,
  CloudRainIcon,
  GaugeIcon,
  HomeIcon,
  LayersIcon,
  LogoutIcon,
  MoonIcon,
  PartlyCloudyIcon,
  PlugIcon,
  SnowflakeIcon,
  SolarPanelIcon,
  SunIcon,
  SunriseIcon,
  SunsetIcon,
  WindIcon,
  type DemandMeter,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { Specimen, SpecimenGrid, SpecimenScreen } from "../../Specimen";
import { DEMAND, FORECAST, LIGHT_COLORS, LIGHTS, SHUTTERS, WHITE_BALANCES } from "../../widgetData";

const SKY: Record<(typeof FORECAST)[number]["sky"], ReactNode> = {
  sun: <SunIcon size={20} />,
  partly: <PartlyCloudyIcon size={20} />,
  cloud: <CloudIcon size={20} />,
  rain: <CloudRainIcon size={20} />,
};

const DEMAND_ICONS: Record<string, ReactNode> = {
  cpu: <GaugeIcon />,
  memoire: <LayersIcon />,
  stockage: <BoxesIcon />,
  reseau: <BoltIcon />,
  froid: <SnowflakeIcon />,
};

/** Le ton qu'on donne à une demande : ça va, ça tire, ça déborde. */
const toneOf = (v: number): DemandMeter["tone"] => (v > 1 ? "critical" : v > 0.8 ? "warning" : v < 0.35 ? "good" : "neutral");

const TRACKS = [
  { title: "La Javanaise", artist: "Serge Gainsbourg · Confidentiel" },
  { title: "Le Tourbillon", artist: "Jeanne Moreau · Jules et Jim" },
  { title: "La Mer", artist: "Charles Trenet · La Mer" },
];

const METERS: DemandMeter[] = DEMAND.map((d) => ({ ...d, icon: DEMAND_ICONS[d.id], tone: toneOf(d.value) }));

/**
 * Les widgets de la maison connectée : horloges, météo, musique, volets, lumières, énergie.
 *
 * Ils ont été dessinés pour un écran mural et non pour un tableau d'administration — c'est
 * justement pourquoi ils sont ici : s'ils tiennent dans le thème sans une règle de plus, c'est que
 * leurs couleurs et leurs rayons passent bien par les variables. Volets et lumières sont vivants ;
 * une rangée de lumières, ou le bouton du spécimen, ouvre la fiche de réglage.
 */
export function HomeWidgets() {
  const [shutters, setShutters] = useState(SHUTTERS);
  const [lights, setLights] = useState(LIGHTS);
  const [openLightId, setOpenLightId] = useState<string | null>(null);
  const [whiteBalance, setWhiteBalance] = useState("chaud");
  const [color, setColor] = useState<string | undefined>(undefined);
  const [playing, setPlaying] = useState(true);
  const [track, setTrack] = useState(0);
  const activeLight = lights.find((l) => l.id === openLightId) ?? null;
  const current = TRACKS[track];

  const setShutter = (id: string, on: boolean) =>
    setShutters((prev) => prev.map((s) => (s.id === id ? { ...s, on, level: on ? 100 : 0, statusText: on ? "ouvert" : "fermé" } : s)));

  const setLight = (id: string, on: boolean) =>
    setLights((prev) =>
      prev.map((l) => (l.id === id ? { ...l, on, level: on ? Math.max(l.level ?? 0, 60) : 0, statusText: on ? `${Math.max(l.level ?? 0, 60)} %` : "éteint" } : l))
    );

  const onCount = lights.filter((l) => l.on).length;
  const openCount = shutters.filter((s) => s.on).length;

  return (
    <SpecimenScreen
      title="Widgets maison"
      intro="Horloges, météo, musique, volets, lumières et énergie — les panneaux d'un écran domotique, dans la peau du thème."
    >
      <SpecimenGrid>
        <Specimen name="ClockWidget" description="L'heure et la date, déjà formatées par l'appelant ; le deux-points bat la seconde.">
          <ClockWidget
            time="09:34"
            date="vendredi 30 octobre"
            icon={<SunIcon />}
            presence={
              <span className="rdk-row">
                <HomeIcon size={14} /> Claire est à la maison
              </span>
            }
          />
          <ClockWidget time="23:47" date="vendredi 30 octobre" icon={<MoonIcon />} blinkColon={false} />
        </Specimen>

        <Specimen name="AnalogClock" description="Une horloge à aiguilles qui prend des secondes : l'heure du jour, ou le temps d'une simulation.">
          <div className="rdk-wrap">
            <AnalogClock seconds={9 * 3600 + 34 * 60} night={false} />
            <AnalogClock seconds={23 * 3600 + 47 * 60} night size={44} />
            <AnalogClock seconds={2 * 86400 + 14 * 3600 + 5 * 60} size={56} day={3} caption="trafic dense" />
            <AnalogClock seconds={17 * 3600 + 20 * 60} size={40} showDigital={false} />
          </div>
        </Specimen>

        <Specimen name="WeatherWidget" description="Les conditions du moment, une vigilance et la prévision à cinq jours.">
          <WeatherWidget
            icon={<PartlyCloudyIcon animated />}
            temperature="12"
            condition="Partiellement nuageux"
            min="7"
            max="14"
            precipitation="20 %"
            alert={{ icon: <WindIcon size={16} />, label: "Vigilance jaune — Vent" }}
            forecastTitle="Prévision 5 jours"
            forecast={FORECAST.map((f) => ({ id: f.id, label: f.label, icon: SKY[f.sky], max: f.max, min: f.min }))}
          />
        </Specimen>

        <Specimen name="DayTimelineWidget" description="Les jalons de la journée, chacun un bouton.">
          <DayTimelineWidget
            items={[
              { id: "matin", icon: <SunriseIcon />, label: "Matin" },
              { id: "journee", icon: <SunIcon />, label: "Journée" },
              { id: "soir", icon: <SunsetIcon />, label: "Soirée" },
              { id: "nuit", icon: <BedIcon />, label: "Nuit" },
              { id: "depart", icon: <LogoutIcon />, label: "Départ" },
            ]}
          />
        </Specimen>

        <Specimen name="MusicPlayerWidget" description="Le morceau en cours et ses commandes ; sans pochette, un repli.">
          <MusicPlayerWidget
            coverFallback={<span aria-hidden="true">♪</span>}
            title={current.title}
            artist={current.artist}
            isPlaying={playing}
            onPlayPause={() => setPlaying((p) => !p)}
            onPrev={() => setTrack((t) => (t + TRACKS.length - 1) % TRACKS.length)}
            onNext={() => setTrack((t) => (t + 1) % TRACKS.length)}
            volume={35}
          />
        </Specimen>

        <Specimen name="ShuttersWidget" description="Une rangée par volet : interrupteur, ouverture, état. Les interrupteurs répondent.">
          <ShuttersWidget
            meta={`${openCount} ouvert${openCount > 1 ? "s" : ""}`}
            shutters={shutters.map((s) => ({ ...s, onToggle: (on: boolean) => setShutter(s.id, on) }))}
          />
        </Specimen>

        <Specimen name="LightsWidget" description="Les lumières : interrupteur, intensité, et une rangée qui ouvre la fiche de la lampe.">
          <LightsWidget
            meta={`${onCount} allumée${onCount > 1 ? "s" : ""}`}
            lights={lights.map((l) => ({ ...l, onToggle: (on: boolean) => setLight(l.id, on), onClick: () => setOpenLightId(l.id) }))}
          />
        </Specimen>

        <Specimen name="LightDetailModal" description="La fiche d'une lampe : marche, température de blanc et couleur.">
          <div className="rdk-wrap">
            <Button onClick={() => setOpenLightId("cuisine")}>Régler la lampe de la cuisine</Button>
          </div>
          {activeLight ? (
            <LightDetailModal
              open
              onClose={() => setOpenLightId(null)}
              roomName={activeLight.label}
              on={activeLight.on}
              onPowerChange={(on) => setLight(activeLight.id, on)}
              whiteBalanceOptions={WHITE_BALANCES}
              whiteBalance={whiteBalance}
              onWhiteBalanceChange={setWhiteBalance}
              colorOptions={LIGHT_COLORS}
              color={color}
              onColorChange={setColor}
            />
          ) : null}
        </Specimen>

        <Specimen name="EnergyWidget" description="Production, batterie, réseau et coût : des lignes mêlées, dont une jauge.">
          <EnergyWidget
            meta="aujourd'hui"
            rows={[
              {
                id: "solaire",
                icon: <SolarPanelIcon />,
                label: "Solaire produit",
                value: "6,4 kWh",
                details: ["1 120 W à l'instant", "Hier · 5,9 kWh"],
              },
              { id: "batterie", icon: <BatteryIcon />, label: "Batterie maison", value: "68 %", gaugePercent: 68 },
              { id: "reseau", icon: <PlugIcon />, label: "Réseau consommé", value: "4,2 kWh" },
              { id: "cout", label: "Coût du jour", value: "0,87 €" },
            ]}
          />
        </Specimen>

        <Specimen
          name="DemandMeters"
          description="La demande face à la capacité, par poste ; au-delà de 100 %, des chevrons. Survol ou focus : le détail."
          wide
        >
          <DemandMeters meters={METERS} />
          <div className="rdk-wrap rdk-align-end">
            <DemandMeters meters={METERS} orientation="vertical" />
            <DemandMeters meters={METERS} compact />
          </div>
        </Specimen>
      </SpecimenGrid>
    </SpecimenScreen>
  );
}
