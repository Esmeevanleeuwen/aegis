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
    slug: "zorg-wordt-politiewerk",
    title: "Wanneer zorg een politieprobleem wordt",
    outcome: "Crisissituaties groeien door ontbrekende zorg en ondersteuning.",
    themes: ["Zorg", "Veiligheid"],
    status: "Actief",
    checked: "12 mei 2026",
    relations: 18,
  },
  {
    slug: "wonen-als-publieke-ondergrens",
    title: "Wonen als publieke ondergrens",
    outcome: "Gezondheid, meedoen en herstel beginnen bij een passende woning.",
    themes: ["Wonen", "Rechten"],
    status: "Gecontroleerd",
    checked: "10 mei 2026",
    relations: 16,
  },
  {
    slug: "werk-zonder-zekerheid",
    title: "Werk zonder zekerheid",
    outcome: "Onzekere arbeid verplaatst risico van organisaties naar mensen.",
    themes: ["Werk", "Inkomen"],
    status: "In onderzoek",
    checked: "8 mei 2026",
    relations: 12,
  },
  {
    slug: "jeugd-tussen-systemen",
    title: "Jeugd tussen systemen",
    outcome: "Kinderen wachten terwijl instellingen verantwoordelijkheid verdelen.",
    themes: ["Zorg", "Onderwijs"],
    status: "In onderzoek",
    checked: "6 mei 2026",
    relations: 14,
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
  ["Phosphoros", "Bewijs", "Claims, bronnen, onzekerheid en tegenspraak."],
  ["Aegora", "Rechten", "Rechten, procedures en juridische bescherming."],
  ["AVERA", "Ervaringen", "Menselijke ervaringen, patronen en herstel."],
  ["Civiora", "Dialoog", "Publieke vragen en maatschappelijke dialoog."],
  ["Ampara", "Organisatie", "Collectieve bescherming en lokale draagkracht."],
] as const;
