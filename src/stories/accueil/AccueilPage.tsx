import { useState, type ReactNode } from "react";
import {
  AlertList,
  ArrowRightIcon,
  Badge,
  BarChart,
  Button,
  Card,
  Checkbox,
  CodeBlock,
  DonutChart,
  GaugeChart,
  Input,
  LineAreaChart,
  LiveTile,
  NotificationMenu,
  PriceChangeTag,
  ProgressBar,
  SegmentedControl,
  Select,
  Sparkline,
  StatCard,
  Tag,
  Toggle,
  type NotificationMenuItem,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { ResumeTheme } from "../../theme";
import { CHURN_TREND, REVENUE_TREND, SIGNUPS_TREND } from "../../showcase/demoData";
import { TOKEN_GROUPS } from "../_docs/TokenTable";
import { openPath, useStorybookIndex, type StorybookIndex } from "./storybookIndex";
import "./accueil.css";

const euro = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

// Au niveau du module, pas à chaque rendu : chaque graphique se redessinerait sinon contre une
// série neuve à chaque changement de surface.
const REVENUE_SERIES = [
  { id: "revenu", label: "Revenu (k€)", data: REVENUE_TREND.map((y, i) => ({ x: i, y })) },
  { id: "objectif", label: "Objectif", data: REVENUE_TREND.map((_, i) => ({ x: i, y: 40 + i * 3.4 })) },
];
const CHANNELS = [
  { id: "direct", label: "Direct", value: 42 },
  { id: "partenaires", label: "Partenaires", value: 27 },
  { id: "recherche", label: "Recherche", value: 19 },
  { id: "autres", label: "Autres", value: 12 },
];
const SIGNUPS_BARS = SIGNUPS_TREND.slice(-6).map((value, i) => ({ id: `m${i}`, label: MONTHS[6 + i], value }));
const NOTIFICATIONS: NotificationMenuItem[] = [
  { id: "1", title: "Facture F-2041 réglée", text: "Atelier Morel — 4 820 €", time: "il y a 5 min", unread: true, tone: "success" },
  { id: "2", title: "Nouveau client", text: "Brasserie du Port a créé son compte.", time: "il y a 1 h", unread: true, tone: "accent" },
  { id: "3", title: "Export terminé", text: "commandes-octobre.csv est prêt.", time: "hier", tone: "info" },
];

/** Les familles du menu, dans l'ordre de la barre latérale (voir `storySort` dans preview.tsx). La
 *  page ouverte au clic est la plus représentative de la famille, pas la première par l'alphabet. */
const FAMILIES: { name: string; lead: string; open: string }[] = [
  { name: "Foundations", lead: "Les variables du thème, la typographie, les icônes et le fournisseur de thème.", open: "Foundations/Variables du thème" },
  { name: "Primitives", lead: "Boutons, cartes, panneaux, onglets, bascules, infobulles : les briques de tout le reste.", open: "Primitives/Button" },
  { name: "Forms", lead: "Champs, listes, dates, masques de saisie, étiquettes, éditeur riche.", open: "Forms/Input/Input" },
  { name: "Feedback", lead: "Notifications, alertes, chargements, progression, visites guidées.", open: "Feedback/Notification" },
  { name: "Charts", lead: "Courbes, barres, anneaux, jauges, cartes de chaleur, chandeliers.", open: "Charts/LineAreaChart" },
  { name: "Map", lead: "Globe interactif, carte tuilée, carte à points, exposition par pays.", open: "Map/Tile Map" },
  { name: "Finance", lead: "Tuiles d'indicateur, tableau de données, variations, comparaisons.", open: "Finance/StatCard" },
  { name: "Finance Widgets", lead: "Portefeuille, liste de surveillance, plus fortes variations.", open: "Finance Widgets/PortfolioSummaryWidget" },
  { name: "Widgets", lead: "Tuiles vivantes, horloges, météo, Kanban, objectifs, base de connaissances.", open: "Widgets/LiveTile" },
  { name: "Dashboard", lead: "Un tableau de bord assemblé de bout en bout avec les widgets.", open: "Dashboard/Maison — tableau de bord" },
  { name: "Layouts", lead: "Barre latérale, barre haute, fil d'Ariane, menu utilisateur.", open: "Layouts/SidebarLayout" },
  { name: "Pages", lead: "Connexion, inscription, profil, facture, verrouillage, erreurs 404 et 500.", open: "Pages/LoginPage" },
  { name: "Audio", lead: "Balance, vumètres et égaliseur.", open: "Audio/Equalizer" },
  { name: "Scheduler", lead: "Planning de ressources, sa fenêtre de tâche, calendrier mensuel.", open: "Scheduler/MonthCalendar" },
];

const SWATCHES = ["--lq-color-bg", "--lq-color-panel", "--rdk-color-text-strong", "--lq-color-text", "--lq-color-text-muted", "--lq-color-border", "--lq-color-accent", "--lq-color-up", "--lq-color-down", "--lq-color-warning", "--lq-color-info", "--lq-color-violet", "--lq-color-sky", "--lq-color-green", "--lq-color-amber", "--lq-color-rose"];
const TYPE_SCALE = [
  { token: "--lq-text-h3", sample: "Titre d'écran" },
  { token: "--lq-text-lg", sample: "Valeur secondaire" },
  { token: "--lq-text-md", sample: "Texte courant, 13 px" },
  { token: "--lq-text-sm", sample: "Légende de graphique" },
];
const SHAPES = ["--lq-radius-sm", "--lq-radius-md", "--lq-radius-lg", "--lq-radius-pill"];
const TOKEN_COUNT = TOKEN_GROUPS.reduce((n, g) => n + g.tokens.length, 0);

const USAGE_SNIPPET = `import { ResumeTheme, Button, Card } from "@michaelthomasjach/resume-dashboard-kit";
import "@michaelthomasjach/resume-dashboard-kit/style.css";

export function App() {
  return (
    <ResumeTheme surface="light">
      <Card title="Commandes">
        <Button tone="primary">Exporter</Button>
      </Card>
    </ResumeTheme>
  );
}`;
const FONTS_SNIPPET = `# .npmrc — le paquet est sur GitHub Packages
@michaelthomasjach:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}

npm install @michaelthomasjach/resume-dashboard-kit react react-dom d3`;
const SHOWCASE_SNIPPET = `npm install      # GITHUB_TOKEN exporté : le kit est sur GitHub Packages
npm run dev      # la vitrine, sur http://localhost:5173
npm run storybook`;

/** La vitrine : publiée sous `vitrine/` à côté de ce Storybook sur GitHub Pages ; en local, le
 *  serveur de `npm run dev`. L'iframe de la story est servie à la racine du Storybook, d'où l'URL
 *  relative. */
const SHOWCASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5173/"
    : new URL("vitrine/", typeof window !== "undefined" ? window.location.href : "http://localhost/").href;

function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: ReactNode; lead: ReactNode }) {
  return (
    <header className="rdk-home__head">
      <span className="rdk-home__eyebrow">{eyebrow}</span>
      <h2 className="rdk-home__title">{title}</h2>
      <p className="rdk-home__lead">{lead}</p>
    </header>
  );
}

/** Un composant vivant et son nom ; seul le nom est un bouton, pour ne pas voler les clics destinés
 *  au composant lui-même (les bascules basculent, les champs se remplissent). */
function Specimen({ name, title, index, wide, children }: { name: string; title: string; index: StorybookIndex; wide?: boolean; children: ReactNode }) {
  return (
    <figure className={["rdk-home__specimen", wide && "rdk-home__specimen--wide"].filter(Boolean).join(" ")}>
      <div className="rdk-home__stage">{children}</div>
      <figcaption>
        <button type="button" className="rdk-home__link" onClick={() => openPath(index.pathOf(title))}>
          {name}
        </button>
      </figcaption>
    </figure>
  );
}

/** Le mini tableau de bord du héros : de vrais composants, avec de vraies données de démonstration. */
function HeroDashboard() {
  return (
    <div className="rdk-home__dash">
      <div className="rdk-home__stats">
        <StatCard label="Revenu mensuel" value={euro(80000)} delta={12.4} caption="vs. mois précédent" sparklineData={REVENUE_TREND} />
        <StatCard label="Nouveaux clients" value="31" delta={-6.1} caption="vs. mois précédent" sparklineData={SIGNUPS_TREND} />
        <StatCard label="Attrition" value="4,0 %" delta={-1.2} caption="vs. mois précédent" sparklineData={CHURN_TREND} />
      </div>
      <div className="rdk-home__dash-row">
        <Card title="Revenu sur douze mois" meta="k€">
          <LineAreaChart series={REVENUE_SERIES} height={220} area xType="linear" formatX={(x) => MONTHS[Number(x)] ?? ""} formatY={(y) => `${y}`} />
        </Card>
        <Card title="Canaux d'acquisition" meta="en %">
          <DonutChart data={CHANNELS} size={150} centerValue="42 %" centerCaption="Direct" legendPosition="bottom" />
        </Card>
      </div>
    </div>
  );
}

function FormsSpecimen() {
  const [client, setClient] = useState("Atelier Morel");
  const [statut, setStatut] = useState<string | null>("payee");
  const [period, setPeriod] = useState<"mois" | "trimestre" | "annee">("trimestre");
  const [relance, setRelance] = useState(true);
  const [copie, setCopie] = useState(false);
  return (
    <Card title="Nouvelle facture">
      <div className="rdk-home__form">
        <Input label="Client" value={client} onChange={(e) => setClient(e.target.value)} />
        <Select
          label="Statut"
          value={statut}
          onChange={setStatut}
          options={[
            { value: "brouillon", label: "Brouillon" },
            { value: "envoyee", label: "Envoyée" },
            { value: "payee", label: "Payée" },
          ]}
        />
        <SegmentedControl
          label="Période"
          labelPosition="top"
          value={period}
          onChange={setPeriod}
          options={[
            { value: "mois", label: "Mois" },
            { value: "trimestre", label: "Trimestre" },
            { value: "annee", label: "Année" },
          ]}
        />
        <div className="rdk-home__row">
          <Toggle checked={relance} onChange={setRelance} ariaLabel="Relance automatique" />
          <span>Relance automatique à J+30</span>
        </div>
        <Checkbox checked={copie} onChange={setCopie} label="M'envoyer une copie" />
        <div className="rdk-home__row">
          <Button selected>Enregistrer</Button>
          <Button>Annuler</Button>
        </div>
      </div>
    </Card>
  );
}

export interface AccueilPageProps {
  /** Version du kit dont le Storybook lit le source, affichée dans le surtitre. */
  kitVersion: string;
  /** Nombre de composants du kit documentés (`docgen.json`). */
  componentCount: number;
}

export function AccueilPage({ kitVersion, componentCount }: AccueilPageProps) {
  const index = useStorybookIndex();
  const open = (title: string) => openPath(index.pathOf(title));

  return (
    <div className="rdk-home">
      <header className="rdk-home__hero">
        <span className="rdk-home__eyebrow">Thème « resume » · kit v{kitVersion}</span>
        <h1 className="rdk-home__hero-title">
          Les composants de la liseuse, <span className="rdk-home__accent">habillés comme le CV</span>.
        </h1>
        <p className="rdk-home__hero-lead">
          <strong>resume-dashboard-kit</strong> est une couche de thème posée sur{" "}
          <code>@michaelthomasjach/liseuse-dashboard-kit</code>. Elle ne réécrit aucun composant : elle
          redéfinit les variables <code>--lq-*</code> qu'ils lisent tous, et leur donne le style graphique
          du CV de Michael Jach — un bleu électrique qui porte tout, Space Mono pour le texte, League
          Spartan pour les titres, aucun arrondi. Chaque page de ce Storybook rend le composant du kit à travers <code>ResumeTheme</code> :
          c'est ce que verra une application qui l'utilise.
        </p>
        <div className="rdk-home__actions">
          <Button selected icon={<ArrowRightIcon size={15} />} iconPosition="trailing" onClick={() => open("Primitives/Button")}>
            Parcourir les composants
          </Button>
          <Button onClick={() => open("Foundations/Variables du thème")}>Les variables du thème</Button>
          <Button onClick={() => window.open(SHOWCASE_URL, "_blank", "noopener")}>Ouvrir la vitrine</Button>
        </div>
        <p className="rdk-home__hint">
          La vitrine — le tableau de bord, les tableaux, les formulaires, les écrans d'application et une
          planche par famille de composants — est publiée à côté de ce Storybook, et se lance en local avec{" "}
          <code>npm run dev</code>. La bascule <strong>Surface</strong> de la barre d'outils fait passer
          toute cette page, et toutes les autres, en sombre.
        </p>
        <div className="rdk-home__stage-frame">
          <HeroDashboard />
        </div>
        <dl className="rdk-home__figures">
          <div>
            <dt>{componentCount}</dt>
            <dd>composants du kit documentés</dd>
          </div>
          <div>
            <dt>{index.pageCount || "—"}</dt>
            <dd>pages dans le menu</dd>
          </div>
          <div>
            <dt>{TOKEN_COUNT}</dt>
            <dd>variables redéfinies par le thème</dd>
          </div>
          <div>
            <dt>0</dt>
            <dd>ligne de logique de composant</dd>
          </div>
        </dl>
      </header>

      <section className="rdk-home__section">
        <SectionHead
          eyebrow="Le propos"
          title="Le CV, en tableau de bord."
          lead={
            <>
              La référence est le CV de Michael Jach, son site et sa version A4. Ses valeurs ne sont pas
              estimées : ce sont <strong>celles de ses variables CSS</strong> — le bleu <code>#3a41e2</code>,
              l'encre <code>#1b1d3a</code>, le gris <code>#6b6f8a</code>, le papier <code>#ebebeb</code> —
              reportées dans les variables du kit. La version nuit du site donne la surface sombre.
            </>
          }
        />
        <div className="rdk-home__pillars">
          <article className="rdk-home__pillar">
            <h3>Deux voix</h3>
            <p>Space Mono pour le texte, une chasse fixe qui donne l'air d'une fiche technique ; League Spartan grasse pour les titres et les intitulés, en capitales.</p>
          </article>
          <article className="rdk-home__pillar">
            <h3>Un seul bleu</h3>
            <p>Le bleu électrique du CV porte l'action, l'état sélectionné, les en-têtes de tableau et la barre latérale pleine ; les couleurs de série restent aux graphiques.</p>
          </article>
          <article className="rdk-home__pillar">
            <h3>Angles droits, filet bleu</h3>
            <p>Aucun arrondi, comme le CV. Le filet bleu de 4 px qui court sous son titre souligne ici la barre haute, et relie les jalons de la frise.</p>
          </article>
        </div>
      </section>

      <section className="rdk-home__section">
        <SectionHead
          eyebrow="Deux surfaces"
          title="Clair et sombre, une seule feuille."
          lead={
            <>
              Les deux tuiles ci-dessous contiennent les mêmes composants, chacune sous son propre{" "}
              <code>ResumeTheme</code>. Seul l'attribut <code>surface</code> change ; aucune classe
              conditionnelle n'est écrite nulle part.
            </>
          }
        />
        <div className="rdk-home__surfaces">
          {(["light", "dark"] as const).map((surface) => (
            <div key={surface} className="rdk-home__surface">
              <div className="rdk-home__surface-frame">
              <ResumeTheme surface={surface}>
                <div className="rdk-home__surface-body">
                  <StatCard label="Panier moyen" value={euro(2580)} delta={3.8} caption="vs. mois précédent" sparklineData={REVENUE_TREND} />
                  <div className="rdk-home__row">
                    <Badge tone="up">Payée</Badge>
                    <Badge tone="warning">En attente</Badge>
                    <Badge tone="down">Impayée</Badge>
                  </div>
                  <ProgressBar label="Objectif trimestriel" value={72} labelPosition="left" showValue />
                </div>
              </ResumeTheme>
              </div>
              <span className="rdk-home__surface-label">surface="{surface}"</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rdk-home__section">
        <SectionHead
          eyebrow="Fondations"
          title="Ce que le thème redéfinit."
          lead="Les couleurs, l'échelle typographique, les rayons et les espacements : tout passe par des variables, lues ici en direct. Changez de surface dans la barre d'outils, elles se repeignent."
        />
        <div className="rdk-home__foundations">
          <section className="rdk-home__found">
            <h3>Couleurs</h3>
            <ul className="rdk-home__swatches">
              {SWATCHES.map((token) => (
                <li key={token}>
                  <span className="rdk-home__chip" style={{ background: `var(${token})` }} />
                  <code>{token.replace(/^--(lq|rdk)-color-/, "")}</code>
                </li>
              ))}
            </ul>
          </section>
          <section className="rdk-home__found">
            <h3>Typographie</h3>
            <ul className="rdk-home__typescale">
              {TYPE_SCALE.map(({ token, sample }) => (
                <li key={token}>
                  <span style={{ fontSize: `var(${token})` }}>{sample}</span>
                  <code>{token}</code>
                </li>
              ))}
              <li>
                <span className="rdk-home__caption-sample">Petit titre de carte</span>
                <code>--lq-caption-*</code>
              </li>
            </ul>
          </section>
          <section className="rdk-home__found">
            <h3>Rayons et ombre</h3>
            <ul className="rdk-home__shapes">
              {SHAPES.map((token) => (
                <li key={token}>
                  <span className="rdk-home__shape" style={{ borderRadius: `var(${token})` }} />
                  <code>{token.replace("--lq-", "")}</code>
                </li>
              ))}
            </ul>
            <button type="button" className="rdk-home__link" onClick={() => open("Foundations/Variables du thème")}>
              Toutes les variables et leurs valeurs calculées
            </button>
          </section>
        </div>
      </section>

      <section className="rdk-home__section">
        <SectionHead
          eyebrow="En fonctionnement"
          title="Les composants, vivants, dans le thème."
          lead="Rien de ce qui suit n'est une capture : ce sont les composants du kit, avec leur état. Le nom sous chaque cadre ouvre sa documentation."
        />
        <div className="rdk-home__specimens">
          <Specimen name="LiveTile" title="Widgets/LiveTile" index={index}>
            <LiveTile
              height={190}
              interval={3200}
              faces={[
                { tag: "Vitrine", eyebrow: "npm run dev", title: "Trois écrans de référence", subtitle: "Vue d'ensemble, Tableaux, Formulaires" },
                { tag: "Thème", eyebrow: `${TOKEN_COUNT} variables`, title: "Clair et sombre", subtitle: "Une seule feuille, resume.css", background: "var(--lq-color-info)" },
                { tag: "Kit", eyebrow: `v${kitVersion}`, title: "La logique reste dans le kit", subtitle: "Ici, on ne décide que de l'apparence", background: "var(--rdk-color-text-strong)" },
              ]}
            />
          </Specimen>
          <Specimen name="BarChart" title="Charts/BarChart" index={index}>
            <BarChart data={SIGNUPS_BARS} height={190} formatValue={(v) => `${v}`} />
          </Specimen>
          <Specimen name="GaugeChart" title="Charts/GaugeChart" index={index}>
            <GaugeChart value={72} size={150} label="Objectif" formatValue={(v) => `${v} %`} />
          </Specimen>
          <Specimen name="NotificationMenu" title="Feedback/NotificationMenu" index={index}>
            <div className="rdk-home__row rdk-home__row--between">
              <span>Trois notifications, deux non lues</span>
              <NotificationMenu items={NOTIFICATIONS} title="Notifications" />
            </div>
          </Specimen>
          <Specimen name="AlertList" title="Feedback/AlertList" index={index} wide>
            <AlertList
              alerts={[
                { id: "a", level: "critical", message: "Trois factures dépassent 60 jours de retard." },
                { id: "b", level: "warning", message: "Le quota d'export mensuel est atteint à 90 %." },
                { id: "c", level: "info", message: "Nouvelle version du kit disponible." },
              ]}
            />
          </Specimen>
          <Specimen name="Sparkline · PriceChangeTag · Tag" title="Charts/Sparkline" index={index}>
            <div className="rdk-home__quotes">
              {[
                { name: "Revenu", data: REVENUE_TREND, delta: 12.4 },
                { name: "Clients", data: SIGNUPS_TREND, delta: -6.1 },
                { name: "Attrition", data: CHURN_TREND, delta: -1.2 },
              ].map((q) => (
                <div key={q.name} className="rdk-home__quote">
                  <span>{q.name}</span>
                  <Sparkline data={q.data} colorByTrend width={80} height={22} />
                  <PriceChangeTag value={q.delta} />
                </div>
              ))}
              <div className="rdk-home__row">
                <Tag>Octobre</Tag>
                <Tag onRemove={() => {}}>Clients actifs</Tag>
              </div>
            </div>
          </Specimen>
        </div>
        <div className="rdk-home__forms">
          <FormsSpecimen />
          <div className="rdk-home__forms-note">
            <h3>Les champs aussi.</h3>
            <p>
              Champs et boutons de 36 px, au filet de 1,5 px du site du CV, angles droits : le thème règle
              leurs dimensions par les variables <code>--lq-control-*</code>, <code>--lq-field-*</code> et{" "}
              <code>--lq-button-*</code> que le kit lit avec son propre rendu pour défaut.
            </p>
            <button type="button" className="rdk-home__link" onClick={() => open("Forms/Input/Input")}>
              La famille Forms
            </button>
          </div>
        </div>
      </section>

      <section className="rdk-home__section">
        <SectionHead
          eyebrow="Le catalogue"
          title="Le même menu que le kit."
          lead="Ce Storybook et celui du kit ont exactement les mêmes entrées : chaque page existe des deux côtés, l'une en e-ink, l'autre dans ce thème. Les comptes ci-dessous sont lus dans le menu lui-même."
        />
        <div className="rdk-home__families">
          {FAMILIES.map((f) => (
            <button key={f.name} type="button" className="rdk-home__family" onClick={() => open(f.open)}>
              <span className="rdk-home__family-head">
                <strong>{f.name}</strong>
                {index.pagesByFamily[f.name] ? <span className="rdk-home__count">{index.pagesByFamily[f.name]}</span> : null}
              </span>
              <span className="rdk-home__family-lead">{f.lead}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rdk-home__section">
        <SectionHead
          eyebrow="Prise en main"
          title="Un composant autour de l'application."
          lead={
            <>
              Un seul paquet : il ré-exporte tous les composants du kit et ajoute <code>ResumeTheme</code>,
              qui charge la feuille du kit, celle du thème et les deux polices (Space Mono, League Spartan,
              embarquées — rien n'est demandé à Google Fonts) et pose la classe <code>rdk</code>.
            </>
          }
        />
        <div className="rdk-home__code">
          <CodeBlock code={USAGE_SNIPPET} filename="App.tsx" highlight="javascript" showLineNumbers />
          <div className="rdk-home__code-side">
            <CodeBlock code={FONTS_SNIPPET} language="bash" />
            <CodeBlock code={SHOWCASE_SNIPPET} language="bash" />
          </div>
        </div>
      </section>

      <section className="rdk-home__section">
        <SectionHead
          eyebrow="Sous le capot"
          title="Comment la couche tient."
          lead="Trois règles, et l'architecture entière en découle."
        />
        <div className="rdk-home__pillars">
          <article className="rdk-home__pillar">
            <h3>Strictement plus spécifique</h3>
            <p>
              Le thème redéfinit les variables sous <code>.rdk.lq-root[data-lq-palette][data-lq-surface]</code>,
              un point de spécificité au-dessus du kit : il gagne quel que soit l'ordre de chargement des
              feuilles, que les bundlers réorganisent sans prévenir.
            </p>
          </article>
          <article className="rdk-home__pillar">
            <h3>Des variables optionnelles</h3>
            <p>
              Pour les petits titres, les champs, la barre latérale et les lignes de données, le kit lit
              aussi des variables facultatives (<code>--lq-label-*</code>, <code>--lq-caption-*</code>,{" "}
              <code>--lq-control-*</code>, <code>--lq-sidebar-*</code>…) dont le défaut est son propre rendu.
            </p>
          </article>
          <article className="rdk-home__pillar">
            <h3>La logique reste au kit</h3>
            <p>
              Un correctif, une prop, un composant manquant se font dans le kit ; la couleur, la taille et
              l'espace se font ici. Les tables de props sont extraites des types du kit
              (<code>npm run docgen</code>) : elles décrivent ce qui est rendu.
            </p>
          </article>
        </div>
      </section>

      <p className="rdk-home__footnote">
        <code>resume-dashboard-kit</code> · thème « resume » sur <code>@michaelthomasjach/liseuse-dashboard-kit</code>{" "}
        v{kitVersion}. Ce Storybook lit le source du kit voisin ; la vitrine utilise le paquet publié.
      </p>
    </div>
  );
}
