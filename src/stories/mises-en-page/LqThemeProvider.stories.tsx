import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, within } from "storybook/test";
import {
  LqThemeProvider,
  useLqTheme,
  Panel,
  StatCard,
  Badge,
  Button,
  Input,
  PriceChangeTag,
  UserMenu,
  Text,
  UserIcon,
  LogoutIcon,
  type LqFont,
  type LqPalette,
  type LqSurface,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { REVENUE_TREND } from "../../showcase/demoData";

const pct = (n: number) => `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;

/** Un échantillon : une carte, une tuile, des pastilles, des boutons, un champ — de quoi voir ce que
 *  le thème change. */
function Sample() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 20 }}>
      <Panel title="Commandes" meta="octobre">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <Badge tone="up">payée</Badge>
          <Badge tone="warning">en attente</Badge>
          <Badge tone="down">annulée</Badge>
          <PriceChangeTag value={12.4} format={pct} />
        </div>
      </Panel>
      <StatCard label="Revenu mensuel" value={"80 000 €"} delta={12.4} deltaFormat={pct} sparklineData={REVENUE_TREND} />
      <Input label="Client" placeholder="Lemoine SAS" />
      <div style={{ display: "flex", gap: 8 }}>
        <Button>Annuler</Button>
        <Button selected>Valider</Button>
      </div>
    </div>
  );
}

/** Une case de la comparaison : un fournisseur indépendant, avec sa légende. */
function Swatch({ palette, surface, layer, caption }: { palette: LqPalette; surface: LqSurface; layer: boolean; caption: string }) {
  return (
    <LqThemeProvider palette={palette} surface={surface} font={layer ? "inter" : "manrope"} className={layer ? "rdk" : ""} style={{ minWidth: 0 }}>
      <div style={{ padding: "12px 20px 0", fontSize: "0.75rem", color: "var(--lq-color-text-muted)" }}>{caption}</div>
      <Sample />
    </LqThemeProvider>
  );
}

/** Un panneau de réglages bâti sur `useLqTheme()` : il lit le thème courant et le change. */
function ThemeSettings() {
  const { palette, surface, font, setSurface, setFont } = useLqTheme();
  const fonts: LqFont[] = ["inter", "manrope", "sora", "space-grotesk", "ibm-plex-sans"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 20 }}>
      <Text size="sm" muted>
        Thème lu par <code>useLqTheme()</code> : palette « {palette} », surface « {surface} », police « {font} ».
      </Text>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Button selected={surface === "light"} onClick={() => setSurface("light")}>
          Clair
        </Button>
        <Button selected={surface === "dark"} onClick={() => setSurface("dark")}>
          Sombre
        </Button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {fonts.map((f) => (
          <Button key={f} selected={font === f} onClick={() => setFont(f)}>
            {f}
          </Button>
        ))}
      </div>
      <Sample />
    </div>
  );
}

/**
 * Le fournisseur de thème du kit — celui que `ResumeTheme` enveloppe.
 */
const meta = {
  title: "Foundations/LqThemeProvider",
  component: LqThemeProvider,
  parameters: {
    docs: {
      description: {
        component: [
          "Le **fournisseur de thème** du kit. Il enveloppe un sous-arbre dans un `<div class=\"lq-root\">` qui porte les variables `--lq-*` de la palette, de la surface et de la police choisies : c'est là que **tous** les composants du kit lisent leurs couleurs, rayons et espacements. Sans lui, un composant du kit n'a pas de thème.",
          "",
          "### Dans cette couche : `ResumeTheme`",
          "",
          "On ne l'emploie pas directement : la couche fournit `ResumeTheme` (`src/theme/index.tsx`), son **seul point d'entrée**, qui charge la feuille du kit et celle du thème, puis l'enveloppe ainsi :",
          "",
          "```tsx",
          "export function ResumeTheme({ surface = \"light\", children }) {",
          "  return (",
          "    <LqThemeProvider palette=\"color\" surface={surface} font=\"inter\" className=\"rdk\">",
          "      {children}",
          "    </LqThemeProvider>",
          "  );",
          "}",
          "```",
          "",
          "La classe `rdk` donne aux variables de `resume.css` (`.rdk.lq-root[data-lq-palette][data-lq-surface=…]`) un point de spécificité de plus que celles du kit : la couche gagne **quel que soit l'ordre des feuilles**. `palette` y est figée (le thème remplace les deux palettes du kit, la laisser ouverte donnerait un réglage sans effet), `surface` reste ouverte. Toutes les stories de ce Storybook passent par `ResumeTheme` ; la bascule **Surface** de la barre d'outils change sa `surface`.",
          "",
          "### Les props",
          "",
          "- **`palette`** — `\"eink\"` (défaut : papier et encre, monochrome, pour une liseuse) ou `\"color\"` (tablette rétroéclairée, couleurs franches). Posée en `data-lq-palette`. Dans les deux, le kit garde des angles droits, et la couche « resume » aussi : le CV n'a aucun arrondi.",
          "- **`surface`** — `\"light\"` (défaut) ou `\"dark\"`. Posée en `data-lq-surface`.",
          "- **`font`** — `\"manrope\"` (défaut), `\"inter\"`, `\"sora\"`, `\"space-grotesk\"`, `\"ibm-plex-sans\"`. Elle choisit seulement la **pile** de polices (`--lq-font-family`, en style en ligne) : l'application doit charger la fonte elle-même. Ce Storybook ne charge que Space Mono et League Spartan, celles du thème, qui redéfinit la pile `inter` en Space Mono ; les autres retombent sur la police système.",
          "- **`className`** — classe ajoutée à `.lq-root`. **Omise sur un fournisseur imbriqué, elle est reprise du fournisseur englobant** : c'est ce qui fait suivre `rdk` jusque dans les portails (menus, notifications), que le kit ré-enveloppe dans un fournisseur sans classe. `className=\"\"` refuse la classe englobante, mais **ne sort qu'à moitié de la couche** : les variables que le kit déclare sur `.lq-root` (couleurs, rayons, espacements, échelle de texte) reprennent leurs valeurs du kit, tandis que les variables **optionnelles** que la couche pose et que le kit lit sans les déclarer (`--lq-label-*`, `--lq-caption-*`, `--lq-font-weight-*`, `--lq-control-*`, `--lq-button-padding-*`, `--lq-field-*`, `--lq-row-font-size`…) continuent d'arriver par **héritage** depuis le `.rdk.lq-root` englobant.",
          "- **`style`** — styles du `<div class=\"lq-root\">`, fusionnés avec la variable de police.",
          "",
          "### Contrôlé ou non",
          "",
          "Chaque réglage est **contrôlé** quand sa prop est fournie, **non contrôlé** sinon (il part alors de sa valeur par défaut). Les composants du sous-arbre lisent et changent le thème avec `useLqTheme()` : `{ palette, surface, font, setPalette, setSurface, setFont }`. Un setter appelle toujours `onPaletteChange` / `onSurfaceChange` / `onFontChange` ; il ne change l'affichage que si le réglage est non contrôlé — sinon, à vous de repasser la nouvelle valeur.",
          "",
          "### Imbrication",
          "",
          "Les fournisseurs s'imbriquent : chacun repose ses variables et peint son propre fond (`--lq-color-bg`), ce qui permet de montrer deux modes côte à côte ou une zone sombre dans une page claire.",
        ].join("\n"),
      },
    },
  },
  args: {
    palette: "color",
    surface: "light",
    font: "inter",
    className: "",
    children: null,
    onPaletteChange: fn(),
    onSurfaceChange: fn(),
    onFontChange: fn(),
  },
  argTypes: {
    palette: { control: "inline-radio", options: ["eink", "color"] },
    surface: { control: "inline-radio", options: ["light", "dark"] },
    font: { control: "select", options: ["inter", "manrope", "sora", "space-grotesk", "ibm-plex-sans"] },
    className: { control: "text" },
    style: { control: false },
    children: { control: false },
  },
  render: (args) => (
    <LqThemeProvider {...args}>
      <Sample />
    </LqThemeProvider>
  ),
} satisfies Meta<typeof LqThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: {
    docs: {
      description: {
        story:
          "Le kit, **ou presque** : `className=\"\"` fait sortir ce fournisseur de la classe `rdk` posée par le Storybook — couleurs, rayons et espacements redeviennent ceux du kit. Les petits titres en capitales, les graisses et la mesure des champs viennent encore de la couche, par héritage (voir `className` plus haut). Changez `palette`, `surface` et `font` dans les contrôles ; écrivez `rdk` dans `className` pour rhabiller l'échantillon.",
      },
    },
  },
};

export const ResumeLayer: Story = {
  name: "Avec la couche (ResumeTheme)",
  args: { className: "rdk" },
  parameters: {
    docs: {
      description: {
        story:
          "Exactement ce que fait `ResumeTheme` : `palette=\"color\"`, `font=\"inter\"`, `className=\"rdk\"`. Ici, passer `palette` à `eink` ne change **rien** — la couche redéfinit les deux palettes ; `surface` et `font`, si.",
      },
    },
  },
};

export const SideBySide: Story = {
  name: "Côte à côte",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 1 }}>
      <Swatch palette="eink" surface="light" layer={false} caption="Kit · eink · clair" />
      <Swatch palette="color" surface="dark" layer={false} caption="Kit · color · sombre" />
      <Swatch palette="color" surface="light" layer caption="Couche resume · clair" />
      <Swatch palette="color" surface="dark" layer caption="Couche resume · sombre" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Quatre fournisseurs imbriqués, chacun avec ses variables et son fond : deux palettes du kit, puis la couche dans ses deux surfaces. Les deux cases du kit gardent pourtant les petits titres en capitales et les champs de la couche, transmis par héritage : le rendu du kit vraiment seul demande un arbre sans `ResumeTheme` au-dessus.",
      },
    },
  },
};

export const Uncontrolled: Story = {
  name: "Réglages depuis l'intérieur",
  render: (args) => (
    <LqThemeProvider palette="color" className="rdk" onSurfaceChange={args.onSurfaceChange} onFontChange={args.onFontChange}>
      <ThemeSettings />
    </LqThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`surface` et `font` ne sont pas passées : le fournisseur les tient lui-même (partant de « light » et « manrope »), et le panneau les change avec `useLqTheme()`. Les rappels `onSurfaceChange` / `onFontChange` sont appelés à chaque changement — voyez l'onglet Actions.",
      },
    },
  },
};

export const InheritedClass: Story = {
  name: "Classe héritée jusque dans les portails",
  render: () => (
    <LqThemeProvider palette="color" surface="dark">
      <div style={{ padding: 20, minHeight: 220 }}>
        <Text size="sm" muted>
          Fournisseur imbriqué, sans <code>className</code> : il reprend <code>rdk</code> du fournisseur englobant, et le menu — rendu dans un
          portail — aussi.
        </Text>
        <div style={{ marginTop: 12 }}>
          <UserMenu
            name="Claire Lemoine"
            subtitle="Directrice financière"
            items={[
              { id: "profil", label: "Mon profil", icon: <UserIcon size={16} /> },
              { id: "sortie", label: "Se déconnecter", icon: <LogoutIcon size={16} />, danger: true },
            ]}
          />
        </div>
      </div>
    </LqThemeProvider>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { expanded: false }));
  },
  parameters: {
    docs: {
      description: {
        story:
          "Une zone sombre dans une page claire : ce fournisseur ne fixe que `palette` et `surface`. Sa classe vient de `ResumeTheme` (posé par le Storybook), et le menu ouvert, rendu hors de l'arbre, garde les angles et l'ombre de la couche.",
      },
    },
  },
};
