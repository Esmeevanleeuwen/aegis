# Lokale bronbestanden

Plaats de originele dossiers alleen lokaal in deze map. PDF-, Word- en tekstbestanden
worden door `.gitignore` uitgesloten en komen daardoor niet per ongeluk in de publieke
repository terecht.

Voorbeeld:

```bash
npm run content:import -- \
  --system-pdf "imports/Overkoepelend dossier systeeminrichting.pdf" \
  --public-data-pdf "imports/Datum publiek.pdf"
```

Gebruik eerst `--dry-run` om te controleren hoeveel pagina's en kennisobjecten worden
gevonden. De importeur zet nieuw bronmateriaal standaard op `internal` en `review`.
