import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { SystemTrace } from "@/components/SystemTrace";
import { getDossiers } from "@/lib/dossier-network";
import { getTopics } from "@/lib/dossier-core";
import { MERIDIAN_URL } from "@/lib/dossier-platforms";
import { Shell, Cards, styles, pageMetadata } from "@/components/dossiers/DossierUI";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "Ampara — van kennis naar bescherming",
  "Publieke dossiers verbinden bronnen en maatschappelijke vragen met herkenbare politieke afwegingen.",
  "/",
);

const route = [
  ["01", "Dossier", "Onderzoek de vraag en controleer de onderbouwing.", "/dossiers"],
  ["02", "Keuze", "Onderscheid de feiten van onze politieke afweging.", "/standpunten"],
  ["03", "Voorstel", "Bekijk wat wordt voorgesteld en waarom.", "/voorstellen"],
  ["04", "Uitvoering", "Volg wat er met besluiten gebeurt.", "/uitvoering"],
] as const;

export default async function Home() {
  const dossiers = await getDossiers();
  const topics = getTopics(dossiers);

  return (
    <>
      <section className="home-brand">
        <div className="home-brand__rail"><span>01</span><span>Politieke kennislaag</span></div>
        <div className="home-brand__lockup"><BrandMark /><p>Van publieke kennis naar democratische verandering.</p></div>
      </section>

      <section className="foundation">
        <div className="photo photo--builders" role="img" aria-label="Mensen werken gezamenlijk aan een publieke constructie">
          <SystemTrace labels={["Ervaring", "Patroon", "Organisatie", "Verandering"]} />
        </div>
        <div className="foundation__copy">
          <p className="eyebrow">Collectieve bescherming</p>
          <h1>Bescherming wordt politiek wanneer we haar samen organiseren.</h1>
          <p>Begin bij een dossier. Lees de onderbouwing en bekijk daarna welke keuzes Ampara maakt. Een politieke voorkeur is niet hetzelfde als een vastgesteld feit.</p>
          <Link className="text-link" href="/dossiers">Verken de dossiers <span>→</span></Link>
        </div>
      </section>

      <section id="dossiers">
        <Shell>
          <header className={styles.hero}>
            <p className={styles.eyebrow}>De dossierbibliotheek</p>
            <h2 className="section-title">Eerst begrijpen. Dan kiezen.</h2>
            <p>Van hoofdstuk naar bron, van maatschappelijk onderwerp naar een concrete afweging. Alle oorspronkelijke documenten blijven via de dossiers beschikbaar.</p>
          </header>
          <nav className={styles.topics} aria-label="Dossiers per thema">
            {topics.map((topic) => <Link key={topic.slug} href={`/themas/${topic.slug}`}>{topic.title}</Link>)}
          </nav>
          <Cards items={dossiers.slice(0, 4)} />
          <nav className={styles.topics} aria-label="Meer dossierinhoud">
            <Link href="/dossiers">Alle dossiers</Link>
            <Link href="/bronnen">Oorspronkelijke documenten</Link>
            <Link href="/themas">Alle thema’s</Link>
          </nav>
        </Shell>
      </section>

      <section className="political-route">
        <div className="photo photo--portrait political-route__photo" role="img" aria-label="Portret bij publieke verandering">
          <SystemTrace labels={["Kennis", "Keuze", "Besluit", "Resultaat"]} />
        </div>
        <div className="political-route__content">
          <p className="eyebrow">Van inzicht naar bescherming</p>
          <h2>Een dossier eindigt niet bij de conclusie.</h2>
          <p>Onderzoek, politieke afweging, besluitvorming en uitvoering krijgen ieder een eigen plek. Daardoor blijft zichtbaar wat bekend is en waar Ampara kiest.</p>
          <nav className="route-list" aria-label="Politieke route">
            {route.map(([number, title, description, href]) => <Link href={href} key={title}><span>{number}</span><strong>{title}</strong><small>{description}</small><b aria-hidden="true">↗</b></Link>)}
          </nav>
        </div>
      </section>

      <Shell>
        <section className={styles.section}>
          <p className={styles.eyebrow}>Meridian en Ampara</p>
          <h2>Verbonden kennis, verschillende rollen.</h2>
          <p>Meridian onderzoekt vragen en verbanden. Ampara maakt zijn politieke afweging herkenbaar. Een verwijzing betekent niet dat onderzoek een voorstel automatisch ondersteunt.</p>
          <a href={`${MERIDIAN_URL}/dossiers`}>Bekijk de onderzoeksdossiers van Meridian →</a>
        </section>
      </Shell>
    </>
  );
}
