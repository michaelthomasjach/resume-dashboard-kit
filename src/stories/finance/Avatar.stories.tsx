import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "@michaelthomasjach/liseuse-dashboard-kit";

/** Un portrait de démonstration, local et sans réseau : un buste stylisé aux bleus du thème. */
const PORTRAIT =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
      <rect width="96" height="96" fill="#1c1f5c"/>
      <circle cx="48" cy="38" r="18" fill="#7c82ff"/>
      <path d="M14 96c4-22 18-32 34-32s30 10 34 32z" fill="#3a41e2"/>
    </svg>
  `);

/**
 * L'avatar rond du kit : une photo si on en a une, sinon les initiales du nom.
 */
const meta = {
  title: "Primitives/Avatar",
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component: [
          "Pastille ronde qui **représente une personne ou une entité** : la photo si `src` est fourni, sinon les initiales tirées de `name`.",
          "",
          "**Quand l'utiliser** — à côté d'un nom dans une liste, un fil de commentaires, un menu de compte (`UserMenu` l'utilise), ou pour un titre financier (`HoldingCard` y met le symbole). Pour une icône d'action, prenez une icône du kit, pas un avatar.",
          "",
          "**Initiales** — la première lettre du premier mot et celle du dernier, en majuscules : « Claire Lemoine » donne **CL**, « Paul de la Vallée » donne **PV**, « Airbus » donne **A**. Sans `name`, l'avatar affiche **?**.",
          "",
          "**Taille** — `size` en pixels (36 par défaut) fixe le diamètre ; le texte suit, à 40 % du diamètre.",
          "",
          "**Image** — `src` remplace les initiales ; `name` sert alors de texte alternatif. L'image est recadrée dans le cercle.",
          "",
          "**Thème** — `--lq-color-fill-track` (fond des initiales), `--lq-color-text`, `--lq-color-border-subtle`, `--lq-font-weight-bold`.",
        ].join("\n"),
      },
    },
  },
  args: { name: "Claire Lemoine", size: 40 },
  argTypes: {
    size: { control: { type: "range", min: 16, max: 96, step: 4 }, table: { defaultValue: { summary: "36" } } },
    src: { control: "text" },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Sizes: Story = {
  name: "Tailles",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Avatar name="Claire Lemoine" size={24} />
      <Avatar name="Hugo Mercier" size={32} />
      <Avatar name="Inès Roux" size={40} />
      <Avatar name="Paul de la Vallée" size={56} />
      <Avatar name="Airbus" size={72} />
    </div>
  ),
  parameters: { docs: { description: { story: "24, 32, 40, 56 et 72 px. Notez « Paul de la Vallée » → PV, et un nom d'un seul mot → une seule lettre." } } },
};

export const WithImage: Story = {
  name: "Avec photo",
  args: { src: PORTRAIT, size: 56 },
};

export const WithoutName: Story = {
  name: "Sans nom",
  args: { name: undefined },
  parameters: { docs: { description: { story: "Ni `name` ni `src` : un point d'interrogation, pour un auteur inconnu ou supprimé." } } },
};

export const Team: Story = {
  name: "Une équipe",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320 }}>
      {[
        ["Claire Lemoine", "Directrice financière"],
        ["Hugo Mercier", "Contrôleur de gestion"],
        ["Inès Roux", "Trésorière"],
      ].map(([name, role]) => (
        <div key={name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={name} size={32} />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
            <span>{name}</span>
            <span style={{ fontSize: "var(--lq-text-sm)", color: "var(--lq-color-text-muted)" }}>{role}</span>
          </div>
        </div>
      ))}
    </div>
  ),
};
