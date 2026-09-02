import Link from "next/link";
import { BrandMark } from "./BrandMark";

const navigation = [
  ["Dossiers", "/dossiers"],
  ["Standpunten", "/standpunten"],
  ["Voorstellen", "/voorstellen"],
  ["Uitvoering", "/uitvoering"],
  ["Lokaal", "/lokaal"],
  ["Over Aegis", "/over-aegis"],
] as const;

export function Header() {
  return (
    <header className="site-header">
      <Link className="site-header__brand" href="/" aria-label="Aegis home">
        <BrandMark compact />
      </Link>
      <nav className="desktop-nav" aria-label="Hoofdnavigatie">
        {navigation.map(([label, href]) => (
          <Link href={href} key={href}>
            {label}
          </Link>
        ))}
        <Link href="/netwerk">Zoeken</Link>
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
