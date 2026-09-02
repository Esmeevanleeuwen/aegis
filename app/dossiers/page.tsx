import type { Metadata } from "next";
import { DossierExplorer } from "@/components/DossierExplorer";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Dossiers",
  description:
    "Onderzoek waar systemen vastlopen en welke gevolgen daardoor worden verplaatst.",
};

export default function DossiersPage() {
  return (
    <>
      <PageIntro eyebrow="Publieke kennis" title="Waar systemen vastlopen.">
        <p>
          Dossiers beginnen bij een concrete menselijke uitkomst. Daarna worden
          oorzaken, organisaties, rechten, cijfers en politieke mogelijkheden
          met elkaar verbonden.
        </p>
      </PageIntro>
      <section className="page-section">
        <DossierExplorer />
      </section>
    </>
  );
}
