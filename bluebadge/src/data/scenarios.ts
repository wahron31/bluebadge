export type ScenarioItem = {
  id: string
  title: string
  prompt: string
  guidelines: string[]
}

export const SCENARIOS: ScenarioItem[] = [
  {
    id: 's1',
    title: 'Herrie op straat',
    prompt:
      'Je krijgt een melding van geluidsoverlast om 02:00. Je treft een groep jongeren met luide muziek. Wat doe je? Schrijf je aanpak in 4-6 zinnen.',
    guidelines: [
      'Veiligheid en inschatting van de situatie',
      'Communicatie en de-escalatie',
      'Verwijzing naar wetgeving / lokale verordening',
      'Registratie en opvolging',
    ],
  },
  {
    id: 's2',
    title: 'Fietsdiefstal heterdaad',
    prompt:
      'Je ziet iemand die een slot aan het doorknippen is. Beschrijf je handelen stap voor stap.',
    guidelines: [
      'Eigen veiligheid en situational awareness',
      'Aanspreken en bevelen',
      'Ingrijpen volgens geweldsbeheersing',
      'Identificatie en vaststellingen',
    ],
  },
  {
    id: 's3',
    title: 'Huiselijk conflict',
    prompt:
      'Buren melden geschreeuw in een appartement. Je staat voor de deur. Beschrijf je werkwijze en communicatie.',
    guidelines: [
      'Veiligheidspositie en partnerrol',
      'Communicatie: kalmeren en scheiden van partijen',
      'Screening op letsels en nood aan medische hulp',
      'Registratie, PV en doorverwijzing',
    ],
  },
]
