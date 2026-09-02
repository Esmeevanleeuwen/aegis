export type Dossier = {
  slug: string;
  title: string;
  outcome: string;
  themes: string[];
  status: "Actief" | "In onderzoek" | "Gecontroleerd";
  checked: string;
  relations: number;
};

export const dossiers: Dossier[] = [
  {
    slug: "de-uitgang-is-vol",
    title: "De uitgang is vol",
    outcome: "Woningtekorten blokkeren zorg, veiligheid en zelfstandigheid.",
    themes: ["Wonen", "Zorg"],
    status: "Actief",
    checked: "15 mei 2026",
    relations: 24,
  },
  {
    slug: "het-gezin-als-noodvoorziening",
    title: "Het gezin als noodvoorziening",
    outcome: "Publieke wachttijd wordt opgevangen door ouders, partners, vrienden en kinderen.",
    themes: ["Wonen", "Zorg"],
    status: "In onderzoek",
    checked: "15 mei 2026",
    relations: 14,
  },
  {
    slug: "wachten-is-geen-lege-tijd",
    title: "Wachten is geen lege tijd",
    outcome: "Onzekerheid verandert gezondheid, relaties en toekomstkeuzes voordat een besluit valt.",
    themes: ["Bestuur", "Zorg"],
    status: "In onderzoek",
    checked: "15 mei 2026",
    relations: 19,
  },
  {
    slug: "rechten-zonder-drager",
    title: "Rechten zonder drager",
    outcome: "Een recht kan bestaan terwijl de persoon of capaciteit voor uitvoering ontbreekt.",
    themes: ["Rechten", "Bestuur"],
    status: "In onderzoek",
    checked: "15 mei 2026",
    relations: 17,
  },
  {
    slug: "de-politie-als-laatste-loket",
    title: "De politie als laatste loket",
    outcome: "Zorg-, woon- en veiligheidsproblemen komen samen bij de enige dienst die altijd bereikbaar is.",
    themes: ["Zorg", "Veiligheid"],
    status: "In onderzoek",
    checked: "15 mei 2026",
    relations: 26,
  },
  {
    slug: "het-rooster-beslist",
    title: "Het rooster beslist",
    outcome: "In gesloten instellingen bepaalt personele capaciteit hoeveel professionele ruimte werkelijk overblijft.",
    themes: ["Zorg", "Veiligheid"],
    status: "In onderzoek",
    checked: "15 mei 2026",
    relations: 22,
  },
  {
    slug: "de-gemeente-als-verzamelpunt",
    title: "De gemeente als verzamelpunt",
    outcome: "Landelijke tekorten eindigen lokaal als woon-, zorg-, veiligheids- en uitvoeringsvraag.",
    themes: ["Bestuur", "Wonen"],
    status: "In onderzoek",
    checked: "15 mei 2026",
    relations: 15,
  },
  {
    slug: "vrijheid-binnen-de-opvang",
    title: "Vrijheid binnen de opvang",
    outcome: "Formele bewegingsvrijheid bestaat naast afhankelijkheid van plaatsing, voorzieningen en klachtenroutes.",
    themes: ["Rechten", "Veiligheid"],
    status: "In onderzoek",
    checked: "15 mei 2026",
    relations: 21,
  },
];

export const proposals = [
  {
    title: "Wonen als voorwaarde voor zorguitstroom",
    theme: "Wonen & zorg",
    phase: "Ledenbehandeling",
    changed: "12 mei 2026",
  },
  {
    title: "Publieke capaciteit vóór crisis",
    theme: "Zorg & capaciteit",
    phase: "Consultatie",
    changed: "9 mei 2026",
  },
  {
    title: "Lokale bescherming zonder wachtdrempel",
    theme: "Rechten & toegang",
    phase: "Besluitvorming",
    changed: "7 mei 2026",
  },
  {
    title: "Openbare verantwoording van wachttijden",
    theme: "Bestuur",
    phase: "Onderzoek",
    changed: "3 mei 2026",
  },
];

export const localGroups = [
  ["Noord-Holland Noord", "11 mei 2026"],
  ["Rotterdam & Rijnmond", "10 mei 2026"],
  ["Utrecht Stad", "9 mei 2026"],
  ["Oost-Brabant", "8 mei 2026"],
  ["Groningen Stad", "7 mei 2026"],
];

export const ecosystem = [
  ["Meridian", "Context", "Geschiedenis, oorzaken en systeemverbanden."],
  ["Aegora", "Rechten", "Rechten, procedures en juridische bescherming."],
  ["AVERA", "Ervaringen", "Menselijke ervaringen, patronen en herstel."],
  ["Civiora", "Dialoog", "Publieke vragen en maatschappelijke dialoog."],
  ["Ampara", "Organisatie", "Collectieve bescherming en lokale draagkracht."],
] as const;
