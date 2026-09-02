"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { dossiers } from "@/lib/site-data";

const themes = ["Alles", "Wonen", "Zorg", "Werk", "Veiligheid", "Onderwijs"];

export function DossierExplorer() {
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
  }, [query, theme]);

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

      <p className="result-count">{visible.length} dossiers gevonden</p>
      <div className="dossier-list">
        {visible.map((dossier) => (
          <Link
            className="dossier-row"
            href={
              dossier.slug === "de-uitgang-is-vol"
                ? "/dossiers/de-uitgang-is-vol"
                : "/dossiers"
            }
            key={dossier.slug}
          >
            <span className="dossier-row__mark" aria-hidden="true" />
            <span>
              <strong>{dossier.title}</strong>
              <small>{dossier.themes.join(" · ")}</small>
            </span>
            <span>{dossier.outcome}</span>
            <span className="status">{dossier.status}</span>
            <span>
              <small>Laatste controle</small>
              {dossier.checked}
            </span>
            <span className="dossier-row__relations">
              {dossier.relations} relaties <b>→</b>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
