import Link from "next/link";
import { getSources } from "@/lib/dossier-network";
import { sourcePath } from "@/lib/dossier-core";
import {
  Breadcrumbs,
  Shell,
  pageMetadata,
  styles,
} from "@/components/dossiers/DossierUI";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const documents = await getSources();
  return pageMetadata(
    "Gedeelde brondocumenten",
    "Openbare documenten die de gedeelde dossierkern onderbouwen en door meerdere platforms kunnen worden gebruikt.",
    "/bronnen",
    documents.length > 0,
  );
}

export default async function SourcesPage() {
  const documents = await getSources();

  return (
    <Shell>
      <Breadcrumbs items={[{ title: "Gedeelde bronnen", href: "/bronnen" }]} />
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Ampara · controle vóór keuze</p>
        <h1>Een politieke keuze blijft terug te voeren op haar bronnen.</h1>
        <p>
          Ampara gebruikt dezelfde openbare documenten als de centrale dossierkern.
          De partijweergave kan de betekenis bespreken, maar verandert niet wat er in
          het oorspronkelijke document staat.
        </p>
      </header>

      <section className={styles.section}>
        <p className={styles.eyebrow}>Openbare bronlaag</p>
        <h2>Controleer de onderbouwing buiten de politieke samenvatting.</h2>
        {documents.length ? (
          <div className={styles.grid}>
            {documents.map((document) => {
              const pageCount = document.pageCount ?? document.pages.length;
              const sectionCount = document.sectionCount ?? document.sections.length;
              return (
                <Link href={sourcePath(document.slug)} className={styles.card} key={document.id}>
                  <small>
                    {pageCount} bronpagina’s · {sectionCount} inhoudspunten · {document.dossiers.length} dossiers
                  </small>
                  <h2>{document.title}</h2>
                  <p>{document.description}</p>
                  <span>Open het brondocument →</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p>Er zijn nog geen openbare brondocumenten in de gedeelde bronlaag beschikbaar.</p>
        )}
        <p><Link href="/dossiers">Terug naar de publieke dossiers →</Link></p>
      </section>
    </Shell>
  );
}
