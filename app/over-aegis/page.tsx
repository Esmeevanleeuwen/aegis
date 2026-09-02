import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ecosystem } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Over Aegis",
};

const principles = [
  ["Collectief", "Bescherming wordt gezamenlijk georganiseerd en is geen liefdadigheid."],
  ["Democratisch", "Leden beslissen over koers, voorstellen, kandidaten en controle."],
  ["Systemisch", "We volgen afhankelijkheidsketens in plaats van alleen zichtbare incidenten."],
  ["Controleerbaar", "Feiten, onzekerheden, waarden, keuzes en resultaten blijven gescheiden."],
  ["Menselijk", "Beleid wordt beoordeeld op de gevolgen voor wie de minste uitwijkruimte heeft."],
  ["Onafhankelijk", "Onderzoek, rechten en ervaringen blijven buiten partijpolitieke redactie."],
];

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="Partij en politieke tussenlaag" title="Het schild beschermt alleen wanneer mensen het samen dragen.">
        <p>
          Aegis is een democratisch-socialistische partij die kennis niet bezit,
          maar politiek vertaalt. Het platform verbindt onderzoek aan een
          expliciete keuze, een uitvoerder en publieke verantwoording.
        </p>
      </PageIntro>
      <section className="principles">
        {principles.map(([title, description], index) => (
          <article className="principle" key={title}>
            <span>0{index + 1}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </section>
      <section className="ecosystem-section">
        <div className="container">
          <p className="eyebrow">Onafhankelijk netwerk</p>
          <h2>Iedere omgeving houdt haar eigen taak.</h2>
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
