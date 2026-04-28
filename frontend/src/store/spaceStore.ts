import { create } from 'zustand';

const API = 'http://localhost:8000/api';

interface Space { id: number; name: string; }

interface SpaceStore {
  spaces: Space[];
  activeSpaceId: number | null;
  fetchSpaces: () => Promise<void>;
  createSpace: (name: string) => Promise<void>;
  setActiveSpace: (id: number) => void;
}

export const useSpaceStore = create<SpaceStore>((set) => ({
  spaces: [],
  activeSpaceId: null,

  fetchSpaces: async () => {
    const res = await fetch(`${API}/spaces/`);
    const spaces = await res.json();
    set({ spaces, activeSpaceId: spaces[0]?.id ?? null });
  },

  createSpace: async (name: string) => {
    await fetch(`${API}/spaces/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const res = await fetch(`${API}/spaces/`);
    const spaces = await res.json();
    set({ spaces });
  },

  setActiveSpace: (id) => set({ activeSpaceId: id }),
}));
