import Link from "next/link";
import { BrandMark } from "./BrandMark";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <span className="site-footer__index">AEGIS · 01</span>
        <BrandMark compact />
        <p>Van gedeelde kennis naar democratische verandering.</p>
      </div>
      <div className="site-footer__links">
        <Link href="/over-aegis">Beginselen</Link>
        <Link href="/besluiten">Besluiten</Link>
        <Link href="/netwerk">Kennisnetwerk</Link>
        <a href="mailto:contact@aegis.nl">Contact</a>
      </div>
      <div className="site-footer__meta">
        <span>Openbaar</span>
        <span>Controleerbaar</span>
        <span>Democratisch</span>
      </div>
    </footer>
  );
}
