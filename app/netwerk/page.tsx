import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Kennisnetwerk",
};

export default function NetworkPage() {
  return (
    <>
      <PageIntro eyebrow="Systemische weergave" title="Bekijk niet alleen het probleem, maar de relaties eromheen.">
        <p>
          Het kennisnetwerk verbindt dossiers, claims, bronnen, gebeurtenissen,
          organisaties, wetten en voorstellen. Iedere verbinding heeft een
          benoemd type en een controleerbare herkomst.
        </p>
      </PageIntro>
      <section className="network-layout">
        <aside className="network-layers">
          <p className="eyebrow">Lagen</p>
          {[
            "Dossiers",
            "Claims",
            "Bronnen",
            "Gebeurtenissen",
            "Actoren",
            "Gemeenten",
            "Wetten",
            "Voorstellen",
          ].map((layer, index) => (
            <label key={layer}>
              <input defaultChecked={index < 5} type="checkbox" /> {layer}
            </label>
          ))}
        </aside>
        <div className="network-canvas">
          <svg viewBox="0 0 760 640" role="img" aria-label="Netwerk van kennisobjecten rond Aegis">
            <line x1="380" y1="320" x2="380" y2="100" />
            <line x1="380" y1="320" x2="620" y2="180" />
            <line x1="380" y1="320" x2="630" y2="430" />
            <line x1="380" y1="320" x2="380" y2="550" />
            <line x1="380" y1="320" x2="125" y2="440" />
            <line x1="380" y1="320" x2="135" y2="180" />
            <line x1="380" y1="100" x2="620" y2="180" />
            <line x1="125" y1="440" x2="380" y2="550" />
            <line x1="630" y1="430" x2="380" y2="550" />
            <circle className="center" cx="380" cy="320" r="80" />
            <circle cx="380" cy="100" r="63" />
            <circle cx="620" cy="180" r="63" />
            <circle cx="630" cy="430" r="63" />
            <circle cx="380" cy="550" r="63" />
            <circle cx="125" cy="440" r="63" />
            <circle cx="135" cy="180" r="63" />
            <text className="center" x="380" y="326">AEGIS</text>
            <text x="380" y="106">Dossier</text>
            <text x="620" y="186">Claim</text>
            <text x="630" y="436">Bron</text>
            <text x="380" y="556">Gebeurtenis</text>
            <text x="125" y="446">Actor</text>
            <text x="135" y="186">Voorstel</text>
          </svg>
        </div>
        <aside className="network-details">
          <p className="eyebrow">Geselecteerd dossier</p>
          <h3>De uitgang is vol</h3>
          <dl className="fact-list">
            <div>
              <dt>Type</dt>
              <dd>Dossier</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>Actief</dd>
            </div>
            <div>
              <dt>Relaties</dt>
              <dd>24 objecten</dd>
            </div>
            <div>
              <dt>Controle</dt>
              <dd>15 mei 2026</dd>
            </div>
          </dl>
        </aside>
      </section>
    </>
  );
}
