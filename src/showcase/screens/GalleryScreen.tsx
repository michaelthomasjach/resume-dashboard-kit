import { Gallery } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ScreenHead } from "../Specimen";
import { GALLERY_IMAGES } from "../appData";

/**
 * La galerie de la boutique : filtre par catégorie, grandes vignettes, visionneuse au clic. Le
 * composant s'appelle `GalleryScreen` et non `Gallery` pour ne pas masquer celui du kit.
 */
export function GalleryScreen() {
  return (
    <div className="rdk-screen rdk-screen--full">
      <ScreenHead title="Galerie" intro="Les œuvres de la boutique, par série. Un clic ouvre la visionneuse ; les flèches du clavier y circulent." />
      <Gallery images={GALLERY_IMAGES} filterable lightboxThumbnails columns="auto" minColumnWidth={240} ariaLabel="Œuvres de la boutique" />
    </div>
  );
}
