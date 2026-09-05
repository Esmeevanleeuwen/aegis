import type { MetadataRoute } from "next";
import { getDossiers, getDossier, getSources } from "@/lib/dossier-network";
import { dossierPath, chapterPath, sourcePath, getTopics } from "@/lib/dossier-core";
import { absoluteUrl, isPreview } from "@/lib/dossier-platforms";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isPreview) return [];

  const indexableDossiers = (await getDossiers()).filter((dossier) => dossier.indexable);
  const [details, documents] = await Promise.all([
    Promise.all(indexableDossiers.map((dossier) => getDossier(dossier.slug))),
    getSources(),
  ]);
  const topics = getTopics(indexableDossiers);
  const paths = [
    "/",
    ...(indexableDossiers.length ? ["/dossiers"] : []),
    ...(topics.length ? ["/themas"] : []),
    ...indexableDossiers.map((dossier) => dossierPath(dossier.slug)),
    ...topics.map((topic) => `/themas/${topic.slug}`),
  ];

  for (const dossier of details) {
    if (!dossier?.indexable) continue;
    for (const chapter of dossier.chapters) paths.push(chapterPath(dossier.slug, chapter.id));
  }

  if (documents.some((document) => document.pages.some((page) => page.text.trim()))) paths.push("/bronnen");
  for (const document of documents) if (document.pages.some((page) => page.text.trim())) paths.push(sourcePath(document.slug));

  return [...new Set(paths)].map((path) => ({ url: absoluteUrl(path) }));
}
