import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ActivityFeed,
  Avatar,
  Badge,
  Button,
  ChatPanel,
  Gallery,
  Lightbox,
  MailPanel,
  NotesPanel,
  PanelRow,
  Quickview,
  Timeline,
  AlertMarker,
  AlertMarkerStack,
  AllocationSlider,
  Card,
  DashboardGrid,
  DashboardGridItem,
  FpsMeter,
  IconDock,
  KanbanBoard,
  KnowledgeBase,
  MetricListWidget,
  ObjectiveTracker,
  SkillTree,
  Text,
  createFpsSource,
  useFps,
  BarChartIcon,
  BoxesIcon,
  BriefcaseIcon,
  CalendarIcon,
  ClipboardListIcon,
  GaugeIcon,
  HelpIcon,
  LayersIcon,
  RefreshIcon,
  SearchIcon,
  SettingsIcon,
  TruckIcon,
  UserIcon,
  type AlertMarkerProps,
  type IconDockItem,
  type KanbanCard,
  type KanbanMove,
  type Objective,
  type SkillTreeBranch,
  type SkillTreeNode,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { Specimen, SpecimenGrid, SpecimenScreen } from "../../Specimen";
import {
  ALLOCATION_TEAMS,
  INDOOR_TEMPERATURES,
  KANBAN_CARDS,
  KANBAN_COLUMNS,
  KNOWLEDGE,
  ONBOARDING_STEPS,
  SERVICES,
  SKILLS,
} from "../../widgetData";
import {
  ACTIVITY_POSTS,
  CHAT_CONTACTS,
  CHAT_MESSAGES,
  CHAT_NOW,
  GALLERY_IMAGES,
  GALLERY_IMAGES_PLAIN,
  MAIL_FOLDERS,
  MAIL_MESSAGES,
  MAIL_NOW,
  NOTES,
  NOTES_NOW,
} from "../../appData";
import { TIMELINE } from "../../timelineIcons";

/** Le panneau rapide : trois onglets, de quoi voir la barre de tête et ce qui défile dessous. */
const QUICK_NOTES = [
  { titre: "Relancer Lemoine SAS", texte: "Facture d'octobre toujours impayée, relance par téléphone jeudi.", date: "29 oct." },
  { titre: "Atelier utilisateurs", texte: "Recherche, export, lisibilité sur tablette : à prioriser.", date: "26 oct." },
  { titre: "Recette lot 1", texte: "Prévoir deux demi-journées avec Hugo.", date: "22 oct." },
];

const QUICK_ALERTS: { titre: string; detail: string; tone: "down" | "warning" | "info" }[] = [
  { titre: "Serveur de recette injoignable", detail: "depuis 08:12", tone: "down" },
  { titre: "Stock bas : ruban adhésif", detail: "12 unités", tone: "warning" },
  { titre: "Sauvegarde terminée", detail: "03:00", tone: "info" },
];

const QUICK_PEOPLE = ["Camille Roux", "Hugo Lambert", "Inès Morel", "Léa Fontaine", "Nathan Girard"];

const QUICK_TABS = [
  {
    id: "notes",
    label: "Notes",
    content: (
      <div className="rdk-stack">
        {QUICK_NOTES.map((n) => (
          <div key={n.titre} className="rdk-stack rdk-stack--tight">
            <Text weight="bold" size="sm">
              {n.titre}
            </Text>
            <Text size="sm">{n.texte}</Text>
            <Text size="xs" muted>
              {n.date}
            </Text>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "alertes",
    label: "Alertes",
    content: (
      <div>
        {QUICK_ALERTS.map((a) => (
          <PanelRow key={a.titre} label={a.titre} value={<Badge tone={a.tone}>{a.detail}</Badge>} />
        ))}
      </div>
    ),
  },
  {
    id: "equipe",
    label: "Équipe",
    content: (
      <div className="rdk-stack">
        {QUICK_PEOPLE.map((name) => (
          <div key={name} className="rdk-row">
            <Avatar name={name} size={32} />
            <Text size="sm">{name}</Text>
          </div>
        ))}
      </div>
    ),
  },
];

/** Les couleurs de branche passent en variable CSS dans le kit : un jeton du thème y est donc accepté tel quel. */
const BRANCHES: SkillTreeBranch[] = [
  { id: "support", label: "Support", icon: <UserIcon size={16} />, color: "var(--lq-color-accent)" },
  { id: "finance", label: "Finance", icon: <BarChartIcon size={16} />, color: "var(--lq-color-green)" },
  { id: "technique", label: "Technique", icon: <SettingsIcon size={16} />, color: "var(--lq-color-amber)" },
];

const SECTIONS: { id: string; label: string; icon: ReactNode; badge?: ReactNode }[] = [
  { id: "tableau", label: "Tableau de bord", icon: <GaugeIcon /> },
  { id: "commandes", label: "Commandes", icon: <ClipboardListIcon />, badge: 3 },
  { id: "stocks", label: "Stocks", icon: <BoxesIcon /> },
  { id: "livraisons", label: "Livraisons", icon: <TruckIcon />, badge: true },
  { id: "planning", label: "Planning", icon: <CalendarIcon /> },
  { id: "clients", label: "Clients", icon: <BriefcaseIcon /> },
  { id: "rapports", label: "Rapports", icon: <BarChartIcon /> },
];

const TOOLS: { id: string; label: string; icon: ReactNode; disabled?: boolean }[] = [
  { id: "chercher", label: "Rechercher", icon: <SearchIcon /> },
  { id: "calques", label: "Calques", icon: <LayersIcon /> },
  { id: "actualiser", label: "Actualiser", icon: <RefreshIcon /> },
  { id: "aide", label: "Aide", icon: <HelpIcon /> },
  { id: "reglages", label: "Réglages", icon: <SettingsIcon />, disabled: true },
];

const STACK: (AlertMarkerProps & { id: string })[] = [
  { id: "paiement", severity: "critical", label: "Échec de prélèvement : 2 clients", count: 2, onClick: () => {} },
  { id: "stock", severity: "warning", label: "Stock bas : cartons 40 × 30", onClick: () => {} },
  { id: "contrat", severity: "warning", label: "Contrat à renouveler", onClick: () => {} },
  { id: "export", severity: "info", label: "Export comptable prêt", onClick: () => {} },
  { id: "message", severity: "info", label: "Nouveau message", onClick: () => {} },
  { id: "maj", severity: "info", label: "Mise à jour disponible", onClick: () => {} },
];

/** Applique un déplacement du Kanban : la carte change de colonne et prend la place visée. */
function applyMove(cards: KanbanCard[], m: KanbanMove): KanbanCard[] {
  const moved: KanbanCard = {
    ...m.card,
    columnId: m.toColumnId,
    ...(m.toColumnId === "done" ? { meta: "livré aujourd'hui", group: "vendredi 30 octobre 2026" } : { meta: undefined, group: undefined }),
  };
  const rest = cards.filter((c) => c.id !== m.card.id);
  const target = rest.filter((c) => c.columnId === m.toColumnId);
  const anchor = target[m.index];
  const at = anchor ? rest.indexOf(anchor) : rest.length;
  return [...rest.slice(0, at), moved, ...rest.slice(at)];
}

/**
 * Une scène qui tourne à environ 24 images par seconde, sans hasard : des durées d'image fixes
 * poussées dans une source de `createFpsSource`. C'est ce qu'une application branche sur sa propre
 * boucle de rendu quand elle veut mesurer sa scène plutôt que la page.
 */
function useSlowScene() {
  const source = useMemo(() => createFpsSource(), []);
  useEffect(() => {
    const frames = [38, 44, 40, 47, 41];
    let i = 0;
    const id = window.setInterval(() => source.emit(frames[i++ % frames.length]), 42);
    return () => window.clearInterval(id);
  }, [source]);
  return source;
}

/**
 * Les widgets outils : listes de valeurs, grille de tableau de bord, arbre de compétences, base de
 * connaissances, Kanban, objectifs, dock d'icônes, épingles d'alerte, compteur d'images, partage.
 *
 * Plusieurs viennent d'un jeu de gestion et se posent en surimpression sur une scène : ils sont
 * montrés sur un fond de vitrine positionné, comme une application les poserait sur sa carte ou sa
 * vue principale. Tous sont vivants — glisser une carte, débloquer un nœud, valider une étape.
 */
export function ToolWidgets() {
  const [cards, setCards] = useState(KANBAN_CARDS);
  const [kanbanLog, setKanbanLog] = useState("Glissez une carte, ou ← → au clavier.");

  const [owned, setOwned] = useState<string[]>(["s1", "f1", "t1"]);
  const [points, setPoints] = useState(5);
  const [selectedSkill, setSelectedSkill] = useState<string | null>("s2");
  const nodes = useMemo<SkillTreeNode[]>(
    () =>
      SKILLS.map((n) => ({
        ...n,
        requires: "requires" in n ? [...n.requires] : undefined,
        state: owned.includes(n.id)
          ? "unlocked"
          : n.id === "t2"
            ? "researching"
            : ("requires" in n ? n.requires : []).every((r) => owned.includes(r))
              ? "available"
              : "locked",
        progress: n.id === "t2" ? 0.6 : undefined,
      })),
    [owned]
  );

  const [done, setDone] = useState(1);
  const [collapsed, setCollapsed] = useState(false);
  const objectives: Objective[] = ONBOARDING_STEPS.map((s, i) => ({
    ...s,
    state: i < done ? "done" : i === done ? "current" : "todo",
    action: i === done ? { label: "Valider l'étape", onClick: () => setDone((d) => d + 1) } : undefined,
  }));

  const [section, setSection] = useState<string | null>("commandes");
  const [lastTool, setLastTool] = useState("—");
  const sectionItems: IconDockItem[] = SECTIONS.map((s) => ({
    ...s,
    active: s.id === section,
    onClick: () => setSection((a) => (a === s.id ? null : s.id)),
  }));
  const toolItems: IconDockItem[] = TOOLS.map((t) => ({ ...t, onClick: () => setLastTool(t.label) }));

  const [lastAlert, setLastAlert] = useState("—");

  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quickview, setQuickview] = useState(false);

  const [capValues, setCapValues] = useState<Record<string, number>>({ produit: 50, support: 25, dette: 10 });
  const [stealValues, setStealValues] = useState<Record<string, number>>({ produit: 60, support: 25, dette: 15 });

  const slowScene = useSlowScene();
  const sceneReading = useFps({ source: slowScene });

  return (
    <SpecimenScreen
      title="Widgets outils"
      intro="Listes de valeurs, grille, arbre de compétences, base de connaissances, Kanban, objectifs, dock, alertes, compteur d'images, partage ; puis frise, fil d'activité, galerie, panneau rapide, messagerie, notes et boîte mail."
    >
      <SpecimenGrid>
        <Specimen name="MetricListWidget" description="Un panneau libellé / valeur : le plus simple des widgets, et le plus réutilisé.">
          <MetricListWidget title="Disponibilité" meta="30 derniers jours" rows={SERVICES} />
          <MetricListWidget title="Intérieur" meta={`${INDOOR_TEMPERATURES.length} pièces`} rows={INDOOR_TEMPERATURES} />
        </Specimen>

        <Specimen name="AllocationSlider" description="Partager un tout entre des postes. Plafonné à ce qui reste libre, ou en prenant aux autres (steal).">
          <AllocationSlider items={ALLOCATION_TEAMS} values={capValues} onChange={setCapValues} ariaLabel="Temps de l'équipe" />
          <AllocationSlider items={ALLOCATION_TEAMS} values={stealValues} onChange={setStealValues} mode="steal" unit=" j" max={20} step={1} ariaLabel="Jours du sprint" />
        </Specimen>

        <Specimen
          name="DashboardGrid · DashboardGridItem"
          description="La grille qui range les widgets d'une page ; un élément peut s'étendre sur plusieurs colonnes."
          wide
        >
          <DashboardGrid columns="repeat(3, minmax(0, 1fr))">
            <DashboardGridItem colSpan={2}>
              <MetricListWidget title="Services" meta="disponibilité sur 30 jours" rows={SERVICES} />
            </DashboardGridItem>
            <DashboardGridItem>
              <MetricListWidget title="Intérieur" meta="5 pièces" rows={INDOOR_TEMPERATURES} />
            </DashboardGridItem>
            <DashboardGridItem colSpan={3}>
              <Card title="Élément sur trois colonnes" meta="colSpan={3}">
                <Text size="sm" muted>
                  Une rangée pleine largeur, pour un graphique ou un tableau sous les panneaux.
                </Text>
              </Card>
            </DashboardGridItem>
          </DashboardGrid>
        </Specimen>

        <Specimen
          name="KanbanBoard"
          description="Glisser-déposer entre colonnes, avec repère d'insertion ; « Livré » est rangé par date et ignore la place visée."
          wide
        >
          <KanbanBoard
            columns={KANBAN_COLUMNS}
            cards={cards}
            onMove={(m) => {
              setCards((list) => applyMove(list, m));
              setKanbanLog(`« ${m.card.title} » → ${KANBAN_COLUMNS.find((c) => c.id === m.toColumnId)?.title}`);
            }}
            onEdit={(c) => setKanbanLog(`Modifier « ${c.title} »`)}
            onDelete={(c) => {
              setCards((list) => list.filter((x) => x.id !== c.id));
              setKanbanLog(`« ${c.title} » supprimée`);
            }}
          />
          <Text size="sm" muted>
            {kanbanLog}
          </Text>
        </Specimen>

        <Specimen
          name="SkillTree"
          description="Trois branches, des rangs, des points à dépenser ; un lien croise deux branches, en pointillé."
          wide
        >
          <SkillTree
            nodes={nodes}
            branches={BRANCHES}
            selectedId={selectedSkill}
            onSelect={setSelectedSkill}
            header={
              <span>
                Points disponibles : <strong>{points}</strong>
              </span>
            }
            canUnlock={(n) => (n.points ?? 0) <= points}
            onUnlock={(id) => {
              const n = SKILLS.find((s) => s.id === id);
              setPoints((p) => p - (n?.points ?? 0));
              setOwned((o) => [...o, id]);
            }}
          />
        </Specimen>

        <Specimen
          name="KnowledgeBase"
          description="Un centre d'aide : recherche tolérante aux fautes et aux accents, catégories, entrées liées. Essayez « facure »."
          wide
        >
          <div className="rdk-frame rdk-frame--kb">
            <KnowledgeBase entries={KNOWLEDGE} placeholder="Rechercher : facture, export, rôle…" />
          </div>
        </Specimen>

        <Specimen name="ObjectiveTracker" description="Les étapes d'une prise en main, en carte flottante ; « Valider l'étape » fait avancer.">
          <div className="rdk-stage">
            <div className="rdk-stage__corner rdk-stage__corner--bl">
              <ObjectiveTracker
                title="Bien démarrer"
                subtitle="Configurer votre espace"
                objectives={objectives}
                collapsed={collapsed}
                onCollapsedChange={setCollapsed}
                onDismiss={() => setDone(0)}
              />
            </div>
          </div>
        </Specimen>

        <Specimen name="IconDock" description="Un dock d'icônes : une section active à la fois, les noms en infobulle, flèches au clavier.">
          <div className="rdk-stage rdk-stage--short">
            <div className="rdk-stage__corner rdk-stage__corner--tl rdk-stack">
              <IconDock items={sectionItems} aria-label="Sections" />
              <IconDock items={toolItems} size="sm" aria-label="Outils" />
            </div>
            <div className="rdk-stage__corner rdk-stage__corner--tr">
              <IconDock items={sectionItems.slice(0, 4)} orientation="vertical" size="sm" aria-label="Sections, vertical" />
            </div>
            <Text size="sm" muted className="rdk-stage__caption">
              Section : {SECTIONS.find((s) => s.id === section)?.label ?? "aucune"} · Dernier outil : {lastTool}
            </Text>
          </div>
        </Specimen>

        <Specimen
          name="AlertMarker · AlertMarkerStack"
          description="Des épingles plantées sur un plan, ancrées par leur pointe ; la pile, elle, se range dans un coin."
        >
          <div className="rdk-stage rdk-stage--plan">
            <div className="rdk-stage__block" style={{ left: "10%", top: "34%", width: "34%", height: "30%" }} />
            <div className="rdk-stage__block" style={{ left: "54%", top: "52%", width: "26%", height: "26%" }} />
            <Pin x="22%" y="40%">
              <AlertMarker severity="critical" count={4} label="Quai 3 engorgé" onClick={() => setLastAlert("Quai 3")} />
            </Pin>
            <Pin x="38%" y="58%">
              <AlertMarker severity="warning" label="Rack B presque plein" onClick={() => setLastAlert("Rack B")} />
            </Pin>
            <Pin x="64%" y="60%">
              <AlertMarker severity="info" label="Préparateur disponible" onClick={() => setLastAlert("Préparateur")} />
            </Pin>
            <Pin x="74%" y="74%">
              <AlertMarker severity="warning" size="sm" count={2} bounce={false} label="Convoyeur ralenti" onClick={() => setLastAlert("Convoyeur")} />
            </Pin>
            <AlertMarkerStack alerts={STACK} corner="top-right" max={4} aria-label="Alertes du compte" />
            <Text size="sm" muted className="rdk-stage__caption">
              Dernier clic : {lastAlert}
            </Text>
          </div>
        </Specimen>

        <Specimen
          name="FpsMeter · useFps · createFpsSource"
          description="Le compteur d'images en surimpression : la page par défaut, ou une scène à soi branchée sur createFpsSource."
        >
          <div className="rdk-stage rdk-stage--short">
            <FpsMeter label="Page" />
            <FpsMeter position="top-left" compact />
            <FpsMeter position="top-right" source={slowScene} label="Scène" />
            <FpsMeter position="bottom-left" source={slowScene} compact showGraph={false} />
          </div>
          <Text size="sm" muted>
            useFps sur la même scène : {Math.round(sceneReading.fps)} i/s, au plus lent {Math.round(sceneReading.min)} i/s, {sceneReading.ms.toFixed(1)} ms par image.
          </Text>
        </Specimen>

        <Specimen name="Timeline" description="La frise : regroupée par jour, l'entrée en cours signalée, une pastille par ton ou par icône.">
          <Timeline entries={TIMELINE} ariaLabel="Activité de l'équipe" />
        </Specimen>

        <Specimen name="Timeline" description="Les deux autres dispositions : compacte, sans regroupement, et en alternance de part et d'autre de l'axe, encadrée.">
          <Timeline entries={TIMELINE.slice(0, 4)} variant="compact" groupByDay={false} ariaLabel="Activité récente" />
          <Timeline entries={TIMELINE.slice(0, 4)} variant="alternate" boxed groupByDay={false} ariaLabel="Activité récente, en alternance" />
        </Specimen>

        <Specimen name="ActivityFeed" description="Le fil d'une équipe : publications en cartes, mentions J'aime, partages et commentaires dépliables.">
          <ActivityFeed posts={ACTIVITY_POSTS} currentUser={{ name: "Claire Lemoine" }} defaultOpenComments={["p1"]} />
        </Specimen>

        <Specimen name="ActivityFeed" description="La variante en liste, plus dense, pour une colonne latérale.">
          <ActivityFeed posts={ACTIVITY_POSTS} variant="list" currentUser={{ name: "Claire Lemoine" }} />
        </Specimen>

        <Specimen name="Gallery" description="La galerie : filtre par catégorie, grandes vignettes (span), légende au survol, visionneuse au clic." wide>
          <Gallery images={GALLERY_IMAGES} filterable lightboxThumbnails ariaLabel="Œuvres de la boutique" />
        </Specimen>

        <Specimen name="Gallery" description="La maçonnerie : chaque image garde ses proportions, légende toujours visible, filtre en commandes segmentées." wide>
          <Gallery images={GALLERY_IMAGES_PLAIN.slice(0, 8)} layout="masonry" columns={4} overlay="always" filterable filterStyle="segmented" ariaLabel="Œuvres, en maçonnerie" />
        </Specimen>

        <Specimen name="Lightbox" description="La visionneuse seule : flèches, compteur, vignettes, Échap pour fermer — ouverte ici depuis une liste à soi.">
          <div className="rdk-wrap">
            {GALLERY_IMAGES_PLAIN.slice(0, 4).map((image, i) => (
              <Button
                key={image.id}
                onClick={() => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
              >
                {image.title}
              </Button>
            ))}
          </div>
          <Lightbox
            images={GALLERY_IMAGES_PLAIN.slice(0, 4)}
            index={lightboxIndex}
            onIndexChange={setLightboxIndex}
            open={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            thumbnails
          />
        </Specimen>

        <Specimen name="Quickview" description="Le panneau rapide qui glisse depuis le bord : onglets, contenu qui défile, fermeture par la croix, Échap ou le fond.">
          <div className="rdk-row">
            <Button onClick={() => setQuickview(true)}>Ouvrir le panneau rapide</Button>
          </div>
          <Quickview open={quickview} onClose={() => setQuickview(false)} ariaLabel="Panneau rapide" tabs={QUICK_TABS} />
        </Specimen>

        <Specimen name="ChatPanel" description="La messagerie : contacts et présence, fil du jour avec accusés de lecture, saisie au bas ; sous 640 px, une colonne à la fois." wide>
          <div className="rdk-frame rdk-frame--panel">
            <ChatPanel contacts={CHAT_CONTACTS} messages={CHAT_MESSAGES} defaultActiveContactId="ava" now={CHAT_NOW} />
          </div>
        </Specimen>

        <Specimen name="NotesPanel" description="Le carnet : liste cherchable à gauche, note éditable à droite, création et suppression." wide>
          <div className="rdk-frame rdk-frame--notes">
            <NotesPanel notes={NOTES} defaultActiveNoteId="release" now={NOTES_NOW} />
          </div>
        </Specimen>

        <Specimen name="MailPanel" description="La boîte mail : dossiers et libellés, liste avec cases et étoiles, message ouvert avec ses pièces jointes." wide>
          <div className="rdk-frame rdk-frame--mail">
            <MailPanel folders={MAIL_FOLDERS} defaultMessages={MAIL_MESSAGES} defaultSelectedId="m1" now={MAIL_NOW} ariaLabel="Boîte mail" />
          </div>
        </Specimen>
      </SpecimenGrid>
    </SpecimenScreen>
  );
}

/** Plante une épingle en (x, y) : le point d'ancrage est le milieu de son bord bas. */
function Pin({ x, y, children }: { x: string; y: string; children: ReactNode }) {
  return (
    <div className="rdk-stage__pin" style={{ left: x, top: y }}>
      {children}
    </div>
  );
}
