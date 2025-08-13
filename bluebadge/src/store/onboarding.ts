import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
  showHomeTips: boolean
  showWordsTips: boolean
  dismissHomeTips: () => void
  dismissWordsTips: () => void
}

export const useOnboardingStore = create<State>()(
  persist(
    (set) => ({
      showHomeTips: true,
      showWordsTips: true,
      dismissHomeTips: () => set({ showHomeTips: false }),
      dismissWordsTips: () => set({ showWordsTips: false }),
    }),
    { name: 'bluebadge-onboarding' },
  ),
)