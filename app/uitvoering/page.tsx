import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Uitvoering",
};

export default function ExecutionPage() {
  return (
    <>
      <PageIntro eyebrow="Publieke verantwoording" title="Een belofte telt pas in de uitvoering.">
        <p>
          Ampara volgt niet alleen aangenomen voorstellen, maar ook capaciteit,
          budget, termijnen en verdelingseffecten. Hier wordt zichtbaar wanneer
          een probleem werkelijk afneemt of alleen naar een andere plek schuift.
        </p>
      </PageIntro>

      <section className="monitor-metrics">
        <div className="metric">
          <small>Mijlpalen op tijd</small>
          <strong>68%</strong>
        </div>
        <div className="metric">
          <small>Budget gebruikt</small>
          <strong>€212 mln</strong>
        </div>
        <div className="metric">
          <small>Capaciteit ingezet</small>
          <strong>74%</strong>
        </div>
        <div className="metric">
          <small>Blokkades in gevaar</small>
          <strong>5</strong>
        </div>
      </section>

      <section className="monitor-grid">
        <div className="chart-panel">
          <p className="eyebrow">Voortgang door de tijd</p>
          <h2>Zorguitstroom en beschikbare woningen.</h2>
          <div className="line-chart" aria-label="Voortgangsgrafiek">
            <svg viewBox="0 0 100 50" preserveAspectRatio="none">
              <polyline
                className="target"
                points="0,44 12,39 25,34 38,29 50,24 63,19 75,14 88,9 100,4"
              />
              <polyline points="0,47 12,44 25,39 38,38 50,31 63,29 75,23 88,23 100,15" />
            </svg>
          </div>
        </div>
        <aside className="blocker-panel">
          <p className="eyebrow">Belangrijkste blokkades</p>
          <h3>Uitvoering loopt niet overal gelijk.</h3>
          <ol className="timeline">
            <li>
              <strong>Woningtekort in voorraad</strong>
              <small>Hoge impact</small>
            </li>
            <li>
              <strong>Personeelstekort corporaties</strong>
              <small>Hoge impact</small>
            </li>
            <li>
              <strong>Onvoldoende preventiebudget</strong>
              <small>Gemiddelde impact</small>
            </li>
          </ol>
          <div className="alert">
            <strong>Druk verschuift naar gemeenten</strong>
            <p>
              Gemeenten signaleren toenemende druk op opvang en maatschappelijke
              ondersteuning.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
