# BlueBadge

Interactieve educatieve webapp voor cognitieve en taalvaardigheden (NL/TR) voor Belgische politie-kandidaten.

## Ontwikkelen

- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

## Functionaliteit

- Woordenschat (NL/TR) met flashcards en TTS
- Quiz (taal, logica, algemeen, situatie)
- Scenario-oefeningen (open antwoorden)
- Voortgang (streak, statistieken, export/import/reset, dagdoel)
- Luisteren (audio + vraag) — gebruikt `.wav` bestanden
- Logica (reeksen/patronen)

## Bestanden en data

- Audio: plaats `.wav` bestanden in `public/audio/` en verwijs via `/audio/naam.wav`
- Dummy-audio genereren: `npm run gen:audio` (maakt 10 korte `.wav` tonen)
- Data: `src/data/*`
- Stores: `src/store/*`
- Routes: `src/routes/*`
- Componenten: `src/components/*`

## PWA/Offline

- PWA geconfigureerd met auto-update; werkt offline voor gebundelde assets.
