import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Standpunten",
};

const positions = [
  ["Wonen", "Een woning is infrastructuur voor zorg, veiligheid en zelfstandigheid."],
  ["Zorg", "Capaciteit moet worden georganiseerd vóórdat een hulpvraag een crisis wordt."],
  ["Werk", "Risico hoort niet vanzelf bij de werknemer met de kleinste onderhandelingsmacht."],
  ["Inkomen", "Bestaanszekerheid is een publieke ondergrens, geen tijdelijke gunst."],
  ["Bestuur", "Een recht moet ook uitvoerbaar, vindbaar en controleerbaar zijn."],
  ["Democratie", "Mensen beslissen mee over keuzes die hun afhankelijkheid bepalen."],
];

export default function StandpuntenPage() {
  return (
    <>
      <PageIntro eyebrow="Politieke keuzes" title="Waar kennis eindigt, begint onze keuze.">
        <p>
          Een feit wordt niet socialistisch door het te publiceren. Ampara maakt
          daarom zichtbaar welke waarden worden toegepast, welke alternatieven
          bestaan en wie de gevolgen van een keuze draagt.
        </p>
        <Link className="text-link" href="/voorstellen">
          Bekijk voorstellen <span>→</span>
        </Link>
      </PageIntro>
      <section className="principles principles--positions">
        {positions.map(([title, text], index) => (
          <article className="principle" key={title}>
            <span>0{index + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>
    </>
  );
}
