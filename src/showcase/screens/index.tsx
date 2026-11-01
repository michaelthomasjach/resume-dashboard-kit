import type { ReactElement } from "react";
import { BarChartIcon, BriefcaseIcon, FileIcon, GridIcon, HomeIcon, LayersIcon, PencilIcon, TableIcon } from "@michaelthomasjach/liseuse-dashboard-kit";
import { Overview } from "./Overview";
import { Tables } from "./Tables";
import { Forms } from "./Forms";
import { Messages } from "./Messages";
import { Mail } from "./Mail";
import { Calendar } from "./Calendar";
import { GalleryScreen } from "./GalleryScreen";
import { Feed } from "./Feed";
import { Profile } from "./Profile";
import { Invoice } from "./Invoice";
import { Primitives } from "./components/Primitives";
import { Containers } from "./components/Containers";
import { Icons } from "./components/Icons";
import { Feedback } from "./components/Feedback";
import { Fields } from "./components/Fields";
import { DatesSliders } from "./components/DatesSliders";
import { Finance } from "./components/Finance";
import { Charts } from "./components/Charts";
import { MarketCharts } from "./components/MarketCharts";
import { HomeWidgets } from "./components/HomeWidgets";
import { ToolWidgets } from "./components/ToolWidgets";
import { MapsAudio } from "./components/MapsAudio";
import { Pages } from "./components/Pages";

/**
 * Le registre des écrans — **la convention centrale de ce dépôt**.
 *
 * Une entrée ici produit à la fois l'élément de navigation et la route. Les deux ne peuvent donc
 * pas diverger, et ajouter un écran est un seul geste : écrire le composant, l'inscrire ici. Un
 * tableau de bord de démonstration finit toujours par compter quarante écrans, et c'est exactement
 * à cette taille qu'une liste de `<Route>` d'un côté et un tableau de liens de l'autre commencent à
 * se contredire — un écran accessible qui n'est plus dans le menu, un lien de menu vers une route
 * supprimée.
 *
 * `group` est le seul regroupement : la barre latérale replie les écrans par groupe, dans l'ordre
 * où les groupes apparaissent ici.
 */
export interface Screen {
  id: string;
  label: string;
  /** Sans barre oblique de tête : elle est ajoutée par le routeur. */
  path: string;
  group: string;
  /** La seconde ligne, plus pâle, sous le libellé dans la barre latérale. */
  details?: string;
  /** Le nom du fichier de l'écran (et de son composant) : la recherche y lit les spécimens qu'il
   *  montre, pour qu'un nom de composant mène à son écran. */
  source: string;
  render: () => ReactElement;
}

/**
 * L'icône de chaque groupe : c'est elle qui reste visible dans le rail quand la barre latérale est
 * réduite. Les écrans d'un groupe, eux, s'y affichent par leur initiale. Un groupe sans icône ici
 * prendrait l'initiale de son nom — lisible, mais seul de son espèce dans la colonne.
 */
export const GROUP_ICONS: Record<string, ReactElement> = {
  "Tableau de bord": <HomeIcon />,
  "Données": <TableIcon />,
  "Applications": <BriefcaseIcon />,
  "Composants · base": <LayersIcon />,
  "Composants · saisie": <PencilIcon />,
  "Composants · données": <BarChartIcon />,
  "Composants · widgets": <GridIcon />,
  "Composants · pages": <FileIcon />,
};

export const SCREENS: Screen[] = [
  { id: "overview", label: "Vue d'ensemble", path: "", group: "Tableau de bord", details: "Douze derniers mois", source: "Overview", render: () => <Overview /> },
  { id: "tables", label: "Tableaux", path: "tableaux", group: "Données", source: "Tables", render: () => <Tables /> },
  { id: "forms", label: "Formulaires", path: "formulaires", group: "Données", source: "Forms", render: () => <Forms /> },

  // Les écrans d'application : chacun pose un composant du kit en situation.
  { id: "app-messages", label: "Messagerie", path: "applications/messagerie", group: "Applications", source: "Messages", render: () => <Messages /> },
  { id: "app-mail", label: "Boîte mail", path: "applications/mail", group: "Applications", source: "Mail", render: () => <Mail /> },
  { id: "app-calendar", label: "Calendrier", path: "applications/calendrier", group: "Applications", source: "Calendar", render: () => <Calendar /> },
  { id: "app-gallery", label: "Galerie", path: "applications/galerie", group: "Applications", source: "GalleryScreen", render: () => <GalleryScreen /> },
  { id: "app-feed", label: "Frise", path: "applications/frise", group: "Applications", source: "Feed", render: () => <Feed /> },
  { id: "app-profile", label: "Profil", path: "applications/profil", group: "Applications", source: "Profile", render: () => <Profile /> },
  { id: "app-invoice", label: "Facture", path: "applications/facture", group: "Applications", source: "Invoice", render: () => <Invoice /> },

  // Les planches : chaque export du kit, famille par famille, dans le thème.
  { id: "c-primitives", label: "Primitives", path: "composants/primitives", group: "Composants · base", source: "Primitives", render: () => <Primitives /> },
  { id: "c-containers", label: "Conteneurs", path: "composants/conteneurs", group: "Composants · base", source: "Containers", render: () => <Containers /> },
  { id: "c-icons", label: "Icônes", path: "composants/icones", group: "Composants · base", source: "Icons", render: () => <Icons /> },
  { id: "c-feedback", label: "Retours", path: "composants/retours", group: "Composants · base", source: "Feedback", render: () => <Feedback /> },
  { id: "c-fields", label: "Champs", path: "composants/champs", group: "Composants · saisie", source: "Fields", render: () => <Fields /> },
  { id: "c-dates", label: "Dates et curseurs", path: "composants/dates", group: "Composants · saisie", source: "DatesSliders", render: () => <DatesSliders /> },
  { id: "c-finance", label: "Finance", path: "composants/finance", group: "Composants · données", source: "Finance", render: () => <Finance /> },
  { id: "c-charts", label: "Graphiques", path: "composants/graphiques", group: "Composants · données", source: "Charts", render: () => <Charts /> },
  { id: "c-market", label: "Graphiques de marché", path: "composants/marche", group: "Composants · données", source: "MarketCharts", render: () => <MarketCharts /> },
  { id: "c-home", label: "Widgets maison", path: "composants/widgets-maison", group: "Composants · widgets", source: "HomeWidgets", render: () => <HomeWidgets /> },
  { id: "c-tools", label: "Widgets outils", path: "composants/widgets-outils", group: "Composants · widgets", source: "ToolWidgets", render: () => <ToolWidgets /> },
  { id: "c-maps", label: "Cartes, audio, planning", path: "composants/cartes-audio", group: "Composants · widgets", source: "MapsAudio", render: () => <MapsAudio /> },
  { id: "c-pages", label: "Pages et mises en page", path: "composants/pages", group: "Composants · pages", source: "Pages", render: () => <Pages /> },
];

/** Les groupes, dans l'ordre de première apparition. */
export function screenGroups(): { group: string; screens: Screen[] }[] {
  const order: string[] = [];
  const byGroup = new Map<string, Screen[]>();
  for (const screen of SCREENS) {
    if (!byGroup.has(screen.group)) {
      byGroup.set(screen.group, []);
      order.push(screen.group);
    }
    byGroup.get(screen.group)!.push(screen);
  }
  return order.map((group) => ({ group, screens: byGroup.get(group)! }));
}
