import { Fragment, useState, type MouseEvent } from "react";
import {
  Button,
  ButtonGroup,
  Toolbar,
  FloatingActionButton,
  Input,
  IconButton,
  ColorSwatchButton,
  Toggle,
  SegmentedControl,
  Tabs,
  Tooltip,
  ContextMenu,
  Heading,
  Text,
  Highlight,
  CodeBlock,
  LegendRow,
  LevelGauge,
  FieldGroup,
  Sparkline,
  type ContextMenuItem,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import {
  PlusIcon,
  ArrowRightIcon,
  CheckIcon,
  SettingsIcon,
  TrashIcon,
  RefreshIcon,
  MoreHorizontalIcon,
  CopyIcon,
  PencilIcon,
  SaveIcon,
  BarChartIcon,
  UserIcon,
  CreditCardIcon,
  BellIcon,
  LockIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  UndoIcon,
  RedoIcon,
  LinkIcon,
  SearchIcon,
  FileIcon,
  CalendarIcon,
  UploadCloudIcon,
  CommentIcon,
  type FloatingAction,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { SpecimenScreen, SpecimenGrid, Specimen } from "../../Specimen";

/** Les teintes proposées pour étiqueter un segment client — toutes des variables du thème, pour
 *  que la pastille suive la surface claire comme la sombre. */
const SWATCHES = [
  { id: "accent", label: "Bleu", color: "var(--lq-color-accent)" },
  { id: "green", label: "Vert", color: "var(--lq-color-green)" },
  { id: "amber", label: "Ambre", color: "var(--lq-color-amber)" },
  { id: "rose", label: "Rose", color: "var(--lq-color-rose)" },
  { id: "sky", label: "Ciel", color: "var(--lq-color-sky)" },
  { id: "violet", label: "Violet", color: "var(--lq-color-violet)" },
];

const PERIODS = [
  { value: "7j", label: "7 j" },
  { value: "30j", label: "30 j" },
  { value: "trim", label: "Trimestre" },
  { value: "12m", label: "12 mois" },
] as const;
type Period = (typeof PERIODS)[number]["value"];

const DENSITIES = [
  { value: "compacte", label: "Compacte" },
  { value: "normale", label: "Normale" },
  { value: "aeree", label: "Aérée" },
] as const;
type Density = (typeof DENSITIES)[number]["value"];

const ACCOUNT_TABS = [
  { id: "profil", label: "Profil", icon: <UserIcon size={16} /> },
  { id: "facturation", label: "Facturation", icon: <CreditCardIcon size={16} /> },
  { id: "alertes", label: "Alertes", icon: <BellIcon size={16} /> },
  { id: "securite", label: "Sécurité", icon: <LockIcon size={16} />, disabled: true },
];

const REPORT_TABS = [
  { id: "ventes", label: "Ventes" },
  { id: "clients", label: "Clients" },
  { id: "stocks", label: "Stocks" },
];

const CHANNELS = [
  { label: "Vente directe", value: "48,2 %", color: "var(--lq-color-accent)" },
  { label: "Partenaires", value: "27,5 %", color: "var(--lq-color-sky)" },
  { label: "Place de marché", value: "16,1 %", color: "var(--lq-color-amber)" },
  { label: "Autres", value: "8,2 %", color: "var(--lq-color-text-muted)" },
];

const EXPORT_SNIPPET = `// Commandes payées du mois
const commandes = await api.get("/commandes", {
  statut: "payée",
  mois: "2026-10",
});
const total = commandes.reduce((s, c) => s + c.montant, 0);
console.log(\`\${commandes.length} commandes\`, total);`;

const WEBHOOK_PAYLOAD = `{
  "evenement": "commande.payee",
  "commande": "C-4821",
  "montant": 14400
}`;

const VIEWS = [
  { value: "jour", label: "Jour" },
  { value: "semaine", label: "Semaine" },
  { value: "mois", label: "Mois" },
];

const STYLE_ITEMS = [
  { value: "bold", icon: <BoldIcon size={16} />, ariaLabel: "Gras" },
  { value: "italic", icon: <ItalicIcon size={16} />, ariaLabel: "Italique" },
  { value: "underline", icon: <UnderlineIcon size={16} />, ariaLabel: "Souligné" },
];

const ALIGN_ITEMS = [
  { value: "left", icon: <AlignLeftIcon size={16} />, ariaLabel: "Aligner à gauche" },
  { value: "center", icon: <AlignCenterIcon size={16} />, ariaLabel: "Centrer" },
  { value: "right", icon: <AlignRightIcon size={16} />, ariaLabel: "Aligner à droite" },
];

const FAB_ACTIONS: Omit<FloatingAction, "onSelect">[] = [
  { id: "facture", label: "Nouvelle facture", icon: <FileIcon /> },
  { id: "rdv", label: "Planifier un rendez-vous", icon: <CalendarIcon /> },
  { id: "client", label: "Ajouter un client", icon: <UserIcon /> },
  { id: "import", label: "Importer", icon: <UploadCloudIcon />, disabled: true },
];

/**
 * La planche des primitives : les briques sans lesquelles aucun écran ne se compose — boutons,
 * interrupteurs, onglets, typographie, petits indicateurs.
 *
 * Ce sont les composants que le thème touche le plus visiblement : le kit les dessine à rayon nul
 * et en encre, la couche les reprend dans le bleu du CV, à angles droits eux aussi. Chaque spécimen montre l'état de
 * repos et les deux ou trois variantes qui changent vraiment l'allure — sélectionné, désactivé,
 * petite taille — pas toutes les combinaisons.
 */
export function Primitives() {
  const [swatch, setSwatch] = useState("accent");
  const [alerts, setAlerts] = useState(true);
  const [digest, setDigest] = useState(false);
  const [period, setPeriod] = useState<Period>("30j");
  const [density, setDensity] = useState<Density>("normale");
  const [accountTab, setAccountTab] = useState("profil");
  const [reportTab, setReportTab] = useState("ventes");
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState("semaine");
  const [marks, setMarks] = useState<string[]>(["bold"]);
  const [align, setAlign] = useState("left");
  const [lastFab, setLastFab] = useState<string | null>(null);

  const save = () => {
    setSaving(true);
    window.setTimeout(() => setSaving(false), 1500);
  };

  const menuItems: ContextMenuItem[] = [
    { label: "Modifier la commande", icon: <PencilIcon size={14} />, onSelect: () => setLastAction("Modifier"), hint: "E" },
    { label: "Dupliquer", icon: <CopyIcon size={14} />, onSelect: () => setLastAction("Dupliquer"), hint: "Ctrl+D" },
    { label: "Relancer le client", onSelect: () => setLastAction("Relancer"), disabled: true },
    { separator: true },
    { label: "Supprimer", icon: <TrashIcon size={14} />, onSelect: () => setLastAction("Supprimer") },
  ];

  const openMenuAtButton = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMenu({ x: r.left, y: r.bottom + 4 });
  };

  return (
    <SpecimenScreen
      title="Primitives"
      intro="Boutons, contrôles, onglets, typographie et petits indicateurs du kit, dans le thème."
    >
      <SpecimenGrid>
        <Specimen name="Button" description="Action standard, état sélectionné, icône en tête ou en queue, désactivé, pleine largeur.">
          <div className="rdk-wrap">
            <Button>Annuler</Button>
            <Button selected>Enregistrer</Button>
            <Button icon={<PlusIcon size={16} />}>Nouveau client</Button>
            <Button icon={<ArrowRightIcon size={16} />} iconPosition="trailing">
              Continuer
            </Button>
            <Button disabled>Exporter</Button>
          </div>
          <Button block selected selectedIcon={<CheckIcon size={16} />}>
            Valider la facture
          </Button>
        </Specimen>

        <Specimen name="Button" description="Les tons et les variantes : plein, contour, discret, lien ; et le chargement, qui garde la largeur du bouton.">
          <div className="rdk-wrap">
            <Button tone="primary">Primaire</Button>
            <Button tone="success">Succès</Button>
            <Button tone="info">Info</Button>
            <Button tone="warning">Avertissement</Button>
            <Button tone="danger">Danger</Button>
          </div>
          <div className="rdk-wrap">
            <Button tone="primary" variant="outline">
              Contour
            </Button>
            <Button tone="danger" variant="outline" icon={<TrashIcon size={16} />}>
              Supprimer
            </Button>
            <Button variant="ghost">Discret</Button>
            <Button tone="primary" variant="link">
              Lien
            </Button>
          </div>
          <div className="rdk-wrap">
            <Button tone="primary" loading={saving} loadingLabel="Enregistrement…" onClick={save} icon={<SaveIcon size={16} />}>
              Enregistrer
            </Button>
            <Button tone="success" loading>
              Envoi en cours
            </Button>
          </div>
        </Specimen>

        <Specimen name="ButtonGroup" description="Des boutons accolés : choix unique à libellés, choix multiple à icônes, empilés ou en pleine largeur.">
          <div className="rdk-wrap">
            <ButtonGroup ariaLabel="Vue du planning" items={VIEWS} value={view} onChange={setView} />
            <ButtonGroup ariaLabel="Style du texte" selection="multiple" items={STYLE_ITEMS} value={marks} onChange={setMarks} />
          </div>
          <div className="rdk-wrap rdk-align-start">
            <ButtonGroup orientation="vertical" ariaLabel="Actions sur la commande">
              <Button icon={<PencilIcon size={16} />}>Modifier</Button>
              <Button icon={<CopyIcon size={16} />}>Dupliquer</Button>
              <Button icon={<TrashIcon size={16} />}>Supprimer</Button>
            </ButtonGroup>
            <ButtonGroup size="sm" ariaLabel="Période" items={[...PERIODS]} defaultValue="30j" />
          </div>
          <ButtonGroup block ariaLabel="Vue du planning, pleine largeur" items={VIEWS} value={view} onChange={setView} />
        </Specimen>

        <Specimen name="Toolbar" description="Une barre d'outils : groupes séparés par un filet, action principale à droite, flèches du clavier pour circuler ; puis la version compacte, sans fond." wide>
          <Toolbar
            ariaLabel="Mise en forme"
            start={[
              <Fragment key="history">
                <IconButton icon={<UndoIcon size={18} />} ariaLabel="Annuler" />
                <IconButton icon={<RedoIcon size={18} />} ariaLabel="Rétablir" />
              </Fragment>,
              <ButtonGroup key="style" ariaLabel="Style" selection="multiple" items={STYLE_ITEMS} value={marks} onChange={setMarks} />,
              <ButtonGroup key="align" ariaLabel="Alignement" items={ALIGN_ITEMS} value={align} onChange={setAlign} />,
              <IconButton key="link" icon={<LinkIcon size={18} />} ariaLabel="Insérer un lien" />,
            ]}
            end={
              <Button tone="primary" icon={<SaveIcon size={16} />}>
                Enregistrer
              </Button>
            }
          />
          <Toolbar
            ariaLabel="Commandes"
            density="compact"
            plain
            start={[
              <div key="search" className="rdk-toolbar-search">
                <Input size="small" placeholder="Rechercher une commande" leadingIcon={<SearchIcon size={14} />} aria-label="Rechercher une commande" />
              </div>,
              <Fragment key="actions">
                <IconButton size="sm" icon={<RefreshIcon size={14} />} ariaLabel="Actualiser" />
                <IconButton size="sm" icon={<TrashIcon size={14} />} ariaLabel="Supprimer la sélection" disabled />
              </Fragment>,
            ]}
            end={[
              <Button key="export" variant="outline">Exporter</Button>,
              <Button key="new" tone="primary" icon={<PlusIcon size={14} />}>
                Nouvelle commande
              </Button>,
            ]}
          />
        </Specimen>

        <Specimen name="FloatingActionButton" description="Le bouton flottant, posé dans son cadre : à droite il déploie ses actions, à gauche il agit seul.">
          <div className="rdk-stage">
            <p className="rdk-stage__note">{lastFab ? `Dernière action : ${lastFab}` : "Aucune action choisie."}</p>
            <FloatingActionButton
              ariaLabel="Créer"
              position="absolute"
              actions={FAB_ACTIONS.map((a) => ({ ...a, onSelect: () => setLastFab(a.label) }))}
            />
            <FloatingActionButton
              ariaLabel="Ouvrir la discussion"
              icon={<CommentIcon />}
              tone="success"
              size="sm"
              position="absolute"
              placement="bottom-left"
              onClick={() => setLastFab("Ouvrir la discussion")}
            />
          </div>
        </Specimen>

        <Specimen name="IconButton"description="Action sans libellé — le libellé passe en aria-label. Deux tailles.">
          <div className="rdk-wrap">
            <IconButton icon={<SettingsIcon size={18} />} ariaLabel="Paramètres" />
            <IconButton icon={<RefreshIcon size={18} />} ariaLabel="Actualiser" />
            <IconButton icon={<SaveIcon size={18} />} ariaLabel="Enregistrer" />
            <IconButton icon={<TrashIcon size={18} />} ariaLabel="Supprimer" disabled />
          </div>
          <div className="rdk-wrap">
            <IconButton size="sm" icon={<PencilIcon size={14} />} ariaLabel="Modifier" />
            <IconButton size="sm" icon={<CopyIcon size={14} />} ariaLabel="Copier" />
            <IconButton size="sm" icon={<MoreHorizontalIcon size={14} />} ariaLabel="Plus d'options" />
          </div>
        </Specimen>

        <Specimen name="ColorSwatchButton" description="Choix d'une teinte, ici pour étiqueter un segment client.">
          <div className="rdk-wrap">
            {SWATCHES.map((s) => (
              <ColorSwatchButton key={s.id} label={s.label} color={s.color} selected={swatch === s.id} onClick={() => setSwatch(s.id)} />
            ))}
          </div>
          <Text size="sm" muted>
            Teinte retenue : {SWATCHES.find((s) => s.id === swatch)?.label}
          </Text>
        </Specimen>

        <Specimen name="Toggle" description="Interrupteur binaire : activé, désactivé, et les deux figés.">
          <div className="rdk-stack">
            <div className="rdk-row">
              <Toggle checked={alerts} onChange={setAlerts} ariaLabel="Alertes de paiement" />
              <Text size="sm">Alertes de paiement</Text>
            </div>
            <div className="rdk-row">
              <Toggle checked={digest} onChange={setDigest} ariaLabel="Résumé hebdomadaire" />
              <Text size="sm">Résumé hebdomadaire par courriel</Text>
            </div>
            <div className="rdk-row">
              <Toggle checked disabled ariaLabel="Journal d'audit" />
              <Text size="sm" muted>
                Journal d'audit (imposé par l'administrateur)
              </Text>
            </div>
            <div className="rdk-row">
              <Toggle checked={false} disabled ariaLabel="Accès API" />
              <Text size="sm" muted>
                Accès API (formule supérieure)
              </Text>
            </div>
          </div>
        </Specimen>

        <Specimen name="SegmentedControl" description="Choix exclusif court ; libellé en ligne ou au-dessus.">
          <SegmentedControl label="Période" options={[...PERIODS]} value={period} onChange={setPeriod} />
          <SegmentedControl label="Densité des tableaux" labelPosition="top" options={[...DENSITIES]} value={density} onChange={setDensity} />
        </Specimen>

        <Specimen name="Tabs" description="Onglets horizontaux avec icônes et un onglet désactivé ; orientation verticale.">
          <Tabs items={ACCOUNT_TABS} value={accountTab} onChange={setAccountTab} />
          <div className="rdk-row rdk-row--top">
            <Tabs items={REPORT_TABS} value={reportTab} onChange={setReportTab} orientation="vertical" />
            <Text size="sm" muted>
              Rapport affiché : {REPORT_TABS.find((t) => t.id === reportTab)?.label}
            </Text>
          </div>
        </Specimen>

        <Specimen name="Tooltip" description="Bulle d'aide au survol ou au focus, dans les quatre placements.">
          <div className="rdk-wrap">
            <Tooltip content="Montant hors taxes" placement="top">
              <Button>En haut</Button>
            </Tooltip>
            <Tooltip content="Dernière synchronisation : il y a 4 min" placement="bottom">
              <Button>En bas</Button>
            </Tooltip>
            <Tooltip content="Visible des seuls administrateurs" placement="left">
              <Button>À gauche</Button>
            </Tooltip>
            <Tooltip content="Raccourci : Ctrl+E" placement="right">
              <Button>À droite</Button>
            </Tooltip>
          </div>
        </Specimen>

        <Specimen name="ContextMenu" description="Menu d'actions sur une ligne : clic droit dans la zone, ou bouton « Actions ».">
          <div
            className="rdk-dropzone"
            onContextMenu={(e) => {
              e.preventDefault();
              setMenu({ x: e.clientX, y: e.clientY });
            }}
          >
            <Text size="sm">Commande C-4821 — Lemoine SAS — 14 400 €</Text>
            <Button icon={<MoreHorizontalIcon size={16} />} onClick={openMenuAtButton}>
              Actions
            </Button>
          </div>
          <Text size="sm" muted>
            {lastAction ? `Dernière action : ${lastAction}` : "Clic droit sur la ligne pour ouvrir le menu."}
          </Text>
          {menu ? <ContextMenu x={menu.x} y={menu.y} items={menuItems} onClose={() => setMenu(null)} ariaLabel="Actions sur la commande" /> : null}
        </Specimen>

        <Specimen name="Heading" description="Six niveaux, volontairement courts ; méta à droite et filet en option.">
          <div className="rdk-stack rdk-stack--tight">
            <Heading level={1}>Chiffre d'affaires</Heading>
            <Heading level={2}>Commandes du mois</Heading>
            <Heading level={3}>Clients actifs</Heading>
            <Heading level={4}>Relances en cours</Heading>
            <Heading level={5}>Factures à émettre</Heading>
            <Heading level={6}>Notes internes</Heading>
            <Heading level={3} meta="mis à jour il y a 4 min" divider>
              Activité récente
            </Heading>
          </div>
        </Specimen>

        <Specimen name="Text" description="Corps de texte : cinq tailles, trois graisses, et la variante atténuée.">
          <div className="rdk-stack rdk-stack--tight">
            <Text size="xl" weight="bold">
              80 000 €
            </Text>
            <Text size="lg" weight="medium">
              Revenu récurrent mensuel
            </Text>
            <Text size="md">Le revenu progresse de 12,4 % sur un mois, porté par les abonnements annuels.</Text>
            <Text size="sm" muted>
              Chiffres consolidés au 31 octobre 2026, hors taxes.
            </Text>
            <Text size="xs" muted as="span">
              Source : facturation · export automatique
            </Text>
          </div>
        </Specimen>

        <Specimen name="Highlight" description="Tuile KPI discrète : filet supérieur, intitulé en petites capitales, la valeur au premier plan.">
          <div className="rdk-grid rdk-grid--highlights">
            <Highlight title="Panier moyen">
              <Text size="xl" weight="bold">
                2 580 €
              </Text>
              <Text size="sm" muted>
                +3,8 % sur un mois
              </Text>
              <Sparkline data={[2310, 2380, 2350, 2420, 2470, 2440, 2510, 2580]} width={160} height={32} area />
            </Highlight>
            <Highlight title="Délai de paiement">
              <Text size="xl" weight="bold">
                18 j
              </Text>
              <Text size="sm" muted>
                −2 j sur le trimestre
              </Text>
              <Sparkline data={[24, 23, 22, 22, 21, 20, 19, 18]} width={160} height={32} area />
            </Highlight>
          </div>
        </Specimen>

        <Specimen name="CodeBlock" description="Extrait de code : coloration JavaScript, nom de fichier, numéros de ligne ; ou texte brut.">
          <CodeBlock code={EXPORT_SNIPPET} language="javascript" filename="export-commandes.js" highlight="javascript" showLineNumbers />
          <CodeBlock code={WEBHOOK_PAYLOAD} language="json" filename="webhook.json" />
        </Specimen>

        <Specimen name="LegendRow" description="Ligne de légende : pastille, intitulé, valeur — ici la répartition du chiffre d'affaires.">
          <div className="rdk-stack rdk-stack--tight">
            {CHANNELS.map((c) => (
              <LegendRow key={c.label} color={c.color} label={c.label} value={c.value} />
            ))}
          </div>
        </Specimen>

        <Specimen name="LevelGauge" description="Jauge à segments : taille normale et petite, de vide à plein.">
          <div className="rdk-stack">
            <LevelGauge value={72} label="72 %" ariaLabel="Quota d'utilisateurs" />
            <LevelGauge value={100} label="plein" ariaLabel="Stockage" />
            <LevelGauge value={0} label="aucun" ariaLabel="Incidents ouverts" />
            <LevelGauge value={35} segments={16} size="sm" label="35 %" ariaLabel="Objectif trimestriel" />
          </div>
        </Specimen>

        <Specimen name="FieldGroup" description="Une rangée de contrôles sous un intitulé commun.">
          <FieldGroup label="Exporter le rapport">
            <Button icon={<BarChartIcon size={16} />}>CSV</Button>
            <Button>PDF</Button>
            <Button>Excel</Button>
          </FieldGroup>
          <FieldGroup label="Vue par défaut">
            <SegmentedControl options={[...PERIODS]} value={period} onChange={setPeriod} />
          </FieldGroup>
        </Specimen>
      </SpecimenGrid>
    </SpecimenScreen>
  );
}
