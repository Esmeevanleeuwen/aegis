import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DocumentReader from "@/components/DocumentReader";
import { SystemTrace } from "@/components/SystemTrace";
import { dossiers } from "@/lib/site-data";
import { getPublishedDossier, getPublishedDossierDocuments } from "@/lib/queries/dossiers";

type DossierPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return dossiers.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: DossierPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dossier = await getPublishedDossier(slug);

  if (!dossier) return { title: "Dossier niet gevonden" };
  return { title: dossier.title, description: dossier.description };
}

export default async function DossierPage({ params }: DossierPageProps) {
  const { slug } = await params;
  const [dossier, documents] = await Promise.all([
    getPublishedDossier(slug),
    getPublishedDossierDocuments(slug),
  ]);

  if (!dossier) notFound();

  const tabs = [
    { id: "overzicht", label: "Overzicht" },
    ...(dossier.chain.length ? [{ id: "keten", label: "Keten" }] : []),
    ...dossier.sections
      .filter(({ id }) => id !== "overzicht")
      .map(({ id, label }) => ({ id, label })),
    ...(documents.length ? [{ id: "documenten", label: "Documenten" }] : []),
  ];

  return (
    <>
      <section className="dossier-hero">
        <div className="dossier-hero__copy">
          <p className="eyebrow">{dossier.eyebrow}</p>
          <h1>{dossier.title}.</h1>
          <p>{dossier.description}</p>
          <div className="dossier-hero__meta">
            <span>{dossier.themes.join(" · ")}</span>
            <span>Gecontroleerd {dossier.checked}</span>
          </div>
          <Link className="text-link" href={dossier.chain.length ? "#keten" : `#${tabs[0]?.id}`}>
            Lees het dossier <span>↓</span>
          </Link>
        </div>
        <div className="photo photo--institution dossier-hero__photo" role="img" aria-label="Publieke institutionele ruimte">
          <span className="dossier-hero__index" aria-hidden="true">AMPARA · DOSSIER</span>
          <SystemTrace labels={["Signaal", "Patroon", "Keuze", "Uitvoering"]} />
        </div>
      </section>

      <nav className="local-tabs" aria-label="Onderdelen van dit dossier">
        {tabs.map((tab) => (
          <a href={`#${tab.id}`} key={tab.id}>{tab.label}</a>
        ))}
      </nav>

      <section className="status-grid" id="overzicht" aria-label="Bewijsstatus">
        <div className="status-grid__intro">
          <small>In één oogopslag</small>
          <strong>Wat weten we?</strong>
        </div>
        <div className="status-block">
          <small>Vastgesteld</small>
          <strong>{dossier.evidence.established}</strong>
          <span>bevindingen met controleerbare onderbouwing</span>
        </div>
        <div className="status-block">
          <small>Betwist</small>
          <strong>{dossier.evidence.disputed}</strong>
          <span>bevindingen waar bronnen elkaar tegenspreken</span>
        </div>
        <div className="status-block">
          <small>Onbekend</small>
          <strong>{dossier.evidence.unknown}</strong>
          <span>vragen waarvoor nog informatie ontbreekt</span>
        </div>
      </section>

      {dossier.chain.length > 0 && (
        <section className="causal-section" id="keten">
          <p className="eyebrow">De causale keten</p>
          <h2 className="section-title">Het probleem stopt niet bij de voordeur.</h2>
          <div className="causal-chain">
            {dossier.chain.map((step) => (
              <article className="causal-node" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="dossier-content">
        {dossier.sections.map((section) => (
          <section className="dossier-section" id={section.id} key={section.id}>
            <div>
              <p className="eyebrow">{section.eyebrow}</p>
              <span className="dossier-section__index">{section.label}</span>
            </div>
            <div>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </section>
        ))}
      </div>

      <DocumentReader documents={documents} />

      <section className="knowledge-links" aria-label="Vervolg binnen Ampara">
        {dossier.knowledgeLinks.map((item) => (
          <Link className="knowledge-link" href={item.href} key={item.platform}>
            <small>{item.platform} · {item.role}</small>
            <h3>{item.heading}</h3>
            <span>{item.label} →</span>
          </Link>
        ))}
      </section>
    </>
  );
}
