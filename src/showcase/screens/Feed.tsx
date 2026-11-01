import { useState } from "react";
import { ActivityFeed, Card, Timeline, type ActivityPost } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ScreenHead } from "../Specimen";
import { ACTIVITY_POSTS } from "../appData";
import { TIMELINE } from "../timelineIcons";

const ME = { name: "Claire Lemoine" };

/**
 * La frise et le fil côte à côte : à gauche ce qui s'est passé (déploiements, revues, incidents), à
 * droite ce que l'équipe en dit. Les mentions J'aime et les commentaires sont tenus ici, comme une
 * application le ferait avant de les envoyer à son serveur.
 */
export function Feed() {
  const [posts, setPosts] = useState<ActivityPost[]>(ACTIVITY_POSTS);

  const like = (id: string, liked: boolean) =>
    setPosts((all) => all.map((p) => (p.id === id ? { ...p, liked, likes: (p.likes ?? 0) + (liked ? 1 : -1) } : p)));

  const comment = (id: string, text: string) =>
    setPosts((all) =>
      all.map((p) =>
        p.id === id
          ? {
              ...p,
              comments: [...(p.comments ?? []), { id: `${id}-${(p.comments ?? []).length + 1}`, author: ME, text, time: "à l'instant" }],
              commentCount: (p.commentCount ?? p.comments?.length ?? 0) + 1,
            }
          : p,
      ),
    );

  return (
    <div className="rdk-screen rdk-screen--full">
      <ScreenHead title="Frise" intro="La chronologie du projet et le fil de l'équipe, côte à côte." />
      <div className="rdk-grid rdk-grid--feed">
        <Card title="Chronologie" meta="7 derniers jours">
          <Timeline entries={TIMELINE} ariaLabel="Chronologie du projet" />
        </Card>
        <ActivityFeed posts={posts} currentUser={ME} onLike={like} onComment={comment} onShare={() => undefined} defaultOpenComments={["p1"]} />
      </div>
    </div>
  );
}
