import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Quickview, Button, Text, PanelRow, Avatar, Badge, Input, Checkbox, type QuickviewProps } from "@michaelthomasjach/liseuse-dashboard-kit";

type QuickviewTab = NonNullable<QuickviewProps["tabs"]>[number];

const NOTES = [
  { titre: "Relancer Lemoine SAS", texte: "Facture d'octobre toujours impayée, relance par téléphone jeudi.", date: "29 oct." },
  { titre: "Atelier utilisateurs", texte: "Recherche, export, lisibilité sur tablette : à prioriser.", date: "26 oct." },
  { titre: "Recette lot 1", texte: "Prévoir deux demi-journées avec Hugo.", date: "22 oct." },
];

const ALERTES: { titre: string; detail: string; tone: "down" | "warning" | "info" }[] = [
  { titre: "Serveur de recette injoignable", detail: "depuis 08:12", tone: "down" },
  { titre: "Stock bas : ruban adhésif", detail: "12 unités", tone: "warning" },
  { titre: "Sauvegarde terminée", detail: "03:00", tone: "info" },
];

const CONTACTS = ["Camille Roux", "Hugo Lambert", "Inès Morel", "Léa Fontaine", "Nathan Girard"];

const notes = NOTES.map((n) => (
  <div key={n.titre} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <Text weight="bold" size="sm">
      {n.titre}
    </Text>
    <Text size="sm">{n.texte}</Text>
    <Text size="xs" muted>
      {n.date}
    </Text>
  </div>
));

const alertes = (
  <div>
    {ALERTES.map((a) => (
      <PanelRow key={a.titre} label={a.titre} value={<Badge tone={a.tone}>{a.detail}</Badge>} />
    ))}
  </div>
);

/** Les trois onglets du panneau de démonstration : notes, alertes, discussion. */
const TABS: QuickviewTab[] = [
  { id: "notes", label: "Notes", content: notes },
  { id: "alertes", label: "Alertes", content: alertes },
  {
    id: "discussion",
    label: "Discussion",
    content: CONTACTS.map((name) => (
      <div key={name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar name={name} size={32} />
        <div>
          <Text size="sm" weight="medium">
            {name}
          </Text>
          <Text size="xs" muted>
            En ligne
          </Text>
        </div>
      </div>
    )),
  },
];

/** Sur le canevas seul, la story ouvre le panneau. */
const openFirstButton = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  canvasElement.querySelector<HTMLButtonElement>("button")?.click();
};

/**
 * Le panneau latéral glissant : notes, alertes, discussion, détail d'un élément, sans quitter la page.
 */
const meta = {
  title: "Widgets/Quickview",
  component: Quickview,
  parameters: {
    docs: {
      description: {
        component: [
          "Un **panneau latéral** qui glisse depuis le bord de l'écran par-dessus la page, sur toute sa hauteur : une barre de tête (titre, onglets, croix), un corps qui défile seul, un pied fixe facultatif. Le panneau « quickview » qu'ouvre la barre haute de la vitrine.",
          "",
          "**Quand l'utiliser** — un contenu d'appoint qu'on consulte sans quitter la page : notes, alertes, contacts, le détail ou l'édition rapide d'une ligne. Pour une décision qui doit interrompre, `Modal` ; pour un contenu ancré à un bouton, `Popover` ; pour la navigation principale, `SidebarLayout`.",
          "",
          "**Toujours contrôlé** — `open` et `onClose` sont obligatoires. `onClose` est appelé par la croix, la touche **Échap** et un clic sur le voile. À la fermeture, le panneau repart vers son bord avant de disparaître.",
          "",
          "**Placement** — `side` : `right` (défaut) ou `left`. `width` : un nombre de pixels ou une longueur CSS (défaut 320 px, jamais plus large que l'écran).",
          "",
          "**Contenu** — `title` en tête ; `tabs` (`id`, `label`, `icon`, `disabled`, `content`) place des onglets `Tabs` dans la barre — sous le titre s'il y en a un, à sa place sinon — et le corps montre l'onglet actif, puis `children`. Onglet contrôlé avec `activeTab` + `onTabChange`, ou libre avec `defaultTab` (le premier par défaut). `footer` : un pied fixe (Annuler / Enregistrer, un champ de saisie…).",
          "",
          "**Modal ou non** — `modal` (défaut) : un voile couvre la page, un clic dessus ferme, le focus est **piégé** dans le panneau (Tab et Maj+Tab bouclent) et rendu à l'élément d'origine à la fermeture. `modal={false}` : pas de voile, la page reste utilisable à côté, le focus n'est pas retenu ; Échap ferme toujours.",
          "",
          "**Accessibilité** — `role=\"dialog\"`, `aria-modal` en mode modal, nommé par `title` (ou `ariaLabel` sans titre). Le focus va au panneau à l'ouverture. Le corps d'un panneau à onglets est un `tabpanel`. `closeLabel` nomme la croix (« Fermer »).",
          "",
          "**Rendu dans un portail** vers `document.body`, comme `Modal` : il reprend palette, surface, police et la classe de thème de l'application, donc le thème « resume » s'y applique. Couche 1200 : au-dessus de la barre latérale, sous un menu contextuel, une modale ou un popover qu'on ouvre depuis le panneau.",
          "",
          "**Mouvement** — glisse en 260 ms (courbe d'accélération douce) ; aucune animation en palette e-ink ni quand le système demande moins de mouvement.",
          "",
          "**Thème** — `--lq-color-panel`, `--lq-color-text`, `--lq-color-text-muted`, `--lq-color-overlay` (voile), `--lq-shadow-modal`, `--lq-color-panel-border` (bord côté page), `--lq-color-border-subtle` (filets de tête et de pied), `--lq-color-hover` et `--lq-color-focus-ring` (croix), `--lq-text-h5` (titre), `--lq-caption-*` (onglets), `--lq-space-*`. Variables propres, optionnelles : `--lq-quickview-width` (320 px), `--lq-quickview-head-height` (48 px), `--lq-quickview-padding` (`--lq-space-4`), `--lq-quickview-shadow`, `--lq-quickview-z-index` (1200). La barre de tête porte `data-lq-region=\"quickview-head\"` : un thème peut y redéfinir les couleurs, comme pour la barre latérale. Ce thème y met la colonne bleue du CV : barre de tête `#3a41e2`, texte blanc, onglets au repos à 78 % de blanc.",
        ].join("\n"),
      },
    },
  },
  args: {
    open: false,
    onClose: fn(),
    onTabChange: fn(),
    ariaLabel: "Panneau rapide",
    tabs: TABS,
    side: "right",
    modal: true,
    closeLabel: "Fermer",
  },
  argTypes: {
    open: { control: false },
    title: { control: "text" },
    ariaLabel: { control: "text" },
    side: { control: "inline-radio", options: ["right", "left"], table: { defaultValue: { summary: '"right"' } } },
    width: { control: "number" },
    tabs: { control: false },
    activeTab: { control: "inline-radio", options: [undefined, ...TABS.map((t) => t.id)] },
    defaultTab: { control: "inline-radio", options: TABS.map((t) => t.id) },
    children: { control: false },
    footer: { control: false },
    modal: { control: "boolean", table: { defaultValue: { summary: "true" } } },
    closeLabel: { control: "text" },
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ minHeight: 320 }}>
        <Button onClick={() => setOpen(true)}>Ouvrir le panneau</Button>
        <Quickview
          {...args}
          open={open}
          onClose={() => {
            setOpen(false);
            args.onClose();
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof Quickview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Onglets",
  play: openFirstButton,
  parameters: {
    docs: {
      description: {
        story: "Le panneau de la vitrine : trois onglets dans la barre de tête, sans titre (`ariaLabel` le nomme). Voile, focus piégé ; Échap, la croix ou un clic sur le voile ferment.",
      },
    },
  },
};

export const NonModal: Story = {
  name: "Non modal",
  args: { tabs: undefined, title: "Alertes", modal: false, width: 300, children: alertes },
  play: openFirstButton,
  parameters: {
    docs: {
      description: {
        story: "`modal={false}` : pas de voile, la page reste cliquable à côté du panneau et le focus n'y est pas retenu. C'est le comportement d'un panneau d'appoint qu'on garde ouvert en travaillant.",
      },
    },
  },
};

export const LeftSide: Story = {
  name: "Bord gauche",
  args: { tabs: undefined, title: "Notes", side: "left", children: notes },
  play: openFirstButton,
  parameters: { docs: { description: { story: "`side=\"left\"` : le panneau glisse depuis le bord gauche, son bord vers la page à droite." } } },
};

export const WithFooter: Story = {
  name: "Avec pied",
  args: { tabs: undefined, title: "Lemoine SAS", width: 380 },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const [notify, setNotify] = useState(true);
    const close = () => {
      setOpen(false);
      args.onClose();
    };
    return (
      <div style={{ minHeight: 320 }}>
        <Button onClick={() => setOpen(true)}>Modifier le client</Button>
        <Quickview
          {...args}
          open={open}
          onClose={close}
          footer={
            <>
              <Button onClick={close}>Annuler</Button>
              <Button selected onClick={close}>
                Enregistrer
              </Button>
            </>
          }
        >
          <Input label="Raison sociale" defaultValue="Lemoine SAS" />
          <Input label="Contact" defaultValue="Paul Lemoine" />
          <Input label="Adresse électronique" type="email" defaultValue="paul@lemoine.exemple" />
          <Checkbox checked={notify} onChange={setNotify} label="Envoyer les factures par courriel" />
        </Quickview>
      </div>
    );
  },
  play: openFirstButton,
  parameters: {
    docs: {
      description: {
        story: "Un titre, un petit formulaire dans le corps qui défile, et `footer` : un pied fixe avec les deux actions. L'édition rapide d'une ligne sans quitter la liste.",
      },
    },
  },
};
