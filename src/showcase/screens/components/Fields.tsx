import { useRef, useState } from "react";
import { Button, Text } from "@michaelthomasjach/liseuse-dashboard-kit";
import {
  Input,
  MaskedInput,
  PhoneInput,
  CreditCardInput,
  InputNumber,
  InputPassword,
  InputDropdown,
  Select,
  Popover,
  TagInput,
  Tag,
  Chip,
  ChipGroup,
  Checkbox,
  CheckboxButton,
  Dropzone,
  WysiwygEditor,
  RadioGroup,
  Radio,
  Textarea,
  SearchIcon,
  UserIcon,
  type InputDropdownOption,
  type TagInputSuggestion,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { Specimen, SpecimenGrid, SpecimenScreen } from "../../Specimen";

const CLIENTS: InputDropdownOption[] = [
  { value: "lemoine", label: "Lemoine SAS", description: "Lyon · grand compte", group: "Actifs" },
  { value: "atelier-roux", label: "Atelier Roux", description: "Nantes · PME", group: "Actifs" },
  { value: "berthier", label: "Berthier & Fils", description: "Lille · PME", group: "Actifs" },
  { value: "cabinet-morel", label: "Cabinet Morel", description: "Bordeaux · profession libérale", group: "Actifs" },
  { value: "noria", label: "Noria Logistique", description: "Marseille · résilié en septembre", group: "Archivés" },
];

const ROLES = [
  { value: "admin", label: "Administrateur" },
  { value: "editeur", label: "Éditeur" },
  { value: "lecteur", label: "Lecteur" },
  { value: "facturation", label: "Facturation seule", disabled: true },
];

const PAYS = [
  { value: "fr", label: "France" },
  { value: "be", label: "Belgique" },
  { value: "ch", label: "Suisse" },
];

const SEGMENTS: TagInputSuggestion[] = [
  { value: "grand-compte", label: "Grand compte", description: "Plus de 50 000 € par an" },
  { value: "pme", label: "PME", description: "De 10 à 250 salariés" },
  { value: "public", label: "Secteur public" },
  { value: "export", label: "Export", description: "Facturé hors zone euro" },
];

const STATUTS = [
  { value: "payee", label: "Payée", count: 128 },
  { value: "attente", label: "En attente", count: 14 },
  { value: "retard", label: "En retard", count: 3 },
  { value: "annulee", label: "Annulée", count: 7 },
] as const;
type Statut = (typeof STATUTS)[number]["value"];

const CANAUX = [
  { value: "web", label: "Site" },
  { value: "mobile", label: "Application" },
  { value: "revendeur", label: "Revendeur" },
  { value: "api", label: "API", disabled: true },
] as const;
type Canal = (typeof CANAUX)[number]["value"];

const FORMULES = [
  { value: "mensuel", label: "Mensuel", description: "29 € par mois, sans engagement." },
  { value: "annuel", label: "Annuel", description: "290 € par an : deux mois offerts." },
  { value: "perso", label: "Sur mesure", description: "Au-delà de 50 utilisateurs, sur devis." },
  { value: "essai", label: "Essai gratuit", description: "Déjà utilisé sur ce compte.", disabled: true },
];

const ENVOIS = [
  { value: "courriel", label: "Courriel" },
  { value: "courrier", label: "Courrier" },
  { value: "les-deux", label: "Les deux" },
];

const NOTE_INITIALE =
  "<h3>Relance trimestrielle</h3><p>Le client a demandé un <strong>report d'échéance</strong> pour la facture F-2041. " +
  "Accord de principe, sous réserve de :</p><ul><li>un premier versement avant le 15 ;</li><li>la mise à jour du RIB.</li></ul>";

/**
 * La planche des champs : tout ce qui se saisit dans le kit, du champ texte à l'éditeur riche.
 *
 * Chaque contrôle y est vivant — l'état est tenu ici, comme dans un vrai formulaire — et montré
 * dans les états qui comptent sur un écran d'administration : aide, erreur, désactivé. Les champs
 * masqués (téléphone, carte, IBAN) rendent les chiffres bruts à l'application, d'où la valeur
 * stockée affichée sous chacun.
 */
export function Fields() {
  const [raison, setRaison] = useState("Lemoine SAS");
  const [siret, setSiret] = useState("1234");
  const [iban, setIban] = useState("7630006000011234567890189");
  const [phone, setPhone] = useState("0612345678");
  const [card, setCard] = useState("4242424242424242");
  const [quantite, setQuantite] = useState<number | "">(12);
  const [remise, setRemise] = useState<number | "">(7.5);
  const [budget, setBudget] = useState<number | "">(2400);
  const [password, setPassword] = useState("motdepasse");
  const [client, setClient] = useState<string | null>("lemoine");
  const [role, setRole] = useState<string | null>("editeur");
  const [pays, setPays] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverAnchor = useRef<HTMLSpanElement>(null);
  const [archives, setArchives] = useState(false);
  const [brouillons, setBrouillons] = useState(true);
  const [tags, setTags] = useState<string[]>(["relance", "prioritaire"]);
  const [segments, setSegments] = useState<string[]>(["grand-compte"]);
  const [etiquettes, setEtiquettes] = useState(["Lyon", "Q4 2026", "Prioritaire"]);
  const [vue, setVue] = useState<"toutes" | "miennes">("toutes");
  const [statut, setStatut] = useState<Statut | null>("attente");
  const [canaux, setCanaux] = useState<Canal[]>(["web", "mobile"]);
  const [notifications, setNotifications] = useState({ factures: true, relances: true, rapports: false });
  const [filtres, setFiltres] = useState({ actions: true, obligations: false, fonds: true });
  const [files, setFiles] = useState<File[]>(() => [
    new File(["x".repeat(184_000)], "releve-octobre-2026.pdf", { type: "application/pdf" }),
  ]);
  const [note, setNote] = useState(NOTE_INITIALE);
  const [formule, setFormule] = useState("annuel");
  const [envoi, setEnvoi] = useState<string | null>(null);
  const [relance, setRelance] = useState("douce");
  const [commentaire, setCommentaire] = useState("Client fidèle depuis 2021. Préfère être appelé le matin.");
  const [motif, setMotif] = useState("");
  const [courriel, setCourriel] = useState("compta@lemoine.fr");

  const toutesNotifs = Object.values(notifications);
  const toutCoche = toutesNotifs.every(Boolean);
  const partiel = !toutCoche && toutesNotifs.some(Boolean);

  return (
    <SpecimenScreen
      title="Champs"
      intro="Tout ce qui se saisit : champs texte, masqués, numériques, listes, étiquettes, cases, boutons radio, texte long et éditeur riche."
    >
      <SpecimenGrid>
        <Specimen name="Input" description="Le champ texte de base, avec ses états d'aide, d'erreur et de désactivation.">
          <Input
            label="Raison sociale"
            value={raison}
            onChange={(e) => setRaison(e.target.value)}
            leadingIcon={<UserIcon size={16} />}
            helperText="Telle qu'elle figure sur le Kbis."
          />
          <Input
            label="SIRET"
            value={siret}
            onChange={(e) => setSiret(e.target.value.replace(/\D/g, ""))}
            error={siret.length === 14 ? undefined : "Le SIRET compte 14 chiffres."}
          />
          <Input label="Identifiant interne" value="CLI-00418" disabled readOnly />
          <Input label="Recherche rapide" size="small" placeholder="Taille réduite, pour une barre d'outils…" leadingIcon={<SearchIcon size={14} />} />
        </Specimen>

        <Specimen
          name="Input"
          description="Le libellé dans la boîte (labelPosition « inside ») : il rétrécit dès que le champ prend le focus ou une valeur, et un champ requis porte un astérisque dans son coin."
        >
          <div className="rdk-stack rdk-stack--inset">
            <Input labelPosition="inside" label="Projet" required />
            <div className="rdk-row rdk-row--fill rdk-row--inset">
              <Input labelPosition="inside" label="Prénom" required />
              <Input labelPosition="inside" label="Nom" />
            </div>
            <Input labelPosition="inside" label="Mot de passe" type="password" required />
            <Input labelPosition="inside" label="Courriel" placeholder="ex. : nom@exemple.fr" required />
            <Input labelPosition="inside" label="Désactivé" placeholder="Rien à saisir ici" disabled />
          </div>
        </Specimen>

        <Specimen name="Input" description="L'état de succès : un message de confirmation sous le champ, ou le filet seul (success booléen), l'aide restant en place.">
          <Input
            label="Adresse de facturation"
            type="email"
            value={courriel}
            onChange={(e) => setCourriel(e.target.value)}
            success={courriel.includes("@") ? "Adresse vérifiée." : undefined}
            error={courriel.includes("@") ? undefined : "Adresse incomplète."}
          />
          <Input label="Code promotionnel" defaultValue="AUTOMNE26" success helperText="Remise de 10 % appliquée au panier." />
        </Specimen>

        <Specimen name="RadioGroup · Radio" description="Un choix exclusif à libellés longs : empilé avec une description par option, en ligne, ou en erreur ; et la case seule.">
          <RadioGroup label="Formule" options={FORMULES} value={formule} onChange={setFormule} helperText="Modifiable à chaque échéance." />
          <RadioGroup
            label="Envoi des factures"
            orientation="horizontal"
            options={ENVOIS}
            value={envoi}
            onChange={setEnvoi}
            required
            error={envoi ? undefined : "Choisissez un mode d'envoi."}
          />
          <div className="rdk-wrap">
            <Radio name="relance" value="douce" label="Relance douce" checked={relance === "douce"} onChange={setRelance} />
            <Radio name="relance" value="ferme" label="Mise en demeure" checked={relance === "ferme"} onChange={setRelance} />
            <Radio name="relance-off" value="off" label="Désactivée" disabled />
          </div>
        </Specimen>

        <Specimen name="Textarea" description="Le texte long : hauteur qui suit la saisie et compteur, libellé dans la boîte, erreur ou succès.">
          <Textarea
            label="Commentaire interne"
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            autoResize
            minRows={2}
            maxRows={6}
            maxLength={240}
            showCount
            helperText="Visible de l'équipe seulement."
          />
          <Textarea
            labelPosition="inside"
            label="Motif du litige"
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            rows={3}
            error={motif.length >= 10 ? undefined : "Dix caractères au moins."}
          />
          <Textarea label="Adresse de livraison" defaultValue={"48 quai Saint-Vincent\n69001 Lyon"} rows={2} resize="none" success="Adresse reconnue." />
        </Specimen>

        <Specimen name="MaskedInput · PhoneInput · CreditCardInput"description="Des champs à motif : l'application ne garde que les chiffres.">
          <MaskedInput label="IBAN" mask="FR## #### #### #### #### #### ###" value={iban} onChange={setIban} />
          <div className="rdk-row rdk-row--fill">
            <PhoneInput label="Téléphone" value={phone} onChange={setPhone} />
            <CreditCardInput label="Carte de paiement" value={card} onChange={setCard} />
          </div>
          <Text size="sm" muted>
            Valeurs stockées : {phone || "—"} · {card || "—"}
          </Text>
        </Specimen>

        <Specimen name="InputNumber" description="Saisie numérique avec pas, bornes, préfixe ou suffixe — « , » et « . » acceptés.">
          <div className="rdk-row rdk-row--fill">
            <InputNumber label="Quantité" value={quantite} onChange={setQuantite} min={1} max={999} step={1} />
            <InputNumber label="Remise" value={remise} onChange={setRemise} min={0} max={100} step={0.5} suffix="%" />
          </div>
          <InputNumber
            label="Budget mensuel"
            value={budget}
            onChange={setBudget}
            min={0}
            step={100}
            suffix="€"
            error={budget !== "" && budget > 5000 ? "Au-delà de 5 000 €, une validation est requise." : undefined}
            helperText="Plafond sans validation : 5 000 €."
          />
        </Specimen>

        <Specimen name="InputPassword" description="Masqué par défaut, avec un bouton pour l'afficher.">
          <InputPassword
            label="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={password.length < 12 ? "12 caractères au minimum." : undefined}
          />
          <InputPassword label="Clé d'API" value="sk_live_51Hc2kq" disabled readOnly helperText="Régénérée le 2 octobre." />
        </Specimen>

        <Specimen name="InputDropdown" description="Une liste qu'on filtre en tapant : groupes, seconde ligne, effacement.">
          <InputDropdown
            label="Client"
            options={CLIENTS}
            value={client}
            onChange={(v) => setClient(v)}
            onClear={() => setClient(null)}
            placeholder="Rechercher un client…"
            leadingIcon={<SearchIcon size={16} />}
            helperText="Nom, ville ou segment."
          />
        </Specimen>

        <Specimen name="Select" description="La liste déroulante fermée, avec une option indisponible et un état d'erreur.">
          <Select label="Rôle" options={ROLES} value={role} onChange={setRole} />
          <Select
            label="Pays de facturation"
            options={PAYS}
            value={pays}
            onChange={setPays}
            placeholder="Choisir un pays"
            error={pays ? undefined : "Requis pour calculer la TVA."}
          />
          <Select label="Devise" options={[{ value: "eur", label: "Euro (€)" }]} value="eur" onChange={() => {}} disabled size="small" />
        </Specimen>

        <Specimen name="Popover" description="Le panneau flottant sur lequel reposent les listes — ici, un menu de filtres maison.">
          <div className="rdk-row">
            <span ref={popoverAnchor} className="rdk-anchor">
              <Button onClick={() => setPopoverOpen((o) => !o)}>Filtres avancés</Button>
            </span>
            <Text size="sm" muted>
              {[archives && "archives", brouillons && "brouillons"].filter(Boolean).join(" · ") || "aucun filtre"}
            </Text>
          </div>
          <Popover open={popoverOpen} onClose={() => setPopoverOpen(false)} anchorRef={popoverAnchor}>
            <div className="rdk-stack rdk-popover-pad">
              <Checkbox checked={archives} onChange={setArchives} label="Inclure les clients archivés" />
              <Checkbox checked={brouillons} onChange={setBrouillons} label="Inclure les devis en brouillon" />
              <Button onClick={() => setPopoverOpen(false)}>
                Appliquer
              </Button>
            </div>
          </Popover>
        </Specimen>

        <Specimen name="TagInput" description="Virgule ou Entrée pour ajouter ; avec suggestions, une liste s'ouvre sous le champ.">
          <TagInput label="Mots-clés" value={tags} onChange={setTags} placeholder="Ajouter…" maxTags={5} helperText="Cinq au maximum." />
          <TagInput
            label="Segments"
            value={segments}
            onChange={setSegments}
            suggestions={SEGMENTS}
            restrictToSuggestions
            placeholder="Choisir un segment…"
          />
        </Specimen>

        <Specimen name="Tag" description="L'étiquette seule — retirable ou non.">
          <div className="rdk-wrap">
            {etiquettes.map((t) => (
              <Tag key={t} onRemove={() => setEtiquettes((all) => all.filter((x) => x !== t))} removeLabel={`Retirer ${t}`}>
                {t}
              </Tag>
            ))}
            <Tag>Lecture seule</Tag>
          </div>
          {etiquettes.length < 3 ? (
            <Button onClick={() => setEtiquettes(["Lyon", "Q4 2026", "Prioritaire"])}>
              Rétablir
            </Button>
          ) : null}
        </Specimen>

        <Specimen name="Chip · ChipGroup" description="Des puces de filtre : choix unique avec « Tout », ou multiple.">
          <div className="rdk-wrap">
            <Chip selected={vue === "toutes"} onClick={() => setVue("toutes")}>
              Toutes les factures
            </Chip>
            <Chip selected={vue === "miennes"} onClick={() => setVue("miennes")} count={23}>
              Mes dossiers
            </Chip>
          </div>
          <ChipGroup<Statut> label="Statut" options={[...STATUTS]} value={statut} onChange={setStatut} allLabel="Tout" />
          <ChipGroup<Canal> label="Canal" multiple options={[...CANAUX]} value={canaux} onChange={setCanaux} />
        </Specimen>

        <Specimen name="Checkbox" description="Case à cocher, avec l'état intermédiaire d'un groupe partiellement coché.">
          <Checkbox
            checked={toutCoche}
            indeterminate={partiel}
            onChange={(c) => setNotifications({ factures: c, relances: c, rapports: c })}
            label={<strong>Toutes les notifications</strong>}
          />
          <div className="rdk-stack rdk-indent">
            <Checkbox checked={notifications.factures} onChange={(c) => setNotifications((n) => ({ ...n, factures: c }))} label="Factures émises" />
            <Checkbox checked={notifications.relances} onChange={(c) => setNotifications((n) => ({ ...n, relances: c }))} label="Relances automatiques" />
            <Checkbox checked={notifications.rapports} onChange={(c) => setNotifications((n) => ({ ...n, rapports: c }))} label="Rapport hebdomadaire" />
          </div>
          <Checkbox checked onChange={() => {}} label="Journal d'audit (imposé par l'administrateur)" disabled />
        </Specimen>

        <Specimen name="CheckboxButton" description="Une case qui a l'allure d'un bouton — pour les filtres de catégorie.">
          <div className="rdk-wrap">
            <CheckboxButton checked={filtres.actions} onChange={(c) => setFiltres((f) => ({ ...f, actions: c }))}>
              Actions
            </CheckboxButton>
            <CheckboxButton checked={filtres.obligations} onChange={(c) => setFiltres((f) => ({ ...f, obligations: c }))}>
              Obligations
            </CheckboxButton>
            <CheckboxButton checked={filtres.fonds} onChange={(c) => setFiltres((f) => ({ ...f, fonds: c }))}>
              Fonds
            </CheckboxButton>
            <CheckboxButton checked={false} disabled>
              Produits dérivés
            </CheckboxButton>
          </div>
        </Specimen>

        <Specimen name="Dropzone" description="Glisser-déposer ou parcourir, avec la liste des fichiers retenus et un état d'erreur.">
          <Dropzone
            label="Justificatifs"
            hint="PDF ou image, 5 Mo au plus"
            accept="image/*,.pdf"
            multiple
            maxSizeMB={5}
            files={files}
            onFilesSelected={(f) => setFiles((prev) => [...prev, ...f])}
            onRemoveFile={(i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
          />
          <Dropzone label="Pièce d'identité" error="Format non pris en charge : .heic" onFilesSelected={() => {}} />
        </Specimen>

        <Specimen name="WysiwygEditor" description="L'éditeur riche : une note de dossier, en HTML simple." wide>
          <WysiwygEditor label="Note interne" value={note} onChange={setNote} minHeight={140} helperText="Visible par l'équipe de recouvrement." />
        </Specimen>
      </SpecimenGrid>
    </SpecimenScreen>
  );
}
