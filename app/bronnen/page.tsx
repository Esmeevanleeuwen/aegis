import Link from "next/link";
import { getSources } from "@/lib/dossier-network";
import { sourcePath } from "@/lib/dossier-core";
import { Shell, Breadcrumbs, styles, pageMetadata } from "@/components/dossiers/DossierUI";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const documents = await getSources();
  return pageMetadata("Bronbibliotheek", "Openbare brondocumenten en de dossiers waarin zij worden gebruikt.", "/bronnen", documents.length > 0);
}

export default async function SourcesPage() {
  const documents = await getSources();
  return (
    <Shell>
      <Breadcrumbs items={[{ title: "Bronbibliotheek", href: "/bronnen" }]} />
      <header className={styles.hero}>
        <h1>Terug naar de oorspronkelijke bron.</h1>
        <p>Een document wordt één keer aangeboden en blijft verbonden met alle dossiers die het gebruiken. Publicatie betekent niet dat iedere bewering in het document is geverifieerd.</p>
      </header>
      <section className={styles.section}>
        {documents.length ? (
          <div className={styles.grid}>
            {documents.map((document) => (
              <Link href={sourcePath(document.slug)} className={styles.card} key={document.id}>
                <small>{document.pages.length} bronpagina’s · {document.dossiers.length} dossiers</small>
                <h2>{document.title}</h2>
                <p>{document.description}</p>
                <span>Lees het oorspronkelijke document →</span>
              </Link>
            ))}
          </div>
        ) : <p>Er zijn nog geen openbare brondocumenten in deze bibliotheek beschikbaar.</p>}
        <p><Link href="/dossiers">Terug naar de dossiers →</Link></p>
      </section>
    </Shell>
  );
}
