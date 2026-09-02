import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { dossiers, ecosystem } from "@/lib/site-data";

export default function Home() {
  return (
    <>
      <section className="home-brand">
        <p className="eyebrow">Publieke grondslag</p>
        <div className="home-brand__lockup">
          <BrandMark />
        </div>
        <div className="color-rule" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="foundation">
        <div
          className="photo photo--builders"
          role="img"
          aria-label="Mensen werken gezamenlijk aan een publieke constructie"
        />
        <div className="foundation__copy">
          <p className="eyebrow">Bescherming door organisatie</p>
          <h1>Bescherming wordt politiek wanneer we haar samen organiseren.</h1>
          <p>
            Aegis verbindt onafhankelijk onderzoek, publieke kennis en menselijke
            ervaring aan keuzes waar leden werkelijk over kunnen beslissen.
          </p>
          <Link className="text-link" href="/over-aegis">
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
        <p className="eyebrow">Van dagelijks leven naar uitvoering</p>
        <div className="photo photo--people system-line__photo">
          <div className="system-line__overlay" aria-hidden="true">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none">
              <polyline points="4,24 25,28 49,24 72,29 97,22" />
              <circle cx="4" cy="24" r="0.8" />
              <circle cx="25" cy="28" r="0.8" />
              <circle cx="49" cy="24" r="0.8" />
              <circle cx="72" cy="29" r="0.8" />
              <circle cx="97" cy="22" r="0.8" />
            </svg>
            <div className="system-line__labels">
              <span>Ervaring</span>
              <span>Patroon</span>
              <span>Bewijs</span>
              <span>Besluit</span>
              <span>Uitvoering</span>
            </div>
          </div>
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
            <small>Actieve dossiers</small>
            <strong>24</strong>
          </div>
          <div className="metric">
            <small>Gecontroleerde bronnen</small>
            <strong>6.732</strong>
          </div>
          <div className="metric">
            <small>Voorstellen</small>
            <strong>18</strong>
          </div>
          <div className="metric">
            <small>Lokale groepen</small>
            <strong>12</strong>
          </div>
        </div>
      </section>

      <section className="current-dossiers container">
        <div className="section-header">
          <div>
            <p className="eyebrow">Publieke dossiers</p>
            <h2 className="section-title">Waar systemen vastlopen.</h2>
          </div>
          <Link className="text-link" href="/dossiers">
            Alle dossiers <span>→</span>
          </Link>
        </div>
        <div className="dossier-cards">
          {dossiers.slice(0, 3).map((dossier, index) => (
            <Link
              className="dossier-card"
              href={
                index === 0 ? "/dossiers/de-uitgang-is-vol" : "/dossiers"
              }
              key={dossier.slug}
            >
              <span className="dossier-card__number">0{index + 1}</span>
              <h3>{dossier.title}</h3>
              <p>{dossier.outcome}</p>
              <div className="dossier-card__meta">
                <span>{dossier.status}</span>
                <span>{dossier.relations} relaties</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="ecosystem-section">
        <div className="container">
          <div className="ecosystem-section__intro">
            <h2>Van kennis naar verandering.</h2>
            <p>
              Aegis bezit de andere platforms niet. Het gebruikt hun openbare
              kennis en maakt zichtbaar waar feiten eindigen en een politieke
              keuze begint.
            </p>
          </div>
          <div className="ecosystem-grid">
            {ecosystem.map(([name, role, description]) => (
              <article className="ecosystem-card" key={name}>
                <small>{role}</small>
                <h3>{name}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
