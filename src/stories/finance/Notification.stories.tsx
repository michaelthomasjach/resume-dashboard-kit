import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  Notification,
  NotificationProvider,
  NotificationSource,
  useNotification,
  Button,
  FileIcon,
  type NotificationBarPosition,
  type NotificationCorner,
  type NotificationOptions,
} from "@michaelthomasjach/liseuse-dashboard-kit";

/** Les boutons de commande d'une story, au centre du cadre : les coins restent aux notifications. */
function Stage({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: 280, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "center" }}>
      {children}
    </div>
  );
}

/** Pousse une série de notifications au montage, une seule fois — pour montrer un état sans clic. */
function NotifyOnMount({ items }: { items: NotificationOptions[] }) {
  const { notify } = useNotification();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    items.forEach((item) => notify(item));
  }, [items, notify]);
  return null;
}

const CORNERS: { id: NotificationCorner; label: string }[] = [
  { id: "top-left", label: "Haut gauche" },
  { id: "top-right", label: "Haut droite" },
  { id: "bottom-left", label: "Bas gauche" },
  { id: "bottom-right", label: "Bas droite" },
];

const TONES: NotificationOptions[] = [
  { tone: "neutral", title: "Brouillon enregistré", description: "Ton neutre : aucune icône par défaut." },
  { tone: "success", title: "Virement reçu", description: "14 400,00 € de Lemoine SAS." },
  { tone: "info", title: "Relevé d'octobre disponible", description: "Il couvre la période du 1er au 31." },
  { tone: "warning", title: "Rapprochement en retard", description: "Trois relevés non importés." },
  { tone: "error", title: "Prélèvement rejeté", description: "Studio Bélier, 2 880,00 €." },
];

/**
 * La notification autonome, contrôlée. Pour une file de messages passagers, voir
 * `NotificationProvider`.
 */
const meta = {
  title: "Feedback/Notification",
  component: Notification,
  parameters: {
    layout: "fullscreen", rdkPadding: 0,
    // Une notification est en position fixe : chaque story a son propre cadre, pour qu'elle se pose
    // dans les coins de ce cadre et non par-dessus la page de documentation.
    docs: {
      story: { inline: false, iframeHeight: "360px" },
      description: {
        component: [
          "Message ponctuel qui **informe d'un événement** — un virement reçu, un export terminé, un prélèvement rejeté — sans interrompre le travail (popin de coin, barre) ou en l'interrompant (modale).",
          "",
          "### Deux façons de l'employer",
          "",
          "- **`Notification` autonome** (cette page) — un composant **contrôlé** : vous tenez `open` et vous le repassez à `false` dans `onClose`. Pour **un** message dont vous maîtrisez la vie : un bandeau de maintenance, une alerte qui attend une décision, un résultat d'action affiché tant qu'on ne l'a pas lu. Pas de provider nécessaire.",
          "- **`NotificationProvider` + `useNotification().notify()`** — pour une **file** de messages passagers, déclenchés de n'importe où dans l'application. C'est le cas le plus courant ; voir sa page. Deux `Notification` autonomes au même coin se **superposent** : seul le provider sait les empiler.",
          "",
          "### Variantes (`variant`)",
          "",
          "| Variante | Rendu | Position |",
          "|---|---|---|",
          "| `corner` (défaut) | popin de 360 px au plus, posée dans un coin | `corner` : `bottom-right` (défaut), `bottom-left`, `top-right`, `top-left` — à 20 px des bords |",
          "| `bar` | bandeau pleine largeur (720 px au plus, centré), collé à un bord | `barPosition` : `top` (défaut) ou `bottom` |",
          "| `modal` | carte centrée sur un voile qui couvre la page | — |",
          "",
          "### Tons (`tone`)",
          "",
          "`neutral` (défaut, sans icône), `success`, `info`, `warning`, `error`. Le ton pose une icône (coche, « i » cerclé, triangle, point d'exclamation cerclé) et la couleur du liseré — à gauche de la carte, en haut de la barre. `icon` remplace l'icône du ton, et en donne une au ton neutre.",
          "",
          "### Contenu",
          "",
          "`title` (en gras), `description` (un `ReactNode` : paragraphe, ligne de source `NotificationSource`…), `actions` (une rangée de boutons ou de liens — un clic dessus ne ferme pas la carte d'office) et `meta` (un texte court à l'opposé des actions, typiquement l'heure). Sans `actions` ni `meta`, pas de pied de carte.",
          "",
          "### Durée et fermeture",
          "",
          "- `autoDismissMs` ferme la carte après ce délai. **Omis ou à 0, elle reste** jusqu'à ce qu'on la ferme — c'est le défaut de la notification autonome (le provider, lui, met 4 s par défaut).",
          "- Pendant le compte à rebours, une **barre de progression** se vide au pied de la carte (`showProgress`, vrai par défaut). **Survoler** la carte met le compte à rebours en pause ; il reprend là où il s'était arrêté.",
          "- La carte se ferme par sa croix (`dismissible`, vrai par défaut, libellée « Fermer »), à la fin du délai, par un clic sur le voile (modale) ou après `onClick`. Dans tous les cas c'est `onClose` qui est appelé : à vous de passer `open` à `false`.",
          "- `onClick` rend **toute la carte cliquable** — focalisable, activable à Entrée ou Espace — sauf sa croix et ses actions ; il est appelé, puis la carte se ferme. Pour « ouvrir l'élément dont parle l'alerte ».",
          "",
          "### Accessibilité",
          "",
          "La carte porte `role=\"status\"` : un lecteur d'écran l'annonce sans couper la parole. La variante `modal` est un **vrai dialogue** : `role=\"dialog\"` et `aria-modal`, nommé par `title`, focus posé dedans à l'ouverture et piégé tant qu'elle est ouverte, rendu à l'élément d'origine à la fermeture ; Échap et un clic sur le voile la ferment.",
          "",
          "### Rendu",
          "",
          "La notification autonome se rend **à sa place dans l'arbre** (pas de portail), en position fixe : elle hérite donc directement du thème. Un ancêtre qui porte un `transform` la confine à lui.",
          "",
          "### Thème",
          "",
          "`--lq-color-panel`, `--lq-color-border`, `--lq-radius-md` (0 dans ce thème), `--lq-shadow-modal` (l'ombre large sous laquelle le CV flotte sur son fond) ; le liseré : `--lq-color-up`, `--lq-color-info`, `--lq-color-warning`, `--lq-color-down` ; la barre de progression : `--lq-color-accent` ; le voile : `--lq-color-overlay` ; la distance aux bords : `--lq-space-5` ; le texte secondaire : `--lq-color-text-muted`.",
        ].join("\n"),
      },
    },
  },
  args: {
    open: true,
    onClose: fn(),
    variant: "corner",
    corner: "bottom-right",
    barPosition: "top",
    tone: "success",
    title: "Virement reçu",
    description: "14 400,00 € de Lemoine SAS crédités sur le compte courant.",
    meta: "09:42",
    dismissible: true,
    showProgress: true,
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["corner", "bar", "modal"], table: { defaultValue: { summary: '"corner"' } } },
    corner: { control: "select", options: ["top-left", "top-right", "bottom-left", "bottom-right"], if: { arg: "variant", eq: "corner" } },
    barPosition: { control: "inline-radio", options: ["top", "bottom"], if: { arg: "variant", eq: "bar" } },
    tone: { control: "inline-radio", options: ["neutral", "success", "info", "warning", "error"], table: { defaultValue: { summary: '"neutral"' } } },
    title: { control: "text" },
    description: { control: "text" },
    meta: { control: "text" },
    autoDismissMs: { control: { type: "number", min: 0, step: 1000 } },
    icon: { control: false },
    actions: { control: false },
    onClick: { control: false },
  },
  // La story tient `open` : la croix et le délai ferment vraiment, et le bouton rouvre.
  render: function Render(args) {
    const [open, setOpen] = useState(args.open);
    useEffect(() => setOpen(args.open), [args.open]);
    return (
      <Stage>
        <Button onClick={() => setOpen(true)}>Réafficher</Button>
        <Notification
          {...args}
          open={open}
          onClose={() => {
            setOpen(false);
            args.onClose();
          }}
        />
      </Stage>
    );
  },
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Tones: Story = {
  name: "Les cinq tons",
  render: () => (
    <NotificationProvider>
      <NotifyOnMount items={TONES.map((t) => ({ ...t, autoDismissMs: 0 }))} />
      <Stage>
        <span style={{ color: "var(--lq-color-text-muted)" }}>Les cinq tons, empilés dans le coin bas-droit.</span>
      </Stage>
    </NotificationProvider>
  ),
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: "460px" },
      description: {
        story:
          "Neutre, succès, information, avertissement, erreur. Pour les montrer ensemble, cette story passe par `NotificationProvider` : cinq `Notification` autonomes au même coin se recouvriraient. Elles restent affichées grâce à `autoDismissMs: 0`.",
      },
    },
  },
};

export const Corners: Story = {
  name: "Les quatre coins",
  render: function Render() {
    const [corner, setCorner] = useState<NotificationCorner>("top-right");
    const [open, setOpen] = useState(true);
    return (
      <Stage>
        {CORNERS.map((c) => (
          <Button
            key={c.id}
            selected={open && c.id === corner}
            onClick={() => {
              setCorner(c.id);
              setOpen(true);
            }}
          >
            {c.label}
          </Button>
        ))}
        <Notification
          open={open}
          onClose={() => setOpen(false)}
          corner={corner}
          tone="info"
          title="Relevé d'octobre disponible"
          description="Il couvre la période du 1er au 31 octobre."
        />
      </Stage>
    );
  },
  parameters: { docs: { description: { story: "`corner` ancre la popin à 20 px des bords (`--lq-space-5`). Dans une application, gardez **un** coin pour tous vos messages." } } },
};

export const Bar: Story = {
  name: "Barre",
  render: function Render() {
    const [position, setPosition] = useState<NotificationBarPosition>("top");
    const [open, setOpen] = useState(true);
    return (
      <Stage>
        {(["top", "bottom"] as const).map((p) => (
          <Button
            key={p}
            selected={open && p === position}
            onClick={() => {
              setPosition(p);
              setOpen(true);
            }}
          >
            {p === "top" ? "En haut" : "En bas"}
          </Button>
        ))}
        <Notification
          open={open}
          onClose={() => setOpen(false)}
          variant="bar"
          barPosition={position}
          tone="warning"
          title="Maintenance planifiée"
          description="Le rapprochement bancaire sera indisponible dimanche de 2 h à 4 h."
        />
      </Stage>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Un bandeau pour ce qui concerne toute l'application (maintenance, connexion perdue, période d'essai). Le liseré de ton passe en haut de la carte. Sans `autoDismissMs`, il reste jusqu'à ce qu'on le ferme.",
      },
    },
  },
};

export const Modal: Story = {
  name: "Modale",
  render: function Render() {
    const [open, setOpen] = useState(true);
    return (
      <Stage>
        <Button onClick={() => setOpen(true)}>Ouvrir la modale</Button>
        <Notification
          open={open}
          onClose={() => setOpen(false)}
          variant="modal"
          tone="error"
          title="Prélèvement rejeté"
          description={"La banque de Studio Bélier a refusé le prélèvement de 2 880,00 € du 26 octobre."}
          actions={
            <>
              <Button selected onClick={() => setOpen(false)}>
                Compris
              </Button>
              <Button onClick={() => setOpen(false)}>Relancer le client</Button>
            </>
          }
        />
      </Stage>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Un voile couvre la page ; la carte se ferme par sa croix, par un clic sur le voile, ou par vos actions. **Échap ne la ferme pas** et le focus n'y est pas retenu — pour une vraie confirmation, prenez `Modal`.",
      },
    },
  },
};

export const AutoDismiss: Story = {
  name: "Fermeture automatique",
  render: function Render() {
    const [withBar, setWithBar] = useState(true);
    const [withoutBar, setWithoutBar] = useState(true);
    return (
      <Stage>
        <Button
          onClick={() => {
            setWithBar(true);
            setWithoutBar(true);
          }}
        >
          Réafficher les deux
        </Button>
        <Notification
          open={withBar}
          onClose={() => setWithBar(false)}
          corner="bottom-left"
          tone="success"
          title="Export terminé"
          description="Avec barre de progression — survolez pour suspendre."
          autoDismissMs={8000}
        />
        <Notification
          open={withoutBar}
          onClose={() => setWithoutBar(false)}
          corner="bottom-right"
          tone="success"
          title="Export terminé"
          description="Sans barre de progression (showProgress={false})."
          autoDismissMs={8000}
          showProgress={false}
        />
      </Stage>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "`autoDismissMs={8000}` : les deux cartes se ferment au bout de 8 s. Le pointeur posé sur une carte suspend son compte à rebours, qui reprend où il en était. La barre d'accent au pied de la carte est `showProgress`.",
      },
    },
  },
};

export const ActionsAndClick: Story = {
  name: "Actions, horodatage, carte cliquable",
  args: {
    corner: "bottom-right",
    tone: "info",
    title: "Nouveau relevé de Groupe Vallée",
    description: "Cliquez la carte pour ouvrir le relevé.",
    meta: "09:42",
    onClick: fn(),
    actions: (
      <a href="#releve" onClick={(e) => e.preventDefault()}>
        Télécharger
      </a>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "`actions` et `meta` forment le pied de la carte. Avec `onClick`, toute la carte devient un bouton (Tab, Entrée, Espace) qui appelle `onClick` puis se ferme ; la croix et les actions gardent leur propre comportement.",
      },
    },
  },
};

export const CustomIcon: Story = {
  name: "Icône et source",
  args: {
    tone: "neutral",
    icon: <FileIcon size={16} />,
    title: "Actualité sur Airbus",
    description: (
      <>
        <NotificationSource badges={["R"]} name="Reuters" />
        <p style={{ margin: 0 }}>Airbus relève son objectif de livraisons pour le quatrième trimestre.</p>
      </>
    ),
    meta: "10:05",
  },
  parameters: {
    docs: {
      description: {
        story:
          "`icon` remplace l'icône du ton — et en donne une au ton neutre, qui n'en a pas. `NotificationSource` (exporté à part) pose une ligne « pastilles + nom de la source » en tête de `description`, pour une notification de type dépêche.",
      },
    },
  },
};
