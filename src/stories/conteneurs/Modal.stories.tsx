import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Modal, Button, PanelRow, Text, Badge, IconButton, CopyIcon, type ModalProps } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ORDERS, statutTone } from "../../showcase/demoData";

const euros = (n: number) => `${n.toLocaleString("fr-FR")} €`;

/** Un bouton qui ouvre la fenêtre ; elle se ferme par la croix, Échap, le voile ou le pied. */
function ModalDemo({ label, primary = false, modal }: { label: string; primary?: boolean; modal: (close: () => void) => Omit<ModalProps, "open" | "onClose"> & { onClose?: () => void } }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const { onClose, ...props } = modal(close);
  return (
    <>
      <Button selected={primary} onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Modal
        {...props}
        open={open}
        onClose={() => {
          close();
          onClose?.();
        }}
      />
    </>
  );
}

const discountFooter = (close: () => void): ReactNode => (
  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", width: "100%" }}>
    <Button onClick={close}>Annuler</Button>
    <Button selected onClick={close}>
      Confirmer la remise
    </Button>
  </div>
);

/**
 * La fenêtre modale : un dialogue centré sur un voile, déplaçable par son en-tête.
 */
const meta = {
  title: "Primitives/Modal",
  component: Modal,
  parameters: {
    docs: {
      description: {
        component: [
          "Dialogue centré au-dessus d'un voile, pour le détail d'une ligne, une confirmation, un petit formulaire. En-tête (`title`, actions facultatives `headerActions`, croix de fermeture), corps, pied.",
          "",
          "**Toujours contrôlé** — `open` et `onClose` sont obligatoires ; la fenêtre n'est rendue que tant que `open` est vrai. `onClose` est appelé par la croix, la touche Échap, un clic sur le voile et le bouton de pied par défaut.",
          "",
          "**Corps** — une colonne dont les enfants sont espacés de `--lq-space-4` : regroupez dans un même `<div>` les `PanelRow` qui doivent s'enchaîner sans écart.",
          "",
          "**Pied** — absent, c'est un bouton « Fermer » pleine largeur (`closeLabel` en change le texte) ; `footer={null}` le retire ; tout autre nœud le remplace (Annuler / Confirmer…).",
          "",
          "**Tailles** — `default` : le petit dialogue ; `wide` : une largeur fixe et confortable pour un contenu qui a sa propre mise en page (une liste et ses filtres côte à côte) ; `fullscreen` : presque tout l'écran, pour un éditeur ou un détail riche. Sur un téléphone (640 px et moins), toutes deviennent une page entière dont l'en-tête reste collé en haut.",
          "",
          "**Déplaçable** — avec un `title`, l'en-tête sert de poignée : on glisse la fenêtre, qui revient au centre à chaque ouverture. Un bouton placé dans `headerActions` doit arrêter la propagation de son `pointerdown`, sinon un clic commence un glisser.",
          "",
          "**Rendu dans un portail** (`document.body`), en reprenant le thème courant : aucun ancêtre en `overflow: hidden` ou contexte d'empilement isolé ne peut le recouvrir. `role=\"dialog\"`, `aria-modal`, nommé par `title` s'il est textuel.",
          "",
          "**Focus** — à l'ouverture, il entre dans la fenêtre : sur un élément `autoFocus` ou `data-autofocus` s'il y en a un, sinon sur le premier contrôle hors de la croix d'en-tête (souvent le bouton de pied), sinon sur la fenêtre elle-même. Tab et Maj+Tab y bouclent tant qu'elle est ouverte, et à la fermeture le focus revient à l'élément qui l'avait — le bouton d'ouverture. La croix d'en-tête porte `closeLabel` comme nom accessible, comme le bouton de pied.",
          "",
          "**Quand l'utiliser** — une tâche courte qui interrompt volontairement la page. Pour une information non bloquante, `Notification` ; pour un contenu ancré à un bouton, `Popover` ; pour une recherche globale, `SearchOverlay`.",
          "",
          "**Thème** — `--lq-color-overlay` (voile), `--lq-color-panel`, `--lq-color-border`, `--lq-radius-lg`, `--lq-shadow-modal`, `--lq-space-2` à `--lq-space-5`, `--lq-font-weight-bold` (titre) ; le bouton de pied `--lq-color-fill`, `--lq-color-accent-contrast`, `--lq-radius-md`, `--lq-color-focus-ring`.",
        ].join("\n"),
      },
    },
  },
  args: {
    open: false,
    onClose: fn(),
    title: "Accorder une remise",
    children: (
      <>
        <Text size="sm">Une remise de 10 % sera appliquée à la prochaine facture de Lemoine SAS.</Text>
        <div>
          <PanelRow label="Montant actuel" value="14 400 €" />
          <PanelRow label="Après remise" value="12 960 €" />
        </div>
      </>
    ),
  },
  argTypes: {
    open: { control: false },
    title: { control: "text" },
    children: { control: false },
    footer: { control: false },
    headerActions: { control: false },
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button selected onClick={() => setOpen(true)}>
          Accorder une remise
        </Button>
        <Modal
          {...args}
          open={open}
          onClose={() => {
            setOpen(false);
            args.onClose();
          }}
        />
      </>
    );
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sur le canevas seul, la story ouvre la fenêtre. */
const openFirstButton = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  canvasElement.querySelector<HTMLButtonElement>("button")?.click();
};

export const Default: Story = {
  name: "Défaut",
  play: openFirstButton,
};

export const CustomFooter: Story = {
  name: "Pied personnalisé",
  render: () => (
    <ModalDemo
      label="Accorder une remise"
      primary
      modal={(close) => ({
        title: "Accorder une remise",
        footer: discountFooter(close),
        children: (
          <>
            <Text size="sm">Une remise de 10 % sera appliquée à la prochaine facture de Lemoine SAS.</Text>
            <div>
              <PanelRow label="Montant actuel" value="14 400 €" />
              <PanelRow label="Après remise" value="12 960 €" />
            </div>
          </>
        ),
      })}
    />
  ),
  play: openFirstButton,
  parameters: { docs: { description: { story: "`footer` remplace le bouton « Fermer » par les deux actions de la décision." } } },
};

export const Wide: Story = {
  name: "Large",
  render: () => (
    <ModalDemo
      label="Voir le client"
      modal={() => ({
        title: "Lemoine SAS",
        size: "wide",
        footer: null,
        children: (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <PanelRow label="Client depuis" value="mars 2021" />
              <PanelRow label="Chiffre d'affaires cumulé" value="68 200 €" />
              <PanelRow label="Statut" value={<Badge tone="up">à jour</Badge>} />
            </div>
            <div>
              {ORDERS.slice(0, 4).map((o) => (
                <PanelRow key={o.id} label={`${o.id} — ${o.produit}`} value={euros(o.montant)} />
              ))}
            </div>
          </div>
        ),
      })}
    />
  ),
  play: openFirstButton,
  parameters: { docs: { description: { story: "`size=\"wide\"` et `footer={null}` : deux colonnes côte à côte, fermeture par la croix ou Échap." } } },
};

export const Fullscreen: Story = {
  name: "Plein écran",
  render: () => (
    <ModalDemo
      label="Ouvrir le journal des commandes"
      modal={() => ({
        title: "Journal des commandes — octobre 2026",
        size: "fullscreen",
        children: (
          <div>
            {ORDERS.map((o) => (
              <PanelRow
                key={o.id}
                label={`${o.id} · ${o.date} · ${o.client} — ${o.produit} × ${o.quantite}`}
                value={
                  <span style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>
                    {euros(o.montant)}
                    <Badge tone={statutTone(o.statut)}>{o.statut}</Badge>
                  </span>
                }
              />
            ))}
          </div>
        ),
      })}
    />
  ),
  play: openFirstButton,
};

export const HeaderActions: Story = {
  name: "Actions d'en-tête",
  render: () => (
    <ModalDemo
      label="Voir la facture"
      modal={() => ({
        title: "Facture F-2026-0412",
        headerActions: (
          <span onPointerDown={(e) => e.stopPropagation()}>
            <IconButton size="sm" icon={<CopyIcon size={14} />} ariaLabel="Copier le numéro" />
          </span>
        ),
        children: (
          <div>
            <PanelRow label="Abonnement annuel × 12" value="12 000 €" />
            <PanelRow label="TVA 20 %" value="2 400 €" />
            <PanelRow label="Total TTC" value="14 400 €" />
          </div>
        ),
      })}
    />
  ),
  play: openFirstButton,
  parameters: {
    docs: { description: { story: "Un bouton dans la barre de titre, à gauche de la croix. Son enveloppe arrête le `pointerdown`, pour qu'un clic ne commence pas un glisser." } },
  },
};
