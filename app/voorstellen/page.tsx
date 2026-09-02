import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { proposals } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Voorstellen",
};

export default function ProposalsPage() {
  return (
    <>
      <PageIntro eyebrow="Democratische werkplaats" title="Voorstellen in behandeling.">
        <p>
          Hier wordt kennis vertaald naar een politieke keuze met een doel,
          budget, uitvoerder, termijn en zichtbare risico’s. Leden kunnen
          voorstellen volgen voordat zij een officieel besluit worden.
        </p>
        <Link className="text-link" href="/besluiten">
          Bekijk genomen besluiten <span>→</span>
        </Link>
      </PageIntro>

      <section className="page-section">
        <table className="editorial-table">
          <thead>
            <tr>
              <th>Voorstel</th>
              <th>Onderwerp</th>
              <th>Fase</th>
              <th>Laatste wijziging</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal) => (
              <tr key={proposal.title}>
                <td>
                  <strong>{proposal.title}</strong>
                </td>
                <td>{proposal.theme}</td>
                <td>
                  <span className="status">{proposal.phase}</span>
                </td>
                <td>{proposal.changed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="proposal-feature">
        <div>
          <p className="eyebrow">Uitgelicht voorstel</p>
          <h1>Wonen als voorwaarde voor zorguitstroom.</h1>
          <dl className="fact-list">
            <div>
              <dt>Doel</dt>
              <dd>Zorguitstroom mogelijk maken met passende publieke woningen.</dd>
            </div>
            <div>
              <dt>Politieke keuze</dt>
              <dd>Capaciteit organiseren vóórdat een hulpvraag escaleert.</dd>
            </div>
            <div>
              <dt>Kosten</dt>
              <dd>Structureel €610 miljoen, verdeeld over wonen en zorg.</dd>
            </div>
            <div>
              <dt>Uitvoerder</dt>
              <dd>Gemeenten, woningcorporaties en zorginstellingen.</dd>
            </div>
          </dl>
        </div>
        <div>
          <p className="eyebrow">Fase</p>
          <h3>In ledenbehandeling</h3>
          <ol className="timeline">
            <li>
              <strong>Indiening</strong>
              <small>10 april 2026</small>
            </li>
            <li>
              <strong>Open consultatie</strong>
              <small>5–19 mei 2026</small>
            </li>
            <li>
              <strong>Ledenberaad</strong>
              <small>22 mei–5 juni 2026</small>
            </li>
            <li>
              <strong>Besluitvorming</strong>
              <small>26 juni 2026</small>
            </li>
          </ol>
          <Link className="button" href="/dossiers/de-uitgang-is-vol">
            Bekijk onderbouwing
          </Link>
        </div>
      </section>
    </>
  );
}
