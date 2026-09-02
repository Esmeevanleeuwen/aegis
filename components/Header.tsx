import Link from "next/link";
import { BrandMark } from "./BrandMark";

const navigation = [
  ["Dossiers", "/dossiers"],
  ["Standpunten", "/standpunten"],
  ["Voorstellen", "/voorstellen"],
  ["Uitvoering", "/uitvoering"],
  ["Lokaal", "/lokaal"],
  ["Over Ampara", "/over-ampara"],
] as const;

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__identity">
        <span className="site-header__edition" aria-hidden="true">01</span>
        <Link className="site-header__brand" href="/" aria-label="Ampara home">
          <BrandMark compact />
        </Link>
        <span className="site-header__descriptor">Publieke politieke kennis</span>
      </div>
      <nav className="desktop-nav" aria-label="Hoofdnavigatie">
        {navigation.map(([label, href]) => (
          <Link href={href} key={href}>
            {label}
          </Link>
        ))}
        <Link className="desktop-nav__search" href="/netwerk" aria-label="Open het kennisnetwerk">
          Netwerk <span aria-hidden="true">↗</span>
        </Link>
      </nav>
      <details className="mobile-menu">
        <summary>Menu</summary>
        <nav aria-label="Mobiele navigatie">
          {navigation.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
          <Link href="/netwerk">Kennisnetwerk</Link>
        </nav>
      </details>
    </header>
  );
}
