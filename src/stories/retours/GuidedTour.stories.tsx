import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  Badge,
  Button,
  Card,
  Chip,
  GuidedTour,
  Input,
  SearchIcon,
  SettingsIcon,
  SparkleIcon,
  Text,
  type GuidedTourStep,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { ORDERS, statutTone } from "../../showcase/demoData";

const euro = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

/** La visite poussée dans `document.body` couvrirait la page de documentation : chaque story y est
 *  rendue dans son propre cadre, assez haut pour l'écran factice et la carte. */
const IN_FRAME = { docs: { story: { inline: false, iframeHeight: 560 } } };

const VISITE: GuidedTourStep[] = [
  {
    id: "accueil",
    title: "Bienvenue dans votre espace de facturation",
    body: "En quelques étapes, le tour de l'essentiel : chercher, suivre, agir.",
    media: <SparkleIcon size={28} />,
  },
  { id: "recherche", selector: "[data-tour='recherche']", title: "Tout se cherche ici", body: "Un client, une facture, une commande : tapez quelques lettres." },
  { id: "chiffres", selector: "[data-tour='chiffres']", title: "Les chiffres du mois", body: "Encaissé et en attente, mis à jour chaque nuit.", placement: "below" },
  { id: "commandes", selector: "[data-tour='commandes']", title: "Les dernières commandes", body: "Un clic sur une ligne ouvre la commande. Rien n'est bloqué pendant la visite : essayez.", placement: "left" },
  { id: "reglages", selector: "[data-tour='reglages']", title: "Les réglages", body: "Relances automatiques, modèles de facture, utilisateurs.", media: <SettingsIcon size={22} /> },
  { id: "fin", title: "À vous de jouer", body: "La visite se relance depuis le menu d'aide, à tout moment." },
];

/** Un petit écran de facturation factice, dont les blocs portent les `data-tour` que vise la visite. */
function EcranFactice({ onRelaunch, journal, vue, onVue }: { onRelaunch: () => void; journal: string; vue?: "commandes" | "stats"; onVue?: (v: "commandes" | "stats") => void }) {
  const encaisse = ORDERS.filter((o) => o.statut === "payée").reduce((s, o) => s + o.montant, 0);
  const attente = ORDERS.filter((o) => o.statut === "en attente").reduce((s, o) => s + o.montant, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div data-tour="recherche" style={{ width: 300 }}>
          <Input size="small" placeholder="Rechercher…" leadingIcon={<SearchIcon size={14} />} aria-label="Rechercher" />
        </div>
        <span style={{ flex: 1 }} />
        <Button onClick={onRelaunch} icon={<SparkleIcon size={16} />}>
          Relancer la visite
        </Button>
        <span data-tour="reglages" style={{ display: "inline-flex" }}>
          <Button icon={<SettingsIcon size={16} />}>Réglages</Button>
        </span>
      </div>
      <div data-tour="chiffres" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="Encaissé">
          <Text size="xl" weight="medium">
            {euro(encaisse)}
          </Text>
        </Card>
        <Card title="En attente">
          <Text size="xl" weight="medium">
            {euro(attente)}
          </Text>
        </Card>
      </div>
      {onVue ? (
        <div style={{ display: "flex", gap: 4 }}>
          <Chip selected={vue === "commandes"} onClick={() => onVue("commandes")}>
            Commandes
          </Chip>
          <Chip selected={vue === "stats"} onClick={() => onVue("stats")}>
            Statistiques
          </Chip>
        </div>
      ) : null}
      {vue === "stats" ? (
        <div data-tour="stats" style={{ width: 360 }}>
          <Card title="Statistiques">
            <Text size="sm">{ORDERS.length} commandes ce mois-ci, panier moyen {euro((encaisse + attente) / ORDERS.length)}.</Text>
          </Card>
        </div>
      ) : (
        <div data-tour="commandes">
          <Card title="Dernières commandes">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ORDERS.slice(0, 4).map((o) => (
                <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Text size="sm" muted>
                    {o.id}
                  </Text>
                  <Text size="sm">{o.client}</Text>
                  <span style={{ flex: 1 }} />
                  <Text size="sm">{euro(o.montant)}</Text>
                  <Badge tone={statutTone(o.statut)}>{o.statut}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      <Text size="sm" muted>
        {journal}
      </Text>
    </div>
  );
}

/**
 * La visite guidée : une carte qui se déplace d'un élément de l'écran à l'autre pour le présenter.
 */
const meta = {
  title: "Feedback/GuidedTour",
  component: GuidedTour,
  parameters: {
    ...IN_FRAME,
    docs: {
      ...IN_FRAME.docs,
      description: {
        component: [
          "La visite guidée d'une application : une **carte qui se déplace**. Au lieu d'empiler des fenêtres au milieu de l'écran — qui expliquent l'application en la cachant —, elle se pose **à côté** de ce qu'elle décrit, entoure la cible d'un anneau de l'accent et glisse d'une cible à la suivante ; l'œil suit la carte. Rien n'est bloqué : l'anneau et le voile laissent passer le pointeur, on peut cliquer la chose montrée sans fermer la visite.",
          "",
          "**Quand l'utiliser** — la première visite d'un écran riche, ou la présentation d'une nouveauté. Pour une aide ponctuelle sur un élément, une infobulle (`Tooltip`) ; pour une information à confirmer, une `Modal`. Gardez la visite courte : quatre à six étapes.",
          "",
          "**Les étapes** — chacune a un `title`, un `body` (un nœud), une `media` facultative (icône, illustration) au-dessus du titre, et un `selector` CSS qui désigne sa cible. Sans `selector` (ou avec `placement: \"center\"`), l'étape est un moment d'**accueil**, centré sur un voile léger. `placement` (`auto` par défaut : là où il y a la place) force un côté : `right`, `left`, `below`, `above`. La carte suit sa cible si la page défile ou si la cible bouge.",
          "",
          "**Préparer l'écran** — `onEnter` est appelé **avant** l'étape (et attendu s'il rend une promesse) : changer d'onglet, déplier un panneau. La visite attend ensuite que la cible apparaisse, au plus `waitMs` (1 500 ms). Une cible qui n'apparaît jamais ne fait pas sauter l'étape : elle est montrée au centre.",
          "",
          "**Contrôlé** — l'appelant tient `open` et le repasse à `false` dans `onClose`, appelé par la croix, « Passer la visite », Échap, ou à la fin. `onFinish` signale qu'on est allé jusqu'au bout (avant `onClose`), `onStepChange(index, étape)` chaque étape montrée, `initialIndex` l'étape de départ. `labels` remplace les textes des boutons (« Suivant », « Précédent », « C'est parti ! », « Passer la visite », « Fermer »).",
          "",
          "**Clavier et mobile** — Échap ferme, ← et → passent d'une étape à l'autre. La carte est un `role=\"dialog\"`, modal seulement pour les étapes centrées. Sous 640 px de large, elle devient une feuille accrochée au bas de l'écran, et la page défile pour garder la cible visible au-dessus.",
          "",
          "**Portail** — carte, anneau et voile sont rendus sous `document.body`, en position fixe. Dans cette documentation, chaque story est donc isolée dans son propre cadre.",
          "",
          "**Thème** — carte en `--lq-color-panel` bordée de `--lq-color-border`, angles `--lq-radius-md`, ombre `--lq-shadow-modal`, marges `--lq-space-4` ; anneau et bouton principal en `--lq-color-accent` ; points d'étape sur `--lq-color-fill-track` ; le voile et le projecteur autour de la cible sont tirés de `--lq-color-overlay` (moitié et tiers de son opacité) : ils assombrissent l'écran en surface sombre comme en claire.",
        ].join("\n"),
      },
    },
  },
  args: {
    open: true,
    steps: VISITE,
    onClose: fn(),
    onFinish: fn(),
    onStepChange: fn(),
  },
  argTypes: {
    open: { control: false },
    steps: { control: false },
    onClose: { control: false },
    onFinish: { control: false },
    onStepChange: { control: false },
    labels: { control: "object" },
  },
  render: function Render(args) {
    const [open, setOpen] = useState(args.open);
    const [journal, setJournal] = useState("Échap ferme la visite, ← et → passent d'une étape à l'autre.");
    return (
      <>
        <EcranFactice onRelaunch={() => setOpen(true)} journal={journal} />
        <GuidedTour
          {...args}
          open={open}
          onClose={() => {
            setOpen(false);
            args.onClose();
          }}
          onFinish={() => {
            setJournal("Visite terminée.");
            args.onFinish?.();
          }}
          onStepChange={(i, step) => {
            setJournal(`Étape ${i + 1} sur ${args.steps.length} : ${step.title}`);
            args.onStepChange?.(i, step);
          }}
        />
      </>
    );
  },
} satisfies Meta<typeof GuidedTour>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "La visite commence par une étape d'accueil centrée, puis se pose à côté de la recherche, des chiffres, de la liste et des réglages." } } },
};

export const OnTarget: Story = {
  name: "Sur une cible",
  args: { initialIndex: 2 },
  parameters: { docs: { description: { story: "`initialIndex` ouvre directement la troisième étape : l'anneau entoure les tuiles de chiffres, la carte se pose dessous (`placement: \"below\"`)." } } },
};

export const PrepareStep: Story = {
  name: "Étape qui prépare l'écran",
  args: { initialIndex: 1 },
  parameters: {
    docs: {
      description: {
        story: "La deuxième étape montre un bloc qui n'existe que dans la vue « Statistiques » : son `onEnter` change de vue avant qu'elle s'affiche. La troisième vise une cible absente : elle est montrée au centre après 600 ms d'attente (`waitMs`).",
      },
    },
  },
  render: function Render(args) {
    const [open, setOpen] = useState(args.open);
    const [vue, setVue] = useState<"commandes" | "stats">("commandes");
    const [journal, setJournal] = useState("La vue « Commandes » est affichée.");
    const steps: GuidedTourStep[] = [
      { id: "liste", selector: "[data-tour='commandes']", title: "La liste", body: "Les dernières commandes, dans la vue « Commandes ».", onEnter: () => setVue("commandes") },
      {
        id: "stats",
        selector: "[data-tour='stats']",
        title: "Les statistiques",
        body: "Cette vue s'est ouverte toute seule : l'étape a changé d'onglet avant de s'afficher.",
        placement: "right",
        onEnter: () => setVue("stats"),
      },
      { id: "absente", selector: "[data-tour='nulle-part']", title: "Une cible absente", body: "Sa cible n'apparaît jamais : l'étape est montrée au centre plutôt que sautée.", waitMs: 600 },
    ];
    return (
      <>
        <EcranFactice onRelaunch={() => setOpen(true)} journal={journal} vue={vue} onVue={setVue} />
        <GuidedTour
          {...args}
          steps={steps}
          open={open}
          onClose={() => {
            setOpen(false);
            args.onClose();
          }}
          onStepChange={(i, step) => {
            setJournal(`Étape ${i + 1} sur ${steps.length} : ${step.title}`);
            args.onStepChange?.(i, step);
          }}
        />
      </>
    );
  },
};

export const CustomLabels: Story = {
  name: "Libellés personnalisés",
  args: { initialIndex: 5, labels: { previous: "Retour", finish: "Commencer", skip: "Plus tard", close: "Fermer la visite" } },
  parameters: { docs: { description: { story: "`labels` remplace les textes des boutons ; ici la dernière étape, dont le bouton final dit « Commencer »." } } },
};

export const Closed: Story = {
  name: "Fermée au départ",
  args: { open: false },
  parameters: { docs: { description: { story: "Fermée, la visite ne rend rien ; le bouton « Relancer la visite » l'ouvre." } } },
};
