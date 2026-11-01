import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { InvoicePage, Badge, Button, ChevronLeftIcon, type InvoiceLine } from "@michaelthomasjach/liseuse-dashboard-kit";
import { DEMO_INVOICE_LINES } from "../_data/pages";

const LOGO = <strong style={{ fontSize: "1.25rem", letterSpacing: "-0.03em", color: "var(--lq-color-text)" }}>atelier&nbsp;nord</strong>;

const ISSUER = {
  name: "Atelier Nord SAS",
  details: ["12 rue des Tanneurs, 69002 Lyon", "contact@ateliernord.fr · 04 78 00 00 00", "SIRET 812 345 678 00021 · TVA FR12 812345678"],
};

const CLIENT = {
  name: "Lemoine & Associés",
  details: ["À l'attention de Claire Lemoine", "48 quai Saint-Vincent", "69001 Lyon"],
};

const TERMS =
  "Paiement à 30 jours par virement (IBAN FR76 0000 0000 0000 0000 0000 000). En cas de retard, pénalités au taux de trois fois le taux d'intérêt légal et indemnité forfaitaire de 40 € pour frais de recouvrement. Pas d'escompte pour paiement anticipé.";

/**
 * La facture imprimable : une feuille, ses lignes et ses totaux, et une barre d'actions qui disparaît
 * à l'impression.
 */
const meta = {
  title: "Pages/InvoicePage",
  component: InvoicePage,
  parameters: {
    layout: "fullscreen",
    rdkPadding: 0,
    docs: {
      story: { inline: false, iframeHeight: "900px" },
      description: {
        component: [
          "**Facture imprimable** : l'émetteur et son logo, le titre « Facture » et un état éventuel, le client, le numéro et les dates, les lignes (désignation, quantité, prix unitaire, total), puis le sous-total HT, la TVA et le total TTC, des notes et les conditions. Au-dessus de la feuille, « Imprimer » et « Télécharger ».",
          "",
          "**Quand l'utiliser** — l'écran de détail d'une facture, d'un devis ou d'un avoir (changez `title`), dans la zone de contenu d'une coquille ou seul. La page **remplit son conteneur** (`min-height: 100%`) ; `fullHeight` lui donne au moins `100dvh`.",
          "",
          "**Lignes** — `lines` est une liste d'`InvoiceLine` : `description`, `detail` (une précision en petit dessous), `quantity` (décimales permises, formatée à la française), `unit` (« h », « j »), `unitPrice` **hors taxes**, `vatRate` (le taux propre à la ligne) et `id` (clé React). Le total de chaque ligne est calculé.",
          "",
          "**Totaux** — le sous-total HT additionne les lignes ; la TVA est calculée **par taux** sur la somme des lignes de ce taux puis arrondie au centime, une ligne par taux (« TVA 20 % », « TVA 5,5 % ») ; le taux par défaut est `vatRate` (0,2). `vatRate={0}` donne une ligne « TVA 0 % » — pour une facture sans TVA, changez aussi `labels.vat`.",
          "",
          "**Formats** — montants en euros à la française par défaut (`1 234,50 €`) ; `formatMoney` les remplace tous. Dates en `15/10/2026` ; `formatDate` reçoit une `Date`. `issueDate` et `dueDate` acceptent une `Date` ou une chaîne ISO — `\"2026-10-15\"` est lue comme une date **locale**, sans décalage de fuseau. `labels` remplace n'importe quel texte de l'interface (en-têtes, totaux, boutons) : une facture en anglais se fait sans rien d'autre.",
          "",
          "**Actions** — « Imprimer » appelle `onPrint`, par défaut `window.print()` ; `onPrint={null}` retire le bouton. « Télécharger » n'apparaît qu'avec `onDownload` : produire le PDF est votre affaire. `toolbar` pose un contenu libre à gauche (un retour à la liste).",
          "",
          "**Impression** — `@media print` masque la barre d'actions, retire l'ombre, la bordure et les marges de la feuille, et repasse les couleurs à l'encre sur papier blanc **quelle que soit la surface** à l'écran. Les lignes, les totaux et les conditions ne se coupent pas entre deux pages. La coquille autour (barre latérale, en-tête) reste à masquer de votre côté.",
          "",
          "**Accessibilité** — la feuille est un `<article>` nommé « Facture F-… » ; le titre est un `<h1>` ; les références et les totaux sont des listes de définitions ; le tableau a de vrais en-têtes de colonne ; les dates portent un `<time dateTime>`. Sur un conteneur étroit, le tableau défile à l'horizontale.",
          "",
          "**Thème** — `--lq-color-bg`, `--lq-color-panel` (feuille), `--lq-color-panel-border`, `--lq-shadow-panel`, `--lq-radius-lg`, `--lq-color-text`, `--lq-color-text-muted`, `--lq-color-border` (filet sous l'en-tête), `--lq-color-border-subtle` (filets de lignes), `--lq-color-fill` et `--lq-color-accent-contrast` (bandeau du total), `--lq-label-*` (petits titres et en-têtes), `--lq-row-font-size`. Variables optionnelles : `--lq-invoice-max-width` (960 px), `--lq-invoice-sheet-padding` (`--lq-space-6`), `--lq-invoice-title-font` / `-size` / `-weight` / `-tracking`, `--lq-invoice-cell-padding-y`, `--lq-invoice-total-bg` / `-color` — ce thème met le titre en League Spartan 700 de 52 px, serré de −0,01 em, comme le nom en tête du CV.",
        ].join("\n"),
      },
    },
  },
  args: {
    number: "F-2026-0147",
    issueDate: "2026-10-15",
    dueDate: "2026-11-14",
    logo: LOGO,
    issuer: ISSUER,
    client: CLIENT,
    lines: DEMO_INVOICE_LINES,
    notes: "Merci pour votre confiance. Référence de commande : BC-5531.",
    terms: TERMS,
    onDownload: fn(),
  },
  argTypes: {
    number: { control: "text" },
    issueDate: { control: "text" },
    dueDate: { control: "text" },
    title: { control: "text", table: { defaultValue: { summary: '"Facture"' } } },
    vatRate: { control: { type: "number", step: 0.005, min: 0, max: 1 }, table: { defaultValue: { summary: "0.2" } } },
    issuer: { control: "object" },
    client: { control: "object" },
    lines: { control: "object" },
    notes: { control: "text" },
    terms: { control: "text" },
    labels: { control: "object" },
    fullHeight: { control: "boolean", table: { defaultValue: { summary: "false" } } },
    logo: { control: false },
    status: { control: false },
    toolbar: { control: false },
    formatMoney: { control: false },
    formatDate: { control: false },
    onPrint: { control: false, table: { defaultValue: { summary: "() => window.print()" } } },
    onDownload: { control: false },
  },
} satisfies Meta<typeof InvoicePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Une facture complète, en euros. « Imprimer » ouvre la vraie boîte d'impression : l'aperçu montre la feuille seule, sur fond blanc, même en surface sombre." } } },
};

const MIXED_LINES: InvoiceLine[] = [
  { id: "a", description: "Formation « Lire un tableau de bord »", detail: "Session de 7 heures, 8 participants.", quantity: 1, unitPrice: 1800 },
  { id: "b", description: "Support de cours imprimé", quantity: 8, unit: "ex.", unitPrice: 24, vatRate: 0.055 },
  { id: "c", description: "Déplacement", quantity: 1, unitPrice: 96.4 },
];

export const MixedVatRates: Story = {
  name: "Plusieurs taux de TVA, payée",
  args: {
    number: "F-2026-0151",
    issueDate: "2026-10-22",
    dueDate: "2026-10-22",
    lines: MIXED_LINES,
    status: <Badge tone="up">Payée</Badge>,
    toolbar: (
      <Button icon={<ChevronLeftIcon size={16} />} onClick={fn()}>
        Factures
      </Button>
    ),
    notes: undefined,
    terms: undefined,
    onDownload: undefined,
    onPrint: fn(),
  },
  parameters: { docs: { description: { story: "Une ligne à 5,5 % parmi des lignes à 20 % : deux lignes de TVA. `status` pose une pastille sous le titre, `toolbar` un retour à la liste." } } },
};

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export const CustomFormat: Story = {
  name: "Autre devise et autre langue",
  args: {
    title: "Invoice",
    number: "0047",
    issueDate: "2026-09-29",
    dueDate: undefined,
    issuer: { name: "Atelier Nord Inc.", details: ["1600 Market Street, San Francisco, CA"] },
    client: { name: "Northwind Traders", details: ["Seattle, WA"] },
    lines: [
      { id: "x", description: "Character illustration", quantity: 84, unit: "h", unitPrice: 65 },
      { id: "y", description: "Charity branding", quantity: 100, unit: "h", unitPrice: 89 },
    ],
    vatRate: 0,
    formatMoney: (n: number) => usd.format(n),
    formatDate: (d: Date) => usDate.format(d),
    labels: {
      number: "Invoice no.",
      issueDate: "Invoice date",
      billedTo: "Invoice to",
      description: "Description",
      quantity: "Qty",
      unitPrice: "Rate",
      lineTotal: "Total",
      subtotal: "Subtotal",
      vat: "Tax",
      total: "Total due",
      print: "Print",
    },
    notes: undefined,
    terms: undefined,
    onDownload: undefined,
    onPrint: fn(),
  },
  parameters: { docs: { description: { story: "`formatMoney`, `formatDate` et `labels` : la même page en dollars et en anglais. Seule la quantité reste formatée à la française (une virgule décimale)." } } },
};

export const WithoutActions: Story = {
  name: "Sans barre d'actions",
  args: { lines: DEMO_INVOICE_LINES.slice(0, 2), dueDate: undefined, logo: undefined, notes: undefined, onPrint: null, onDownload: undefined },
  parameters: { docs: { description: { story: "`onPrint={null}` et pas d'`onDownload` : la barre disparaît, il ne reste que la feuille. Sans `dueDate`, la ligne d'échéance n'est pas affichée." } } },
};

export const InFrame: Story = {
  name: "Dans un cadre étroit",
  render: (args) => (
    <div style={{ padding: 30 }}>
      <div style={{ width: 480, height: 640, overflow: "auto", border: "1px solid var(--lq-color-border)" }}>
        <InvoicePage {...args} />
      </div>
    </div>
  ),
  parameters: { docs: { description: { story: "Dans un conteneur de 480 px (et non une fenêtre étroite : la page lit la largeur de son conteneur), le titre et les références passent à gauche, la feuille resserre ses marges et le tableau défile à l'horizontale." } } },
};
