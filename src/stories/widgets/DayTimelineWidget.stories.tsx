import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DayTimelineWidget,
  Text,
  BedIcon,
  LogoutIcon,
  SunIcon,
  SunriseIcon,
  SunsetIcon,
  type DayTimelineItem,
} from "@michaelthomasjach/liseuse-dashboard-kit";

const MILESTONES: Omit<DayTimelineItem, "onClick">[] = [
  { id: "matin", icon: <SunriseIcon />, label: "Matin" },
  { id: "journee", icon: <SunIcon />, label: "Journée" },
  { id: "soir", icon: <SunsetIcon />, label: "Soirée" },
  { id: "nuit", icon: <BedIcon />, label: "Nuit" },
  { id: "depart", icon: <LogoutIcon />, label: "Départ" },
];

/**
 * Une rangée de jalons de la journée — chacun une icône et un mot. Avec un `onClick`, chaque jalon
 * devient un bouton : c'est la rangée de scénarios d'un écran domotique.
 */
const meta = {
  title: "Widgets/DayTimelineWidget",
  component: DayTimelineWidget,
  parameters: {
    docs: {
      description: {
        component: [
          "Une **rangée de jalons** répartis sur toute la largeur : une icône au-dessus d'un libellé court. Sur un écran domotique, ce sont les scénarios de la journée — « Matin », « Soirée », « Nuit », « Départ » — qu'on déclenche d'un geste.",
          "",
          "**Quand l'utiliser** — pour quatre à six actions de premier niveau, toutes de même poids, qu'on reconnaît à leur icône. Pour un choix exclusif dont l'état doit rester visible, préférez `SegmentedControl` ; pour des étapes ordonnées avec un état (faite, en cours), `Stepper` ou `ObjectiveTracker` ; pour une barre d'outils compacte, `IconDock`.",
          "",
          "**Anatomie** — chaque entrée de `items` (`id`, `icon`, `label`, `onClick`) est un `<button>` qui prend une part égale de la largeur. L'icône est mise à 26 px, le libellé en petit texte atténué.",
          "",
          "**Comportement** — une entrée **sans `onClick` est un bouton désactivé** : elle s'affiche à l'identique mais ne réagit ni au survol ni au clic, et sort de l'ordre de tabulation. Avec `onClick`, elle prend le curseur main et s'estompe au survol. Le widget ne retient aucun état : pour montrer le scénario en cours, c'est à l'application de le dire ailleurs (ou de changer l'icône).",
          "",
          "**Thème** — `--lq-color-text` (icônes), `--lq-color-text-muted` (libellés), `--lq-space-2` (écarts).",
        ].join("\n"),
      },
    },
  },
  args: { items: MILESTONES },
  argTypes: { items: { control: false } },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <DayTimelineWidget {...args} />
    </div>
  ),
} satisfies Meta<typeof DayTimelineWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Sans `onClick`, les jalons sont seulement affichés : des boutons désactivés." } } },
};

export const Interactive: Story = {
  name: "Scénarios cliquables",
  render: function Render(args) {
    const [last, setLast] = useState<string | null>(null);
    return (
      <div style={{ maxWidth: 420, display: "flex", flexDirection: "column", gap: 12 }}>
        <DayTimelineWidget {...args} items={args.items.map((m) => ({ ...m, onClick: () => setLast(m.label) }))} />
        <Text size="sm" muted>
          {last ? `Scénario « ${last} » lancé.` : "Cliquez un jalon."}
        </Text>
      </div>
    );
  },
};

export const Three: Story = {
  name: "Trois jalons",
  args: { items: MILESTONES.filter((m) => m.id !== "journee" && m.id !== "depart") },
  parameters: { docs: { description: { story: "Les jalons se partagent la largeur à parts égales, quel que soit leur nombre." } } },
};
