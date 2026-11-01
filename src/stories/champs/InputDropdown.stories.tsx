import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { InputDropdown, SearchIcon, UserIcon, type InputDropdownOption } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ORDERS } from "../../showcase/demoData";

const CLIENTS: InputDropdownOption[] = [
  { value: "lemoine", label: "Lemoine SAS", description: "Lyon · grand compte", group: "Actifs" },
  { value: "atelier-nord", label: "Atelier Nord", description: "Lille · PME", group: "Actifs" },
  { value: "groupe-vallee", label: "Groupe Vallée", description: "Grenoble · grand compte", group: "Actifs" },
  { value: "mercier", label: "Mercier & Fils", description: "Nantes · PME", group: "Actifs" },
  { value: "cabinet-roux", label: "Cabinet Roux", description: "Bordeaux · profession libérale", group: "Actifs" },
  { value: "studio-belier", label: "Studio Bélier", description: "Marseille · résilié en septembre", group: "Archivés" },
  { value: "ferme-du-pre", label: "Ferme du Pré", description: "Rennes · en cours de transfert", group: "Archivés", disabled: true },
];

/** Les références de commande de la démo, pour la recherche « côté serveur ». */
const COMMANDES = ORDERS.map((o) => ({ value: o.id, label: `${o.id} · ${o.client}`, description: o.produit }));

/**
 * Le champ à liste filtrée (combobox) : on tape, la liste se resserre, on choisit.
 */
const meta = {
  title: "Forms/Input/InputDropdown",
  component: InputDropdown,
  parameters: {
    docs: {
      description: {
        component: [
          "Un champ texte doublé d'une liste déroulante : ce qu'on tape **filtre** les options au fur et à mesure. Le filtre ignore la casse et les accents (`belier` trouve « Studio Bélier ») et cherche dans le libellé, la seconde ligne et la valeur.",
          "",
          "**Quand l'utiliser** — choisir **une** valeur dans une liste trop longue pour être parcourue d'un œil : un client, un produit, une commune. Pour une poignée d'options connues, `Select` suffit ; pour en choisir plusieurs, `TagInput` avec `suggestions` ; pour une recherche qui ne mène pas à une valeur, un simple `Input`.",
          "",
          "**Anatomie** — le champ (icône de tête optionnelle, bouton d'effacement si `onClear` est fourni et qu'une valeur est choisie), puis la liste : options rangées sous l'intitulé de leur `group`, dans l'ordre où elles arrivent, avec une seconde ligne atténuée (`description`) et des options `disabled` qu'on voit sans pouvoir les prendre.",
          "",
          "**Valeur** — composant **contrôlé** : `value` est la valeur choisie ou `null`, `onChange(valeur, option)` est appelé au choix. Le texte tapé n'est pas une valeur : quitter le champ sans choisir rend le libellé de la valeur en place.",
          "",
          "**Clavier** — le focus ouvre la liste ; ↑ et ↓ s'y déplacent en sautant les options désactivées, Entrée choisit, Échap ferme et rend la valeur courante, Tab ferme.",
          "",
          "**Recherche côté serveur** — `filter={false}` coupe le filtre interne : lancez la requête depuis `onInputChange` (appelé à chaque frappe), renvoyez les résultats par `options` et passez `loading` le temps qu'elle tourne. `emptyMessage` change le « Aucun résultat » ; `maxResults` (200) borne le nombre de lignes rendues.",
          "",
          "**Portail** — la liste vit dans un `Popover` rendu sous `document.body` : elle passe au-dessus des conteneurs à défilement et se retourne au-dessus du champ quand la place manque en bas (`placement` fixe le côté préféré).",
          "",
          "**Thème** — le champ lit `--lq-control-*` et `--lq-field-*` ; la liste, `--lq-shadow-modal`, `--lq-radius-md`, `--lq-color-hover` pour l'option active, et la voix des petites capitales (`--lq-label-font`, `--lq-label-size`, `--lq-label-tracking`) pour les intitulés de groupe.",
        ].join("\n"),
      },
    },
  },
  args: {
    label: "Client",
    options: CLIENTS,
    value: "lemoine",
    placeholder: "Rechercher un client…",
    helperText: "Nom, ville ou segment.",
    leadingIcon: <SearchIcon size={16} />,
    onChange: fn(),
    onClear: fn(),
  },
  argTypes: {
    options: { control: false },
    value: { control: false },
    onChange: { control: false },
    onClear: { control: false },
    onInputChange: { control: false },
    filter: { control: false },
    leadingIcon: { control: false },
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ maxWidth: 420 }}>
        <InputDropdown
          {...args}
          value={value}
          onChange={(v, option) => {
            setValue(v);
            args.onChange(v, option);
          }}
          onClear={
            args.onClear
              ? () => {
                  setValue(null);
                  args.onClear?.();
                }
              : undefined
          }
        />
      </div>
    );
  },
} satisfies Meta<typeof InputDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Tapez « pme » ou « lyon » : la seconde ligne est cherchée aussi. « Ferme du Pré » est visible mais désactivée." } } },
};

export const Empty: Story = {
  name: "Sans valeur",
  args: { value: null, label: "Responsable du compte", leadingIcon: <UserIcon size={16} />, helperText: undefined, onClear: undefined },
  parameters: { docs: { description: { story: "Sans `onClear`, pas de bouton d'effacement : une fois choisie, la valeur ne peut qu'être remplacée." } } },
};

export const ServerSearch: Story = {
  name: "Recherche côté serveur",
  args: { label: "Commande", value: null, options: [], placeholder: "Référence ou client…", helperText: "Tapez « C-48 » ou « vallée ».", onClear: undefined },
  parameters: {
    docs: {
      description: {
        story: "`filter={false}` : la story simule une requête de 400 ms à chaque frappe, montre `loading` pendant ce temps et renvoie les résultats par `options`.",
      },
    },
  },
  render: function Render(args) {
    const [value, setValue] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<InputDropdownOption[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      const q = query.trim().toLowerCase();
      if (!q) {
        setResults([]);
        return;
      }
      setLoading(true);
      const t = window.setTimeout(() => {
        setResults(COMMANDES.filter((c) => `${c.label} ${c.description}`.toLowerCase().includes(q)));
        setLoading(false);
      }, 400);
      return () => window.clearTimeout(t);
    }, [query]);
    return (
      <div style={{ maxWidth: 420 }}>
        <InputDropdown
          {...args}
          options={results}
          filter={false}
          loading={loading}
          onInputChange={setQuery}
          emptyMessage={query ? "Aucune commande" : "Commencez à taper"}
          value={value}
          onChange={(v, option) => {
            setValue(v);
            args.onChange(v, option);
          }}
        />
      </div>
    );
  },
};

export const WithError: Story = {
  name: "En erreur",
  args: { value: null, label: "Client facturé", error: "Choisissez le client à facturer.", helperText: undefined },
};

export const Small: Story = {
  name: "Petit",
  args: { size: "small", label: "Filtrer par client", helperText: undefined, leadingIcon: <SearchIcon size={14} /> },
};

export const Disabled: Story = {
  name: "Désactivé",
  args: { disabled: true, helperText: "Le client d'une facture émise ne change plus." },
};
