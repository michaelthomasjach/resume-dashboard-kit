import type { ReactNode } from "react";
import { Heading, Text } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * L'en-tête d'un écran, sur le modèle des titres de section du CV : un titre de 27 px en League
 * Spartan (le `h3` du kit, que le thème règle à cette taille) et une phrase d'introduction en texte
 * courant, pas atténué. Pas de titre de page plus gros que celui-là sous la barre haute.
 *
 * Commun aux écrans de référence et aux planches, pour qu'aucun écran ne parle autrement.
 */
export function ScreenHead({ title, intro, actions }: { title: string; intro: ReactNode; actions?: ReactNode }) {
  return (
    <header className="rdk-screen__head">
      <div className="rdk-screen__titles">
        <Heading level={3}>{title}</Heading>
        <Text>{intro}</Text>
      </div>
      {actions}
    </header>
  );
}

/**
 * Le modèle des planches de composants.
 *
 * Les écrans de référence (Vue d'ensemble, Tableaux, Formulaires) sont des mises en page ; les
 * planches, elles, montrent le kit composant par composant. Elles se comptent par dizaines, et une
 * planche écrite à la main chaque fois finirait par avoir dix allures différentes — c'est ce
 * modèle qui les tient au même rang : un en-tête d'écran, puis une suite de spécimens, chacun
 * nommé par le composant exact du kit qu'il montre.
 */
export function SpecimenScreen({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <div className="rdk-screen">
      <ScreenHead title={title} intro={intro} />
      {children}
    </div>
  );
}

/**
 * Un spécimen, dans l'anatomie d'une carte du thème : le nom du composant en petit titre
 * (League Spartan grasse, les variables `--lq-label-*` du thème), sans filet dessous, puis le
 * corps — une phrase qui dit à quoi il sert, et le composant vivant.
 *
 * `wide` lui donne toute la largeur de l'écran — pour un graphique, un tableau, un calendrier, tout
 * ce qui se lit mal dans une demi-colonne.
 */
export function Specimen({
  name,
  description,
  wide,
  children,
}: {
  /** Le nom exact de l'export du kit, ou plusieurs séparés par « · ». */
  name: string;
  description?: ReactNode;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={wide ? "rdk-specimen rdk-specimen--wide" : "rdk-specimen"}>
      <header className="rdk-specimen__head">
        <h2 className="rdk-specimen__name">{name}</h2>
      </header>
      <div className="rdk-specimen__body">
        {description ? <p className="rdk-specimen__description">{description}</p> : null}
        {children}
      </div>
    </section>
  );
}

/** La grille qui range les spécimens : deux colonnes quand la largeur le permet, une sinon. */
export function SpecimenGrid({ children }: { children: ReactNode }) {
  return <div className="rdk-specimens">{children}</div>;
}
