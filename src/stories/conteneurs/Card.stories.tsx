import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Card, PanelRow, Button, Text, Sparkline, ArrowRightIcon } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ORDERS, REVENUE_TREND } from "../../showcase/demoData";

const euros = (n: number) => `${n.toLocaleString("fr-FR")} €`;
const RENEWALS = ORDERS.filter((o) => o.produit === "Abonnement annuel");

/**
 * La carte de section : la boîte du thème (sans filet, angles droits, un souffle d'ombre), un en-tête plus
 * marqué que celui de `Panel`, et des marges plus généreuses.
 */
const meta = {
  title: "Primitives/Card",
  component: Card,
  parameters: {
    docs: {
      description: {
        component: [
          "La carte du kit : en-tête (`title` à gauche, `meta` atténuée à côté), un `summary` facultatif toujours visible, le corps, et un `footer` sous un filet.",
          "",
          "**Card ou Panel ?** — même coquille (filet, rayon, ombre), deux usages. `Panel` groupe des lignes sous un petit intitulé en capitales, serré, pour les écrans denses. `Card` met en avant **une** section : titre plus présent, marges de 20 px, résumé. Dans ce thème, le titre de carte reprend les intitulés de poste du CV : League Spartan 700 de 16 px en capitales (`--lq-caption-*`).",
          "",
          "**Trois formes, un composant** —",
          "- par défaut, une carte toujours ouverte ;",
          "- `expandable` : le corps se replie derrière l'en-tête, qui devient le bouton (chevron) — c'est `ExpandableCard` ;",
          "- `highlight` : une tuile d'indicateur sans boîte, avec un filet épais en haut — c'est `Highlight`.",
          "",
          "**Repli** — avec `expandable`, non contrôlé par défaut (`defaultOpen`) ; contrôlé avec `open` et `onOpenChange`. Donnez un `title` : sans en-tête, rien ne permet d'ouvrir la carte.",
          "",
          "**Sans cadre** — `bare` retire filet, fond et ombre, pour une carte posée dans une cellule déjà encadrée.",
          "",
          "**Plein écran** — `maximizable` ajoute à droite de l'en-tête un bouton qui détache la carte et lui fait couvrir toute la fenêtre, par-dessus la barre latérale et la barre haute ; son corps défile alors à l'intérieur, l'en-tête et le pied restent en place. Le même bouton, ou **Échap**, la rend à sa place. Pendant le plein écran : la page ne défile plus ; la carte est exposée en `role=\"dialog\"` (`aria-modal`, nommée par son `title`) ; elle reçoit le focus et le garde (Tab boucle sur ses contrôles) ; une réserve invisible de sa hauteur tient sa case dans la grille, si bien que ses voisines ne bougent pas. À la sortie, le focus revient à ce qui l'avait avant. Une modale ou un menu ouverts depuis la carte passent par-dessus, et leur Échap ne ferme qu'eux. Contrôlé avec `maximized` + `onMaximizedChange` (fournir `maximized` suffit à montrer le bouton) ; `maximizeLabel` (« Plein écran ») et `restoreLabel` (« Quitter le plein écran ») nomment le bouton. Limite : sous un ancêtre qui porte un `transform`, un `filter` ou un `contain`, la carte ne couvre que cet ancêtre.",
          "",
          "**Thème** — `--lq-color-panel`, `--lq-color-panel-border`, `--lq-color-border-subtle` (filets internes), `--lq-radius-lg`, `--lq-shadow-panel`, `--lq-space-2` à `--lq-space-5` ; le titre `--lq-caption-font`, `--lq-caption-size`, `--lq-caption-weight`, `--lq-caption-tracking`, `--lq-caption-transform` ; l'en-tête cliquable `--lq-color-hover`. Le plein écran lit `--lq-card-maximized-inset` (écart au bord, 0), `--lq-card-maximized-z-index` (1200), `--lq-card-maximized-radius` (0) et `--lq-card-maximized-shadow` (`--lq-shadow-modal`).",
        ].join("\n"),
      },
    },
  },
  args: {
    title: "Abonnements à renouveler",
    meta: "novembre",
    summary: `${RENEWALS.length} contrats arrivent à échéance dans les 30 jours.`,
    children: (
      <>
        {RENEWALS.map((o) => (
          <PanelRow key={o.id} label={o.client} value={euros(o.montant)} />
        ))}
      </>
    ),
    footer: (
      <Button icon={<ArrowRightIcon size={16} />} iconPosition="trailing">
        Ouvrir la liste
      </Button>
    ),
    onOpenChange: fn(),
    onMaximizedChange: fn(),
  },
  argTypes: {
    title: { control: "text" },
    meta: { control: "text" },
    summary: { control: "text" },
    children: { control: false },
    footer: { control: false },
    open: { control: false },
    // Lu au premier rendu seulement : le changer ensuite ne ferait rien.
    defaultOpen: { control: false },
    maximizable: { control: "boolean" },
    // Contrôlé : un interrupteur ici figerait la carte en plein écran sans moyen d'en sortir.
    maximized: { control: false },
    maximizeLabel: { control: "text", table: { defaultValue: { summary: '"Plein écran"' } } },
    restoreLabel: { control: "text", table: { defaultValue: { summary: '"Quitter le plein écran"' } } },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 440 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Simple: Story = {
  name: "Titre et corps",
  args: {
    title: "Encours clients",
    meta: undefined,
    summary: undefined,
    footer: undefined,
    children: (
      <>
        <PanelRow label="Échu" value="12 480 €" />
        <PanelRow label="À échoir sous 30 j" value="54 200 €" />
      </>
    ),
  },
};

export const WithoutHeader: Story = {
  name: "Sans en-tête",
  args: {
    title: undefined,
    meta: undefined,
    summary: undefined,
    footer: undefined,
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Text size="sm" muted>
          Revenu mensuel
        </Text>
        <Text size="xl" weight="bold">
          80 000 €
        </Text>
        <Sparkline data={REVENUE_TREND} width={360} height={40} area />
      </div>
    ),
  },
  parameters: { docs: { description: { story: "Sans `title`, la carte n'est plus qu'une boîte : le corps prend toute la place." } } },
};

export const Expandable: Story = {
  name: "Repliable",
  args: { expandable: true, defaultOpen: false },
  parameters: { docs: { description: { story: "`expandable` : replié, seul le corps disparaît — l'en-tête, le résumé et le pied restent. Cliquez l'en-tête pour déplier." } } },
};

export const Bare: Story = {
  name: "Sans cadre",
  args: { bare: true, title: "Carte sans cadre", meta: undefined, summary: undefined, footer: undefined, children: <Text size="sm" muted>Ni filet, ni fond, ni ombre : la carte se fond dans la cellule qui l'accueille.</Text> },
  decorators: [
    (Story) => (
      <div style={{ border: "1px dashed var(--lq-color-border)" }}>
        <Story />
      </div>
    ),
  ],
};

export const Maximizable: Story = {
  name: "Plein écran",
  args: { maximizable: true },
  render: (args) => (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16 }}>
      <Card {...args} />
      <Card title="Tendance du chiffre d'affaires" maximizable>
        <Sparkline data={REVENUE_TREND} width={360} height={60} area />
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Le bouton à droite de l'en-tête pose la carte sur toute la fenêtre ; Échap ou le même bouton la rendent à sa place, et la carte du dessous n'a pas bougé entre-temps.",
      },
    },
  },
};

export const MaximizedControlled: Story = {
  name: "Plein écran contrôlé",
  render: function Render(args) {
    const [maximized, setMaximized] = useState(true);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <Button onClick={() => setMaximized(true)}>Agrandir depuis l'extérieur</Button>
        </div>
        <Card
          {...args}
          maximized={maximized}
          onMaximizedChange={(next) => {
            setMaximized(next);
            args.onMaximizedChange?.(next);
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "`maximized` tenu par l'écran, ouvert d'emblée : la carte couvre le cadre. Le bouton, Échap et le bouton extérieur passent tous par `onMaximizedChange`, visible dans l'onglet Actions.",
      },
    },
  },
};
