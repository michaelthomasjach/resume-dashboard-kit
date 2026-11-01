import type { Preview } from "@storybook/react-vite";
import * as Kit from "@michaelthomasjach/liseuse-dashboard-kit";
import { ResumeTheme } from "../src/theme";
import docgen from "../src/stories/docgen.json";

/**
 * Rattache à chaque composant exporté par le kit la documentation extraite de ses types (voir
 * scripts/docgen.mjs) : c'est ce que lit l'onglet Docs pour la description et la table des props.
 * Elle remplace celle que react-docgen tire du source du kit ; les composants que le kit n'exporte
 * pas (pages du kit incluses telles quelles, voir main.ts) gardent cette dernière.
 */
for (const [name, info] of Object.entries(docgen.components)) {
  const component = (Kit as Record<string, unknown>)[name];
  if (component && (typeof component === "function" || typeof component === "object")) {
    (component as { __docgenInfo?: unknown }).__docgenInfo = { displayName: name, ...info };
  }
}

const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    surface: {
      description: "Surface du thème",
      toolbar: {
        title: "Surface",
        icon: "mirror",
        items: [
          { value: "light", title: "Claire", icon: "sun" },
          { value: "dark", title: "Sombre", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { surface: "light" },
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true, sort: "requiredFirst" },
    docs: { source: { type: "dynamic", language: "tsx" }, toc: true },
    options: {
      // Le même ordre que le Storybook du kit (../Dashboard liseuse/.storybook/preview.tsx) : la
      // page d'accueil, puis des plus petites briques aux plus grands assemblages. Ce qui n'est pas
      // listé garde sa place alphabétique après.
      storySort: {
        // L'ordre exact du menu du kit e-ink, groupe par groupe : sans les sous-listes, Storybook
        // rangerait chaque groupe dans l'ordre de découverte des fichiers, qui n'est pas le même ici
        // (fichiers de la couche mêlés à ceux empruntés au kit). À régénérer depuis l'index.json du kit.
        order: [
          "Accueil",
          "Foundations",
          ["Variables du thème", "Animated Icons", "Icons", "Typography", "LqThemeProvider"],
          "Primitives",
          ["Avatar", "Badge", "Button", "Card", "Carousel", "CodeBlock", "ColorSwatchButton", "ContextMenu", "DropdownPanel", "ExpandableCard", "FieldGroup", "Heading", "Highlight", "IconButton", "Jumbotron", "LegendRow", "LevelGauge", "Modal", "Panel", "PanelCollapse", "PanelRow", "PeriodTable", "QuoteMark", "SearchOverlay", "SegmentedControl", "TabbedCard", "Tabs", "Testimonial", "Text", "Toggle", "Tooltip", "TreeView", "ButtonGroup", "Toolbar", "FloatingActionButton"],
          "Forms",
          ["Checkbox", "CheckboxButton", "Chip", "ChipGroup", "Input", ["CreditCardInput", "Input", "InputDropdown", "InputNumber", "InputPassword", "MaskedInput", "Masked inputs", "PhoneInput", "Select", "TagInput", "Textarea"], "DateInput", "DatePicker", "DateRangePicker", "DateTimePicker", "Dropzone", "Popover", "RangeSlider", "Tag", "WysiwygEditor", "Slider", "RadioGroup"],
          "Feedback",
          ["AlertList", "GuidedTour", "Loaders", "ProgressBar", "Skeleton", "Spinner", "Stepper", "Notification", "NotificationMenu", "NotificationProvider", "ProgressCircle"],
          "Charts",
          ["AlertsPanel", "BarChart", "CandlestickChart", ["État du marché", "Captures de diagrammes", "Captures de props"], "ChartAxis", "ChartEventTooltip", "ChartTooltip", "ChartWorkspace", "DeltaChart", "DonutChart", "EarningsDotChart", "GaugeChart", "Heatmap", "LineAreaChart", "MatrixChart", "SankeyChart", "SeasonalityView", "Sparkline", "Courtier", "Scripting (dev)", ["EngineDebugHarness", "ScriptingStateDebugHarness"], "Stratégie", ["Graphiques"], "Vertical Distribution"],
          "Map",
          ["World Exposure Map", "Interactive Globe", "Dot Map", "Tile Map"],
          "Finance",
          ["ComparisonCard", "DataTable", "GaugeCard", "HighlightStatCard", "HoldingCard", "PriceChangeTag", "StatCard"],
          "Finance Widgets",
          ["MarketMoversWidget", "PortfolioSummaryWidget", "WatchlistWidget"],
          "Widgets",
          ["AlertMarker", "AlertMarkerStack", "AllocationSlider", "AnalogClock", "ClockWidget", "DashboardGrid", "DashboardGridItem", "DayTimelineWidget", "DemandMeters", "EnergyWidget", "FpsMeter", "IconDock", "KanbanBoard", "KnowledgeBase", "LightDetailModal", "LightsWidget", "LiveTile", "MetricListWidget", "MusicPlayerWidget", "ObjectiveTracker", "ShuttersWidget", "SkillTree", "WeatherWidget", "Timeline", "Gallery", "Lightbox", "ChatPanel", "NotesPanel", "Quickview", "MailPanel", "ActivityFeed"],
          "Dashboard",
          ["Maison — tableau de bord"],
          "Layouts",
          ["Breadcrumbs", "UserMenu", "HeaderLayout", "SidebarLayout", "BottomNav"],
          "Pages",
          ["LoginPage", "NotFoundPage", "SignUpPage", "ProfilePage", "InvoicePage", "LockScreenPage", "ServerErrorPage"],
          "Audio",
          ["Balance, Niveaux, Égaliseur", "BalanceControl", "Equalizer", "LevelMeter"],
          "Scheduler",
          ["Planning de ressources", "SchedulerTaskModal", "MonthCalendar"],
        ],
      },
    },
  },
  decorators: [
    // Le fond du thème couvre toute la zone d'affichage (sinon il s'arrête au contenu et laisse du
    // blanc dessous, criant en surface sombre). Les composants pleine page — mises en page, pages,
    // notifications fixes — déclarent `rdkPadding: 0` pour ne pas recevoir la marge de 30 px.
    (Story, context) => (
      <ResumeTheme surface={context.globals.surface === "dark" ? "dark" : "light"}>
        <div
          style={{
            padding: context.parameters.rdkPadding ?? (context.viewMode === "story" ? 30 : 20),
            minHeight: context.viewMode === "story" ? "100vh" : undefined,
            boxSizing: "border-box",
            background: "var(--lq-color-bg)",
          }}
        >
          <Story />
        </div>
      </ResumeTheme>
    ),
  ],
};

export default preview;
