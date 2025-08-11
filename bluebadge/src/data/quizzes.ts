export type QuizCategory = 'taal' | 'logica' | 'algemeen' | 'situatie'

export type QuizQuestion = {
  id: string
  category: QuizCategory
  prompt: string
  choices: string[]
  correctIndex: number
  explanation?: string
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'taal',
    prompt: 'Kies de correcte spelling:',
    choices: ['politieagent', 'politie agent', 'politie-agent'],
    correctIndex: 0,
    explanation: 'Samenstelling: politieagent is één woord.',
  },
  {
    id: 'q2',
    category: 'logica',
    prompt: 'Alle agenten dragen een uniform. Samira draagt een uniform. Wat volgt logisch?',
    choices: ['Samira is zeker een agent', 'Samira is mogelijk een agent', 'Samira is geen agent'],
    correctIndex: 1,
    explanation: 'Omgekeerde gevolgtrekking is niet geldig: het kan, maar hoeft niet.',
  },
  {
    id: 'q3',
    category: 'algemeen',
    prompt: 'Wat is de hoofdstad van België?',
    choices: ['Antwerpen', 'Brussel', 'Gent'],
    correctIndex: 1,
  },
  {
    id: 'q4',
    category: 'situatie',
    prompt: 'Tijdens een verkeerscontrole ruik je alcohol bij de bestuurder. Wat is je eerste stap?',
    choices: [
      'Bestuurder meteen aanhouden',
      'Een ademtest uitvoeren volgens procedure',
      'Auto laten staan en laten wegrijden',
    ],
    correctIndex: 1,
    explanation: 'Volg de wettelijke procedure: ademtest is aangewezen als eerste stap.',
  },
]