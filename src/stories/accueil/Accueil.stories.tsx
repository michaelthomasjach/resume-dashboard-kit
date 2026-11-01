import type { Meta, StoryObj } from "@storybook/react-vite";
import docgen from "../docgen.json";
import { AccueilPage } from "./AccueilPage";

/**
 * La première entrée du menu, comme dans le Storybook du kit : ce qu'on voit avant de savoir ce que
 * sont toutes les autres. Tout ce qu'elle montre est un composant vivant du kit, rendu dans le
 * thème, si bien qu'elle ne peut pas vieillir comme une page de captures.
 */
const meta: Meta<typeof AccueilPage> = {
  title: "Accueil",
  component: AccueilPage,
  // Pas de page Docs : elle ajouterait une seconde entrée sous un titre fait pour être une feuille
  // unique, et une table de props pour un composant que personne n'importe.
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
    // La page porte ses propres marges ; le décorateur global ne doit pas en ajouter.
    rdkPadding: 0,
    options: { showPanel: false },
    controls: { disable: true },
  },
};
export default meta;
type Story = StoryObj<typeof AccueilPage>;

export const Accueil: Story = {
  name: "Accueil",
  render: () => <AccueilPage kitVersion={docgen.version} componentCount={Object.keys(docgen.components).length} />,
};
