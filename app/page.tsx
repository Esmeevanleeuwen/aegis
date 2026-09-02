import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { SystemTrace } from "@/components/SystemTrace";
import { getPublishedDossiers, getPublishedLibraryStats } from "@/lib/queries/dossiers";
import { localGroups } from "@/lib/site-data";

const politicalRoute = [
  ["01", "Dossier", "Begrijp het patroon achter losse gebeurtenissen.", "/dossiers"],
  ["02", "Keuze", "Zie waar feiten eindigen en waarden richting geven.", "/standpunten"],
  ["03", "Besluit", "Volg voorstellen, wijzigingen en stemmingen.", "/besluiten"],
  ["04", "Uitvoering", "Controleer wat aantoonbaar verandert.", "/uitvoering"],
] as const;

export default async function Home() {
  const [dossiers, libraryStats] = await Promise.all([
    getPublishedDossiers(),
    getPublishedLibraryStats(),
  ]);
  const [leadDossier, ...otherDossiers] = dossiers;

  return (
    <>
      <section className="home-brand">
        <div className="home-brand__rail">
          <span>01</span>
          <span>Politieke kennislaag</span>
        </div>
        <div className="home-brand__lockup">
          <BrandMark />
          <p>Van publieke kennis naar democratische verandering.</p>
        </div>
      </section>

      <section className="foundation">
        <div className="photo photo--builders" role="img" aria-label="Mensen werken gezamenlijk aan een publieke constructie">
          <SystemTrace labels={["Ervaring", "Patroon", "Organisatie", "Verandering"]} />
        </div>
        <div className="foundation__copy">
          <p className="eyebrow">Collectieve bescherming</p>
          <h1>Bescherming wordt politiek wanneer we haar samen organiseren.</h1>
          <p>
            Ampara verbindt onafhankelijk onderzoek, publieke kennis en menselijke
            ervaring aan keuzes waar leden werkelijk over kunnen beslissen.
          </p>
          <Link className="text-link" href="/over-ampara">
            Lees onze grondslag <span>→</span>
          </Link>
        </div>
      </section>

      <nav className="choice-grid" aria-label="Kies een ingang">
        <Link href="/dossiers">
          Ik wil het systeem begrijpen <span>→</span>
        </Link>
        <Link href="/standpunten">
          Ik wil onze keuzes bekijken <span>→</span>
        </Link>
        <Link href="/voorstellen">
          Ik wil meebeslissen <span>→</span>
        </Link>
      </nav>

      <section className="system-line">
        <div className="section-kicker">
          <span>02</span>
          <p className="eyebrow">De gedeelde lijn</p>
        </div>
        <div className="photo photo--people system-line__photo">
          <SystemTrace labels={["Ervaring", "Onderzoek", "Keuze", "Uitvoering"]} />
        </div>
        <div className="system-line__intro">
          <h2>Eén lijn van dagelijks leven naar politieke verandering.</h2>
          <div>
            <p>
              Wat mensen meemaken wordt niet direct een politieke leus. Signalen
              worden verbonden aan patronen, bronnen, rechten en uitvoerbare
              keuzes. Daarna blijft zichtbaar wat er werkelijk verandert.
            </p>
            <Link className="text-link" href="/netwerk">
              Bekijk hoe het werkt <span>→</span>
            </Link>
          </div>
        </div>
        <div className="metrics">
          <div className="metric">
            <small>Publieke dossiers</small>
            <strong>{dossiers.length}</strong>
          </div>
          <div className="metric">
            <small>Volledige documenten</small>
            <strong>{libraryStats.documents}</strong>
          </div>
          <div className="metric">
            <small>Leesbare bronpagina&apos;s</small>
            <strong>{libraryStats.pages}</strong>
          </div>
          <div className="metric">
            <small>Navigatiepunten</small>
            <strong>{libraryStats.sections}</strong>
          </div>
        </div>
      </section>

      <section className="current-dossiers container">
        <div className="section-header">
          <div>
            <div className="section-kicker">
              <span>03</span>
              <p className="eyebrow">Publieke signalen</p>
            </div>
            <h2 className="section-title">Waar systemen vastlopen.</h2>
          </div>
          <Link className="text-link" href="/dossiers">
            Alle dossiers <span>→</span>
          </Link>
        </div>
        <div className="dossier-showcase">
          {leadDossier ? (
            <Link className="dossier-feature" href={`/dossiers/${leadDossier.slug}`}>
              <span className="dossier-card__number">01 · Hoofddossier</span>
              <h3>{leadDossier.title}</h3>
              <p>{leadDossier.outcome}</p>
              <div className="dossier-card__meta">
                <span>{leadDossier.status}</span>
                <span>Open dossier ↗</span>
              </div>
            </Link>
          ) : null}
          <div className="dossier-index">
            {otherDossiers.map((dossier, index) => (
              <Link href={`/dossiers/${dossier.slug}`} key={dossier.slug}>
                <span>{String(index + 2).padStart(2, "0")}</span>
                <strong>{dossier.title}</strong>
                <small>{dossier.themes.join(" · ")}</small>
                <b aria-hidden="true">↗</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-commons">
        <div className="home-commons__content">
          <div className="section-kicker">
            <span>04</span>
            <p className="eyebrow">De lokale laag</p>
          </div>
          <h2>Collectieven in jouw omgeving.</h2>
          <p>
            Dezelfde publieke kennis krijgt lokaal betekenis. Groepen verbinden
            landelijke dossiers aan voorzieningen, capaciteit en besluiten in hun omgeving.
          </p>
          <div className="home-commons__list">
            {localGroups.map(([name, date]) => (
              <div key={name}>
                <strong>{name}</strong>
                <span>{date}</span>
              </div>
            ))}
          </div>
          <Link className="text-link" href="/lokaal">
            Bekijk de lokale laag <span>→</span>
          </Link>
        </div>
        <div className="home-commons__map">
          <div className="home-commons__map-meta">
            <span>Nederland</span>
            <span>5 actieve gebieden</span>
          </div>
          <svg viewBox="0 0 420 560" role="img" aria-label="Kaart van Nederland met vijf actieve Ampara-gebieden">
            <path d="M155 24 237 40 286 82 304 136 279 184 318 230 306 278 342 323 316 372 287 396 294 444 253 489 238 536 190 520 176 478 137 446 128 397 89 365 103 316 133 285 123 236 157 195 147 145 169 102Z" />
            <polyline points="235,113 170,171 203,254 151,326 251,382" />
            <circle cx="235" cy="113" r="8" />
            <circle cx="170" cy="171" r="8" />
            <circle cx="203" cy="254" r="8" />
            <circle cx="151" cy="326" r="8" />
            <circle cx="251" cy="382" r="8" />
          </svg>
          <p>Landelijke kennis wordt pas bescherming wanneer zij lokaal handelbaar wordt.</p>
        </div>
      </section>

      <section className="political-route">
        <div className="photo photo--portrait political-route__photo" role="img" aria-label="Portret van iemand die betrokken is bij publieke verandering">
          <SystemTrace labels={["Kennis", "Keuze", "Besluit", "Resultaat"]} />
        </div>
        <div className="political-route__content">
          <div className="section-kicker">
            <span>05</span>
            <p className="eyebrow">Van inzicht naar bescherming</p>
          </div>
          <h2>Een dossier eindigt niet bij de conclusie.</h2>
          <p>
            Iedere analyse krijgt een zichtbare politieke route. Zo blijft helder
            wat onderzocht is, waar Ampara kiest en of die keuze in de praktijk werkt.
          </p>
          <nav className="route-list" aria-label="Politieke route">
            {politicalRoute.map(([number, title, description, href]) => (
              <Link href={href} key={title}>
                <span>{number}</span>
                <strong>{title}</strong>
                <small>{description}</small>
                <b aria-hidden="true">↗</b>
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </>
  );
}
