import type { AiSend } from "@michaelthomasjach/liseuse-dashboard-kit";
import { MOIS_COURTS } from "../../showcase/chartData";

/**
 * Ce que partagent les stories des graphiques — celles de `graphiques/` et de `marche/` : les
 * formats de nombres et de dates, et la mise en forme du code montré sous « Show code ».
 *
 * Les données, elles, viennent de `src/showcase/chartData.ts` : la vitrine et le Storybook montrent
 * les mêmes séries, tirées d'une graine fixe, et rendent donc la même image à chaque chargement.
 */

export const nombre = (n: number, decimales = 0) =>
  n.toLocaleString("fr-FR", { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
export const kEuros = (n: number) => `${nombre(n)} k€`;
export const kEurosSigne = (n: number) => `${n > 0 ? "+" : ""}${nombre(n, 1)} k€`;
export const pourcent = (n: number) => `${n > 0 ? "+" : ""}${n.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;
export const euros = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
/**
 * « janv. 26 » — pour un axe de mois.
 *
 * Les points des séries sont datés à minuit UTC, mais l'axe temporel de `LineAreaChart` gradue en
 * heure **locale** (d3 `scaleTime`) : à Paris, sa graduation du 1er janvier tombe le 31 décembre
 * à 23 h UTC. Lue en UTC telle quelle, elle s'intitulerait « déc. » — tout l'axe glisserait d'un
 * mois. Avancer de douze heures avant de lire ramène les deux au bon mois, quel que soit le fuseau.
 */
export const moisAnnee = (x: Date | number) => {
  const d = new Date(+x + 12 * 3_600_000);
  return `${MOIS_COURTS[d.getUTCMonth()]} ${String(d.getUTCFullYear()).slice(2)}`;
};
/** « 18 févr. 2026 » — les bougies et les évènements sont datés à minuit UTC : on les lit en UTC. */
export const dateCourte = (d: Date) =>
  d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** Au-delà de ce nombre de caractères, un tableau ou un objet littéral passé en prop est abrégé. */
const SEUIL_LITTERAL = 240;

/**
 * Remplace, dans le code affiché, chaque tableau ou objet littéral trop long par le nom de sa prop :
 * `series={[ …deux cents lignes… ]}` devient `series={series}`. Sans cela, l'onglet Docs d'un
 * graphique déroulerait des milliers de lignes de points — sept ans de bougies pour un
 * `CandlestickChart` — et l'usage du composant s'y perdrait.
 */
function abregerLitteraux(code: string): string {
  // La `key` qui force une story à remonter quand un contrôle change une prop « default… » : un
  // artifice de la story, pas de l'usage du composant.
  code = code.replace(/\n\s*key=(?:"[^"]*"|\{[^}\n]*\})/g, "");
  let sortie = "";
  let i = 0;
  const motif = /(\w+)=\{(?=[[{])/g;
  for (;;) {
    motif.lastIndex = i;
    const m = motif.exec(code);
    if (!m) break;
    const debut = m.index + m[0].length - 1; // l'accolade ouvrante de la valeur JSX
    const fin = finDuBloc(code, debut);
    if (fin < 0) break;
    sortie += code.slice(i, m.index);
    sortie += fin - debut > SEUIL_LITTERAL ? `${m[1]}={${m[1]}}` : code.slice(m.index, fin + 1);
    i = fin + 1;
  }
  return sortie + code.slice(i);
}

/** L'indice de l'accolade qui ferme celle ouverte en `debut`, en sautant les chaînes. */
function finDuBloc(code: string, debut: number): number {
  let profondeur = 0;
  let chaine: string | null = null;
  for (let j = debut; j < code.length; j++) {
    const c = code[j];
    if (chaine) {
      if (c === "\\") j++;
      else if (c === chaine) chaine = null;
      continue;
    }
    if (c === "'" || c === '"' || c === "`") chaine = c;
    else if (c === "{" || c === "[" || c === "(") profondeur++;
    else if (c === "}" || c === "]" || c === ")") {
      profondeur--;
      if (profondeur === 0) return j;
    }
  }
  return -1;
}

/** Une fonction s'affiche sous son nom (`formatY={kEuros}`) plutôt que sous un `() => {}` muet. */
function nomDeFonction(f: unknown): string {
  const nom = typeof f === "function" ? f.name : "";
  return nom && !/^(spy|mockConstructor|bound |anonymous)/.test(nom) ? nom : "() => {}";
}

/** Les paramètres à étaler dans `meta.parameters` d'une story de graphique. */
export const CODE_LISIBLE = {
  jsx: { showFunctions: true, functionValue: nomDeFonction },
} as const;

/** À poser sous `meta.parameters.docs.source`. */
export const SOURCE_ABREGEE = { transform: abregerLitteraux } as const;

/**
 * Le transport de l'assistant pour les stories : il ne contacte aucun modèle, n'a besoin d'aucune clé
 * et répond toujours la même chose, mot à mot, pour que le panneau se voie vivre. Une application le
 * remplace par `ai.send` branché sur une route de son propre serveur — celui qui tient la clé.
 */
export const assistantDeDemo: AiSend = async function* (_requete, signal) {
  const reponse =
    "Ceci est une réponse de démonstration : le Storybook ne contacte aucun modèle et n'a aucune clé. " +
    "Dans une application, ce panneau est branché sur votre propre serveur (`ai.send`) et l'assistant " +
    "peut alors ajouter des indicateurs, tracer, écrire un script ou lire un backtest sur le graphique.";
  for (const mot of reponse.split(/(?<= )/)) {
    if (signal.aborted) return;
    await new Promise((r) => setTimeout(r, 18));
    yield { type: "text_delta", text: mot };
  }
  yield { type: "done", stopReason: "end_turn" };
};
