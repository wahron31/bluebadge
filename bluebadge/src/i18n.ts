import type { Language } from './store/ui'

type Dict = Record<string, { nl: string; tr: string }>

const dict: Dict = {
  nav_home: { nl: 'Home', tr: 'Ana sayfa' },
  nav_words: { nl: 'Woordenschat', tr: 'Kelime' },
  nav_quiz: { nl: 'Quiz', tr: 'Quiz' },
  nav_scenarios: { nl: "Scenario's", tr: 'Senaryolar' },
  nav_progress: { nl: 'Voortgang', tr: 'İlerleme' },
  brand: { nl: 'BlueBadge', tr: 'BlueBadge' },
  daily_word: { nl: 'Dagelijks woord', tr: 'Günün kelimesi' },
  daily_goal: { nl: 'Dagelijks doel', tr: 'Günlük hedef' },
  start_words: { nl: 'Start Woordenschat', tr: 'Kelime çalış' },
  start_quiz: { nl: 'Start Quiz', tr: 'Quize başla' },
  start_scenarios: { nl: "Start Scenario's", tr: 'Senaryolara başla' },
  view_progress: { nl: 'Bekijk Voortgang', tr: 'İlerlemeyi gör' },
}

export function t(key: keyof typeof dict, lang: Language): string {
  return dict[key][lang]
}