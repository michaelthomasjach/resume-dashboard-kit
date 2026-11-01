import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { AlertMarker } from "@michaelthomasjach/liseuse-dashboard-kit";
import { Caption, Pin, Stage } from "./_Stage";

/**
 * L'épingle d'alerte : plantée sur un plan à l'endroit d'un problème, on la voit de loin, on clique,
 * on est emmené au problème.
 */
const meta = {
  title: "Widgets/AlertMarker",
  component: AlertMarker,
  parameters: {
    docs: {
      description: {
        component: [
          "Le **marqueur d'alerte** — l'épingle qu'on plante sur une scène à l'endroit d'un problème : un quai engorgé, un rack plein, une machine en panne. Une pastille ronde à la couleur de la gravité, le triangle d'alerte au centre, cerclée de la couleur du panneau pour se détacher de n'importe quel fond, prolongée d'une petite pointe.",
          "",
          "**Quand l'utiliser** — pour signaler un problème **à un endroit** : sur un plan d'entrepôt, une carte, un schéma de machine. Pour des alertes sans lieu, `AlertMarkerStack` (dans un coin) ou `AlertList` (dans la page) ; pour un message qui surgit puis s'en va, une notification.",
          "",
          "**Le point d'ancrage est le bout de la pointe** — le milieu du bord inférieur de l'élément. Pour planter l'épingle en `(x, y)`, placez-la en `position: absolute; left: x; top: y` et décalez-la de `transform: translate(-50%, -100%)`. Rien ne déborde de ce bord : l'ombre au sol est dessinée dessus.",
          "",
          "**Gravité et taille** — `severity` : `critical` au rouge de danger, `warning` à l'ambre, `info` à l'accent. `size` : `sm` (24 px) ou `md` (32 px, défaut). `count` au-delà de 1 ajoute une bulle chiffrée, plafonnée à « 99+ » — à « 9+ » en `sm`, avec une bulle plus petite posée en dehors de la pastille (le nom accessible garde le compte exact).",
          "",
          "**Mouvement** — par défaut l'épingle **rebondit** doucement, à intervalles, et grossit au survol et au focus depuis sa pointe (l'ancrage ne bouge pas). `bounce={false}` la fige ; `prefers-reduced-motion` aussi.",
          "",
          "**Accessibilité** — c'est un bouton : `label` est à la fois l'infobulle et le nom accessible, complété du compte (« Quai 3 engorgé (4) »). La gravité n'est dite que par la couleur et la forme : nommez-la dans `label` si elle compte (« Critique : … »). Sur un pointeur grossier, la zone cliquable déborde de la pastille pour offrir 40 px au doigt.",
          "",
          "**Thème** — `--lq-color-danger`, `--lq-color-amber`, `--lq-color-accent` (gravités), `--lq-color-accent-contrast` (triangle), `--lq-color-warning-contrast` (triangle sur l'ambre, facultative : à défaut, `--lq-color-text` en clair et `--lq-color-bg` en sombre, l'encre claire n'y atteignant que 1,4:1), `--lq-color-panel` (cerclage), `--lq-color-focus-ring`, `--lq-font-weight-heavy` et `--lq-text-xs` (bulle chiffrée).",
        ].join("\n"),
      },
    },
  },
  args: { severity: "critical", count: 4, label: "Critique : quai 3 engorgé", onClick: fn(), size: "md", bounce: true },
  argTypes: { onClick: { control: false } },
  render: (args) => (
    <Stage height={260} plan>
      <Pin x="27%" y="50%">
        <AlertMarker {...args} />
      </Pin>
    </Stage>
  ),
} satisfies Meta<typeof AlertMarker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Severities: Story = {
  name: "Gravités et tailles",
  render: () => (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-end", flexWrap: "wrap", padding: "16px 0" }}>
      {(["critical", "warning", "info"] as const).map((severity) => (
        <div key={severity} style={{ display: "flex", gap: 14, alignItems: "flex-end" }}>
          <AlertMarker severity={severity} label={severity} onClick={() => {}} bounce={false} />
          <AlertMarker severity={severity} label={`${severity}, 3 problèmes`} count={3} onClick={() => {}} bounce={false} />
          <AlertMarker severity={severity} label={`${severity}, petit`} size="sm" onClick={() => {}} bounce={false} />
          <AlertMarker severity={severity} label={`${severity}, 120 problèmes`} size="sm" count={120} onClick={() => {}} bounce={false} />
        </div>
      ))}
    </div>
  ),
  parameters: { docs: { description: { story: "Les trois gravités, en `md` puis en `sm`, sans compte, avec 3 et avec 120 (affiché « 9+ » en `sm`) ; rebond coupé." } } },
};

export const OnPlan: Story = {
  name: "Sur un plan",
  render: function Render() {
    const [last, setLast] = useState("—");
    return (
      <Stage height={380} plan>
        <Pin x="22%" y="40%">
          <AlertMarker severity="critical" count={4} label="Critique : quai 3 engorgé" onClick={() => setLast("Quai 3")} />
        </Pin>
        <Pin x="38%" y="58%">
          <AlertMarker severity="warning" label="Rack B presque plein" onClick={() => setLast("Rack B")} />
        </Pin>
        <Pin x="64%" y="60%">
          <AlertMarker severity="info" label="Préparateur disponible" onClick={() => setLast("Préparateur")} />
        </Pin>
        <Pin x="74%" y="74%">
          <AlertMarker severity="warning" size="sm" count={2} bounce={false} label="Convoyeur ralenti" onClick={() => setLast("Convoyeur")} />
        </Pin>
        <Caption>Dernier clic : {last}</Caption>
      </Stage>
    );
  },
  parameters: { docs: { description: { story: "Quatre épingles plantées par leur pointe ; la dernière, petite, ne rebondit pas." } } },
};

export const Still: Story = {
  name: "Immobile",
  args: { severity: "warning", count: undefined, label: "Rack B presque plein", bounce: false },
  parameters: { docs: { description: { story: "`bounce={false}` : pour une scène où plusieurs épingles s'agiteraient en même temps." } } },
};
