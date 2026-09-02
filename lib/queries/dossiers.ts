import type {
  ContentBlockRow,
  DossierDocument,
  DossierDetail,
  DossierSection,
  PublishedDossierRow,
} from "@/lib/content-types";
import { defaultKnowledgeLinks, fallbackDossierDetails } from "@/lib/fallback-dossiers";
import { dossiers as fallbackDossiers, type Dossier } from "@/lib/site-data";
import {
  createPublicSupabaseClient,
  hasSupabaseConfig,
} from "@/lib/supabase/public-client";

function formatDate(value: string | null) {
  if (!value) return "Nog niet gecontroleerd";

  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function mapStatus(status: string): Dossier["status"] {
  if (status === "published") return "Gecontroleerd";
  if (status === "review") return "In onderzoek";
  return "Actief";
}

function mapDossierRow(row: PublishedDossierRow): Dossier {
  return {
    slug: row.slug,
    title: row.title,
    outcome: row.subtitle ?? row.summary ?? "",
    themes: row.theme_tags ?? [],
    status: mapStatus(row.status),
    checked: formatDate(row.last_checked_at ?? row.updated_at),
    relations: row.relation_count,
  };
}

function blockParagraphs(block: ContentBlockRow) {
  const configured = block.metadata?.paragraphs;
  if (Array.isArray(configured)) {
    return configured.filter((value): value is string => typeof value === "string");
  }

  return block.body
    ? block.body.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean)
    : [];
}

function mapSections(blocks: ContentBlockRow[]): DossierSection[] {
  return blocks
    .filter((block) => ["body", "context", "summary", "callout"].includes(block.block_type))
    .map((block) => ({
      id: String(block.metadata?.section_id ?? block.stable_key),
      label: String(block.metadata?.label ?? block.heading ?? "Onderdeel"),
      eyebrow: block.eyebrow ?? "Dossier",
      heading: block.heading ?? "",
      paragraphs: blockParagraphs(block),
    }));
}

export async function getPublishedDossiers(): Promise<Dossier[]> {
  if (!hasSupabaseConfig()) return fallbackDossiers;

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("aegis_published_dossiers")
    .select("*")
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) throw new Error(`Dossiers konden niet worden geladen: ${error.message}`);
  return (data as PublishedDossierRow[]).map(mapDossierRow);
}

export type PublishedLibraryStats = {
  documents: number;
  pages: number;
  sections: number;
};

export async function getPublishedLibraryStats(): Promise<PublishedLibraryStats> {
  if (!hasSupabaseConfig()) return { documents: 0, pages: 0, sections: 0 };

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("aegis_dossier_documents")
    .select("source_document_id, page_count, section_count");

  if (error) throw new Error(`Documentstatistieken konden niet worden geladen: ${error.message}`);

  const documents = new Map<string, { pageCount: number; sectionCount: number }>();
  for (const row of data ?? []) {
    documents.set(row.source_document_id as string, {
      pageCount: row.page_count as number,
      sectionCount: row.section_count as number,
    });
  }

  return Array.from(documents.values()).reduce<PublishedLibraryStats>(
    (stats, document) => ({
      documents: stats.documents + 1,
      pages: stats.pages + document.pageCount,
      sections: stats.sections + document.sectionCount,
    }),
    { documents: 0, pages: 0, sections: 0 },
  );
}

export async function getPublishedDossier(slug: string): Promise<DossierDetail | undefined> {
  const fallback = fallbackDossierDetails.get(slug);
  if (!hasSupabaseConfig()) return fallback;

  const supabase = createPublicSupabaseClient();
  const { data: rowData, error: rowError } = await supabase
    .from("aegis_published_dossiers")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (rowError) throw new Error(`Dossier kon niet worden geladen: ${rowError.message}`);
  if (!rowData) return undefined;

  const row = rowData as PublishedDossierRow;
  const [{ data: blockData, error: blockError }, { data: claimData, error: claimError }] =
    await Promise.all([
      supabase
        .from("aegis_content_blocks")
        .select("stable_key, block_type, eyebrow, heading, body, position, metadata")
        .eq("dossier_id", row.id)
        .order("position"),
      supabase.from("aegis_claims").select("id").eq("dossier_id", row.id),
    ]);

  if (blockError) throw new Error(`Dossierinhoud kon niet worden geladen: ${blockError.message}`);
  if (claimError) throw new Error(`Bewijsstatus kon niet worden geladen: ${claimError.message}`);

  const blocks = (blockData ?? []) as ContentBlockRow[];
  const claimIds = (claimData ?? []).map((claim) => claim.id as string);
  const evidence = { established: 0, disputed: 0, unknown: 0 };

  if (claimIds.length) {
    const { data: evidenceData, error: evidenceError } = await supabase
      .from("aegis_knowledge_objects")
      .select("evidence_status")
      .in("id", claimIds);

    if (evidenceError) {
      throw new Error(`Bewijsstatus kon niet worden geladen: ${evidenceError.message}`);
    }

    for (const item of evidenceData ?? []) {
      const status = item.evidence_status;
      if (status === "established") evidence.established += 1;
      if (status === "disputed") evidence.disputed += 1;
      if (status === "unknown") evidence.unknown += 1;
    }
  }

  const chain = blocks
    .filter((block) => block.block_type === "causal_step")
    .map((block, index) => ({
      number: String(block.metadata?.number ?? String(index + 1).padStart(2, "0")),
      title: block.heading ?? "Stap",
      description: block.body ?? "",
    }));

  const base = mapDossierRow(row);
  const sections = mapSections(blocks);

  return {
    ...base,
    eyebrow: row.eyebrow ?? `Dossier · ${base.themes.join(" en ").toLowerCase()}`,
    description: row.subtitle ?? row.summary ?? "",
    evidence,
    chain,
    sections: sections.length ? sections : (fallback?.sections ?? []),
    knowledgeLinks: defaultKnowledgeLinks,
    dataOrigin: "supabase",
  };
}

type DossierDocumentRow = {
  source_document_id: string;
  document_slug: string;
  title: string;
  description: string | null;
  role: string;
  page_count: number;
  section_count: number;
};

export async function getPublishedDossierDocuments(slug: string): Promise<DossierDocument[]> {
  if (!hasSupabaseConfig()) return [];

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("aegis_dossier_documents")
    .select("source_document_id, document_slug, title, description, role, page_count, section_count")
    .eq("dossier_slug", slug)
    .order("position");

  if (error) throw new Error(`Dossierdocumenten konden niet worden geladen: ${error.message}`);

  return Promise.all(((data ?? []) as DossierDocumentRow[]).map(async (document) => {
    const [{ data: sections, error: sectionsError }, { data: pages, error: pagesError }] =
      await Promise.all([
        supabase
          .from("aegis_document_sections")
          .select("id, stable_key, title, page_number, level, position")
          .eq("source_document_id", document.source_document_id)
          .order("position"),
        supabase
          .from("aegis_document_pages")
          .select("id, page_number, extracted_text, review_status")
          .eq("source_document_id", document.source_document_id)
          .order("page_number"),
      ]);

    if (sectionsError) {
      throw new Error(`Inhoudsopgave kon niet worden geladen: ${sectionsError.message}`);
    }
    if (pagesError) {
      throw new Error(`Documentpagina's konden niet worden geladen: ${pagesError.message}`);
    }

    return {
      id: document.source_document_id,
      slug: document.document_slug,
      title: document.title,
      description: document.description,
      role: document.role,
      pageCount: document.page_count,
      sectionCount: document.section_count,
      sections: (sections ?? []).map((section) => ({
        id: section.id as string,
        stableKey: section.stable_key as string,
        title: section.title as string,
        pageNumber: section.page_number as number,
        level: section.level as number,
        position: section.position as number,
      })),
      pages: (pages ?? []).map((page) => ({
        id: page.id as string,
        pageNumber: page.page_number as number,
        text: page.extracted_text as string,
        reviewStatus: page.review_status as string,
      })),
    };
  }));
}
