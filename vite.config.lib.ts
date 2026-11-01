import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

/**
 * Le build du paquet publié — distinct de `vite.config.ts`, qui construit la vitrine.
 *
 * Le paquet ne contient que `src/index.ts` et `src/theme/` : la vitrine et les stories restent dans
 * le dépôt. Le kit, React et les polices sont externes — le kit est une dépendance déclarée, il ne
 * doit pas être recopié dans ce paquet, sinon une application qui l'importe aussi en aurait deux
 * exemplaires, et deux contextes de thème qui ne se voient pas.
 *
 * Les imports CSS externes (la feuille du kit, les polices) restent des `import` dans le JS publié :
 * c'est le bundler de l'application qui les résout. La feuille de ce thème, elle, sort dans
 * `dist/style.css`, que l'application importe — même convention que le kit.
 */
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    dts({
      include: ["src/index.ts", "src/theme"],
      rollupTypes: true,
      tsconfigPath: "./tsconfig.json",
    }),
  ],
  build: {
    outDir: "dist-lib",
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ResumeDashboardKit",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", /^@michaelthomasjach\/liseuse-dashboard-kit/, /^@fontsource\//],
      output: ["es", "cjs"].map((format) => ({
        format: format as "es" | "cjs",
        entryFileNames: `resume-dashboard-kit.${format}.js`,
        assetFileNames: (assetInfo: { name?: string }) =>
          assetInfo.name?.endsWith(".css") ? "style.css" : (assetInfo.name ?? "asset"),
      })),
    },
    cssCodeSplit: false,
    sourcemap: true,
    emptyOutDir: true,
  },
});
