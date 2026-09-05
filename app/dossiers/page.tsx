import Link from "next/link";
import { getDossiers } from "@/lib/dossier-network";
import { getTopics } from "@/lib/dossier-core";
import {
  Shell,
  Breadcrumbs,
  Cards,
  styles,
  pageMetadata,
} from "@/components/dossiers/DossierUI";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const dossiers = await getDossiers();
  return pageMetadata(
    "Publieke dossiers",
    "Maatschappelijke dossiers waarin gedeelde kennis wordt verbonden met waarden, voorstellen, besluiten en uitvoering.",
    "/dossiers",
    dossiers.some((dossier) => dossier.indexable),
  );
}

export default async function DossiersPage() {
  const dossiers = await getDossiers();
  const topics = getTopics(dossiers);

  return (
    <Shell>
      <Breadcrumbs items={[{ title: "Publieke dossiers", href: "/dossiers" }]} />

      <header className={styles.hero}>
        <p className={styles.eyebrow}>Ampara · van kennis naar bescherming</p>
        <h1>Van gedeelde kennis naar publieke macht.</h1>
        <p>
          Ieder dossier begint bij dezelfde controleerbare kern, maar Ampara maakt
          zichtbaar waar waarden richting geven, welke keuze wordt voorgesteld en
          wie verantwoordelijk blijft voor de uitvoering.
        </p>
      </header>

      <nav className={styles.topics} aria-label="Publieke dossiers per thema">
        {topics.map((topic) => (
          <Link key={topic.slug} href={`/themas/${topic.slug}`}>
            {topic.title} ({topic.dossiers.length})
          </Link>
        ))}
      </nav>

      <Cards items={dossiers} />

      <section className={styles.section}>
        <p className={styles.eyebrow}>De politieke route</p>
        <h2>Een dossier eindigt niet bij de analyse.</h2>
        <div className={styles.grid}>
          {[
            ["01", "Probleem", "Wat loopt aantoonbaar vast en voor wie?"],
            ["02", "Keuze", "Welke waarden en belangen bepalen de richting?"],
            ["03", "Besluit", "Wie kan handelen, met welk middel en tegen welke kosten?"],
            ["04", "Uitvoering", "Is zichtbaar of de beloofde verandering werkelijk plaatsvindt?"],
          ].map(([number, title, description]) => (
            <article className={styles.card} key={number}>
              <small>{number}</small>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <nav className={styles.topics} aria-label="Politieke vervolgroutes">
          <Link href="/standpunten">Standpunten</Link>
          <Link href="/voorstellen">Voorstellen</Link>
          <Link href="/besluiten">Besluiten</Link>
          <Link href="/uitvoering">Uitvoering</Link>
        </nav>
      </section>
    </Shell>
  );
}
