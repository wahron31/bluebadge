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
]