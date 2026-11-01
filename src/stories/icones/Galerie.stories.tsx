import { useState, type ComponentType, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as Kit from "@michaelthomasjach/liseuse-dashboard-kit";
import {
  Input,
  Text,
  Button,
  Toggle,
  SearchIcon,
  SettingsIcon,
  BellIcon,
  CalendarIcon,
  CheckIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockOffIcon,
  RefreshIcon,
  InfoIcon,
  WindIcon,
  PlayIcon,
  EyeIcon,
  ErrorIcon,
  PlusIcon,
  CloudIcon,
  StarIcon,
  LockIcon,
  CopyIcon,
  CloudRainIcon,
  type AnimatedIconProps,
  type IconMotion,
} from "@michaelthomasjach/liseuse-dashboard-kit";

type AnyIcon = ComponentType<AnimatedIconProps>;

/** Toutes les icônes, lues dans les exports du kit plutôt que recopiées dans une liste : une icône
 *  ajoutée au kit apparaît ici d'elle-même, sous son nom d'export exact. */
const ICONS: { name: string; Icon: AnyIcon }[] = Object.entries(Kit as unknown as Record<string, unknown>)
  .filter((entry): entry is [string, AnyIcon] => entry[0].endsWith("Icon") && typeof entry[1] === "function")
  .map(([name, Icon]) => ({ name, Icon }))
  .sort((a, b) => a.name.localeCompare(b.name));

/** Le vocabulaire des mouvements, chacun montré sur une icône dont c'est le mouvement propre. */
const MOTIONS: { motion: IconMotion; Icon: AnyIcon; name: string; description: string }[] = [
  { motion: "spin", Icon: RefreshIcon, name: "RefreshIcon", description: "Un tour complet, lentement — soleil, engrenage, actualiser." },
  { motion: "pulse", Icon: InfoIcon, name: "InfoIcon", description: "Respire, échelle et opacité ensemble — lune, batterie, information." },
  { motion: "sway", Icon: WindIcon, name: "WindIcon", description: "Bascule de quelques degrés — vent, trait dessiné, pinceau." },
  { motion: "bob", Icon: ArrowUpIcon, name: "ArrowUpIcon", description: "Monte et retombe — flèches, tout ce qui a un sens vertical." },
  { motion: "slide", Icon: PlayIcon, name: "PlayIcon", description: "Part un peu de côté et revient — lecture, chevrons, avancer." },
  { motion: "ring", Icon: BellIcon, name: "BellIcon", description: "Se balance depuis son attache, comme une cloche." },
  { motion: "blink", Icon: EyeIcon, name: "EyeIcon", description: "Cligne : presque transparent un instant — œil, curseur, code." },
  { motion: "shake", Icon: ErrorIcon, name: "ErrorIcon", description: "Un bref tremblement nerveux — erreur, fermeture, alerte." },
  { motion: "grow", Icon: PlusIcon, name: "PlusIcon", description: "Gonfle depuis son centre — ajouter, zoomer, agrandir." },
  { motion: "float", Icon: CloudIcon, name: "CloudIcon", description: "Dérive, plus lent et plus doux que bob — nuage, calques, fichier." },
  { motion: "beat", Icon: StarIcon, name: "StarIcon", description: "Deux battements rapides par cycle — activité, étoile, étincelle." },
  { motion: "tilt", Icon: LockIcon, name: "LockIcon", description: "Penche depuis son coin bas-gauche — un couvercle, un rabat." },
  { motion: "flip", Icon: CopyIcon, name: "CopyIcon", description: "Se retourne sur son axe vertical — copier, ce qui a deux faces." },
  { motion: "raindrop", Icon: CloudRainIcon, name: "CloudRainIcon", description: "Tombe et s'efface ; posé sur une partie de l'icône, ici les gouttes." },
];

const grid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(118px, 1fr))", gap: 8 };
const cell: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  minHeight: 92,
  padding: "14px 6px",
  color: "var(--lq-color-text)",
  background: "var(--lq-color-panel)",
  border: "1px solid var(--lq-color-border-subtle)",
  borderRadius: "var(--lq-radius-md)",
};
const iconName: CSSProperties = {
  fontFamily: "var(--lq-font-mono, ui-monospace, monospace)",
  fontSize: 11,
  lineHeight: 1.3,
  textAlign: "center",
  wordBreak: "break-word",
  color: "var(--lq-color-text-muted)",
};

interface GalleryArgs {
  /** Taille de chaque icône, en pixels. */
  size: number;
  /** Allume l'animation de repos de toutes les icônes. */
  animated: boolean;
}

/** La grille filtrable : un champ de recherche, le compte, et une case par icône. */
function IconGrid({ size, animated }: GalleryArgs) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const shown = q ? ICONS.filter(({ name }) => name.toLowerCase().includes(q)) : ICONS;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
        <div style={{ width: 320 }}>
          <Input
            label="Filtrer par nom"
            placeholder="ex. : arrow, chart, user…"
            leadingIcon={<SearchIcon size={16} />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Text size="sm" muted>
          {shown.length === ICONS.length ? `${ICONS.length} icônes` : `${shown.length} sur ${ICONS.length}`}
        </Text>
      </div>
      {shown.length ? (
        <div style={grid}>
          {shown.map(({ name, Icon }) => (
            <div key={name} style={cell} title={name}>
              <Icon size={size} animated={animated} />
              <span style={iconName}>{name}</span>
            </div>
          ))}
        </div>
      ) : (
        <Text size="sm" muted>
          Aucune icône ne porte « {query} » dans son nom.
        </Text>
      )}
    </div>
  );
}

/**
 * La galerie des icônes du kit, dans le thème : toutes, par nom, avec leurs tailles, leur couleur
 * héritée et leurs animations.
 */
const meta = {
  title: "Foundations/Icons",
  parameters: {
    docs: {
      description: {
        component: [
          `Le kit exporte **${ICONS.length} icônes**, une par export dont le nom finit par \`Icon\`. Toutes suivent le même dessin : une grille de 24 × 24, un trait de 1,75 aux extrémités arrondies, aucun remplissage. Elles n'ont **aucune couleur à elles** et le thème n'a rien à leur dire : elles prennent celle du texte qui les entoure.`,
          "",
          "**Importer** — une icône est un composant nommé, importé du paquet comme le reste du kit ; seules celles que vous importez finissent dans votre application.",
          "",
          "```tsx",
          'import { BellIcon, SettingsIcon } from "@michaelthomasjach/liseuse-dashboard-kit";',
          "",
          "<BellIcon size={18} />",
          "<SettingsIcon size={16} style={{ color: \"var(--lq-color-accent)\" }} />",
          "```",
          "",
          "**Tailles** — `size`, en pixels, fixe la largeur et la hauteur (24 par défaut). Le trait est dessiné dans la grille de 24 : il s'épaissit avec l'icône. Repères : 14 dans un petit bouton ou une ligne de tableau, 16 dans un `Button` ou un champ, 18 dans un `IconButton`, 20 à 24 à côté d'un titre, 32 et plus pour une illustration. Dans un `IconButton`, la feuille du kit ramène l'icône à 55 % du bouton, quelle que soit sa `size`.",
          "",
          "**Couleur** — le tracé est en `currentColor` : posez `color` sur le parent, ou sur l'icône par `style` ou `className`. Préférez les variables du thème (`--lq-color-accent`, `--lq-color-up`, `--lq-color-down`, `--lq-color-text-muted`) : l'icône suivra la surface sombre sans rien faire.",
          "",
          "**Autres attributs** — tout attribut d'un `<svg>` passe (`className`, `style`, `strokeWidth` pour un trait plus fin ou plus gras, `aria-*`…).",
          "",
          "**Accessibilité** — chaque icône est rendue avec `aria-hidden=\"true\"` : elle est décorative, et c'est le contrôle qui la porte qui doit avoir un nom (`ariaLabel` d'un `IconButton`, libellé d'un `Button`). Pour une icône seule qui porte un sens, passez `aria-hidden={false}`, `role=\"img\"` et un `aria-label`.",
          "",
          "**Animation** — `animated` allume une animation de repos, éteinte par défaut. Chaque icône choisit **son** mouvement d'après ce qu'elle veut dire — une cloche sonne, un œil cligne, une flèche d'actualisation tourne — parmi un vocabulaire de quatorze (story « Animées »). À réserver à l'instance qui doit attirer l'œil : une cloche quand une notification arrive, l'icône d'un bouton pendant un chargement. `motion` force un autre mouvement, mais le choix de l'icône est le bon dans presque tous les cas. Tout s'arrête quand le système demande moins d'animations (`prefers-reduced-motion`).",
          "",
          "**Trouver une icône** — la story « Toutes les icônes » filtre par nom ; ses contrôles changent la taille et allument l'animation de toute la grille.",
        ].join("\n"),
      },
    },
  },
  args: { size: 24, animated: false },
  render: (args: GalleryArgs) => <IconGrid {...args} />,
  argTypes: {
    size: { control: { type: "range", min: 12, max: 64, step: 2 }, description: "Taille de chaque icône, en pixels." },
    animated: { control: "boolean", description: "Allume l'animation de repos de toutes les icônes." },
  },
} satisfies Meta<GalleryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
  name: "Toutes les icônes",
  parameters: {
    docs: {
      source: {
        code: [
          'import { BellIcon } from "@michaelthomasjach/liseuse-dashboard-kit";',
          "",
          "<BellIcon size={24} />",
          "<BellIcon size={24} animated />",
        ].join("\n"),
      },
    },
  },
};

export const Sizes: Story = {
  name: "Tailles",
  render: () => {
    const sizes = [12, 14, 16, 18, 20, 24, 32, 48];
    const samples: { name: string; Icon: AnyIcon }[] = [
      { name: "SettingsIcon", Icon: SettingsIcon },
      { name: "BellIcon", Icon: BellIcon },
      { name: "CalendarIcon", Icon: CalendarIcon },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {samples.map(({ name, Icon }) => (
          <div key={name} style={{ display: "flex", alignItems: "flex-end", gap: 22 }}>
            <span style={{ ...iconName, width: 110, textAlign: "left" }}>{name}</span>
            {sizes.map((s) => (
              <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "var(--lq-color-text)" }}>
                <Icon size={s} />
                <span style={iconName}>{s}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: { description: { story: "De 12 à 48 px. Le trait est tracé dans la grille de 24 : il s'affine sous 24 px et s'épaissit au-dessus." } },
  },
};

export const InheritedColor: Story = {
  name: "Couleur héritée",
  render: () => {
    const tones = [
      { label: "texte", color: "var(--lq-color-text)", Icon: CheckIcon },
      { label: "accent", color: "var(--lq-color-accent)", Icon: StarIcon },
      { label: "hausse", color: "var(--lq-color-up)", Icon: ArrowUpIcon },
      { label: "baisse", color: "var(--lq-color-down)", Icon: ArrowDownIcon },
      { label: "atténué", color: "var(--lq-color-text-muted)", Icon: ClockOffIcon },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", gap: 24 }}>
          {tones.map(({ label, color, Icon }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color }}>
              <Icon size={24} />
              <span style={{ fontSize: 12 }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={<CheckIcon size={16} />}>Valider</Button>
          <Button selected icon={<CheckIcon size={16} />}>
            Valider
          </Button>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Chaque icône prend la `color` de son parent. Dans un `Button`, elle suit le texte du bouton — encre au repos, contraste de l'accent une fois sélectionné. Basculez la surface en sombre : rien n'est à refaire.",
      },
    },
  },
};

export const Animated: Story = {
  name: "Animées",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 8 }}>
      {MOTIONS.map(({ motion, Icon, name, description }) => (
        <div key={motion} style={{ ...cell, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 14, minHeight: 0, padding: "12px 14px" }}>
          <Icon size={28} animated />
          <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>
              {motion} <span style={{ ...iconName, fontWeight: 400 }}>· {name}</span>
            </span>
            <span style={{ fontSize: 12, lineHeight: 1.4, color: "var(--lq-color-text-muted)" }}>{description}</span>
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Les quatorze mouvements, chacun sur une icône dont c'est le mouvement propre, avec `animated`. Pour voir toutes les icônes bouger, allumez le contrôle `animated` de « Toutes les icônes ».",
      },
    },
  },
};

export const InContext: Story = {
  name: "Animation en situation",
  render: function Render() {
    const [loading, setLoading] = useState(false);
    const [unread, setUnread] = useState(true);
    const refresh = () => {
      setLoading(true);
      window.setTimeout(() => setLoading(false), 2500);
    };
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button icon={<RefreshIcon size={16} animated={loading} />} onClick={refresh} disabled={loading}>
            {loading ? "Actualisation…" : "Actualiser"}
          </Button>
          <Text size="sm" muted>
            L'icône tourne le temps du chargement.
          </Text>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: unread ? "var(--lq-color-accent)" : "var(--lq-color-text-muted)", display: "inline-flex" }}>
            <BellIcon size={22} animated={unread} />
          </span>
          <Toggle checked={unread} onChange={setUnread} ariaLabel="Notification non lue" />
          <Text size="sm" muted>
            La cloche sonne tant qu'une notification attend.
          </Text>
        </div>
      </div>
    );
  },
  parameters: {
    docs: { description: { story: "L'animation dit un état : elle s'allume avec lui et s'éteint avec lui, sur la seule icône concernée." } },
  },
};
