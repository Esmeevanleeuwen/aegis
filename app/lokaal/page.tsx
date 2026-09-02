import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { localGroups } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Lokaal",
};

export default function LocalPage() {
  return (
    <>
      <PageIntro eyebrow="Dicht bij de uitvoering" title="Landelijke keuzes worden lokaal werkelijk.">
        <p>
          Lokale pagina’s verbinden landelijke dossiers aan gemeenten,
          voorzieningen, besluiten en groepen. Zo blijft zichtbaar waar
          capaciteit ontbreekt en waar mensen al gezamenlijk organiseren.
        </p>
      </PageIntro>
      <section className="local-layout">
        <div className="local-map">
          <svg viewBox="0 0 300 520" role="img" aria-label="Kaart van Nederland met lokale Aegis-groepen">
            <path d="M111 10 174 22 211 50 226 96 206 136 237 172 228 217 256 250 237 294 215 315 220 360 189 401 178 459 142 505 113 482 102 438 73 406 67 352 36 321 47 274 72 247 64 203 90 166 83 116 101 81Z" />
            <circle cx="177" cy="93" r="9" />
            <circle cx="121" cy="147" r="9" />
            <circle cx="146" cy="220" r="9" />
            <circle cx="103" cy="283" r="9" />
            <circle cx="183" cy="333" r="9" />
            <circle cx="128" cy="428" r="9" />
          </svg>
        </div>
        <div className="local-list">
          <p className="eyebrow">Lokale groepen actief</p>
          <h2>Vind Aegis in jouw omgeving.</h2>
          <p>
            Iedere groep gebruikt dezelfde openbare dossiers, maar bepaalt zelf
            welke lokale uitvoering en politieke voorstellen nodig zijn.
          </p>
          <div>
            {localGroups.map(([name, date]) => (
              <div className="local-list__row" key={name}>
                <strong>{name}</strong>
                <small>Laatste activiteit · {date}</small>
              </div>
            ))}
          </div>
          <a className="button" href="mailto:contact@aegis.nl">
            Start een lokale groep
          </a>
        </div>
      </section>
    </>
  );
}
