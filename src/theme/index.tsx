import type { CSSProperties, ReactNode } from "react";
import { LqThemeProvider, type LqSurface } from "@michaelthomasjach/liseuse-dashboard-kit";
import "@michaelthomasjach/liseuse-dashboard-kit/style.css";
// Les deux polices du CV, servies avec l'application plutôt que par Google Fonts : Space Mono pour le
// texte (400 et 700, droites et italiques — les dates et descriptions du CV sont en italique), League
// Spartan pour le nom et les intitulés (600 et 700). Mêmes fichiers que le site du CV.
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/400-italic.css";
import "@fontsource/space-mono/700.css";
import "@fontsource/space-mono/700-italic.css";
import "@fontsource/league-spartan/600.css";
import "@fontsource/league-spartan/700.css";
import "./resume.css";

/**
 * Le thème « resume », posé sur un sous-arbre.
 *
 * C'est l'unique point d'entrée de cette couche, et il tient en trois choses : la feuille du kit,
 * la feuille de variables de ce thème, et la classe `rdk` qui donne à la seconde la spécificité
 * qu'il lui faut pour gagner sur la première (voir `resume.css` pour le détail du calcul).
 *
 * `palette` n'est pas exposé. Le kit en a deux — « eink » et « color » — et ce thème les remplace
 * toutes les deux : laisser le choix ouvert donnerait un réglage qui, selon sa valeur, ne change
 * rien. Il reste fixé à « color » pour que les composants qui se demandent s'ils sont sur une
 * liseuse répondent non, ce qui est le cas.
 *
 * `surface` reste ouvert, parce que clair et sombre sont deux vraies variantes de ce thème-ci,
 * écrites l'une comme l'autre dans `resume.css`.
 */
export interface ResumeThemeProps {
  /** `"light"` (défaut) ou `"dark"`. */
  surface?: LqSurface;
  /** Appelé quand un composant du kit bascule la surface (`useLqTheme().setSurface`). */
  onSurfaceChange?: (surface: LqSurface) => void;
  /**
   * Classe ajoutée à `rdk` sur la racine — celle par laquelle une application habille déjà son arbre.
   * Elle suit aussi dans les portails, comme `rdk`.
   */
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export function ResumeTheme({ surface = "light", onSurfaceChange, className, style, children }: ResumeThemeProps) {
  return (
    <LqThemeProvider
      palette="color"
      surface={surface}
      font="inter"
      onSurfaceChange={onSurfaceChange}
      className={className ? `rdk ${className}` : "rdk"}
      style={style}
    >
      {children}
    </LqThemeProvider>
  );
}
