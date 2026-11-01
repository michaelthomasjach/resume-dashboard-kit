import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** La vitrine. `base` relatif pour qu'elle se serve aussi bien à la racine d'un domaine que dans
 *  un sous-dossier de GitHub Pages, sans reconstruire. */
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: { outDir: "dist", emptyOutDir: true },
});
