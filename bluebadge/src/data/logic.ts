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
]