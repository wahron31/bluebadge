import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'nl' | 'tr'
export type Theme = 'light' | 'dark'

type State = {
  language: Language
  theme: Theme
  setLanguage: (lang: Language) => void
  toggleTheme: () => void
}

export const useUiStore = create<State>()(
  persist(
    (set, get) => ({
      language: 'nl',
      theme: 'light',
      setLanguage: (language) => set({ language }),
      toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
    }),
    { name: 'bluebadge-ui' },
  ),
)