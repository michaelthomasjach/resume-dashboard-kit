import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

/**
 * Le Storybook de la couche « resume » : chaque composant du kit, rendu dans ce thème, avec son
 * code, sa documentation et la table de ses props.
 *
 * Il a le même menu que le Storybook du kit (`../Dashboard liseuse`) : chaque Storybook porte
 * l'union des titres des deux. Les pages que le kit est seul à avoir — leurs composants ne sont pas
 * exportés par le paquet publié — sont lues directement dans son code source (`KIT_STORIES`), et
 * pour que ces pages et celles de la couche parlent du même composant, le paquet tout entier est
 * ici remplacé par ce code source (voir `viteFinal`). La vitrine (`npm run dev`, vite.config.ts)
 * continue, elle, d'utiliser le paquet publié.
 *
 * Documentation des props : l'extraction native (react-docgen) lit désormais le source du kit ;
 * pour les composants exportés, preview.tsx la remplace par celle de `src/stories/docgen.json`
 * (`npm run docgen`, scripts/docgen.mjs), lue sur les types résolus par le compilateur.
 */
const KIT = fileURLToPath(new URL("../../Dashboard liseuse/", import.meta.url));

/** Les pages du kit absentes de la couche, rendues ici dans le thème resume. */
const KIT_STORIES = [
  "components/audio/Audio.stories.tsx",
  "components/charts/candlestick/broker/Broker.stories.tsx",
  "components/charts/candlestick/components/MarketStatePanel.stories.tsx",
  "components/charts/candlestick/diagramShots/DiagramShot.stories.tsx",
  "components/charts/candlestick/propShots/PropShot.stories.tsx",
  "components/charts/candlestick/scripting/ScriptEngineDebugHarness.stories.tsx",
  "components/charts/candlestick/scripting/ScriptingStateDebugHarness.stories.tsx",
  "components/charts/candlestick/strategy/StrategyCharts.stories.tsx",
  "components/charts/candlestick/strategy/VerticalDistributionChart.stories.tsx",
  "components/charts/EarningsDotChart.stories.tsx",
  "components/feedback/Loaders.stories.tsx",
  "components/finance/NotificationMenu.stories.tsx",
  "components/forms/MaskedInputs.stories.tsx",
  "components/icons/AnimatedIcons.stories.tsx",
  "components/map/DotMap.stories.tsx",
  "components/primitives/DropdownPanel.stories.tsx",
  "components/primitives/Typography.stories.tsx",
  "components/widgets/Dashboard.stories.tsx",
  "components/widgets/LiveTile.stories.tsx",
].map((file) => `../../Dashboard liseuse/src/${file}`);

const config: StorybookConfig = {
  stories: ["../src/stories/**/*.mdx", "../src/stories/**/*.stories.@(ts|tsx)", ...KIT_STORIES],
  addons: ["@storybook/addon-docs"],
  framework: { name: "@storybook/react-vite", options: {} },
  typescript: { reactDocgen: "react-docgen" },
  viteFinal: async (viteConfig) => {
    const alias = viteConfig.resolve?.alias;
    const existing = Array.isArray(alias)
      ? alias
      : Object.entries(alias ?? {}).map(([find, replacement]) => ({ find, replacement: replacement as string }));
    viteConfig.resolve = {
      ...viteConfig.resolve,
      alias: [
        // La feuille compilée du paquet n'a plus lieu d'être : le source du kit importe ses CSS
        // lui-même, composant par composant. Un fichier vide prend sa place.
        {
          find: /^@michaelthomasjach\/liseuse-dashboard-kit\/style\.css$/,
          replacement: fileURLToPath(new URL("./kit-style-empty.css", import.meta.url)),
        },
        { find: /^@michaelthomasjach\/liseuse-dashboard-kit$/, replacement: `${KIT}src/index.ts` },
        ...existing,
      ],
      // Le source du kit résoudrait sinon `react` dans ses propres node_modules : deux React dans la
      // page, et chaque hook casse.
      dedupe: [...(viteConfig.resolve?.dedupe ?? []), "react", "react-dom"],
    };
    viteConfig.server = {
      ...viteConfig.server,
      // Le dossier du kit est hors de la racine de ce dépôt : Vite refuse de servir ses fichiers
      // sans cette autorisation.
      fs: { ...viteConfig.server?.fs, allow: [...(viteConfig.server?.fs?.allow ?? []), fileURLToPath(new URL("..", import.meta.url)), KIT] },
      // Le dépôt vit dans un dossier OneDrive : la surveillance native des fichiers y casse parfois
      // le serveur sans un mot. Le sondage est la parade connue, la même que dans le dépôt du kit.
      watch: { ...viteConfig.server?.watch, usePolling: true, interval: 300 },
    };
    return viteConfig;
  },
};

export default config;
