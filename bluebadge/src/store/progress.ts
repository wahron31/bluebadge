import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ModuleKey = 'woorden' | 'quiz' | 'scenarios' | 'luisteren' | 'logica' | 'lezen' | 'grammatica' | 'numeriek' | 'verbaal' | 'abstract'

export type ScenarioAnswer = {
  scenarioId: string
  text: string
  timestamp: number
}

export type AttemptLog = {
  ts: number
  module: ModuleKey
  correct: boolean
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
  attemptLog: AttemptLog[]
  todayISO?: string
  todayAttempts: number
  dailyGoal: number
  recordAttempt: (module: ModuleKey, correct: boolean) => void
  saveScenarioAnswer: (scenarioId: string, text: string) => void
  exportData: () => string
  importData: (json: string) => void
  resetAll: () => void
  setDailyGoal: (goal: number) => void
}

const initialModule: ModuleProgress = { attempted: 0, correct: 0 }

const initialState = {
  modules: {
    woorden: { ...initialModule },
    quiz: { ...initialModule },
    scenarios: { ...initialModule },
    luisteren: { ...initialModule },
    logica: { ...initialModule },
    lezen: { ...initialModule },
    grammatica: { ...initialModule },
    numeriek: { ...initialModule },
    verbaal: { ...initialModule },
    abstract: { ...initialModule },
  },
  lastPracticedISO: undefined as string | undefined,
  streakDays: 0,
  scenarioAnswers: [] as ScenarioAnswer[],
  attemptLog: [] as AttemptLog[],
  todayISO: undefined as string | undefined,
  todayAttempts: 0,
  dailyGoal: 20,
}

export const useProgressStore = create<State>()(
  persist(
    (set, get) => ({
      ...initialState,
      recordAttempt: (module, correct) => {
        const now = new Date()
        const todayISO = now.toISOString().slice(0, 10)
        const { lastPracticedISO, streakDays, todayISO: storedToday, todayAttempts } = get()

        let nextStreak = streakDays
        if (!lastPracticedISO) nextStreak = 1
        else if (lastPracticedISO !== todayISO) {
          const last = new Date(lastPracticedISO)
          const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))
          nextStreak = diffDays === 1 ? streakDays + 1 : 1
        }

        const nextTodayAttempts = storedToday === todayISO ? todayAttempts + 1 : 1

        set((state) => {
          const prev = state.modules[module]
          const attempted = prev.attempted + 1
          const correctCount = prev.correct + (correct ? 1 : 0)
          const newLogEntry = { ts: Date.now(), module, correct } as AttemptLog
          return {
            modules: { ...state.modules, [module]: { attempted, correct: correctCount } },
            lastPracticedISO: todayISO,
            streakDays: nextStreak,
            todayISO,
            todayAttempts: nextTodayAttempts,
            attemptLog: [newLogEntry, ...state.attemptLog].slice(0, 5000),
          }
        })
      },
      saveScenarioAnswer: (scenarioId, text) => {
        const answer = { scenarioId, text, timestamp: Date.now() }
        set((state) => ({ scenarioAnswers: [answer, ...state.scenarioAnswers] }))
      },
      exportData: () => {
        const { modules, lastPracticedISO, streakDays, scenarioAnswers, todayISO, todayAttempts, dailyGoal, attemptLog } = get()
        return JSON.stringify({ modules, lastPracticedISO, streakDays, scenarioAnswers, todayISO, todayAttempts, dailyGoal, attemptLog }, null, 2)
      },
      importData: (json: string) => {
        try {
          const parsed = JSON.parse(json)
          const { modules, lastPracticedISO, streakDays, scenarioAnswers, todayISO, todayAttempts, dailyGoal, attemptLog } = parsed
          set({
            modules: modules ?? initialState.modules,
            lastPracticedISO: lastPracticedISO ?? initialState.lastPracticedISO,
            streakDays: typeof streakDays === 'number' ? streakDays : initialState.streakDays,
            scenarioAnswers: Array.isArray(scenarioAnswers) ? scenarioAnswers : initialState.scenarioAnswers,
            todayISO: todayISO ?? initialState.todayISO,
            todayAttempts: typeof todayAttempts === 'number' ? todayAttempts : initialState.todayAttempts,
            dailyGoal: typeof dailyGoal === 'number' ? dailyGoal : initialState.dailyGoal,
            attemptLog: Array.isArray(attemptLog) ? attemptLog : initialState.attemptLog,
          })
        } catch (_e) {
          // Ongeldige import negeren
        }
      },
      resetAll: () => set({ ...initialState }),
      setDailyGoal: (goal: number) => set({ dailyGoal: Math.max(1, Math.min(200, Math.floor(goal))) }),
    }),
    { name: 'bluebadge-progress' },
  ),
)