import type { WordItem } from './words'
import { WORDS } from './words'
import type { QuizQuestion } from './quizzes'
import { QUIZ_QUESTIONS } from './quizzes'
import type { ScenarioItem } from './scenarios'
import { SCENARIOS } from './scenarios'

const KEYS = {
  words: 'bluebadge-words',
  quizzes: 'bluebadge-quizzes',
  scenarios: 'bluebadge-scenarios',
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

export function setWords(items: WordItem[]) {
  localStorage.setItem(KEYS.words, JSON.stringify(items))
}

export function setQuizzes(items: QuizQuestion[]) {
  localStorage.setItem(KEYS.quizzes, JSON.stringify(items))
}

export function setScenarios(items: ScenarioItem[]) {
  localStorage.setItem(KEYS.scenarios, JSON.stringify(items))
}

export function clearOverrides(kind: 'words' | 'quizzes' | 'scenarios') {
  localStorage.removeItem(KEYS[kind])
}