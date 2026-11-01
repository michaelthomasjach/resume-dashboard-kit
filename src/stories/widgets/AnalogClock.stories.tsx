import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnalogClock } from "@michaelthomasjach/liseuse-dashboard-kit";

const H = 3600;
const M = 60;

/**
 * Une petite horloge à aiguilles, nourrie de secondes. Elle sert l'heure d'une simulation ou d'une
 * partie plutôt que l'heure murale — pour celle-ci, `ClockWidget`.
 */
const meta = {
  title: "Widgets/AnalogClock",
  component: AnalogClock,
  parameters: {
    docs: {
      description: {
        component: [
          "Une **petite horloge à aiguilles**, avec en option l'heure en chiffres, un soleil ou une lune, le jour et une légende. Elle se glisse dans une barre d'état, l'en-tête d'un panneau, un coin de scène.",
          "",
          "**Des secondes, et rien d'autre** — l'horloge prend un nombre de secondes : l'heure du jour, ou un temps absolu (le temps écoulé depuis le début d'une partie) dont elle garde le reste modulo 86 400. La petite aiguille fait le tour en douze heures, la grande en une ; douze graduations, dont les quatre quarts plus longs.",
          "",
          "**Quand l'utiliser** — pour une heure qui n'est pas celle de la pendule : l'horloge d'une simulation, d'un jeu de gestion, d'un fuseau horaire secondaire, une heure de livraison prévue. Pour l'heure en très grand en tête d'un écran mural, prenez `ClockWidget`.",
          "",
          "**Anatomie** — le cadran (`size`, 30 px par défaut) ; à sa droite, si `showDigital` (vrai par défaut), l'heure « 14:05 » précédée d'un soleil (`night={false}`) ou d'une lune (`night`) — rien si `night` est absent ; puis, sous l'heure, « Jour 3 » (`day`) et la légende (`caption`).",
          "",
          "**Comportement** — purement d'affichage : l'horloge ne compte pas toute seule, c'est l'appelant qui fait avancer `seconds`. Le nom accessible dit l'heure et le jour en toutes lettres ; `label` le remplace.",
          "",
          "**Thème** — le cadran est un panneau (`--lq-color-panel`, `--lq-color-border`, `--lq-color-border-subtle`, `--lq-radius-md`), les aiguilles sont à `--lq-color-accent`, les textes à `--lq-color-text` et `--lq-color-text-muted` (`--lq-text-sm`, `--lq-text-xs`).",
        ].join("\n"),
      },
    },
  },
  args: { seconds: 9 * H + 34 * M, size: 30, showDigital: true, night: false },
  argTypes: {
    seconds: { control: { type: "range", min: 0, max: 86399, step: 60 } },
    size: { control: { type: "range", min: 24, max: 120, step: 2 } },
    caption: { control: "text" },
  },
} satisfies Meta<typeof AnalogClock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Night: Story = {
  name: "De nuit",
  args: { seconds: 23 * H + 47 * M, night: true, size: 44 },
};

export const GameDay: Story = {
  name: "Jour de partie et légende",
  args: { seconds: 2 * 86400 + 14 * H + 5 * M, size: 56, day: 3, caption: "trafic dense", night: undefined },
  parameters: { docs: { description: { story: "Un temps absolu — deux jours, quatorze heures et cinq minutes depuis le début de la partie : l'horloge n'en garde que l'heure du jour, et `day` dit le reste." } } },
};

export const DialOnly: Story = {
  name: "Cadran seul",
  args: { seconds: 17 * H + 20 * M, size: 40, showDigital: false },
  parameters: { docs: { description: { story: "Sans l'heure en chiffres : le nom accessible la dit toujours." } } },
};

export const Running: Story = {
  name: "Une journée qui défile",
  render: function Render(args) {
    const [seconds, setSeconds] = useState(6 * H);
    useEffect(() => {
      const id = window.setInterval(() => setSeconds((s) => (s + 10 * M) % (2 * 86400)), 200);
      return () => window.clearInterval(id);
    }, []);
    const hour = Math.floor((seconds % 86400) / H);
    return <AnalogClock {...args} size={64} seconds={seconds} night={hour < 7 || hour >= 20} day={Math.floor(seconds / 86400) + 1} />;
  },
  parameters: { docs: { description: { story: "L'appelant fait avancer le temps — dix minutes toutes les 200 ms — et décide lui-même quand vient la nuit." } } },
};
