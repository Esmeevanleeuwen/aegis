import type { Dossier } from "@/lib/site-data";

export type EvidenceSummary = {
  established: number;
  disputed: number;
  unknown: number;
};

export type CausalStep = {
  number: string;
  title: string;
  description: string;
};

export type DossierSection = {
  id: string;
  label: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
};

export type KnowledgeLink = {
  platform: "Meridian" | "Phosphoros" | "Aegora" | "AVERA" | "Civiora" | "Ampara";
  role: string;
  heading: string;
  label: string;
  href: string;
};

export type DossierDetail = Dossier & {
  eyebrow: string;
  description: string;
  evidence: EvidenceSummary;
  chain: CausalStep[];
  sections: DossierSection[];
  knowledgeLinks: KnowledgeLink[];
  dataOrigin: "supabase" | "curated-fallback";
};

export type PublishedDossierRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  status: string;
  visibility: string;
  last_checked_at: string | null;
  updated_at: string;
  eyebrow: string | null;
  subtitle: string | null;
  hero_image_url: string | null;
  theme_tags: string[] | null;
  current_phase: string | null;
  featured: boolean;
  relation_count: number;
};

export type ContentBlockRow = {
  stable_key: string;
  block_type: string;
  eyebrow: string | null;
  heading: string | null;
  body: string | null;
  position: number;
  metadata: Record<string, unknown> | null;
};
