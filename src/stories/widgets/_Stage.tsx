import type { CSSProperties, ReactNode } from "react";

/**
 * Une scène pour les widgets qui se posent en surimpression — dock d'icônes, épingles d'alerte,
 * compteur d'images, carte d'objectifs. Ils se placent dans un conteneur positionné, comme une
 * application les poserait sur sa carte ou sa vue principale : ce cadre en tient lieu.
 *
 * Ce n'est pas un composant du kit, seulement le décor des stories. Il ne lit que des variables du
 * thème, pour suivre la surface claire ou sombre.
 */
export function Stage({ height = 380, plan = false, children }: { height?: number; plan?: boolean; children: ReactNode }) {
  const line = "color-mix(in srgb, var(--lq-color-text) 6%, transparent)";
  return (
    <div
      style={{
        position: "relative",
        height,
        overflow: "hidden",
        border: "1px solid var(--lq-color-border-subtle)",
        borderRadius: "var(--lq-radius-md)",
        background: plan
          ? `repeating-linear-gradient(0deg, ${line} 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, ${line} 0 1px, transparent 1px 28px), color-mix(in srgb, var(--lq-color-text) 3%, var(--lq-color-bg))`
          : "color-mix(in srgb, var(--lq-color-text) 4%, var(--lq-color-bg))",
      }}
    >
      {plan ? (
        <>
          <Block left="10%" top="34%" width="34%" height="30%" />
          <Block left="54%" top="52%" width="26%" height="26%" />
        </>
      ) : null}
      {children}
    </div>
  );
}

function Block(style: Pick<CSSProperties, "left" | "top" | "width" | "height">) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        borderRadius: "var(--lq-radius-sm)",
        background: "color-mix(in srgb, var(--lq-color-text) 12%, var(--lq-color-bg))",
        ...style,
      }}
    />
  );
}

/** Plante une épingle en (x, y) : le point d'ancrage est le milieu de son bord bas. */
export function Pin({ x, y, children }: { x: string; y: string; children: ReactNode }) {
  return <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -100%)" }}>{children}</div>;
}

/** Pose son contenu dans un coin de la scène, au retrait du thème. */
export function Corner({ at, children }: { at: "top-left" | "top-right" | "bottom-left" | "bottom-right"; children: ReactNode }) {
  const [v, h] = at.split("-") as ["top" | "bottom", "left" | "right"];
  return (
    <div
      style={{
        position: "absolute",
        [v]: "var(--lq-space-3)",
        [h]: "var(--lq-space-3)",
        display: "flex",
        flexDirection: "column",
        alignItems: h === "left" ? "flex-start" : "flex-end",
        gap: "var(--lq-space-2)",
      }}
    >
      {children}
    </div>
  );
}

/** Une ligne de légende en bas à gauche de la scène : ce que le dernier geste a produit. */
export function Caption({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        position: "absolute",
        left: "var(--lq-space-3)",
        bottom: "var(--lq-space-2)",
        margin: 0,
        fontSize: "var(--lq-text-sm)",
        color: "var(--lq-color-text-muted)",
      }}
    >
      {children}
    </p>
  );
}
