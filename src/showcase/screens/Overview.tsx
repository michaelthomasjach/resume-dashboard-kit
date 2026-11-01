import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Avatar,
  BarChart,
  Card,
  ChevronDownIcon,
  CloudIcon,
  CloudRainIcon,
  CommentIcon,
  DataTable,
  DotMap,
  LineAreaChart,
  LiveTile,
  PanelRow,
  PartlyCloudyIcon,
  ProgressBar,
  SegmentedControl,
  Sparkline,
  StarIcon,
  SunIcon,
  Tabs,
  Toggle,
  type DataTableColumn,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { EXPLORE_ART, NEWS_ART } from "../dashboardArt";
import {
  GEO_MARKERS,
  HOURLY,
  PAGE_VIEWS,
  PRODUCT_REVENUE,
  QUOTES,
  SERIES,
  STOCK_BARS,
  STOCK_TABS,
  TESLA,
  TICKERS,
  TODAY_SALES,
  TODAY_TABLE,
  WEEKLY_TREND,
  serverLoad,
} from "../dashboardData";

/** Le petit cercle des tuiles, décoratif sur une tuile qui n'a rien à rafraîchir. */
const Ring = () => <span className="rdk-dash__ring" aria-hidden="true" />;

const Up = ({ up }: { up: boolean }) => (up ? <ArrowUpIcon size={14} /> : <ArrowDownIcon size={14} />);

function Tickers() {
  return (
    <div className="rdk-dash__tickers">
      {TICKERS.map((t) => (
        <div key={t.symbol}>
          <div className="rdk-dash__ticker-line">
            <span className={t.delta >= 0 ? "rdk-dash__up" : undefined}>
              <Up up={t.delta >= 0} /> {t.delta >= 0 ? "+" : ""}
              {t.delta.toLocaleString("fr-FR")} %
            </span>
            <span className="rdk-dash__small">{t.price}</span>
          </div>
          <strong className="rdk-dash__symbol">{t.symbol}</strong>
        </div>
      ))}
    </div>
  );
}

/** Un repli « Options secrètes », au pied de plusieurs cartes. */
function Secret({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rdk-dash__secret">
      <button type="button" className="rdk-dash__more" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className={open ? "rdk-dash__chevron rdk-dash__chevron--open" : "rdk-dash__chevron"}>
          <ChevronDownIcon size={14} />
        </span>
        Options secrètes
      </button>
      {open && <div className="rdk-dash__secret-body">{children}</div>}
    </div>
  );
}

const TABLE_COLUMNS: DataTableColumn<(typeof TODAY_TABLE)[number]>[] = [
  { id: "produit", header: "Produit", accessor: (r) => r.produit },
  { id: "qte", header: "Qté", accessor: (r) => `Qté ${r.qte}`, align: "right", width: "5rem" },
  { id: "prix", header: "Prix", accessor: (r) => r.prix, align: "right", width: "6.5rem" },
];

const refresh = () => new Promise<void>((resolve) => setTimeout(resolve, 900));

/**
 * La vue d'ensemble : un tableau de bord d'administration complet, avec les composants du kit et
 * des données fictives — tuiles vivantes en tête, rangée de ventes, graphique boursier et tableau
 * du jour, géolocalisation et charge serveur, actions, options de page et météo détaillée, avec
 * leurs comportements (tuiles qui défilent, cercles « rafraîchir », options repliables). Tout y
 * passe par le thème du CV ; les illustrations sont générées ici en SVG.
 */
export function Overview() {
  const [range, setRange] = useState("5j");
  const [source, setSource] = useState("fb");
  const [stock, setStock] = useState("appl");
  const [tick, setTick] = useState(0);
  const [publicPost, setPublicPost] = useState(false);
  const [maintenance, setMaintenance] = useState(true);
  const [moreWeekly, setMoreWeekly] = useState(false);

  // La charge serveur glisse d'un point toutes les deux secondes, comme un relevé en direct.
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 2000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="rdk-dash">
      {/* ---- tuiles de tête ---- */}
      <div className="rdk-dash__row rdk-dash__row--head">
        <div className="rdk-dash__stack">
          <LiveTile
            height={423}
            controls={<Ring />}
            faces={[
              {
                image: EXPLORE_ART,
                scrim: true,
                tag: "EXPLORER",
                title: "Tapez n'importe où pour une recherche rapide",
                subtitle: "En savoir plus sur le projet",
                footer: <Tickers />,
              },
            ]}
          />
          <div className="rdk-dash__pair">
            <Card title="Revenu produit ›" onRefresh={refresh}>
              <div className="rdk-dash__split">
                <span className="rdk-dash__green-title">Webarch</span>
                <span>2 563</span>
              </div>
              <div className="rdk-dash__bleed">
                <LineAreaChart series={PRODUCT_REVENUE} height={110} xType="linear" showYAxis={false} showGrid={false} showLegend={false} fullscreenToggle={false} xTicks={4} embedded />
              </div>
            </Card>
            <Card onRefresh={refresh}>
              <div className="rdk-dash__sales">
                <div>
                  <p className="rdk-dash__plain-title">Ventes du jour</p>
                  <p className="rdk-dash__amount">
                    9 534<small>,58 €</small>
                  </p>
                  <p className="rdk-dash__up">+423,50 € (2,65 %)</p>
                </div>
                <div className="rdk-dash__bars">
                  <BarChart data={TODAY_SALES.map((b) => ({ ...b, color: SERIES.red }))} height={120} showGrid={false} showValueAxis={false} showLegend={false} fullscreenToggle={false} zoomable={false} embedded />
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="rdk-dash__quad">
          <LiveTile height={281} controls={<Ring />} faces={[{ image: NEWS_ART, scrim: true, tag: "ACTUALITÉ", tagVariant: "soft", title: "Bien plus à voir d'un coup d'œil.", subtitle: "En savoir plus sur le projet" }]} />
          <LiveTile
            height={281}
            tone="info"
            interval={3000}
            controls={
              <span className="rdk-dash__tile-icons">
                <CommentIcon size={16} />
                <span className="rdk-dash__tile-icon-box">
                  <StarIcon size={16} />
                </span>
              </span>
            }
            faces={[
              { eyebrow: "21 janv.", title: "Une toute nouvelle page" },
              { eyebrow: "21 janv.", title: "Pensée pour une belle expérience" },
            ]}
          />
          <LiveTile
            height={281}
            tone="dark"
            controls={<Ring />}
            faces={[
              <div key="meteo" className="rdk-dash__weather-tile">
                <span className="rdk-dash__degrees">30°</span>
                <span className="rdk-dash__today">AUJOURD'HUI</span>
                <span>Temps pluvieux</span>
                <span className="rdk-dash__soft">Jeudi 5 novembre 2026</span>
              </div>,
            ]}
          />
          <LiveTile
            height={281}
            tone="success"
            interval={3500}
            faces={[0, 2].map((start) => (
              <div key={start} className="rdk-dash__quotes">
                <p>Pré-ouverture : 116 850,50 (0,43 %)</p>
                {QUOTES.slice(start, start + 2).map((q) => (
                  <div key={q.name}>
                    <p className="rdk-dash__quote-name">{q.name}</p>
                    <p>
                      {q.delta} &nbsp; {q.price} <Up up={q.up} />
                    </p>
                  </div>
                ))}
              </div>
            ))}
          />
        </div>
      </div>

      {/* ---- ventes, Tesla, tableau du jour ---- */}
      <div className="rdk-dash__row rdk-dash__row--b">
        <div className="rdk-dash__stack">
          <Card title="Ventes de la semaine" tone="success" onRefresh={refresh}>
            <div className="rdk-dash__weekly">
              <div>
                <p className="rdk-dash__value">14 000 €</p>
                <p>
                  <span className="rdk-dash__pill">60 %</span> Plus haut
                </p>
              </div>
              <Sparkline data={WEEKLY_TREND} width={150} height={70} />
            </div>
          </Card>
          <Card title="Ventes de la semaine" tone="accent" onRefresh={refresh}>
            <p className="rdk-dash__value">23 000 €</p>
            <p className="rdk-dash__soft">
              <ArrowDownIcon size={14} /> 65 % de moins que le mois dernier
            </p>
            <ProgressBar value={42} thickness={4} />
          </Card>
          <Card title="Ventes de la semaine" onRefresh={refresh}>
            <p className="rdk-dash__value rdk-dash__down">APPL 2,032</p>
            <p className="rdk-dash__inline-stats">
              WMHC <span className="rdk-dash__up"><ArrowUpIcon size={12} /> 21 %</span> &nbsp; HCRS{" "}
              <span className="rdk-dash__down"><ArrowDownIcon size={12} /> 21 %</span>
            </p>
            <button type="button" className="rdk-dash__more" onClick={() => setMoreWeekly((o) => !o)} aria-expanded={moreWeekly}>
              <span className={moreWeekly ? "rdk-dash__chevron rdk-dash__chevron--open" : "rdk-dash__chevron"}>
                <ChevronDownIcon size={14} />
              </span>
              Afficher plus
            </button>
            {moreWeekly && (
              <div className="rdk-dash__secret-body">
                <PanelRow label="Volume" value="1,2 M" />
                <PanelRow label="Capitalisation" value="2,4 T€" />
              </div>
            )}
          </Card>
        </div>

        <Card controls={<span className="rdk-dash__dots">···</span>}>
          <div className="rdk-dash__tesla-head">
            <span className="rdk-dash__company">Tesla Inc.</span>
            <span className="rdk-dash__price rdk-dash__up">
              <ArrowUpIcon size={18} /> 448,97 <small>+318,24</small>
            </span>
          </div>
          <SegmentedControl
            value={range}
            onChange={setRange}
            options={[
              { value: "1j", label: "1J" },
              { value: "5j", label: "5J" },
              { value: "1m", label: "1M" },
              { value: "1a", label: "1A" },
            ]}
          />
          <LineAreaChart series={TESLA} height={300} xType="linear" showLegend={false} fullscreenToggle={false} xTicks={5} yTicks={7} />
        </Card>

        <Card title="Tableau du jour" onRefresh={refresh}>
          <div className="rdk-dash__split">
            <span className="rdk-dash__accent-title">Resume</span>
            <span className="rdk-dash__total">102 967 €</span>
          </div>
          <DataTable columns={TABLE_COLUMNS} rows={TODAY_TABLE} rowKey={(r) => r.id} />
          <p className="rdk-dash__more-line">
            <ChevronDownIcon size={14} /> Afficher plus de détails de <span className="rdk-dash__link">l'entreprise</span>
          </p>
        </Card>
      </div>

      {/* ---- géolocalisation, charge serveur ---- */}
      <div className="rdk-dash__row rdk-dash__row--c">
        <Card title="Géolocalisation" onRefresh={refresh}>
          <div className="rdk-dash__geo">
            <div className="rdk-dash__geo-side">
              <SegmentedControl
                value={source}
                onChange={setSource}
                options={[
                  { value: "fb", label: "fb" },
                  { value: "gl", label: "gl" },
                  { value: "am", label: "am" },
                ]}
              />
              <Secret>
                <PanelRow label="Rafraîchissement" value="30 s" />
                <PanelRow label="Précision" value="Région" />
              </Secret>
            </div>
            <DotMap tone="success" height={410} bounds={[[-170, 8], [-50, 75]]} markers={GEO_MARKERS} defaultSelectedId="na" />
          </div>
        </Card>

        <Card title="Charge serveur" onRefresh={refresh}>
          <p>Serveur : www.exemple.fr</p>
          <div className="rdk-dash__server-stats">
            <div>
              <strong>5,2 Go</strong>
              <span>Utilisation totale</span>
            </div>
            <div>
              <strong>227,3 Ko</strong>
              <span>En ce moment</span>
            </div>
            <div>
              <strong>117,6 Mo</strong>
              <span>Moyenne</span>
            </div>
          </div>
          <LineAreaChart series={serverLoad(tick)} height={250} xType="linear" showLegend={false} fullscreenToggle={false} yTicks={3} />
        </Card>
      </div>

      {/* ---- actions, options de page, météo ---- */}
      <div className="rdk-dash__row rdk-dash__row--d">
        <Card onRefresh={refresh}>
          <Tabs
            value={stock}
            onChange={setStock}
            items={STOCK_TABS.map((s) => ({ id: s.id, label: s.symbol }))}
          />
          {STOCK_TABS.filter((s) => s.id === stock).map((s) => (
            <p key={s.id} className="rdk-dash__stock-value">
              {s.value} <span className={s.up ? "rdk-dash__up" : "rdk-dash__down"}>{s.delta}</span>
            </p>
          ))}
          <BarChart data={STOCK_BARS.map((b) => ({ ...b, color: SERIES.blue }))} height={170} showGrid={false} showValueAxis={false} showLegend={false} fullscreenToggle={false} zoomable={false} embedded />
          <div className="rdk-dash__split rdk-dash__split--top">
            <p className="rdk-dash__quote">La motivation de la marque : l'innovation distingue celui qui mène de celui qui suit.</p>
            <div className="rdk-dash__quote-values">
              <span className="rdk-dash__up">+0,94</span>
              <span className="rdk-dash__down">-0,63</span>
            </div>
          </div>
          <p className="rdk-dash__soft rdk-dash__small">Via la boutique en ligne (grand public et éducation) — 01 23 45 67 89</p>
        </Card>

        <Card title="Options de page" onRefresh={refresh}>
          <div className="rdk-dash__page-name">
            <Avatar name="Web Sales" size={36} />
            <div>
              <span className="rdk-dash__eyebrow">Nom de la page</span>
              <span>Analyse des ventes Webarch</span>
            </div>
          </div>
          <div className="rdk-dash__page-stats">
            <div>
              <span className="rdk-dash__eyebrow">Vues</span>
              <span className="rdk-dash__up">14 256</span>
            </div>
            <div>
              <span className="rdk-dash__eyebrow">Aujourd'hui</span>
              <span className="rdk-dash__warn">24</span>
            </div>
            <div>
              <span className="rdk-dash__eyebrow">Semaine</span>
              <span className="rdk-dash__up">56</span>
            </div>
          </div>
          <div className="rdk-dash__bleed">
            <LineAreaChart series={PAGE_VIEWS} height={120} xType="linear" showYAxis={false} showGrid={false} showLegend={false} fullscreenToggle={false} xTicks={0} embedded />
          </div>
          <PanelRow label="Publication publique">
            <Toggle checked={publicPost} onChange={setPublicPost} ariaLabel="Publication publique" />
          </PanelRow>
          <PanelRow label="Mode maintenance">
            <Toggle checked={maintenance} onChange={setMaintenance} ariaLabel="Mode maintenance" />
          </PanelRow>
          <Secret>
            <PanelRow label="Indexation" value="Autorisée" />
          </Secret>
        </Card>

        <Card title="Californie, États-Unis" controls={<span className="rdk-dash__dots">···</span>}>
          <div className="rdk-dash__weather-head">
            <div>
              <p className="rdk-dash__day">Lundi</p>
              <p className="rdk-dash__soft rdk-dash__small">9 août 2026</p>
            </div>
            <p className="rdk-dash__hot">
              <SunIcon size={40} /> 32°
            </p>
          </div>
          <p className="rdk-dash__weather-title">Informations météo</p>
          <div className="rdk-dash__weather-grid">
            <PanelRow label="Vent" value="11 km/h" />
            <PanelRow label="Coucher" value="21:05" />
            <PanelRow label="Lever" value="05:20" />
            <PanelRow label="Visibilité" value="21 km" />
            <PanelRow label="Humidité" value="20 %" />
            <PanelRow label="Précipitations" value="60 %" />
          </div>
          <div className="rdk-dash__hours">
            {HOURLY.map((h, i) => (
              <div key={h.id}>
                <span className="rdk-dash__small">{h.label}</span>
                {[<PartlyCloudyIcon key="a" size={22} />, <CloudIcon key="b" size={22} />, <CloudRainIcon key="c" size={22} />][i % 3]}
                <span className={i < 3 ? "rdk-dash__down" : "rdk-dash__up"}>{h.temp}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <footer className="rdk-dash__footer">
        <span>© 2026 resume-dashboard-kit — thème « resume » sur liseuse-dashboard-kit.</span>
        <span>Fait main, avec soin.</span>
      </footer>
    </div>
  );
}
