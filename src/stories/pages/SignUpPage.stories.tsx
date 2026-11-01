import { useState, type FormEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SignUpPage, Input, InputPassword, Checkbox, Button, Badge, type SignUpPageProps } from "@michaelthomasjach/liseuse-dashboard-kit";

/** L'image des pages d'accès, aux teintes du thème (une image ne lit pas les variables CSS). */
const ACCESS_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1400">
      <defs>
        <linearGradient id="g" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stop-color="#1c1f5c"/>
          <stop offset="1" stop-color="#3a41e2"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="1400" fill="url(#g)"/>
    </svg>
  `);

const LOGO = (
  <span style={{ fontSize: "1.375rem", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.04em", color: "var(--lq-color-text)" }}>resume</span>
);

/** L'espacement de la zone de formulaire du kit, pour un `<form>` à soi et pour le bloc des conditions. */
const FORM_STYLE = { display: "flex", flexDirection: "column", gap: "var(--lq-space-4)" } as const;

type Fields = { name: string; email: string; password: string };

/** Une inscription de démonstration. Le formulaire porte un identifiant : le bouton d'envoi, rendu
 *  dans `terms` hors du `<form>`, s'y rattache par l'attribut `form`. */
function signUp(initial: Fields, initialTerms: boolean, validateOnMount: boolean) {
  return function Render(args: SignUpPageProps) {
    const [fields, setFields] = useState(initial);
    const [terms, setTerms] = useState(initialTerms);
    const validate = (f: Fields) => ({
      name: f.name.trim() ? undefined : "Indiquez votre nom.",
      email: f.email.includes("@") ? undefined : "Saisissez une adresse e-mail valide.",
      password: f.password.length >= 12 ? undefined : "12 caractères au moins.",
    });
    const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>(validateOnMount ? validate(initial) : {});
    const [done, setDone] = useState(false);
    const set = (key: keyof Fields) => (e: { target: { value: string } }) => setFields((prev) => ({ ...prev, [key]: e.target.value }));

    const submit = (e: FormEvent) => {
      e.preventDefault();
      const next = validate(fields);
      setErrors(next);
      setDone(!next.name && !next.email && !next.password);
    };

    return (
      <SignUpPage
        {...args}
        terms={
          <div style={FORM_STYLE}>
            <Checkbox checked={terms} onChange={setTerms} label="J'accepte les conditions générales et la politique de confidentialité" />
            <Button type="submit" form="inscription" block selected disabled={!terms}>
              Créer mon compte
            </Button>
            {done && <Badge tone="up">Compte créé (démonstration)</Badge>}
          </div>
        }
      >
        <form id="inscription" style={FORM_STYLE} onSubmit={submit} noValidate>
          <Input label="Nom complet" autoComplete="name" placeholder="Claire Lemoine" value={fields.name} onChange={set("name")} error={errors.name} />
          <Input
            label="Adresse e-mail professionnelle"
            type="email"
            autoComplete="email"
            placeholder="vous@entreprise.fr"
            value={fields.email}
            onChange={set("email")}
            error={errors.email}
          />
          <InputPassword
            label="Mot de passe"
            autoComplete="new-password"
            helperText="12 caractères au moins."
            value={fields.password}
            onChange={set("password")}
            error={errors.password}
          />
        </form>
      </SignUpPage>
    );
  };
}

/**
 * La page d'inscription plein écran : la mise en page de `LoginPage`, avec une place pour les conditions
 * générales.
 */
const meta = {
  title: "Pages/SignUpPage",
  component: SignUpPage,
  parameters: {
    layout: "fullscreen", rdkPadding: 0,
    docs: {
      story: { inline: false, iframeHeight: "680px" },
      description: {
        component: [
          "**Page d'inscription** plein écran — la même mise en page que `LoginPage` : une image sur les trois quarts de la largeur, un panneau centré dans le dernier quart. Elle ajoute un emplacement `terms` entre le formulaire et le pied de page.",
          "",
          "**Quand l'utiliser** — la création de compte ou l'acceptation d'une invitation. Pour la connexion, `LoginPage`.",
          "",
          "**Anatomie** — `imageSrc` (obligatoire), `imageAlt`, `logo`, `title` (`<h1>`), `subtitle`, `children` (les champs), `terms` (la case de conditions générales, ou toute mention à accepter), `footer` (« Déjà un compte ? »).",
          "",
          "**Le formulaire** — champs, validation et envoi sont à vous (`autoComplete=\"new-password\"` déclenche la suggestion de mot de passe). Avec `onSubmit`, le kit enveloppe **les champs et `terms`** dans un même `<form>` : le bouton d'envoi peut se placer sous la case, et une case `required` y prend part à la validation (story « Dans un cadre »). Sans `onSubmit`, `terms` est rendu hors de `children` : un bouton placé sous la case se rattache à votre `<form>` par l'attribut `form=\"…\"`, comme dans les autres stories. Un `<form>` passé en enfant reçoit l'espacement du kit.",
          "",
          "**Conditions générales** — le bouton reste désactivé tant que la case n'est pas cochée : c'est l'usage, pas un comportement du kit, qui ne relie pas `terms` à l'envoi.",
          "",
          "**Hauteur et écran étroit** — par défaut (`fullHeight`), au moins toute la hauteur de la fenêtre, et sous **900 px** de fenêtre l'image disparaît. Avec `fullHeight={false}`, la page remplit son conteneur et le seuil se mesure sur sa propre largeur.",
          "",
          "**Thème** — celui de `LoginPage` : `--lq-color-bg`, `--lq-color-text`, `--lq-color-text-muted`, `--lq-font-weight-bold`, `--lq-space-4` à `--lq-space-6`.",
        ].join("\n"),
      },
    },
  },
  args: {
    imageSrc: ACCESS_IMAGE,
    imageAlt: "",
    logo: LOGO,
    title: "Créer un compte",
    subtitle: "Quelques informations pour ouvrir votre espace.",
    footer: <span>Déjà un compte ? Connectez-vous.</span>,
    children: null,
  },
  argTypes: {
    imageSrc: { control: "text" },
    imageAlt: { table: { defaultValue: { summary: '""' } } },
    logo: { control: false },
    terms: { control: false },
    footer: { control: false },
    children: { control: false },
  },
  render: signUp({ name: "", email: "", password: "" }, false, false),
} satisfies Meta<typeof SignUpPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Le bouton s'active quand la case est cochée ; l'envoi vérifie chaque champ." } } },
};

export const WithErrors: Story = {
  name: "Erreurs de validation",
  render: signUp({ name: "Claire Lemoine", email: "claire.lemoine", password: "octobre" }, true, true),
  parameters: { docs: { description: { story: "Après un envoi refusé : l'adresse est incomplète, le mot de passe trop court ; l'aide du mot de passe cède la place à l'erreur." } } },
};

export const Invitation: Story = {
  name: "Invitation",
  args: { title: "Rejoindre Lemoine SAS", subtitle: "Hugo Mercier vous invite dans l'espace de son équipe.", footer: undefined },
  render: signUp({ name: "", email: "ines.roux@lemoine.fr", password: "" }, false, false),
  parameters: { docs: { description: { story: "La même page pour accepter une invitation : l'adresse est déjà connue." } } },
};

export const InFrame: Story = {
  name: "Dans un cadre",
  args: { fullHeight: false },
  render: function Render(args) {
    const [terms, setTerms] = useState(false);
    const [sent, setSent] = useState(false);
    return (
      <div style={{ padding: 30 }}>
        <div style={{ width: 760, height: 600, border: "1px solid var(--lq-color-border)", overflow: "auto" }}>
          <SignUpPage
            {...args}
            subtitle={sent ? "Formulaire envoyé (démonstration)." : args.subtitle}
            onSubmit={() => setSent(true)}
            terms={
              <div style={FORM_STYLE}>
                <Checkbox checked={terms} onChange={setTerms} label="J'accepte les conditions générales et la politique de confidentialité" />
                <Button type="submit" block selected disabled={!terms}>
                  Créer mon compte
                </Button>
              </div>
            }
          >
            <Input label="Nom complet" autoComplete="name" placeholder="Claire Lemoine" />
            <Input label="Adresse e-mail professionnelle" type="email" autoComplete="email" placeholder="vous@entreprise.fr" />
          </SignUpPage>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "`fullHeight={false}` dans un cadre étroit, et `onSubmit` : champs, case et bouton sont dans le même `<form>` du kit — plus besoin de l'attribut `form=\"…\"`.",
      },
    },
  },
};
