import type { Meta, StoryObj } from "@storybook/react-vite";
import { Testimonial, QuoteMark } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * La citation : un témoignage encadré, une citation en italique dans le texte, ou un encadré
 * latéral teinté.
 */
const meta = {
  title: "Primitives/Testimonial",
  component: Testimonial,
  parameters: {
    docs: {
      description: {
        component: [
          "Une citation, sous trois présentations (`variant`) :",
          "- `card` (défaut) — le témoignage encadré : panneau, grand guillemet d'ouverture, note en étoiles (`rating`, de 0 à 5) et attribution sous un filet, avec avatar (`avatarSrc`, sinon les initiales) ;",
          "- `italic` — sans cadre, la phrase en italique entre guillemets, pour une citation glissée dans un texte ;",
          "- `callout` — sans cadre non plus, mais sur un fond teinté avec un trait vertical à gauche, pour une citation qui doit tenir tête au texte autour.",
          "",
          "**Attribution facultative** — sans `name`, ni avatar, ni nom, ni filet : une citation anonyme. `role` précise la fonction et l'organisation.",
          "",
          "**Mots en avant** — `highlight` (un mot, une expression ou une liste) les fait ressortir dans la citation, sans tenir compte de la casse et en gardant celle du texte. Cela ne marche que si `quote` est une chaîne ; pour une citation composée de nœuds React, entourez vous-même les mots de `QuoteMark`.",
          "",
          "**Accessibilité** — la note se lit « 5 sur 5 ».",
          "",
          "**Quand l'utiliser** — la preuve sociale d'une page d'accueil, un retour client dans un rapport, une phrase à retenir. Pour un message système, `Notification` ; pour du texte courant, `Text`.",
          "",
          "La citation ne dépasse pas 480 px de large, quelle que soit la place offerte.",
          "",
          "**Thème** — variante encadrée : `--lq-color-panel`, `--lq-color-panel-border`, `--lq-radius-lg`, `--lq-shadow-panel`, `--lq-space-5`. `--lq-color-accent` donne le guillemet, le trait du callout et, à 18 %, le fond des mots en avant ; le fond du callout est `--lq-color-fill` à 8 % sur `--lq-color-panel`. Étoiles pleines `--lq-color-warning`, vides `--lq-color-text-muted` ; avatar `--lq-color-fill-track`.",
        ].join("\n"),
      },
    },
  },
  args: {
    quote: "Depuis le passage au tableau de bord, la clôture mensuelle nous prend une demi-journée au lieu de trois.",
    highlight: "une demi-journée",
    name: "Claire Lemoine",
    role: "Directrice financière, Lemoine SAS",
    rating: 5,
  },
  argTypes: {
    quote: { control: "text" },
    highlight: { control: "text" },
    rating: { control: { type: "range", min: 0, max: 5, step: 1 } },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 520 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Testimonial>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const WithoutRating: Story = {
  name: "Sans note",
  args: {
    rating: undefined,
    highlight: undefined,
    quote: "Les relances partent seules, et nous voyons enfin qui paie en retard avant la fin du mois.",
    name: "Hugo Mercier",
    role: "Gérant, Mercier & Fils",
  },
};

export const Italic: Story = {
  name: "Italique",
  args: {
    variant: "italic",
    quote: "Le meilleur indicateur, c'est celui qu'on regarde vraiment.",
    highlight: undefined,
    rating: undefined,
    name: "Hugo Mercier",
    role: "Mercier & Fils",
  },
};

export const Callout: Story = {
  name: "Encadré latéral",
  args: {
    variant: "callout",
    quote: "Trois mois après la bascule, le délai de paiement moyen est passé de 31 à 18 jours.",
    highlight: ["31", "18 jours"],
    name: undefined,
    role: undefined,
    rating: undefined,
  },
  parameters: { docs: { description: { story: "Sans `name` : pas de ligne d'attribution. `highlight` accepte une liste." } } },
};

export const ComposedQuote: Story = {
  name: "Citation composée",
  args: {
    quote: (
      <>
        Nos commerciaux ouvrent le tableau des <QuoteMark>encours clients</QuoteMark> avant chaque rendez-vous — <em>tous</em>, sans exception.
      </>
    ),
    highlight: undefined,
    name: "Inès Roux",
    role: "Directrice commerciale, Cabinet Roux",
    rating: 4,
  },
  parameters: {
    docs: { description: { story: "Une citation faite de nœuds (ici un `<em>`) : `highlight` ne peut plus chercher dedans, `QuoteMark` marque les mots à la main." } },
  },
};
