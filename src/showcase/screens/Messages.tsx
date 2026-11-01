import { ChatPanel } from "@michaelthomasjach/liseuse-dashboard-kit";
import { CHAT_CONTACTS, CHAT_MESSAGES, CHAT_NOW } from "../appData";

/**
 * La messagerie, en plein cadre : pas d'en-tête d'écran, le panneau
 * prend toute la hauteur que la barre haute laisse à la zone de contenu. Les messages envoyés
 * restent dans l'état du panneau, le temps de la visite.
 */
export function Messages() {
  return (
    <div className="rdk-app-fill">
      <ChatPanel contacts={CHAT_CONTACTS} messages={CHAT_MESSAGES} defaultActiveContactId="ava" now={CHAT_NOW} title="Messages" />
    </div>
  );
}
