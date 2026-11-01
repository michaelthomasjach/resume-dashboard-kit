import { MailPanel } from "@michaelthomasjach/liseuse-dashboard-kit";
import { MAIL_FOLDERS, MAIL_MESSAGES, MAIL_NOW } from "../appData";

/**
 * La boîte mail, en plein cadre : dossiers, liste et message ouvert sur toute la hauteur de la zone
 * de contenu. Lu / non lu, étoiles, suppression et recherche sont tenus par le panneau lui-même
 * (`defaultMessages`), sans état ici.
 */
export function Mail() {
  return (
    <div className="rdk-app-fill">
      <MailPanel folders={MAIL_FOLDERS} defaultMessages={MAIL_MESSAGES} defaultSelectedId="m1" now={MAIL_NOW} onCompose={() => undefined} ariaLabel="Boîte mail" />
    </div>
  );
}
