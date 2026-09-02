import type { DossierDocument } from "@/lib/content-types";

type DocumentReaderProps = {
  documents: DossierDocument[];
};

function pageAnchor(documentSlug: string, pageNumber: number) {
  return `document-${documentSlug}-page-${pageNumber}`;
}

export default function DocumentReader({ documents }: DocumentReaderProps) {
  if (!documents.length) return null;

  return (
    <section className="document-reader" id="documenten">
      <header className="document-reader__header">
        <div>
          <p className="eyebrow">Volledige brondocumenten</p>
          <h2 className="section-title">Lees de oorspronkelijke inhoud in dezelfde structuur.</h2>
        </div>
        <p>
          De inhoudsopgave verwijst rechtstreeks naar de bijbehorende bronpagina. De tekst
          blijft per pagina bewaard, zodat de plaats in het oorspronkelijke document zichtbaar is.
        </p>
      </header>

      {documents.length > 1 ? (
        <nav className="document-reader__switcher" aria-label="Documenten in dit dossier">
          {documents.map((document) => (
            <a href={`#document-${document.slug}`} key={document.id}>{document.title}</a>
          ))}
        </nav>
      ) : null}

      {documents.map((document) => (
        <article className="document-reader__document" id={`document-${document.slug}`} key={document.id}>
          <header className="document-reader__document-header">
            <div>
              <small>{document.role === "primary" ? "Hoofddocument" : "Brondocument"}</small>
              <h3>{document.title}</h3>
              {document.description ? <p>{document.description}</p> : null}
            </div>
            <dl>
              <div><dt>Pagina&apos;s</dt><dd>{document.pageCount}</dd></div>
              <div><dt>Inhoudspunten</dt><dd>{document.sectionCount}</dd></div>
            </dl>
          </header>

          <div className="document-reader__layout">
            <aside className="document-reader__toc">
              <details open>
                <summary>Inhoudsopgave</summary>
                <nav aria-label={`Inhoudsopgave van ${document.title}`}>
                  {document.sections.length > 0 ? document.sections.map((section) => (
                    <a
                      className={`document-reader__toc-level-${Math.min(section.level, 3)}`}
                      href={`#${pageAnchor(document.slug, section.pageNumber)}`}
                      key={section.id}
                    >
                      <span>{section.title}</span>
                      <small>{section.pageNumber}</small>
                    </a>
                  )) : document.pages.map((page) => (
                    <a href={`#${pageAnchor(document.slug, page.pageNumber)}`} key={page.id}>
                      <span>Pagina {page.pageNumber}</span>
                      <small>{page.pageNumber}</small>
                    </a>
                  ))}
                </nav>
              </details>
            </aside>

            <div className="document-reader__pages">
              {document.pages.map((page) => (
                <section
                  className="document-reader__page"
                  id={pageAnchor(document.slug, page.pageNumber)}
                  key={page.id}
                >
                  <header>
                    <span>Bronpagina</span>
                    <strong>{String(page.pageNumber).padStart(2, "0")}</strong>
                  </header>
                  <div>{page.text}</div>
                  <a href={`#document-${document.slug}`}>Terug naar document ↑</a>
                </section>
              ))}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
