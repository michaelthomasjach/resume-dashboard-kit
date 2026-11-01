import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Stepper, Text, type StepperStep } from "@michaelthomasjach/liseuse-dashboard-kit";

const ETAPES_IMPORT: StepperStep[] = [
  { id: "fichier", label: "Fichier" },
  { id: "colonnes", label: "Colonnes" },
  { id: "controle", label: "Contrôle" },
  { id: "import", label: "Import" },
];

/** Le suivi de la commande C-4823 : un titre et une date par étape, d'où des libellés en nœuds. */
const SUIVI: StepperStep[] = [
  { id: "recue", label: <Etape titre="Commande reçue" date="27 oct." /> },
  { id: "validee", label: <Etape titre="Paiement validé" date="28 oct." /> },
  { id: "preparee", label: <Etape titre="Préparée" date="29 oct." /> },
  { id: "expediee", label: <Etape titre="Expédiée" date="30 oct." /> },
  { id: "livree", label: <Etape titre="Livraison prévue" date="2 nov." /> },
];

function Etape({ titre, date }: { titre: string; date: string }) {
  return (
    <span style={{ display: "flex", flexDirection: "column" }}>
      <Text size="sm" weight="medium">
        {titre}
      </Text>
      <Text size="xs" muted>
        {date}
      </Text>
    </span>
  );
}

/**
 * Les étapes d'un parcours, enfilées sur une ligne.
 */
const meta = {
  title: "Feedback/Stepper",
  component: Stepper,
  parameters: {
    docs: {
      description: {
        component: [
          "Une suite d'étapes enfilées sur une ligne : de petits carrés pleins que la ligne traverse, chacun avec son texte, à l'horizontale ou à la verticale.",
          "",
          "**Lecture par l'opacité** — rien ne change de couleur : tout s'efface selon la **position**. L'étape en cours est à pleine force, celles déjà passées un cran en dessous (`completedOpacity`, 0,55), celles à venir plus pâles encore (`upcomingOpacity`, 0,22). La ligne est coupée en un segment par intervalle, qui s'efface de la même façon : elle s'éclaire jusqu'au carré courant et reste pâle au-delà. Elle part du bord et finit au bord, pour couvrir toute la largeur.",
          "",
          "**Quand l'utiliser** — situer l'utilisateur dans un parcours à étapes nommées : un assistant d'import, un tunnel de commande, le suivi d'une livraison. Pour un pourcentage d'avancement, une `ProgressBar` ; pour passer librement d'une vue à l'autre, des onglets (`Tabs`) — le stepper n'est pas cliquable.",
          "",
          "**Valeur** — `active` est l'index de l'étape en cours (0 pour la première). `active = steps.length` signifie que tout est fait : plus rien n'est en cours, toute la ligne se lit comme parcourue. Le composant n'a pas d'état ; l'appelant fait avancer `active`.",
          "",
          "**Anatomie** — chaque étape a un `id` et un `label` qui est un **nœud** : un titre au-dessus d'une date, une icône, ce qu'il faut, sans que le composant ait besoin d'une seconde prop de texte. À l'horizontale, le libellé passe sous le carré ; à la verticale (`orientation=\"vertical\"`), il passe **à côté**, puisque sous le carré court la ligne vers l'étape suivante. `stepSize` fixe la longueur minimale d'une étape (56 px à la verticale), `markerSize` le côté des carrés (12 px), `thickness` l'épaisseur de la ligne (2 px).",
          "",
          "**Thème** — carrés et ligne en `--lq-color-fill`, libellés en `--lq-color-text` à `--lq-text-sm`, carrés à angles `--lq-radius-sm`. Les « opacités » des carrés sont en réalité un **mélange** de `--lq-color-fill` avec `--lq-color-panel`, pas une transparence : posé sur un autre fond que celui des panneaux, le stepper garde des carrés couleur panneau.",
        ].join("\n"),
      },
    },
  },
  args: { steps: ETAPES_IMPORT, active: 1 },
  argTypes: {
    steps: { control: false },
    active: { control: { type: "range", min: 0, max: ETAPES_IMPORT.length, step: 1 } },
    activeOpacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    completedOpacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    upcomingOpacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
  },
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <Stepper {...args} />
    </div>
  ),
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Faites glisser le contrôle `active` de 0 à 4 : à 4 (`steps.length`), tout le parcours est fait." } } },
};

export const Wizard: Story = {
  name: "Assistant",
  parameters: { docs: { description: { story: "L'appelant fait avancer `active` depuis ses propres boutons." } } },
  render: function Render(args) {
    const [etape, setEtape] = useState(0);
    const fini = etape === ETAPES_IMPORT.length;
    return (
      <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 16 }}>
        <Stepper {...args} steps={ETAPES_IMPORT} active={etape} />
        <Text size="sm" muted>
          {fini ? "Import terminé : 1 248 contacts ajoutés." : `Étape ${etape + 1} sur ${ETAPES_IMPORT.length}`}
        </Text>
        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={() => setEtape((e) => Math.max(0, e - 1))} disabled={etape === 0}>
            Précédente
          </Button>
          <Button selected onClick={() => setEtape((e) => Math.min(ETAPES_IMPORT.length, e + 1))} disabled={fini}>
            {etape >= ETAPES_IMPORT.length - 1 ? "Terminer" : "Suivante"}
          </Button>
        </div>
      </div>
    );
  },
};

export const Vertical: Story = {
  name: "Vertical",
  args: { steps: SUIVI, active: 3, orientation: "vertical", stepSize: 48 },
  parameters: { docs: { description: { story: "Le suivi d'une commande : à la verticale, le libellé — ici un titre et une date — se pose à côté du carré." } } },
};

export const Completed: Story = {
  name: "Parcours terminé",
  args: { active: ETAPES_IMPORT.length },
};

export const Bold: Story = {
  name: "Carrés et ligne épais",
  args: { active: 2, markerSize: 16, thickness: 4, upcomingOpacity: 0.3 },
};
