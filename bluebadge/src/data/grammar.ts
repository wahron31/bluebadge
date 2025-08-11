export type GrammarItem = {
  id: string
  lang: 'nl' | 'tr'
  prompt: string
  sentence: string
  choices: string[]
  correctIndex: number
  explanation?: string
}

export const GRAMMAR_ITEMS: GrammarItem[] = [
  {
    id: 'g1',
    lang: 'nl',
    prompt: 'Kies de correcte spelling:',
    sentence: 'De ___ werkt bij de politie.',
    choices: ['agent', 'agend', 'agendte'],
    correctIndex: 0,
    explanation: '“Agent” is correct gespeld.',
  },
  {
    id: 'g2',
    lang: 'nl',
    prompt: 'Kies de correcte vorm:',
    sentence: 'Zij ___ gisteren het PV op.',
    choices: ['maakt', 'maakte', 'maakten'],
    correctIndex: 1,
    explanation: 'Verleden tijd: “maakte”.',
  },
  {
    id: 'g3',
    lang: 'nl',
    prompt: 'Welke zin is correct?',
    sentence: '—',
    choices: [
      'Ik heb de verdachte gezien die je zocht.',
      'Ik heb de verdachte, die je zocht gezien.',
      'Ik heb de verdachte welke je zocht gezien.',
    ],
    correctIndex: 0,
  },
  {
    id: 'g4',
    lang: 'tr',
    prompt: 'Doğru yazımı seçiniz:',
    sentence: 'Polis ___ kimliği istedi.',
    choices: ['görevli', 'görevlisi', 'görevliye'],
    correctIndex: 0,
    explanation: 'Cümle yapısına uygun olan “görevli”.',
  },
  {
    id: 'g5',
    lang: 'tr',
    prompt: 'Doğru ek kullanımı:',
    sentence: 'Sürücü ___ alkol testi yapıldı.',
    choices: ['-ye', '-de', '-den'],
    correctIndex: 0,
    explanation: 'Yönelme hâli: sürücüye alkol testi.',
  },
  {
    id: 'g6',
    lang: 'nl',
    prompt: 'Meervoudsvorm kiezen:',
    sentence: 'De ___ werden verhoord.',
    choices: ['getuigen', 'getuiges', 'getuigeren'],
    correctIndex: 0,
  },
  {
    id: 'g7',
    lang: 'nl',
    prompt: 'Werkwoordvervoeging:',
    sentence: 'De inspecteur ___ dagelijks rapports.',
    choices: ['schrijft', 'schrijfen', 'schreef'],
    correctIndex: 0,
  },
  {
    id: 'g8',
    lang: 'tr',
    prompt: 'Cümlede uygun bağlaç:',
    sentence: 'Şüpheli işbirliği yapmadı, ___ ifade vermeyi reddetti.',
    choices: ['ancak', 'çünkü', 've'],
    correctIndex: 0,
  },
  {
    id: 'g9',
    lang: 'nl',
    prompt: 'Lidwoord kiezen:',
    sentence: '___ PV werd toegevoegd aan het dossier.',
    choices: ['Het', 'De', 'Een'],
    correctIndex: 0,
  },
  {
    id: 'g10',
    lang: 'tr',
    prompt: 'Doğru tamlama:',
    sentence: 'Olay ___ raporu hazırlandı.',
    choices: ['yeri', 'yerinin', 'yere'],
    correctIndex: 1,
  },
]