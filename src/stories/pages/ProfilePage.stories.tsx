import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ProfilePage, Avatar, Badge, Button, Card, Checkbox } from "@michaelthomasjach/liseuse-dashboard-kit";
import { DEMO_AVATAR, DEMO_BANNER } from "../_data/pages";

const ABOUT = (
  <div style={{ display: "grid", gap: 12, lineHeight: 1.6 }}>
    <p style={{ margin: 0 }}>
      Responsable produit depuis 2019, Claire pilote l'espace client et le tableau de bord des conseillers. Avant cela, huit ans de conseil en organisation
      pour des réseaux bancaires.
    </p>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Badge>Recherche utilisateur</Badge>
      <Badge>Accessibilité</Badge>
      <Badge>Tableaux de bord</Badge>
    </div>
  </div>
);

const ACTIVITY = (
  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 12 }}>
    {[
      ["Aujourd'hui, 9 h 12", "a publié la feuille de route du quatrième trimestre"],
      ["Hier, 17 h 40", "a commenté « Refonte de l'écran des virements »"],
      ["28 octobre", "a fermé 14 tickets du lot « Exports »"],
    ].map(([when, what]) => (
      <li key={when} style={{ display: "grid", gap: 2 }}>
        <span style={{ fontSize: "0.8rem", color: "var(--lq-color-text-muted)" }}>{when}</span>
        <span>Claire {what}</span>
      </li>
    ))}
  </ul>
);

function Settings() {
  const [mail, setMail] = useState(true);
  const [digest, setDigest] = useState(false);
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Checkbox checked={mail} onChange={setMail} label="Recevoir un e-mail à chaque mention" />
      <Checkbox checked={digest} onChange={setDigest} label="Résumé hebdomadaire le lundi matin" />
    </div>
  );
}

const TEAM = (
  <Card title="Équipe">
    <div style={{ display: "grid", gap: 10 }}>
      {["Hugo Martin", "Inès Benali", "Paul Roux"].map((n) => (
        <div key={n} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={n} size={28} />
          <span>{n}</span>
        </div>
      ))}
    </div>
  </Card>
);

const ACTIONS = (
  <>
    <Button onClick={fn()}>Message</Button>
    <Button selected onClick={fn()}>
      Suivre
    </Button>
  </>
);

/**
 * La page de profil : bannière, identité, chiffres-clés, onglets et colonne d'informations.
 */
const meta = {
  title: "Pages/ProfilePage",
  component: ProfilePage,
  parameters: {
    layout: "fullscreen",
    rdkPadding: 0,
    docs: {
      story: { inline: false, iframeHeight: "860px" },
      description: {
        component: [
          "**Page de profil** d'une personne : une bannière, l'avatar à cheval sur son bord, le nom, la fonction et la ville, des boutons d'action, une présentation et des chiffres-clés, puis des **onglets** (À propos / Activité / Réglages) et une **colonne latérale** d'informations.",
          "",
          "**Quand l'utiliser** — la fiche d'un membre de l'équipe, d'un client, ou « Mon profil ». Elle se pose dans la zone de contenu d'une coquille : elle **remplit son conteneur** (`min-height: 100%`), et `fullHeight` lui donne au moins `100dvh` quand elle est seule.",
          "",
          "**Bannière** — `bannerSrc` (une image, recadrée pour couvrir) ; sinon `bannerColor` (n'importe quelle couleur CSS, `var(--lq-…)` comprise) ; sinon une **illustration de vagues** dessinée en SVG avec les variables du thème : elle suit la palette et la surface, au trait en e-ink.",
          "",
          "**Identité** — `name` (un vrai `<h1>`), `role`, `location` (précédée d'un repère), `avatarSrc` (sinon les initiales), `actions` (vos boutons, à droite), `bio`, et `stats` : une liste `{ label, value }` rendue en liste de définitions (« 1 284 abonnés »).",
          "",
          "**Onglets** — leurs contenus sont des **slots** : `about`, `activity`, `settings`. Un onglet n'apparaît que si son contenu est fourni ; avec un seul, la barre d'onglets disparaît et le contenu s'affiche directement. `tabLabels` renomme les onglets. Libres par défaut (`defaultTab`, sinon le premier fourni) ou contrôlés (`tab` + `onTabChange`). La barre est le `Tabs` du kit ; le contenu est un `tabpanel` focalisable, nommé d'après l'onglet ouvert.",
          "",
          "**Colonne latérale** — `info` (une liste `{ label, value }`) rend une fiche titrée `infoTitle` (« Informations ») ; `sidebar` ajoute dessous ce que vous voulez — des `Card`, une liste de contacts. Sans les deux, le contenu prend toute la largeur.",
          "",
          "**Conteneur étroit** — la page lit la largeur de **son conteneur** (`@container`), pas celle de la fenêtre : sous 760 px la colonne latérale passe sous les onglets, sous 520 px les marges se resserrent.",
          "",
          "**Clavier** — Tab parcourt les actions, les onglets (activés à Entrée ou Espace), puis le contenu. Les onglets du kit ne se parcourent pas aux flèches.",
          "",
          "**Thème** — `--lq-color-bg`, `--lq-color-panel` (cartes), `--lq-color-panel-border`, `--lq-shadow-panel`, `--lq-radius-lg`, `--lq-color-accent` et `--lq-color-accent-contrast` (bannière par défaut), `--lq-color-fill-track` (fond sous une image), `--lq-label-*` (libellés des chiffres), `--lq-caption-*` (titre de la fiche, onglets), `--lq-row-font-size`, `--lq-text-h3`, `--lq-text-h4`. Variables optionnelles : `--lq-profile-banner-height` (200 px), `--lq-profile-banner-bg`, `--lq-profile-avatar-overlap` (52 px), `--lq-profile-name-size` / `-weight`, `--lq-profile-aside-width` (300 px).",
        ].join("\n"),
      },
    },
  },
  args: {
    name: "Claire Lemoine",
    role: "Responsable produit chez Lemoine & Associés",
    location: "Lyon, France",
    bio: "Je fabrique des outils que les conseillers ont envie d'ouvrir le matin.",
    avatarSrc: DEMO_AVATAR,
    actions: ACTIONS,
    stats: [
      { label: "Abonnés", value: "1 284" },
      { label: "Projets", value: 37 },
      { label: "Ancienneté", value: "6 ans" },
    ],
    about: ABOUT,
    activity: ACTIVITY,
    settings: <Settings />,
    info: [
      { label: "E-mail", value: "claire.lemoine@exemple.fr" },
      { label: "Téléphone", value: "06 12 34 56 78" },
      { label: "Équipe", value: "Produit" },
      { label: "Arrivée", value: "mars 2019" },
    ],
    sidebar: TEAM,
    onTabChange: fn(),
    fullHeight: true,
  },
  argTypes: {
    name: { control: "text" },
    role: { control: "text" },
    location: { control: "text" },
    bio: { control: "text" },
    avatarSrc: { control: "text" },
    bannerSrc: { control: "text" },
    bannerColor: { control: "color" },
    stats: { control: "object" },
    info: { control: "object" },
    infoTitle: { control: "text", table: { defaultValue: { summary: '"Informations"' } } },
    tabLabels: { control: "object" },
    tab: { control: "inline-radio", options: ["about", "activity", "settings"] },
    defaultTab: { control: "inline-radio", options: ["about", "activity", "settings"] },
    fullHeight: { control: "boolean", table: { defaultValue: { summary: "false" } } },
    actions: { control: false },
    about: { control: false },
    activity: { control: false },
    settings: { control: false },
    sidebar: { control: false },
    onTabChange: { control: false },
  },
} satisfies Meta<typeof ProfilePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Tout ce que la page sait montrer, avec la bannière par défaut : les vagues prennent l'accent du thème, le bleu du CV." } } },
};

export const ImageBanner: Story = {
  name: "Bannière image",
  args: { bannerSrc: DEMO_BANNER, role: "Responsable produit", settings: undefined, sidebar: undefined },
  parameters: { docs: { description: { story: "`bannerSrc` : une image recadrée pour couvrir. Sans `settings`, l'onglet « Réglages » n'existe pas ; sans `sidebar`, la colonne n'a que la fiche." } } },
};

export const ColorBanner: Story = {
  name: "Bannière unie, un seul onglet",
  args: {
    name: "Hugo Martin",
    role: "Développeur front",
    location: undefined,
    bio: undefined,
    stats: undefined,
    avatarSrc: undefined,
    bannerColor: "var(--lq-color-fill-track)",
    actions: <Button onClick={fn()}>Modifier le profil</Button>,
    about: <p style={{ margin: 0 }}>Un seul onglet fourni : pas de barre d'onglets, le contenu s'affiche directement.</p>,
    activity: undefined,
    settings: undefined,
    info: undefined,
    sidebar: undefined,
  },
  parameters: { docs: { description: { story: "`bannerColor` accepte une variable du thème. Ni fiche ni `sidebar` : le contenu prend toute la largeur." } } },
};

export const InFrame: Story = {
  name: "Dans un cadre étroit",
  args: { fullHeight: false, role: "Responsable produit", settings: undefined, sidebar: undefined, bio: undefined },
  render: (args) => (
    <div style={{ padding: 30 }}>
      <div style={{ width: 420, height: 640, overflow: "auto", border: "1px solid var(--lq-color-border)" }}>
        <ProfilePage {...args} />
      </div>
    </div>
  ),
  parameters: { docs: { description: { story: "Dans un conteneur de 420 px, la colonne latérale passe sous les onglets et les marges se resserrent — la page lit la largeur de son conteneur, pas celle de la fenêtre." } } },
};
