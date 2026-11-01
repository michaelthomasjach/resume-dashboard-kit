import { useState, type CSSProperties, type MouseEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fireEvent, fn } from "storybook/test";
import {
  ContextMenu,
  Button,
  Text,
  Badge,
  PencilIcon,
  CopyIcon,
  TrashIcon,
  MoreHorizontalIcon,
  type ContextMenuItem,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { ORDERS, statutTone } from "../../showcase/demoData";

const ITEMS: ContextMenuItem[] = [
  { label: "Modifier la commande", icon: <PencilIcon size={14} />, onSelect: fn(), hint: "E" },
  { label: "Dupliquer", icon: <CopyIcon size={14} />, onSelect: fn(), hint: "Ctrl+D" },
  { label: "Relancer le client", onSelect: fn(), disabled: true },
  { separator: true },
  { label: "Supprimer", icon: <TrashIcon size={14} />, onSelect: fn() },
];

const zone: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  maxWidth: 520,
  padding: "14px 16px",
  border: "1px dashed var(--lq-color-border)",
  borderRadius: "var(--lq-radius-md)",
};

const euros = (n: number) => `${n.toLocaleString("fr-FR")} €`;

/** Enveloppe chaque commande pour savoir, dans la story, laquelle vient d'être choisie. */
function tracked(items: ContextMenuItem[], onPick: (label: string) => void): ContextMenuItem[] {
  return items.map((item) =>
    item.separator
      ? item
      : {
          ...item,
          onSelect: () => {
            item.onSelect();
            onPick(item.label);
          },
        }
  );
}

/**
 * Le menu contextuel : une liste de commandes qui s'ouvre au clic droit, à l'endroit du clic, et
 * remplace celui du navigateur.
 */
const meta = {
  title: "Primitives/ContextMenu",
  component: ContextMenu,
  parameters: {
    docs: {
      description: {
        component: [
          "Menu de commandes ouvert à un point précis de l'écran — en général au clic droit sur une ligne, une carte, un point de graphique.",
          "",
          "**Ouverture** — le parent tient l'état. Dans le `onContextMenu` de l'élément, appelez `preventDefault()` puis gardez `{ x: e.clientX, y: e.clientY }` ; rendez `<ContextMenu x y items onClose />` tant que cet état existe et remettez-le à `null` dans `onClose`. Depuis un bouton « Actions », prenez le coin bas-gauche de son `getBoundingClientRect()`.",
          "",
          "**Fermeture** — Échap, un clic ailleurs, un défilement, un redimensionnement, et après chaque commande choisie : `onClose` est appelé dans tous les cas.",
          "",
          "**Commandes** — chaque entrée de `items` a un `label` (qui sert aussi de nom accessible), un `onSelect`, et en option une `icon`, un `hint` aligné à droite (un raccourci, ou ce sur quoi la commande agira) et `disabled` — grisée plutôt que retirée, pour que le menu garde la même forme d'un clic droit à l'autre. `{ separator: true }` trace un filet.",
          "",
          "**Clavier** — à l'ouverture, la première commande active prend le focus ; ↑ et ↓ circulent (en bouclant), Entrée choisit, Échap ferme. `role=\"menu\"` et `role=\"menuitem\"`, nommé par `ariaLabel` (« Menu contextuel » par défaut).",
          "",
          "**Rendu dans un portail**, en `position: fixed` : aucun `overflow: hidden` ne le rogne, et il se **retourne** (au lieu de se tasser) quand il déborderait de l'écran, comme un menu natif.",
          "",
          "**Quand l'utiliser** — des actions secondaires sur un objet. Le clic droit ne se devine pas et n'existe pas au toucher : offrez toujours un chemin visible vers les mêmes commandes, par exemple un bouton « Actions » qui ouvre ce même menu.",
          "",
          "**Thème** — `--lq-color-panel`, `--lq-color-border`, `--lq-radius-sm`, `--lq-color-hover` (commande survolée), `--lq-color-text-muted` (indications), `--lq-color-border-subtle` (séparateurs), `--lq-text-sm`, `--lq-space-2`, `--lq-space-4`.",
        ].join("\n"),
      },
    },
  },
  args: { x: 0, y: 0, items: ITEMS, onClose: fn(), ariaLabel: "Actions sur la commande" },
  argTypes: {
    x: { control: false },
    y: { control: false },
    items: { control: false },
  },
  render: function Render(args) {
    const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
    const [last, setLast] = useState<string | null>(null);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          data-zone
          style={zone}
          onContextMenu={(e) => {
            e.preventDefault();
            setMenu({ x: e.clientX, y: e.clientY });
          }}
        >
          <Text size="sm">Commande C-4821 — Lemoine SAS — 14 400 €</Text>
          <Text size="xs" muted as="span">
            clic droit
          </Text>
        </div>
        <Text size="sm" muted>
          {last ? `Dernière commande : ${last}` : "Clic droit dans la zone pour ouvrir le menu."}
        </Text>
        {menu ? (
          <ContextMenu
            {...args}
            x={menu.x}
            y={menu.y}
            items={tracked(args.items, setLast)}
            onClose={() => {
              setMenu(null);
              args.onClose();
            }}
          />
        ) : null}
      </div>
    );
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  // Sur le canevas seul, un clic droit simulé ouvre le menu.
  play: async ({ canvasElement }) => {
    const target = canvasElement.querySelector<HTMLElement>("[data-zone]");
    if (!target) return;
    const r = target.getBoundingClientRect();
    fireEvent.contextMenu(target, { clientX: r.left + 120, clientY: r.top + r.height / 2 });
  },
};

export const FromButton: Story = {
  name: "Depuis un bouton",
  render: function Render(args) {
    const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
    const open = (e: MouseEvent<HTMLButtonElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      setMenu({ x: r.left, y: r.bottom + 4 });
    };
    return (
      <div style={zone}>
        <Text size="sm">Commande C-4823 — Groupe Vallée — 48 000 €</Text>
        <Button icon={<MoreHorizontalIcon size={16} />} onClick={open}>
          Actions
        </Button>
        {menu ? <ContextMenu {...args} x={menu.x} y={menu.y} onClose={() => setMenu(null)} /> : null}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLButtonElement>("button")?.click();
  },
  parameters: {
    docs: { description: { story: "Le chemin visible vers les mêmes commandes : le menu s'ouvre sous le bouton, aligné sur son bord gauche." } },
  },
};

export const OnRows: Story = {
  name: "Sur les lignes d'une liste",
  render: function Render() {
    const [menu, setMenu] = useState<{ x: number; y: number; id: string } | null>(null);
    const [last, setLast] = useState<string | null>(null);
    const order = ORDERS.find((o) => o.id === menu?.id);
    return (
      <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ border: "1px solid var(--lq-color-border-subtle)", borderRadius: "var(--lq-radius-md)" }}>
          {ORDERS.slice(0, 5).map((o, i) => (
            <div
              key={o.id}
              onContextMenu={(e) => {
                e.preventDefault();
                setMenu({ x: e.clientX, y: e.clientY, id: o.id });
              }}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr auto auto",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderTop: i ? "1px solid var(--lq-color-border-subtle)" : undefined,
                background: menu?.id === o.id ? "var(--lq-color-hover)" : undefined,
              }}
            >
              <Text size="sm" weight="medium" as="span">
                {o.id}
              </Text>
              <Text size="sm" as="span">
                {o.client}
              </Text>
              <Text size="sm" as="span">
                {euros(o.montant)}
              </Text>
              <Badge tone={statutTone(o.statut)}>{o.statut}</Badge>
            </div>
          ))}
        </div>
        <Text size="sm" muted>
          {last ?? "Clic droit sur une ligne : l'indication à droite de chaque commande rappelle la commande visée."}
        </Text>
        {menu && order ? (
          <ContextMenu
            x={menu.x}
            y={menu.y}
            ariaLabel={`Actions sur ${order.id}`}
            onClose={() => setMenu(null)}
            items={[
              { label: "Ouvrir", hint: order.id, onSelect: () => setLast(`Ouvrir ${order.id}`) },
              { label: "Relancer le client", hint: order.client, onSelect: () => setLast(`Relance envoyée à ${order.client}`), disabled: order.statut === "payée" },
              { separator: true },
              { label: "Annuler la commande", onSelect: () => setLast(`${order.id} annulée`), disabled: order.statut === "annulée" },
            ]}
          />
        ) : null}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Un seul menu pour toute la liste : l'état retient la ligne visée, et les commandes impossibles pour elle sont grisées plutôt que retirées.",
      },
    },
  },
};
