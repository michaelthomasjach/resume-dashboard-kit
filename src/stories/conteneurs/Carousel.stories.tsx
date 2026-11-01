import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Carousel, Jumbotron, Button, Text, Highlight, Sparkline } from "@michaelthomasjach/liseuse-dashboard-kit";
import { REVENUE_TREND, SIGNUPS_TREND, CHURN_TREND } from "../../showcase/demoData";

const SLIDES = [
  <Jumbotron
    key="record"
    eyebrow="Octobre"
    title="80 000 € de revenu mensuel"
    description="Un record, porté par les abonnements annuels (+12,4 % sur un mois)."
    actions={<Button selected>Voir le rapport</Button>}
  />,
  <Jumbotron
    key="equipe"
    tone="accent"
    eyebrow="Équipe"
    title="Trois nouveaux comptes cette semaine"
    description="Groupe Vallée, Cabinet Roux et Ferme du Pré ont rejoint la plateforme."
  />,
  <Jumbotron key="maintenance" eyebrow="Maintenance" title="Mise à jour prévue dimanche à 6 h" description="Coupure estimée à dix minutes." />,
];

const KPIS = [
  { title: "Revenu mensuel", value: "80 000 €", note: "+12,7 % sur un mois", data: REVENUE_TREND },
  { title: "Inscriptions", value: "31", note: "−2 sur un mois", data: SIGNUPS_TREND },
  { title: "Résiliations", value: "4", note: "−1 sur un mois", data: CHURN_TREND },
];

/**
 * Le carrousel : une diapositive visible à la fois, des flèches et des points pour passer de l'une
 * à l'autre.
 */
const meta = {
  title: "Primitives/Carousel",
  component: Carousel,
  parameters: {
    docs: {
      description: {
        component: [
          "Défilement horizontal de diapositives, une à la fois, dans une hauteur fixe (`height`, 320 px par défaut). Chaque enfant est une diapositive, dessinée pleine largeur : le carrousel ne décide rien de son contenu — un `Jumbotron`, une carte, une image.",
          "",
          "**Accessibilité** — une région `aria-roledescription=\"carrousel\"`, nommée par `ariaLabel` ; chaque diapositive est un groupe « 2 sur 3 », et celles qui sont cachées sont `aria-hidden` et inertes (leurs boutons sortent de l'ordre de tabulation).",
          "",
          "**Navigation** — deux flèches (`arrows`, des `IconButton` « Diapositive précédente / suivante ») qui bouclent d'un bout à l'autre, et une rangée de points (`dots`) qui mènent chacun à sa diapositive et marquent l'active par `aria-current`. Les diapositives cachées sont `aria-hidden`.",
          "",
          "**Lecture automatique** — `autoplayInterval` (en millisecondes) avance d'une diapositive à intervalle régulier, en pause tant que la souris survole le carrousel **ou que le focus clavier y est**. Elle ne démarre pas quand le système demande moins de mouvement (`prefers-reduced-motion: reduce`), et la transition y devient instantanée. Absent ou 0 : pas de lecture automatique.",
          "",
          "**État** — non contrôlé par défaut (`defaultIndex`, 0) ; contrôlé avec `index` et `onIndexChange(index)`.",
          "",
          "**Quand l'utiliser** — quelques annonces de même importance qui se partagent un emplacement. Ce qui doit être lu par tous ne se cache pas derrière une flèche : pour des indicateurs à comparer, une rangée de `Highlight` ; pour des vues à choisir, `Tabs`.",
          "",
          "**Thème** — `--lq-color-panel`, `--lq-radius-lg`, `--lq-color-overlay`, `--lq-color-text-muted` et `--lq-color-bg` (points), `--lq-space-2`, `--lq-space-3`, `--lq-transition-fast`.",
        ].join("\n"),
      },
    },
  },
  args: { children: SLIDES, height: 240, onIndexChange: fn() },
  argTypes: {
    children: { control: false },
    index: { control: false },
    // Lu au premier rendu seulement : le changer ensuite ne ferait rien.
    defaultIndex: { control: false },
    autoplayInterval: { control: { type: "number", min: 0, step: 500 } },
    height: { control: { type: "number", min: 120, step: 20 } },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 820 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: {
    docs: {
      description: {
        story:
          "Les flèches se posent par-dessus la diapositive : le carrousel réserve leur place de chaque côté d'un `Jumbotron` (`--lq-carousel-arrow-gutter`, la largeur d'une flèche et sa marge), dont le texte ne passe donc plus dessous. Le point actif prend `--lq-color-fill`, lisible sur une diapositive claire comme sur une photo.",
      },
    },
  },
};

export const Autoplay: Story = {
  name: "Lecture automatique",
  args: { autoplayInterval: 4000 },
  parameters: { docs: { description: { story: "Une diapositive toutes les quatre secondes ; survolez le carrousel pour le mettre en pause." } } },
};

export const WithoutArrows: Story = {
  name: "Points seuls",
  args: { arrows: false },
};

export const Controlled: Story = {
  name: "Contrôlé",
  render: function Render(args) {
    const [index, setIndex] = useState(1);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Carousel
          {...args}
          index={index}
          onIndexChange={(i) => {
            setIndex(i);
            args.onIndexChange?.(i);
          }}
        />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button onClick={() => setIndex(0)}>Revenir au début</Button>
          <Text size="sm" muted>
            Diapositive {index + 1} sur {SLIDES.length}
          </Text>
        </div>
      </div>
    );
  },
  parameters: { docs: { description: { story: "Avec `index` et `onIndexChange`, le parent sait où en est le carrousel et peut l'y envoyer." } } },
};

export const CardSlides: Story = {
  name: "Diapositives libres",
  args: {
    height: 170,
    children: KPIS.map((k) => (
      <div key={k.title} style={{ padding: "16px 64px", height: "100%", boxSizing: "border-box" }}>
        <Highlight title={k.title}>
          <Text size="xl" weight="bold">
            {k.value}
          </Text>
          <Text size="sm" muted>
            {k.note}
          </Text>
          <Sparkline data={k.data} width={260} height={32} area />
        </Highlight>
      </div>
    )),
  },
  parameters: { docs: { description: { story: "N'importe quel contenu fait une diapositive : ici une tuile d'indicateur par vue." } } },
};
