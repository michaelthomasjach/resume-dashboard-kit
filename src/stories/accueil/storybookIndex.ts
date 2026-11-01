import { useEffect, useState } from "react";

/** Une entrée de `index.json`, le sommaire que Storybook sert à côté de `iframe.html`. */
interface IndexEntry {
  id: string;
  title: string;
  type: "story" | "docs";
}

/** Ce que l'accueil a besoin de savoir du menu : les pages qu'il contient, et comment en ouvrir une. */
export interface StorybookIndex {
  /** Nombre de pages (titres distincts) par famille — la première partie du titre. */
  pagesByFamily: Record<string, number>;
  /** Nombre total de pages du menu. */
  pageCount: number;
  /** Le chemin à ouvrir pour un titre : sa page Docs s'il en a une, sinon sa première story. */
  pathOf: (title: string) => string;
}

/** La règle d'identifiant de Storybook (`sanitize` de storybook/internal/csf), pour le repli. */
const sanitize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

const fallback: StorybookIndex = {
  pagesByFamily: {},
  pageCount: 0,
  pathOf: (title) => `/docs/${sanitize(title)}--docs`,
};

/**
 * Lit le sommaire du Storybook en cours plutôt que de recopier des comptes ou des identifiants dans
 * cette page : les chiffres et les liens de l'accueil suivent le menu le jour où il change, et un
 * lien vers une page renommée ne casse pas en silence.
 */
export function useStorybookIndex(): StorybookIndex {
  const [index, setIndex] = useState<StorybookIndex>(fallback);
  useEffect(() => {
    let alive = true;
    fetch("./index.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json: { entries: Record<string, IndexEntry> }) => {
        if (!alive) return;
        const entries = Object.values(json.entries);
        const titles = new Set(entries.map((e) => e.title));
        const pagesByFamily: Record<string, number> = {};
        for (const t of titles) {
          const family = t.split("/")[0];
          pagesByFamily[family] = (pagesByFamily[family] ?? 0) + 1;
        }
        setIndex({
          pagesByFamily,
          pageCount: titles.size,
          pathOf: (title) => {
            const own = entries.filter((e) => e.title === title);
            const docs = own.find((e) => e.type === "docs");
            if (docs) return `/docs/${docs.id}`;
            if (own[0]) return `/story/${own[0].id}`;
            return fallback.pathOf(title);
          },
        });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return index;
}

/** Storybook rend chaque story dans sa propre iframe : un simple `href` chargerait un second
 *  Storybook dans le cadre. Naviguer `window.top` déplace le gestionnaire lui-même, menu compris. */
export function openPath(path: string) {
  const target = window.top ?? window;
  target.location.href = `${target.location.pathname}?path=${path}`;
}
