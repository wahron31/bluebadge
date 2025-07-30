# 🚔 BlueBadge - Belgische Politie Selectie Training

Een persoonlijke trainingswebsite voor voorbereiding op Belgische politie-examens en gesprekken.

## 🎯 Doel

Deze website helpt je bij het voorbereiden op:
- **Cognitieve vaardigheden** (logica, rekenen, patroonherkenning)
- **Taalvaardigheden** (Nederlandse woordenschat en grammatica)
- **Situationele beoordeling** (politie scenario's)
- **Gesprekstraining** (interview voorbereiding)

## 🌟 Functies

### Dashboard
- **Dagelijkse uitdagingen** in verschillende categorieën
- **Voortgang tracking** met statistieken
- **Woord van de dag** met politie-gerelateerde woordenschat
- **Recente activiteiten** overzicht

### Quiz Systemen
- **25+ vragen** per categorie
- **Directe feedback** met uitleg
- **Automatische scoring** en voortgang bijhouden
- **Verschillende moeilijkheidsgraden**

### Trainingsmodules
1. **Cognitieve Vaardigheden**
   - Logisch denken
   - Rekenen en percentages
   - Patroonherkenning
   - Ruimtelijk inzicht
   - Concentratie en geheugen

2. **Taalvaardigheden**
   - 30+ politie-gerelateerde woorden
   - Grammatica oefeningen
   - Woordenschat uitbreiding
   - Verschillende niveaus (basis → expert)

3. **Situationele Scenario's**
   - Praktijkgerichte politiesituaties
   - Besluitvorming training
   - Ethische dilemma's

## 🚀 Website Starten

### Methode 1: Python Server (Aanbevolen)
```bash
# In de projectmap:
python3 -m http.server 8000

# Open in browser:
http://localhost:8000
```

### Methode 2: Direct openen
- Open `index.html` direct in je browser
- Let op: Sommige functies werken beter via een server

## 📁 Projectstructuur

```
BlueBadge/
├── index.html              # Hoofdpagina/Dashboard
├── quiz.html              # Quiz interface
├── style.css              # Alle styling
├── app.js                 # JavaScript functionaliteit
├── data/                  # JSON databestanden
│   ├── quiz_questions.json # 25+ quiz vragen
│   ├── woorden.json       # 30+ Nederlandse woorden
│   └── cognitief.json     # 20+ cognitieve testen
└── README.md             # Deze documentatie
```

## 📊 Vragen Database

### Quiz Vragen (25+)
- **Taal**: Nederlandse woordenschat, grammatica
- **Cognitief**: Rekenen, logica, patronen
- **Situationeel**: Politie scenario's, besluitvorming

### Cognitieve Testen (20+)
- **Logisch denken**: Syllogismen, redeneringen
- **Rekenen**: Percentages, vergelijkingen, tijd/afstand
- **Patroonherkenning**: Nummer- en vormsequenties
- **Ruimtelijk inzicht**: 3D-objecten, richtingen
- **Concentratie**: Lettertellingen, details onthouden

### Woordenschat (30+)
Politie-specifieke termen met:
- **Nederlandse betekenis**
- **Praktische voorbeelden**
- **Moeilijkheidsgraden**
- **Woordsoorten**

## 🔄 Dagelijkse Updates

### Nieuwe Vragen Toevoegen

**Quiz vragen** (`data/quiz_questions.json`):
```json
{
  "vraag": "Jouw nieuwe vraag hier",
  "opties": ["Optie A", "Optie B", "Optie C", "Optie D"],
  "antwoord": 0,
  "categorie": "taal|cognitief|situationeel",
  "uitleg": "Waarom dit het juiste antwoord is"
}
```

**Nieuwe woorden** (`data/woorden.json`):
```json
{
  "woord": "Nieuw politiewoord",
  "betekenis": "Wat het betekent",
  "voorbeeld": "Voorbeeld in een zin",
  "type": "zelfstandig naamwoord|bijwoord|etc",
  "niveau": "basis|gevorderd|expert"
}
```

**Cognitieve tests** (`data/cognitief.json`):
```json
{
  "type": "logisch_denken|rekenen|patroon_herkenning|etc",
  "vraag": "De test vraag",
  "opties": ["A", "B", "C", "D"],
  "antwoord": 1,
  "uitleg": "Uitleg van oplossing",
  "niveau": "basis|gevorderd|expert"
}
```

## 📈 Voortgang Tracking

De website slaat automatisch op:
- **Aantal beantwoorde vragen**
- **Gemiddelde scores**
- **Dagelijkse streak**
- **Voortgang per module**
- **Recente activiteiten**

Data wordt lokaal opgeslagen in je browser.

## 🎨 Aanpassingen

### Kleuren wijzigen
Bewerk `style.css` voor andere kleuren:
```css
/* Hoofdkleuren aanpassen */
:root {
  --primary-color: #3498db;
  --secondary-color: #2c3e50;
  --success-color: #27ae60;
  --warning-color: #f39c12;
}
```

### Nieuwe pagina's toevoegen
1. Maak nieuwe HTML pagina
2. Voeg link toe in navigatie (`index.html`)
3. Gebruik bestaande CSS classes voor consistente styling

## 🔒 Privacy & Veiligheid

- **Volledig lokaal**: Geen internetverbinding nodig
- **Geen data uploads**: Alle informatie blijft op jouw computer
- **Browser storage**: Gebruikt localStorage voor voortgang
- **Geen tracking**: Geen externe scripts of analytics

## 🛠️ Technische Details

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **No dependencies**: Geen externe bibliotheken
- **Responsive**: Werkt op desktop, tablet en mobiel
- **Modern browsers**: Chrome, Firefox, Safari, Edge

## 📝 Tips voor Gebruik

### Dagelijkse Routine
1. **Start met dashboard** - bekijk je voortgang
2. **Doe dagelijkse uitdaging** - 3 verschillende tests
3. **Leer woord van de dag** - uitbreiding woordenschat
4. **Focus op zwakke punten** - gebruik voortgangsbalken
5. **Herhaal moeilijke vragen** - herlees uitleg

### Effectief Studeren
- **Regelmatigheid**: Beter 15 min/dag dan 2 uur/week
- **Variatie**: Wissel tussen categorieën
- **Feedback**: Lees altijd de uitleg bij foute antwoorden
- **Notities**: Schrijf moeilijke woorden/concepten op
- **Oefening**: Herhaal tests tot je 80%+ scoort

## 🚀 Toekomstige Uitbreidingen

Mogelijke toevoegingen:
- **Frans taalmodule** voor tweetalige regio's
- **Tijdslimiet tests** voor examenstress
- **Moeilijkheidsgraden** instelbaar
- **Export functie** voor voortgang
- **Meer scenario types** (verkeer, geweld, etc.)

## 💪 Veel Succes!

Deze website is gebouwd om jou optimaal voor te bereiden op de Belgische politie-examens. Gebruik het dagelijks, blijf oefenen en veel succes met je voorbereiding!

**Dagelijkse tip**: Consistentie is belangrijker dan perfectie. Doe elke dag iets, ook al is het maar 10 minuten.

---

*Laatste update: Januari 2025*