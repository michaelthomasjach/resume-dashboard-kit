import { useState } from "react";
import {
  Panel,
  PanelCollapse,
  PanelRow,
  Card,
  ExpandableCard,
  TabbedCard,
  Modal,
  Jumbotron,
  Carousel,
  TreeView,
  Testimonial,
  QuoteMark,
  PeriodTable,
  Button,
  Toggle,
  Text,
  Badge,
  Input,
  type TreeNode,
  type PeriodTableColumn,
  type PeriodTableRow,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { FolderIcon, FileIcon, UserIcon, SettingsIcon, BellIcon, ArrowRightIcon } from "@michaelthomasjach/liseuse-dashboard-kit";
import { SpecimenScreen, SpecimenGrid, Specimen } from "../../Specimen";

const DOCUMENTS: TreeNode[] = [
  {
    id: "clients",
    label: "Clients",
    icon: <FolderIcon size={16} />,
    children: [
      {
        id: "lemoine",
        label: "Lemoine SAS",
        icon: <FolderIcon size={16} />,
        children: [
          { id: "lemoine-contrat", label: "Contrat-cadre 2026.pdf", icon: <FileIcon size={16} /> },
          { id: "lemoine-factures", label: "Factures T3.zip", icon: <FileIcon size={16} /> },
        ],
      },
      {
        id: "vallee",
        label: "Groupe Vallée",
        icon: <FolderIcon size={16} />,
        children: [{ id: "vallee-devis", label: "Devis D-0193.pdf", icon: <FileIcon size={16} /> }],
      },
    ],
  },
  {
    id: "compta",
    label: "Comptabilité",
    icon: <FolderIcon size={16} />,
    children: [
      { id: "compta-grand-livre", label: "Grand livre 2026.xlsx", icon: <FileIcon size={16} /> },
      { id: "compta-archives", label: "Archives 2024", icon: <FolderIcon size={16} />, disabled: true },
    ],
  },
  { id: "cgv", label: "CGV en vigueur.pdf", icon: <FileIcon size={16} /> },
];

/** Le même classement sans icône posée : `showIcons` y dessine dossiers et fichiers d'après la
 *  présence d'enfants. « Archives » se charge à la première ouverture (`hasChildren` sans enfants). */
const DOSSIERS: TreeNode[] = [
  {
    id: "d-clients",
    label: "Clients",
    children: [
      {
        id: "d-lemoine",
        label: "Lemoine SAS",
        children: [
          { id: "d-lemoine-contrat", label: "Contrat-cadre 2026.pdf" },
          { id: "d-lemoine-tva", label: "Attestation TVA.pdf" },
          { id: "d-lemoine-factures", label: "Factures T3.zip" },
        ],
      },
      {
        id: "d-vallee",
        label: "Groupe Vallée",
        children: [
          { id: "d-vallee-devis", label: "Devis D-0193.pdf" },
          { id: "d-vallee-bon", label: "Bon de commande.pdf" },
        ],
      },
    ],
  },
  {
    id: "d-compta",
    label: "Comptabilité",
    children: [
      { id: "d-compta-grand-livre", label: "Grand livre 2026.xlsx" },
      { id: "d-compta-tva", label: "Déclarations TVA", children: [{ id: "d-compta-tva-t3", label: "TVA T3 2026.pdf" }] },
    ],
  },
  { id: "d-archives", label: "Archives", hasChildren: true },
];

/** Le chargement paresseux d'« Archives » : une demi-seconde, puis trois années. */
const loadArchives = (node: TreeNode) =>
  new Promise<TreeNode[]>((resolve) =>
    window.setTimeout(
      () => resolve(["2023", "2024", "2025"].map((year) => ({ id: `${node.id}-${year}`, label: `Exercice ${year}.zip` }))),
      500,
    ),
  );

/** Les quatre derniers trimestres, plus récents à droite, comme se lit un compte de résultat. */
const QUARTERS: PeriodTableColumn[] = [
  { key: "label", label: "", sticky: true, align: "left", width: 220 },
  { key: "t4-25", label: "T4 2025", sublabel: "oct.–déc." },
  { key: "t1-26", label: "T1 2026", sublabel: "janv.–mars" },
  { key: "t2-26", label: "T2 2026", sublabel: "avr.–juin" },
  { key: "t3-26", label: "T3 2026", sublabel: "juil.–sept." },
];

const QUARTER_KEYS = ["t4-25", "t1-26", "t2-26", "t3-26"];

const keur = (n: number) => `${n.toLocaleString("fr-FR")} k€`;

/** Une ligne de montants trimestriels, chaque cellule portant sa variation sur le trimestre
 *  précédent — sauf la première, qui n'a rien à quoi se comparer. `cost` inverse le ton : une
 *  charge qui monte est une mauvaise nouvelle. */
function quarterCells(values: number[], cost = false) {
  return Object.fromEntries(
    QUARTER_KEYS.map((k, i) => {
      const prev = values[i - 1];
      if (prev === undefined) return [k, { value: keur(values[i]) }];
      const pct = ((values[i] - prev) / Math.abs(prev)) * 100;
      return [
        k,
        {
          value: keur(values[i]),
          note: `${pct >= 0 ? "+" : ""}${pct.toFixed(1).replace(".", ",")} %`,
          tone: pct >= 0 !== cost ? ("up" as const) : ("down" as const),
        },
      ];
    })
  );
}

const REVENUE_ROWS: PeriodTableRow[] = [
  {
    key: "ca",
    label: "Chiffre d'affaires",
    emphasis: true,
    cells: quarterCells([212, 228, 241, 263]),
    children: [
      {
        key: "abonnements",
        label: "Abonnements",
        cells: quarterCells([158, 171, 184, 199]),
        children: [
          { key: "annuels", label: "Annuels", cells: quarterCells([121, 133, 145, 158]) },
          { key: "mensuels", label: "Mensuels", cells: quarterCells([37, 38, 39, 41]) },
        ],
      },
      { key: "licences", label: "Licences poste", cells: quarterCells([34, 33, 31, 35]) },
      { key: "modules", label: "Modules analytiques", cells: quarterCells([20, 24, 26, 29]) },
    ],
  },
  {
    key: "charges",
    label: "Charges d'exploitation",
    emphasis: true,
    cells: quarterCells([176, 181, 187, 192], true),
    children: [
      { key: "salaires", label: "Masse salariale", cells: quarterCells([118, 121, 124, 126], true) },
      { key: "hebergement", label: "Hébergement", cells: quarterCells([22, 23, 25, 26], true) },
      { key: "marketing", label: "Marketing", cells: quarterCells([36, 37, 38, 40], true) },
    ],
  },
];

/**
 * La planche des conteneurs : tout ce qui encadre, range ou superpose du contenu — panneaux,
 * cartes, fenêtre modale, bannière, carrousel, arborescence, citation, tableau par période.
 *
 * C'est là que le thème change le plus l'allure d'ensemble : le kit pose des boîtes à angles vifs
 * et sans ombre ; la couche les garde à angles droits, comme le CV, et les détache du papier par
 * un souffle d'ombre. Rien n'est enveloppé localement — chaque spécimen est le composant du kit tel
 * qu'un écran l'emploierait.
 */
export function Containers() {
  const [maintenance, setMaintenance] = useState(false);
  const [fold, setFold] = useState<string | null>("facturation");
  const [modal, setModal] = useState<"default" | "wide" | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>("lemoine-contrat");
  const [lastRow, setLastRow] = useState<string | null>(null);
  const [checkedDocs, setCheckedDocs] = useState<string[]>(["d-lemoine-contrat", "d-lemoine-tva"]);
  const [treeQuery, setTreeQuery] = useState("tva");
  const [treeLog, setTreeLog] = useState("Clic droit sur un nœud pour ses actions.");
  const [refreshedAt, setRefreshedAt] = useState("09:12");

  const refresh = () =>
    new Promise<void>((resolve) =>
      window.setTimeout(() => {
        setRefreshedAt("09:13");
        resolve();
      }, 900),
    );

  const foldProps = (id: string) => ({ open: fold === id, onOpenChange: (o: boolean) => setFold(o ? id : null) });

  return (
    <SpecimenScreen
      title="Conteneurs"
      intro="Panneaux, cartes, fenêtres et autres cadres du kit, dans le thème."
    >
      <SpecimenGrid>
        <Specimen name="Panel · PanelRow" description="Le panneau à lignes : intitulé, méta, lignes libellé / valeur ou libellé / contrôle, pied.">
          <Panel title="Serveur de production" meta="eu-west-3" footer={<Button>Voir les journaux</Button>}>
            <PanelRow label="Disponibilité" value="99,98 %" />
            <PanelRow label="Temps de réponse" value="182 ms" />
            <PanelRow label="Dernier déploiement" value="il y a 2 h" />
            <PanelRow label="Mode maintenance">
              <Toggle checked={maintenance} onChange={setMaintenance} ariaLabel="Mode maintenance" />
            </PanelRow>
            <PanelRow label="Incidents ouverts" value="2" onClick={() => setLastRow("Incidents ouverts")} />
          </Panel>
          {lastRow ? (
            <Text size="sm" muted>
              Ligne cliquée : {lastRow}
            </Text>
          ) : null}
        </Specimen>

        <Specimen name="Panel" description="Le même panneau, repliable par sa prop collapsible : l'un ouvert, l'autre fermé.">
          <Panel title="Filtres actifs" meta="3" collapsible defaultOpen>
            <PanelRow label="Statut" value="payée" />
            <PanelRow label="Période" value="octobre 2026" />
            <PanelRow label="Montant" value="> 1 000 €" />
          </Panel>
          <Panel title="Colonnes masquées" meta="2" collapsible defaultOpen={false}>
            <PanelRow label="Référence interne" value="masquée" />
            <PanelRow label="Commercial" value="masquée" />
          </Panel>
        </Specimen>

        <Specimen name="PanelCollapse" description="Rend repliables des panneaux tout faits — ici en accordéon, un seul ouvert à la fois.">
          <PanelCollapse {...foldProps("compte")}>
            <Panel title="Compte">
              <PanelRow label="Raison sociale" value="Lemoine SAS" />
              <PanelRow label="SIRET" value="812 345 678 00019" />
            </Panel>
          </PanelCollapse>
          <PanelCollapse {...foldProps("facturation")}>
            <Panel title="Facturation" meta="annuelle">
              <PanelRow label="Formule" value="Équipe — 12 postes" />
              <PanelRow label="Prochaine échéance" value="1er janv. 2027" />
              <PanelRow label="Moyen de paiement" value="Prélèvement SEPA" />
            </Panel>
          </PanelCollapse>
          <PanelCollapse {...foldProps("contacts")}>
            <Panel title="Contacts" meta="2">
              <PanelRow label="Comptabilité" value="compta@lemoine.fr" />
              <PanelRow label="Technique" value="it@lemoine.fr" />
            </Panel>
          </PanelCollapse>
        </Specimen>

        <Specimen name="Card" description="La carte de section : intitulé, méta, résumé, pied ; et la variante sans cadre.">
          <Card
            title="Abonnements à renouveler"
            meta="novembre"
            summary="7 contrats arrivent à échéance dans les 30 jours."
            footer={<Button icon={<ArrowRightIcon size={16} />} iconPosition="trailing">Ouvrir la liste</Button>}
          >
            <PanelRow label="Lemoine SAS" value="14 400 €" />
            <PanelRow label="Cabinet Roux" value="6 000 €" />
            <PanelRow label="Groupe Vallée" value="48 000 €" />
          </Card>
          <Card title="Carte sans cadre" bare>
            <Text size="sm" muted>
              La variante bare retire bordure et fond, pour une carte posée dans une cellule déjà encadrée.
            </Text>
          </Card>
        </Specimen>

        <Specimen name="Card" description="Le plein écran (maximizable) : le bouton de l'en-tête, ou Échap, détache la carte puis la rend à sa place ; ici avec l'actualisation (onRefresh).">
          <Card
            title="Encaissements du jour"
            meta={`mis à jour à ${refreshedAt}`}
            maximizable
            onRefresh={refresh}
            footer={<Text size="sm" muted>Trois virements attendus avant 17 h.</Text>}
          >
            <PanelRow label="Lemoine SAS" value="14 400 €" />
            <PanelRow label="Cabinet Roux" value="6 000 €" />
            <PanelRow label="Groupe Vallée" value="48 000 €" />
            <PanelRow label="Atelier Nord" value="2 350 €" />
          </Card>
        </Specimen>

        <Specimen name="ExpandableCard"description="Carte dont le corps se replie derrière son en-tête ; fermée puis ouverte.">
          <ExpandableCard title="Détail de la facture F-2026-0412" meta="14 400 €">
            <PanelRow label="Abonnement annuel × 12" value="12 000 €" />
            <PanelRow label="TVA 20 %" value="2 400 €" />
          </ExpandableCard>
          <ExpandableCard title="Historique des relances" meta="3" defaultOpen>
            <PanelRow label="12 oct." value="courriel" />
            <PanelRow label="19 oct." value="courriel" />
            <PanelRow label="26 oct." value="appel" />
          </ExpandableCard>
        </Specimen>

        <Specimen name="TabbedCard" description="Carte à onglets, horizontale ou verticale.">
          <TabbedCard
            title="Client"
            tabs={[
              {
                id: "commandes",
                label: "Commandes",
                content: (
                  <>
                    <PanelRow label="C-4821" value="14 400 €" />
                    <PanelRow label="C-4796" value="2 400 €" />
                  </>
                ),
              },
              { id: "tickets", label: "Tickets", content: <PanelRow label="Aucun ticket ouvert" value="—" /> },
              { id: "notes", label: "Notes", content: <Text size="sm">Client historique, renouvelle chaque année en décembre.</Text> },
            ]}
          />
          <TabbedCard
            orientation="vertical"
            title="Paramètres"
            tabs={[
              {
                id: "general",
                label: "Général",
                icon: <SettingsIcon size={16} />,
                content: (
                  <>
                    <PanelRow label="Langue" value="Français" />
                    <PanelRow label="Fuseau" value="Europe/Paris" />
                  </>
                ),
              },
              { id: "equipe", label: "Équipe", icon: <UserIcon size={16} />, content: <PanelRow label="Membres" value="12" /> },
              { id: "alertes", label: "Alertes", icon: <BellIcon size={16} />, content: <PanelRow label="Canal" value="Courriel" /> },
            ]}
          />
        </Specimen>

        <Specimen name="Modal" description="Fenêtre modale : taille par défaut ou large, pied personnalisé.">
          <div className="rdk-wrap">
            <Button selected onClick={() => setModal("default")}>
              Accorder une remise
            </Button>
            <Button onClick={() => setModal("wide")}>Voir le client (large)</Button>
          </div>
          <Modal
            open={modal === "default"}
            onClose={() => setModal(null)}
            title="Accorder une remise"
            footer={
              <div className="rdk-row">
                <Button onClick={() => setModal(null)}>Annuler</Button>
                <Button selected onClick={() => setModal(null)}>
                  Confirmer
                </Button>
              </div>
            }
          >
            <Text size="sm">Une remise de 10 % sera appliquée à la prochaine facture de Lemoine SAS.</Text>
            <PanelRow label="Montant actuel" value="14 400 €" />
            <PanelRow label="Après remise" value="12 960 €" />
          </Modal>
          <Modal open={modal === "wide"} onClose={() => setModal(null)} title="Lemoine SAS" size="wide">
            <PanelRow label="Client depuis" value="mars 2021" />
            <PanelRow label="Chiffre d'affaires cumulé" value="68 200 €" />
            <PanelRow label="Statut" value={<Badge tone="up">à jour</Badge>} />
          </Modal>
        </Specimen>

        <Specimen name="TreeView" description="Arborescence dépliable avec sélection ; un nœud désactivé.">
          <TreeView nodes={DOCUMENTS} selectedId={selectedDoc} onSelect={setSelectedDoc} defaultExpandedIds={["clients", "lemoine", "compta"]} />
        </Specimen>

        <Specimen name="TreeView" description="Cases à cocher (un parent partiel est indéterminé), icônes de dossier et de fichier, filets de guidage, menu au clic droit, et « Archives » chargé à l'ouverture.">
          <TreeView
            nodes={DOSSIERS}
            checkable
            checkedIds={checkedDocs}
            onCheckedChange={setCheckedDocs}
            showIcons
            showGuides
            defaultExpandedIds={["d-clients", "d-lemoine"]}
            loadChildren={loadArchives}
            contextMenu={(node) => [
              { label: "Ouvrir", hint: "Entrée", onSelect: () => setTreeLog(`Ouvrir « ${node.label} »`) },
              { label: "Renommer", hint: "F2", onSelect: () => setTreeLog(`Renommer « ${node.label} »`) },
              { label: "Télécharger", disabled: Boolean(node.children), onSelect: () => setTreeLog(`Télécharger « ${node.label} »`) },
              { separator: true },
              { label: "Supprimer", onSelect: () => setTreeLog(`Supprimer « ${node.label} »`) },
            ]}
            ariaLabel="Documents à envoyer"
          />
          <Text size="sm" muted>
            {checkedDocs.length} document{checkedDocs.length > 1 ? "s" : ""} coché{checkedDocs.length > 1 ? "s" : ""} · {treeLog}
          </Text>
        </Specimen>

        <Specimen name="TreeView" description="Le filtre : les ancêtres des nœuds trouvés se déplient seuls et la partie trouvée est surlignée ; ici en densité compacte.">
          <Input size="small" placeholder="Filtrer, par exemple « tva » ou « vallee »" value={treeQuery} onChange={(e) => setTreeQuery(e.target.value)} aria-label="Filtrer les documents" />
          <TreeView nodes={DOSSIERS} filter={treeQuery} filterEmptyMessage="Aucun document ne correspond." showIcons density="compact" ariaLabel="Documents filtrés" />
        </Specimen>

        <Specimen name="Jumbotron" description="Bannière d'accueil : ton par défaut puis ton accent." wide>
          <Jumbotron
            eyebrow="Nouveau"
            title="Les rapports planifiés arrivent"
            description="Recevez chaque lundi le récapitulatif des ventes de la semaine, au format PDF ou CSV."
            actions={
              <div className="rdk-row">
                <Button selected>Planifier un rapport</Button>
                <Button>En savoir plus</Button>
              </div>
            }
          />
          <Jumbotron
            tone="accent"
            eyebrow="Configuration"
            title="Terminez la mise en place de votre espace"
            description="Encore deux étapes : inviter votre équipe et relier votre compte bancaire."
            actions={<Button>Continuer</Button>}
          />
        </Specimen>

        <Specimen name="Carousel" description="Défilement de diapositives avec flèches et points ; ici des Jumbotron." wide>
          <Carousel height={240}>
            <Jumbotron
              eyebrow="Octobre"
              title="80 000 € de revenu mensuel"
              description="Un record, porté par les abonnements annuels (+12,4 % sur un mois)."
            />
            <Jumbotron
              tone="accent"
              eyebrow="Équipe"
              title="Trois nouveaux comptes cette semaine"
              description="Groupe Vallée, Cabinet Roux et Ferme du Pré ont rejoint la plateforme."
            />
            <Jumbotron eyebrow="Maintenance" title="Mise à jour prévue dimanche à 6 h" description="Coupure estimée à dix minutes." />
          </Carousel>
        </Specimen>

        <Specimen name="Testimonial · QuoteMark" description="Citation encadrée avec note et mots mis en avant ; variantes italique et encadré latéral." wide>
          <div className="rdk-grid rdk-grid--forms">
            <Testimonial
              quote="Depuis le passage au tableau de bord, la clôture mensuelle nous prend une demi-journée au lieu de trois."
              highlight="une demi-journée"
              name="Claire Lemoine"
              role="Directrice financière, Lemoine SAS"
              rating={5}
            />
            <div className="rdk-stack">
              <Testimonial variant="italic" quote="Le meilleur indicateur, c'est celui qu'on regarde vraiment." name="Hugo Mercier" role="Mercier & Fils" />
              <Testimonial
                variant="callout"
                quote={
                  <>
                    Trois mois après la bascule, le délai de paiement moyen est passé de 31 à <QuoteMark>18 jours</QuoteMark>.
                  </>
                }
              />
            </div>
          </div>
        </Specimen>

        <Specimen name="PeriodTable" description="Tableau par période : colonne d'intitulés figée, lignes imbriquées repliables, variation sous chaque montant." wide>
          <PeriodTable columns={QUARTERS} rows={REVENUE_ROWS} defaultExpandedDepth={1} caption="Compte de résultat simplifié par trimestre" />
        </Specimen>
      </SpecimenGrid>
    </SpecimenScreen>
  );
}
