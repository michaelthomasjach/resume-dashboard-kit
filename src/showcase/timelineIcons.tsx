import type { ReactNode } from "react";
import {
  AlertTriangleIcon,
  CheckIcon,
  LockIcon,
  RefreshIcon,
  UploadCloudIcon,
  UserIcon,
  type TimelineEntry,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { TIMELINE_ENTRIES } from "./appData";

/** Les icônes de la frise, posées d'après l'identifiant de l'entrée : `appData.ts` ne porte que des
 *  données, et une entrée sans icône ici garde la pastille simple du kit. */
const ICONS: Record<string, ReactNode> = {
  deploy: <UploadCloudIcon />,
  review: <CheckIcon />,
  incident: <AlertTriangleIcon />,
  rotate: <LockIcon />,
  member: <UserIcon />,
  sync: <RefreshIcon />,
};

export const TIMELINE: TimelineEntry[] = TIMELINE_ENTRIES.map((entry) => ({ ...entry, icon: ICONS[entry.id] }));
