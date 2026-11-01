import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ObjectiveTracker, type Objective } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ONBOARDING_STEPS } from "../../showcase/widgetData";
import { Corner, Stage } from "./_Stage";

/** Les étapes à un instant donné : les `done` premières faites, la suivante en cours, le reste à venir. */
function stepsAt(done: number, onValidate?: () => void): Objective[] {
  return ONBOARDING_STEPS.map((s, i) => ({
    ...s,
    state: i < done ? "done" : i === done ? "current" : "todo",
    action: i === done && onValidate ? { label: "Valider l'étape", onClick: onValidate } : undefined,
  }));
}

/**
 * Le suivi des objectifs : les étapes d'une prise en main, en petite carte flottante. Ce qui est
 * fait, ce qu'on fait maintenant, ce qui vient après.
 */
const meta = {
  title: "Widgets/ObjectiveTracker",
  component: ObjectiveTracker,
  parameters: {
    docs: {
      description: {
        component: [
          "Le **suivi des objectifs** — une petite carte de 300 px qui dit où en est une prise en main : ce qui est fait, l'étape en cours, ce qui vient après. Elle vient des « quêtes » d'un jeu ; dans une application, c'est la liste « Bien démarrer ».",
          "",
          "**Quand l'utiliser** — pour accompagner une configuration en quelques étapes que l'utilisateur fait à son rythme, sans bloquer l'écran. Pour un formulaire en plusieurs pages, `Stepper` ; pour une visite guidée qui pointe les éléments de l'écran, `GuidedTour`.",
          "",
          "**Une carte qui flotte** — l'application la place où elle veut, en général dans un coin, en position absolue. En tête : le titre, `subtitle`, le compte « 1 / 4 », une barre d'avancement fine, un chevron qui replie la carte sur sa tête et, si `onDismiss` est fourni, une croix.",
          "",
          "**Les étapes** (`Objective` : `id`, `title`, `state`, et au besoin `description`, `hint`, `action`) — **faites** : cochées, barrées, en retrait ; **en cours** (`current`, une seule) : la seule mise en avant, avec un liseré à l'accent, sa description, son indice et, au besoin, un bouton d'action qui mène au geste à faire ; **à venir** : estompées, réduites à leur titre. Quand une étape passe à « faite », sa ligne s'illumine un instant ; toutes faites, la carte affiche `doneText` (« Terminé ! » par défaut).",
          "",
          "**Contrôlé ou non** — les états viennent de l'application, qui les fait avancer (ici, le bouton « Valider l'étape »). `collapsed` + `onCollapsedChange` rendent le repli contrôlé ; sans eux, la carte le tient seule.",
          "",
          "**Accessibilité** — une vraie liste ordonnée ; l'étape en cours porte `aria-current=\"step\"` et le compte est annoncé poliment quand il change. Sous un doigt, chevron, croix et action deviennent des cibles de 44 px.",
          "",
          "**Thème** — `--lq-color-accent` (liseré, barre), `--lq-color-up` (coches), `--lq-color-panel`, `--lq-color-border`, `--lq-color-fill-track`, `--lq-radius-lg`, `--lq-radius-md`, `--lq-text-xs` à `--lq-text-lg`, `--lq-space-1` à `--lq-space-4`.",
        ].join("\n"),
      },
    },
  },
  args: {
    title: "Bien démarrer",
    subtitle: "Configurer votre espace",
    objectives: stepsAt(1),
    collapsed: false,
    doneText: "Terminé !",
    onCollapsedChange: fn(),
    onDismiss: fn(),
  },
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    doneText: { control: "text" },
    objectives: { control: false },
    onCollapsedChange: { control: false },
    onDismiss: { control: false },
  },
  // La story tient l'avancement et le repli ; « Valider l'étape » fait avancer, la croix remet à zéro.
  render: function Render(args) {
    const [done, setDone] = useState(1);
    const [collapsed, setCollapsed] = useState(args.collapsed ?? false);
    useEffect(() => setCollapsed(args.collapsed ?? false), [args.collapsed]);
    return (
      <Stage height={420}>
        <Corner at="bottom-left">
          <ObjectiveTracker
            {...args}
            objectives={stepsAt(done, () => setDone((d) => d + 1))}
            collapsed={collapsed}
            onCollapsedChange={(next) => {
              setCollapsed(next);
              args.onCollapsedChange?.(next);
            }}
            onDismiss={
              args.onDismiss &&
              (() => {
                setDone(0);
                args.onDismiss?.();
              })
            }
          />
        </Corner>
      </Stage>
    );
  },
} satisfies Meta<typeof ObjectiveTracker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Collapsed: Story = {
  name: "Repliée",
  args: { collapsed: true },
  parameters: { docs: { description: { story: "Repliée sur sa tête : le titre, le compte et la barre d'avancement restent." } } },
};

export const AllDone: Story = {
  name: "Tout est fait",
  args: { objectives: stepsAt(ONBOARDING_STEPS.length), doneText: "Votre espace est prêt !" },
  render: (args) => (
    <Stage height={420}>
      <Corner at="bottom-left">
        <ObjectiveTracker {...args} />
      </Corner>
    </Stage>
  ),
  parameters: { docs: { description: { story: "Toutes les étapes faites : la carte affiche `doneText`." } } },
};

export const WithHint: Story = {
  name: "Indice et sans croix",
  args: { onDismiss: undefined, title: "Inviter l'équipe", subtitle: undefined },
  parameters: { docs: { description: { story: "L'étape en cours affiche son `hint` sous sa description. Sans `onDismiss`, pas de croix : la carte ne peut pas être fermée." } } },
};
