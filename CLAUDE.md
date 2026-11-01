# resume-dashboard-kit — contexte pour Claude Code

Ce fichier existe pour qu'une session ouverte dans ce dossier parte avec ce qui a déjà été décidé,
au lieu de le redécouvrir ou de le remettre en cause. Il a été écrit à la création du dépôt
(2026-11-01).

## Ce que ce dépôt est, et surtout ce qu'il n'est pas

Une **couche de thème** par-dessus `@michaelthomasjach/liseuse-dashboard-kit`, plus la vitrine et
le Storybook qui la montrent. Ce n'est **pas** une seconde bibliothèque de composants. Le kit garde
la logique ; ici on ne décide que de l'apparence et des écrans.

Le dépôt du kit est le voisin : `../Dashboard liseuse` (nom npm
`@michaelthomasjach/liseuse-dashboard-kit`, publié sur GitHub Packages, pas sur npm public).

## La décision, et pourquoi elle a été prise

C'est la **troisième librairie** bâtie sur le kit, après le kit lui-même (palettes `eink` et
`color`) et `../minimal-dashboard-kit` (un thème d'administration). Michael voulait les mêmes
composants, habillés du **style graphique de son CV**. Le procédé est exactement celui de
`minimal-dashboard-kit`, dont ce dépôt est une copie renommée : une couche de thème qui redéfinit les
variables du kit, sans toucher à ses composants. Le choix a été fait et argumenté là-bas (contre une
bibliothèque réécrite, des mois de travail et deux bases à maintenir, et contre une palette de plus
dans l'union `LqPalette` du kit, qui figerait le look dans la surface publique du paquet). Ne rouvre
pas ce débat sans raison nouvelle.

Les deux couches sont indépendantes : rien n'est partagé entre `minimal` et `resume`, et un
correctif de logique va toujours dans le kit, d'où les deux en profitent.

## Comment la couche tient — à ne pas casser

Aucun composant du kit n'écrit de couleur, de rayon ni d'espacement en dur : les ~220 lisent des
variables `--lq-*` posées sur leur ancêtre `.lq-root`. `src/theme/resume.css` les redéfinit sous un
sélecteur **strictement plus spécifique** :

```
.rdk.lq-root[data-lq-palette][data-lq-surface="light"]  (0,4,0)  >  .lq-root[data-lq-palette="color"][data-lq-surface="light"]  (0,3,0)
.rdk.lq-root                                            (0,2,0)  >  .lq-root                                                    (0,1,0)
```

Strictement plus spécifique, et non « plus loin dans la cascade » : l'ordre des imports est ce qu'un
bundler réorganise tout seul le jour où il découpe ses chunks autrement, et une couche qui en dépend
casse sans prévenir. Les `[data-lq-palette]` sans valeur sont là pour acheter un point de
spécificité sans restreindre à une palette — le thème **remplace** `eink` comme `color`.

La classe `rdk` est posée par `ResumeTheme` (`src/theme/index.tsx`), seul point d'entrée. Il fixe
`palette="color"` et `font="inter"` : c'est la pile `--lq-font-inter` que le kit pose en style en
ligne, et `resume.css` la redéfinit en Space Mono. Les variables propres à la couche sont préfixées
`--rdk-` (`--rdk-font-title`, `--rdk-color-text-strong`).

Depuis le kit v0.181, ce qui était écrit en dur dans ses composants passe par des variables
**optionnelles** (jamais déclarées dans son `tokens.css`, lues avec pour repli l'ancienne valeur) :
`--lq-font-weight-*`, `--lq-label-*`, `--lq-caption-*`, `--lq-control-border-width`,
`--lq-button-*`, `--lq-table-*`, `--lq-timeline-*`… et les attributs `data-lq-region="sidebar"` /
`"quickview-head"` sous lesquels `resume.css` redéfinit la palette de la barre latérale et de la
tête du panneau latéral. La liste fait foi en fin de `../Dashboard liseuse/src/theme/tokens.css`.

## Le langage visuel : le CV

La référence est le CV de Michael, site et PDF A4 : `../my-resume/my-resume-front` (variables dans
`src/styles.css` et `src/cv/Resume.module.css`), et deux rendus de référence,
`C:/Users/micha/OneDrive/Bureau/Privé/CV/1.jpg` et `2.jpg`. Les valeurs sont **reprises de ses
variables**, pas estimées. `src/theme/resume.css` fait foi ; en résumé :

- **Clair (le CV)** : accent bleu électrique `#3a41e2`, encre `#1b1d3a`, gris `#6b6f8a`, panneau
  `#ffffff`, papier `#ebebeb`, filets `#cfd2e3` / `#e3e5f0`, survol `#eef0fb`.
- **Sombre (la version nuit du site)** : accent `#7c82ff`, encre `#e4e6f5`, gris `#9a9ec0`,
  panneau `#181b36`, papier `#14172e`, filets `#3d4066` / `#23274a`.
- **Polices** : Space Mono (400, 700, italiques) pour tout le texte, corps à 13 px ; League Spartan
  700 pour les titres et intitulés (`--rdk-font-title`), en capitales pour les titres de carte
  (`--lq-caption-*`, 16 px) ; en-têtes de tableau et étiquettes en League Spartan 700 13 px
  (`--lq-label-*`), les en-têtes de tableau dans le bleu de l'accent, comme les « Skills: » du CV.
  Servies par `@fontsource`, importées dans `ResumeTheme`.
- **Aucun arrondi** : tous les `--lq-radius-*` à 0, bulles, curseurs, galerie et calendrier compris.
- **Le filet bleu de 4 px** sous le titre du CV : sous la barre haute (posée sur le papier), au-dessus
  de la navigation mobile, et comme fil de la frise.
- **Barre latérale** : la colonne bleue pleine du CV, `#3a41e2`, texte blanc ; en sombre, le bleu
  nuit `#1c1f5c`. Même traitement pour la tête du `Quickview`.
- Cartes sans bordure, détachées par un souffle d'ombre ; les modales ont l'ombre large du CV posé
  sur son fond.
- Tons des tuiles pleines : accent `#3a41e2`, succès `#2e9e5b`, info `#1c1f5c`, danger `#c4213a`,
  avertissement `#f2b705`.

## Les règles de frontière

| Ce dont il s'agit | Où ça va |
|---|---|
| Logique d'un composant, correctif, composant manquant | **le kit**, `../Dashboard liseuse` |
| Couleur, rayon, espacement, échelle typographique | ici, `src/theme/resume.css` |
| Refonte d'anatomie (densité, chrome, position d'un libellé) | ici, un composant dans `src/theme/` qui enveloppe celui du kit |
| Écran, navigation, données de démonstration | ici, `src/showcase/` |

Une variable ne peut pas **déplacer** un élément : tant qu'il s'agit de couleur, de taille ou
d'espace, c'est `resume.css` ; dès qu'un libellé doit passer à gauche, c'est un composant.

**Aucun contournement local d'un manque du kit.** S'il manque une variable, une prop ou un
composant, on l'ajoute dans le kit, pas ici. C'est la règle qui justifie toute l'architecture : la
contourner une fois fait diverger les dépôts et la couche perd sa raison d'être.

Corollaire : si `src/showcase/showcase.css` se met à viser un sélecteur `.lq-…`, c'est le signe
qu'il manquait une variable, ou qu'une refonte d'anatomie est à faire.

## La vitrine et le Storybook

`src/showcase/screens/index.tsx` est un **registre unique** : une entrée y produit à la fois
l'élément de menu et la route. Elles ne peuvent donc pas se contredire. Ajouter un écran = écrire le
composant, l'inscrire là. On y trouve la Vue d'ensemble, les Tableaux, les Formulaires, sept écrans
d'application (messagerie, mail, calendrier, galerie, frise, profil, facture) et treize planches
(`src/showcase/screens/components/`) où **chaque export public du kit** est montré vivant, avec le
modèle de planche `src/showcase/Specimen.tsx`. Données déterministes, illustrations en SVG
généré.

`HashRouter` et non `BrowserRouter` : un rafraîchissement sur `/tableaux` rend un 404 chez tout
hébergeur statique qui ne réécrit pas vers `index.html`, GitHub Pages le premier.

Storybook (`npm run storybook`, port 6007) : même version et même menu, nœud pour nœud, que celui du
kit. L'ordre est écrit en dur dans `storySort` (`.storybook/preview.tsx`) — à régénérer depuis
l'`index.json` du Storybook du kit quand il gagne une page. Storybook lit le kit **en source**
(alias vers `../Dashboard liseuse/src`, voir `.storybook/main.ts`), et `npm run docgen` régénère
`src/stories/docgen.json` (tables de props). Les descriptions des stories parlent des valeurs de ce
thème : quand on change une variable dans `resume.css`, vérifier qu'aucune description ne cite
l'ancienne.

## Le paquet

`@michaelthomasjach/resume-dashboard-kit`, sur GitHub Packages. Il ré-exporte tout le kit et ajoute
`ResumeTheme` (`src/index.ts`) : une application n'a qu'une dépendance à déclarer, plus
`import "@michaelthomasjach/resume-dashboard-kit/style.css"`. Build : `npm run build:lib`
(`vite.config.lib.ts`, sortie `dist-lib/` ; le kit, React et les polices restent externes) ;
`prepublishOnly` le lance. Publier : `npm version patch|minor`, puis `npm publish`.

## Le déploiement

Dépôt distant : https://github.com/michaelthomasjach/resume-dashboard-kit, branche `master`.
`.github/workflows/deploy-pages.yml` reconstruit le site à chaque push sur `master` : le Storybook à
la racine (https://michaelthomasjach.github.io/resume-dashboard-kit/), la vitrine sous `/vitrine/`.
Le workflow clone le kit à côté, puisque Storybook le lit en source. Il faut que GitHub Pages soit
réglé sur « GitHub Actions » dans les paramètres du dépôt.

Les captures du README vivent dans `docs/images/` ; elles se régénèrent avec Chrome headless (voir
plus bas) quand le thème change.

## Conventions de travail

- `npm install` a besoin de `GITHUB_TOKEN` dans le shell (le kit est sur GitHub Packages). Il est
  déjà exporté sur le poste de Michael. Ne jamais écrire un jeton réel dans `.npmrc`, qui est
  commité — la valeur reste `${GITHUB_TOKEN}`.
- `npm run build` lance le typecheck puis construit **la vitrine** (`dist/`) ; `npm run build:lib`
  construit le paquet. `npm run typecheck` seul existe aussi.
- Commits en conventional commits, corps explicatif en français, et on commite et pousse à la fin
  de chaque tâche terminée — c'est une consigne permanente de Michael.
- Le cockpit doit connaître ce dossier comme projet `resume-dashboard-kit` ; s'il ne le connaît pas,
  demander à Michael s'il faut l'enregistrer.
- Michael écrit en français et attend des réponses en français.

## Vérifier une modification visuelle

Ne pas se contenter du typecheck pour un changement de thème : construire puis lire les variables
**calculées** dans un vrai navigateur, c'est la seule preuve que la couche gagne. La méthode :
`npm run build`, un petit serveur statique sur `dist/`, Chrome en `--headless=new` piloté en CDP
(`Runtime.evaluate` avec `getComputedStyle(document.querySelector('.lq-root'))`), plus
`Page.captureScreenshot`. Aucune dépendance à ajouter — Node a `WebSocket` en global. Comparer au
CV : `../my-resume` en local, ou les deux rendus de référence en JPEG.
