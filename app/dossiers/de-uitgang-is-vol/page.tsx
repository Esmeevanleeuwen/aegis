import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "De uitgang is vol",
  description:
    "Hoe woningtekort de uitstroom uit zorg blokkeert en druk naar andere systemen verplaatst.",
};

const chain = [
  ["01", "Geen passende woning", "Mensen kunnen niet veilig of zelfstandig uitstromen."],
  ["02", "Geen uitstroom", "Een zorgplek blijft bezet terwijl behandeling is afgerond."],
  ["03", "Zorgplek blijft bezet", "Nieuwe mensen wachten langer op passende zorg."],
  ["04", "Wachttijd groeit", "De situatie verslechtert terwijl ondersteuning uitblijft."],
  ["05", "Druk verschuift", "Gezinnen, gemeenten, politie en crisiszorg vangen de gevolgen op."],
];

export default function DossierPage() {
  return (
    <>
      <section className="dossier-hero">
        <div className="dossier-hero__copy">
          <p className="eyebrow">Dossier · wonen en zorg</p>
          <h1>De uitgang is vol.</h1>
          <p>
            Woningtekorten blokkeren zorg, veiligheid en zelfstandigheid. Dit
            dossier volgt hoe één ontbrekende voorziening meerdere publieke
            systemen tegelijk vastzet.
          </p>
          <Link className="text-link" href="#keten">
            Bekijk de keten <span>↓</span>
          </Link>
        </div>
        <div
          className="photo photo--institution dossier-hero__photo"
          role="img"
          aria-label="Publieke institutionele ruimte"
        />
      </section>

      <nav className="local-tabs" aria-label="Onderdelen van dit dossier">
        {[
          "Overzicht",
          "Keten",
          "Data",
          "Tijdlijn",
          "Netwerk",
          "Rechten",
          "Voorstellen",
          "Bronnen",
        ].map((item) => (
          <a href={item === "Keten" ? "#keten" : "#verdieping"} key={item}>
            {item}
          </a>
        ))}
      </nav>

      <section className="status-grid" aria-label="Bewijsstatus">
        <div className="status-block">
          <small>Vastgesteld</small>
          <strong>24</strong>
          <span>bevindingen met controleerbare onderbouwing</span>
        </div>
        <div className="status-block">
          <small>Betwist</small>
          <strong>8</strong>
          <span>bevindingen waar bronnen elkaar tegenspreken</span>
        </div>
        <div className="status-block">
          <small>Onbekend</small>
          <strong>6</strong>
          <span>vragen waarvoor nog informatie ontbreekt</span>
        </div>
      </section>

      <section className="causal-section" id="keten">
        <p className="eyebrow">De causale keten</p>
        <h2 className="section-title">Het probleem stopt niet bij de voordeur.</h2>
        <div className="causal-chain">
          {chain.map(([number, title, description]) => (
            <article className="causal-node" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="knowledge-links" id="verdieping">
        <Link className="knowledge-link" href="/netwerk">
          <small>Phosphoros · bewijs</small>
          <h3>Controleer de bronnen en bewijsstatus.</h3>
          <span>Open de onderbouwing →</span>
        </Link>
        <Link className="knowledge-link" href="/netwerk">
          <small>Meridian · context</small>
          <h3>Bekijk hoe deze afhankelijkheid is ontstaan.</h3>
          <span>Open de systeemcontext →</span>
        </Link>
        <Link className="knowledge-link" href="/standpunten">
          <small>Aegora · rechten</small>
          <h3>Lees welke bescherming en route nu gelden.</h3>
          <span>Open de rechtslaag →</span>
        </Link>
      </section>
    </>
  );
}
