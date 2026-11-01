import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Card, ProgressCircle, type SurfaceTone } from "@michaelthomasjach/liseuse-dashboard-kit";

const row = { display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" as const };
const caption = { fontSize: 12, color: "var(--lq-color-text-muted)", marginTop: 8, textAlign: "center" as const };

/**
 * Le cercle de progression : déterminé ou indéterminé, le pendant circulaire de `ProgressBar`.
 */
const meta = {
  title: "Feedback/ProgressCircle",
  component: ProgressCircle,
  parameters: {
    docs: {
      description: {
        component: [
          "Un anneau qui se remplit dans le sens des aiguilles d'une montre depuis midi. **Déterminé** avec `value` (de 0 à 100) : l'arc couvre cette part du tour et glisse d'une valeur à la suivante. **Indéterminé** sans `value` : un arc d'un gros quart fait le tour en boucle.",
          "",
          "**Quand l'utiliser** — un avancement mesurable là où une barre n'a pas la place : la vignette d'un fichier qui s'envoie, une ligne de liste, le centre d'une carte, un quota. Pour un avancement dans une colonne ou un formulaire, la `ProgressBar` se lit mieux ; pour une attente sans mesure dans un bouton, le `Spinner` suffit (il n'a pas le rôle `progressbar`) ; pour une **mesure** sur une échelle avec bornes et seuils (température, charge), une jauge : `GaugeCard`, `LevelGauge`.",
          "",
          "**Props** —",
          "- `value` : 0 à 100, ramenée dans ces bornes ; absente, le cercle est indéterminé.",
          "- `size` : `sm` (24 px, dans une ligne de texte), `md` (48 px, défaut), `lg` (96 px) ou un nombre de px.",
          "- `thickness` : l'épaisseur du trait en px ; par défaut un douzième du diamètre, 2 px au moins (4 px à 48).",
          "- `tone` : la couleur de l'arc, du même vocabulaire que les tuiles pleines de `Card` — `default`, `accent`, `success`, `info`, `danger`, `warning`, `dark`.",
          "- `showValue` : la valeur au centre (ignorée en indéterminé) ; sa taille suit le diamètre intérieur et la longueur du texte, avec une ellipse en dernier recours ; prévoir 40 px de diamètre au moins. `formatValue` la met en forme (défaut : « 64 % ») et, si elle rend une chaîne, sert aussi de texte lu par le lecteur d'écran.",
          "- `label` : le nom accessible (« Progression », ou « Chargement… » en indéterminé).",
          "",
          "**Accessibilité** — `role=\"progressbar\"`, `aria-valuemin` 0, `aria-valuemax` 100, `aria-valuenow` en déterminé (absent en indéterminé, qui porte `aria-busy`), `aria-valuetext` quand `formatValue` rend une chaîne. Le cercle n'est pas focalisable : il n'y a rien à y faire au clavier.",
          "",
          "**Mouvement** — la rotation de l'indéterminé suit le rythme du `Spinner` (un tour en 0,9 s). En palette e-ink et sous `prefers-reduced-motion`, il ne tourne pas : l'arc arrêté se lirait comme une valeur, il laisse donc la place à un anneau en tirets réguliers, qui dit « en cours » sans chiffre à lire. Le glissement d'une valeur à l'autre est coupé sous `prefers-reduced-motion`.",
          "",
          "**Thème** — arc du ton `default` : `--lq-progress-circle-color` (repli `--lq-color-fill`) ; autres tons : `--lq-tone-accent`, `--lq-tone-success`, `--lq-tone-info`, `--lq-tone-danger`, `--lq-tone-warning`, `--lq-tone-dark` (les mêmes que les tuiles pleines) ; anneau de fond `--lq-progress-circle-track` (repli `--lq-color-fill-track`) ; valeur `--lq-color-text`, `--lq-font-weight-semibold`. En e-ink, l'anneau de fond devient un filet `--lq-color-border`. Ce thème trace l'arc dans le bleu du CV, `#3a41e2` sur un anneau `#cfd2e3` (`#7c82ff` sur `#3d4066` en sombre).",
        ].join("\n"),
      },
    },
  },
  args: { value: 64, size: "md", tone: "default", showValue: false, label: "Import des transactions" },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    size: { control: "select", options: ["sm", "md", "lg", 32, 64, 120], table: { defaultValue: { summary: '"md"' } } },
    thickness: { control: { type: "number", min: 1, max: 20 } },
    tone: { control: "select", options: ["default", "accent", "success", "info", "danger", "warning", "dark"], table: { defaultValue: { summary: '"default"' } } },
    showValue: { control: "boolean" },
    formatValue: { control: false },
    label: { control: "text" },
    className: { control: false },
  },
} satisfies Meta<typeof ProgressCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Déterminé (défaut)",
  parameters: { docs: { description: { story: "64 % d'un import : l'arc part de midi et couvre les deux tiers du tour. Jouez avec `value` dans le panneau Controls : l'arc glisse." } } },
};

export const Indeterminate: Story = {
  name: "Indéterminé",
  args: { value: undefined, label: "Synchronisation…" },
  render: (args) => (
    <div style={row}>
      <ProgressCircle {...args} size="sm" />
      <ProgressCircle {...args} size="md" />
      <ProgressCircle {...args} size="lg" />
    </div>
  ),
  parameters: { docs: { description: { story: "Sans `value`, aux trois tailles. En e-ink ou sous `prefers-reduced-motion`, l'anneau passe en tirets au lieu de tourner." } } },
};

export const WithValue: Story = {
  name: "Valeur au centre",
  render: () => (
    <div style={row}>
      <ProgressCircle value={0} size="lg" showValue />
      <ProgressCircle value={38} size="lg" showValue />
      <ProgressCircle value={100} size="lg" showValue tone="success" />
      <ProgressCircle value={72} size={64} showValue formatValue={(v) => `${Math.round((v / 100) * 50)}/50`} label="Fichiers envoyés" />
      <ProgressCircle value={64} size={120} thickness={10} showValue formatValue={() => "218 / 340"} label="Lignes rapprochées" />
    </div>
  ),
  parameters: { docs: { description: { story: "`showValue` met le chiffre au centre, `formatValue` le réécrit — ici « 36/50 » fichiers, qui devient aussi le texte lu par le lecteur d'écran. Un texte plus long (« 218 / 340 ») réduit pour tenir dans l'anneau, et finit en ellipse s'il n'y tient toujours pas. À 0, l'arc ne laisse pas de point à midi." } } },
};

export const Sizes: Story = {
  name: "Tailles et épaisseurs",
  render: () => (
    <div style={row}>
      {(
        [
          ["sm", undefined],
          ["md", undefined],
          ["lg", undefined],
          [48, 2],
          [48, 8],
          [120, 14],
        ] as const
      ).map(([size, thickness]) => (
        <div key={`${size}-${thickness}`} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <ProgressCircle value={62} size={size} thickness={thickness} showValue={typeof size === "number" ? size >= 48 : size !== "sm"} />
          <div style={caption}>
            {String(size)}
            {thickness ? ` · ${thickness} px` : ""}
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: { docs: { description: { story: "Les trois tailles nommées, puis des diamètres et des traits libres. Le petit (24 px) se passe de valeur au centre : elle n'y tiendrait pas." } } },
};

const TONES: SurfaceTone[] = ["default", "accent", "success", "info", "danger", "warning", "dark"];

export const Tones: Story = {
  name: "Tons",
  render: () => (
    <div style={row}>
      {TONES.map((tone, i) => (
        <div key={tone} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <ProgressCircle value={30 + i * 10} tone={tone} showValue />
          <div style={caption}>{tone}</div>
        </div>
      ))}
    </div>
  ),
  parameters: { docs: { description: { story: "Les tons des tuiles pleines, lus dans les mêmes variables : ce thème les règle sur le bleu du CV puis une famille sobre qui ne le concurrence pas (accent `#3a41e2`, succès `#2e9e5b`, info `#1c1f5c`, danger `#c4213a`, avertissement `#f2b705`)." } } },
};

export const Live: Story = {
  name: "En direct",
  render: function Render() {
    const [value, setValue] = useState(0);
    const [running, setRunning] = useState(true);
    useEffect(() => {
      if (!running) return;
      const id = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 4)), 300);
      return () => clearInterval(id);
    }, [running]);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <ProgressCircle value={value} size="lg" showValue tone={value === 100 ? "success" : "default"} label="Envoi du fichier" />
        <Button onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Reprendre"}</Button>
      </div>
    );
  },
  parameters: { docs: { description: { story: "Un envoi simulé, 4 % toutes les 300 ms : l'arc glisse d'une valeur à la suivante et passe au vert à 100 %." } } },
};

export const InCard: Story = {
  name: "Dans une carte",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 280px))", gap: 16 }}>
      <Card title="Stockage">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <ProgressCircle value={81} size={72} showValue tone="warning" label="Stockage utilisé" />
          <div style={{ fontSize: "0.85rem", color: "var(--lq-color-text-muted)" }}>40,5 Go sur 50 Go</div>
        </div>
      </Card>
      <Card title="Objectif du mois" tone="success">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <ProgressCircle value={58} size={72} showValue label="Objectif atteint" />
          <div style={{ fontSize: "0.85rem" }}>29 000 € sur 50 000 €</div>
        </div>
      </Card>
    </div>
  ),
  parameters: { docs: { description: { story: "Dans une carte ordinaire, et dans une tuile pleine : le ton `default` lit la couleur de remplissage, que la tuile redéfinit pour ses enfants — le cercle passe en contraste sans rien savoir du ton." } } },
};
