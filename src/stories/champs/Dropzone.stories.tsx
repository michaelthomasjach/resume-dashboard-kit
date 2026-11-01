import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Dropzone } from "@michaelthomasjach/liseuse-dashboard-kit";

/** Des fichiers de démonstration, fabriqués à la volée : la taille affichée est la vraie taille
 *  du contenu, et elle est la même à chaque chargement. */
function demoFiles(): File[] {
  return [
    new File(["x".repeat(184_000)], "releve-octobre-2026.pdf", { type: "application/pdf" }),
    new File(["x".repeat(1_240_000)], "facture-F-2041.pdf", { type: "application/pdf" }),
  ];
}

/**
 * La zone de dépôt de fichiers, avec la liste de ceux qui sont retenus.
 */
const meta = {
  title: "Forms/Dropzone",
  component: Dropzone,
  parameters: {
    docs: {
      description: {
        component: [
          "Zone d'import de fichiers : un grand cadre en tirets, avec une icône de nuage, qu'on clique pour ouvrir le sélecteur du système ou sur lequel on dépose des fichiers. Pendant le survol d'un glisser, le cadre prend l'accent et son texte devient « Déposez pour importer ». Sous la zone, la liste des fichiers retenus — nom, taille lisible, bouton corbeille.",
          "",
          "**Quand l'utiliser** — joindre des pièces à un dossier : justificatifs, relevés, un logo. Pour un import qui se déroule en plusieurs étapes (lecture d'un CSV, correspondance des colonnes), la zone n'en est que la première ; enchaînez avec un `Stepper`.",
          "",
          "**Contrôlé, sans envoi** — le composant ne téléverse rien et ne garde rien : `onFilesSelected(fichiers)` livre ce qui vient d'être choisi, l'appelant l'ajoute à sa liste et la renvoie par `files` ; `onRemoveFile(index)` demande d'en retirer un. Sans `files`, pas de liste ; sans `onRemoveFile`, pas de corbeille.",
          "",
          "**Filtrage** — `multiple` autorise plusieurs fichiers d'un coup (sinon seul le premier est gardé). `maxSizeMB` écarte les fichiers trop lourds et `accept` (`\"image/*,.pdf\"`) ceux d'un autre type — vérifié au sélecteur **et** au glisser-déposer. Les fichiers écartés sont nommés dans un message sous la zone (`role=\"alert\"`), que `formatRejection(rejetés)` remplace et qu'un `error` passé par l'appelant recouvre ; `onFilesRejected(rejetés)` les reçoit aussi, chacun avec sa raison (`\"size\"` ou `\"type\"`). Le champ se vide après chaque choix : re-choisir un fichier retiré fonctionne.",
          "",
          "**Anatomie** — `label` est le libellé du champ, au-dessus de la zone (par défaut « Glissez-déposez vos fichiers ici ») ; `dropLabel` le texte de la zone (« Cliquez ou glissez un fichier ») et `dragActiveLabel` celui du survol (« Déposez pour importer »). `hint` ajoute une ligne de consignes, `error` passe le cadre en rouge et affiche le message dessous. Les tailles s'écrivent à la française (« 1,2 Mo »).",
          "",
          "**Clavier** — la zone est focalisable (`role=\"button\"`) : Entrée ou Espace ouvre le sélecteur. Chaque corbeille porte un libellé accessible qui nomme le fichier (« Retirer releve-octobre-2026.pdf »).",
          "",
          "**Thème** — `--lq-color-border` pour les tirets, `--lq-color-accent` et `--lq-color-hover` au survol d'un glisser, `--lq-color-danger` en erreur, `--lq-radius-lg` pour la zone, `--lq-radius-md` pour les lignes de fichiers, `--lq-dropzone-list-gap` (optionnelle, `--lq-space-2` par défaut) pour l'écart entre la zone et la liste, quel que soit `--lq-field-gap`, `--lq-space-4` / `--lq-space-6` pour ses marges.",
        ].join("\n"),
      },
    },
  },
  args: {
    label: "Justificatifs",
    hint: "PDF ou image, 5 Mo au plus",
    accept: "image/*,.pdf",
    multiple: true,
    maxSizeMB: 5,
    onFilesSelected: fn(),
    onRemoveFile: fn(),
  },
  argTypes: {
    files: { control: false },
    onFilesSelected: { control: false },
    onRemoveFile: { control: false },
  },
  render: function Render(args) {
    const [files, setFiles] = useState<File[]>(demoFiles);
    return (
      <div style={{ maxWidth: 480 }}>
        <Dropzone
          {...args}
          files={files}
          onFilesSelected={(picked) => {
            setFiles((prev) => (args.multiple ? [...prev, ...picked] : picked));
            args.onFilesSelected(picked);
          }}
          onRemoveFile={(i) => {
            setFiles((prev) => prev.filter((_, idx) => idx !== i));
            args.onRemoveFile?.(i);
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof Dropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Deux fichiers déjà retenus ; cliquez la zone pour en ajouter, la corbeille pour en retirer." } } },
};

export const Empty: Story = {
  name: "Vide",
  args: { label: "Relevés bancaires", hint: "Un ou plusieurs PDF" },
  render: function Render(args) {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <div style={{ maxWidth: 480 }}>
        <Dropzone
          {...args}
          files={files}
          onFilesSelected={(picked) => {
            setFiles((prev) => [...prev, ...picked]);
            args.onFilesSelected(picked);
          }}
          onRemoveFile={(i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
        />
      </div>
    );
  },
};

export const SingleImage: Story = {
  name: "Un seul fichier",
  args: { label: "Logo de l'entreprise", hint: "PNG ou SVG, 1 Mo au plus", accept: "image/png,image/svg+xml", multiple: false, maxSizeMB: 1 },
  parameters: { docs: { description: { story: "Sans `multiple`, un nouveau choix remplace l'ancien (ici, c'est la story qui le remplace : le composant ne livre que le premier fichier)." } } },
  render: function Render(args) {
    const [files, setFiles] = useState<File[]>(() => [new File(["x".repeat(42_000)], "logo-lemoine.svg", { type: "image/svg+xml" })]);
    return (
      <div style={{ maxWidth: 480 }}>
        <Dropzone
          {...args}
          files={files}
          onFilesSelected={(picked) => {
            setFiles(picked);
            args.onFilesSelected(picked);
          }}
          onRemoveFile={() => setFiles([])}
        />
      </div>
    );
  },
};

export const WithError: Story = {
  name: "En erreur",
  args: { label: "Pièce d'identité", hint: "JPEG, PNG ou PDF", error: "Format non pris en charge : .heic", multiple: false },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Dropzone {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { label: "Pièces du dossier clos", hint: "Le dossier est clos : plus aucun ajout.", disabled: true },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Dropzone {...args} />
    </div>
  ),
};
