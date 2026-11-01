import { SCREENS, type Screen } from "./screens";

/**
 * L'index de la recherche de la barre haute : les écrans, et les composants que chacun montre.
 *
 * Les composants ne sont inscrits nulle part à la main. Le code source des écrans est lu à la
 * construction (`import.meta.glob` en `?raw`), et chaque `<Specimen name="…">` y déclare ce qu'il
 * montre : ajouter un spécimen à une planche suffit à le rendre trouvable.
 */
const SOURCES = import.meta.glob(["./screens/*.tsx", "./screens/components/*.tsx"], {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export interface ComponentEntry {
  /** Le nom de l'export du kit. */
  name: string;
  screen: Screen;
}

function componentsOf(screen: Screen): string[] {
  const file = Object.entries(SOURCES).find(([path]) => path.endsWith(`/${screen.source}.tsx`));
  if (!file) return [];
  const names = [...file[1].matchAll(/<Specimen\s+name="([^"]+)"/g)].flatMap((m) => m[1].split("·"));
  return names.map((n) => n.trim()).filter((n) => /^[A-Z]\w*$/.test(n));
}

/** Un composant montré sur plusieurs écrans n'y figure qu'une fois, avec le premier. */
export const COMPONENTS: ComponentEntry[] = (() => {
  const seen = new Map<string, ComponentEntry>();
  for (const screen of SCREENS) {
    for (const name of componentsOf(screen)) {
      if (!seen.has(name)) seen.set(name, { name, screen });
    }
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
})();

const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function searchScreens(query: string): Screen[] {
  const q = fold(query.trim());
  return q ? SCREENS.filter((s) => fold(`${s.label} ${s.group}`).includes(q)) : [];
}

export function searchComponents(query: string): ComponentEntry[] {
  const q = fold(query.trim());
  return q ? COMPONENTS.filter((c) => fold(c.name).includes(q)) : [];
}
