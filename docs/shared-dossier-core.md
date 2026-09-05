# Gedeelde dossierkern

Ampara en Meridian gebruiken dezelfde openbare dossieridentiteit en dezelfde gedeelde bronnen, maar renderen geen gedeelde pagina of component.

## Scheiding

De centrale Supabase-laag bevat:

- `dossier_core_records`: slug, canonieke titel, samenvatting, thema’s, eigenaar en publicatiestatus;
- `dossier_presentations`: een afzonderlijke presentatie voor `ampara` en `meridian`;
- bestaande openbare documenten en claims uit de Aegis-bronlaag.

Ampara leest alleen de presentatie met `platform=ampara`. De eigen React-componenten, CSS, politieke route en interne navigatie blijven in deze repository.

## Openbare API

De Edge Function heet `dossier-core`.

- `GET ?platform=ampara` — catalogus;
- `GET ?platform=ampara&slug=<slug>` — één dossier met gedeelde kern en Ampara-presentatie;
- `GET ?platform=ampara&document=<slug>` — één brondocument met gekoppelde dossiers.

De server gebruikt `DOSSIER_CORE_API_URL` wanneer die bestaat. Anders wordt de functie-URL afgeleid van `NEXT_PUBLIC_SUPABASE_URL`. De sleutel komt uit `DOSSIER_CORE_API_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` of `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## Publicatie en cache

Server-fetches worden vijf minuten gecachet en hebben dossier-tags. Wanneer de centrale API niet bereikbaar of niet geconfigureerd is, blijft Ampara werken met de bestaande openbare Aegis-data. Dat is een noodroute, niet een tweede bron van waarheid.

Conceptpresentaties blijven `noindex`. Alleen een eigen Ampara-presentatie met `indexable=true` komt in de sitemap. Een Meridian-publicatie maakt dus niet automatisch een indexeerbare Ampara-pagina.

## Automatische synchronisatie

Database-triggers werken de gedeelde kern bij wanneer:

- een gepubliceerd Ampara/Aegis-dossier, inhoudsblok of status verandert;
- een Meridian-onderzoek, onderzoeksmetadata, sectie of gekoppeld artikel verandert.

De trigger synchroniseert de gedeelde identiteit en de presentatie van het platform dat de wijziging deed. De presentatie van het andere platform wordt niet overschreven.

## Politieke grens

De gedeelde kern bevat geen partijstandpunt. Ampara voegt waarden, voorstellen, besluiten en uitvoering toe in zijn eigen presentatie. Meridian kan hetzelfde dossier zelfstandig onderzoeken en een Ampara-keuze ook tegenspreken.
