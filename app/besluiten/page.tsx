import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Besluiten",
};

export default function DecisionsPage() {
  return (
    <>
      <PageIntro eyebrow="Openbare besluitvorming" title="Ieder besluit houdt zijn geschiedenis.">
        <p>
          Stemmen, amendementen, minderheidsreacties en belangenverklaringen
          blijven zichtbaar. Zo kan iedereen volgen hoe een voorstel veranderde
          en wie verantwoordelijkheid draagt voor de uitkomst.
        </p>
      </PageIntro>
      <section className="decision-grid">
        <div>
          <p className="eyebrow">Besluit AEG-2026-07</p>
          <h2>Wonen als publieke ondergrens.</h2>
          <p>Aangenomen op 26 juni 2026 door het landelijke ledenberaad.</p>
          <div className="vote-count">
            <div>
              <small>Voor</small>
              <strong>842</strong>
            </div>
            <div>
              <small>Tegen</small>
              <strong>183</strong>
            </div>
            <div>
              <small>Onthouden</small>
              <strong>47</strong>
            </div>
          </div>
          <Link className="text-link" href="/uitvoering">
            Volg de uitvoering <span>→</span>
          </Link>
        </div>
        <div>
          <h3>Aangenomen amendementen</h3>
          <table className="editorial-table">
            <tbody>
              <tr>
                <td>A01</td>
                <td>Versterk de rol van huurdersorganisaties.</td>
                <td>Aangenomen · 812/204</td>
              </tr>
              <tr>
                <td>A02</td>
                <td>Maak extra middelen voor preventie controleerbaar.</td>
                <td>Aangenomen · 803/195</td>
              </tr>
            </tbody>
          </table>
          <h3 style={{ marginTop: "60px" }}>Minderheidsreactie</h3>
          <p>
            Een minderheid waarschuwt dat de eerste financieringsfase te veel
            afhankelijk blijft van gemeentelijke draagkracht. Deze reactie blijft
            aan het besluit verbonden en wordt bij de evaluatie opnieuw getoetst.
          </p>
          <h3 style={{ marginTop: "60px" }}>Auditspoor</h3>
          <p>
            Voorstel, bronversies, wijzigingen, belangenverklaringen en
            stemuitslag zijn afzonderlijk terug te vinden.
          </p>
        </div>
      </section>
    </>
  );
}
