import type { WordItem } from './words'
import { WORDS } from './words'
import type { QuizQuestion } from './quizzes'
import { QUIZ_QUESTIONS } from './quizzes'
import type { ScenarioItem } from './scenarios'
import { SCENARIOS } from './scenarios'
import type { ReadingItem } from './reading'
import { READING_ITEMS } from './reading'
import type { ListeningItem } from './listening'
import { LISTENING_ITEMS } from './listening'
import type { GrammarItem } from './grammar'
import { GRAMMAR_ITEMS } from './grammar'

export type CognitiveKind = 'numeric' | 'verbal' | 'abstract'
export type CognitiveItem = {
  id: string
  type: CognitiveKind
  prompt: string
  choices: string[]
  correctIndex: number
  explanation?: string
}

const KEYS = {
  words: 'bluebadge-words',
  quizzes: 'bluebadge-quizzes',
  scenarios: 'bluebadge-scenarios',
  reading: 'bluebadge-reading',
  listening: 'bluebadge-listening',
  grammar: 'bluebadge-grammar',
  cognitive: 'bluebadge-cognitive',
} as const

export function getWords(): WordItem[] {
  try {
    const raw = localStorage.getItem(KEYS.words)
    if (!raw) return WORDS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as WordItem[]
  } catch (_) {}
  return WORDS
}

export function getQuizzes(): QuizQuestion[] {
  try {
    const raw = localStorage.getItem(KEYS.quizzes)
    if (!raw) return QUIZ_QUESTIONS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as QuizQuestion[]
  } catch (_) {}
  return QUIZ_QUESTIONS
}

export function getScenarios(): ScenarioItem[] {
  try {
    const raw = localStorage.getItem(KEYS.scenarios)
    if (!raw) return SCENARIOS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as ScenarioItem[]
  } catch (_) {}
  return SCENARIOS
}

export function getReading(): ReadingItem[] {
  try {
    const raw = localStorage.getItem(KEYS.reading)
    if (!raw) return READING_ITEMS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as ReadingItem[]
  } catch (_) {}
  return READING_ITEMS
}

export function getListening(): ListeningItem[] {
  try {
    const raw = localStorage.getItem(KEYS.listening)
    if (!raw) return LISTENING_ITEMS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as ListeningItem[]
  } catch (_) {}
  return LISTENING_ITEMS
}

export function getGrammar(): GrammarItem[] {
  try {
    const raw = localStorage.getItem(KEYS.grammar)
    if (!raw) return GRAMMAR_ITEMS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as GrammarItem[]
  } catch (_) {}
  return GRAMMAR_ITEMS
}

export function getCognitive(kind?: CognitiveKind): CognitiveItem[] {
  try {
    const raw = localStorage.getItem(KEYS.cognitive)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      const items = parsed as CognitiveItem[]
      return kind ? items.filter(i => i.type === kind) : items
    }
  } catch (_) {}
  return []
}

export function setWords(items: WordItem[]) { localStorage.setItem(KEYS.words, JSON.stringify(items)) }
export function setQuizzes(items: QuizQuestion[]) { localStorage.setItem(KEYS.quizzes, JSON.stringify(items)) }
export function setScenarios(items: ScenarioItem[]) { localStorage.setItem(KEYS.scenarios, JSON.stringify(items)) }
export function setReading(items: ReadingItem[]) { localStorage.setItem(KEYS.reading, JSON.stringify(items)) }
export function setListening(items: ListeningItem[]) { localStorage.setItem(KEYS.listening, JSON.stringify(items)) }
export function setGrammar(items: GrammarItem[]) { localStorage.setItem(KEYS.grammar, JSON.stringify(items)) }
export function setCognitive(items: CognitiveItem[]) { localStorage.setItem(KEYS.cognitive, JSON.stringify(items)) }

export function clearOverrides(kind: keyof typeof KEYS) {
  localStorage.removeItem(KEYS[kind])
}