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
  const values = { dryRun: false, publishSystem: false };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--dry-run") values.dryRun = true;
    else if (argument === "--publish-system") values.publishSystem = true;
    else if (argument === "--system-pdf") values.systemPdf = argv[++index];
    else if (argument === "--public-data-pdf") values.publicDataPdf = argv[++index];
    else if (argument === "--help") values.help = true;
    else throw new Error(`Onbekend argument: ${argument}`);
  }

  return values;
}

function usage() {
  return `Gebruik:
  npm run content:import -- --system-pdf <bestand.pdf> --public-data-pdf <bestand.pdf>

Opties:
  --dry-run          Alleen lezen en aantallen tonen; niets opslaan.
  --publish-system   Publiceer de systeemhoofdstukken direct. Gebruik dit pas na redactie.

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

function buildPlan(options) {
  const documents = [];

  if (options.systemPdf) {
    const path = ensureReadable(options.systemPdf);
    const pages = extractPages(path);
    documents.push({
      key: "system",
      slug: "overkoepelend-dossier-systeeminrichting",
      title: "Overkoepelend dossier systeeminrichting",
      description: "Brondossier over geblokkeerde uitstroom, wachttijd en verplaatsing van systeemdruk.",
      path,
      pages,
      checksum: fileChecksum(pages),
      topics: SYSTEM_TOPICS,
    });
  }

  if (options.publicDataPdf) {
    const path = ensureReadable(options.publicDataPdf);
    const pages = extractPages(path);
    documents.push({
      key: "public-data",
      slug: "datum-publiek",
      title: "Datum publiek",
      description: "Bronregister met gebeurtenissen, publicatiemomenten, processtatus en open vragen.",
      path,
      pages,
      checksum: fileChecksum(pages),
      topics: [],
    });
  }

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
  const { data: sourceDocument, error: documentError } = await supabase
    .from("source_documents")
    .upsert(
      {
        slug: document.slug,
        title: document.title,
        description: document.description,
        file_name: basename(document.path),
        checksum: document.checksum,
        access_level: "internal",
        metadata: { importer: "aegis-pdf-v1", page_count: document.pages.length },
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

    if (document.key === "system") {
      const isPublished = options.publishSystem;
      const rootId = await upsertKnowledgeObject(supabase, {
        object_type: "dossier",
        slug: "de-uitgang-is-vol",
        title: "De uitgang is vol",
        summary: "Waarom systemen vastlopen wanneer mensen nergens duurzaam naartoe kunnen.",
        status: isPublished ? "published" : "review",
        visibility: isPublished ? "public" : "internal",
        owner_platform: "aegis",
        metadata: { source_document_id: sourceDocument.id },
        published_at: isPublished ? new Date().toISOString() : null,
      });

      const { error: dossierError } = await supabase.from("dossiers").upsert({
        id: rootId,
        eyebrow: "Dossier · wonen en zorg",
        subtitle: "Woningtekorten blokkeren zorg, veiligheid en zelfstandigheid.",
        theme_tags: ["Wonen", "Zorg", "Bestuur", "Veiligheid"],
        current_phase: isPublished ? "Gepubliceerd" : "Redactionele controle",
        featured: true,
      });
      if (dossierError) throw dossierError;

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
    } else {
      await upsertKnowledgeObject(supabase, {
        object_type: "dataset",
        slug: "datum-publiek",
        title: "Datum publiek",
        summary: "Intern bronregister; publicatie vereist controle van datum, processtatus en onzekerheid.",
        status: "review",
        visibility: "internal",
        owner_platform: "phosphoros",
        metadata: {
          source_document_id: sourceDocument.id,
          sensitive: true,
          publication_rule: "manual_editorial_review",
        },
      });
    }

    const counters = {
      pages: document.pages.length,
      topics: document.topics.length,
      public: document.key === "system" && options.publishSystem,
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
    checksum: document.checksum,
    visibility: "internal",
  }));

  if (options.dryRun) {
    console.table(summary);
    console.log("\nGeen gegevens opgeslagen. Het register Datum publiek blijft bij import intern totdat iedere zaak redactioneel is gecontroleerd.");
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
