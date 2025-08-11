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
    audioUrl: '/audio/verkeerscontrole.mp3',
    transcript: 'Goedemiddag, dit is een routinecontrole. Mag ik uw rijbewijs en verzekeringspapieren alstublieft?',
    questions: [
      {
        prompt: 'Wat vraagt de agent?',
        choices: ['Rijbewijs en verzekering', 'Identiteitskaart en boete', 'Adres en telefoonnummer'],
        correctIndex: 0,
      },
    ],
  },
]