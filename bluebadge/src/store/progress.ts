import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ModuleKey = 'woorden' | 'quiz' | 'scenarios'

export type ScenarioAnswer = {
  scenarioId: string
  text: string
  timestamp: number
}

type ModuleProgress = {
  attempted: number
  correct: number
}

type State = {
  modules: Record<ModuleKey, ModuleProgress>
  lastPracticedISO?: string
  streakDays: number
  scenarioAnswers: ScenarioAnswer[]
  recordAttempt: (module: ModuleKey, correct: boolean) => void
  saveScenarioAnswer: (scenarioId: string, text: string) => void
  exportData: () => string
  importData: (json: string) => void
  resetAll: () => void
}

const initialModule: ModuleProgress = { attempted: 0, correct: 0 }

const initialState = {
  modules: {
    woorden: { ...initialModule },
    quiz: { ...initialModule },
    scenarios: { ...initialModule },
  },
  lastPracticedISO: undefined as string | undefined,
  streakDays: 0,
  scenarioAnswers: [] as ScenarioAnswer[],
}

export const useProgressStore = create<State>()(
  persist(
    (set, get) => ({
      ...initialState,
      recordAttempt: (module, correct) => {
        const today = new Date()
        const todayISO = today.toISOString().slice(0, 10)
        const { lastPracticedISO, streakDays } = get()

        let nextStreak = streakDays
        if (!lastPracticedISO) nextStreak = 1
        else if (lastPracticedISO !== todayISO) {
          const last = new Date(lastPracticedISO)
          const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))
          nextStreak = diffDays === 1 ? streakDays + 1 : 1
        }

        set((state) => {
          const prev = state.modules[module]
          const attempted = prev.attempted + 1
          const correctCount = prev.correct + (correct ? 1 : 0)
          return {
            modules: { ...state.modules, [module]: { attempted, correct: correctCount } },
            lastPracticedISO: todayISO,
            streakDays: nextStreak,
          }
        })
      },
      saveScenarioAnswer: (scenarioId, text) => {
        const answer = { scenarioId, text, timestamp: Date.now() }
        set((state) => ({ scenarioAnswers: [answer, ...state.scenarioAnswers] }))
      },
      exportData: () => {
        const { modules, lastPracticedISO, streakDays, scenarioAnswers } = get()
        return JSON.stringify({ modules, lastPracticedISO, streakDays, scenarioAnswers }, null, 2)
      },
      importData: (json: string) => {
        try {
          const parsed = JSON.parse(json)
          const { modules, lastPracticedISO, streakDays, scenarioAnswers } = parsed
          set({
            modules: modules ?? initialState.modules,
            lastPracticedISO: lastPracticedISO ?? initialState.lastPracticedISO,
            streakDays: typeof streakDays === 'number' ? streakDays : initialState.streakDays,
            scenarioAnswers: Array.isArray(scenarioAnswers) ? scenarioAnswers : initialState.scenarioAnswers,
          })
        } catch (_e) {
          // Ongeldige import negeren
        }
      },
      resetAll: () => set({ ...initialState }),
    }),
    { name: 'bluebadge-progress' },
  ),
)