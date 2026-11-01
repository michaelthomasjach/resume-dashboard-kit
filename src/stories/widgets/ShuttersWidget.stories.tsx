import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShuttersWidget, type ShutterEntry } from "@michaelthomasjach/liseuse-dashboard-kit";
import { SHUTTERS } from "../../showcase/widgetData";

/** Ouvrir ou fermer un volet : tout ou rien, comme le ferait l'interrupteur d'un vrai volet roulant. Un volet sans jauge en reste sans. */
function setShutter(list: ShutterEntry[], id: string, on: boolean): ShutterEntry[] {
  return list.map((s) =>
    s.id === id ? { ...s, on, level: s.level === undefined ? undefined : on ? 100 : 0, statusText: on ? "ouvert" : "fermé" } : s
  );
}

const openCount = (list: ShutterEntry[]) => {
  const n = list.filter((s) => s.on).length;
  return `${n} ouvert${n > 1 ? "s" : ""}`;
};

/**
 * Le panneau « Volets » : une rangée par volet, avec son interrupteur, une jauge d'ouverture et un
 * mot d'état. Les interrupteurs de la story répondent.
 */
const meta = {
  title: "Widgets/ShuttersWidget",
  component: ShuttersWidget,
  parameters: {
    docs: {
      description: {
        component: [
          "Panneau **« Volets »** : une rangée par volet roulant, porte de garage ou store, avec un **interrupteur**, une **jauge d'ouverture** en dix segments et un **mot d'état** en bout de ligne (« ouvert », « 55 % », « fermé »).",
          "",
          "**Quand l'utiliser** — pour une liste d'équipements à commande ouvert / fermé qui ont aussi un degré d'ouverture. C'est la même rangée que `LightsWidget` (interrupteur, jauge, état), seul le titre par défaut change : prenez celui des deux qui nomme le mieux ce que vous listez. Pour des valeurs sans commande, `MetricListWidget`.",
          "",
          "**Données** — chaque entrée (`ShutterEntry`) porte `id`, `label`, `on`, et au besoin `level` (0 à 100 ; absent, pas de jauge), `statusText`, `onToggle`, `onClick` (rend toute la rangée cliquable, pour ouvrir une fiche de réglage) et `disabled`.",
          "",
          "**Contrôlé** — le widget ne garde rien : l'interrupteur appelle `onToggle(on)` et c'est à l'application de renvoyer la liste à jour, niveau et mot d'état compris (un volet qu'on ouvre passe-t-il à 100 % ou reprend-il sa dernière position ? C'est une décision métier). `title` vaut « Volets » par défaut ; `meta` s'affiche à droite du titre, typiquement un compte.",
          "",
          "**Thème** — celles du panneau et de ses rangées (`--lq-color-panel`, `--lq-color-panel-border`, `--lq-radius-lg`, `--lq-shadow-panel`, `--lq-row-font-size`, `--lq-label-*`), de `Toggle` et de `LevelGauge` (`--lq-color-fill`, `--lq-color-fill-track`, `--lq-radius-pill`).",
        ].join("\n"),
      },
    },
  },
  args: { title: "Volets", shutters: SHUTTERS },
  argTypes: {
    title: { control: "text" },
    meta: { control: "text" },
    shutters: { control: false },
  },
  // Les volets sont tenus par la story : un interrupteur ouvre ou ferme, et tant que `meta` est
  // laissé vide, le compte des volets ouverts suit.
  render: function Render(args) {
    const [shutters, setShutters] = useState(args.shutters);
    useEffect(() => setShutters(args.shutters), [args.shutters]);
    return (
      <div style={{ maxWidth: 380 }}>
        <ShuttersWidget
          {...args}
          meta={args.meta ?? openCount(shutters)}
          shutters={shutters.map((s) => ({ ...s, onToggle: (on: boolean) => setShutters((list) => setShutter(list, s.id, on)) }))}
        />
      </div>
    );
  },
} satisfies Meta<typeof ShuttersWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const OnOffOnly: Story = {
  name: "Sans jauge",
  args: { shutters: SHUTTERS.map((s) => ({ ...s, level: undefined })) },
  parameters: { docs: { description: { story: "Sans `level`, la rangée se réduit à l'interrupteur et au mot d'état — pour un store qui ne connaît que deux positions." } } },
};

export const WithDisabled: Story = {
  name: "Un volet indisponible",
  args: {
    title: "Rez-de-chaussée",
    shutters: SHUTTERS.map((s) => (s.id === "garage" ? { ...s, disabled: true, statusText: "hors ligne" } : s)),
  },
  parameters: { docs: { description: { story: "`disabled` grise l'interrupteur d'une seule rangée : la porte du garage ne répond plus." } } },
};
