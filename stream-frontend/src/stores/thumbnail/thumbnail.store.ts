import { create } from 'zustand';

interface ThumbnailStore {
    version: number;
    incrementVersion: () => void;
}

export const useThumbnailStore = create<ThumbnailStore>((set) => ({
    version: 1,
    incrementVersion: () => set((state) => ({ version: state.version + 1 }))
}));