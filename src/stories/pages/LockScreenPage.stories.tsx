import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { LockScreenPage, type LockScreenPageProps } from "@michaelthomasjach/liseuse-dashboard-kit";
import { DEMO_AVATAR } from "../_data/pages";

/** Démonstration : « secret » déverrouille, tout autre mot de passe est refusé après 600 ms. */
function DemoUnlock(args: LockScreenPageProps) {
  const [error, setError] = useState<string>();
  const [unlocked, setUnlocked] = useState(false);
  const onUnlock = (password: string) =>
    new Promise<void>((resolve, reject) => {
      setError(undefined);
      setTimeout(() => {
        if (password === "secret") {
          setUnlocked(true);
          resolve();
        } else {
          setError("Mot de passe incorrect.");
          reject(new Error("refusé"));
        }
      }, 600);
    });
  return <LockScreenPage {...args} eyebrow={unlocked ? "Déverrouillé (démonstration)" : args.eyebrow} onUnlock={onUnlock} error={error} />;
}

/**
 * L'écran de verrouillage : la session reste ouverte, seul le mot de passe la rend.
 */
const meta = {
  title: "Pages/LockScreenPage",
  component: LockScreenPage,
  parameters: {
    layout: "fullscreen",
    rdkPadding: 0,
    docs: {
      story: { inline: false, iframeHeight: "620px" },
      description: {
        component: [
          "**Écran de verrouillage** : l'avatar et le nom de la personne connectée, un champ mot de passe, « Déverrouiller », et le lien « Ce n'est pas vous ? ». Au-dessus, l'heure et la date si on les fournit.",
          "",
          "**Quand l'utiliser** — après une période d'inactivité, ou sur demande (« Verrouiller ») : la session et l'état de l'application restent en mémoire, on ne redemande que le mot de passe. Pour une vraie connexion, `LoginPage`.",
          "",
          "**Hauteur** — la page **remplit son conteneur** (`min-height: 100%`) ; rendue seule, `fullHeight` lui donne au moins `100dvh`. Voir « Dans un cadre ».",
          "",
          "**Anatomie** — `logo` (en haut à gauche), `time` et `date` (déjà formatés : la page ne lit pas l'horloge elle-même, à vous de les rafraîchir), l'avatar (`avatarSrc`, sinon les initiales de `name`), `eyebrow` (« Session verrouillée »), `name` (un vrai `<h1>`), le formulaire, le lien de changement d'utilisateur, `footer`.",
          "",
          "**Le formulaire** — un vrai `<form>` : Entrée l'envoie. Le champ est un `InputPassword` du kit (afficher / masquer), libellé `passwordLabel`, indication `passwordPlaceholder`, `autoComplete=\"current-password\"`, et un champ `username` caché pour que le gestionnaire de mots de passe choisisse le bon compte. `onUnlock(password)` reçoit la saisie ; un champ vide n'appelle rien et rend le focus au champ. Si `onUnlock` rend une **promesse**, le formulaire est occupé jusqu'à son issue ; rompue, le champ est vidé et reprend le focus. `unlocking` pilote cet état de l'extérieur. `error` s'affiche sous le champ et est annoncé aux lecteurs d'écran.",
          "",
          "**« Ce n'est pas vous ? »** — `switchUserLabel` ; un bouton s'il y a `onSwitchUser`, un lien vers `switchUserHref` sinon, rien sans les deux.",
          "",
          "**Clavier** — le champ prend le focus à l'ouverture ; Entrée déverrouille ; Tab atteint l'œil, le bouton puis le lien.",
          "",
          "**Thème** — `--lq-color-bg`, `--lq-color-text`, `--lq-color-text-muted`, `--lq-color-accent` (lien), `--lq-color-focus-ring`, `--lq-text-h3`, `--lq-text-md`, `--lq-space-2` à `--lq-space-6`, et les variables des champs et du bouton. Variables optionnelles : `--lq-lock-screen-width` (340 px), `--lq-lock-screen-time-size` / `-weight` (l'heure), `--lq-lock-screen-name-size` / `-weight` — ce thème met le nom à 36 px en 700, dans la graisse des titres du CV.",
        ].join("\n"),
      },
    },
  },
  args: {
    name: "Claire Lemoine",
    avatarSrc: DEMO_AVATAR,
    fullHeight: true,
    onUnlock: fn(),
    onSwitchUser: fn(),
  },
  argTypes: {
    name: { control: "text" },
    avatarSrc: { control: "text" },
    eyebrow: { control: "text", table: { defaultValue: { summary: '"Session verrouillée"' } } },
    error: { control: "text" },
    unlocking: { control: "boolean" },
    unlockLabel: { control: "text", table: { defaultValue: { summary: '"Déverrouiller"' } } },
    passwordLabel: { control: "text", table: { defaultValue: { summary: '"Mot de passe"' } } },
    passwordPlaceholder: { control: "text", table: { defaultValue: { summary: '"Votre mot de passe"' } } },
    switchUserLabel: { control: "text", table: { defaultValue: { summary: "\"Ce n'est pas vous ?\"" } } },
    switchUserHref: { control: "text" },
    time: { control: "text" },
    date: { control: "text" },
    fullHeight: { control: "boolean", table: { defaultValue: { summary: "false" } } },
    logo: { control: false },
    footer: { control: false },
    onUnlock: { control: false },
    onSwitchUser: { control: false },
  },
} satisfies Meta<typeof LockScreenPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  args: {
    time: "09:41",
    date: "dimanche 1 novembre 2026",
    footer: "Essayez « secret » ; tout autre mot de passe est refusé.",
  },
  render: (args) => <DemoUnlock {...args} />,
  parameters: { docs: { description: { story: "Un déverrouillage complet : « secret » passe, le reste est refusé après 600 ms — le formulaire reste occupé pendant l'attente, puis le champ se vide et l'erreur s'affiche." } } },
};

export const WithError: Story = {
  name: "Mot de passe refusé",
  args: { error: "Mot de passe incorrect. Il vous reste 2 essais.", onSwitchUser: undefined, switchUserHref: "#connexion" },
  parameters: { docs: { description: { story: "Le retour d'un refus : `error` sous le champ. Sans `onSwitchUser`, « Ce n'est pas vous ? » est un lien vers `switchUserHref`." } } },
};

export const Unlocking: Story = {
  name: "Déverrouillage en cours",
  args: { name: "Hugo Martin", avatarSrc: undefined, unlocking: true, time: "18:05", date: "vendredi 30 octobre", onSwitchUser: undefined },
  parameters: { docs: { description: { story: "`unlocking` pilote l'état occupé de l'extérieur. Sans `avatarSrc`, l'avatar montre les initiales." } } },
};

export const InFrame: Story = {
  name: "Dans un cadre",
  args: { fullHeight: false },
  render: (args) => (
    <div style={{ padding: 30 }}>
      <div style={{ width: 360, height: 520, border: "1px solid var(--lq-color-border)" }}>
        <LockScreenPage {...args} />
      </div>
    </div>
  ),
  parameters: { docs: { description: { story: "Sans `fullHeight`, la page prend la hauteur de son conteneur et s'y centre." } } },
};
