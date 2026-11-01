import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Toggle, Text, Panel, PanelRow } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * L'interrupteur marche / arrêt. Allumé, il prend le plein de l'accent du thème.
 */
const meta = {
  title: "Primitives/Toggle",
  component: Toggle,
  parameters: {
    docs: {
      description: {
        component: [
          "Interrupteur binaire. Il rend un `<button role=\"switch\">` dont `aria-checked` suit `checked` : Espace et Entrée le basculent au clavier, comme un clic.",
          "",
          "**Toujours contrôlé** — le composant ne tient aucun état : `checked` est obligatoire, et `onChange` reçoit la valeur **suivante**. Sans `onChange`, l'interrupteur reste figé.",
          "",
          "**Sans texte visible** — `ariaLabel` est obligatoire ; l'intitulé visible se pose à côté, dans un `Text`, ou mieux dans une `PanelRow` qui met le libellé à gauche et l'interrupteur à droite.",
          "",
          "**Quand l'utiliser** — un réglage qui prend effet tout de suite : activer les alertes, passer en maintenance. Pour une case qui ne vaut qu'à l'envoi d'un formulaire, préférez `Checkbox` ; pour plus de deux états, `SegmentedControl`.",
          "",
          "**Anatomie** — une piste en pilule de 44 × 24 px et une pastille qui glisse avec un léger rebond. Désactivé : 40 % d'opacité, dans l'état où il est figé.",
          "",
          "**Thème** — `--lq-color-fill` (piste allumée), `--lq-color-fill-track` (piste éteinte), `--lq-color-accent-contrast` (pastille allumée), `--lq-color-border`, `--lq-control-border-width`, `--lq-transition-base`.",
        ].join("\n"),
      },
    },
  },
  args: { checked: true, ariaLabel: "Alertes de paiement", onChange: fn() },
  // Contrôlé : la story tient l'état, le clic le bascule, et le contrôle `checked` le réécrit.
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked);
    useEffect(() => setChecked(args.checked), [args.checked]);
    return (
      <Toggle
        {...args}
        checked={checked}
        onChange={(next) => {
          setChecked(next);
          args.onChange?.(next);
        }}
      />
    );
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Off: Story = {
  name: "Éteint",
  args: { checked: false, ariaLabel: "Résumé hebdomadaire" },
};

export const Disabled: Story = {
  name: "Désactivé",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Toggle checked disabled ariaLabel="Journal d'audit" />
        <Text size="sm" muted>
          Journal d'audit (imposé par l'administrateur)
        </Text>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Toggle checked={false} disabled ariaLabel="Accès API" />
        <Text size="sm" muted>
          Accès API (formule supérieure)
        </Text>
      </div>
    </div>
  ),
  parameters: { docs: { description: { story: "Figé allumé ou éteint : on voit l'état, on ne peut pas le changer." } } },
};

export const InPanel: Story = {
  name: "Dans un panneau",
  render: function Render() {
    const [settings, setSettings] = useState({ alertes: true, resume: false, maintenance: false });
    const set = (key: keyof typeof settings) => (value: boolean) => setSettings((s) => ({ ...s, [key]: value }));
    const active = Object.values(settings).filter(Boolean).length;
    return (
      <div style={{ maxWidth: 420 }}>
        <Panel title="Notifications" meta={`${active} active${active > 1 ? "s" : ""}`}>
          <PanelRow label="Alertes de paiement">
            <Toggle checked={settings.alertes} onChange={set("alertes")} ariaLabel="Alertes de paiement" />
          </PanelRow>
          <PanelRow label="Résumé hebdomadaire par courriel">
            <Toggle checked={settings.resume} onChange={set("resume")} ariaLabel="Résumé hebdomadaire par courriel" />
          </PanelRow>
          <PanelRow label="Mode maintenance">
            <Toggle checked={settings.maintenance} onChange={set("maintenance")} ariaLabel="Mode maintenance" />
          </PanelRow>
        </Panel>
      </div>
    );
  },
  parameters: { docs: { description: { story: "L'usage courant : une `PanelRow` par réglage, le libellé à gauche, l'interrupteur à droite." } } },
};
