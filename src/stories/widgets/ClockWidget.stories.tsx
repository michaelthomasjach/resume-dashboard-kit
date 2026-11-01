import type { Meta, StoryObj } from "@storybook/react-vite";
import { ClockWidget, HomeIcon, MoonIcon, SunIcon } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * L'en-tête horaire d'un écran de tableau de bord : l'heure en très grand, la date dessous. Dans le
 * thème « resume », c'est l'un des rares endroits où le plus gros texte de l'écran est légitime.
 */
const meta = {
  title: "Widgets/ClockWidget",
  component: ClockWidget,
  parameters: {
    docs: {
      description: {
        component: [
          "Panneau d'en-tête qui affiche **l'heure en grand**, la date en dessous, une petite icône dans le coin (soleil, lune…) et, au besoin, une **ligne de présence** (« Claire est à la maison »).",
          "",
          "**Quand l'utiliser** — en tête d'un écran mural, d'une page d'accueil ou d'un kiosque, là où l'heure est une information de premier rang. Pour l'heure d'une simulation ou d'une partie (un nombre de secondes, un « Jour 3 »), préférez `AnalogClock` ; pour une date dans un tableau ou une carte, un simple texte suffit.",
          "",
          "**Le widget ne tient pas d'horloge** — `time` et `date` arrivent déjà formatés : c'est à l'application de rafraîchir la valeur (une fois par minute suffit) et de choisir sa locale et son format (« 09:34 », « 9 h 34 »). Le widget n'a donc rien à démonter, et l'heure affichée est toujours celle que l'application croit juste.",
          "",
          "**Anatomie** — un panneau sans cadre (`Panel bare`) : ni fond ni bordure, il se pose dans une carte ou une cellule de grille sans doubler les filets. Dedans, l'heure, découpée sur ses deux-points ; la date en texte atténué ; `icon` en haut à droite ; `presence` sous un filet, libre (icône et texte, un lien…).",
          "",
          "**Comportement** — avec `blinkColon` (vrai par défaut), les deux-points battent la seconde comme sur un réveil. Coupez-le pour un écran qu'on photographie, une capture de référence, ou une horloge de nuit qu'on veut immobile.",
          "",
          "**Thème** — `--lq-color-text` (l'heure), `--lq-color-text-muted` (date, icône), `--lq-color-border-subtle` (filet de la présence), `--lq-space-1` à `--lq-space-3`, `--lq-font-weight-bold`.",
        ].join("\n"),
      },
    },
  },
  args: { time: "09:34", date: "vendredi 30 octobre", icon: <SunIcon />, blinkColon: true },
  argTypes: {
    icon: { control: false },
    presence: { control: false },
  },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <ClockWidget {...args} />
    </div>
  ),
} satisfies Meta<typeof ClockWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const WithPresence: Story = {
  name: "Avec présence",
  args: {
    presence: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <HomeIcon size={14} /> Claire est à la maison
      </span>
    ),
  },
  parameters: { docs: { description: { story: "`presence` accepte n'importe quel contenu : ici une icône et une phrase, posées sous la date." } } },
};

export const Night: Story = {
  name: "De nuit, immobile",
  args: { time: "23:47", icon: <MoonIcon />, blinkColon: false },
  parameters: { docs: { description: { story: "`blinkColon={false}` fige les deux-points : l'heure ne bouge plus d'une capture à l'autre." } } },
};

export const NoIcon: Story = {
  name: "Sans icône",
  args: { time: "14:05", date: "samedi 31 octobre 2026", icon: undefined },
};
