import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDossiers,
  getDossier,
  getSourcesForDossier,
} from "@/lib/dossier-network";
import {
  chapterPath,
  dossierPath,
  relatedDossiers,
  sourcePath,
} from "@/lib/dossier-core";
import {
  Breadcrumbs,
  PartnerLinks,
  Shell,
  Topics,
  pageMetadata,
  styles,
} from "@/components/dossiers/DossierUI";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

type CausalStep = {
  number: string;
  title: string;
  description: string;
};

function getCausalChain(value: unknown): CausalStep[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const row = item as Record<string, unknown>;
    const title = typeof row.title === "string" ? row.title : "";
    if (!title) return [];
    return [{
      number: typeof row.number === "string" ? row.number : "—",
      title,
      description: typeof row.description === "string" ? row.description : "",
    }];
  });
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const dossier = await getDossier(slug);
  return dossier
    ? pageMetadata(dossier.title, dossier.description, dossierPath(slug), dossier.indexable)
    : { title: "Dossier niet gevonden", robots: { index: false } };
}

export default async function DossierPage({ params }: Props) {
  const { slug } = await params;
  const dossier = await getDossier(slug);
  if (!dossier) notFound();

  const [sources, allDossiers] = await Promise.all([
    getSourcesForDossier(slug),
    getDossiers(),
  ]);
  const related = relatedDossiers(dossier, allDossiers);
  const chain = getCausalChain(dossier.presentation?.causalChain);

  return (
    <Shell>
      <Breadcrumbs
        items={[
          { title: "Publieke dossiers", href: "/dossiers" },
          { title: dossier.title, href: dossierPath(slug) },
        ]}
      />

      <header className={styles.hero}>
        <p className={styles.eyebrow}>{dossier.status}</p>
        <h1>{dossier.title}</h1>
        <p>{dossier.description}</p>
        <Topics themes={dossier.themes} />
      </header>

      <div className={styles.notice}>{dossier.boundaries}</div>

      <section className={styles.section} id="overzicht">
        <p className={styles.eyebrow}>De publieke vraag</p>
        <h2>{dossier.question}</h2>
        {dossier.introduction && <p>{dossier.introduction}</p>}
        <p><strong>Politieke werkwijze.</strong> {dossier.method}</p>
      </section>

      {chain.length > 0 && (
        <section className={styles.section} id="samenhang">
          <p className={styles.eyebrow}>De beschreven keten</p>
          <h2>Waar de druk door het systeem beweegt.</h2>
          <div className={styles.grid}>
            {chain.map((step) => (
              <article className={styles.card} key={`${step.number}-${step.title}`}>
                <small>{step.number}</small>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {dossier.claims?.length ? (
        <section className={styles.section} id="gedeelde-kern">
          <p className={styles.eyebrow}>Gedeelde kennis · geen partijbezit</p>
          <h2>De feitelijke basis waarop keuzes moeten worden getoetst.</h2>
          <p>
            Deze geregistreerde claims komen uit dezelfde centrale dossierkern die ook
            andere platforms kunnen gebruiken. Ampara kan de politieke richting bepalen,
            maar verandert daarmee niet automatisch de bewijsstatus.
          </p>
          <div className={styles.grid}>
            {dossier.claims.map((claim, index) => (
              <article className={styles.card} key={claim.id}>
                <small>Gedeelde claim {String(index + 1).padStart(2, "0")}</small>
                <h3>{claim.statement}</h3>
                {(claim.validFrom || claim.validTo) && (
                  <p>Periode: {claim.validFrom ?? "onbekend"} — {claim.validTo ?? "heden"}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className={styles.section} id="hoofdstukken">
        <p className={styles.eyebrow}>Ampara-weergave</p>
        <h2>Van probleem naar handelbare keuze.</h2>
        {dossier.chapters.length ? (
          <div className={styles.grid}>
            {dossier.chapters.map((chapter, index) => (
              <Link className={styles.card} key={chapter.id} href={chapterPath(slug, chapter.id)}>
                <small>{chapter.eyebrow || `Dossierstap ${String(index + 1).padStart(2, "0")}`}</small>
                <h3>{chapter.title}</h3>
                <p>
                  {chapter.paragraphs[0]?.slice(0, 190)}
                  {(chapter.paragraphs[0]?.length ?? 0) > 190 ? "…" : ""}
                </p>
                <span>Open deze dossierstap →</span>
              </Link>
            ))}
          </div>
        ) : (
          <p>
            De gedeelde dossierkern is beschikbaar, maar Ampara heeft voor dit onderwerp
            nog geen volledige politieke uitwerking gepubliceerd.
          </p>
        )}
      </section>

      <section className={styles.section} id="politieke-afweging">
        <p className={styles.eyebrow}>Keuze · besluit · uitvoering</p>
        <h2>Wat wil Ampara veranderen?</h2>
        <p>
          Een dossier is geen automatisch partijbesluit. Waarden, instrumenten, kosten,
          uitvoerders en meetbare resultaten moeten afzonderlijk zichtbaar blijven.
        </p>
        <div className={styles.grid}>
          {[
            ["Standpunt", "Welke waarden geven richting aan de keuze?", "/standpunten"],
            ["Voorstel", "Welk instrument wordt voorgesteld, door wie en tegen welke kosten?", "/voorstellen"],
            ["Besluit", "Welke wijziging is werkelijk aangenomen of verworpen?", "/besluiten"],
            ["Uitvoering", "Wat verandert aantoonbaar in de praktijk?", "/uitvoering"],
          ].map(([title, description, href], index) => (
            <Link className={styles.card} href={href} key={title}>
              <small>Fase {String(index + 1).padStart(2, "0")}</small>
              <h3>{title}</h3>
              <p>{description}</p>
              <span>Bekijk {title.toLowerCase()} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section} id="bronnen">
        <p className={styles.eyebrow}>Gedeelde brondocumenten</p>
        <h2>De onderbouwing blijft buiten de partijgrens controleerbaar.</h2>
        {sources.length > 0 ? (
          <div className={styles.grid}>
            {sources.map((source) => {
              const pageCount = source.pageCount ?? source.pages.length;
              const sectionCount = source.sectionCount ?? source.sections.length;
              return (
                <Link className={styles.card} key={source.id} href={sourcePath(source.slug)}>
                  <small>{pageCount} bronpagina’s · {sectionCount} inhoudspunten</small>
                  <h3>{source.title}</h3>
                  <p>{source.description}</p>
                  <span>Controleer het brondocument →</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p>
            Er zijn nog geen openbare brondocumenten aan deze dossierweergave gekoppeld.
            Dat is geen bewijs dat een politieke conclusie is vastgesteld.
          </p>
        )}
      </section>

      {related.length > 0 && (
        <section className={styles.section}>
          <p className={styles.eyebrow}>Verbonden maatschappelijke vragen</p>
          <h2>Dezelfde thema’s, verschillende verantwoordelijkheden.</h2>
          <div className={styles.grid}>
            {related.map((item) => (
              <Link className={styles.card} key={item.slug} href={dossierPath(item.slug)}>
                <small>Gedeeld thema: {item.shared.join(", ")}</small>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span>Vergelijk de politieke dossiers →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <PartnerLinks dossier={dossier} />
    </Shell>
  );
}
