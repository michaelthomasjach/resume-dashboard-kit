import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Badge, Gallery, type GalleryImage } from "@michaelthomasjach/liseuse-dashboard-kit";
import { GALLERY_IMAGES, GALLERY_IMAGES_PLAIN } from "../_data/gallery";

/**
 * Une galerie d'images : grille ou maçonnerie, filtre par catégorie, titre au survol, visionneuse
 * plein écran au clic. Seize illustrations SVG générées en code, tous formats.
 */
const meta = {
  title: "Widgets/Gallery",
  component: Gallery,
  parameters: {
    docs: {
      description: {
        component: [
          "Une **galerie d'images** : un portfolio, une photothèque, les visuels d'un catalogue. Un clic ouvre la `Lightbox` plein écran, qui parcourt les images affichées.",
          "",
          "**Quand l'utiliser** — pour une collection qu'on parcourt du regard avant d'en ouvrir une. Pour une seule image qui change toute seule, `LiveTile` ou `Carousel` ; pour une liste de fichiers avec leurs détails, un tableau.",
          "",
          "**Mises en page** — `layout=\"grid\"` (défaut) : des cases de même proportion (`aspectRatio`, `\"4 / 3\"` par défaut), l'image recadrée pour la remplir. Une image peut y prendre plus de place avec `span` : `wide` (deux colonnes), `tall` (deux rangées), `large` (les deux) — la grille remonte les petites dans les trous laissés (`grid-auto-flow: dense`). `layout=\"masonry\"` : chaque image garde sa proportion (lue dans `width` / `height`), empilée en colonnes CSS ; l'ordre de lecture descend alors chaque colonne avant de passer à la suivante.",
          "",
          "**Colonnes** — `columns` fixe leur nombre ; `\"auto\"` (défaut) en met autant que la largeur **du composant** en permet, à `minColumnWidth` (220 px) au moins chacune. En grille, la hauteur des rangées se calcule sur la largeur mesurée (un `ResizeObserver`) : c'est ce qui fait tomber les cases `span` pile sur les autres. `gap` règle l'écart en pixels.",
          "",
          "**Titres** — `title`, `subtitle` et `meta` (une donnée courte à droite du titre : un prix, une date) s'affichent sur le bas de l'image. `overlay=\"hover\"` (défaut) : au survol et à la prise de focus au clavier — mais **toujours** sur un écran tactile, qui ne survole pas. `\"always\"` les laisse en place, `\"none\"` les retire.",
          "",
          "**Filtre** — dès que deux catégories au moins existent (`category` de chaque image), une rangée de puces (`ChipGroup`, avec le nombre d'images) ou, avec `filterStyle=\"segmented\"`, un `SegmentedControl`. `categories` fixe leur ordre, `allLabel` nomme « Tout ». Libre (`defaultCategory`) ou contrôlé (`category` + `onCategoryChange`). `filterable={false}` le masque.",
          "",
          "**Clic** — `lightbox` (défaut `true`) ouvre la visionneuse ; `onImageClick(image, index)` est appelé dans tous les cas. Sans l'un ni l'autre, les images ne sont pas cliquables. `lightboxThumbnails` et `lightboxLabels` passent à la visionneuse.",
          "",
          "**Clavier et accessibilité** — chaque image cliquable est un bouton (`aria-haspopup=\"dialog\"`) dont le nom vient de son `alt` et de son titre : Tab les parcourt, Entrée ouvre. La visionneuse piège le focus et le rend, à la fermeture, à l'image qui l'a ouverte. La liste porte `ariaLabel` (« Galerie »).",
          "",
          "**Thème** — `--lq-gallery-gap` (écart, repli `--lq-space-3`), `--lq-gallery-radius` (repli `--lq-radius-md`), `--lq-gallery-scrim` (le bas du dégradé, repli : le panneau à 88 %), `--lq-gallery-caption-color` (repli `--lq-color-text`), `--lq-gallery-caption-padding`, `--lq-gallery-title-size`, `--lq-gallery-title-weight`, `--lq-gallery-meta-font`, `--lq-gallery-meta-size`, toutes optionnelles ; puis `--lq-color-fill-track` (fond d'une case avant chargement), `--lq-color-focus-ring`, `--lq-transition-base`, et celles de `ChipGroup` et `SegmentedControl`. Ce thème met des cases à angle droit, 10 px d'écart, un dégradé à l'encre du CV (`rgba(27, 29, 58, 0.85)`) sous un titre blanc en gras et un prix en League Spartan de 18 px.",
        ].join("\n"),
      },
    },
  },
  args: {
    images: GALLERY_IMAGES_PLAIN,
    layout: "grid",
    columns: "auto",
    minColumnWidth: 220,
    aspectRatio: "4 / 3",
    overlay: "hover",
    filterStyle: "chips",
    lightbox: true,
    lightboxThumbnails: true,
    allLabel: "Tout",
    emptyText: "Aucune image dans cette catégorie.",
    ariaLabel: "Galerie",
    onImageClick: fn(),
    onCategoryChange: fn(),
  },
  argTypes: {
    images: { control: false },
    layout: { control: "inline-radio", options: ["grid", "masonry"] },
    columns: { control: "select", options: ["auto", 1, 2, 3, 4, 5, 6] },
    minColumnWidth: { control: { type: "range", min: 120, max: 400, step: 10 } },
    gap: { control: { type: "range", min: 0, max: 32, step: 1 } },
    aspectRatio: { control: "inline-radio", options: ["4 / 3", "1", "3 / 4", "16 / 9"] },
    overlay: { control: "inline-radio", options: ["hover", "always", "none"] },
    filterable: { control: "boolean" },
    filterStyle: { control: "inline-radio", options: ["chips", "segmented"] },
    categories: { control: "object" },
    category: { control: false },
    defaultCategory: { control: "select", options: [null, "Paysages", "Vagues", "Formes", "Dégradés"] },
    lightbox: { control: "boolean" },
    lightboxThumbnails: { control: "boolean" },
    lightboxLabels: { control: "object" },
    allLabel: { control: "text" },
    emptyText: { control: "text" },
    ariaLabel: { control: "text" },
    className: { control: false },
  },
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Grid: Story = {
  name: "Grille",
  parameters: { docs: { description: { story: "La grille par défaut : autant de colonnes que la largeur en permet, cases en 4/3, titre au survol, filtre en puces. Cliquez une image : ← → pour passer à la suivante, Échap pour fermer." } } },
};

export const Featured: Story = {
  name: "Mise en avant",
  args: { images: GALLERY_IMAGES, overlay: "always", minColumnWidth: 200, gap: 10 },
  parameters: { docs: { description: { story: "La galerie de démonstration : trois images portent un `span` — « Bauhaus » en `large` (2 × 2), « La vallée verte » en `wide`, « Constellation » en `tall` —, les autres comblent les trous. Titres toujours visibles, écart de 10 px." } } },
};

export const Masonry: Story = {
  name: "Maçonnerie",
  args: { layout: "masonry" },
  parameters: { docs: { description: { story: "Chaque image garde sa proportion — portraits, carrés, panoramas — empilée en colonnes. Les `span` n'ont pas de sens ici et sont ignorés." } } },
};

export const FixedColumns: Story = {
  name: "Colonnes fixes",
  args: { columns: 3, aspectRatio: "1", images: GALLERY_IMAGES_PLAIN.slice(0, 9), filterable: false },
  parameters: { docs: { description: { story: "Trois colonnes quelle que soit la largeur, en cases carrées (`aspectRatio=\"1\"`), sans filtre." } } },
};

export const SegmentedFilter: Story = {
  name: "Filtre segmenté",
  args: { filterStyle: "segmented", defaultCategory: "Vagues" },
  parameters: { docs: { description: { story: "Le filtre en `SegmentedControl`, plus compact que les puces quand les catégories sont trois ou quatre. Ouvert ici sur « Vagues » (`defaultCategory`) ; la visionneuse ne parcourt que les images filtrées." } } },
};

export const AlwaysCaptions: Story = {
  name: "Titres toujours visibles",
  args: { overlay: "always", columns: 4 },
  parameters: { docs: { description: { story: "`overlay=\"always\"` : le titre, le sous-titre et le prix restent sur l'image — pour un catalogue qu'on lit autant qu'on le regarde." } } },
};

export const CustomClick: Story = {
  name: "Clic personnalisé",
  render: function Render() {
    const [picked, setPicked] = useState<GalleryImage | null>(null);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <Badge tone={picked ? "info" : undefined}>{picked ? `Choisie : ${picked.title}` : "Cliquez une image"}</Badge>
        </div>
        <Gallery images={GALLERY_IMAGES_PLAIN.slice(0, 8)} lightbox={false} onImageClick={setPicked} overlay="always" filterable={false} />
      </div>
    );
  },
  parameters: { docs: { description: { story: "`lightbox={false}` et `onImageClick` : le clic remonte à l'application — pour choisir une image dans un formulaire, ou ouvrir sa fiche ailleurs." } } },
};

export const ControlledFilter: Story = {
  name: "Filtre contrôlé",
  render: function Render() {
    const [category, setCategory] = useState<string | null>("Paysages");
    const n = GALLERY_IMAGES_PLAIN.filter((i) => !category || i.category === category).length;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <Badge>
            {category ?? "Toutes"} · {n} image{n > 1 ? "s" : ""}
          </Badge>
        </div>
        <Gallery images={GALLERY_IMAGES_PLAIN} category={category} onCategoryChange={setCategory} layout="masonry" />
      </div>
    );
  },
  parameters: { docs: { description: { story: "L'application tient la catégorie (`category` + `onCategoryChange`) — pour la garder dans l'URL, ou la synchroniser avec un autre filtre. Ici, un compteur lu à côté." } } },
};
