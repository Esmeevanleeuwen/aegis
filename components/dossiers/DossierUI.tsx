import Link from "next/link";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import {
  absoluteUrl,
  isPreview,
  partnerName,
  partnerUrl,
  platformName,
} from "@/lib/dossier-platforms";
import {
  chapterPath,
  dossierPath,
  topicSlug,
  type DossierChapter,
  type DossierSummary,
} from "@/lib/dossier-core";
import { partnerDossiers } from "@/lib/dossier-partner";
import styles from "./DossierUI.module.css";

export { styles };

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  indexable = true,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: { index: indexable && !isPreview, follow: true },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: platformName,
      type: "website",
      locale: "nl_NL",
    },
    twitter: { card: "summary", title, description },
  };
}

export function Shell({ children }: { children: ReactNode }) {
  return <div className={styles.shell}>{children}</div>;
}

export function Breadcrumbs({
  items,
}: {
  items: { title: string; href: string }[];
}) {
  const crumbs = [{ title: "AMPARA", href: "/" }, ...items];

  return (
    <nav className={styles.breadcrumb} aria-label="Broodkruimelpad">
      <ol>
        {crumbs.map((item, index) => (
          <li key={`${item.href}-${index}`}>
            <Link
              href={item.href}
              aria-current={index === crumbs.length - 1 ? "page" : undefined}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Cards({ items }: { items: DossierSummary[] }) {
  return (
    <div className={styles.agenda}>
      {items.map((item, index) => (
        <Link key={item.slug} href={dossierPath(item.slug)} className={styles.agendaRow}>
          <span className={styles.agendaNumber}>{String(index + 1).padStart(2, "0")}</span>
          <div className={styles.agendaBody}>
            <small>{item.status}</small>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
          <div className={styles.agendaMeta}>
            <span>{item.themes.join(" / ") || "Publiek dossier"}</span>
            <b aria-hidden="true">→</b>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function Topics({ themes }: { themes: string[] }) {
  const topics = [...new Map(
    themes.map((title) => [topicSlug(title), title]),
  ).entries()].filter(([slug]) => slug);

  return (
    <nav className={styles.topics} aria-label="Thema’s in dit dossier">
      {topics.map(([slug, title]) => (
        <Link href={`/themas/${slug}`} key={slug}>{title}</Link>
      ))}
    </nav>
  );
}

export function ChapterNav({
  slug,
  chapters,
  current,
}: {
  slug: string;
  chapters: DossierChapter[];
  current?: string;
}) {
  return (
    <details className={styles.toc} open>
      <summary>Route door dit dossier</summary>
      <nav aria-label="Dossierhoofdstukken">
        <Link href={dossierPath(slug)}>
          <span className={styles.tocIndex}>00</span>
          <span>Politiek overzicht</span>
        </Link>
        {chapters.map((item, index) => (
          <Link
            key={item.id}
            href={chapterPath(slug, item.id)}
            aria-current={item.id === current ? "page" : undefined}
          >
            <span className={styles.tocIndex}>{String(index + 1).padStart(2, "0")}</span>
            <span>{item.title}</span>
          </Link>
        ))}
        <Link href={`${dossierPath(slug)}#politieke-afweging`}>
          <span className={styles.tocIndex}>K</span>
          <span>Keuze en vervolgstappen</span>
        </Link>
        <Link href={`${dossierPath(slug)}#bronnen`}>
          <span className={styles.tocIndex}>B</span>
          <span>Gedeelde bronnen</span>
        </Link>
      </nav>
    </details>
  );
}

export async function PartnerLinks({ dossier }: { dossier: DossierSummary }) {
  const items = await partnerDossiers(dossier);
  const hasMatchingView = dossier.availableOn?.includes("meridian") ?? false;
  const relatedItems = items.filter((item) => item.slug !== dossier.slug);

  return (
    <section className={styles.researchBridge} aria-label={`Verbinding met ${partnerName}`}>
      <div>
        <span className={styles.bridgeCode}>ONDERLIGGEND ONDERZOEK</span>
        <h2>Controleer de analyse bij Meridian.</h2>
        <p>
          Ampara maakt politieke keuzes, maar bezit de feiten niet. Dezelfde dossierkern
          kan bij Meridian zelfstandig worden onderzocht, aangevuld en tegengesproken.
        </p>
      </div>
      <div className={styles.bridgeLinks}>
        {hasMatchingView && (
          <a href={`${partnerUrl}${dossierPath(dossier.slug)}`}>
            <span>Hetzelfde gedeelde dossier · zelfstandige onderzoeksweergave</span>
            <strong>{dossier.title}</strong>
            <b>Open precies dit onderzoek ↗</b>
          </a>
        )}
        {relatedItems.map((item) => (
          <a key={item.slug} href={`${partnerUrl}${dossierPath(item.slug)}`}>
            <span>{item.reason}</span>
            <strong>{item.title}</strong>
            <b>Open een verwant onderzoek ↗</b>
          </a>
        ))}
        {!hasMatchingView && relatedItems.length === 0 && (
          <a href={`${partnerUrl}/dossiers`}>
            <span>Onafhankelijke kennislaag</span>
            <strong>Dossiers bij Meridian</strong>
            <b>Ga naar Meridian ↗</b>
          </a>
        )}
      </div>
    </section>
  );
}
