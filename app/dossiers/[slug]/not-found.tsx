import Link from "next/link";

export default function DossierNotFound() {
  return (
    <section className="page-section">
      <p className="eyebrow">Niet gevonden</p>
      <h1 className="section-title">Dit dossier is nog niet gepubliceerd.</h1>
      <Link className="text-link" href="/dossiers">Terug naar alle dossiers →</Link>
    </section>
  );
}
