import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
  name: string
  setName: (name: string) => void
}

export const useUserStore = create<State>()(
  persist(
    (set) => ({
      name: '',
      setName: (name) => set({ name: name.trim() }),
    }),
    { name: 'bluebadge-user' },
  ),
)