import { useState, type ComponentType } from "react";
import { SegmentedControl, Toggle, Text, type AnimatedIconProps, type IconMotion } from "@michaelthomasjach/liseuse-dashboard-kit";
import {
  // Météo, énergie, maison
  SunIcon, MoonIcon, CloudIcon, PartlyCloudyIcon, CloudRainIcon, WindIcon, SnowflakeIcon, SunriseIcon, SunsetIcon,
  HomeIcon, HouseRoofIcon, BedIcon, TreeIcon, SolarPanelIcon, BatteryIcon, GridPlugIcon, PlugIcon, BoltIcon,
  // Navigation et interface
  ChevronRightIcon, ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ArrowUpIcon, ArrowDownIcon, ArrowRightIcon,
  ArrowPathIcon, MenuIcon, CloseIcon, CheckIcon, PlusIcon, MoreHorizontalIcon, SearchIcon, EyeIcon, EyeOffIcon,
  UserIcon, LockIcon, UnlockIcon, LogoutIcon, SettingsIcon, LinkIcon, UnlinkIcon, GridIcon, GripIcon, LayersIcon,
  OverlayBadgeIcon, PaneBadgeIcon, MaximizeIcon, MinimizeIcon, DetachWindowIcon, CopyIcon, RefreshIcon, StarIcon,
  PinIcon, CalendarIcon, SquareDashedIcon,
  // États et alertes
  AlertTriangleIcon, ErrorIcon, InfoIcon, HelpIcon, BellIcon, AlarmClockIcon, ClockOffIcon, BanIcon, ActivityIcon,
  GaugeIcon, SparkleIcon, RobotIcon,
  // Médias
  PlayIcon, PauseIcon, PrevTrackIcon, NextTrackIcon, SpeakerIcon,
  // Fichiers, données, commerce
  FileIcon, FolderIcon, SaveIcon, TrashIcon, UploadCloudIcon, TableIcon, PieChartIcon, BarChartIcon, WatchlistIcon,
  ClipboardListIcon, BookOpenIcon, CodeIcon, CreditCardIcon, CartIcon, PhoneIcon, BriefcaseIcon, SkillTreeIcon,
  // Édition de texte
  BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon, BulletListIcon, OrderedListIcon, AlignLeftIcon,
  AlignCenterIcon, AlignRightIcon, AlignJustifyIcon, UndoIcon, RedoIcon, ClearFormatIcon, PencilIcon, TextIcon,
  CommentIcon, NoteIcon,
  // Graphiques : modes d'affichage et outils de tracé
  BarModeIcon, CandleModeIcon, LineCloseModeIcon, HeikinAshiModeIcon, RenkoModeIcon, LineBreakModeIcon, TpoModeIcon,
  CursorArrowIcon, TrendLineIcon, HorizontalLineIcon, VerticalLineIcon, HorizontalRayIcon, ExtendedLineIcon,
  ArrowLineIcon, ElbowArrowIcon, ChannelIcon, DisjointChannelIcon, FibonacciIcon, FibonacciExtensionIcon,
  ElliottWaveIcon, ElliottImpulseIcon, ElliottCorrectionIcon, PitchforkIcon, SchiffPitchforkIcon,
  ModifiedSchiffPitchforkIcon, InsidePitchforkIcon, HeadShouldersIcon, CupHandleIcon, ForecastIcon,
  RangeForecastIcon, LongPositionIcon, ShortPositionIcon, RectangleShapeIcon, BrushIcon, ZonesIcon, MeasureIcon,
  ZoomInIcon, ZoomOutIcon, AverageLineIcon, MagnetIcon, PriceNoteIcon, PriceLabelIcon, FlagMarkIcon, SignpostIcon,
  CrossingIcon, GreaterThanIcon, LessThanIcon,
  // Logistique
  BuildingWarehouseIcon, PackageIcon, BoxesIcon, TruckIcon, RoadIcon, ParkingIcon, ConveyorIcon, ForkliftIcon,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { SpecimenScreen, SpecimenGrid, Specimen } from "../../Specimen";

type AnyIcon = ComponentType<AnimatedIconProps>;

/** Les 161 icônes du kit, rangées par usage plutôt que par ordre alphabétique : on cherche une
 *  icône pour ce qu'elle doit dire. Chaque objet est écrit en raccourci (`{ SunIcon, … }`) pour que
 *  le nom affiché sous l'icône soit, mécaniquement, le nom exact de l'export. */
const GROUPS: { title: string; description: string; icons: Record<string, AnyIcon> }[] = [
  {
    title: "Interface et navigation",
    description: "Chevrons, flèches, fermeture, recherche, compte, fenêtres — le vocabulaire de toute barre d'outils.",
    icons: {
      ChevronRightIcon, ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ArrowUpIcon, ArrowDownIcon, ArrowRightIcon,
      ArrowPathIcon, MenuIcon, CloseIcon, CheckIcon, PlusIcon, MoreHorizontalIcon, SearchIcon, EyeIcon, EyeOffIcon,
      UserIcon, LockIcon, UnlockIcon, LogoutIcon, SettingsIcon, LinkIcon, UnlinkIcon, GridIcon, GripIcon, LayersIcon,
      OverlayBadgeIcon, PaneBadgeIcon, MaximizeIcon, MinimizeIcon, DetachWindowIcon, CopyIcon, RefreshIcon, StarIcon,
      PinIcon, CalendarIcon, SquareDashedIcon,
    },
  },
  {
    title: "États et alertes",
    description: "Avertissement, erreur, information, notification, activité.",
    icons: {
      AlertTriangleIcon, ErrorIcon, InfoIcon, HelpIcon, BellIcon, AlarmClockIcon, ClockOffIcon, BanIcon, ActivityIcon,
      GaugeIcon, SparkleIcon, RobotIcon,
    },
  },
  {
    title: "Fichiers, données et commerce",
    description: "Documents, tableaux, graphiques, paiement.",
    icons: {
      FileIcon, FolderIcon, SaveIcon, TrashIcon, UploadCloudIcon, TableIcon, PieChartIcon, BarChartIcon, WatchlistIcon,
      ClipboardListIcon, BookOpenIcon, CodeIcon, CreditCardIcon, CartIcon, PhoneIcon, BriefcaseIcon, SkillTreeIcon,
    },
  },
  {
    title: "Édition de texte",
    description: "La barre d'outils d'un éditeur riche.",
    icons: {
      BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon, BulletListIcon, OrderedListIcon, AlignLeftIcon,
      AlignCenterIcon, AlignRightIcon, AlignJustifyIcon, UndoIcon, RedoIcon, ClearFormatIcon, PencilIcon, TextIcon,
      CommentIcon, NoteIcon,
    },
  },
  {
    title: "Météo, énergie et maison",
    description: "Le jeu d'origine du kit, né d'un tableau de bord domestique.",
    icons: {
      SunIcon, MoonIcon, CloudIcon, PartlyCloudyIcon, CloudRainIcon, WindIcon, SnowflakeIcon, SunriseIcon, SunsetIcon,
      HomeIcon, HouseRoofIcon, BedIcon, TreeIcon, SolarPanelIcon, BatteryIcon, GridPlugIcon, PlugIcon, BoltIcon,
    },
  },
  {
    title: "Médias",
    description: "Commandes de lecture.",
    icons: { PlayIcon, PauseIcon, PrevTrackIcon, NextTrackIcon, SpeakerIcon },
  },
  {
    title: "Logistique",
    description: "Entrepôt, colis, transport, manutention.",
    icons: { BuildingWarehouseIcon, PackageIcon, BoxesIcon, TruckIcon, RoadIcon, ParkingIcon, ConveyorIcon, ForkliftIcon },
  },
  {
    title: "Graphiques financiers",
    description: "Modes d'affichage d'un graphique de cours et outils de tracé du rail de dessin.",
    icons: {
      BarModeIcon, CandleModeIcon, LineCloseModeIcon, HeikinAshiModeIcon, RenkoModeIcon, LineBreakModeIcon, TpoModeIcon,
      CursorArrowIcon, TrendLineIcon, HorizontalLineIcon, VerticalLineIcon, HorizontalRayIcon, ExtendedLineIcon,
      ArrowLineIcon, ElbowArrowIcon, ChannelIcon, DisjointChannelIcon, FibonacciIcon, FibonacciExtensionIcon,
      ElliottWaveIcon, ElliottImpulseIcon, ElliottCorrectionIcon, PitchforkIcon, SchiffPitchforkIcon,
      ModifiedSchiffPitchforkIcon, InsidePitchforkIcon, HeadShouldersIcon, CupHandleIcon, ForecastIcon,
      RangeForecastIcon, LongPositionIcon, ShortPositionIcon, RectangleShapeIcon, BrushIcon, ZonesIcon, MeasureIcon,
      ZoomInIcon, ZoomOutIcon, AverageLineIcon, MagnetIcon, PriceNoteIcon, PriceLabelIcon, FlagMarkIcon, SignpostIcon,
      CrossingIcon, GreaterThanIcon, LessThanIcon,
    },
  },
];

const TOTAL = GROUPS.reduce((n, g) => n + Object.keys(g.icons).length, 0);

const SIZES = [
  { value: "16", label: "16" },
  { value: "20", label: "20" },
  { value: "24", label: "24" },
  { value: "32", label: "32" },
] as const;
type Size = (typeof SIZES)[number]["value"];

/** Une icône par mouvement, celle dont c'est le mouvement propre — le kit choisit l'animation
 *  d'après ce que l'icône veut dire, la vitrine ne fait que la nommer. */
const MOTIONS: { motion: IconMotion; Icon: AnyIcon; name: string }[] = [
  { motion: "spin", Icon: RefreshIcon, name: "RefreshIcon" },
  { motion: "pulse", Icon: InfoIcon, name: "InfoIcon" },
  { motion: "sway", Icon: WindIcon, name: "WindIcon" },
  { motion: "bob", Icon: ArrowUpIcon, name: "ArrowUpIcon" },
  { motion: "slide", Icon: PlayIcon, name: "PlayIcon" },
  { motion: "ring", Icon: BellIcon, name: "BellIcon" },
  { motion: "blink", Icon: EyeIcon, name: "EyeIcon" },
  { motion: "shake", Icon: ErrorIcon, name: "ErrorIcon" },
  { motion: "grow", Icon: PlusIcon, name: "PlusIcon" },
  { motion: "float", Icon: CloudIcon, name: "CloudIcon" },
  { motion: "beat", Icon: StarIcon, name: "StarIcon" },
  { motion: "flip", Icon: CopyIcon, name: "CopyIcon" },
];

/**
 * La planche des icônes : les 161 du kit, par usage, chacune sous son nom d'export.
 *
 * Les icônes sont tracées en `currentColor` : elles n'ont aucune couleur à elles et prennent celle
 * du texte qui les entoure — c'est pourquoi le thème n'a rien à leur dire et pourquoi elles suivent
 * la surface sombre sans effort. Les deux réglages en tête de page agissent sur toute la grille : la
 * taille (`size`, en pixels) et l'animation de repos (`animated`), éteinte par défaut dans le kit.
 */
export function Icons() {
  const [size, setSize] = useState<Size>("24");
  const [animated, setAnimated] = useState(false);
  const px = Number(size);

  return (
    <SpecimenScreen title="Icônes" intro={`Les ${TOTAL} icônes du kit, en currentColor, rangées par usage.`}>
      <SpecimenGrid>
        <Specimen name="IconProps · size" description="Taille en pixels, 24 par défaut. Le trait reste à 1,75 sur la grille de 24.">
          <div className="rdk-wrap rdk-wrap--baseline">
            {[16, 20, 24, 32, 40].map((s) => (
              <div key={s} className="rdk-icon-cell">
                <SettingsIcon size={s} />
                <code className="rdk-icon-cell__name">{s}px</code>
              </div>
            ))}
          </div>
          <div className="rdk-row">
            <Text size="sm">Hérite de la couleur du texte :</Text>
            <span className="rdk-tone rdk-tone--accent">
              <CheckIcon size={20} />
            </span>
            <span className="rdk-tone rdk-tone--up">
              <ArrowUpIcon size={20} />
            </span>
            <span className="rdk-tone rdk-tone--down">
              <ArrowDownIcon size={20} />
            </span>
            <span className="rdk-tone rdk-tone--muted">
              <ClockOffIcon size={20} />
            </span>
          </div>
        </Specimen>

        <Specimen name="AnimatedIconProps · animated · motion" description="L'animation de repos de chaque icône, nommée par son mouvement. Suspendue si le système demande moins d'animations.">
          <div className="rdk-icon-grid rdk-icon-grid--compact">
            {MOTIONS.map(({ motion, Icon, name }) => (
              <div key={motion} className="rdk-icon-cell">
                <Icon size={24} animated />
                <code className="rdk-icon-cell__name">{motion}</code>
                <Text size="xs" muted as="span">
                  {name}
                </Text>
              </div>
            ))}
          </div>
        </Specimen>

        <Specimen name="Réglages de la grille" description="Appliqués à toutes les icônes ci-dessous." wide>
          <div className="rdk-wrap">
            <SegmentedControl label="Taille" options={[...SIZES]} value={size} onChange={setSize} />
            <div className="rdk-row">
              <Toggle checked={animated} onChange={setAnimated} ariaLabel="Animer toutes les icônes" />
              <Text size="sm">Animer toutes les icônes</Text>
            </div>
          </div>
        </Specimen>

        {GROUPS.map((group) => (
          <Specimen key={group.title} name={`${group.title} · ${Object.keys(group.icons).length}`} description={group.description} wide>
            <div className="rdk-icon-grid">
              {Object.entries(group.icons).map(([name, Icon]) => (
                <div key={name} className="rdk-icon-cell" title={name}>
                  <Icon size={px} animated={animated} />
                  <code className="rdk-icon-cell__name">{name}</code>
                </div>
              ))}
            </div>
          </Specimen>
        ))}
      </SpecimenGrid>
    </SpecimenScreen>
  );
}
