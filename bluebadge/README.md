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
- Luisteren (audio + vraag)
- Logica (reeksen/patronen)

## Bestanden en data

- Audio: plaats bestanden in `public/audio/` en verwijs via `/audio/naam.mp3`
- Data: `src/data/*`
- Stores: `src/store/*`
- Routes: `src/routes/*`
- Componenten: `src/components/*`

## PWA/Offline

- PWA geconfigureerd met auto-update; werkt offline voor gebundelde assets.
