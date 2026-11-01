import { useEffect, useRef, useState } from "react";
import {
  BalanceControl,
  Button,
  Card,
  Equalizer,
  InteractiveGlobe,
  LevelMeter,
  MonthCalendar,
  Scheduler,
  SchedulerTaskModal,
  Text,
  TileMap,
  formatDuration,
  HOUR,
  type InteractiveGlobeHandle,
  type LevelMeterChannel,
  type SchedulerTask,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { Specimen, SpecimenGrid, SpecimenScreen } from "../../Specimen";
import { CALENDAR_EVENTS, CALENDAR_TODAY } from "../../appData";
import {
  EQ_BANDS,
  GLOBE_FLOWS,
  GLOBE_NODES,
  MAP_HUBS,
  MAP_ROUTES,
  SCHEDULE_DAY,
  SCHEDULE_NOW,
  SCHEDULE_RESOURCES,
  SCHEDULE_TASKS,
} from "../../widgetData";

const FLAT = EQ_BANDS.map((b) => ({ ...b, gain: 0 }));

/**
 * Un signal stéréo qui bouge comme de la musique, sans hasard : une somme de sinus d'un compteur.
 * La crête tient puis redescend de 0,7 dB par trame — c'est l'appelant qui la fait vivre, le
 * `LevelMeter` ne dessine que ce qu'on lui donne.
 */
function useSignal(running: boolean) {
  const [channels, setChannels] = useState<LevelMeterChannel[]>([
    { id: "l", label: "G", value: -24, peak: -18 },
    { id: "r", label: "D", value: -22, peak: -16 },
  ]);
  const peaks = useRef<[number, number]>([-60, -60]);
  const tick = useRef(0);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const t = ++tick.current;
      setChannels((current) =>
        current.map((c, i) => {
          const raw = -18 + 9 * Math.sin(t / 3.1 + i) + 5 * Math.sin(t / 1.3 + 2 * i) + 3 * Math.sin(t / 0.7);
          const value = Math.max(-60, Math.min(0, raw));
          peaks.current[i] = value > peaks.current[i] ? value : Math.max(value, peaks.current[i] - 0.7);
          return { ...c, value, peak: peaks.current[i] };
        })
      );
    }, 90);
    return () => window.clearInterval(id);
  }, [running]);
  return channels;
}

/**
 * Les grandes surfaces du kit : un globe en WebGL, une carte à tuiles, l'audio (balance, niveaux,
 * égaliseur) et le planning de ressources.
 *
 * Toutes prennent leurs couleurs aux variables du thème — y compris le globe, qui les lit pour les
 * passer à ses shaders. La carte, elle, charge ses tuiles chez OpenStreetMap, le fournisseur par
 * défaut du kit : son fond demande le réseau, les tracés et les repères sont dessinés par-dessus.
 */
export function MapsAudio() {
  const globe = useRef<InteractiveGlobeHandle>(null);
  const [node, setNode] = useState<string | null>("par");
  const picked = GLOBE_NODES.find((n) => n.id === node);

  const [route, setRoute] = useState(MAP_ROUTES[0].id);
  const [calendarLog, setCalendarLog] = useState("Cliquez un événement, ou double-cliquez un jour pour en créer un.");

  const [balance, setBalance] = useState(0);
  const [split, setSplit] = useState(-20);
  const [bands, setBands] = useState(EQ_BANDS);
  const [running, setRunning] = useState(true);
  const channels = useSignal(running);

  const [tasks, setTasks] = useState<SchedulerTask[]>(SCHEDULE_TASKS);
  const [selected, setSelected] = useState<string | null>(null);
  const [modalTaskId, setModalTaskId] = useState<string | null>(null);
  const selectedTask = tasks.find((t) => t.id === selected);
  const modalTask = tasks.find((t) => t.id === modalTaskId);

  return (
    <SpecimenScreen
      title="Cartes, audio, planning"
      intro="Un globe, une carte à tuiles, trois contrôles audio, le planning de ressources et le calendrier — les grandes surfaces du kit."
    >
      <SpecimenGrid>
        <Specimen
          name="InteractiveGlobe"
          description="Points, flux en arc de grand cercle et particules, en WebGL. Glisser pour tourner, molette pour zoomer, clic pour sélectionner."
          wide
        >
          <div className="rdk-frame rdk-frame--map">
            <InteractiveGlobe
              ref={globe}
              autoRotate
              nodes={GLOBE_NODES}
              flows={GLOBE_FLOWS}
              selectedNodeId={node}
              initialView={{ lon: -10, lat: 30 }}
              onNodeClick={({ node: n }) => {
                setNode(n.id);
                globe.current?.focusNode(n.id, { zoom: 1.6 });
              }}
              onBackgroundClick={() => setNode(null)}
              fallback={<Text muted>Ce navigateur n'a pas WebGL : le globe ne peut pas s'afficher.</Text>}
              overlay={
                picked ? (
                  <div className="rdk-frame__overlay">
                    <Card title={picked.label} meta={`${picked.lat.toFixed(1)}°, ${picked.lon.toFixed(1)}°`}>
                      <div className="rdk-stack">
                        <Text size="sm" muted>
                          {GLOBE_FLOWS.filter((f) => f.from === picked.id || f.to === picked.id).length} flux reliés
                        </Text>
                        <Button onClick={() => globe.current?.resetView()}>Recentrer</Button>
                      </div>
                    </Card>
                  </div>
                ) : null
              }
            />
          </div>
        </Specimen>

        <Specimen
          name="TileMap"
          description="Une carte à tuiles OpenStreetMap, des repères et des itinéraires : le tracé choisi au-dessus, les variantes atténuées dessous."
          wide
        >
          <div className="rdk-map">
            <div className="rdk-map__list">
              <Text size="sm" muted>
                Paris → Lyon
              </Text>
              {MAP_ROUTES.map((r) => (
                <Button key={r.id} block selected={r.id === route} onClick={() => setRoute(r.id)}>
                  {r.label} · {r.via}
                </Button>
              ))}
            </div>
            <TileMap
              center={{ lon: 3.6, lat: 47.3 }}
              zoom={6.4}
              routes={MAP_ROUTES}
              selectedRouteId={route}
              onRouteSelect={(r) => setRoute(r.id)}
              markers={MAP_HUBS}
              ariaLabel="Itinéraires de Paris à Lyon"
            />
          </div>
        </Specimen>

        <Specimen name="BalanceControl" description="Une balance gauche / droite avec un cran au centre ; double-clic pour recentrer.">
          <BalanceControl value={balance} onChange={setBalance} label="Balance" />
          <BalanceControl
            value={split}
            onChange={setSplit}
            label="Répartition"
            leftLabel="Avant"
            rightLabel="Arrière"
            detent={0}
            formatValue={(v) => (v === 0 ? "50 / 50" : `${50 - v / 2} / ${50 + v / 2}`)}
          />
          <BalanceControl value={20} onChange={() => {}} label="Désactivée" disabled />
        </Specimen>

        <Specimen name="LevelMeter" description="Des vumètres segmentés, une crête qui retombe ; zones chaude et d'écrêtage posées sur l'échelle.">
          <div className="rdk-wrap rdk-align-start">
            <LevelMeter channels={channels} showScale showValue length={150} />
            <LevelMeter channels={channels} segments={0} length={150} />
            <LevelMeter
              showValue
              length={150}
              channels={[
                { id: "a", label: "−24", value: -24, peak: -20 },
                { id: "b", label: "−8", value: -8, peak: -5 },
                { id: "c", label: "0", value: 0, peak: 0 },
              ]}
            />
          </div>
          <LevelMeter channels={channels} orientation="horizontal" showScale />
          <div className="rdk-wrap">
            <Button onClick={() => setRunning((r) => !r)}>{running ? "Figer" : "Relancer"}</Button>
          </div>
        </Specimen>

        <Specimen name="Equalizer" description="Un égaliseur dix bandes : un curseur par fréquence, la courbe de réponse tracée à travers." wide>
          <Equalizer bands={bands} onChange={setBands} showValues />
          <div className="rdk-wrap">
            <Button onClick={() => setBands(FLAT)}>Plat</Button>
            <Button onClick={() => setBands(EQ_BANDS)}>Rétablir</Button>
          </div>
        </Specimen>

        <Specimen
          name="Scheduler"
          description="Une journée d'atelier : glisser un bloc dans le temps ou sur une autre ligne, tirer un bord, cliquer pour ouvrir la tâche. Les conflits dédoublent la ligne."
          wide
        >
          <Scheduler
            resources={SCHEDULE_RESOURCES}
            tasks={tasks}
            onTasksChange={setTasks}
            from={SCHEDULE_DAY}
            to={SCHEDULE_DAY + 14 * HOUR}
            now={SCHEDULE_NOW}
            selectedTaskId={selected}
            onSelectedTaskIdChange={setSelected}
            height={380}
            locale="fr-FR"
          />
          <Text size="sm" muted>
            {selectedTask ? `Sélection : ${selectedTask.label} · ${formatDuration(selectedTask.end - selectedTask.start)}` : "Cliquez un bloc."}
          </Text>
        </Specimen>

        <Specimen name="SchedulerTaskModal" description="La fiche d'une tâche, seule : celle que le planning ouvre au clic, utilisable hors de lui.">
          <div className="rdk-wrap">
            <Button onClick={() => setModalTaskId("t3")}>Ouvrir « Série B »</Button>
            <Button onClick={() => setModalTaskId("t5")}>Ouvrir « Reprise urgente »</Button>
          </div>
          {modalTask ? (
            <SchedulerTaskModal
              task={modalTask}
              resources={SCHEDULE_RESOURCES}
              snapMinutes={15}
              locale="fr-FR"
              onChange={(next) => setTasks((list) => list.map((t) => (t.id === next.id ? next : t)))}
              onDelete={() => {
                setTasks((list) => list.filter((t) => t.id !== modalTask.id));
                setModalTaskId(null);
              }}
              onClose={() => setModalTaskId(null)}
            />
          ) : null}
        </Specimen>

        <Specimen name="MonthCalendar" description="Le calendrier du mois : événements sur plusieurs jours, lien « +N autres », jour sélectionné et sa liste, bascule vers la semaine." wide>
          <MonthCalendar
            events={CALENDAR_EVENTS}
            today={CALENDAR_TODAY}
            defaultSelectedDate={CALENDAR_TODAY}
            onEventClick={(e) => setCalendarLog(`Événement : ${e.title}`)}
            onCreate={(d) => setCalendarLog(`Créer un événement le ${d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`)}
          />
          <Text size="sm" muted>
            {calendarLog}
          </Text>
        </Specimen>
      </SpecimenGrid>
    </SpecimenScreen>
  );
}
