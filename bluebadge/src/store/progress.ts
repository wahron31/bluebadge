import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ModuleKey = 'woorden' | 'quiz' | 'scenarios'

type ModuleProgress = {
  attempted: number
  correct: number
}

type State = {
  modules: Record<ModuleKey, ModuleProgress>
  lastPracticedISO?: string
  streakDays: number
  recordAttempt: (module: ModuleKey, correct: boolean) => void
}

const initialModule: ModuleProgress = { attempted: 0, correct: 0 }

export const useProgressStore = create<State>()(
  persist(
    (set, get) => ({
      modules: {
        woorden: { ...initialModule },
        quiz: { ...initialModule },
        scenarios: { ...initialModule },
      },
      lastPracticedISO: undefined,
      streakDays: 0,
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
    }),
    { name: 'bluebadge-progress' },
  ),
)