import type { DossierDetail, DossierSection, KnowledgeLink } from "@/lib/content-types";
import { dossiers } from "@/lib/site-data";

export const defaultKnowledgeLinks: KnowledgeLink[] = [
  {
    platform: "Phosphoros",
    role: "bewijs",
    heading: "Controleer de bronnen en bewijsstatus.",
    label: "Open de onderbouwing",
    href: "/netwerk",
  },
  {
    platform: "Meridian",
    role: "context",
    heading: "Bekijk hoe deze afhankelijkheid is ontstaan.",
    label: "Open de systeemcontext",
    href: "/netwerk",
  },
  {
    platform: "Aegora",
    role: "rechten",
    heading: "Lees welke bescherming en route nu gelden.",
    label: "Open de rechtslaag",
    href: "/standpunten",
  },
  {
    platform: "AVERA",
    role: "ervaringen",
    heading: "Zie hoe de systeemdruk in het dagelijks leven doorwerkt.",
    label: "Open de ervaringslaag",
    href: "/netwerk",
  },
];

const coreSections: DossierSection[] = [
  {
    id: "overzicht",
    label: "Overzicht",
    eyebrow: "De kern",
    heading: "Veel systemen lopen niet vast bij de ingang, maar bij de uitgang.",
    paragraphs: [
      "Een patiënt kan uitbehandeld zijn, een statushouder kan een verblijfsvergunning hebben en een jongere kan klaar zijn voor een volgende plek. Zolang passende huisvesting, vervolgzorg of begeleiding ontbreekt, blijft de eerdere voorziening bezet.",
      "Daardoor ontstaat een keten die in verschillende beleidsvelden een andere naam krijgt, maar dezelfde materiële oorzaak kan hebben: er is geen duurzame plek waar iemand verder kan leven.",
    ],
  },
  {
    id: "data",
    label: "Data",
    eyebrow: "Wat wordt gemeten",
    heading: "Niet alleen de wachtrij, maar ook de geblokkeerde uitstroom telt.",
    paragraphs: [
      "De datalaag onderscheidt capaciteit, bezetting, uitstroom, wachttijd en de plaats waar de gevolgen terechtkomen. Een cijfer krijgt altijd een periode, populatie, methode, bron en onzekerheidsnotitie.",
      "Getallen uit het brondossier worden eerst als interne bronpagina geïmporteerd. Pas na controle worden zij als afzonderlijke meting gepubliceerd en automatisch gekoppeld aan claims, gebeurtenissen en voorstellen.",
    ],
  },
  {
    id: "tijdlijn",
    label: "Tijdlijn",
    eyebrow: "Verandering door de tijd",
    heading: "Publicatiedatum, gebeurtenisdatum en juridische datum blijven gescheiden.",
    paragraphs: [
      "Een gebeurtenis kan jaren vóór een publicatie hebben plaatsgevonden en een procedure kan daarna opnieuw van status veranderen. Aegis bewaart die momenten afzonderlijk om te voorkomen dat actuele kennis en historische gebeurtenissen door elkaar lopen.",
      "Iedere wijziging krijgt bovendien een revisie, zodat zichtbaar blijft wat wanneer bekend was en waarom een formulering veranderde.",
    ],
  },
  {
    id: "netwerk",
    label: "Netwerk",
    eyebrow: "Gedeelde kennis",
    heading: "Eén bevinding kan meerdere platformfuncties voeden.",
    paragraphs: [
      "Meridian levert de historische en systemische context. Phosphoros controleert bewijs en tegenspraak. Aegora beschrijft rechten en procedures. AVERA brengt ervaringspatronen in beeld. Civiora opent de publieke dialoog en Ampara helpt collectieve bescherming organiseren.",
      "Aegis gebruikt die lagen om politieke keuzes, besluiten en uitvoering controleerbaar met elkaar te verbinden, zonder eigenaar te worden van de onafhankelijke redacties.",
    ],
  },
  {
    id: "rechten",
    label: "Rechten",
    eyebrow: "De uitvoeringslaag",
    heading: "Een toegekend recht is nog geen feitelijke bescherming.",
    paragraphs: [
      "Het model maakt onderscheid tussen een recht dat niet bestaat, een recht waarover interpretatieverschil bestaat en een recht dat wel bestaat maar door gebrek aan mensen, plekken of procedures niet wordt uitgevoerd.",
      "De rechtslaag toont daarom niet alleen de regel, maar ook de bevoegde instantie, route, geldigheidsperiode, beperkingen en bekende uitvoeringsproblemen.",
    ],
  },
  {
    id: "voorstellen",
    label: "Voorstellen",
    eyebrow: "Van analyse naar keuze",
    heading: "Een voorstel noemt wie handelt, wat het kost en wanneer het toetsbaar wordt.",
    paragraphs: [
      "Voorstellen worden gekoppeld aan de claims en oorzaken waarop zij reageren. Waarden, instrument, uitvoerder, kosten, termijn en besluitstatus blijven afzonderlijke velden.",
      "Zo blijft zichtbaar waar feitelijke analyse eindigt en een socialistische politieke keuze begint.",
    ],
  },
  {
    id: "bronnen",
    label: "Bronnen",
    eyebrow: "Herkomst en controle",
    heading: "Iedere publieke conclusie blijft terug te voeren op een bron.",
    paragraphs: [
      "De oorspronkelijke dossiers worden per pagina opgeslagen met een controlewaarde. Claims verwijzen daarna naar specifieke bronnen en krijgen de status vastgesteld, waarschijnlijk, betwist of onbekend.",
      "Het dossier noemt onder meer journalistieke, publieke en uitvoeringsbronnen. De bronverwijzingen worden pas publiek aanklikbaar nadat titel, datum, URL en bewijsfunctie redactioneel zijn gecontroleerd.",
    ],
  },
];

const primary: DossierDetail = {
  ...dossiers[0],
  eyebrow: "Dossier · wonen en zorg",
  description:
    "Woningtekorten blokkeren zorg, veiligheid en zelfstandigheid. Dit dossier volgt hoe één ontbrekende voorziening meerdere publieke systemen tegelijk vastzet.",
  evidence: { established: 24, disputed: 8, unknown: 6 },
  chain: [
    { number: "01", title: "Geen passende woning", description: "Mensen kunnen niet veilig of zelfstandig uitstromen." },
    { number: "02", title: "Geen uitstroom", description: "Een zware voorziening blijft bezet nadat de directe behandeling is afgerond." },
    { number: "03", title: "Nieuwe instroom wacht", description: "De ontbrekende vervolgplek veroorzaakt schaarste aan de ingang." },
    { number: "04", title: "Schade groeit", description: "Gezondheid, relaties en zelfstandigheid verslechteren tijdens het wachten." },
    { number: "05", title: "Druk verschuift", description: "Gezinnen, gemeenten, politie en crisiszorg vangen de gevolgen op." },
  ],
  sections: coreSections,
  knowledgeLinks: defaultKnowledgeLinks,
  dataOrigin: "curated-fallback",
};

function genericDetail(slug: string): DossierDetail | undefined {
  const dossier = dossiers.find((item) => item.slug === slug);
  if (!dossier) return undefined;

  return {
    ...dossier,
    eyebrow: `Dossier · ${dossier.themes.join(" en ").toLowerCase()}`,
    description: dossier.outcome,
    evidence: { established: 0, disputed: 0, unknown: 1 },
    chain: [],
    sections: coreSections,
    knowledgeLinks: defaultKnowledgeLinks,
    dataOrigin: "curated-fallback",
  };
}

export const fallbackDossierDetails = new Map<string, DossierDetail>([
  [primary.slug, primary],
  ...dossiers.slice(1).map((dossier) => [dossier.slug, genericDetail(dossier.slug)!] as const),
]);
