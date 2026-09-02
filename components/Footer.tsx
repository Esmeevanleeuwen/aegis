import Link from "next/link";
import { BrandMark } from "./BrandMark";

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <BrandMark compact />
        <p>Van gedeelde kennis naar democratische verandering.</p>
      </div>
      <div className="site-footer__links">
        <Link href="/over-aegis">Beginselen</Link>
        <Link href="/besluiten">Besluiten</Link>
        <Link href="/netwerk">Kennisnetwerk</Link>
        <a href="mailto:contact@aegis.nl">Contact</a>
      </div>
      <p className="site-footer__meta">Openbaar · Controleerbaar · Democratisch</p>
    </footer>
  );
}
