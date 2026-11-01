import { useState } from "react";
import { Avatar, Badge, Button, Card, Checkbox, ProfilePage, Text } from "@michaelthomasjach/liseuse-dashboard-kit";
import { PROFILE_ACTIVITY, PROFILE_AVATAR, PROFILE_BANNER, PROFILE_INFO, PROFILE_STATS, PROFILE_TEAM } from "../appData";

function Settings() {
  const [mentions, setMentions] = useState(true);
  const [digest, setDigest] = useState(false);
  return (
    <div className="rdk-stack">
      <Checkbox checked={mentions} onChange={setMentions} label="Recevoir un e-mail à chaque mention" />
      <Checkbox checked={digest} onChange={setDigest} label="Résumé hebdomadaire le lundi matin" />
    </div>
  );
}

/**
 * La page de profil, remplie : bannière, portrait, chiffres, trois onglets et une colonne latérale.
 *
 * Partagée entre l'écran « Profil » et la planche des pages, qui la montre dans un cadre : la page
 * ne prend jamais la hauteur de la fenêtre (`fullHeight` faux), elle remplit ce qui la contient.
 */
export function ProfileDemo() {
  const [following, setFollowing] = useState(false);
  return (
    <ProfilePage
      fullHeight={false}
      name="Claire Lemoine"
      role="Responsable produit chez Lemoine & Associés"
      location="Lyon, France"
      bio="Je fabrique des outils que les conseillers ont envie d'ouvrir le matin."
      avatarSrc={PROFILE_AVATAR}
      bannerSrc={PROFILE_BANNER}
      actions={
        <>
          <Button>Message</Button>
          <Button tone="primary" selected={following} onClick={() => setFollowing((f) => !f)}>
            {following ? "Suivi" : "Suivre"}
          </Button>
        </>
      }
      stats={PROFILE_STATS}
      about={
        <div className="rdk-stack">
          <Text>
            Responsable produit depuis 2019, Claire pilote l'espace client et le tableau de bord des conseillers. Avant cela, huit ans de conseil en
            organisation pour des réseaux bancaires.
          </Text>
          <div className="rdk-wrap">
            <Badge>Recherche utilisateur</Badge>
            <Badge>Accessibilité</Badge>
            <Badge>Tableaux de bord</Badge>
          </div>
        </div>
      }
      activity={
        <div className="rdk-stack">
          {PROFILE_ACTIVITY.map((a) => (
            <div key={a.when} className="rdk-stack rdk-stack--tight">
              <Text size="xs" muted>
                {a.when}
              </Text>
              <Text>Claire {a.what}</Text>
            </div>
          ))}
        </div>
      }
      settings={<Settings />}
      info={PROFILE_INFO}
      sidebar={
        <Card title="Équipe">
          <div className="rdk-stack">
            {PROFILE_TEAM.map((name) => (
              <div key={name} className="rdk-row">
                <Avatar name={name} size={28} />
                <Text size="sm">{name}</Text>
              </div>
            ))}
          </div>
        </Card>
      }
    />
  );
}

/** L'écran « Profil » du groupe Applications : la page seule, sans en-tête d'écran — elle a le sien. */
export function Profile() {
  return <ProfileDemo />;
}
