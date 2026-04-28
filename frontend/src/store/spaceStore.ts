import { create } from 'zustand'
import { getSpaces, createSpace, deleteSpace } from '@/lib/api'

interface Space {
  id: number
  name: string
  created_at: string
}

interface SpaceStore {
  spaces: Space[]
  activeSpaceId: number | null
  fetchSpaces: () => Promise<void>
  addSpace: (name: string) => Promise<void>
  removeSpace: (id: number) => Promise<void>
  setActiveSpace: (id: number) => void
}

export const useSpaceStore = create<SpaceStore>((set, get) => ({
  spaces: [],
  activeSpaceId: null,

  fetchSpaces: async () => {
    const { data } = await getSpaces()
    set({ spaces: data, activeSpaceId: data[0]?.id ?? null })
  },

  addSpace: async (name: string) => {
    const { data } = await createSpace(name)
    set((s) => ({ spaces: [...s.spaces, data], activeSpaceId: data.id }))
  },

  removeSpace: async (id: number) => {
    await deleteSpace(id)
    set((s) => ({ spaces: s.spaces.filter((sp) => sp.id !== id) }))
  },

  setActiveSpace: (id: number) => set({ activeSpaceId: id }),
}))
