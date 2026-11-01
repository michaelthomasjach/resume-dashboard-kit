import { Badge, InvoicePage } from "@michaelthomasjach/liseuse-dashboard-kit";
import { INVOICE_CLIENT, INVOICE_ISSUER, INVOICE_LINES, INVOICE_TERMS } from "../appData";

const logo = <span className="rdk-logo">atelier nord</span>;

/**
 * La facture, remplie : émetteur, client, lignes, TVA, mentions et barre d'actions.
 *
 * Partagée entre l'écran « Facture » et la planche des pages. `onPrint` reste celui du kit
 * (`window.print`) ; le téléchargement n'a rien à télécharger ici et ne fait rien.
 */
export function InvoiceDemo() {
  return (
    <InvoicePage
      fullHeight={false}
      number="F-2026-0147"
      issueDate="2026-10-15"
      dueDate="2026-11-14"
      logo={logo}
      issuer={INVOICE_ISSUER}
      client={INVOICE_CLIENT}
      lines={INVOICE_LINES}
      status={<Badge tone="warning">En attente</Badge>}
      notes="Merci pour votre confiance. Référence de commande : BC-5531."
      terms={INVOICE_TERMS}
      onDownload={() => undefined}
    />
  );
}

/** L'écran « Facture » du groupe Applications : la page seule, elle porte son propre en-tête. */
export function Invoice() {
  return <InvoiceDemo />;
}
