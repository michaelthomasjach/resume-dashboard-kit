import { useState } from "react";
import { Button, PriceChangeTag, Badge, Avatar, Breadcrumbs, DataTable, type DataTableColumn } from "@michaelthomasjach/liseuse-dashboard-kit";
import { StatCard, HighlightStatCard, HoldingCard, ComparisonCard, GaugeCard, UserMenu } from "@michaelthomasjach/liseuse-dashboard-kit";
import { Notification, NotificationProvider, useNotification } from "@michaelthomasjach/liseuse-dashboard-kit";
import { PortfolioSummaryWidget, WatchlistWidget, MarketMoversWidget } from "@michaelthomasjach/liseuse-dashboard-kit";
import { UserIcon, SettingsIcon, BellIcon, LogoutIcon } from "@michaelthomasjach/liseuse-dashboard-kit";
import { SpecimenScreen, SpecimenGrid, Specimen } from "../../Specimen";
import { HOLDINGS, GAINERS, LOSERS, PORTFOLIO_HISTORY, REVENUE_TREND, SIGNUPS_TREND, CHURN_TREND, type Holding } from "../../demoData";

const euro = (n: number, digits = 0) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: digits, maximumFractionDigits: digits });
const price = (n: number) => euro(n, 2);
/** Le format par défaut des écarts du kit écrit « 12.40 % » ; partout où une prop l'ouvre, on le
 *  remet à la française. */
const pct = (n: number) => `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;

const POSITIONS: DataTableColumn<Holding>[] = [
  { id: "symbol", header: "Titre", accessor: (h) => h.symbol, sortValue: (h) => h.symbol, width: "6rem" },
  { id: "name", header: "Société", accessor: (h) => h.name, sortValue: (h) => h.name },
  { id: "quantity", header: "Quantité", accessor: (h) => h.quantity, sortValue: (h) => h.quantity, align: "right" },
  { id: "price", header: "Cours", accessor: (h) => price(h.price), sortValue: (h) => h.price, align: "right" },
  { id: "value", header: "Valorisation", accessor: (h) => euro(h.price * h.quantity), sortValue: (h) => h.price * h.quantity, align: "right" },
  { id: "change", header: "Séance", accessor: (h) => <PriceChangeTag value={h.change} format={pct} />, sortValue: (h) => h.change, align: "right", width: "7rem" },
];

const RISK_BANDS = [
  { upTo: 33, color: "var(--lq-color-up)" },
  { upTo: 66, color: "var(--lq-color-warning)" },
  { upTo: 100, color: "var(--lq-color-down)" },
];

const ACCOUNT_ITEMS = [
  { id: "profil", label: "Mon profil", icon: <UserIcon size={16} /> },
  { id: "alertes", label: "Alertes", icon: <BellIcon size={16} /> },
  {
    id: "reglages",
    label: "Réglages",
    icon: <SettingsIcon size={16} />,
    children: [
      { id: "equipe", label: "Équipe" },
      { id: "facturation", label: "Facturation" },
      { id: "api", label: "Clés d'API" },
    ],
  },
  { id: "sortie", label: "Se déconnecter", icon: <LogoutIcon size={16} />, danger: true },
];

/** Le notificateur ne vit que sous son provider : d'où ce petit composant, monté à l'intérieur. */
function QueuedNotifications() {
  const { notify } = useNotification();
  return (
    <div className="rdk-wrap">
      <Button onClick={() => notify({ tone: "success", title: "Virement reçu", description: "14 400,00 € de Lemoine SAS." })}>
        Succès, coin bas-droit
      </Button>
      <Button
        onClick={() =>
          notify({ tone: "info", title: "Relevé d'octobre disponible", corner: "top-right", autoDismissMs: 5000, meta: "09:42" })
        }
      >
        Information, coin haut-droit
      </Button>
      <Button
        onClick={() =>
          notify({
            variant: "bar",
            tone: "warning",
            title: "Rapprochement bancaire en retard",
            description: "Trois relevés n'ont pas été importés depuis lundi.",
            autoDismissMs: 0,
          })
        }
      >
        Avertissement, barre
      </Button>
    </div>
  );
}

/**
 * La planche des composants financiers : ce que le kit sait dire d'un chiffre — sa valeur, son
 * écart, son seuil — et les widgets prêts à poser qui les assemblent.
 *
 * Les tons vert/rouge viennent des variables `--lq-color-up` / `--lq-color-down` du thème ; c'est
 * ici qu'on vérifie qu'ils restent lisibles à côté de l'unique accent, le bleu du CV, sur les deux surfaces.
 */
export function Finance() {
  const [bannerOpen, setBannerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <SpecimenScreen
      title="Finance"
      intro="Valeurs, écarts, positions et widgets de portefeuille — les composants du kit qui portent un chiffre."
    >
      <SpecimenGrid>
        <Specimen name="Badge" description="Pastille de statut, en cinq tons.">
          <div className="rdk-wrap">
            <Badge>brouillon</Badge>
            <Badge tone="up">payée</Badge>
            <Badge tone="down">annulée</Badge>
            <Badge tone="warning">en attente</Badge>
            <Badge tone="info">relancée</Badge>
          </div>
        </Specimen>

        <Specimen name="PriceChangeTag" description="Écart signé : hausse, baisse, nul, format libre, sans flèche.">
          <div className="rdk-wrap">
            <PriceChangeTag value={12.4} format={pct} />
            <PriceChangeTag value={-6.1} format={pct} />
            <PriceChangeTag value={0} format={pct} />
            <PriceChangeTag value={35} format={(v) => `${v} pts`} />
            <PriceChangeTag value={-1.2} format={pct} showIcon={false} />
          </div>
        </Specimen>

        <Specimen name="StatCard" description="Tuile d'indicateur : valeur, écart, légende, courbe." wide>
          <div className="rdk-grid rdk-grid--stats">
            <StatCard label="Revenu mensuel" value={euro(80000)} delta={12.4} deltaFormat={pct} caption="vs. mois précédent" sparklineData={REVENUE_TREND} />
            <StatCard label="Nouveaux clients" value="31" delta={-6.1} deltaFormat={pct} caption="vs. mois précédent" sparklineData={SIGNUPS_TREND} />
            <StatCard label="Attrition" value="4,0 %" delta={-1.2} deltaFormat={pct} sparklineData={CHURN_TREND} />
            <StatCard label="Factures ouvertes" value="17" icon={<BellIcon size={18} />} caption="dont 4 échues" />
          </div>
        </Specimen>

        <Specimen name="HighlightStatCard" description="Chiffre isolé, sans cadre ni pastille : un record, un plus haut.">
          <div className="rdk-grid rdk-grid--stats">
            <HighlightStatCard label="Plus haut sur 12 mois" value={euro(80000)} subtext="atteint en octobre" sparklineData={REVENUE_TREND} />
            <HighlightStatCard label="Délai moyen de paiement" value="23 j" subtext="3 jours de moins qu'en septembre" />
          </div>
        </Specimen>

        <Specimen name="HoldingCard" description="Une position sur une ligne ; cliquable si `onClick` est fourni.">
          <div className="rdk-stack">
            {HOLDINGS.slice(0, 3).map((h) => (
              <HoldingCard key={h.id} {...h} formatPrice={price} onClick={() => setSelected(h.id)} />
            ))}
            <HoldingCard symbol="OR" name="L'Oréal" price={371.9} change={0.12} formatPrice={price} />
          </div>
        </Specimen>

        <Specimen name="ComparisonCard" description="Deux chiffres face à face : portefeuille et indice, ce mois-ci et le précédent.">
          <div className="rdk-stack">
            <ComparisonCard
              title="Performance"
              meta="depuis le 1er janvier"
              primary={{ label: "Portefeuille", value: "+14,2 %", delta: 14.2 }}
              secondary={{ label: "CAC 40", value: "+6,8 %", delta: 6.8 }}
            />
            <ComparisonCard
              title="Encaissements"
              primary={{ label: "Octobre", value: euro(79880) }}
              secondary={{ label: "Septembre", value: euro(71200) }}
            />
          </div>
        </Specimen>

        <Specimen name="GaugeCard" description="Une jauge dans une carte, avec ou sans bandes de seuil.">
          <div className="rdk-grid rdk-grid--stats">
            <GaugeCard
              title="Score de risque"
              meta="Modéré"
              description="Volatilité et concentration du portefeuille."
              value={58}
              thresholds={RISK_BANDS}
            />
            <GaugeCard title="Objectif trimestriel" value={72} formatValue={(v) => `${v} %`} description="72 % des 300 k€ visés." />
          </div>
        </Specimen>

        <Specimen name="Avatar" description="Initiales tirées du nom, à plusieurs tailles.">
          <div className="rdk-wrap">
            <Avatar name="Claire Lemoine" size={24} />
            <Avatar name="Hugo Mercier" size={32} />
            <Avatar name="Inès Roux" size={40} />
            <Avatar name="Paul Vallée" size={56} />
          </div>
        </Specimen>

        <Specimen name="Breadcrumbs" description="Fil d'Ariane ; le dernier élément est la page courante.">
          <Breadcrumbs
            items={[
              { id: "accueil", label: "Accueil", onClick: () => undefined },
              { id: "tresorerie", label: "Trésorerie", onClick: () => undefined },
              { id: "placements", label: "Placements", onClick: () => undefined },
              { id: "mc", label: "LVMH" },
            ]}
          />
        </Specimen>

        <Specimen name="UserMenu" description="Le compte connecté et son menu, avec un sous-menu et une action destructive.">
          <div className="rdk-row">
            <UserMenu name="Claire Lemoine" subtitle="Directrice financière" items={ACCOUNT_ITEMS} />
          </div>
        </Specimen>

        <Specimen name="DataTable" description="Tableau triable — cliquer un en-tête ; les écarts sont des `PriceChangeTag`." wide>
          <DataTable columns={POSITIONS} rows={HOLDINGS} rowKey={(h) => h.id} onRowClick={(h) => setSelected(h.id)} />
          {selected ? <Badge tone="info">Ligne choisie : {HOLDINGS.find((h) => h.id === selected)?.name}</Badge> : null}
        </Specimen>

        <Specimen name="Notification" description="Autonome et contrôlée : une popin de coin, ou une modale qu'on ferme soi-même.">
          <div className="rdk-wrap">
            <Button onClick={() => setBannerOpen(true)}>Popin de coin</Button>
            <Button onClick={() => setModalOpen(true)}>Modale</Button>
          </div>
          <Notification
            open={bannerOpen}
            onClose={() => setBannerOpen(false)}
            corner="bottom-left"
            tone="success"
            title="Export terminé"
            description="Le grand livre d'octobre est prêt à télécharger."
            autoDismissMs={6000}
          />
          <Notification
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            variant="modal"
            tone="error"
            title="Prélèvement rejeté"
            description="La banque de Studio Bélier a refusé le prélèvement de 2 880,00 €."
            actions={<Button onClick={() => setModalOpen(false)}>Compris</Button>}
          />
        </Specimen>

        <Specimen name="NotificationProvider · useNotification" description="Une file : chaque appel à `notify` empile une notification.">
          <NotificationProvider>
            <QueuedNotifications />
          </NotificationProvider>
        </Specimen>

        <Specimen name="PortfolioSummaryWidget" description="Valeur, écart et historique zoomable, prêts à poser." wide>
          <PortfolioSummaryWidget
            title="Portefeuille de trésorerie"
            meta="90 derniers jours"
            value={euro(PORTFOLIO_HISTORY[PORTFOLIO_HISTORY.length - 1].y)}
            delta={8.9}
            series={PORTFOLIO_HISTORY}
            formatY={(v) => `${Math.round(v / 1000)} k€`}
            formatX={(d) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
            xType="time"
          />
        </Specimen>

        <Specimen name="WatchlistWidget" description="Une liste de `HoldingCard` sous un titre ; vide, elle le dit.">
          <WatchlistWidget title="Liste de surveillance" items={HOLDINGS.map((h) => ({ ...h, formatPrice: price }))} onSelect={setSelected} />
          <WatchlistWidget title="Valeurs suivies par l'équipe" items={[]} emptyMessage="Aucune valeur suivie pour l'instant." />
        </Specimen>

        <Specimen name="MarketMoversWidget" description="Plus fortes hausses et baisses de la séance, en onglets.">
          <MarketMoversWidget title="Variations du jour" gainers={GAINERS} losers={LOSERS} />
        </Specimen>
      </SpecimenGrid>
    </SpecimenScreen>
  );
}
