import { useEffect, useRef, useState } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  BellIcon,
  GridIcon,
  LinkIcon,
  LayersIcon,
  MoonIcon,
  NotificationMenu,
  type NotificationMenuItem,
  ProgressBar,
  SearchIcon,
  SearchOverlay,
  SidebarLayout,
  SunIcon,
  type SidebarNavItem,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { ResumeTheme } from "../theme";
import { GROUP_ICONS, SCREENS, screenGroups, type Screen } from "./screens";
import { searchComponents, searchScreens } from "./searchIndex";
import "./showcase.css";

type Surface = "light" | "dark";

/**
 * La barre de chargement : un trait de 2 px de l'accent, collé au filet inférieur de la barre haute,
 * qui court de gauche à droite à chaque changement d'écran puis s'efface. La vitrine n'attend rien
 * du réseau — la barre dit seulement « l'écran a changé ».
 */
function RouteProgress() {
  const { pathname } = useLocation();
  const [value, setValue] = useState<number | null>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const steps: [number | null, number][] = [[12, 0], [64, 60], [88, 280], [100, 520], [null, 900]];
    const timers = steps.map(([v, delay]) => window.setTimeout(() => setValue(v), delay));
    return () => timers.forEach(window.clearTimeout);
  }, [pathname]);

  if (value === null) return null;
  return (
    <div className="rdk-route-progress" aria-hidden="true">
      <ProgressBar value={value} thickness={2} />
    </div>
  );
}

const NOTIFICATIONS: NotificationMenuItem[] = [
  { id: "n1", title: "Camille Leroy", meta: "a partagé un document", text: "Le rapport trimestriel des ventes est prêt à relire.", time: "il y a 5 min", unread: true },
  { id: "n2", title: "Facturation", meta: "3 factures en retard", text: "Groupe Vallée, Studio Bélier et Cabinet Roux dépassent 30 jours.", time: "il y a 1 h", unread: true, tone: "danger" },
  { id: "n3", title: "Déploiement", meta: "terminé", text: "La version 0.184 est en production.", time: "hier", tone: "success" },
  { id: "n4", title: "Hugo Mercier", meta: "vous a mentionné", text: "« On regarde le tableau de bord ensemble demain ? »", time: "hier" },
];

/** La cloche de la barre haute et sa liste : l'état lu / non lu est tenu ici, comme le veut le kit. */
function Notifications() {
  const [items, setItems] = useState(NOTIFICATIONS);
  return (
    <NotificationMenu
      items={items}
      icon={<BellIcon size={18} />}
      label="Notifications"
      badge="dot"
      onToggleRead={(item) => setItems((all) => all.map((n) => (n.id === item.id ? { ...n, unread: !n.unread } : n)))}
      onMarkAllRead={() => setItems((all) => all.map((n) => ({ ...n, unread: false })))}
    />
  );
}

/**
 * La barre haute, posée sur le papier du CV : la marque, trois icônes d'action (la
 * première avec sa pastille), un séparateur, le champ de recherche réduit à une invite, puis à
 * droite la bascule de surface et l'avatar.
 *
 * La marque n'y paraît que tant que la barre latérale est réduite : épinglée, c'est la barre
 * latérale qui la porte, et la montrer deux fois côte à côte se lirait comme une erreur.
 */
function TopBar({
  showBrand,
  surface,
  onSurface,
  onSearch,
}: {
  showBrand: boolean;
  surface: Surface;
  onSurface: (next: Surface) => void;
  onSearch: () => void;
}) {
  return (
    <div className="rdk-topbar">
      <RouteProgress />
      {showBrand && <span className="rdk-logo rdk-topbar__brand">resume</span>}
      <div className="rdk-topbar__icons">
        <Notifications />
        <button type="button" className="rdk-topbar__icon" aria-label="Liens">
          <LinkIcon size={18} />
        </button>
        <button type="button" className="rdk-topbar__icon" aria-label="Applications">
          <GridIcon size={18} />
        </button>
      </div>
      <button type="button" className="rdk-topbar__search" onClick={onSearch}>
        <SearchIcon size={16} />
        Tapez n'importe où pour chercher
      </button>
      <div className="rdk-topbar__end">
        <button
          type="button"
          className="rdk-topbar__icon"
          onClick={() => onSurface(surface === "dark" ? "light" : "dark")}
          aria-label="Basculer la surface sombre"
          aria-pressed={surface === "dark"}
        >
          {surface === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>
        <span className="rdk-topbar__avatar">
          <Avatar name="Camille Leroy" size={32} />
          <span className="rdk-topbar__status" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

/**
 * La recherche de la barre haute : les écrans par leur nom ou leur groupe, et les composants par
 * leur nom d'export — un composant mène à l'écran qui le montre. Entrée ouvre le premier résultat.
 * Elle s'ouvre au clic sur l'invite, ou en tapant une lettre n'importe où dans la page.
 */
function Search({ open, onOpen, onClose }: { open: boolean; onOpen: () => void; onClose: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const screens = searchScreens(query);
  const components = searchComponents(query);

  const close = () => {
    onClose();
    setQuery("");
  };
  const go = (screen: Screen) => {
    navigate(`/${screen.path}`);
    close();
  };

  return (
    <SearchOverlay
      open={open}
      onClose={close}
      query={query}
      onQueryChange={setQuery}
      onTypeToOpen={(first) => {
        setQuery(first);
        onOpen();
      }}
      onSubmit={() => {
        const first = screens[0] ?? components[0]?.screen;
        if (first) go(first);
      }}
      brand={<span className="rdk-logo">resume</span>}
      placeholder="Rechercher…"
      hint="Entrée ouvre le premier résultat · Échap ferme"
      emptyText="Aucun écran ni composant ne porte ce nom."
      sections={[
        {
          id: "screens",
          title: `Écrans : ${query}`,
          results: screens.map((screen) => ({
            id: screen.id,
            label: screen.label,
            details: screen.group,
            avatar: GROUP_ICONS[screen.group],
            onSelect: () => go(screen),
          })),
        },
        {
          id: "components",
          title: `Composants : ${query}`,
          results: components.slice(0, 12).map((c) => ({
            id: c.name,
            label: c.name,
            details: `dans « ${c.screen.label} »`,
            avatar: <LayersIcon />,
            avatarColor: "var(--lq-color-info)",
            onSelect: () => go(c.screen),
          })),
        },
      ]}
    />
  );
}

/**
 * La coquille : barre latérale en rail, barre haute, et la zone où les écrans se rendent.
 *
 * Elle ne connaît aucun écran par son nom — elle lit le registre (`screens/index.tsx`) et en tire
 * les deux choses qui doivent rester d'accord : les entrées du menu et les routes.
 */
function Shell({ surface, onSurface }: { surface: Surface; onSurface: (next: Surface) => void }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = pathname.replace(/^\//, "");
  const [pinned, setPinned] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toItem = (screen: Screen): SidebarNavItem => ({
    id: screen.id,
    label: screen.label,
    details: screen.details,
    active: screen.path === current,
    onClick: () => navigate(`/${screen.path}`),
  });

  // Un groupe d'un seul écran est une entrée simple : pas de sous-menu à déplier pour une page.
  const navItems: SidebarNavItem[] = screenGroups().map(({ group, screens }) =>
    screens.length === 1
      ? { ...toItem(screens[0]), icon: GROUP_ICONS[group] }
      : { id: group, label: group, icon: GROUP_ICONS[group], children: screens.map(toItem) },
  );

  return (
    <SidebarLayout
      variant="rail"
      pinned={pinned}
      onPinnedChange={setPinned}
      stickyHeader
      logo={<span className="rdk-logo">resume</span>}
      navItems={navItems}
      header={<TopBar showBrand={!pinned} surface={surface} onSurface={onSurface} onSearch={() => setSearchOpen(true)} />}
    >
      <Search open={searchOpen} onOpen={() => setSearchOpen(true)} onClose={() => setSearchOpen(false)} />
      <Routes>
        {SCREENS.map((screen) => (
          <Route key={screen.id} path={`/${screen.path}`} element={screen.render()} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SidebarLayout>
  );
}

/**
 * `HashRouter` et non `BrowserRouter` : la vitrine est un site statique, et un rafraîchissement sur
 * `/tableaux` renvoie un 404 chez tout hébergeur qui ne sait pas réécrire vers `index.html` —
 * GitHub Pages le premier. Le dièse évite ce piège sans configuration. C'est une ligne à changer le
 * jour où elle est servie par quelque chose qui sait réécrire.
 */
export function App() {
  const [surface, setSurface] = useState<Surface>("light");
  return (
    <ResumeTheme surface={surface}>
      <HashRouter>
        <Shell surface={surface} onSurface={setSurface} />
      </HashRouter>
    </ResumeTheme>
  );
}
