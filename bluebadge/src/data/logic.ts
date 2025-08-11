export type LogicItem = {
  id: string
  type: 'number-sequence' | 'pattern'
  prompt: string
  choices: string[]
  correctIndex: number
  explanation?: string
}

export const LOGIC_ITEMS: LogicItem[] = [
  {
    id: 'lg1',
    type: 'number-sequence',
    prompt: '1, 2, 4, 7, 11, … Wat is het volgende getal?',
    choices: ['16', '17', '18'],
    correctIndex: 1,
    explanation: '+1, +2, +3, +4, +5 → volgende +6: 11 + 6 = 17',
  },
  {
    id: 'lg2',
    type: 'number-sequence',
    prompt: '3, 6, 12, 24, … Wat is het volgende?',
    choices: ['36', '48', '30'],
    correctIndex: 1,
    explanation: 'x2 telkens: 24 x 2 = 48',
  },
  {
    id: 'lg3',
    type: 'pattern',
    prompt: 'AB, BC, CD, DE, … Volgende?',
    choices: ['DF', 'EF', 'FG'],
    correctIndex: 1,
    explanation: 'Elke stap schuift 1 letter op: EF',
  },
  {
    id: 'lg4',
    type: 'number-sequence',
    prompt: '2, 3, 5, 8, 12, … Volgende?',
    choices: ['17', '18', '19'],
    correctIndex: 0,
    explanation: '+1, +2, +3, +4 → volgende +5: 12 + 5 = 17',
  },
  {
    id: 'lg5',
    type: 'pattern',
    prompt: 'Ma, Di, Wo, Do, … Volgende?',
    choices: ['Vr', 'Za', 'Zo'],
    correctIndex: 0,
    explanation: 'Dagen van de week: maandag → dinsdag → woensdag → donderdag → vrijdag',
  },
  {
    id: 'lg6',
    type: 'number-sequence',
    prompt: '5, 10, 20, 35, 55, … Volgende?',
    choices: ['70', '80', '90'],
    correctIndex: 1,
    explanation: '+5, +10, +15, +20 → volgende +25: 55 + 25 = 80',
  },
  {
    id: 'lg7',
    type: 'pattern',
    prompt: '▲, ▲▲, ▲▲▲, … Volgende?',
    choices: ['▲▲▲▲', '▲▲', '▲▲▲▲▲'],
    correctIndex: 0,
    explanation: 'Elke stap +1 driehoek',
  },
  {
    id: 'lg8',
    type: 'number-sequence',
    prompt: '1, 4, 9, 16, … Volgende?',
    choices: ['20', '25', '27'],
    correctIndex: 1,
    explanation: 'Kwadraten: 1², 2², 3², 4² → 5² = 25',
  },
  {
    id: 'lg9',
    type: 'pattern',
    prompt: 'N, E, S, W, N, E, … Volgende?',
    choices: ['S', 'W', 'N'],
    correctIndex: 0,
    explanation: 'Windrichtingen in volgorde: N → E → S → W → N → E → S',
  },
  {
    id: 'lg10',
    type: 'number-sequence',
    prompt: '2, 4, 8, 16, 32, … Volgende?',
    choices: ['48', '56', '64'],
    correctIndex: 2,
    explanation: 'Verdubbelen: 32 × 2 = 64',
  },
]