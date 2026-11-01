import type { Note } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * Les données de démonstration de `NotesPanel` : le carnet d'une responsable produit. L'heure de
 * référence est fixe, pour que les dates de la liste ne bougent pas d'un jour à l'autre.
 */
export const NOTES_NOW = "2026-10-31T14:30:00";

export const NOTES: Note[] = [
  {
    id: "release",
    title: "Mise en production de lundi",
    body: "Ordre de passage : migration des factures, puis déploiement, puis purge des caches.\n\nPrévenir le support : l'export CSV change de format (séparateur point-virgule).\nRelire la note de version avec Ava avant dimanche soir.",
    updatedAt: "2026-10-31T11:20:00",
  },
  {
    id: "retours",
    title: "Retours clients d'octobre",
    body: "Trois demandes de filtre par date sur les tableaux. Deux plaintes sur la lenteur de l'export. Une demande de mode sombre.",
    updatedAt: "2026-10-30T17:45:00",
  },
  {
    id: "recrutement",
    title: "Recrutement front-end",
    body: "Entretiens mardi et jeudi. Exercice : une table paginée accessible au clavier, en deux heures.",
    updatedAt: "2026-10-12T09:00:00",
  },
  { id: "idee", title: "", body: "Idée : un raccourci clavier pour ouvrir la recherche depuis n'importe quel écran.", updatedAt: "2025-12-04T15:10:00" },
];
