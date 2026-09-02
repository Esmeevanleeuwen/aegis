#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { basename, resolve } from "node:path";
import { accessSync, constants } from "node:fs";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const SYSTEM_TOPICS = [
  {
    slug: "een-ontbrekende-woning-blokkeert-systemen",
    title: "Eén ontbrekende woning blokkeert meerdere systemen",
    summary: "Een ontbrekende vervolgplek houdt opvang, zorg en justitiële capaciteit bezet.",
    pages: [5, 7],
    themes: ["Wonen", "Zorg"],
  },
  {
    slug: "het-gezin-als-noodvoorziening",
    title: "Het gezin als noodvoorziening",
    summary: "Publieke wachttijd wordt tijdelijk gedragen door particuliere relaties.",
    pages: [7, 8],
    themes: ["Wonen", "Zorg"],
  },
  {
    slug: "de-hervorming-maakt-nieuwe-wachtenden",
    title: "De hervorming maakt nieuwe wachtenden",
    summary: "Nieuwe prioriteiten kunnen bestaande achterstanden verder naar achteren schuiven.",
    pages: [8, 9],
    themes: ["Bestuur", "Rechten"],
  },
  {
    slug: "wachten-is-geen-lege-tijd",
    title: "Wachten is geen lege tijd",
    summary: "De schade ontstaat al voordat een definitief besluit of een passende plek beschikbaar is.",
    pages: [9, 11],
    themes: ["Bestuur", "Zorg"],
  },
  {
    slug: "risico-naar-de-kleinste-buffer",
    title: "Risico naar de kleinste buffer",
    summary: "Dezelfde wachttijd veroorzaakt ongelijke schade wanneer buffers verschillen.",
    pages: [11, 12],
    themes: ["Inkomen", "Bestuur"],
  },
  {
    slug: "zorgcrisis-wordt-openbare-ordecrisis",
    title: "Wanneer zorg- of wooncrisis openbare orde wordt",
    summary: "Ontbrekende zorg en huisvesting kunnen zichtbaar worden als een veiligheidsprobleem.",
    pages: [12, 13],
    themes: ["Zorg", "Veiligheid"],
  },
  {
    slug: "rechten-zonder-drager",
    title: "Rechten zonder drager",
    summary: "Formele bescherming kan bestaan terwijl de uitvoerder of capaciteit ontbreekt.",
    pages: [13, 15],
    themes: ["Rechten", "Bestuur"],
  },
  {
    slug: "de-gemeente-als-verzamelpunt",
    title: "De gemeente als verzamelpunt",
    summary: "Nationale tekorten komen lokaal samen als uitvoerings- en beschermingsvraag.",
    pages: [15, 16],
    themes: ["Bestuur", "Wonen"],
  },
  {
    slug: "energietransitie-bij-het-huishouden",
    title: "De energietransitie bij het huishouden",
    summary: "Publieke doelen kunnen vastlopen wanneer infrastructuur en uitvoering achterblijven.",
    pages: [16, 18],
    themes: ["Energie", "Bestuur"],
  },
  {
    slug: "het-rooster-beslist",
    title: "Het rooster beslist",
    summary: "Personele bezetting bepaalt hoeveel professionele en juridische ruimte in gesloten instellingen overblijft.",
    pages: [19, 30],
    themes: ["Zorg", "Veiligheid"],
  },
  {
    slug: "de-politie-als-laatste-loket",
    title: "De politie als laatste loket",
    summary: "Hulpvragen worden gecategoriseerd voordat duidelijk is welke zorg of bescherming volgt.",
    pages: [30, 45],
    themes: ["Zorg", "Veiligheid"],
  },
  {
    slug: "vrijheid-binnen-de-opvang",
    title: "Vrijheid binnen de opvang",
    summary: "Formele vrijheid bestaat naast afhankelijkheid van plaatsing, voorzieningen en klachtenroutes.",
    pages: [46, 63],
    themes: ["Rechten", "Veiligheid"],
  },
];

function parseArguments(argv) {
  const values = { dryRun: false, publishSystem: false, publishAll: false };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--dry-run") values.dryRun = true;
    else if (argument === "--publish-system") values.publishSystem = true;
    else if (argument === "--publish-all") values.publishAll = true;
    else if (argument === "--system-pdf") values.systemPdf = argv[++index];
    else if (argument === "--public-data-pdf") values.publicDataPdf = argv[++index];
    else if (argument === "--crime-system-pdf") values.crimeSystemPdf = argv[++index];
    else if (argument === "--wwii-system-pdf") values.wwiiSystemPdf = argv[++index];
    else if (argument === "--gelderland-network-pdf") values.gelderlandNetworkPdf = argv[++index];
    else if (argument === "--help") values.help = true;
    else throw new Error(`Onbekend argument: ${argument}`);
  }

  return values;
}

function usage() {
  return `Gebruik:
  npm run content:import -- [documentopties]

Documentopties:
  --system-pdf <bestand.pdf>
  --public-data-pdf <bestand.pdf>
  --crime-system-pdf <bestand.pdf>
  --wwii-system-pdf <bestand.pdf>
  --gelderland-network-pdf <bestand.pdf>

Opties:
  --dry-run          Alleen lezen en aantallen tonen; niets opslaan.
  --publish-system   Publiceer de systeemhoofdstukken direct. Gebruik dit pas na redactie.
  --publish-all      Publiceer alle opgegeven Aegis-dossiers en brondocumenten.

Benodigde omgevingsvariabelen voor echte import:
  NEXT_PUBLIC_SUPABASE_URL
  SUPABASE_SECRET_KEY (of tijdelijk SUPABASE_SERVICE_ROLE_KEY)`;
}

function ensureReadable(filePath) {
  const absolutePath = resolve(filePath);
  accessSync(absolutePath, constants.R_OK);
  return absolutePath;
}

function extractPages(filePath) {
  let output;
  try {
    output = execFileSync("pdftotext", ["-layout", filePath, "-"], {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new Error("`pdftotext` ontbreekt. Installeer Poppler en probeer opnieuw.");
    }
    throw error;
  }

  const chunks = output.split("\f");
  if (!chunks.at(-1)?.trim()) chunks.pop();

  return chunks.map((text, index) => ({
    pageNumber: index + 1,
    text: text.replace(/\u00a0/g, " ").trim(),
    hash: createHash("sha256").update(text).digest("hex"),
  }));
}

function fileChecksum(pages) {
  return createHash("sha256")
    .update(pages.map((page) => `${page.pageNumber}:${page.hash}`).join("|"))
    .digest("hex");
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

function extractTableOfContents(pages, tocLocations) {
  const seen = new Map();
  const entries = [];

  for (const location of tocLocations) {
    const pageNumber = typeof location === "number" ? location : location.pageNumber;
    const pageOffset = typeof location === "number" ? 0 : location.pageOffset;
    const page = pages.find((candidate) => candidate.pageNumber === pageNumber);
    if (!page) continue;
    let pendingTitle = "";
    let pendingIndentation = "";

    for (const line of page.text.replace(/[\u200b\u200c\u200d\ufeff]/g, "").split("\n")) {
      let match = line.match(/^(\s*)(.+?)\s+(\d+)\s*$/);
      const pageOnlyMatch = line.match(/^\s*(\d+)\s*$/);

      if (!match && pageOnlyMatch && pendingTitle) {
        const targetPage = Number.parseInt(pageOnlyMatch[1], 10) + pageOffset;
        if (targetPage >= 1 && targetPage <= pages.length) {
          match = [line, pendingIndentation, pendingTitle, pageOnlyMatch[1]];
          pendingTitle = "";
          pendingIndentation = "";
        }
      }

      if (!match) {
        const continuation = line.trim().replace(/\s+/g, " ");
        if (continuation && !/^\d+$/.test(continuation)) {
          if (!pendingTitle) pendingIndentation = line.match(/^\s*/)?.[0] ?? "";
          pendingTitle = `${pendingTitle} ${continuation}`.trim();
        }
        continue;
      }

      const [, indentation, rawTitle, rawPage] = match;
      const title = `${pendingTitle} ${rawTitle}`.trim().replace(/\s+/g, " ");
      const targetPage = Number.parseInt(rawPage, 10) + pageOffset;
      pendingTitle = "";
      pendingIndentation = "";
      if (!title || /^\d+$/.test(title) || targetPage < 1 || targetPage > pages.length) continue;

      const baseKey = slugify(title) || `pagina-${targetPage}`;
      const occurrence = (seen.get(baseKey) ?? 0) + 1;
      seen.set(baseKey, occurrence);
      entries.push({
        stableKey: occurrence === 1 ? baseKey : `${baseKey}-${occurrence}`,
        title,
        pageNumber: targetPage,
        level: Math.min(3, Math.floor(indentation.length / 4)),
        position: entries.length,
      });
    }
  }

  return entries;
}

function buildPlan(options) {
  const documents = [];

  function addDocument(filePath, configuration) {
    if (!filePath) return;
    const path = ensureReadable(filePath);
    const pages = extractPages(path);
    documents.push({
      ...configuration,
      ownerPlatform: "aegis",
      path,
      pages,
      checksum: fileChecksum(pages),
      topics: configuration.topics ?? [],
      sections: extractTableOfContents(pages, configuration.tocLocations ?? []),
    });
  }

  addDocument(options.systemPdf, {
    key: "system",
    slug: "overkoepelend-dossier-systeeminrichting",
    title: "Overkoepelend dossier systeeminrichting",
    description: "Brondossier over geblokkeerde uitstroom, wachttijd en verplaatsing van systeemdruk.",
    dossier: {
      slug: "de-uitgang-is-vol",
      title: "De uitgang is vol",
      summary: "Waarom systemen vastlopen wanneer mensen nergens duurzaam naartoe kunnen.",
      eyebrow: "Dossier · wonen en zorg",
      subtitle: "Woningtekorten blokkeren zorg, veiligheid en zelfstandigheid.",
      themes: ["Wonen", "Zorg", "Bestuur", "Veiligheid"],
      featured: true,
    },
    topics: SYSTEM_TOPICS,
    tocLocations: [2, 3, 4],
  });

  addDocument(options.publicDataPdf, {
    key: "public-data",
    slug: "datum-publiek",
    title: "Datum publiek",
    description: "Register met publieke datums, bekende feiten, juridische status en open vragen.",
    dossier: {
      slug: "datum-publiek",
      title: "Datum publiek",
      summary: "Een openbaar zakenregister waarin bekende feiten, juridische gevolgen en ontbrekende informatie gescheiden blijven.",
      eyebrow: "Dossier · publiek register",
      subtitle: "Per zaak blijft zichtbaar wat bekend is, wat juridisch volgde en wat nog onduidelijk is.",
      themes: ["Recht", "Veiligheid", "Bewijs"],
      featured: false,
    },
    tocLocations: [],
  });

  addDocument(options.crimeSystemPdf, {
    key: "crime-system",
    slug: "criminaliteit-als-systeem",
    title: "Criminaliteit als systeem",
    description: "Overkoepelende analyse van ontstaan, selectie, escalatie en institutionele verwerking.",
    dossier: {
      slug: "criminaliteit-als-systeem",
      title: "Criminaliteit als systeem",
      summary: "Hoe gedrag, zichtbaarheid, classificatie, capaciteit en strafrechtelijke verwerking één systeem vormen.",
      eyebrow: "Dossier · criminaliteit en instituties",
      subtitle: "Criminaliteit ontstaat, wordt geselecteerd en keert soms terug door dezelfde institutionele ketens.",
      themes: ["Criminaliteit", "Recht", "Zorg", "Veiligheid"],
      featured: true,
    },
    tocLocations: [2, 3],
  });

  addDocument(options.wwiiSystemPdf, {
    key: "wwii-system",
    slug: "de-tweede-wereldoorlog-als-systeem",
    title: "De Tweede Wereldoorlog als systeem",
    description: "Overkoepelende analyse van territorium, macht, informatie en vernietiging.",
    dossier: {
      slug: "de-tweede-wereldoorlog-als-systeem",
      title: "De Tweede Wereldoorlog als systeem",
      summary: "Hoe territorium, economie, ideologie, logistiek en informatie samen één wereldwijd oorlogssysteem vormden.",
      eyebrow: "Dossier · geschiedenis en macht",
      subtitle: "De oorlog als samenhangend systeem van territorium, infrastructuur, bestuur en vernietiging.",
      themes: ["Geschiedenis", "Oorlog", "Macht", "Infrastructuur"],
      featured: false,
    },
    tocLocations: [2],
  });

  addDocument(options.gelderlandNetworkPdf, {
    key: "gelderland-network",
    slug: "organisatorische-netwerklaag-gelderland",
    title: "De organisatorische netwerklaag van Gelderland",
    description: "Analyse van organisaties, gemeenten, infrastructuur, informatie en afhankelijkheidsketens in Gelderland.",
    dossier: {
      slug: "organisatorische-netwerklaag-gelderland",
      title: "De organisatorische netwerklaag van Gelderland",
      summary: "Hoe formele grenzen en werkelijke afhankelijkheden samen de handelingsruimte van Gelderland vormen.",
      eyebrow: "Dossier · Gelderland en bestuur",
      subtitle: "Van gemeentelijke overlap naar organisaties, capaciteit, geld, informatie en fysieke mogelijkheid.",
      themes: ["Gelderland", "Bestuur", "Netwerken", "Infrastructuur"],
      featured: true,
    },
    tocLocations: [
      { pageNumber: 5, pageOffset: 1 },
      { pageNumber: 54, pageOffset: 54 },
      { pageNumber: 87, pageOffset: 85 },
    ],
  });

  if (!documents.length) throw new Error("Geef minstens één PDF-pad op.\n\n" + usage());
  return documents;
}

async function upsertKnowledgeObject(supabase, values) {
  const { data, error } = await supabase
    .from("knowledge_objects")
    .upsert(values, { onConflict: "object_type,slug" })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

async function importDocument(supabase, document, options) {
  const shouldPublish = options.publishAll || (document.key === "system" && options.publishSystem);
  const { data: sourceDocument, error: documentError } = await supabase
    .from("source_documents")
    .upsert(
      {
        slug: document.slug,
        title: document.title,
        description: document.description,
        file_name: basename(document.path),
        checksum: document.checksum,
        access_level: shouldPublish ? "public" : "internal",
        owner_platform: document.ownerPlatform,
        metadata: {
          importer: "shared-pdf-v2",
          page_count: document.pages.length,
          owner_platform: document.ownerPlatform,
          reader_enabled: true,
        },
      },
      { onConflict: "slug" },
    )
    .select("id")
    .single();
  if (documentError) throw documentError;

  const { data: run, error: runError } = await supabase
    .from("import_runs")
    .insert({ source_document_id: sourceDocument.id, status: "started" })
    .select("id")
    .single();
  if (runError) throw runError;

  try {
    for (let offset = 0; offset < document.pages.length; offset += 25) {
      const batch = document.pages.slice(offset, offset + 25).map((page) => ({
        source_document_id: sourceDocument.id,
        page_number: page.pageNumber,
        extracted_text: page.text,
        content_hash: page.hash,
        review_status: "unreviewed",
      }));
      const { error } = await supabase
        .from("source_pages")
        .upsert(batch, { onConflict: "source_document_id,page_number" });
      if (error) throw error;
    }

    if (document.sections.length) {
      for (let offset = 0; offset < document.sections.length; offset += 50) {
        const sectionBatch = document.sections.slice(offset, offset + 50).map((section) => ({
          source_document_id: sourceDocument.id,
          stable_key: section.stableKey,
          title: section.title,
          page_number: section.pageNumber,
          level: section.level,
          position: section.position,
          tab_key: "documenten",
          metadata: { source: "document_table_of_contents" },
        }));
        const { error } = await supabase
          .from("document_sections")
          .upsert(sectionBatch, { onConflict: "source_document_id,stable_key" });
        if (error) throw error;
      }
    }

    {
      const isPublished = shouldPublish;
      const rootId = await upsertKnowledgeObject(supabase, {
        object_type: "dossier",
        slug: document.dossier.slug,
        title: document.dossier.title,
        summary: document.dossier.summary,
        status: isPublished ? "published" : "review",
        visibility: isPublished ? "public" : "internal",
        owner_platform: "aegis",
        metadata: { source_document_id: sourceDocument.id },
        published_at: isPublished ? new Date().toISOString() : null,
      });

      const { error: dossierError } = await supabase.from("dossiers").upsert({
        id: rootId,
        eyebrow: document.dossier.eyebrow,
        subtitle: document.dossier.subtitle,
        theme_tags: document.dossier.themes,
        current_phase: isPublished ? "Gepubliceerd" : "Redactionele controle",
        featured: document.dossier.featured,
      });
      if (dossierError) throw dossierError;

      const { error: documentLinkError } = await supabase.from("dossier_documents").upsert(
        {
          dossier_id: rootId,
          source_document_id: sourceDocument.id,
          role: "primary",
          position: 1,
        },
        { onConflict: "dossier_id,source_document_id" },
      );
      if (documentLinkError) throw documentLinkError;

      for (const [position, topic] of document.topics.entries()) {
        const chapterId = await upsertKnowledgeObject(supabase, {
          object_type: "chapter",
          slug: topic.slug,
          title: topic.title,
          summary: topic.summary,
          status: isPublished ? "published" : "review",
          visibility: isPublished ? "public" : "internal",
          owner_platform: "aegis",
          metadata: {
            source_document_id: sourceDocument.id,
            page_from: topic.pages[0],
            page_to: topic.pages[1],
            themes: topic.themes,
          },
          published_at: isPublished ? new Date().toISOString() : null,
        });

        const { error: relationError } = await supabase.from("relations").upsert(
          {
            from_object_id: rootId,
            to_object_id: chapterId,
            relation_type: "contains",
            status: isPublished ? "published" : "review",
            weight: position + 1,
          },
          { onConflict: "from_object_id,to_object_id,relation_type" },
        );
        if (relationError) throw relationError;

        const { error: blockError } = await supabase.from("content_blocks").upsert(
          {
            dossier_id: rootId,
            stable_key: `chapter-${topic.slug}`,
            block_type: "body",
            eyebrow: "Hoofdstuk",
            heading: topic.title,
            body: topic.summary,
            position: position + 100,
            metadata: {
              section_id: topic.slug,
              label: topic.title,
              page_from: topic.pages[0],
              page_to: topic.pages[1],
              chapter_id: chapterId,
            },
          },
          { onConflict: "dossier_id,stable_key" },
        );
        if (blockError) throw blockError;
      }
    }

    const counters = {
      pages: document.pages.length,
      topics: document.topics.length,
      sections: document.sections.length,
      ownerPlatform: document.ownerPlatform,
      public: shouldPublish,
    };
    const { error: completeError } = await supabase
      .from("import_runs")
      .update({ status: "completed", counters, completed_at: new Date().toISOString() })
      .eq("id", run.id);
    if (completeError) throw completeError;
    return counters;
  } catch (error) {
    await supabase
      .from("import_runs")
      .update({
        status: "failed",
        error_message: error instanceof Error ? error.message : String(error),
        completed_at: new Date().toISOString(),
      })
      .eq("id", run.id);
    throw error;
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  const plan = buildPlan(options);
  const summary = plan.map((document) => ({
    document: document.title,
    pages: document.pages.length,
    characters: document.pages.reduce((total, page) => total + page.text.length, 0),
    topics: document.topics.length,
    sections: document.sections.length,
    ownerPlatform: document.ownerPlatform,
    checksum: document.checksum,
    visibility: "internal",
  }));

  if (options.dryRun) {
    console.table(summary);
    console.log("\nGeen gegevens opgeslagen. Alle documenten zijn als afzonderlijke Aegis-dossiers voorbereid; publicatie vereist een expliciete publicatievlag.");
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) throw new Error("Supabase URL of geheime importsleutel ontbreekt.\n\n" + usage());

  const supabase = createClient(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: "aegis" },
  });

  for (const document of plan) {
    const result = await importDocument(supabase, document, options);
    console.log(`Geïmporteerd: ${document.title}`, result);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
