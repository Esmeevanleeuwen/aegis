import { cache } from "react";
import { getPublishedDossiers, getPublishedDossier, getPublishedDossierDocuments } from "@/lib/queries/dossiers";
import { fallbackDossierDetails } from "@/lib/fallback-dossiers";
import { hasSupabaseConfig } from "@/lib/supabase/public-client";
import { uniqueChapters, type Dossier, type DossierSummary, type SourceDocument } from "@/lib/dossier-core";

export const getDossiers = cache(async (): Promise<DossierSummary[]> => {
  const rows = await getPublishedDossiers();
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    description: row.outcome,
    themes: row.themes,
    status: hasSupabaseConfig() ? "Openbaar dossier" : "Voorbeeld · geen vastgesteld onderzoek",
    indexable: hasSupabaseConfig(),
  }));
});

export const getDossier = cache(async (slug: string): Promise<Dossier | undefined> => {
  const row = await getPublishedDossier(slug);
  if (!row) return;
  const live = row.dataOrigin === "supabase";
  const sections = live && row.sections === fallbackDossierDetails.get(slug)?.sections ? [] : row.sections;
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    themes: row.themes,
    status: live ? "Openbaar dossier" : "Voorbeeld · geen vastgesteld onderzoek",
    indexable: live,
    question: row.description,
    method: "Lees eerst de dossierinhoud. Controleer daarna de brondocumenten en onderscheid de onderbouwing van de politieke afweging.",
    boundaries: live ? "Publicatie is geen feitencontrole. De oorspronkelijke tekst kan interpretaties, onzekerheden en standpunten bevatten. Een gedeeld thema is geen bewijs voor een oorzakelijk verband." : "Dit is voorbeeldinhoud voor de dossierstructuur. Getallen, verklaringen en voorstellen zijn hier niet als gecontroleerd onderzoek gepubliceerd.",
    chapters: uniqueChapters([
      ...sections.map((section) => ({ id: section.id, title: section.heading || section.label, paragraphs: section.paragraphs })),
      ...(row.chain.length ? [{ id: "keten", title: "De beschreven samenhang", paragraphs: row.chain.map((step) => `${step.number}. ${step.title} — ${step.description}`) }] : []),
    ]),
    articles: [],
    evidence: live ? row.evidence : undefined,
  };
});

export const getSourcesForDossier = cache(async (slug: string): Promise<SourceDocument[]> => {
  const dossier = await getDossier(slug);
  if (!dossier?.indexable) return [];
  const documents = await getPublishedDossierDocuments(slug);
  return documents.map((document) => ({ id: document.id, slug: document.slug, title: document.title, description: document.description, dossiers: [dossier], sections: document.sections, pages: document.pages }));
});

export const getSources = cache(async (): Promise<SourceDocument[]> => {
  const dossiers = (await getDossiers()).filter((dossier) => dossier.indexable);
  const lists = await Promise.all(dossiers.map((dossier) => getSourcesForDossier(dossier.slug)));
  const byId = new Map<string, SourceDocument>();
  for (const document of lists.flat()) {
    const existing = byId.get(document.id);
    if (existing) {
      for (const dossier of document.dossiers) if (!existing.dossiers.some((item) => item.slug === dossier.slug)) existing.dossiers.push(dossier);
    } else {
      byId.set(document.id, { ...document, dossiers: [...document.dossiers] });
    }
  }
  const result = [...byId.values()];
  const slugs = new Set<string>();
  for (const document of result) {
    if (slugs.has(document.slug)) throw new Error("Twee openbare documenten gebruiken dezelfde bron-URL.");
    slugs.add(document.slug);
  }
  return result.sort((a, b) => a.title.localeCompare(b.title, "nl"));
});

export const getSource = cache(async (slug: string) => (await getSources()).find((document) => document.slug === slug));
