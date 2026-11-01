import type { Meta, StoryObj } from "@storybook/react-vite";
import { Jumbotron, Button, BarChartIcon } from "@michaelthomasjach/liseuse-dashboard-kit";

/** Une image de fond dessinée ici plutôt que chargée d'un site tiers : la story rend la même
 *  chose hors ligne et à chaque chargement. Un ciel, deux collines, un soleil — assez de couleur
 *  pour que le dégradé noir et blanc se voie. */
const LANDSCAPE = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 600" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b4c9b"/><stop offset="1" stop-color="#f2a65a"/></linearGradient></defs>
<rect width="1600" height="600" fill="url(#s)"/>
<circle cx="1180" cy="330" r="90" fill="#ffd27a"/>
<path d="M0 420 C 300 330 520 360 800 420 S 1300 480 1600 380 V600 H0Z" fill="#3f7d5a"/>
<path d="M0 500 C 380 440 700 470 1000 520 S 1450 560 1600 500 V600 H0Z" fill="#2c5e43"/>
</svg>`)}`;

/** Une illustration simple pour `media` : des barres qui montent, aux couleurs du thème. */
const ReportIllustration = () => (
  <svg width="220" height="140" viewBox="0 0 220 140" aria-hidden="true">
    {[40, 62, 54, 80, 96, 118].map((h, i) => (
      <rect key={i} x={12 + i * 34} y={130 - h} width="22" height={h} rx="2" fill={i === 5 ? "var(--lq-color-accent)" : "var(--lq-color-border)"} />
    ))}
  </svg>
);

/**
 * La bannière d'accueil : un grand titre, une phrase, des actions — sur le fond d'une carte, sur
 * l'accent, ou sur une image.
 */
const meta = {
  title: "Primitives/Jumbotron",
  component: Jumbotron,
  parameters: {
    docs: {
      description: {
        component: [
          "Grand bandeau de mise en avant : un sur-titre (`eyebrow`), un titre, une `description`, une rangée d'`actions`, et en option une illustration (`media`) à côté du texte sur grand écran, au-dessus sur petit.",
          "",
          "**Quand l'utiliser** — un message d'accueil, l'annonce d'une nouveauté, un appel à terminer la configuration : un seul par écran, en tête. Pour une information de service qui ne doit pas dominer la page, `Notification` ; pour plusieurs annonces qui tournent, des `Jumbotron` dans un `Carousel`.",
          "",
          "**Tons** — `default` : le fond d'une carte ; `accent` : le plein de l'accent du thème, texte en contraste, pour l'appel le plus important.",
          "",
          "**Image de fond** — `backgroundImage` (une URL) couvre tout le bandeau, et un voile assombrit le côté du texte pour qu'il reste lisible. Sur l'image, sur-titre, titre et description passent tous en `--lq-color-accent-contrast`. `imageFilter=\"grayscale\"` fait passer l'image de la couleur au noir et blanc sur cette même zone ; `blurOnScroll` la floute à mesure que la page défile — à réserver à un bandeau en haut d'une page qui défile, puisqu'il écoute le défilement de la fenêtre.",
          "",
          "**Thème** — `--lq-color-panel`, `--lq-color-border-subtle`, `--lq-radius-lg`, `--lq-space-2` à `--lq-space-6` ; ton accent `--lq-color-fill` et `--lq-color-accent-contrast` ; voile `--lq-color-overlay` ; sur-titre `--lq-label-*`, titre `--lq-font-weight-bold`.",
        ].join("\n"),
      },
    },
  },
  args: {
    eyebrow: "Nouveau",
    title: "Les rapports planifiés arrivent",
    description: "Recevez chaque lundi le récapitulatif des ventes de la semaine, au format PDF ou CSV.",
    actions: (
      <div style={{ display: "flex", gap: 8 }}>
        <Button selected>Planifier un rapport</Button>
        <Button>En savoir plus</Button>
      </div>
    ),
  },
  argTypes: {
    eyebrow: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    actions: { control: false },
    media: { control: false },
    backgroundImage: { control: "text" },
  },
} satisfies Meta<typeof Jumbotron>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Accent: Story = {
  name: "Ton accent",
  args: {
    tone: "accent",
    eyebrow: "Configuration",
    title: "Terminez la mise en place de votre espace",
    description: "Encore deux étapes : inviter votre équipe et relier votre compte bancaire.",
    actions: <Button>Continuer</Button>,
  },
};

export const WithMedia: Story = {
  name: "Avec illustration",
  args: {
    eyebrow: "Rapports",
    title: "80 000 € de revenu mensuel",
    description: "Un record, porté par les abonnements annuels (+12,4 % sur un mois).",
    media: <ReportIllustration />,
    actions: (
      <Button icon={<BarChartIcon size={16} />} selected>
        Voir le rapport
      </Button>
    ),
  },
};

export const WithImage: Story = {
  name: "Image de fond",
  args: {
    eyebrow: "Séminaire",
    title: "Rendez-vous le 14 novembre à Annecy",
    description: "Une journée pour présenter la feuille de route 2027 aux clients partenaires.",
    backgroundImage: LANDSCAPE,
    actions: <Button selected>S'inscrire</Button>,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Défaut du kit : avec une image, seule la description passe en couleur de contraste. Le titre garde `--lq-color-text` et le sur-titre `--lq-color-text-muted` : en surface claire, ils disparaissent presque sur le voile sombre.",
      },
    },
  },
};

export const WithImageGrayscale: Story = {
  name: "Image de fond, dégradé noir et blanc",
  args: { ...WithImage.args, imageFilter: "grayscale" },
  parameters: { docs: { description: { story: "L'image passe au noir et blanc du côté du texte, et garde sa couleur de l'autre." } } },
};

export const TitleOnly: Story = {
  name: "Titre seul",
  args: { eyebrow: undefined, description: undefined, actions: undefined, title: "Bienvenue, Camille" },
};
