# Lokale bronbestanden

Plaats de originele dossiers alleen lokaal in deze map. PDF-, Word- en tekstbestanden
worden door `.gitignore` uitgesloten en komen daardoor niet per ongeluk in de publieke
repository terecht.

Voorbeeld:

```bash
npm run content:import -- \
  --system-pdf "imports/Overkoepelend dossier systeeminrichting.pdf" \
  --public-data-pdf "imports/Datum publiek.pdf" \
  --crime-system-pdf "imports/Criminaliteit als systeem.pdf" \
  --wwii-system-pdf "imports/De Tweede Wereldoorlog als systeem.pdf" \
  --gelderland-network-pdf "imports/De organisatorische netwerklaag van Gelderland informatie.pdf"
```

Gebruik eerst `--dry-run` om te controleren hoeveel pagina's en kennisobjecten worden
gevonden. De importeur zet nieuw bronmateriaal standaard op `internal` en `review`.
Gebruik `--publish-all` om de vijf dossiers na controle gezamenlijk publiek te maken.
