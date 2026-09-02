# Aegis

Publieke website voor Aegis: een democratisch-socialistische partij die gedeelde
kennis vertaalt naar politieke keuzes, besluiten en controleerbare uitvoering.

## Wat nu is gebouwd

- een Next.js 16-website met dynamische dossierroutes;
- een Supabase-kennisgraaf met dossiers, hoofdstukken, claims, bronnen,
  gebeurtenissen, actoren, metingen, regels, voorstellen en relaties;
- beveiliging met Row Level Security op iedere publieke tabel;
- een PDF-importeur die alle pagina's bewaart zonder ze automatisch te publiceren;
- hergebruik van dezelfde dossierdata op de homepage, dossierindex en detailpagina;
- een redactionele scheiding tussen feiten, onzekerheid en politieke keuzes.

## Lokaal starten

```bash
npm install
npm run dev
```

Open daarna [http://localhost:3000](http://localhost:3000).

Zonder Supabase-variabelen gebruikt de website de meegeleverde, gecontroleerde
voorbeeldinhoud. Daardoor blijft ontwikkeling en deployment altijd mogelijk.

## Supabase aansluiten

1. Maak of kies een afzonderlijk Supabase-project voor Aegis.
2. Kopieer `.env.example` naar `.env.local` en vul de project-URL en publishable key in.
3. Voer de migratie in `supabase/migrations` uit.
4. Voer `supabase/seed.sql` uit voor het eerste publieke dossier.
5. Controleer daarna de security- en performance-advisors van Supabase.

Gebruik voor de website alleen de publishable key. De secret key is uitsluitend voor
de lokale importeur en mag nooit in browsercode of GitHub terechtkomen.

## Alle dossierpagina's importeren

Bewaar de PDF's lokaal in `imports/`; deze map sluit bronbestanden automatisch uit van
Git. Controleer eerst de import:

```bash
npm run content:verify -- \
  --system-pdf "imports/Overkoepelend dossier systeeminrichting.pdf" \
  --public-data-pdf "imports/Datum publiek.pdf"
```

Importeer daarna naar Supabase:

```bash
npm run content:import -- \
  --system-pdf "imports/Overkoepelend dossier systeeminrichting.pdf" \
  --public-data-pdf "imports/Datum publiek.pdf"
```

De importeur bewaart iedere pagina met paginanummer en SHA-256-controlewaarde.
Nieuwe bronpagina's en het register *Datum publiek* blijven standaard intern. Voeg
`--publish-system` alleen toe nadat de systeemhoofdstukken redactioneel zijn beoordeeld.

## Publicatieworkflow

1. **Importeren** — bronpagina's zijn intern en onbewerkt.
2. **Structureren** — redactie maakt claims, gebeurtenissen, metingen en regels.
3. **Onderbouwen** — iedere claim krijgt één of meer bronnen en een bewijsstatus.
4. **Controleren** — data, juridische status, onzekerheid en persoonsgegevens worden nagekeken.
5. **Publiceren** — alleen objecten met `status = published` en `visibility = public`
   zijn via de website leesbaar.
6. **Doorverwijzen** — relaties verbinden dezelfde kennis automatisch aan Meridian,
   Phosphoros, Aegora, AVERA, Civiora en Ampara.

Bij *Datum publiek* blijven gebeurtenisdatum, publicatiedatum, procesdatum en juridische
status afzonderlijk. Een vermelding wordt nooit automatisch als schuldvaststelling getoond.

## Pagina's

- Homepage en publieke grondslag
- Dossiers en dossierdetail
- Standpunten
- Voorstellen en besluiten
- Uitvoeringsmonitor
- Lokale groepen
- Kennisnetwerk
- Over Aegis

## Belangrijkste mappen

```text
app/dossiers/[slug]/       dynamische publieke dossierpagina
lib/queries/               centrale databasevragen met lokale terugval
lib/supabase/              veilige publieke Supabase-client
scripts/                   lokale, herhaalbare PDF-import
supabase/migrations/       versiebeheer van het datamodel en RLS
supabase/seed.sql          gecontroleerde publieke startinhoud
imports/                   lokale bronbestanden; niet naar GitHub
```
