// Extrait, du fichier de déclarations du kit publié, la documentation de chaque composant : sa
// description et ses props (type, valeurs possibles, obligatoire ou non, description). Storybook ne
// sait pas le faire seul pour un paquet de node_modules — son extraction ne lit que les sources du
// projet — d'où ce fichier, régénéré par `npm run docgen` et chargé par .storybook/preview.tsx.
//
// L'API du compilateur TypeScript, et non react-docgen-typescript : sur un fichier de déclarations
// unique de plusieurs milliers de lignes, ce dernier attribue à un composant des props d'un autre
// (le `label` et le `size` d'AlertMarker se retrouvaient sur Input). Une table de props fausse est
// pire que pas de table : ici, chaque prop est lue sur le type réel du premier paramètre du composant.
import ts from "typescript";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";

// Le Storybook rend le source du kit voisin (voir .storybook/main.ts) : la table des props le lit
// donc lui aussi, pour décrire exactement ce qui est affiché. Sans le dépôt voisin, on retombe sur
// le fichier de déclarations du paquet installé.
const kitDir = path.resolve("..", "Dashboard liseuse");
const kitSource = path.join(kitDir, "src", "index.ts");
// Le paquet n'exporte pas son package.json : on le lit par son chemin dans node_modules.
const pkgDir = existsSync(kitSource) ? kitDir : path.join("node_modules", "@michaelthomasjach", "liseuse-dashboard-kit");
const dts = existsSync(kitSource) ? kitSource : path.resolve(pkgDir, "dist", "index.d.ts");
const { version } = JSON.parse(readFileSync(path.join(pkgDir, "package.json"), "utf8"));

// Résolution « node » : sans elle, `import { ReactNode } from "react"` ne se résout pas depuis le
// fichier de déclarations, et toutes les props de contenu s'affichent en `any`.
const program = ts.createProgram([dts], {
  jsx: ts.JsxEmit.ReactJSX,
  skipLibCheck: true,
  strict: true,
  moduleResolution: ts.ModuleResolutionKind.Node10,
  esModuleInterop: true,
  // La cible par défaut (ES5) n'a ni Set ni Iterable : ReactNode, qui en dépend, tombait en erreur.
  target: ts.ScriptTarget.ES2022,
  lib: ["lib.es2022.d.ts", "lib.dom.d.ts", "lib.dom.iterable.d.ts"],
});
const checker = program.getTypeChecker();
const module = checker.getSymbolAtLocation(program.getSourceFile(dts));

// Les attributs HTML hérités noieraient les props du kit ; on ne garde que ceux qu'on règle vraiment.
const INHERITED_KEPT = new Set(["children", "className", "style", "disabled", "onClick", "onChange", "value", "defaultValue", "placeholder", "required", "type", "name", "id", "title", "readOnly", "autoFocus", "min", "max", "step"]);

const docOf = (symbol) => ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim();
const fmt = (type) => checker.typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType);

function typeInfo(type) {
  const raw = fmt(type);
  // Les unions de littéraux deviennent des listes de choix (contrôle « select » dans Storybook).
  const parts = type.isUnion() ? type.types.filter((t) => !(t.flags & ts.TypeFlags.Undefined)) : [type];
  if (parts.length > 1 && parts.every((t) => t.isStringLiteral() || t.isNumberLiteral())) {
    return { name: "enum", raw, value: parts.map((t) => ({ value: JSON.stringify(t.value) })) };
  }
  if (parts.every((t) => t.flags & ts.TypeFlags.BooleanLike)) return { name: "boolean", raw };
  if (parts.length === 1 && parts[0].flags & ts.TypeFlags.StringLike) return { name: "string", raw };
  if (parts.length === 1 && parts[0].flags & ts.TypeFlags.NumberLike) return { name: "number", raw };
  if (parts.length === 1 && parts[0].getCallSignatures().length) return { name: "func", raw };
  return { name: raw.length > 60 ? "other" : raw, raw };
}

/** « Default "normal" », « Défaut : 6 », « (default 40px) » — la valeur par défaut annoncée dans la doc. */
function defaultFrom(description) {
  // Seulement une valeur reconnaissable — entre guillemets ou accents graves, booléen, nombre — pour
  // ne pas prendre le mot qui suit « Default » dans une phrase pour une valeur.
  // Le mot-clé ne doit pas être lui-même dans du code (`"default"` est une valeur, pas l'annonce
  // d'un défaut), et la valeur tient sur une ligne : sans ces deux bornes, la capture courait d'un
  // accent grave fermant au suivant et ramassait une phrase entière.
  const strict = description.match(/(?<![`"'\w-])(?:Default|Défaut|par défaut)\b\s*(?:[:=]|value|is)?\s*(`[^`\n]{1,40}`|"[^"\n]{1,40}"|true\b|false\b|-?\d[\d.]*(?:px|ms|rem|%)?)/i);
  // Sans guillemets : Storybook les ajoute lui-même à l'affichage.
  return strict ? { value: strict[1].replace(/^[`"]|[`"]$/g, "").replace(/\.$/, "") } : null;
}


const out = {};
for (const exported of checker.getExportsOfModule(module)) {
  const name = exported.getName();
  if (!/^[A-Z]/.test(name) || /Icon$/.test(name)) continue;
  const symbol = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
  const decl = symbol.valueDeclaration ?? symbol.declarations?.[0];
  if (!decl || !(symbol.flags & (ts.SymbolFlags.Function | ts.SymbolFlags.Variable))) continue;
  const signature = checker.getTypeOfSymbolAtLocation(symbol, decl).getCallSignatures()[0];
  if (!signature) continue;
  const param = signature.getParameters()[0];
  const props = {};
  if (param) {
    const propsType = checker.getTypeOfSymbolAtLocation(param, decl);
    for (const prop of checker.getPropertiesOfType(propsType)) {
      const pd = prop.declarations?.[0];
      const fromReact = pd && /node_modules[\\/](@types[\\/]react|typescript)/.test(pd.getSourceFile().fileName);
      if (fromReact && !INHERITED_KEPT.has(prop.getName())) continue;
      const description = docOf(prop);
      const parent = pd?.parent && ts.isInterfaceDeclaration(pd.parent) ? pd.parent.name.text : undefined;
      props[prop.getName()] = {
        name: prop.getName(),
        required: !(prop.flags & ts.SymbolFlags.Optional),
        type: typeInfo(checker.getTypeOfSymbolAtLocation(prop, decl)),
        description: description || (fromReact ? "Attribut HTML standard, transmis à l'élément." : ""),
        defaultValue: defaultFrom(description),
        parent: parent ? { name: parent } : undefined,
      };
    }
  }
  out[name] = { displayName: name, description: docOf(symbol), props };
}

mkdirSync("src/stories", { recursive: true });
writeFileSync("src/stories/docgen.json", JSON.stringify({ version, components: out }, null, 1));
console.log(`kit ${version} (${path.relative(".", dts)}) : ${Object.keys(out).length} composants documentés`);
