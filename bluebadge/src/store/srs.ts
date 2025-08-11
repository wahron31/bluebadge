import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WordSrsState = {
  box: number
  dueISO: string
  lastReviewedISO?: string
}

type State = {
  byWordId: Record<string, WordSrsState>
  intervalsDays: number[]
  getState: (wordId: string) => WordSrsState
  recordResult: (wordId: string, correct: boolean, reviewDate?: Date) => void
  resetWord: (wordId: string) => void
  resetAll: () => void
}

const DEFAULT_INTERVALS = [1, 2, 4, 7, 15, 30]

function iso(d: Date) {
  return d.toISOString().slice(0, 10)
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export const useSrsStore = create<State>()(
  persist(
    (set, get) => ({
      byWordId: {},
      intervalsDays: DEFAULT_INTERVALS,
      getState: (wordId) => {
        const st = get().byWordId[wordId]
        if (st) return st
        const today = new Date()
        return { box: 0, dueISO: iso(today) }
      },
      recordResult: (wordId, correct, reviewDate) => {
        const today = reviewDate ?? new Date()
        set((state) => {
          const prev = state.byWordId[wordId] ?? { box: 0, dueISO: iso(today) }
          let nextBox = prev.box
          if (correct) nextBox = Math.min(prev.box + 1, state.intervalsDays.length - 1)
          else nextBox = 0
          const intervalDays = state.intervalsDays[nextBox] ?? state.intervalsDays[state.intervalsDays.length - 1]
          const nextDue = addDays(today, intervalDays)
          return {
            byWordId: {
              ...state.byWordId,
              [wordId]: { box: nextBox, dueISO: iso(nextDue), lastReviewedISO: iso(today) },
            },
          }
        })
      },
      resetWord: (wordId) => set((state) => ({
        byWordId: { ...state.byWordId, [wordId]: { box: 0, dueISO: iso(new Date()) } },
      })),
      resetAll: () => set({ byWordId: {} }),
    }),
    { name: 'bluebadge-srs' },
  ),
)