import { useState } from "react";
import { Card, Text, Button, Toggle } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ScreenHead } from "../Specimen";
import { Input, RadioGroup, Checkbox, TagInput, type RadioOption } from "@michaelthomasjach/liseuse-dashboard-kit";

type Plan = "mensuel" | "annuel" | "perso";

const PLANS: RadioOption<Plan>[] = [
  { value: "mensuel", label: "Mensuel", description: "Sans engagement, résiliable à la fin de chaque mois." },
  { value: "annuel", label: "Annuel — deux mois offerts", description: "Facturé une fois par an, au prix de dix mois." },
  { value: "perso", label: "Sur mesure", description: "Volumes et conditions négociés avec notre équipe commerciale." },
];

/**
 * L'écran des formulaires : les contrôles du kit dans le thème.
 *
 * Tout ce qu'on attend d'un formulaire d'administration est là — champ, groupe radio, cases,
 * interrupteur, étiquettes. Le choix de la formule est le cas d'école du `RadioGroup` : des
 * libellés longs, empilés, une description sous chaque option — ce que ni une `Select` (les
 * options cachées) ni un `SegmentedControl` (des libellés courts, en ligne) ne rendent.
 */
export function Forms() {
  const [plan, setPlan] = useState<Plan | null>("annuel");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [notify, setNotify] = useState(true);
  const [tags, setTags] = useState<string[]>(["prioritaire", "grand compte"]);

  const emailError = email.length > 0 && !email.includes("@") ? "Adresse incomplète." : undefined;

  return (
    <div className="rdk-screen">
      <ScreenHead
        title="Formulaires"
        intro="Les contrôles du kit, habillés par la couche de thème — aucune règle locale."
      />

      <div className="rdk-grid rdk-grid--forms">
        <Card title="Compte client">
          <div className="rdk-stack">
            <Input label="Raison sociale" value={name} onChange={(e) => setName(e.target.value)} placeholder="Lemoine SAS" />
            <Input
              label="Courriel de facturation"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="compta@exemple.fr"
              error={emailError}
              helperText={emailError ? undefined : "Sert uniquement à l'envoi des factures."}
            />
            <RadioGroup label="Formule" options={PLANS} value={plan} onChange={setPlan} />
            <TagInput label="Étiquettes" value={tags} onChange={setTags} placeholder="Ajouter…" />
          </div>
        </Card>

        <Card title="Préférences" footer={<Button>Enregistrer</Button>}>
          <div className="rdk-stack">
            <Checkbox checked={consent} onChange={setConsent} label="Accepter les conditions générales de vente" />
            <div className="rdk-row">
              <Toggle checked={notify} onChange={setNotify} ariaLabel="Recevoir les alertes de facturation" />
              <Text size="sm">Recevoir les alertes de facturation</Text>
            </div>
            <Text size="sm" muted>
              La formule ci-contre est un groupe radio : une description sous chaque option, et les
              flèches du clavier pour passer de l'une à l'autre.
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}
