import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button, Lightbox, type LightboxProps } from "@michaelthomasjach/liseuse-dashboard-kit";
import { GALLERY_IMAGES_PLAIN } from "../_data/gallery";

/**
 * La visionneuse plein écran de `Gallery`, utilisable seule. Chaque story s'ouvre dans son propre
 * cadre, visionneuse ouverte ; « Ouvrir la visionneuse » la rouvre après Échap.
 */
const meta = {
  title: "Widgets/Lightbox",
  component: Lightbox,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, iframeHeight: 560 },
      description: {
        component: [
          "Une **visionneuse d'images plein écran** : l'image centrée, à sa proportion, sa légende dessous, un compteur « 3 / 12 », des flèches de part et d'autre et une bande de vignettes en bas. C'est celle qu'ouvre `Gallery` au clic ; elle s'utilise aussi seule — les photos d'une fiche produit, les pièces jointes d'un message.",
          "",
          "**Contrôlée** — l'application tient `open` et `index` (à partir de 0) ; la visionneuse ne fait que demander d'en changer, par `onIndexChange(index)` et `onClose()`. Un `index` hors bornes est ramené dedans.",
          "",
          "**Images** — `images` : `src`, `alt` (obligatoire), `title` et `caption` (sous l'image), `thumbnail` (la vignette, `src` à défaut), `width` / `height` (réservent la place avant le chargement). Les deux voisines se chargent d'avance.",
          "",
          "**Options** — `thumbnails` (défaut `true`, masquée d'elle-même pour une image seule), `loop` (défaut `true` : après la dernière, la première ; sinon les flèches s'éteignent aux extrémités), `showCounter`, `closeOnBackdrop` (un clic à côté de l'image ferme, défaut `true`), `labels` (textes des boutons, nom de la boîte, format du compteur).",
          "",
          "**Surface** — `surface=\"dark\"` (défaut) : la visionneuse prend toujours la surface sombre du thème, comme une table lumineuse ; `\"inherit\"` garde celle de l'application. La palette reste celle de l'application.",
          "",
          "**Clavier et accessibilité** — `role=\"dialog\"` et `aria-modal`. ← → changent d'image, Début et Fin vont aux extrémités, Échap ferme. Le **focus est piégé** (Tab et Maj+Tab tournent entre la croix, les flèches et les vignettes) puis **rendu**, à la fermeture, à l'élément qui l'avait. Le compteur est une région `aria-live` ; la vignette courante porte `aria-current`. Le défilement de la page est suspendu tant qu'elle est ouverte. Au doigt, un balayage horizontal change d'image ; sous 640 px, les flèches passent sur l'image.",
          "",
          "**Portail** — rendue dans `document.body`, au-dessus des modales (z-index 3100, on l'ouvre souvent depuis l'une d'elles), et ré-enveloppée d'un `LqThemeProvider` qui reprend la classe de thème : le thème de la couche la suit.",
          "",
          "**Thème** — `--lq-lightbox-backdrop` (fond, repli `--lq-color-bg`), `--lq-lightbox-radius` (image, repli `--lq-radius-sm`), `--lq-lightbox-button-bg` et `--lq-lightbox-button-radius` (boutons ronds par défaut), `--lq-lightbox-thumb-size` (64 px), toutes optionnelles ; puis `--lq-color-text`, `--lq-color-text-muted`, `--lq-color-panel`, `--lq-color-border`, `--lq-color-border-subtle`, `--lq-color-accent` (vignette courante), `--lq-color-focus-ring`, `--lq-shadow-modal`, `--lq-label-tracking`.",
        ].join("\n"),
      },
    },
  },
  args: {
    images: GALLERY_IMAGES_PLAIN.slice(0, 12),
    index: 0,
    open: true,
    onIndexChange: fn(),
    onClose: fn(),
    thumbnails: true,
    loop: true,
    showCounter: true,
    surface: "dark",
    closeOnBackdrop: true,
  },
  argTypes: {
    images: { control: false },
    index: { control: { type: "number", min: 0, max: 11 } },
    open: { control: false },
    onIndexChange: { control: false },
    onClose: { control: false },
    thumbnails: { control: "boolean" },
    loop: { control: "boolean" },
    showCounter: { control: "boolean" },
    surface: { control: "inline-radio", options: ["dark", "inherit"] },
    closeOnBackdrop: { control: "boolean" },
    labels: { control: "object" },
  },
  render: function Render(args: LightboxProps) {
    const [open, setOpen] = useState(true);
    const [index, setIndex] = useState(args.index ?? 0);
    return (
      <div style={{ padding: 16 }}>
        <Button onClick={() => setOpen(true)}>Ouvrir la visionneuse</Button>
        <Lightbox
          {...args}
          open={open}
          index={index}
          onIndexChange={(i) => {
            setIndex(i);
            args.onIndexChange(i);
          }}
          onClose={() => {
            setOpen(false);
            args.onClose();
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof Lightbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  args: { index: 2 },
  parameters: { docs: { description: { story: "Ouverte sur la troisième image, sur la surface sombre, avec la bande de vignettes. ← → pour naviguer, Échap pour fermer." } } },
};

export const WithoutThumbnails: Story = {
  name: "Sans vignettes",
  args: { thumbnails: false },
  parameters: { docs: { description: { story: "`thumbnails={false}` : l'image prend la hauteur libérée. Le compteur dit où l'on en est." } } },
};

export const NoLoop: Story = {
  name: "Sans boucle",
  args: { loop: false, images: GALLERY_IMAGES_PLAIN.slice(0, 4) },
  parameters: { docs: { description: { story: "`loop={false}` : « précédente » est éteint sur la première image, « suivante » sur la dernière — pour une suite qui a un début et une fin (les pages d'un document)." } } },
};

export const InheritSurface: Story = {
  name: "Surface de l'application",
  args: { surface: "inherit", index: 5 },
  parameters: { docs: { description: { story: "`surface=\"inherit\"` : la visionneuse garde la surface claire (ou sombre) de l'application au lieu de s'éteindre." } } },
};

export const SingleImage: Story = {
  name: "Une seule image",
  args: { images: GALLERY_IMAGES_PLAIN.slice(4, 5) },
  parameters: { docs: { description: { story: "Une image seule : ni flèches, ni compteur, ni vignettes — la croix, la légende, et Échap." } } },
};
