"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Dossier } from "@/lib/site-data";

export function DossierExplorer({ dossiers }: { dossiers: Dossier[] }) {
  const themes = useMemo(
    () => ["Alles", ...Array.from(new Set(dossiers.flatMap((dossier) => dossier.themes)))],
    [dossiers],
  );

  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("Alles");

  const visible = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return dossiers.filter((dossier) => {
      const matchesTheme =
        theme === "Alles" || dossier.themes.includes(theme);
      const matchesQuery =
        !normalized ||
        `${dossier.title} ${dossier.outcome} ${dossier.themes.join(" ")}`
          .toLowerCase()
          .includes(normalized);
      return matchesTheme && matchesQuery;
    });
  }, [dossiers, query, theme]);

  return (
    <div className="dossier-explorer">
      <div className="filter-bar">
        <label>
          <span className="sr-only">Zoek in dossiers</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Zoek dossiers"
          />
        </label>
        <div className="filter-bar__themes" aria-label="Filter op onderwerp">
          {themes.map((item) => (
            <button
              className={theme === item ? "is-active" : ""}
              key={item}
              onClick={() => setTheme(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="result-count">
        <span>Openbare dossiers</span>
        <strong>{visible.length} gevonden</strong>
      </div>
      <div className="dossier-list">
        {visible.map((dossier, index) => (
          <Link
            className="dossier-row"
            href={`/dossiers/${dossier.slug}`}
            key={dossier.slug}
          >
            <span className="dossier-row__number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="dossier-row__title">
              <small>{dossier.themes.join(" · ")}</small>
              <strong>{dossier.title}</strong>
            </span>
            <span className="dossier-row__outcome">{dossier.outcome}</span>
            <span className="status">{dossier.status}</span>
            <span className="dossier-row__checked">
              <small>Laatste controle</small>
              {dossier.checked}
            </span>
            <span className="dossier-row__relations">
              Open dossier <b>↗</b>
            </span>
          </Link>
        ))}
        {visible.length === 0 ? (
          <div className="dossier-empty">
            <strong>Geen dossier gevonden.</strong>
            <span>Probeer een andere zoekterm of kies ‘Alles’.</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
