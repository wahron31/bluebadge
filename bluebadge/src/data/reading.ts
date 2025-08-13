export type ReadingItem = {
  id: string
  title: string
  body: string
  questions: { prompt: string; choices: string[]; correctIndex: number; explanation?: string }[]
}

export const READING_ITEMS: ReadingItem[] = [
  {
    id: 'r1',
    title: 'Fietslichtcontrole',
    body:
      'Tijdens de winter voert de politie extra controles uit op fietsverlichting. Fietsers zonder verlichting riskeren een boete. De actie heeft als doel de zichtbaarheid en verkeersveiligheid te verhogen.',
    questions: [
      {
        prompt: 'Wat is het doel van de actie?',
        choices: ['Boetes innen', 'Zichtbaarheid en veiligheid verhogen', 'Fietsers ontmoedigen'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'r2',
    title: 'Buurtinformatienetwerk',
    body:
      'Het Buurtinformatienetwerk (BIN) is een samenwerking tussen burgers en politie. Via het netwerk kunnen verdachte situaties sneller gemeld en gedeeld worden.',
    questions: [
      {
        prompt: 'Wat beschrijft het BIN het best?',
        choices: ['Een socialemedia-platform', 'Samenwerking voor snelle meldingen', 'Een alarmsysteem voor huizen'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'r3',
    title: 'Snelheidsactie schoolomgeving',
    body:
      'In de nabijheid van scholen wordt de snelheid extra gecontroleerd. Het doel is kwetsbare weggebruikers, zoals kinderen, te beschermen tijdens begin en einde van de schooldag.',
    questions: [
      {
        prompt: 'Wanneer is de controle vooral actief?',
        choices: ['Tijdens de nacht', 'Rond begin en einde schooldag', 'Alleen in weekends'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'r4',
    title: 'Diefstalpreventieadvies',
    body:
      'De wijkinspecteur geeft gratis advies aan bewoners om hun woning beter te beveiligen. Denk aan verlichting met sensoren, stevige sloten en sociale waakzaamheid.',
    questions: [
      {
        prompt: 'Wat is GEEN onderdeel van het advies?',
        choices: ['Verlichting met sensoren', 'Stevige sloten', 'Onbekenden binnenlaten voor inspectie'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'r5',
    title: 'Overlast in het park',
    body:
      'Er komen meldingen binnen over nachtlawaai in het stadspark. De politie zal extra patrouilles doen en bewoners vragen om storingen tijdig te melden.',
    questions: [
      {
        prompt: 'Wat is de gevraagde actie van bewoners?',
        choices: ['Zelf de jongeren aanspreken', 'Storingen melden', 'Niet meer naar het park gaan'],
        correctIndex: 1,
      },
    ],
  },
]