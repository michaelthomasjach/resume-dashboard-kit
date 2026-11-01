import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Panel, PanelRow, Button, Toggle, Badge } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * Le panneau à lignes : la boîte de base des écrans, qui groupe des lignes libellé / valeur sous un
 * intitulé en petites capitales.
 */
const meta = {
  title: "Primitives/Panel",
  component: Panel,
  parameters: {
    docs: {
      description: {
        component: [
          "Boîte à filet qui groupe les lignes d'un sujet : un en-tête (intitulé en petites capitales à gauche, `meta` à droite), un corps — en général des `PanelRow` —, et un pied facultatif sous un filet.",
          "",
          "**Quand l'utiliser** — un groupe de valeurs ou de réglages d'un même sujet : l'état d'un serveur, les réglages d'un compte, les filtres actifs. Pour une carte mise en avant, au titre plus marqué et aux marges plus généreuses, `Card` ; pour un indicateur chiffré sans boîte, `Highlight`.",
          "",
          "**Anatomie** — `title` s'écrit en casse normale, la feuille le passe en capitales. `meta` est libre : un compte (« 3 »), une région, un état. `footer` reçoit un bouton ou une rangée d'actions.",
          "",
          "**Repliable** — avec `collapsible`, l'en-tête entier devient cliquable et un bouton +/− s'y affiche ; le corps s'ouvre et se ferme en glissant (sans animation si le système demande moins de mouvement). Non contrôlé par défaut (`defaultOpen`, ouvert si absent) ; contrôlé avec `open` et `onOpenChange`. `toggleLabel` nomme le bouton pour les lecteurs d'écran (par défaut « Déplier / Replier : » suivi du titre).",
          "",
          "**Sans cadre** — `bare` retire filet, fond et ombre, pour un panneau posé dans une cellule déjà encadrée.",
          "",
          "**Thème** — `--lq-color-panel`, `--lq-color-panel-border`, `--lq-color-border-subtle`, `--lq-radius-lg`, `--lq-shadow-panel`, `--lq-space-1` à `--lq-space-5` ; l'intitulé `--lq-label-font`, `--lq-label-size`, `--lq-label-weight`, `--lq-label-tracking` ; les lignes `--lq-row-font-size`.",
        ].join("\n"),
      },
    },
  },
  args: {
    title: "Serveur de production",
    meta: "eu-west-3",
    children: (
      <>
        <PanelRow label="Disponibilité" value="99,98 %" />
        <PanelRow label="Temps de réponse" value="182 ms" />
        <PanelRow label="Dernier déploiement" value="il y a 2 h" />
      </>
    ),
    onOpenChange: fn(),
  },
  argTypes: {
    title: { control: "text" },
    meta: { control: "text" },
    children: { control: false },
    footer: { control: false },
    open: { control: false },
    // Lu au premier rendu seulement : le changer ensuite ne ferait rien.
    defaultOpen: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const WithFooter: Story = {
  name: "Avec pied",
  args: { footer: <Button>Voir les journaux</Button> },
};

export const WithControls: Story = {
  name: "Lignes à contrôle",
  render: function Render(args) {
    const [maintenance, setMaintenance] = useState(false);
    return (
      <Panel {...args} title="Réglages du site" meta={maintenance ? "maintenance" : "en ligne"}>
        <PanelRow label="Mode maintenance">
          <Toggle checked={maintenance} onChange={setMaintenance} ariaLabel="Mode maintenance" />
        </PanelRow>
        <PanelRow label="Statut" value={<Badge tone={maintenance ? "warning" : "up"}>{maintenance ? "suspendu" : "actif"}</Badge>} />
        <PanelRow label="Version" value="4.12.0" />
      </Panel>
    );
  },
  parameters: { docs: { description: { story: "Une ligne peut porter un contrôle (enfant) ou une valeur riche (`value`)." } } },
};

export const Collapsible: Story = {
  name: "Repliable",
  args: {
    title: "Filtres actifs",
    meta: "3",
    collapsible: true,
    defaultOpen: true,
    children: (
      <>
        <PanelRow label="Statut" value="payée" />
        <PanelRow label="Période" value="octobre 2026" />
        <PanelRow label="Montant" value="> 1 000 €" />
      </>
    ),
  },
  parameters: { docs: { description: { story: "Cliquez l'en-tête : le corps se replie. `defaultOpen={false}` le ferait partir fermé." } } },
};

export const CollapsedByDefault: Story = {
  name: "Replié au départ",
  args: {
    title: "Colonnes masquées",
    meta: "2",
    collapsible: true,
    defaultOpen: false,
    children: (
      <>
        <PanelRow label="Référence interne" value="masquée" />
        <PanelRow label="Commercial" value="masquée" />
      </>
    ),
  },
};

export const Bare: Story = {
  name: "Sans cadre",
  args: { bare: true, title: "Dans une cellule encadrée" },
  decorators: [
    (Story) => (
      <div style={{ border: "1px dashed var(--lq-color-border)", padding: 12 }}>
        <Story />
      </div>
    ),
  ],
  parameters: { docs: { description: { story: "`bare` : ni filet, ni fond, ni ombre — le cadre pointillé est celui du parent." } } },
};
