export type ListeningItem = {
  id: string
  title: string
  audioUrl: string
  transcript: string
  questions: { prompt: string; choices: string[]; correctIndex: number }[]
}

export const LISTENING_ITEMS: ListeningItem[] = [
  {
    id: 'l1',
    title: 'Verkeerscontrole',
    audioUrl: '/audio/verkeerscontrole.wav',
    transcript:
      'Goedemiddag, dit is een routinecontrole. Mag ik uw rijbewijs en verzekeringspapieren alstublieft?',
    questions: [
      {
        prompt: 'Wat vraagt de agent?',
        choices: ['Rijbewijs en verzekering', 'Identiteitskaart en boete', 'Adres en telefoonnummer'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'l2',
    title: 'Melding fietsdiefstal',
    audioUrl: '/audio/fietsdiefstal.wav',
    transcript:
      'We kregen een melding van een mogelijke fietsdiefstal ter hoogte van het station. Kunt u beschrijven wat u zag?',
    questions: [
      {
        prompt: 'Waar vond de melding plaats?',
        choices: ['Aan het station', 'In het park', 'Op de snelweg'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'l3',
    title: 'Geluidsoverlast',
    audioUrl: '/audio/geluidsoverlast.wav',
    transcript:
      'Goedenavond, we komen kijken naar aanleiding van geluidsoverlast. Zou u de muziek kunnen verminderen?',
    questions: [
      {
        prompt: 'Wat is het verzoek van de agent?',
        choices: ['De muziek zachter zetten', 'De woning verlaten', 'Identiteitskaart tonen'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'l4',
    title: 'Verkeersongeval zonder gewonden',
    audioUrl: '/audio/ongeval_zonder_gewonden.wav',
    transcript:
      'Kunt u uw voertuigen aan de kant zetten en het Europees aanrijdingsformulier invullen? Wij noteren de vaststellingen.',
    questions: [
      {
        prompt: 'Wat vraagt de agent om te doen?',
        choices: ['Voertuigen aan de kant en formulier invullen', 'Direct naar het commissariaat gaan', 'Rijbewijs afgeven'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'l5',
    title: 'Identiteitscontrole',
    audioUrl: '/audio/identiteitscontrole.wav',
    transcript:
      'Mag ik uw identiteitskaart even zien? Het is een routinecontrole. Alvast bedankt voor uw medewerking.',
    questions: [
      {
        prompt: 'Wat wordt er gevraagd?',
        choices: ['Identiteitskaart tonen', 'Boete betalen', 'Telefoon afgeven'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'l6',
    title: 'Verdachte situatie in winkel',
    audioUrl: '/audio/winkel_situatie.wav',
    transcript:
      'De winkelier meldde dat iemand spullen in een tas stopte zonder te betalen. Kunt u uw tas openen voor controle?',
    questions: [
      {
        prompt: 'Wat is de aanleiding voor de controle?',
        choices: ['Melding van winkeldiefstal', 'Ruzie aan de kassa', 'Brandalarm'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'l7',
    title: 'Snelheidscontrole',
    audioUrl: '/audio/snelheidscontrole.wav',
    transcript:
      'U reed 68 km/u waar 50 is toegestaan. Dit wordt geregistreerd. Heeft u bezwaar of wilt u de meting inkijken?',
    questions: [
      {
        prompt: 'Wat is de toegestane snelheid volgens het fragment?',
        choices: ['50 km/u', '60 km/u', '70 km/u'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'l8',
    title: 'Huiselijk conflict',
    audioUrl: '/audio/huiselijk_conflict.wav',
    transcript:
      'We zijn hier om te zorgen dat iedereen veilig is. Kunt u apart vertellen wat er gebeurd is?',
    questions: [
      {
        prompt: 'Wat is het doel van de agenten?',
        choices: ['Veiligheid garanderen', 'Arrestatie uitvoeren', 'Buren beboeten'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'l9',
    title: 'Getuigenverklaring',
    audioUrl: '/audio/getuigenverklaring.wav',
    transcript:
      'Kunt u rustig beschrijven wat u gezien heeft, met tijdstip en beschrijving van de persoon?',
    questions: [
      {
        prompt: 'Wat vraagt de agent specifiek?',
        choices: ['Tijdstip en persoonsbeschrijving', 'Voertuigpapieren', 'Bankgegevens'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'l10',
    title: 'Openbaar vervoer incident',
    audioUrl: '/audio/openbaar_vervoer.wav',
    transcript:
      'We hebben een melding gekregen van agressief gedrag op tram 7. Is iedereen in orde? Heeft iemand medische hulp nodig?',
    questions: [
      {
        prompt: 'Wat wordt eerst gecheckt?',
        choices: ['Of iedereen in orde is', 'Of de tram vertraagd is', 'Of er tickets zijn gecontroleerd'],
        correctIndex: 0,
      },
    ],
  },
]